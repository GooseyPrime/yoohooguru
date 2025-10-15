# NextAuth.js Migration Guide

## Overview

This PR implements NextAuth.js (Auth.js) for cross-subdomain Single Sign-On (SSO) across the yoohoo.guru platform. The implementation follows a gradual migration strategy that maintains backward compatibility with existing Firebase Authentication.

## What's Changed

### New Files

#### Frontend (Next.js App Router)
- `frontend/next.config.js` - Next.js configuration with subdomain support
- `frontend/tsconfig.json` - TypeScript configuration for Next.js
- `frontend/app/api/auth/[...nextauth]/route.ts` - NextAuth authentication endpoints
- `frontend/app/api/auth/health/route.ts` - Health check endpoint for session validation
- `frontend/app/layout.tsx` - Root layout with NextAuth SessionProvider
- `frontend/types/next-auth.d.ts` - TypeScript type extensions for custom session properties

#### Testing & Documentation
- `qa/tests/auth.spec.ts` - Playwright tests for cross-subdomain authentication
- `docs/auth-audit.md` - Comprehensive authentication architecture documentation

### Modified Files

- `frontend/package.json` - Added Next.js, NextAuth, and TypeScript dependencies
- `frontend/.eslintrc.js` - Updated to support TypeScript files
- `frontend/.gitignore` - Added Next.js build artifacts
- `backend/src/middleware/auth.js` - Added dual authentication support (Firebase + NextAuth)
- `.env.example` - Added required NextAuth environment variables

## Architecture

### Dual Authentication Support

The backend now supports **both** authentication methods:

1. **NextAuth JWT Tokens** (Primary, new method)
   - Verified using `NEXTAUTH_SECRET`
   - Cookie name: `__Secure-next-auth.session-token` (production) or `next-auth.session-token` (dev)
   - Domain: `.yoohoo.guru` for cross-subdomain access

2. **Firebase ID Tokens** (Fallback, existing method)
   - Verified using Firebase Admin SDK
   - Maintains backward compatibility for existing users

### Token Priority

The authentication middleware checks tokens in this order:

1. `Authorization: Bearer <token>` header
2. `__Secure-next-auth.session-token` cookie
3. `next-auth.session-token` cookie (development)

### Cross-Subdomain SSO

NextAuth is configured with:
- **Cookie Domain**: `.yoohoo.guru`
- **Supported Subdomains**: yoohoo.guru, www, coach, angel, masters, api
- **Session Strategy**: JWT (no database lookups for every request)
- **Session Storage**: Firestore (via FirestoreAdapter)

## Deployment Instructions

### 1. Environment Variables

Add these to your deployment platform (Vercel for frontend, Railway for backend):

```bash
# Generate a secure secret
NEXTAUTH_SECRET=<run: openssl rand -base64 32>

# Set to your production URL
NEXTAUTH_URL=https://yoohoo.guru

# Enable cross-subdomain cookie sharing
AUTH_COOKIE_DOMAIN=.yoohoo.guru

# Google OAuth (already configured)
GOOGLE_OAUTH_CLIENT_ID=<your-client-id>
GOOGLE_OAUTH_CLIENT_SECRET=<your-client-secret>

# Firebase Admin (already configured)
FIREBASE_PROJECT_ID=ceremonial-tea-470904-f3
FIREBASE_CLIENT_EMAIL=<service-account-email>
FIREBASE_PRIVATE_KEY=<service-account-key>
```

### 2. Google Cloud Console Configuration

Ensure all subdomains are added to your OAuth client:

**Authorized JavaScript Origins:**
- https://yoohoo.guru
- https://www.yoohoo.guru
- https://coach.yoohoo.guru
- https://angel.yoohoo.guru
- https://masters.yoohoo.guru

**Authorized Redirect URIs:**
- https://yoohoo.guru/api/auth/callback/google
- https://www.yoohoo.guru/api/auth/callback/google
- https://coach.yoohoo.guru/api/auth/callback/google
- https://angel.yoohoo.guru/api/auth/callback/google
- https://masters.yoohoo.guru/api/auth/callback/google

### 3. Vercel Build Configuration

Update `vercel.json` or Vercel project settings:

```json
{
  "buildCommand": "cd frontend && npm run build:next",
  "outputDirectory": "frontend/.next",
  "installCommand": "cd frontend && npm install --legacy-peer-deps"
}
```

**Note**: The `--legacy-peer-deps` flag is required due to firebase-admin version compatibility.

### 4. Deploy and Test

1. Deploy to Vercel (frontend) and Railway (backend)
2. Wait 5-10 minutes for DNS and OAuth changes to propagate
3. Test the health endpoint: `https://yoohoo.guru/api/auth/health`
4. Test authentication flow: Navigate to `/api/auth/signin`

## Testing Locally

### Prerequisites

```bash
# Install dependencies
cd frontend && npm install --legacy-peer-deps
cd ../backend && npm install
```

### Run Development Servers

```bash
# Terminal 1: Frontend (Next.js)
cd frontend
npm run dev:next

# Terminal 2: Backend API
cd backend
npm run dev
```

