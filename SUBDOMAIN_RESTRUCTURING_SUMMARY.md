# Subdomain Restructuring Summary

## Overview

This PR implements the subdomain restructuring as outlined in the issue "Dashboard content". The changes update the yoohoo.guru platform to direct users to subdomain-specific URLs and rename the "Modified Masters" program to "Hero Guru's" throughout the codebase.

## Key Changes

### 1. Homepage Updates

**File: `frontend/src/screens/HomePage.js`**

- Added new hero tagline section: "Learn. Earn. Empower."
- Updated hero tagline content with structured text highlighting the three main paths
- Updated the three main tiles to link to subdomains:
  - **SkillShare with Coach Guru** → `https://coach.yoohoo.guru`
  - **Angel's List** → `https://angel.yoohoo.guru`
  - **Hero Guru's** → `https://heroes.yoohoo.guru`
- Changed navigation buttons to use external subdomain URLs instead of internal routes

### 2. Navigation Updates

**File: `frontend/src/components/Header.js`**

- Updated navigation menu to use external subdomain links:
  - Home → `https://www.yoohoo.guru` (internal route)
  - Angel's List → `https://angel.yoohoo.guru`
  - Coach Guru → `https://coach.yoohoo.guru`
  - Hero Guru's → `https://heroes.yoohoo.guru`
  - Dashboard → `https://dashboard.yoohoo.guru`
- Renamed "Modified Masters" to "Hero Guru's" in navigation
- Changed "SkillShare" to "Coach Guru"

### 3. Renamed Modified Masters to Hero Guru's

The following files were updated to reflect the new branding:

#### Frontend Files:
- `frontend/src/screens/ModifiedMasters.js` - Updated component name to `HeroGurus`, page title, and API endpoints
- `frontend/src/components/AppRouter.js` - Added `/heroes` route, kept `/modified` for backwards compatibility
- `frontend/src/hosting/hostRules.js` - Added `isHeroesHost()`, updated routing logic, kept legacy aliases
- `frontend/src/screens/BlogPage.js` - Updated blog post content
- `frontend/src/components/LocationMap.js` - Updated category dropdown
- `frontend/src/components/AccessibilityToolbar.js` - Updated comment
- `frontend/src/utils/http.js` - Updated comment

#### Backend Files:
- `backend/src/config/appConfig.js` - Added new `featureHeroGurus` and related config variables
- `backend/src/index.js` - Mounted routes at `/api/heroes` (primary) and `/api/modified-masters` (legacy)
- `backend/src/routes/modifiedMasters.js` - Updated comments and descriptions

#### Documentation:
- `docs/ACCESSIBILITY.md` - Updated all references
- `docs/HERO_GURUS_SESSIONS.md` (renamed from `MODIFIED_MASTERS_SESSIONS.md`)
- `docs/FIRESTORE_API_REFERENCE.md` - Updated API examples

#### Configuration:
- `.env.example` - Added new `HERO_GURUS_*` environment variables, kept legacy `MODIFIED_MASTERS_*` for backwards compatibility

### 4. Cross-Subdomain Authentication

The authentication configuration was already properly set up for cross-subdomain support:

**File: `frontend/app/api/auth/[...nextauth]/route.ts`**

- Cookie domain is configured as `.yoohoo.guru` in production
- Redirect callback allows navigation to all `*.yoohoo.guru` subdomains
- Session tokens are shared across all subdomains

### 5. Subdomain Routing Logic

**File: `frontend/src/hosting/hostRules.js`**

Updated subdomain detection and routing:
- Added `isHeroesHost()` to detect `heroes.yoohoo.guru`
- Updated `getSubdomainRoute()` to return `/heroes` for the heroes subdomain
- Updated `getSubdomainType()` to return `'heroes'` instead of `'masters'`
- Added `isHeroGurusEnabled()` function
- Kept legacy function names as aliases for backwards compatibility

### 6. Backend Configuration

**File: `backend/src/config/appConfig.js`**

Added new configuration options:
- `featureHeroGurus` - Primary feature flag
- `heroGurusDonateUrl` - Donation URL
- `heroGurusEnableSubdomain` - Subdomain feature flag
- `heroGurusRequireReview` - Moderation flag

All new variables fallback to legacy `MODIFIED_MASTERS_*` environment variables for backwards compatibility.

## Backwards Compatibility

To ensure a smooth transition, the following backwards compatibility measures were implemented:

### Frontend:
1. Legacy route `/modified` still works and redirects to Hero Guru's content
2. `isMastersHost()` function is aliased to `isHeroesHost()`
3. `isModifiedMastersEnabled()` is aliased to `isHeroGurusEnabled()`
4. Component export includes legacy `ModifiedMasters` name

### Backend:
1. Legacy API endpoint `/api/modified-masters` still works alongside `/api/heroes`
2. Both `FEATURE_MODIFIED_MASTERS` and `FEATURE_HERO_GURUS` environment variables are supported
3. All legacy config variables still work and are mapped to new ones
4. Database field `modifiedMastersSkills` remains unchanged (no data migration required)

