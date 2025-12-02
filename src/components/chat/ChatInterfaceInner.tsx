"use client";

import { useEffect, useState, useMemo } from "react";
import { useAccount } from "wagmi";
import { useSearchParams } from "next/navigation";
import {
  Channel,
  ChannelHeader,
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

  // Compute filters based on props and address
  const filters: ChannelFilters = useMemo(() => {
    if (expertAddress && clientAddress) {
      return {
        type: "messaging",
        members: { $in: [expertAddress, clientAddress] },
      };
    } else if (address) {
      return {
        type: "messaging",
        members: { $in: [address] },
      };
    }
    return {
      type: "messaging",
      members: { $in: [address || ""] },
    };
  }, [expertAddress, clientAddress, address]);

  const sort: ChannelSort = { last_message_at: -1 };

  // Check for channel ID in URL params and open that channel
  useEffect(() => {
    if (!client || !address) {
      return;
    }

    const channelIdParam = searchParams?.get("channel");
    if (!channelIdParam) {
      return;
    }

    // The channelId format from createChannelId is: "messaging-address1-address2"
    // We need to split it to get the type and the actual ID
    const parts = channelIdParam.split("-");
    if (parts.length >= 3) {
      const channelType = parts[0]; // "messaging"
      const actualChannelId = parts.slice(1).join("-"); // "address1-address2"

      // Get or create the channel
      const channel = client.channel(channelType, actualChannelId);

      // Watch the channel asynchronously to ensure it exists
      channel
        .watch()
        .then(() => {
          setActiveChannel(channel);
        })
        .catch((error) => {
          console.error("Error watching channel:", error);
        });
    }
  }, [client, address, searchParams]);

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
    <div className="flex flex-col md:flex-row h-[calc(100vh-300px)] min-h-[500px] sm:min-h-[600px] bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Channel List Sidebar */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-gray-200 flex-shrink-0 h-64 md:h-auto">
        <div className="p-3 sm:p-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-[#1a1a2e]">
            Messages
          </h2>
        </div>
        <div className="h-[calc(100%-60px)] overflow-y-auto">
          <ChannelList filters={filters} sort={sort} />
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col min-h-0">
        <Channel channel={activeChannel || undefined}>
          <Window>
            <ChannelHeader />
            <div className="flex-1 overflow-y-auto">
              <MessageList />
            </div>
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </div>
    </div>
  );
}
