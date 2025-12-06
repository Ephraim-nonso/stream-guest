"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Chat, useCreateChatClient } from "stream-chat-react";
import { getUser } from "@/lib/api";

interface StreamChatProviderProps {
  children: ReactNode;
}

// Stream Chat API Key - Replace with your actual API key from Stream dashboard
// Get it from: https://dashboard.getstream.io/
const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY || "";

export function StreamChatProvider({ children }: StreamChatProviderProps) {
  const { address, isConnected } = useAccount();
  const [userToken, setUserToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState(false);
  const [userName, setUserName] = useState<string>("");

  // Fetch user data from backend and generate token
  useEffect(() => {
    // Only proceed if all required values are available
    if (!isConnected || !address || !STREAM_API_KEY) {
      return;
    }

    // Normalize address to lowercase for consistency
    const normalizedAddress = address.toLowerCase();
    let isMounted = true;

    const initializeChat = async () => {
      setIsLoadingToken(true);
      setTokenError(null);

      try {
        // First, try to get user data from backend
        let displayName = `${address.slice(0, 6)}...${address.slice(-4)}`;
        try {
          const user = await getUser(address);
          if (user && user.fullName) {
            displayName = user.fullName;
          }
        } catch (err) {
          // If backend is unavailable, use default name
          console.warn("Could not fetch user data from backend:", err);
        }

        if (isMounted) {
          setUserName(displayName);
        }

        // Generate Stream Chat token
        const response = await fetch("/api/stream/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: normalizedAddress }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error("Error generating token:", error);
          console.error("Response status:", response.status);
          console.error("Full error object:", JSON.stringify(error, null, 2));
          if (isMounted) {
            setUserToken(null);
            // Show more detailed error message
            const errorMessage = error.details
              ? `${error.error || "Failed to generate token"}: ${error.details}`
              : error.error || error.details || "Failed to generate token";
            setTokenError(errorMessage);
            setIsLoadingToken(false);
          }
          return;
        }

        const data = await response.json();
        if (isMounted) {
          if (data.token) {
            setUserToken(data.token);
            setTokenError(null);
            setIsLoadingToken(false);
            
            // Update user in Stream Chat with backend data
            try {
              await fetch("/api/stream/user", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId: normalizedAddress,
                  userName: displayName,
                }),
              });
            } catch (err) {
              console.warn("Could not update Stream Chat user:", err);
            }
          } else {
            console.error("No token received from API", data);
            setUserToken(null);
            setTokenError("No token received from server");
            setIsLoadingToken(false);
          }
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        if (isMounted) {
          setUserToken(null);
          setTokenError(
            error instanceof Error ? error.message : "Network error"
          );
          setIsLoadingToken(false);
        }
      }
    };

    initializeChat();

    return () => {
      isMounted = false;
    };
  }, [isConnected, address]);

  // Normalize address to lowercase for consistency
  // Ensure it has 0x prefix for Stream Chat user ID
  let normalizedAddress = address?.toLowerCase().trim() || "";
  if (normalizedAddress && !normalizedAddress.startsWith('0x')) {
    normalizedAddress = '0x' + normalizedAddress;
  }

  // Debug logging (remove in production)
  useEffect(() => {}, [
    address,
    userToken,
    isLoadingToken,
    tokenError,
    normalizedAddress,
  ]);

  const chatClient = useCreateChatClient({
    apiKey: STREAM_API_KEY,
    tokenOrProvider: userToken || undefined,
    userData: {
      id: normalizedAddress,
      name: userName || (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""),
      // You can add more user data here
    },
  });

  if (!STREAM_API_KEY) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-sm">
          Stream Chat API key not configured. Please set
          NEXT_PUBLIC_STREAM_API_KEY in your .env file.
        </p>
      </div>
    );
  }

  if (!isConnected || !address) {
    return <>{children}</>;
  }

  if (!chatClient) {
    return (
      <div className="p-4 text-center space-y-2">
        {isLoadingToken ? (
          <>
            <p className="text-gray-600">Setting up chat connection...</p>
            <p className="text-xs text-gray-500">
              Generating authentication token...
            </p>
          </>
        ) : tokenError ? (
          <div className="space-y-2">
            <p className="text-red-600 font-medium">Chat Connection Error</p>
            <p className="text-sm text-gray-600">{tokenError}</p>
            <p className="text-xs text-gray-500 mt-2">
              Check your browser console and server logs for details.
            </p>
            <p className="text-xs text-gray-500">
              Make sure STREAM_API_SECRET is set in your .env.local file.
            </p>
          </div>
        ) : (
          <p className="text-gray-600">Setting up chat connection...</p>
        )}
      </div>
    );
  }

  return <Chat client={chatClient}>{children}</Chat>;
}