### Environment Variables:
Both old and new environment variable names are supported:
- `FEATURE_HERO_GURUS` or `FEATURE_MODIFIED_MASTERS`
- `HERO_GURUS_DONATE_URL` or `MODIFIED_MASTERS_DONATE_URL`
- `HERO_GURUS_ENABLE_SUBDOMAIN` or `MODIFIED_MASTERS_ENABLE_SUBDOMAIN`
- `HERO_GURUS_REQUIRE_REVIEW` or `MODIFIED_MASTERS_REQUIRE_REVIEW`

## Deployment Notes

### DNS Configuration Required

The following subdomains need to be configured in your DNS and hosting provider (Vercel/Railway):

1. `angel.yoohoo.guru` - Angel's List micro-jobs platform
2. `coach.yoohoo.guru` - SkillShare coaching platform
3. `heroes.yoohoo.guru` - Hero Guru's accessible learning (formerly Modified Masters)
4. `dashboard.yoohoo.guru` - User dashboard

### Environment Variables

When deploying, you can use either the new `HERO_GURUS_*` variables or keep the existing `MODIFIED_MASTERS_*` variables. Both will work.

For new deployments, we recommend using:
```bash
FEATURE_HERO_GURUS=true
HERO_GURUS_DONATE_URL=<your-donation-url>
HERO_GURUS_ENABLE_SUBDOMAIN=true
HERO_GURUS_REQUIRE_REVIEW=false
```

### Cookie Domain

Ensure the `AUTH_COOKIE_DOMAIN` environment variable is set to `.yoohoo.guru` in production to enable cross-subdomain authentication.

## Testing Recommendations

1. **Homepage Navigation**: Verify all three cards link to correct subdomains
2. **Header Navigation**: Test all navigation links point to correct subdomains
3. **Hero Guru's Access**: 
   - Test accessing via `https://heroes.yoohoo.guru`
   - Test legacy route `/modified` still works
   - Verify page displays "Hero Guru's" branding
4. **Cross-Subdomain Auth**: 
   - Login on one subdomain
   - Navigate to another subdomain
   - Verify user remains authenticated
5. **API Endpoints**:
   - Test `/api/heroes/*` endpoints work
   - Test legacy `/api/modified-masters/*` endpoints still work
6. **Environment Variables**: Test that both old and new variable names work

## Future Considerations

### Potential Follow-up Tasks (Out of Scope for This PR):

1. **Data Migration**: Consider migrating database field `modifiedMastersSkills` to `heroGurusSkills` in a separate migration PR
2. **Complete Subdomain Separation**: Create separate Next.js apps under `/apps` directory as originally outlined in the issue (major architecture change)
3. **Remove Legacy Support**: After sufficient time, remove backwards compatibility aliases and legacy routes
4. **Update Analytics**: Update analytics tracking to use new subdomain names
5. **Marketing Materials**: Update any external marketing materials that reference "Modified Masters"

### Monorepo Structure (Not Implemented)

The original issue requested a full monorepo structure under `/apps`, but given the instruction to make **minimal changes**, this PR focuses on:
- Updating navigation to point to subdomain URLs
- Renaming the program throughout the codebase
- Maintaining backwards compatibility

A full monorepo restructure with separate Next.js apps for each subdomain would be a much larger change requiring:
- Creating separate Next.js apps under `/apps/*`
- Splitting shared code into packages
- Updating build and deployment processes
- Restructuring CI/CD pipelines
- Potentially introducing tools like Turborepo or Nx

This can be addressed in a future PR if desired.

## Files Changed

### Frontend (12 files):
- `frontend/src/screens/HomePage.js`
- `frontend/src/screens/ModifiedMasters.js`
- `frontend/src/screens/BlogPage.js`
- `frontend/src/components/Header.js`
- `frontend/src/components/AppRouter.js`
- `frontend/src/components/AccessibilityToolbar.js`
- `frontend/src/components/LocationMap.js`
- `frontend/src/hosting/hostRules.js`
- `frontend/src/utils/http.js`

### Backend (3 files):
- `backend/src/config/appConfig.js`
- `backend/src/index.js`
- `backend/src/routes/modifiedMasters.js`

### Documentation (4 files):
- `.env.example`
- `docs/ACCESSIBILITY.md`
- `docs/HERO_GURUS_SESSIONS.md` (renamed)
- `docs/FIRESTORE_API_REFERENCE.md`

## Summary

This PR successfully implements the core requirements of the issue:
✅ Updated homepage with new hero content and subdomain links
✅ Updated navigation to link to subdomains
✅ Renamed "Modified Masters" to "Hero Guru's" throughout the codebase
✅ Maintained backwards compatibility for smooth transition
✅ Updated documentation
✅ Verified cross-subdomain authentication configuration

The changes are minimal and focused on the immediate user-facing updates while preserving system stability through backwards compatibility.
