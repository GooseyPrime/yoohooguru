# Agora.io Video Conferencing Integration

This document explains the Agora.io video conferencing integration in the yoohoo.guru platform.

> **📋 Migration Note**: The frontend components have been migrated to `apps/main/components/`. See [AGORA_MIGRATION.md](./AGORA_MIGRATION.md) for details about the migration from the archived frontend structure.

## Overview

The platform uses [Agora.io](https://www.agora.io/) for secure, scalable video conferencing between users during skill-sharing sessions. The integration includes:

- **Backend**: Token generation service for secure channel access
- **Frontend**: React components using Agora RTC SDK
- **Fallback**: Legacy WebRTC implementation when Agora is not configured

## Architecture

### Backend (Express API)

**Location**: `backend/src/routes/agora.js`

The backend provides two endpoints:

1. **POST /api/v1/agora/token** - Generate RTC token
   - Parameters: `channel` (session ID), `uid` (user ID), `role` ('publisher' or 'subscriber')
   - Returns: Token with 1-hour expiration, app ID, and metadata
   - Authentication: Requires valid session/JWT token

2. **GET /api/v1/agora/status** - Check configuration status
   - Returns: Configuration status and available features

**Security Features**:
- Tokens expire after 1 hour
- Tokens are scoped to specific channels and user IDs
- Role-based access control (publisher vs subscriber)
- Secure credential storage via environment variables

### Frontend (Next.js/TypeScript)

**Location**: `apps/main/components/`

Three components work together:

1. **VideoChat.js** - Smart wrapper component
   - Auto-detects Agora configuration
   - Routes to `AgoraVideoChat` if configured
   - Falls back to `LegacyVideoChat` if not configured

2. **AgoraVideoChat.js** - Full Agora implementation
   - Fetches token from backend
   - Joins Agora channel
   - Publishes local audio/video
   - Subscribes to remote participants
   - Handles connection state changes
   - Features: mute, video off, end call, captions (planned)

3. **LegacyVideoChat.js** - Fallback implementation
   - Basic WebRTC without signaling
   - Used only when Agora is not configured
   - Shows warning banner to admin

## Setup Instructions

### 1. Get Agora Credentials

1. Create an account at [Agora Console](https://console.agora.io)
2. Create a new project
3. Enable "App ID + Token" authentication (not "App ID only")
4. Get your App ID and Primary Certificate from project settings

### 2. Configure Backend

Add to `backend/.env` or Railway environment variables:

```env
# Required
AGORA_APP_ID=your_app_id_here
AGORA_APP_CERTIFICATE=your_primary_certificate_here
AGORA_REGION=us

# Optional (for advanced features)
AGORA_REST_KEY=your_restful_key
AGORA_REST_SECRET=your_restful_secret
AGORA_CHAT_APP_KEY=your_chat_app_key
AGORA_CHAT_ORG_NAME=your_chat_org_name
AGORA_CHAT_APP_NAME=your_chat_app_name
```

### 3. Configure Frontend

Add to `.env.shared` (for all Next.js apps):

```env
NEXT_PUBLIC_AGORA_APP_ID=your_app_id_here
NEXT_PUBLIC_AGORA_REGION=us
```

### 4. Deploy

Restart your backend and frontend services after updating environment variables.

## Usage

### In Your Code

```tsx
import VideoChat from '@/components/VideoChat';

function SessionPage({ session, currentUser }) {
  return (
    <VideoChat
      sessionId={session.id}
      userId={currentUser.uid}
      onEnd={() => {
        // Handle call end
        console.log('Call ended');
      }}
      apiUrl={process.env.NEXT_PUBLIC_API_URL || '/api/v1'}
    />
  );
}
```

For a complete example, see `apps/main/pages/_apps/coach/session/[id].tsx`.

The component automatically handles:
- Token fetching
- Channel joining
- Media device access
- Publishing local streams
- Subscribing to remote streams
- Connection state management

### User Flow

1. User initiates a video session
2. Frontend checks if Agora is configured
3. If configured:
   - Fetches token from backend
   - Joins Agora channel
   - Publishes audio/video
   - Subscribes to peer
4. If not configured:
   - Shows legacy WebRTC component with warning
   - Requires manual connection setup

## Features

### Current Features

- ✅ Secure token-based authentication
- ✅ 1-hour token expiration
- ✅ Echo cancellation (AEC)
- ✅ Noise suppression (ANS)
- ✅ 480p video quality (configurable)
- ✅ Mute/unmute audio
- ✅ Enable/disable video
- ✅ Connection state monitoring
- ✅ Auto-fallback to legacy WebRTC

### Planned Features

- ⏳ Live captions/transcription
- ⏳ In-session text chat (Agora Chat)
- ⏳ Screen sharing
- ⏳ Session recording
- ⏳ Virtual backgrounds
- ⏳ Multi-party sessions (more than 2 participants)

## Testing

### Backend Tests

```bash
cd backend
npm run jest -- tests/agora.test.js
```

Tests cover:
- Token generation logic
- Parameter validation
- Role handling
- Expiration calculation
- Configuration validation

### Manual Testing

1. Configure Agora credentials in both backend and frontend
2. Start both services
3. Open two browser windows
4. Log in as different users
5. Create a session and join from both windows
6. Verify video/audio works between peers

## Troubleshooting

### "Video conferencing service not configured" error

**Problem**: Backend doesn't have Agora credentials

**Solution**: Add `AGORA_APP_ID` and `AGORA_APP_CERTIFICATE` to backend environment variables

### "Agora App ID not configured" in frontend

**Problem**: Frontend doesn't have App ID

**Solution**: Add `NEXT_PUBLIC_AGORA_APP_ID` (or `REACT_APP_AGORA_APP_ID`) to frontend environment

### "Legacy mode" warning banner

**Problem**: Frontend cannot find Agora App ID

**Solution**: Verify environment variable name matches your build system (`NEXT_PUBLIC_*` for Next.js, `REACT_APP_*` for Webpack)

### Connection fails but token generates successfully

**Problem**: Firewall or network restrictions

**Solution**: 
- Check browser console for errors
- Verify Agora services are not blocked
- Check if your network allows WebRTC traffic
- Try from a different network

### Video works in local but not in production

**Problem**: Environment variables not set in production

**Solution**: 
- Verify Railway environment variables are set
- Check Vercel environment variables for frontend
- Ensure variables are not accidentally in `.gitignore`

## Cost Considerations

Agora pricing (as of 2024):

- **Free tier**: 10,000 minutes/month
- **Paid**: ~$0.99 per 1,000 minutes for HD video
- **Recording**: Additional $0.49 per 1,000 minutes

For the yoohoo.guru platform:
- Free tier covers ~166 hours of sessions per month
- Suitable for early-stage deployment
- Monitor usage via Agora console
- Upgrade to paid plan as usage grows

## References

- [Agora RTC SDK Documentation](https://docs.agora.io/en/video-calling/overview/product-overview)
- [Token Generation Guide](https://docs.agora.io/en/video-calling/develop/authentication-workflow)
- [React Quick Start](https://docs.agora.io/en/video-calling/get-started/get-started-sdk?platform=react-js)
- [Agora Console](https://console.agora.io)

## Support

For issues with the Agora integration:

1. Check this documentation
2. Review Agora console for service status
3. Check backend logs for token generation errors
4. Check browser console for frontend errors
5. Open an issue in the repository
