"use client";

import { useEffect, useState } from "react";
import { useChannelStateContext, useChatContext } from "stream-chat-react";
import type { UserResponse } from "stream-chat";

export function CustomChannelHeader() {
  const { channel } = useChannelStateContext();
  const { client } = useChatContext();
  const [isOnline, setIsOnline] = useState(false);

  // Get the other member (not the current user) - presence is on the member object, not the user
  const members = Object.values(channel.state?.members || {});
  const otherMemberData = members.find(
    (member) => member.user?.id !== client?.userID
  );
  const otherMember = otherMemberData?.user as UserResponse | undefined;

  const displayName = otherMember?.name || otherMember?.id || "Unknown";

  // Check presence status - use Stream Chat's built-in presence system
  useEffect(() => {
    if (!otherMember?.id || !client) {
      return;
    }

    // Check initial presence from member's user object
    const checkPresence = () => {
      // Check member's user.online property (Stream Chat provides this directly)
      // Use otherMemberData if available, otherwise look it up
      const member =
        otherMemberData || channel.state?.members?.[otherMember.id];
      console.log(otherMemberData);
      console.log(channel.state?.members);
      if (member?.user?.online === true) {
        setIsOnline(true);
        return;
      }

      setIsOnline(false);
    };

    // Initial check with a small delay to allow presence to load
    const timeoutId = setTimeout(checkPresence, 100);

    // Listen for presence updates
    const handlePresenceChange = (event: {
      user?: { id?: string; online?: boolean };
    }) => {
      if (event?.user?.id === otherMember.id) {
        setIsOnline(event.user.online === true);
      }
    };

    // Listen for channel member updates (which include online status)
    const handleMemberUpdated = (event?: {
      member?: { user_id?: string; user?: { online?: boolean } };
    }) => {
      if (event?.member?.user_id === otherMember.id) {
        setIsOnline(event.member.user?.online === true);
      } else {
        checkPresence();
      }
    };

    // // Listen for user presence updates
    // client.on("presence.changed", handlePresenceChange);
    // client.on("user.presence.changed", handlePresenceChange);
    channel.on("member.updated", handleMemberUpdated);
    channel.on("member.added", handleMemberUpdated);

    return () => {
      clearTimeout(timeoutId);
      client.off("presence.changed", handlePresenceChange);
      client.off("user.presence.changed", handlePresenceChange);
      channel.off("member.updated", handleMemberUpdated);
      channel.off("member.added", handleMemberUpdated);
    };
  }, [otherMember?.id, otherMember, otherMemberData, client, channel]);

  // Get initials from name
  const getInitials = (name: string) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(displayName);

  return (
    <div
      style={{
        background: "white",
        borderBottom: "1px solid #e5e7eb",
        padding: "1rem 1.25rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          position: "relative",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: "2.5rem",
            height: "2.5rem",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
        >
          {initials}
        </div>
        {/* Online Status */}
        {isOnline && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "0.5rem",
              height: "0.5rem",
              background: "#10B981",
              border: "2px solid white",
              borderRadius: "50%",
              zIndex: 10,
            }}
          />
        )}
      </div>

      {/* Name and Status */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
        }}
      >
        <div
          style={{
            fontWeight: 600,
            color: "#1a1a2e",
            fontSize: "1rem",
            lineHeight: 1.4,
          }}
        >
          {displayName}
        </div>
        <div
          style={{
            color: "#6b7280",
            fontSize: "0.8125rem",
            lineHeight: 1.4,
          }}
        >
          {isOnline ? "Online" : "Offline"}
        </div>
      </div>
    </div>
  );
}
