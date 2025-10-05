# Google OAuth Setup Guide

This guide explains how to properly configure Google OAuth for the yoohoo.guru application.

## Current Firebase Configuration

The yoohoo.guru production application uses:
- **Firebase Project ID**: `ceremonial-tea-470904-f3`
- **Firebase Auth Domain**: `ceremonial-tea-470904-f3.firebaseapp.com`
- **Custom Domains**: `yoohoo.guru`, `www.yoohoo.guru`, `art.yoohoo.guru`

## Common OAuth Errors

### Error: `invalid_client` or `OAuth2 redirect uri is not authorized`

**Symptoms:**
```
Google Auth Error: FirebaseError: Firebase: Error getting access token from google.com, 
OAuth2 redirect uri is: https://ceremonial-tea-470904-f3.firebaseapp.com/__/auth/handler, 
response: OAuth2TokenResponse{params: error=invalid_client&error_description=Unauthorized
```

**Cause:** The OAuth 2.0 Client ID in Google Cloud Console is missing the required redirect URI.

**Solution:** Add the Firebase Auth redirect URI to your OAuth client configuration (see step-by-step instructions below).

### Error: CSP Blocks Google Scripts

**Symptoms:**
```
Refused to load the script 'https://apis.google.com/js/api.js?onload=__iframefcb611093' 
because it violates the following Content Security Policy directive
```

**Cause:** Content Security Policy (CSP) headers are blocking Google API scripts.

**Solution:** This has been fixed in the codebase. Ensure you're using the latest version with updated CSP in `vercel.json` and `frontend/public/index.html`.

## Step-by-Step Setup Instructions

### 1. Verify Firebase Project Settings

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `ceremonial-tea-470904-f3`
3. Navigate to **Authentication** → **Settings** → **Authorized Domains**
4. Ensure the following domains are listed:
   - `ceremonial-tea-470904-f3.firebaseapp.com` (default, should already be there)
   - `yoohoo.guru`
   - `www.yoohoo.guru`
   - `art.yoohoo.guru` (if using subdomain)

If any are missing, click **Add domain** and add them.

### 2. Configure Google Cloud Console OAuth Client

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (should be linked to Firebase project `ceremonial-tea-470904-f3`)
3. Navigate to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID (usually named "Web client (auto created by Google Service)")
5. Click on the client ID to edit it
6. Under **Authorized redirect URIs**, ensure these URIs are added:

   **Required (for Firebase Auth to work):**
   ```
   https://ceremonial-tea-470904-f3.firebaseapp.com/__/auth/handler
   ```

   **Optional (for custom domain support):**
   ```
   https://yoohoo.guru/__/auth/handler
   https://www.yoohoo.guru/__/auth/handler
   https://art.yoohoo.guru/__/auth/handler
   ```

7. Click **Save**

### 3. Configure Environment Variables

Ensure the following environment variables are set correctly:

#### Vercel (Frontend Deployment)

```bash
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=<your-api-key-from-firebase-console>
REACT_APP_FIREBASE_AUTH_DOMAIN=ceremonial-tea-470904-f3.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=ceremonial-tea-470904-f3
REACT_APP_FIREBASE_STORAGE_BUCKET=ceremonial-tea-470904-f3.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
REACT_APP_FIREBASE_APP_ID=<your-app-id>

# API Configuration
REACT_APP_API_URL=https://api.yoohoo.guru
```

#### Railway (Backend Deployment)

```bash
# Firebase Admin Configuration
FIREBASE_PROJECT_ID=ceremonial-tea-470904-f3
FIREBASE_API_KEY=<your-api-key>
FIREBASE_AUTH_DOMAIN=ceremonial-tea-470904-f3.firebaseapp.com
FIREBASE_CLIENT_EMAIL=<service-account-email>
FIREBASE_PRIVATE_KEY=<service-account-private-key>
```

### 4. Test the Configuration

1. Deploy the updated code to production (Vercel)
2. Navigate to https://yoohoo.guru/login or https://www.yoohoo.guru/login
3. Click the "Sign in with Google" button
4. A Google OAuth popup should appear
5. Select your Google account
6. You should be successfully authenticated and redirected back to the application

### 5. Verify No Console Errors

1. Open browser DevTools (F12)
2. Check the Console tab for any errors
3. There should be no CSP violations related to Google APIs
4. There should be no Firebase authentication errors

## Troubleshooting

### Still seeing `invalid_client` error after adding redirect URI

1. **Clear browser cache and cookies** - OAuth tokens may be cached
2. **Wait 5-10 minutes** - OAuth configuration changes can take time to propagate
3. **Verify the exact redirect URI** - It must match exactly: `https://ceremonial-tea-470904-f3.firebaseapp.com/__/auth/handler`
4. **Check the OAuth client** - Make sure you're editing the correct OAuth 2.0 Client ID (the one used by Firebase)

### CSP errors persist

1. **Clear browser cache** - Old CSP headers may be cached
2. **Hard reload** - Use Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
3. **Check deployment** - Ensure the latest version with updated CSP is deployed to Vercel
4. **Verify headers** - Use browser DevTools Network tab to check the `Content-Security-Policy` header on the page

### Google Sign-in popup is blocked

1. **Allow popups** - Ensure your browser allows popups for yoohoo.guru
2. **Check CSP** - Verify `frame-src` includes `https://*.firebaseapp.com` and `https://accounts.google.com`
3. **Check COOP header** - Verify `Cross-Origin-Opener-Policy` is set to `same-origin-allow-popups` (configured in vercel.json)

## Security Notes

### Why use ceremonial-tea-470904-f3.firebaseapp.com?

Firebase Auth **always** uses the default Firebase Auth domain (`<project-id>.firebaseapp.com`) as the OAuth redirect URI, regardless of what custom domain your app is hosted on. This is by design for security reasons.

Even when users access your app via `yoohoo.guru`, Firebase will redirect to `ceremonial-tea-470904-f3.firebaseapp.com/__/auth/handler` during the OAuth flow, then redirect back to your custom domain.

### Custom Domain Redirect URIs

While you can add custom domain redirect URIs (`https://yoohoo.guru/__/auth/handler`), they are **not used** by Firebase's default authentication flow. They may be useful if you implement custom OAuth flows in the future.

### Content Security Policy

The CSP configuration allows:
- Google API scripts from `apis.google.com`
- Google OAuth from `accounts.google.com` and `oauth2.googleapis.com`
- Firebase Auth frames from `*.firebaseapp.com`
- Google profile images from `lh3.googleusercontent.com`

These are required for Google Sign-in to work properly.

## Related Documentation

- [Firebase Setup Guide](./FIREBASE_SETUP.md)
- [Firebase Google Auth Setup](./FIREBASE_GOOGLE_AUTH_SETUP.md)
- [Environment Variables Guide](./ENVIRONMENT_VARIABLES.md)
- [Deployment Guide](./DEPLOYMENT.md)

## References

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth/web/google-signin)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Content Security Policy (CSP)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
