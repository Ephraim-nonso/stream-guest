'use client';

import { useMessageContext, useChatContext } from 'stream-chat-react';
import type { UserResponse } from 'stream-chat';
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';

export function CustomMessage() {
  const { message, isMyMessage } = useMessageContext();
  const { client } = useChatContext();

  const user = message.user as UserResponse | undefined;
  const isOutgoing = isMyMessage();

  // Get initials from name
  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const displayName = user?.name || user?.id || 'Unknown';
  const initials = getInitials(displayName);

  // Format timestamp
  const formatTimestamp = (date: Date) => {
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, yyyy h:mm a');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        marginBottom: '1rem',
        flexDirection: isOutgoing ? 'row-reverse' : 'row',
        maxWidth: '70%',
        marginLeft: isOutgoing ? 'auto' : '0',
        width: '100%',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: '2rem',
          height: '2rem',
          borderRadius: '50%',
          background: isOutgoing
            ? 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)'
            : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 600,
          fontSize: '0.625rem',
          flexShrink: 0,
        }}
      >
        {initials}
      </div>

      {/* Message Bubble */}
      <div
        style={{
          background: isOutgoing ? '#F97316' : '#E5E7EB',
          color: isOutgoing ? 'white' : '#1a1a2e',
          padding: '0.75rem 1rem',
          borderRadius: '0.75rem',
          boxShadow: isOutgoing ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',
          position: 'relative',
          flex: 1,
          minWidth: 0,
        }}
      >
        <div
          style={{
            fontSize: '0.9375rem',
            lineHeight: 1.5,
            wordWrap: 'break-word',
            margin: 0,
            padding: 0,
            color: isOutgoing ? 'white' : '#1a1a2e',
          }}
        >
          {message.text}
        </div>
        {message.created_at && (
          <div
            style={{
              fontSize: '0.75rem',
              color: isOutgoing ? 'rgba(255, 255, 255, 0.8)' : '#6b7280',
              marginTop: '0.5rem',
              display: 'block',
            }}
          >
            {formatTimestamp(new Date(message.created_at))}
          </div>
        )}
      </div>
    </div>
  );
}

