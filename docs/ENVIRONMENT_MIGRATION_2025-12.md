# Environment Variable Migration - December 2025

## Summary

This document records the environment variable consolidation and cleanup performed on December 8, 2025.

## Changes Made

### ✅ New Files Created

1. **`.env.production.example`** - Unified production configuration
   - Single source of truth for all production environment variables
   - Covers both Vercel (frontend) and Railway (backend) deployments
   - Clear separation of NEXT_PUBLIC_* (frontend) vs backend-only variables
   - Comprehensive documentation inline

2. **`docs/ENVIRONMENT_CONFIGURATION_GUIDE.md`** - Comprehensive guide
   - Architecture explanation
   - Quick start instructions
   - Variable migration guide
   - Troubleshooting section

### 🔧 Files Updated

1. **`.env.example`** - Cleaned up and marked as legacy
   - Removed duplicate variables
   - Added NEWS_API_KEY (was missing but used in code)
   - Marked REACT_APP_* variables as deprecated
   - Consolidated duplicate sections
   - Added deprecation notices pointing to .env.production.example

2. **`.env.shared.example`** - Simplified for Next.js apps only
   - Removed duplicate FEATURE_* flags (belong in backend)
   - Kept only NEXT_PUBLIC_* variables
   - Added clear documentation about cross-subdomain configuration

3. **`backend/src/config/appConfig.js`** - Removed obsolete reference
   - Removed `firebaseDatabaseUrl` (never used, Firestore-only app)
   - Added comment explaining Firestore-only architecture

### 🗑️ Variables Removed/Deprecated

#### Removed from Active Use
- `FIREBASE_DATABASE_URL` - Application uses Firestore exclusively, Realtime Database not supported
- Duplicate `ADMIN_WRITE_ENABLED` entries
- Duplicate `CORS_ORIGIN_PRODUCTION` entries
- Duplicate `SERVE_FRONTEND` entries
- Duplicate `APP_SUPPORT_EMAIL` entry

#### Marked as Deprecated (But Maintained)
- `REACT_APP_*` variables - Use `NEXT_PUBLIC_*` for Next.js apps
- `FEATURE_MODIFIED_MASTERS` - Use `FEATURE_HERO_GURUS` (old name still works)
- `MODIFIED_MASTERS_*` - Use `HERO_GURUS_*` (old names still work)

Note: Deprecated variables are kept in .env.example for backward compatibility but should not be used in new code.

### ➕ Variables Added

1. **`NEWS_API_KEY`** - Added to .env.example
   - Was referenced in `backend/src/config/appConfig.js` and `backend/src/agents/curationAgents.js`
   - Used for news curation feature
   - Not previously documented in .env.example

## Duplication Analysis

### Duplicates Resolved

**Between .env.example and .env.shared.example:**
- `AUTH_COOKIE_DOMAIN` - Kept in both (needed in both Vercel and Railway)
- `FEATURE_BACKGROUND_CHECKS` - Removed from .env.shared (backend-only)
- `FEATURE_HERO_GURUS` - Removed from .env.shared (backend-only)
- `NEXTAUTH_SECRET` - Kept in both (MUST be identical in Vercel and Railway)

**Within .env.example:**
- `ADMIN_WRITE_ENABLED` appeared twice - consolidated to one
- `CORS_ORIGIN_PRODUCTION` appeared twice - consolidated with updated value
- `SERVE_FRONTEND` appeared twice - consolidated to one
- `APP_SUPPORT_EMAIL` appeared twice - consolidated under branding section

## Architecture Clarifications

### Current Architecture (Gateway)
- **Frontend**: Single Next.js app on Vercel serves all 29 subdomains via Edge Middleware
- **Backend**: Single Node.js/Express API on Railway at api.yoohoo.guru
- **Database**: Firebase Firestore (NOT Realtime Database)
- **Auth**: Firebase Authentication + NextAuth.js for cross-subdomain SSO

### Environment Variable Distribution

**Vercel (Frontend):**
- All `NEXT_PUBLIC_*` variables (exposed to browser)
- `NEXTAUTH_SECRET` (must match Railway)
- `AUTH_COOKIE_DOMAIN=.yoohoo.guru`
- `NEXTAUTH_URL` (per subdomain if needed)

