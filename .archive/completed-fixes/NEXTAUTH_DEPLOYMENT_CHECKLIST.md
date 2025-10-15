# NextAuth Deployment Checklist

Use this checklist to ensure a smooth deployment of the NextAuth migration.

## Pre-Deployment

### 1. Generate Secrets

- [ ] Generate NEXTAUTH_SECRET
  ```bash
  node scripts/generate-nextauth-secret.js
  ```
  Save the output securely (password manager recommended)

### 2. Environment Variables Setup

#### Vercel (Frontend)

- [ ] Set `NEXTAUTH_SECRET` (from step 1)
- [ ] Set `NEXTAUTH_URL=https://yoohoo.guru`
- [ ] Set `AUTH_COOKIE_DOMAIN=.yoohoo.guru`
- [ ] Verify `GOOGLE_OAUTH_CLIENT_ID` is set
- [ ] Verify `GOOGLE_OAUTH_CLIENT_SECRET` is set
- [ ] Verify Firebase variables are set:
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY`

#### Railway (Backend)

- [ ] Set `NEXTAUTH_SECRET` (same value as Vercel)
- [ ] Verify all existing environment variables are preserved

### 3. Google Cloud Console Configuration

- [ ] Open [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Navigate to APIs & Services > Credentials
- [ ] Select your OAuth 2.0 Client ID

#### Add Authorized JavaScript Origins:

- [ ] https://yoohoo.guru
- [ ] https://www.yoohoo.guru
- [ ] https://coach.yoohoo.guru
- [ ] https://angel.yoohoo.guru
- [ ] https://masters.yoohoo.guru

#### Add Authorized Redirect URIs:

- [ ] https://yoohoo.guru/api/auth/callback/google
- [ ] https://www.yoohoo.guru/api/auth/callback/google
- [ ] https://coach.yoohoo.guru/api/auth/callback/google
- [ ] https://angel.yoohoo.guru/api/auth/callback/google
- [ ] https://masters.yoohoo.guru/api/auth/callback/google

- [ ] Click "Save" in Google Cloud Console

### 4. Vercel Build Configuration

- [ ] Update build command: `cd frontend && npm run build:next`
- [ ] Update install command: `cd frontend && npm install --legacy-peer-deps`
- [ ] Update output directory: `frontend/.next`
- [ ] OR: Keep using Webpack build and run Next.js separately for auth endpoints only

## Deployment

### 5. Deploy Backend (Railway)

- [ ] Push changes to main/production branch
- [ ] Wait for Railway deployment to complete
- [ ] Check deployment logs for errors
- [ ] Verify backend health: `https://api.yoohoo.guru/health`

### 6. Deploy Frontend (Vercel)

- [ ] Merge PR or push to production branch
- [ ] Wait for Vercel deployment to complete
- [ ] Check build logs for errors
- [ ] Note: Build may take 5-10 minutes

## Post-Deployment Testing

### 7. Basic Health Checks

- [ ] Test health endpoint: `https://yoohoo.guru/api/auth/health`
  - Should return 200 status
  - Should include `NEXTAUTH_URL`, `AUTH_COOKIE_DOMAIN`
  - `loggedIn` should be false (no session yet)

- [ ] Check backend health: `https://api.yoohoo.guru/health`
  - Should return 200 status
  - Should show "healthy" status

### 8. Authentication Flow Testing

#### On yoohoo.guru:

- [ ] Navigate to `https://yoohoo.guru/api/auth/signin`
- [ ] Click "Sign in with Google"
- [ ] Complete OAuth flow
- [ ] Should redirect back to yoohoo.guru
- [ ] Check session: `https://yoohoo.guru/api/auth/health`
  - `loggedIn` should be true
  - `user.email` should show your email
  - `user.membershipTier` should show your tier

#### On coach.yoohoo.guru:

- [ ] Navigate to `https://coach.yoohoo.guru/api/auth/health`
- [ ] Should show `loggedIn: true` (session persists!)
- [ ] Should show same user data
- [ ] Verify `host` shows coach.yoohoo.guru

#### On angel.yoohoo.guru:

- [ ] Navigate to `https://angel.yoohoo.guru/api/auth/health`
- [ ] Should show `loggedIn: true` (session persists!)
- [ ] Should show same user data

### 9. Backend API Testing

- [ ] Test authenticated endpoint (use existing React app)
- [ ] Should accept NextAuth session cookie
- [ ] Should still accept Firebase tokens (backward compatibility)
- [ ] Check backend logs for authentication method used

### 10. Browser DevTools Checks

- [ ] Open browser DevTools > Application > Cookies
- [ ] Verify cookie exists: `__Secure-next-auth.session-token`
- [ ] Verify cookie domain: `.yoohoo.guru`
- [ ] Verify cookie flags: `HttpOnly`, `Secure`, `SameSite=Lax`

## Monitoring (First 24 Hours)

### 11. Monitor Logs

- [ ] Vercel deployment logs - watch for errors
- [ ] Railway deployment logs - watch for auth errors
- [ ] Check for failed authentication attempts

### 12. Monitor Metrics

- [ ] Vercel Analytics - check for increased error rates
- [ ] Check `/api/auth/health` periodically
- [ ] Monitor user sign-in success rate

### 13. User Feedback

- [ ] Monitor support email for auth-related issues
- [ ] Check user reports of login problems
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices (iOS, Android)

## Rollback Plan (If Issues Occur)

### 14. Quick Rollback Steps

If critical issues arise:

- [ ] Remove `NEXTAUTH_SECRET` from Vercel environment variables
- [ ] Remove `NEXTAUTH_URL` from Vercel environment variables
- [ ] Remove `AUTH_COOKIE_DOMAIN` from Vercel environment variables
- [ ] Redeploy Vercel (triggers rebuild without NextAuth)
- [ ] Backend automatically falls back to Firebase-only auth
- [ ] Users continue with Firebase authentication (no downtime)

### 15. Post-Rollback

- [ ] Investigate root cause of issues
- [ ] Fix issues in development/staging
- [ ] Re-test thoroughly before re-deploying
- [ ] Document issues and resolutions

## Success Criteria

✅ Deployment is successful when:

- [ ] Health endpoint returns 200 on all domains
- [ ] Users can sign in with Google OAuth
- [ ] Sessions persist across subdomains
- [ ] Backend accepts both NextAuth and Firebase tokens
- [ ] No increase in error rates
- [ ] No user reports of authentication issues

## Notes

- OAuth changes may take 5-10 minutes to propagate
- Clear browser cache if testing immediately after deployment
- Test in incognito/private window to avoid cached sessions
- Keep both authentication methods active during migration period

## Support

If issues arise:
- Check logs in Vercel and Railway dashboards
- Review [docs/auth-audit.md](./docs/auth-audit.md)
- Review [NEXTAUTH_MIGRATION_GUIDE.md](./NEXTAUTH_MIGRATION_GUIDE.md)
- Contact: support@yoohoo.guru

---

**Deployment Date**: _________________

**Deployed By**: _________________

**Issues Encountered**: _________________

**Resolution Time**: _________________
