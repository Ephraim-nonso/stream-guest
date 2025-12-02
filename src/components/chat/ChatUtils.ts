/**
 * Utility functions for Stream Chat integration
 */

/**
 * Create a channel ID for a conversation between two users
 * Uses sorted addresses to ensure consistent channel IDs
 */
export function createChannelId(address1: string, address2: string): string {
  const addresses = [address1.toLowerCase(), address2.toLowerCase()].sort();
  return `messaging-${addresses[0]}-${addresses[1]}`;
}

/**
 * Get the other participant's address from a channel
 */
export function getOtherParticipant(
  channelId: string,
  currentAddress: string
): string | null {
  const parts = channelId.split('-');
  if (parts.length < 3) return null;

  const address1 = parts[1];
  const address2 = parts[2];

  if (address1.toLowerCase() === currentAddress.toLowerCase()) {
    return address2;
  }
  if (address2.toLowerCase() === currentAddress.toLowerCase()) {
    return address1;
  }

  return null;
}

/**
 * Format wallet address for display in chat
 */
export function formatAddressForChat(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

