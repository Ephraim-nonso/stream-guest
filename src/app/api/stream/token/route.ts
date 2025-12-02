import { NextRequest, NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

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
          debug: {
            hasApiKey: !!apiKey,
            hasApiSecret: !!apiSecret,
          },
        },
        { status: 500 }
      );
    }

    // Validate credentials format
    if (apiKey.length < 10 || apiSecret.length < 10) {
      return NextResponse.json(
        {
          error: "Invalid Stream API credentials",
          details:
            "API key and secret appear to be too short. Please verify your credentials.",
        },
        { status: 500 }
      );
    }

    try {
      // Initialize Stream Chat client using the constructor
      // StreamChat is a class, so we use 'new' to create an instance
      const streamClient = new StreamChat(apiKey, apiSecret);

      // Generate token for the user
      // The userId must match exactly with what's used in userData.id
      const normalizedUserId = userId.toLowerCase();
      const token = streamClient.createToken(normalizedUserId);

      return NextResponse.json({ token });
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
        error: "Failed to generate token",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
