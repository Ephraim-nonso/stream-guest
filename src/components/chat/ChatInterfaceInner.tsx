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

    // The channelId format from createChannelId is: "messaging-{hash}"
    // We need to split it to get the type and the actual ID
    const parts = channelIdParam.split("-");
    if (parts.length >= 2) {
      const channelType = parts[0]; // "messaging"
      const actualChannelId = parts.slice(1).join("-"); // "{hash}"

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
    <div className="flex flex-col md:flex-row h-[calc(100vh-200px)] min-h-[600px] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Channel List Sidebar */}
      <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-gray-200 flex-shrink-0 bg-white">
        <div className="p-4 sm:p-5 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
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
              <p className="text-xs text-gray-500 mt-0.5">Your conversations</p>
            </div>
          </div>
        </div>
        <div className="h-[calc(100%-80px)] overflow-y-auto bg-white">
          <ChannelList
            filters={filters}
            sort={sort}
            options={{ state: true, watch: true, presence: true }}
          />
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col min-h-0 bg-gray-50">
        <Channel channel={activeChannel || undefined}>
          <Window>
            <div className="bg-white border-b border-gray-200 shadow-sm">
              <ChannelHeader />
            </div>
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6 relative">
              <MessageList />
            </div>
            <div className="bg-white border-t border-gray-200 shadow-lg">
              <style
                dangerouslySetInnerHTML={{
                  __html: `
                  .str-chat__message-input {
                    display: flex !important;
                    flex-direction: row !important;
                    align-items: center !important;
                    gap: 0.75rem !important;
                  }
                  .str-chat__message-input form {
                    display: flex !important;
                    flex-direction: row !important;
                    align-items: center !important;
                    width: 100% !important;
                    gap: 0.75rem !important;
                    flex-wrap: nowrap !important;
                  }
                  .str-chat__message-input textarea {
                    flex: 1 1 0% !important;
                    flex-grow: 1 !important;
                    min-width: 300px !important;
                    width: auto !important;
                    max-width: none !important;
                  }
                  .str-chat__message-input form > div:not(:last-child),
                  .str-chat__message-input form > div:first-of-type,
                  .str-chat__message-input form > div:nth-child(2) {
                    flex: 1 1 0% !important;
                    flex-grow: 1 !important;
                    min-width: 300px !important;
                    width: auto !important;
                    max-width: none !important;
                    display: flex !important;
                    flex-direction: row !important;
                  }
                  .str-chat__message-input button {
                    flex: 0 0 auto !important;
                    flex-shrink: 0 !important;
                    flex-grow: 0 !important;
                  }
                `,
                }}
              />
              <MessageInput />
            </div>
          </Window>
          <Thread />
        </Channel>
      </div>
    </div>
  );
}
