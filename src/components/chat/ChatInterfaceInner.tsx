"use client";

import { useEffect, useState, useMemo } from "react";
import { useAccount } from "wagmi";
import { useSearchParams } from "next/navigation";
import {
  Channel,
  ChannelList,
  MessageInput,
  MessageList,
  Thread,
  Window,
  useChatContext,
} from "stream-chat-react";
import type {
  ChannelFilters,
  ChannelSort,
  Channel as StreamChannel,
} from "stream-chat";
import { UnreadCountTracker } from "./UnreadCountContext";
import { CustomChannelPreview } from "./CustomChannelPreview";
import { CustomMessage } from "./CustomMessage";
import { CustomChannelHeader } from "./CustomChannelHeader";
import { CustomMessageInput } from "./CustomMessageInput";

interface ChatInterfaceInnerProps {
  expertAddress?: string;
  clientAddress?: string;
}

export function ChatInterfaceInner({
  expertAddress,
  clientAddress,
}: ChatInterfaceInnerProps) {
  const { address } = useAccount();
  const { client } = useChatContext();
  const searchParams = useSearchParams();
  const [activeChannel, setActiveChannel] = useState<StreamChannel | null>(
    null
  );
  const [hasInitialized, setHasInitialized] = useState(false);

  // Compute filters based on props and address
  // Normalize address to ensure consistent filtering
  const normalizedAddress = address ? address.toLowerCase().trim() : "";
  const normalizedExpertAddress = expertAddress
    ? expertAddress.toLowerCase().trim()
    : "";
  const normalizedClientAddress = clientAddress
    ? clientAddress.toLowerCase().trim()
    : "";

  const filters: ChannelFilters = useMemo(() => {
    if (normalizedExpertAddress && normalizedClientAddress) {
      // Filter for specific channel between expert and client
      return {
        type: "messaging",
        members: { $in: [normalizedExpertAddress, normalizedClientAddress] },
      };
    } else if (normalizedAddress) {
      // Filter for all channels where current user is a member
      // This is the key filter - it shows all channels the user is part of
      return {
        type: "messaging",
        members: { $in: [normalizedAddress] },
      };
    }
    return {
      type: "messaging",
      members: { $in: [normalizedAddress || ""] },
    };
  }, [normalizedExpertAddress, normalizedClientAddress, normalizedAddress]);

  const sort: ChannelSort = { last_message_at: -1 };

  // Check for channel ID in URL params and open that channel
  useEffect(() => {
    if (!client || !address || hasInitialized) {
      return;
    }

    const channelIdParam = searchParams?.get("channel");

    // Use setTimeout to avoid synchronous setState in effect
    if (!channelIdParam) {
      setTimeout(() => setHasInitialized(true), 0);
      return;
    }

    // The channelId format from createChannelId is: "messaging-{hash}"
    // We need to split it to get the type and the actual ID
    const parts = channelIdParam.split("-");
    if (parts.length >= 2) {
      const channelType = parts[0]; // "messaging"
      const actualChannelId = parts.slice(1).join("-"); // "{hash}"

      // Get or create the channel
      const channel = client.channel(channelType, actualChannelId);

      // Watch the channel with presence enabled
      channel
        .watch({
          presence: true,
          state: true,
        })
        .then(() => {
          setActiveChannel(channel);
          setTimeout(() => setHasInitialized(true), 0);
        })
        .catch((error) => {
          console.error("Error watching channel:", error);
          setTimeout(() => setHasInitialized(true), 0);
        });
    } else {
      setTimeout(() => setHasInitialized(true), 0);
    }
  }, [client, address, searchParams, hasInitialized]);

  // Listen for channel selection from ChannelList
  useEffect(() => {
    if (!client) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChannelSelected = (event: any) => {
      if (event?.channel) {
        setActiveChannel(event.channel);
      }
    };

    // Stream Chat's ChannelList component emits events when channels are selected
    // We listen for channel changes
    client.on("channel.updated", handleChannelSelected);
    client.on("channel.visible", handleChannelSelected);

    return () => {
      client.off("channel.updated", handleChannelSelected);
      client.off("channel.visible", handleChannelSelected);
    };
  }, [client]);

  if (!client) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm text-center">
        <div className="py-12">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-[#1a1a2e] mb-2">
            Chat Not Available
          </h3>
          <p className="text-gray-600 mb-4">
            Please configure Stream Chat API key to enable messaging.
          </p>
          <p className="text-sm text-gray-500">
            Add NEXT_PUBLIC_STREAM_API_KEY to your .env file
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <UnreadCountTracker />
      <div className="flex flex-col md:flex-row h-[calc(100vh-200px)] min-h-[600px] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Channel List Sidebar */}
        <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-gray-200 flex-shrink-0 bg-white">
          <div className="p-4 sm:p-5 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#1a1a2e]">Messages</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Your conversations
                </p>
              </div>
            </div>
          </div>
          <div className="h-[calc(100%-80px)] overflow-y-auto bg-white">
            <ChannelList
              filters={filters}
              sort={sort}
              options={{
                state: true,
                watch: true,
                presence: true,
                limit: 100,
              }}
              Preview={(previewProps) => (
                <CustomChannelPreview
                  {...previewProps}
                  setActiveChannel={(newChannel) =>
                    setActiveChannel(newChannel || null)
                  }
                  activeChannel={activeChannel || undefined}
                />
              )}
            />
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col min-h-0 bg-gray-50 overflow-hidden">
          <Channel channel={activeChannel || undefined}>
            <Window>
              <CustomChannelHeader />
              <div
                className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6 relative"
                style={{
                  minHeight: 0,
                  maxHeight: "100%",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
              >
                <MessageList Message={CustomMessage} />
              </div>
              <div
                className="flex-shrink-0 relative z-10 bg-white"
                style={{
                  position: "sticky",
                  bottom: 0,
                  width: "100%",
                }}
              >
                <MessageInput
                  Input={CustomMessageInput}
                  additionalTextareaProps={{
                    placeholder: "Type your message...",
                  }}
                />
              </div>
            </Window>
            <Thread />
          </Channel>
        </div>
      </div>
    </>
  );
}
