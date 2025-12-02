'use client';

import { useChatContext } from 'stream-chat-react';
import { useAccount } from 'wagmi';
import { createChannelId } from './ChatUtils';
import { useRouter } from 'next/navigation';

/**
 * Hook to create or get a channel between two users
 */
export function useCreateChannel() {
  const { client } = useChatContext();
  const { address } = useAccount();
  const router = useRouter();

  const createOrGetChannel = async (otherAddress: string) => {
    if (!client || !address) {
      console.error('Chat client or address not available');
      return null;
    }

    try {
      const channelId = createChannelId(address, otherAddress);
      const channelType = 'messaging';

      // Try to get existing channel or create new one
      const channel = client.channel(channelType, channelId, {
        members: [address.toLowerCase(), otherAddress.toLowerCase()],
      });

      // Watch the channel to ensure it's active
      await channel.watch();

      return channel;
    } catch (error) {
      console.error('Error creating/getting channel:', error);
      return null;
    }
  };

  const navigateToChat = (otherAddress: string) => {
    // Navigate to chats tab - the chat interface will show the channel
    if (address) {
      router.push(`/${address}/dashboard/chats`);
    }
  };

  return {
    createOrGetChannel,
    navigateToChat,
  };
}