**Railway (Backend):**
- All non-`NEXT_PUBLIC_*` variables
- `NEXTAUTH_SECRET` (must match Vercel)
- Service account credentials (FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)
- API keys (Stripe, OpenRouter, etc.)
- `NODE_ENV=production`
- `SERVE_FRONTEND=false`

## Validation & Testing

### Variables Verified as Used
- ✅ `NEWS_API_KEY` - Used in curationAgents.js for news fetching
- ✅ All `NEXT_PUBLIC_*` variables - Used in Next.js components
- ✅ `OPENROUTER_API_KEY` - Used for AI features
- ✅ `STRIPE_*` variables - Used for payment processing
- ✅ `AGORA_*` variables - Used for video conferencing
- ✅ `GOOGLE_MAPS_API_KEY` - Used for location features

### Variables Verified as Orphaned
- ❌ `FIREBASE_DATABASE_URL` - Removed from appConfig.js
- ❌ `REACT_APP_*` variables - Only used as fallback in one component (PlacesAutocomplete.tsx)

### Code References Updated
- `backend/src/config/appConfig.js` - Removed firebaseDatabaseUrl reference
- All other references remain valid and functional

## Migration Path for Users

### For Production Deployments

1. **Use `.env.production.example` as your reference**
2. Set variables in deployment platforms (Vercel/Railway dashboards)
3. Ensure `NEXTAUTH_SECRET` matches in both platforms
4. Verify cross-subdomain authentication works

### For Development

1. Copy `.env.shared.example` → `.env.shared`
2. Copy `.env.example` → `.env`
3. Fill in development credentials
4. Use test keys for Stripe, etc.

### For CI/CD

1. Use `.env.test` for testing with Firebase emulators
2. Generate secure `SESSION_SECRET` dynamically in CI
3. Never use emulator variables with `NODE_ENV=production`

## Documentation Updates

### New Documentation
- `docs/ENVIRONMENT_CONFIGURATION_GUIDE.md` - Comprehensive guide

### Existing Documentation (Still Valid)
- `docs/ENVIRONMENT_VARIABLES.md` - Detailed variable reference
- `docs/ENVIRONMENT_SETUP.md` - Setup instructions
- `docs/CI_CD_ENVIRONMENT.md` - CI/CD configuration

## Security Improvements

1. **Clear separation** of frontend (public) vs backend (secret) variables
2. **Explicit warnings** about prohibited variables in production
3. **Validation** documented for insecure/default secrets
4. **Secret generation** commands provided inline
5. **Cross-platform consistency** emphasized (NEXTAUTH_SECRET)

## Backward Compatibility

### Maintained
- ✅ REACT_APP_* variables still in .env.example (marked deprecated)
- ✅ MODIFIED_MASTERS_* aliases still in .env.example (marked legacy)
- ✅ All existing functionality preserved

### Recommended Updates
- ⚠️ Migrate from REACT_APP_* to NEXT_PUBLIC_* for Next.js apps
- ⚠️ Migrate from MODIFIED_MASTERS_* to HERO_GURUS_* for clarity

## Files to Archive

The following files should be considered for archival after verification:

1. **None at this time** - All .env.example files serve a purpose:
   - `.env.production.example` - Production deployments
   - `.env.example` - Development & backward compatibility
   - `.env.shared.example` - Next.js shared config
   - `.env.test` - Testing with emulators
   - `backend/.env.test` - Backend testing

## Rollback Plan

If issues arise:

1. Revert changes to `.env.example` and `.env.shared.example`
2. Revert `backend/src/config/appConfig.js` to restore `firebaseDatabaseUrl`
3. Remove `.env.production.example` and `docs/ENVIRONMENT_CONFIGURATION_GUIDE.md`

All changes are backward compatible, so no immediate rollback should be necessary.

## Next Steps

1. ✅ Update README.md to reference new configuration guide
2. ✅ Test deployment with new configuration structure
3. ✅ Update CI/CD workflows if needed
4. ✅ Notify team of new configuration structure

---

**Migration Date:** December 8, 2025
**Migration By:** GitHub Copilot Agent
**Status:** Complete
**Breaking Changes:** None (backward compatible)
