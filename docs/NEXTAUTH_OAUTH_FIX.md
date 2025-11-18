# YooHoo.Guru Authentication Fix Guide - NextAuth OAuth Configuration

## 🚨 CRITICAL: OAuth Callback Error Fix

This guide provides the **exact steps** to fix the `OAuthCallback` error preventing users from logging into YooHoo.Guru.

## Problem Summary

**Error Message:** `error=OAuthCallback` in URL after attempting Google Sign-In

**Root Cause:** Missing or incorrect Google OAuth redirect URIs in Google Cloud Console for NextAuth.js

**Impact:** Users cannot log in using Google OAuth

## Quick Fix Checklist

Follow these steps **in order**:

- [ ] Step 1: Access Google Cloud Console OAuth settings
- [ ] Step 2: Add all required NextAuth redirect URIs
- [ ] Step 3: Verify Vercel environment variables
- [ ] Step 4: Test authentication flow
- [ ] Step 5: Verify cross-subdomain authentication

## Detailed Fix Instructions

### Step 1: Configure Google OAuth Client

#### 1.1 Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project linked to Firebase project `ceremonial-tea-470904-f3`
3. Navigate to: **APIs & Services** → **Credentials**
4. Find OAuth 2.0 Client ID: `427120165904-462nd1ouk7vkl5kcmsmfib631055t41a.apps.googleusercontent.com`
5. Click the client ID to edit

#### 1.2 Add Authorized JavaScript Origins

Add this origin:

```
https://www.yoohoo.guru
```

**Why:** This allows the OAuth popup to open from the central login page.

**Note:** You do NOT need to add other subdomains (coach, angel, etc.) because all authentication happens at the central login page (www.yoohoo.guru/login). Users from other subdomains are redirected to this central page.

#### 1.3 Add Authorized Redirect URI (CRITICAL)

**⚠️ THIS IS THE MOST IMPORTANT PART**

Add this **one** redirect URI:

```
https://www.yoohoo.guru/api/auth/callback/google
```

**Critical Requirements:**
- Path MUST be exactly: `/api/auth/callback/google`
- No trailing slashes
- HTTPS only (not HTTP)
- Only the www subdomain is needed because OAuth happens centrally

**Why only ONE redirect URI?**

YooHoo.Guru uses a **centralized authentication model**:
1. Users on ANY subdomain (coach, angel, etc.) click "Sign In" → redirected to www.yoohoo.guru/login
2. User completes Google OAuth at www.yoohoo.guru/login
3. Google redirects to: www.yoohoo.guru/api/auth/callback/google (this is the ONLY OAuth redirect)
4. After successful authentication, NextAuth redirects user back to their original subdomain using the `callbackUrl` parameter

This is NOT an OAuth redirect - it's a NextAuth application redirect handled by the redirect callback in NextAuth configuration.

#### 1.4 Save Changes

1. Click **Save** at the bottom
2. Wait 5-10 minutes for Google to propagate changes globally
3. Clear your browser cache

### Step 2: Verify Vercel Environment Variables

#### 2.1 Required Variables

Go to Vercel Dashboard → YooHoo.Guru Project → **Settings** → **Environment Variables**

Verify these variables are set for **Production**:

```bash
# NextAuth Core Configuration
NEXTAUTH_URL=https://www.yoohoo.guru
NEXTAUTH_SECRET=<32-character-base64-string>

# Cross-Subdomain Authentication
AUTH_COOKIE_DOMAIN=.yoohoo.guru

# Google OAuth Credentials
GOOGLE_OAUTH_CLIENT_ID=427120165904-462nd1ouk7vkl5kcmsmfib631055t41a.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=<your-client-secret-from-google>

# Firebase Configuration
FIREBASE_API_KEY=<your-firebase-api-key>
FIREBASE_PROJECT_ID=ceremonial-tea-470904-f3

# Backend API
BACKEND_API_URL=https://api.yoohoo.guru
```

#### 2.2 Generate NEXTAUTH_SECRET (if missing)

Run this command locally:
```bash
openssl rand -base64 32
```

Copy the output and set it as `NEXTAUTH_SECRET` in Vercel.

**⚠️ Important:**
- Use the SAME secret for all environments (Production, Preview, Development)
- Never share or commit this secret
- Store it securely (password manager)

#### 2.3 Verify AUTH_COOKIE_DOMAIN

This MUST be set to `.yoohoo.guru` (with leading dot) for cross-subdomain authentication.

**Test:** After login, check browser DevTools:
- Go to: **Application** → **Cookies**
- Look for cookie: `__Secure-next-auth.session-token`
- Domain should show: `.yoohoo.guru`

If Domain shows `www.yoohoo.guru` (without leading dot), the variable is not set correctly.

### Step 3: Redeploy Application

After making changes:

1. Go to Vercel Dashboard → Deployments
2. Find latest deployment
3. Click **...** (three dots) → **Redeploy**
4. Select "Use existing Build Cache"
5. Wait for deployment to complete

**Why:** Environment variable changes require redeployment to take effect.

### Step 4: Test Authentication Flow

#### 4.1 Test on www.yoohoo.guru

1. Open **Incognito/Private browsing window**
2. Go to: `https://www.yoohoo.guru/login`
3. Open browser DevTools (F12) → **Console** tab
4. Click "Sign in with Google"
5. Complete Google OAuth flow

