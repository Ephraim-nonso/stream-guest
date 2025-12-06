'use client';

import {
  TextareaComposer,
  useMessageInputContext,
} from 'stream-chat-react';

/**
 * Custom MessageInput component following Stream Chat's recommended pattern
 * This gives us full control over the UI without CSS workarounds
 * Reference: https://getstream.io/chat/docs/sdk/react/guides/theming/input_ui/
 * 
 * Design: Only text input and send button (no file attachment button)
 */
export function CustomMessageInput() {
  const { handleSubmit } = useMessageInputContext();

  return (
    <div
      className="str-chat__message-input-custom"
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1rem 1.25rem',
        backgroundColor: 'white',
        borderTop: '1px solid #e5e7eb',
      }}
    >
      {/* Text Input - Takes full width except for send button */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <TextareaComposer />
      </div>

      {/* Send Button - Circular Orange Button */}
      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <button
          type="submit"
          onClick={handleSubmit}
          style={{
            background: '#F97316',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '2.5rem',
            height: '2.5rem',
            minWidth: '2.5rem',
            minHeight: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            padding: 0,
            margin: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#EA580C';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#F97316';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </div>
  );
}

