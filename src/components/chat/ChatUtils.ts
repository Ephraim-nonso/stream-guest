/**
 * Utility functions for Stream Chat integration
 */

/**
 * Sanitize wallet address for Stream Chat channel ID
 * Stream Chat only allows: letters, numbers, and "!-_"
 * Removes "0x" prefix and any invalid characters
 */
export function sanitizeAddressForChannel(address: string): string {
  if (!address) return "";
  
  // Remove "0x" prefix if present
  let sanitized = address.toLowerCase().replace(/^0x/, "");
  
  // Remove "..." if present (from truncated addresses)
  sanitized = sanitized.replace(/\.\.\./g, "");
  
  // Remove any characters that aren't letters, numbers, or allowed special chars
  // Stream Chat allows: letters, numbers, and "!-_"
  sanitized = sanitized.replace(/[^a-z0-9!\-_]/g, "");
  
  return sanitized;
}

/**
 * Simple hash function to create a deterministic hash from a string
 * Returns a hex-like string that fits Stream Chat requirements
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Convert to positive hex string
  return Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * Create a channel ID for a conversation between two users
 * Channel IDs must be <= 64 characters, so we create a deterministic hash
 * Uses sorted addresses to ensure consistent channel IDs
 */
export function createChannelId(address1: string, address2: string): string {
  // Normalize addresses (remove 0x, lowercase, sort)
  const addr1 = address1.toLowerCase().replace(/^0x/, "").replace(/\.\.\./g, "");
  const addr2 = address2.toLowerCase().replace(/^0x/, "").replace(/\.\.\./g, "");
  
  // Sort addresses to ensure consistent channel IDs
  const addresses = [addr1, addr2].sort();
  
  // Combine addresses for hashing
  const combined = addresses[0] + addresses[1];
  
  // Create a deterministic hash
  // Use first 8 chars of each address + hash of combined = 8 + 8 + 8 = 24 chars
  // This ensures uniqueness while staying well under 64 char limit
  const prefix1 = addresses[0].substring(0, 8);
  const prefix2 = addresses[1].substring(0, 8);
  const hash = simpleHash(combined).substring(0, 8);
  
  // "messaging-" is 10 chars, so we have 54 chars for the ID
  // Using 24 chars (8+8+8) leaves plenty of room
  const channelId = `${prefix1}${prefix2}${hash}`;
  
  return `messaging-${channelId}`;
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

