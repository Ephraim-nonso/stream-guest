import { NextRequest, NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

/**
 * API endpoint to create or update a Stream Chat user
 * This is needed when creating channels with users who haven't connected yet
 * Now fetches user data from backend to set proper names
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, userName } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const apiKey =
      process.env.NEXT_PUBLIC_STREAM_API_KEY || process.env.STREAM_API_KEY;
    const apiSecret = process.env.STREAM_API_SECRET;

    if (!apiKey || !apiSecret) {
      return NextResponse.json(
        {
          error: "Stream API credentials not configured",
          details:
            "Please set NEXT_PUBLIC_STREAM_API_KEY and STREAM_API_SECRET in your .env.local file",
        },
        { status: 500 }
      );
    }

    try {
      // Initialize Stream Chat client with server-side credentials
      const streamClient = new StreamChat(apiKey, apiSecret);

      // Normalize user ID - ensure consistent format
      let normalizedUserId = userId.toLowerCase().trim();
      // Ensure it has 0x prefix if it's an address
      if (normalizedUserId && !normalizedUserId.startsWith('0x') && normalizedUserId.length >= 40) {
        normalizedUserId = '0x' + normalizedUserId;
      }

      // Try to fetch user data from backend if userName not provided
      let displayName = userName;
      if (!displayName) {
        try {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
          const userResponse = await fetch(`${backendUrl}/api/users/${normalizedUserId}`);
          if (userResponse.ok) {
            const { user } = await userResponse.json();
            displayName = user?.fullName || normalizedUserId.slice(0, 6) + "..." + normalizedUserId.slice(-4);
          } else {
            displayName = normalizedUserId.slice(0, 6) + "..." + normalizedUserId.slice(-4);
          }
        } catch (err) {
          // If backend is unavailable, use default
          displayName = normalizedUserId.slice(0, 6) + "..." + normalizedUserId.slice(-4);
        }
      }

      // Upsert (create or update) the user
      // This ensures the user exists in Stream Chat before they can be added to channels
      await streamClient.upsertUser({
        id: normalizedUserId,
        name: displayName,
        // You can add more user properties here if needed
      });

      return NextResponse.json({ 
        success: true,
        userId: normalizedUserId 
      });
    } catch (streamError) {
      return NextResponse.json(
        {
          error: "Stream SDK error",
          details:
            streamError instanceof Error
              ? streamError.message
              : "Unknown Stream error",
          stack: streamError instanceof Error ? streamError.stack : undefined,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create user",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}



