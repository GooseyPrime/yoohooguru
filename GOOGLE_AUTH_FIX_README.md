# Google Auth Error Fix - Action Required

## What Was Fixed in This PR

This PR fixes the Google Authentication error and CSP console errors by:

1. **Updated Content Security Policy (CSP)** in three locations:
   - `vercel.json` - Production deployment headers
   - `frontend/public/index.html` - HTML meta tag
   - `frontend/webpack.config.js` - Development server headers
   
   **Changes:** Added `https://oauth2.googleapis.com` to the `connect-src` directive to allow OAuth token exchange.

2. **Added comprehensive documentation** in `docs/GOOGLE_OAUTH_SETUP.md` with step-by-step instructions and troubleshooting guide.

3. **Updated PR implementation summary** with correct Firebase redirect URIs that need to be configured.

## What You Need to Do Now

The code changes are complete, but **you must manually configure the OAuth client** in Google Cloud Console. The error will persist until you complete these steps.

### Step 1: Add Firebase Redirect URI to Google OAuth Client

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (linked to Firebase project `ceremonial-tea-470904-f3`)
3. Navigate to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID (usually named "Web client (auto created by Google Service)")
5. Click on it to edit
6. Under **Authorized redirect URIs**, add:
   ```
   https://ceremonial-tea-470904-f3.firebaseapp.com/__/auth/handler
   ```
7. Click **Save**

> **Important:** This is the **required** redirect URI. Firebase always uses `<project-id>.firebaseapp.com/__/auth/handler` for OAuth redirects, regardless of what domain your app is hosted on.

### Step 2: Verify Firebase Authorized Domains

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `ceremonial-tea-470904-f3`
3. Navigate to **Authentication** → **Settings** → **Authorized Domains**
4. Ensure these domains are listed:
   - `ceremonial-tea-470904-f3.firebaseapp.com` ✓ (should already be there)
   - `yoohoo.guru` ← Add if missing
   - `www.yoohoo.guru` ← Add if missing
   - `art.yoohoo.guru` ← Add if missing (if using subdomain)

### Step 3: Deploy and Test

1. Deploy the PR to production (merge and deploy to Vercel)
2. Wait 5-10 minutes for OAuth configuration changes to propagate
3. Navigate to https://www.yoohoo.guru/login
4. Click "Sign in with Google"
5. You should see the Google OAuth popup without errors

## Why This Error Occurred

The error message was:
```
OAuth2 redirect uri is: https://ceremonial-tea-470904-f3.firebaseapp.com/__/auth/handler
response: OAuth2TokenResponse{params: error=invalid_client&error_description=Unauthorized
```

**Root Cause:** 
- Firebase Authentication always uses `<project-id>.firebaseapp.com/__/auth/handler` as the OAuth redirect URI
- This URI was not added to the Google Cloud Console OAuth 2.0 Client ID configuration
- When users tried to sign in with Google, the OAuth server rejected the redirect URI as "unauthorized"

**Secondary Issue:**
- The Content Security Policy (CSP) was missing `oauth2.googleapis.com` in the `connect-src` directive
- This caused browser console errors when trying to exchange the authorization code for an access token

## How to Verify the Fix

After completing the manual steps and deploying:

1. Open browser DevTools (F12)
2. Go to the Console tab
3. Navigate to your login page
4. Click "Sign in with Google"
5. Check for these signs of success:
   - ✅ No CSP violations related to Google APIs
   - ✅ No Firebase authentication errors
   - ✅ Google OAuth popup appears
   - ✅ After selecting a Google account, you're redirected back and logged in

## Troubleshooting

### Still seeing "invalid_client" error
- **Clear browser cache and cookies** (OAuth tokens may be cached)
- **Wait 10 minutes** (OAuth configuration can take time to propagate)
- **Verify the exact redirect URI** (it must match exactly, including the protocol and path)
- **Check you edited the correct OAuth client** (Firebase may have multiple clients; use the one with "Web client" in the name)

### CSP errors persist
- **Clear browser cache** (old CSP headers may be cached)
- **Hard reload the page** (Ctrl+Shift+R or Cmd+Shift+R)
- **Check deployment** (verify the latest version is deployed to Vercel)
- **Check browser DevTools Network tab** (verify the CSP header includes oauth2.googleapis.com)

### Google popup is blocked
- **Allow popups** in your browser for yoohoo.guru
- **Check COOP header** (should be `same-origin-allow-popups` - this is configured in vercel.json)

## Additional Resources

- Full setup guide: `docs/GOOGLE_OAUTH_SETUP.md`
- Firebase setup: `docs/FIREBASE_SETUP.md`
- Environment variables: `docs/ENVIRONMENT_VARIABLES.md`

## Summary

- ✅ Code changes complete (CSP updated in 3 files)
- ✅ Documentation added
- ✅ Frontend builds successfully
- ⏳ **Action Required:** Add OAuth redirect URI in Google Cloud Console
- ⏳ **Action Required:** Verify Firebase authorized domains
- ⏳ **Action Required:** Deploy and test

Once you complete the manual OAuth configuration steps, the Google Authentication error will be resolved!
