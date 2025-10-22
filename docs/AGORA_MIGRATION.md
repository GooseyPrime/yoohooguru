# Agora Video Conferencing - Migration to apps/main

This document describes the migration of Agora.io video conferencing integration from the archived frontend to the current `apps/main` structure.

## Overview

Following the successful merge of PR #401, the Agora video components were initially placed in `.archive/frontend-legacy/` due to architectural changes. This migration relocates those components to the proper location in the current Next.js application structure at `apps/main`.

## What Was Migrated

### Frontend Components

All video conferencing components have been migrated from `.archive/frontend-legacy/src/components/` to `apps/main/components/`:

1. **AgoraVideoChat.tsx** - Full Agora RTC SDK implementation
   - Location: `apps/main/components/AgoraVideoChat.tsx`
   - Converted to TypeScript with proper type definitions
   - Uses Agora RTC SDK for real-time video conferencing
   - Features: token-based authentication, echo cancellation, noise suppression

2. **LegacyVideoChat.tsx** - Fallback WebRTC implementation
   - Location: `apps/main/components/LegacyVideoChat.tsx`
   - Converted to TypeScript
   - Used only when Agora is not configured
   - Shows warning banner to encourage Agora setup

3. **VideoChat.tsx** - Smart wrapper component
   - Location: `apps/main/components/VideoChat.tsx`
   - Auto-detects Agora configuration
   - Routes to AgoraVideoChat if configured, otherwise falls back to LegacyVideoChat
   - Provides a simple API for session pages

### Example Implementation

Created an example session page demonstrating the integration:

- **Location**: `apps/main/pages/_apps/coach/session/[id].tsx`
- Shows a complete coaching session page with video conferencing
- Includes session info, notes, and controls
- Demonstrates proper usage of the VideoChat component

### Backend Components

The backend components from PR #401 remain in place and functional:

- **Routes**: `backend/src/routes/agora.js`
  - `POST /api/v1/agora/token` - Generate RTC tokens
  - `GET /api/v1/agora/status` - Check configuration status
- **Tests**: `backend/tests/agora.test.js` - Comprehensive test suite
- **Documentation**: `docs/AGORA_VIDEO_CONFERENCING.md` - Complete integration guide

## Changes Made

### 1. Package Dependencies

Added to `apps/main/package.json`:

```json
{
  "dependencies": {
    "agora-rtc-sdk-ng": "^4.21.0"
  }
}
```

### 2. Environment Variables

Updated `.env.shared` to include Agora configuration:

```env
# Agora Video Conferencing (Public keys for client-side)
# Get these from https://console.agora.io
NEXT_PUBLIC_AGORA_APP_ID=
NEXT_PUBLIC_AGORA_REGION=us
```

These variables were already documented in `.env.shared.example`.

### 3. TypeScript Conversion

All components were converted from JavaScript to TypeScript:

- Added proper type definitions for props
- Used TypeScript interfaces for Agora SDK types
- Ensured type safety throughout the components
- Added `'use client'` directive for Next.js client components

### 4. Next.js Compatibility

Made the following adjustments for Next.js:

- Replaced `logger` utility with `console.log/warn/error`
- Added `'use client'` directive to components using React hooks
- Used `process.env.NEXT_PUBLIC_AGORA_APP_ID` instead of `REACT_APP_*`
- Ensured components work with Next.js SSR/CSR architecture

## Directory Structure

```
apps/main/
├── components/
│   ├── AgoraVideoChat.tsx      # Main Agora implementation
│   ├── LegacyVideoChat.tsx     # Fallback WebRTC
│   └── VideoChat.tsx            # Smart wrapper
├── pages/
│   └── _apps/
│       └── coach/
│           └── session/
│               └── [id].tsx     # Example session page
└── package.json                 # Added agora-rtc-sdk-ng

backend/
├── src/
│   └── routes/
│       └── agora.js             # Token generation API (unchanged)
└── tests/
    └── agora.test.js            # Test suite (unchanged)

docs/
├── AGORA_VIDEO_CONFERENCING.md # Original setup guide (unchanged)
├── AGORA_NEXTJS_EXAMPLE.md     # Next.js examples (unchanged)
└── AGORA_MIGRATION.md           # This document
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd apps/main
npm install
```

This will install the `agora-rtc-sdk-ng` package and other dependencies.

### 2. Configure Backend Environment Variables

Add to your backend environment (Railway, .env, etc.):

```env
AGORA_APP_ID=your_app_id_here
AGORA_APP_CERTIFICATE=your_primary_certificate_here
AGORA_REGION=us
```

