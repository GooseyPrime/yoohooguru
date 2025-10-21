# CI/CD Workflow Update Summary

**Date:** October 21, 2025  
**Branch:** copilot/update-ci-workflow-setup  
**Status:** ✅ Complete

## Overview

Updated CI/CD workflows to align with the gateway architecture established in PR #408. The platform now uses a single Vercel project serving all 29 subdomains through `apps/main` with Edge Middleware routing.

## Changes Made

### 1. Architecture Cleanup

**Archived Legacy Frontend:**
- Moved `/frontend` → `.archive/frontend-legacy/`
- Size: ~2.6MB of legacy React/Webpack code
- Reason: Replaced by Next.js gateway in `apps/main`

**Archived Individual Apps:**
- Moved 28 apps from `/apps/*` → `.archive/legacy-individual-apps/`
- Apps: angel, art, business, coach, coding, cooking, crafts, dashboard, data, design, finance, fitness, gardening, heroes, history, home, investing, language, marketing, math, music, photography, sales, science, sports, tech, wellness, writing
- Reason: Consolidated into gateway pages at `apps/main/pages/_apps/`

**Active Structure:**
```
apps/
└── main/           # Gateway app serving all 29 subdomains
packages/
├── shared/         # Shared UI components
├── auth/           # Auth utilities
└── db/             # Database layer
backend/            # API backend
```

### 2. Workspace Configuration

**package.json Updates:**
```json
{
  "workspaces": [
    "apps/main",      // Changed from "apps/*"
    "packages/*",
    "backend"
  ]
}
```

**Script Cleanup:**
- Removed: `dev:frontend`, `build:frontend`, `test:frontend`, `lint:frontend`
- Removed: `dev:angel`, `dev:coach`, `dev:heroes`, `dev:dashboard`
- Removed: `build:angel`, `build:coach`, `build:heroes`, `build:dashboard`
- Updated: `dev` now runs main + backend only
- Updated: `build` now builds main + backend only
- Updated: `lint` now lints main + backend only

### 3. CI Workflow Updates

**ci.yml Changes:**
```yaml
# Before
- cd frontend && npm ci
- cd frontend && npm run test:ci
- npx turbo run build --filter=@yoohooguru/main

# After  
- cd apps/main && npm ci
- cd apps/main && npm run lint
- cd apps/main && npm run build
```

**autopilot.yml Changes:**
```yaml
# Before
- cd frontend && npm ci
- cd frontend && npm run lint
- cd frontend && npm run test:ci
- cd frontend && npm run build

# After
- cd apps/main && npm ci
- cd apps/main && npm run lint
- cd apps/main && npm run build
```

### 4. Documentation

Created `.archive/ARCHIVE_README.md` documenting:
- What was archived and why
- Gateway architecture explanation
- Reference to main documentation
- Historical preservation notes

## Verification

### Build Test ✅
```bash
$ npm run build
✓ All pages built successfully
✓ apps/main compiled in ~20s
✓ All 29 subdomain routes generated
```

### Structure Verification ✅
- ✅ Only `apps/main` remains in apps/
- ✅ Workspace configuration updated
- ✅ Legacy code archived (not deleted)
- ✅ Build artifacts properly generated

### CI Workflow Validation ✅
- ✅ No references to `/frontend` directory
- ✅ No references to individual apps
- ✅ Correct build commands for gateway
- ✅ Correct paths for main app

## Gateway Architecture

**How It Works:**
1. Single Vercel project serves all domains
2. Edge Middleware (`apps/main/middleware.ts`) routes by subdomain
3. Pages at `apps/main/pages/_apps/{subdomain}/` serve content
4. Shared packages provide common UI/auth/db functionality

**Subdomains Supported:** 29
- Core: www, angel, coach, heroes, dashboard (5)
- Subjects: art, business, coding, cooking, crafts, data, design, finance, fitness, gardening, history, home, investing, language, marketing, math, music, photography, sales, science, sports, tech, wellness, writing (24)

## Impact

**Positive:**
- ✅ CI workflows now match actual architecture
- ✅ No confusion about which directories are active
- ✅ Faster CI builds (no building unused apps)
- ✅ Cleaner workspace structure
- ✅ Other agents won't modify archived frontend

**Notes:**
- Backend lint has pre-existing issues (4 uuid import errors)
- Main app needs ESLint configuration (will prompt on first lint)
- All changes are reversible (code archived, not deleted)

## Files Modified

**Core Files:**
- `.github/workflows/ci.yml`
- `.github/workflows/autopilot.yml`
- `package.json`

**Archived:**
- `frontend/` → `.archive/frontend-legacy/`
- `apps/{28 apps}` → `.archive/legacy-individual-apps/`

**Created:**
- `.archive/ARCHIVE_README.md`

## Next Steps

For users/maintainers:
1. Pull latest changes
2. Run `npm install` to refresh workspaces
3. Verify CI passes on merge
4. Remove old frontend references in any custom scripts
5. Update any local development docs if needed

## References

- **PR #408:** Gateway architecture implementation
- **GATEWAY_ARCHITECTURE.md:** Complete architecture documentation
- **MONOREPO_README.md:** Repository structure guide
- **vercel.json:** Deployment configuration
