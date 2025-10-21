# Archive Directory

This directory contains legacy code that has been archived as part of the migration to the gateway architecture.

## Contents

### frontend-legacy/
The original `/frontend` directory containing the React/Webpack frontend code. This has been replaced by the gateway architecture using Next.js in `apps/main`.

**Archived:** October 21, 2025  
**Reason:** Migration to gateway architecture (see GATEWAY_ARCHITECTURE.md)  
**Replacement:** `apps/main` serves all frontend functionality via Edge Middleware

### legacy-individual-apps/
The original individual Next.js apps (angel, coach, heroes, dashboard, and 24 subject apps) that were initially created as separate apps. These have been consolidated into the gateway architecture.

**Archived:** October 21, 2025  
**Reason:** Migration to gateway architecture - all apps now served from `apps/main/pages/_apps/`  
**Replacement:** `apps/main` with subdomain routing via middleware

### legacy-frontend/
Earlier archived frontend files from previous cleanup operations.

### completed-fixes/
Historical fixes and patches that have been applied.

### orphaned-modules/
Detected orphaned modules from dependency analysis.

## Gateway Architecture

The platform now uses a **single gateway architecture** where:
- One Vercel project serves all 29 subdomains
- `apps/main` contains all subdomain pages under `pages/_apps/`
- Edge Middleware routes requests based on subdomain
- No per-app configuration needed

See the following files for more information:
- `GATEWAY_ARCHITECTURE.md` - Complete architecture documentation
- `MONOREPO_README.md` - Repository structure and development
- `README.md` - Main project documentation

## Why Archive Instead of Delete?

These files are archived rather than deleted to:
1. Preserve historical context for future reference
2. Allow recovery if needed during migration verification
3. Maintain a record of the project's evolution
4. Support any needed comparison or debugging

## Note

These archived files are NOT part of the active codebase and should not be referenced or modified. They exist purely for historical purposes.
