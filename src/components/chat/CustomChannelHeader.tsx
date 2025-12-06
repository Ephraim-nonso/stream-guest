'use client';

import { useChannelStateContext, useChatContext } from 'stream-chat-react';
import type { UserResponse } from 'stream-chat';

export function CustomChannelHeader() {
  const { channel } = useChannelStateContext();
  const { client } = useChatContext();

  // Get the other member (not the current user)
  const members = Object.values(channel.state?.members || {});
  const otherMember = members.find(
    (member) => member.user?.id !== client?.userID
  )?.user as UserResponse | undefined;

  const isOnline = otherMember?.presence?.status === 'online';
  const displayName = otherMember?.name || otherMember?.id || 'Unknown';

  // Get initials from name
  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(displayName);

  return (
    <div
      style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          position: 'relative',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        >
          {initials}
        </div>
        {/* Online Status */}
        {isOnline && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '0.5rem',
              height: '0.5rem',
              background: '#10B981',
              border: '2px solid white',
              borderRadius: '50%',
              zIndex: 10,
            }}
          />
        )}
      </div>

      {/* Name and Status */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
        }}
      >
        <div
          style={{
            fontWeight: 600,
            color: '#1a1a2e',
            fontSize: '1rem',
            lineHeight: 1.4,
          }}
        >
          {displayName}
        </div>
        <div
          style={{
            color: '#6b7280',
            fontSize: '0.8125rem',
            lineHeight: 1.4,
          }}
        >
          {isOnline ? 'Online' : 'Offline'}
        </div>
      </div>
    </div>
  );
}

