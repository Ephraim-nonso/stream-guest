'use client';

import { ChatInterfaceInner } from './ChatInterfaceInner';

interface ChatInterfaceProps {
  // Optional: Filter to show only channels with specific members
  expertAddress?: string;
  clientAddress?: string;
}

/**
 * ChatInterface wrapper component
 * This component ensures useChatContext is only called within the Chat provider
 */
export function ChatInterface(props: ChatInterfaceProps) {
  return <ChatInterfaceInner {...props} />;
}
