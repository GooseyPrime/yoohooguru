# NextAuth Cross-Subdomain Authentication - Implementation Status

## Overview

This document describes the current state of NextAuth implementation and what needs to be completed for full cross-subdomain authentication across all apps.

## Current Status: ⚠️ PARTIALLY IMPLEMENTED

### ✅ What's Working

1. **Shared Auth Package** (`packages/auth`)
   - Location: `packages/auth/src/nextauth.ts`
   - Contains base NextAuth configuration with cross-subdomain cookie setup
   - Properly configured to use `AUTH_COOKIE_DOMAIN` environment variable
   - Exports `getAuthOptions()` function for apps to use

2. **Frontend Implementation** (Legacy)
   - Location: `frontend/app/api/auth/[...nextauth]/route.ts`
   - Full NextAuth setup with:
     - Google OAuth provider
     - Firestore adapter for session persistence
     - Cross-subdomain cookie configuration using `AUTH_COOKIE_DOMAIN`
     - JWT session strategy with membership tier integration
     - Proper redirect callbacks for subdomain navigation
   - **This is the only working implementation currently**

3. **Environment Configuration**
   - `.env.shared.example` includes:
     - `NEXTAUTH_SECRET` - Shared across all apps
     - `AUTH_COOKIE_DOMAIN=.yoohoo.guru` - Enables cross-subdomain cookies
   - Documentation in `docs/ENVIRONMENT_VARIABLES.md` properly describes all variables

4. **Backend Authentication Middleware**
   - Location: `backend/src/middleware/auth.js`
   - Supports dual authentication (NextAuth JWT + Firebase tokens)
   - Validates NextAuth session tokens with `NEXTAUTH_SECRET`

### ❌ What's Missing

1. **Turborepo Apps** (`apps/*`) **DO NOT have NextAuth set up**
   - 29 Next.js apps in `apps/*` directory
   - **None have**:
     - NextAuth API routes (`/api/auth/[...nextauth]`)
     - `next-auth` dependency in package.json
     - `@yoohooguru/auth` package imported
     - Session provider in `_app.tsx`
   - Apps affected:
     - apps/main (homepage)
     - apps/angel (Angel's List)
     - apps/coach (Coach Guru)
     - apps/dashboard (User Dashboard)
     - apps/heroes (Hero Guru's)
     - ...and 24 other subdomain apps

2. **Missing Dependencies**
   - Apps need to add:
     - `next-auth` package
     - `@next-auth/firebase-adapter` (if using Firestore)
     - Reference to `@yoohooguru/auth` workspace package

3. **Missing API Routes**
   - Each app needs: `app/api/auth/[...nextauth]/route.ts` or `pages/api/auth/[...nextauth].ts`

4. **Missing Session Provider**
   - Each app needs SessionProvider wrapper in `_app.tsx` or root layout

## Required Implementation

### For Each App in `apps/*`

#### Step 1: Add Dependencies

Update `apps/{app}/package.json`:

```json
{
  "dependencies": {
    "@yoohooguru/auth": "*",
    "next-auth": "^4.24.0",
    "@next-auth/firebase-adapter": "^2.0.0"
  }
}
```

#### Step 2: Create NextAuth API Route

Create `apps/{app}/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getAuthOptions } from "@yoohooguru/auth";

const authOptions = getAuthOptions({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
    }),
  ],
  // App-specific overrides can go here
});

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

#### Step 3: Add Session Provider

For App Router (`app/layout.tsx`):

```typescript
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
```

For Pages Router (`pages/_app.tsx`):

```typescript
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
```

#### Step 4: Add Environment Variables

Each app needs `.env.local`:

```env
# App-specific NextAuth URL
NEXTAUTH_URL=https://{subdomain}.yoohoo.guru

# Google OAuth (shared)
GOOGLE_OAUTH_CLIENT_ID=your_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_client_secret
```

Shared variables are in `.env.shared`:
- `NEXTAUTH_SECRET` - Shared secret for JWT signing
- `AUTH_COOKIE_DOMAIN=.yoohoo.guru` - Enables cross-subdomain cookies

## How Cross-Subdomain Authentication Works

1. **User signs in** on any subdomain (e.g., `www.yoohoo.guru`)
2. **NextAuth creates a session** and sets a cookie with `domain: '.yoohoo.guru'`
3. **Cookie is shared** across all subdomains (www, coach, angel, heroes, etc.)
4. **User navigates** to another subdomain (e.g., `coach.yoohoo.guru`)
5. **Session is automatically available** because the cookie is shared
6. **No re-authentication needed** - seamless SSO experience

## Testing Cross-Subdomain Auth

1. Sign in on `www.yoohoo.guru`
2. Navigate to `coach.yoohoo.guru`
3. Check that you're still authenticated
4. Verify cookie is set with domain `.yoohoo.guru` in browser DevTools

## Priority Implementation Order

### Phase 1: Core Apps (High Priority)
1. `apps/main` - Homepage (www.yoohoo.guru)
2. `apps/dashboard` - User dashboard
3. `apps/coach` - Coach Guru
4. `apps/angel` - Angel's List
5. `apps/heroes` - Hero Guru's

### Phase 2: Subject Apps (Medium Priority)
All 24 subject-specific apps (coding, cooking, art, business, etc.)

### Phase 3: Verification
- Test cross-subdomain SSO
- Verify session persistence
- Test logout across all subdomains
- Monitor for cookie issues

## Documentation References

- **NextAuth Configuration**: `packages/auth/src/nextauth.ts`
- **Working Example**: `frontend/app/api/auth/[...nextauth]/route.ts`
- **Environment Variables**: `docs/ENVIRONMENT_VARIABLES.md`
- **Auth Audit**: `docs/auth-audit.md`
- **README**: Lines 145-150 (env vars), 770-795 (cross-subdomain config)

## Notes

- The documentation in README.md describes NextAuth as implemented, but it's only working in the legacy `frontend/` directory
- The Turborepo apps (`apps/*`) are **not using NextAuth yet**
- The `packages/auth` package provides the base configuration, but apps need to implement the full setup
- All apps share the same `NEXTAUTH_SECRET` and `AUTH_COOKIE_DOMAIN` for cross-subdomain SSO

## Action Items

- [ ] Add NextAuth to all apps in `apps/*`
- [ ] Update README.md to clarify current implementation status
- [ ] Create migration guide for adding NextAuth to new apps
- [ ] Test cross-subdomain authentication across all apps
- [ ] Document any subdomain-specific configuration needs
