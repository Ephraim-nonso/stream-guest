'use client';

import { useEffect, useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import type { Channel as StreamChannel } from 'stream-chat';

/**
 * Component that tracks unread message count across all channels
 * and displays it as a badge
 * 
 * Must be used within Chat context (inside <Chat> component)
 */
export function UnreadCountBadge() {
  const { client } = useChatContext();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!client) return;

    // Function to calculate total unread count
    const calculateUnreadCount = () => {
      try {
        const channels = client.activeChannels || {};
        let totalUnread = 0;

        Object.values(channels).forEach((channel: StreamChannel) => {
          if (channel && typeof channel.countUnread === 'function') {
            const unread = channel.countUnread();
            if (unread > 0) {
              totalUnread += unread;
            }
          }
        });

        setUnreadCount(totalUnread);
      } catch (error) {
        console.debug('Error calculating unread count:', error);
      }
    };

    // Calculate initial count
    calculateUnreadCount();

    // Listen for new messages
    const handleEvent = () => {
      calculateUnreadCount();
    };

    // Subscribe to message events
    client.on('message.new', handleEvent);
    client.on('message.read', handleEvent);
    client.on('notification.message_new', handleEvent);
    client.on('channel.updated', handleEvent);

    // Also check periodically for reliability
    const interval = setInterval(calculateUnreadCount, 2000);

    return () => {
      client.off('message.new', handleEvent);
      client.off('message.read', handleEvent);
      client.off('notification.message_new', handleEvent);
      client.off('channel.updated', handleEvent);
      clearInterval(interval);
    };
  }, [client]);

  if (unreadCount === 0) return null;

  return (
    <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-orange-500 rounded-full">
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  );
}

