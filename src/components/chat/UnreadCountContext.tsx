'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useChatContext } from 'stream-chat-react';
import type { Channel as StreamChannel } from 'stream-chat';

interface UnreadCountContextType {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

// Create context with default values
const UnreadCountContext = createContext<UnreadCountContextType>({ 
  unreadCount: 0,
  setUnreadCount: () => {},
});

/**
 * Global provider for unread count - can be used anywhere
 */
export function UnreadCountProvider({ children }: { children: ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <UnreadCountContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </UnreadCountContext.Provider>
  );
}

/**
 * Hook to access unread count from anywhere
 */
export function useUnreadCount() {
  return useContext(UnreadCountContext);
}

/**
 * Component that tracks unread counts from Chat context and updates global state
 * Must be used inside Chat context
 */
export function UnreadCountTracker() {
  const { client } = useChatContext();
  const { setUnreadCount } = useUnreadCount();

  useEffect(() => {
    if (!client) return;

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

    calculateUnreadCount();

    const handleEvent = () => {
      calculateUnreadCount();
    };

    client.on('message.new', handleEvent);
    client.on('message.read', handleEvent);
    client.on('notification.message_new', handleEvent);
    client.on('channel.updated', handleEvent);

    const interval = setInterval(calculateUnreadCount, 2000);

    return () => {
      client.off('message.new', handleEvent);
      client.off('message.read', handleEvent);
      client.off('notification.message_new', handleEvent);
      client.off('channel.updated', handleEvent);
      clearInterval(interval);
    };
  }, [client, setUnreadCount]);

  return null; // This component doesn't render anything
}