Get these credentials from [Agora Console](https://console.agora.io).

### 3. Configure Frontend Environment Variables

Update `.env.shared` in the root directory:

```env
NEXT_PUBLIC_AGORA_APP_ID=your_app_id_here
NEXT_PUBLIC_AGORA_REGION=us
```

### 4. Deploy

Restart your backend and frontend services after updating environment variables.

## Usage Example

### Basic Usage

```tsx
import VideoChat from '@/components/VideoChat';

function SessionPage() {
  return (
    <VideoChat
      sessionId="session-123"
      userId="user-456"
      onEnd={() => {
        console.log('Call ended');
        // Handle session end
      }}
      apiUrl={process.env.NEXT_PUBLIC_API_URL || '/api/v1'}
    />
  );
}
```

### With useRouter (Dynamic Routes)

```tsx
import { useRouter } from 'next/router';
import VideoChat from '@/components/VideoChat';

function DynamicSessionPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <VideoChat
      sessionId={id as string}
      userId={currentUser.uid}
      onEnd={() => router.push('/dashboard')}
    />
  );
}
```

See `apps/main/pages/_apps/coach/session/[id].tsx` for a complete example.

## Testing

### Test the Migration

1. **Without Agora Credentials** (Legacy Mode):
   - Start the app without setting `NEXT_PUBLIC_AGORA_APP_ID`
   - Visit `/coach/session/test-session`
   - Should see legacy WebRTC component with warning banner

2. **With Agora Credentials** (Full Mode):
   - Set all required environment variables
   - Restart the app
   - Visit `/coach/session/test-session`
   - Should see Agora video component
   - Open two browser tabs to test peer-to-peer connection

### Backend Tests

The existing backend tests remain functional:

```bash
cd backend
npm run jest -- tests/agora.test.js
```

## Backward Compatibility

- ✅ Backend API remains unchanged
- ✅ Token generation endpoints work the same way
- ✅ Environment variables use the same names
- ✅ Automatic fallback to legacy mode if Agora not configured
- ✅ Zero breaking changes to existing code

## Migration Checklist

- [x] Created `apps/main/components/` directory
- [x] Migrated AgoraVideoChat component to TypeScript
- [x] Migrated LegacyVideoChat component to TypeScript
- [x] Migrated VideoChat wrapper to TypeScript
- [x] Added agora-rtc-sdk-ng dependency to apps/main
- [x] Updated .env.shared with Agora variables
- [x] Created example session page
- [x] Verified TypeScript compilation
- [x] Documented migration process
- [ ] Set actual Agora credentials (requires Agora account)
- [ ] Test with real video sessions
- [ ] Deploy to production

## Next Steps

1. **Get Agora Credentials**:
   - Create account at [Agora Console](https://console.agora.io)
   - Create a new project
   - Enable "App ID + Token" authentication
   - Copy App ID and Certificate

2. **Configure Environment**:
   - Add credentials to Railway (backend)
   - Add App ID to Vercel (frontend)
   - Restart services

3. **Integration**:
   - Add video chat to actual session pages
   - Integrate with session management system
   - Add recording capabilities (optional)
   - Implement live captions (optional)

4. **Testing**:
   - Test across different browsers
   - Test on mobile devices
   - Test with multiple participants
   - Monitor Agora usage in console

## Troubleshooting

### Components Not Found

If you get import errors:

```bash
cd apps/main
npm install
npm run dev
```

### Video Not Working

1. Check console for errors
2. Verify `NEXT_PUBLIC_AGORA_APP_ID` is set
3. Verify backend has `AGORA_APP_ID` and `AGORA_APP_CERTIFICATE`
4. Check network allows WebRTC traffic
5. Try different browser

### Falls Back to Legacy Mode

This means Agora is not configured. Set `NEXT_PUBLIC_AGORA_APP_ID` in your environment.

## Resources

- [Agora Video Conferencing Docs](docs/AGORA_VIDEO_CONFERENCING.md)
- [Agora Next.js Examples](docs/AGORA_NEXTJS_EXAMPLE.md)
- [Agora RTC SDK Documentation](https://docs.agora.io/en/video-calling/overview/product-overview)
- [Backend API Routes](backend/src/routes/agora.js)
- [Backend Tests](backend/tests/agora.test.js)

## Support

For issues with the migration:

1. Check this documentation
2. Review the example session page
3. Check Agora documentation for SDK issues
4. Open an issue in the repository

---

**Migration completed**: 2025-10-21
**PR Reference**: #401 - Add Agora.io Video Conferencing Integration