**Expected:**
- Redirect to Google sign-in page
- After authentication, redirect to: `https://www.yoohoo.guru/dashboard`
- No `error=OAuthCallback` in URL
- Console shows: `✅ OAuth login successful via google for user <your-email>`

**If it fails:**
- Check Console for errors
- Check Network tab for failed requests
- Verify redirect URI in Google Cloud Console matches exactly

#### 4.2 Test Cross-Subdomain Authentication

1. After successful login on www.yoohoo.guru
2. Open new tab, go to: `https://coach.yoohoo.guru`
3. You should already be logged in (no need to sign in again)

**If you're not logged in on coach subdomain:**
- Check `AUTH_COOKIE_DOMAIN` is set to `.yoohoo.guru`
- Check cookie Domain in DevTools
- Redeploy after fixing

### Step 5: Troubleshooting

#### Error: "OAuthCallback" still appears

**Check:**
1. Google Cloud Console redirect URI is exactly: `https://www.yoohoo.guru/api/auth/callback/google`
2. Wait 10 minutes after saving Google Cloud Console changes
3. Clear browser cache completely
4. Try different browser or incognito mode

#### Error: "Configuration" error

**Check:**
1. All required environment variables are set in Vercel
2. NEXTAUTH_SECRET is set (not empty)
3. GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET are correct
4. Redeploy after setting variables

#### Error: Cookie not working across subdomains

**Check:**
1. AUTH_COOKIE_DOMAIN=`.yoohoo.guru` (with leading dot)
2. Cookie is Secure (HTTPS only)
3. Cookie has Domain=`.yoohoo.guru` in DevTools

#### Error: "invalid_client" from Google

**Check:**
1. GOOGLE_OAUTH_CLIENT_SECRET is correct in Vercel
2. OAuth Client ID in Google Cloud Console is enabled
3. Project in Google Cloud Console is correct

## Verification Commands

### Test NextAuth Providers Endpoint

```bash
curl https://www.yoohoo.guru/api/auth/providers | jq
```

Expected response:
```json
{
  "google": {
    "id": "google",
    "name": "Google",
    "type": "oauth",
    "signinUrl": "https://www.yoohoo.guru/api/auth/signin/google",
    "callbackUrl": "https://www.yoohoo.guru/api/auth/callback/google"
  },
  "credentials": {
    "id": "credentials",
    "name": "Email and Password",
    "type": "credentials"
  }
}
```

### Test NextAuth Session Endpoint

After logging in:
```bash
curl -H "Cookie: <session-cookie>" https://www.yoohoo.guru/api/auth/session | jq
```

Expected response:
```json
{
  "user": {
    "name": "Your Name",
    "email": "your@email.com",
    "image": "https://...",
    "id": "...",
    "role": "gunu"
  },
  "expires": "2025-12-18T..."
}
```

## Environment Variable Template

Copy this to Vercel exactly:

```bash
# ============================================
# NEXTAUTH CONFIGURATION - REQUIRED
# ============================================
NEXTAUTH_URL=https://www.yoohoo.guru
NEXTAUTH_SECRET=<GENERATE_WITH: openssl rand -base64 32>
AUTH_COOKIE_DOMAIN=.yoohoo.guru

# ============================================
# GOOGLE OAUTH - REQUIRED
# ============================================
GOOGLE_OAUTH_CLIENT_ID=427120165904-462nd1ouk7vkl5kcmsmfib631055t41a.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=<GET_FROM_GOOGLE_CLOUD_CONSOLE>

# ============================================
# FIREBASE - REQUIRED
# ============================================
FIREBASE_API_KEY=<GET_FROM_FIREBASE_CONSOLE>
FIREBASE_PROJECT_ID=ceremonial-tea-470904-f3

# ============================================
# BACKEND API - REQUIRED
# ============================================
BACKEND_API_URL=https://api.yoohoo.guru
```

## Security Checklist

- [ ] NEXTAUTH_SECRET is at least 32 characters
- [ ] GOOGLE_OAUTH_CLIENT_SECRET is kept private
- [ ] All environment variables are in Vercel (not in code)
- [ ] .env files are in .gitignore
- [ ] HTTPS is enforced for all OAuth redirects
- [ ] Cookie is httpOnly and secure
- [ ] SameSite is set to 'lax' for CSRF protection

## Next Steps After Fix

Once authentication is working:

1. ✅ Test login on all subdomains
2. ✅ Test logout and re-login
3. ✅ Test with multiple Google accounts
4. ✅ Verify session persists across page reloads
5. ✅ Test protected routes redirect to login
6. ✅ Monitor Vercel logs for any errors

## Support

If you continue to experience issues after following this guide:

1. **Check Vercel logs:** Vercel Dashboard → Project → Logs
2. **Check browser console:** Look for specific error messages
3. **Test in incognito:** Rule out cached data issues
4. **Wait 10 minutes:** OAuth changes can take time to propagate

## References

- [NextAuth.js Documentation](https://next-auth.js.org/configuration/options)
- [Google OAuth 2.0 Setup](https://support.google.com/cloud/answer/6158849)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Last Updated:** November 2025  
**Status:** ✅ Ready for implementation