### Test Authentication

1. Visit `http://localhost:3000/api/auth/health`
2. Check response includes `loggedIn`, `NEXTAUTH_URL`, etc.
3. Visit `http://localhost:3000/api/auth/signin` to test OAuth flow

## Migration Strategy

### Phase 1: Dual Authentication (Current State)

✅ **Status**: Complete

- Backend accepts both Firebase and NextAuth tokens
- No breaking changes for existing users
- NextAuth endpoints available but not yet used by frontend

### Phase 2: Frontend Integration (Next Step)

- Update React frontend to use NextAuth for sign-in
- Add `SessionProvider` to existing React app
- Keep Firebase as fallback

### Phase 3: Complete Migration (Future)

- Remove Firebase Auth from frontend sign-in flow
- Keep Firebase token verification for legacy tokens
- Eventually deprecate Firebase Auth entirely

## Troubleshooting

### Health Endpoint Returns 404

**Cause**: Next.js server not running or incorrect build

**Solution**:
```bash
cd frontend
npm run dev:next  # Development
# OR
npm run build:next && npm start  # Production
```

### Session Not Persisting Across Subdomains

**Cause**: Cookie domain not set correctly

**Solution**: Verify these environment variables:
- `AUTH_COOKIE_DOMAIN=.yoohoo.guru`
- `NEXTAUTH_URL=https://yoohoo.guru` (no subdomain)

### "Invalid or Expired Token" Error

**Cause**: `NEXTAUTH_SECRET` mismatch or not set

**Solution**: 
1. Generate secret: `openssl rand -base64 32`
2. Set same value in both Vercel (frontend) and Railway (backend)

### Google OAuth Redirect Error

**Cause**: Redirect URI not authorized in Google Console

**Solution**: Add all callback URLs to Google OAuth client (see deployment instructions above)

## API Reference

### Health Check Endpoint

`GET /api/auth/health`

Returns session status and configuration:

```json
{
  "host": "yoohoo.guru",
  "NEXTAUTH_URL": "https://yoohoo.guru",
  "AUTH_COOKIE_DOMAIN": ".yoohoo.guru",
  "loggedIn": true,
  "user": {
    "email": "user@example.com",
    "id": "user-id-123",
    "membershipTier": "coach"
  },
  "message": "NextAuth session active and persistent.",
  "timestamp": "2025-10-14T02:30:00.000Z"
}
```

### NextAuth Endpoints

All standard NextAuth endpoints are available:

- `GET /api/auth/signin` - Sign in page
- `GET /api/auth/signout` - Sign out
- `GET /api/auth/callback/google` - OAuth callback
- `GET /api/auth/session` - Get current session
- `GET /api/auth/csrf` - Get CSRF token

See [NextAuth.js documentation](https://next-auth.js.org/getting-started/rest-api) for full API reference.

## Security Considerations

### Cookie Security

- ✅ `httpOnly: true` - JavaScript cannot access cookies
- ✅ `secure: true` - HTTPS only in production
- ✅ `sameSite: 'lax'` - CSRF protection with subdomain navigation
- ✅ Domain: `.yoohoo.guru` - Shared across all subdomains

### JWT Security

- ✅ Tokens signed with `NEXTAUTH_SECRET`
- ✅ 30-day expiration (configurable)
- ✅ Minimal user data in token (id, email, membershipTier)
- ✅ Cannot be decoded without secret

### Session Storage

- ✅ Sessions stored in Firestore (scalable)
- ✅ Automatic cleanup of expired sessions
- ✅ Encrypted in transit (TLS)

## Support & Documentation

- **Full Authentication Audit**: [docs/auth-audit.md](./docs/auth-audit.md)
- **Google OAuth Setup**: [docs/GOOGLE_OAUTH_SETUP.md](./docs/GOOGLE_OAUTH_SETUP.md)
- **NextAuth.js Docs**: https://next-auth.js.org
- **Support Email**: support@yoohoo.guru

## FAQ

### Why use NextAuth instead of Firebase Auth directly?

1. **Cross-subdomain SSO**: NextAuth handles this natively
2. **Flexibility**: Easier to add multiple providers
3. **JWT Strategy**: Better performance (no DB lookup per request)
4. **Modern Stack**: Better integration with Next.js ecosystem

### Can we still use Firebase Auth?

Yes! The backend supports both during migration. Existing users continue working without changes.

### Do we need to migrate to Next.js completely?

No. NextAuth endpoints run on Next.js, but the React app continues to work. Pages can migrate incrementally.

### What about the Webpack build?

The Webpack build still works for the React app. Next.js only handles `/api/auth/*` routes.

## Rollback Plan

If issues arise:

1. Remove NextAuth environment variables from Vercel/Railway
2. Frontend falls back to Firebase Auth (no code changes needed)
3. Backend continues accepting Firebase tokens
4. No downtime or breaking changes

---

**PR Status**: ✅ Ready for Review

**Next Steps**:
1. Review and approve PR
2. Set environment variables in Vercel/Railway
3. Configure Google OAuth redirect URIs
4. Deploy and test
5. Monitor health endpoint and authentication flow
