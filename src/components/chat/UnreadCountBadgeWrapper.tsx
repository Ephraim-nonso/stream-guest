'use client';

import { useUnreadCount } from './UnreadCountContext';

/**
 * Badge component that displays unread message count
 * Works both inside and outside Chat context (uses context if available)
 */
export function UnreadCountBadgeWrapper() {
  const { unreadCount } = useUnreadCount();

  if (unreadCount === 0) return null;

  return (
    <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-orange-500 rounded-full">
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  );
}

