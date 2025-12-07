'use client';

import { useChannelPreviewInfo, useChatContext, ChannelPreviewUIComponentProps } from 'stream-chat-react';
import type { Channel, UserResponse } from 'stream-chat';
import { formatDistanceToNow } from 'date-fns';

interface CustomChannelPreviewProps extends ChannelPreviewUIComponentProps {
  // Additional props can be added here if needed
}

export function CustomChannelPreview(props: CustomChannelPreviewProps) {
  const { channel } = props;
  const { client } = useChatContext();
  const { displayTitle, displayImage } = useChannelPreviewInfo({ channel });
  const isActive = props.activeChannel?.id === channel.id;
  
  // Get the other member (not the current user)
  const members = Object.values(channel.state?.members || {});
  const otherMember = members.find(
    (member) => member.user?.id !== client?.userID
  )?.user as UserResponse | undefined;

  const lastMessage = channel.state?.messages?.[channel.state.messages.length - 1];
  const unreadCount = channel.countUnread();
  // Check online status from member data, not user response
  const member = members.find((m) => m.user?.id === otherMember?.id);
  const isOnline = member?.user?.online === true;

  // Get initials from name
  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const displayName = displayTitle || otherMember?.name || otherMember?.id || 'Unknown';
  const initials = getInitials(displayName);

  return (
    <div
      onClick={() => {
        if (props.setActiveChannel) {
          props.setActiveChannel(channel);
        }
      }}
      className={`str-chat__channel-preview-custom ${
        isActive ? 'active' : ''
      }`}
      style={{
        borderBottom: '1px solid #f3f4f6',
        padding: '0.875rem 1rem',
        cursor: 'pointer',
        position: 'relative',
        background: isActive ? '#EFF6FF' : 'white',
        borderLeft: isActive ? '4px solid #3B82F6' : 'none',
        paddingLeft: isActive ? 'calc(1rem - 4px)' : '1rem',
        transition: 'all 0.15s ease',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = '#f9fafb';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'white';
        }
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          position: 'relative',
          width: '100%',
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
                width: '0.75rem',
                height: '0.75rem',
                background: '#10B981',
                border: '2px solid white',
                borderRadius: '50%',
                zIndex: 10,
              }}
            />
          )}
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            paddingRight: unreadCount > 0 ? '2.5rem' : '0',
          }}
        >
          <div
            style={{
              fontWeight: 600,
              color: '#1a1a2e',
              fontSize: '0.9375rem',
              lineHeight: 1.4,
            }}
          >
            {displayName}
          </div>
          {lastMessage && (
            <div
              style={{
                color: '#6b7280',
                fontSize: '0.8125rem',
                lineHeight: 1.4,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {lastMessage.text || 'Media'}
            </div>
          )}
          {lastMessage?.created_at && (
            <div
              style={{
                color: '#9ca3af',
                fontSize: '0.75rem',
                marginTop: '0.125rem',
              }}
            >
              {(() => {
                const date = new Date(lastMessage.created_at);
                const now = new Date();
                const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
                
                if (diffInHours < 24 && date.getDate() === now.getDate()) {
                  return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
                } else if (diffInHours < 48 && date.getDate() === now.getDate() - 1) {
                  return 'Yesterday';
                } else if (diffInHours < 168) {
                  return date.toLocaleDateString('en-US', { weekday: 'long' });
                } else {
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }
              })()}
            </div>
          )}
        </div>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '0.875rem',
              right: '1rem',
              background: '#EF4444',
              color: 'white',
              borderRadius: '50%',
              width: '1.25rem',
              height: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.625rem',
              fontWeight: 700,
              zIndex: 5,
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </div>
    </div>
  );
}

