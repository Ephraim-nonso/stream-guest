# Stream Chat Integration

This folder contains the Stream Chat integration for enabling real-time messaging between clients and experts.

## Setup Instructions

### 1. Get Stream Chat API Key

1. Sign up for a free account at [https://getstream.io](https://getstream.io)
2. Create a new app in the Stream dashboard
3. Copy your API Key from the dashboard

### 2. Configure Environment Variables

Create a `.env.local` file in the root of your project (if it doesn't exist) and add:

```env
# Stream Chat API Key (public - safe to expose in frontend)
NEXT_PUBLIC_STREAM_API_KEY=your_api_key_here

# Stream Chat API Secret (private - only used on server side)
# Get this from your Stream dashboard
STREAM_API_SECRET=your_api_secret_here
```

**Important**:

- `NEXT_PUBLIC_STREAM_API_KEY` is used in the frontend
- `STREAM_API_SECRET` is used ONLY in the API route (`/api/stream/token`) and should NEVER be exposed to the frontend

### 3. Token Generation

✅ **Token generation is already implemented!**

The app includes a Next.js API route at `/api/stream/token` that generates tokens securely on the server side. The `StreamChatProvider` automatically fetches tokens from this endpoint.

**How it works:**

1. User connects wallet
2. Frontend requests token from `/api/stream/token` with the wallet address
3. Backend generates a valid Stream token using the API secret
4. Token is returned and used to authenticate with Stream Chat

**No additional setup needed** - just make sure you have both `NEXT_PUBLIC_STREAM_API_KEY` and `STREAM_API_SECRET` in your `.env.local` file.

## Components

### StreamChatProvider

Wraps the app and initializes the Stream Chat client. Must be added to the root layout.

### ChatInterface

Main chat UI component that displays:

- Channel list (all conversations)
- Active channel messages
- Message input
- Thread view

### ChatUtils

Utility functions for:

- Creating channel IDs
- Formatting addresses
- Managing channel participants

## Usage

### For Clients

1. Browse experts on the "Browse Experts" page
2. Click "Connect & Message" on an expert
3. Navigate to the "Chats" tab to see the conversation

### For Experts

1. Go to the "Chats" tab
2. See all conversations with clients
3. Click on a conversation to view and reply

## Features

- ✅ Real-time messaging
- ✅ Channel list with all conversations
- ✅ Message threads
- ✅ Mobile-responsive design
- ✅ Integration with wallet addresses as user IDs

## Next Steps

1. **Backend Integration**: Implement token generation endpoint
2. **User Profiles**: Store expert/client wallet addresses in your database
3. **Channel Management**: Add ability to create channels programmatically
4. **Notifications**: Set up push notifications for new messages
5. **Message History**: Configure message retention policies

## Documentation

- [Stream Chat React Tutorial](https://getstream.io/chat/react-chat/tutorial/)
- [Stream Chat API Docs](https://getstream.io/chat/docs/)
- [Token Generation Guide](https://getstream.io/chat/docs/node/tokens_and_authentication/)
