# NextAuth Cross-Subdomain SSO Audit

## Overview

This document describes the NextAuth.js authentication implementation for yoohoo.guru, which provides seamless Single Sign-On (SSO) across all subdomains.

## Architecture

### Current Setup

- **Frontend**: React/Webpack application with Next.js App Router for authentication endpoints
- **Backend**: Express API with dual authentication support (Firebase + NextAuth)
- **Auth Provider**: NextAuth.js with Google OAuth
- **Session Storage**: Firestore via FirestoreAdapter
- **Cookie Domain**: `.yoohoo.guru` (enables cross-subdomain access)

### Supported Domains

All authentication sessions are shared across:

- `yoohoo.guru` (apex domain)
- `www.yoohoo.guru` (www subdomain)
- `coach.yoohoo.guru` (Guru dashboard)
- `angel.yoohoo.guru` (Angel's List marketplace)
- `masters.yoohoo.guru` (Modified Masters)
- `api.yoohoo.guru` (API endpoints)

### Development Domains

- `http://localhost:3000` (frontend development)
- `http://localhost:3001` (backend API development)

## Implementation Details

### NextAuth Configuration

**Location**: `frontend/app/api/auth/[...nextauth]/route.ts`

Key features:

1. **Google OAuth Provider**: Configured with proper consent and offline access
2. **JWT Session Strategy**: Tokens contain user ID and membership tier
3. **Cross-Subdomain Cookies**: Domain set to `.yoohoo.guru` for cookie sharing
4. **Firestore Adapter**: Sessions persisted in Firebase for scalability
5. **Membership Integration**: User's `membershipTier` fetched from Firestore and added to session

### Backend Authentication Middleware

**Location**: `backend/src/middleware/auth.js`

The middleware supports **dual authentication** during migration:

1. **NextAuth JWT Token**: Primary method (verified with `NEXTAUTH_SECRET`)
2. **Firebase ID Token**: Fallback method (for gradual migration)

Token sources (in priority order):

1. Authorization header: `Bearer <token>`
2. Cookie: `__Secure-next-auth.session-token` (production)
3. Cookie: `next-auth.session-token` (development)

### Health Check Endpoint

**Location**: `frontend/app/api/auth/health/route.ts`

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

## Environment Variables

### Required Variables

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_change_this_in_production
NEXTAUTH_URL=https://yoohoo.guru
AUTH_COOKIE_DOMAIN=.yoohoo.guru

# Google OAuth
GOOGLE_OAUTH_CLIENT_ID=your_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_client_secret

# Firebase Admin (for session storage)
FIREBASE_PROJECT_ID=ceremonial-tea-470904-f3
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
```

### Generating NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

Or in Node.js:

```javascript
require('crypto').randomBytes(32).toString('base64')
```

## Google Cloud Console Configuration

### Authorized JavaScript Origins

All origins must be added to your Google OAuth client:

- `https://yoohoo.guru`
- `https://www.yoohoo.guru`
- `https://coach.yoohoo.guru`
- `https://angel.yoohoo.guru`
- `https://masters.yoohoo.guru`
- `https://api.yoohoo.guru`
- `http://localhost:3000` (development)
- `http://localhost:3001` (development)

### Authorized Redirect URIs

All callback URIs for each subdomain:

- `https://yoohoo.guru/api/auth/callback/google`
- `https://www.yoohoo.guru/api/auth/callback/google`
- `https://coach.yoohoo.guru/api/auth/callback/google`
- `https://angel.yoohoo.guru/api/auth/callback/google`
- `https://masters.yoohoo.guru/api/auth/callback/google`
- `http://localhost:3000/api/auth/callback/google` (development)

## Migration Strategy

### Phase 1: Dual Authentication (Current)

Both Firebase and NextAuth tokens are accepted:

- Existing users continue using Firebase Auth
- New sessions can use NextAuth
- No breaking changes for existing users

### Phase 2: NextAuth Primary (Future)

- Frontend updated to use NextAuth sign-in
- Firebase Auth becomes fallback only
- All new authentications use NextAuth

### Phase 3: Complete Migration (Future)

- Firebase Auth removed from frontend
- Backend only validates NextAuth tokens
- Legacy Firebase tokens rejected

## Testing

### Playwright Tests

**Location**: `qa/tests/auth.spec.ts`

Tests verify:

1. Health endpoint returns correct structure
2. Session cookies are set with correct domain
3. Sessions persist across subdomain navigation
4. Membership tier is correctly included in session

### Running Tests

```bash
cd qa
npm test -- auth.spec.ts
```

## Security Considerations

### Cookie Security

- `httpOnly: true` - JavaScript cannot access cookies
- `secure: true` - HTTPS only in production
- `sameSite: 'lax'` - CSRF protection while allowing subdomain navigation
- Domain: `.yoohoo.guru` - Shared across all subdomains

### JWT Security

- Tokens signed with `NEXTAUTH_SECRET`
- 30-day expiration
- Include minimal user data (id, email, membershipTier)
- Cannot be decoded without secret

### Session Storage

- Sessions stored in Firestore (scalable and persistent)
- Automatic cleanup of expired sessions
- Session data encrypted in transit

## Troubleshooting

### Session Not Persisting Across Subdomains

Check:

1. `AUTH_COOKIE_DOMAIN` is set to `.yoohoo.guru`
2. All subdomains use HTTPS (required for `__Secure-` cookies)
3. Google OAuth includes all subdomains in authorized origins

### "Invalid or Expired Token" Error

Check:

1. `NEXTAUTH_SECRET` matches between frontend and backend
2. Token hasn't expired (30-day default)
3. System clocks are synchronized

### Health Endpoint Returns 500

Check:

1. Firebase Admin credentials are correct
2. Firestore is accessible
3. `NEXTAUTH_SECRET` is set

## Support

For issues or questions:

- **Email**: support@yoohoo.guru
- **Documentation**: `docs/GOOGLE_OAUTH_SETUP.md`
- **Backend Auth**: `backend/src/middleware/auth.js`

## Changelog

### 2025-10-14

- Initial NextAuth implementation
- Dual authentication support (Firebase + NextAuth)
- Cross-subdomain SSO configuration
- Health check endpoint
- Playwright test suite
