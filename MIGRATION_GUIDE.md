# Migration Guide: Single Frontend to Multi-App Monorepo

This guide explains how the yoohoo.guru repository structure has been refactored from a single frontend application to a multi-app monorepo using Turborepo.

## Overview

The platform has been restructured to separate each subdomain into its own Next.js application. This provides:

- **Isolation**: Each subdomain has its own codebase, reducing complexity
- **Independent Deployment**: Deploy individual apps without affecting others
- **Shared Code**: Common components and utilities in `packages/shared`
- **Scalability**: Easy to add new subdomains or features

## Structure Mapping

### Old Structure → New Structure

```
OLD:                                  NEW:
frontend/                             
├── src/                              
│   ├── screens/                      
│   │   ├── HomePage.js         →    apps/main/pages/index.tsx
│   │   ├── SkillsPage.js       →    apps/coach/pages/index.tsx
│   │   ├── AngelsListPage.js   →    apps/angel/pages/index.tsx
│   │   ├── ModifiedMasters.js  →    apps/heroes/pages/index.tsx
│   │   ├── DashboardPage.js    →    apps/dashboard/pages/index.tsx
│   │   └── [others]            →    [respective apps]
│   ├── components/                   
│   │   ├── Header.js           →    packages/shared/src/components/Header.tsx
│   │   ├── Footer.js           →    packages/shared/src/components/Footer.tsx
│   │   ├── Button.js           →    packages/shared/src/components/Button.tsx
│   │   └── [others]            →    packages/shared/src/components/
│   └── contexts/                     
│       ├── AuthContext.js      →    packages/auth/src/
│       └── [others]            →    packages/shared/src/contexts/
├── app/                              
│   └── api/auth/[...nextauth]  →    packages/auth/src/nextauth.ts
└── pages/                            
    ├── index.tsx               →    apps/main/pages/index.tsx
    ├── skills.tsx              →    apps/coach/pages/index.tsx
    ├── angels-list.tsx         →    apps/angel/pages/index.tsx
    ├── modified.tsx            →    apps/heroes/pages/index.tsx
    └── dashboard.tsx           →    apps/dashboard/pages/index.tsx
```

## Application Mapping

| Old Route | New App | Subdomain |
|-----------|---------|-----------|
| `/` | `apps/main` | www.yoohoo.guru |
| `/skills` | `apps/coach` | coach.yoohoo.guru |
| `/angels-list` | `apps/angel` | angel.yoohoo.guru |
| `/modified` or `/heroes` | `apps/heroes` | heroes.yoohoo.guru |
| `/dashboard` | `apps/dashboard` | dashboard.yoohoo.guru |
| `/cooking/*` | `apps/cooking` | cooking.yoohoo.guru |
| `/coding/*` | `apps/coding` | coding.yoohoo.guru |
| `/art/*` | `apps/art` | art.yoohoo.guru |
| ... | ... | ... |

## Component Migration

### Before (Old Frontend)

```javascript
// frontend/src/components/HomePage.js
import Header from '../components/Header';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';

function HomePage() {
  // Component code
}
```

### After (New Monorepo)

```typescript
// apps/main/pages/index.tsx
import { Header, Button } from '@yoohooguru/shared';
import { useAuth } from '@yoohooguru/auth';

export default function HomePage() {
  // Component code
}
```

## Shared Package Usage

### Importing from @yoohooguru/shared

```typescript
// Import shared components
import { Header, Footer, Button, Logo } from '@yoohooguru/shared';

// Import hooks
import { useAuth } from '@yoohooguru/auth';

// Import database utilities
import { getFirestore } from '@yoohooguru/db';
```

## Routing Changes

### Old: Internal Routes

```javascript
// Navigate between sections
navigate('/skills')
navigate('/angels-list')
navigate('/dashboard')
```

### New: External Subdomain URLs

```javascript
// Navigate to different apps
window.location.href = 'https://coach.yoohoo.guru'
window.location.href = 'https://angel.yoohoo.guru'
window.location.href = 'https://dashboard.yoohoo.guru'
```

## Authentication

### Old: Single App Auth

Authentication was handled within the single frontend app.

### New: Cross-Subdomain Auth

Authentication is now shared across all apps through:

```typescript
// packages/auth/src/nextauth.ts
export const authOptions = {
  cookies: {
    sessionToken: {
      options: {
        domain: '.yoohoo.guru', // Shares cookie across subdomains
      }
    },
  },
};
```

User sessions persist when navigating between subdomains.

## Environment Variables

### Old Structure

```bash
# .env
REACT_APP_API_URL=...
REACT_APP_FIREBASE_API_KEY=...
```

### New Structure

Each app has its own environment variables, but they're typically the same:

```bash
# apps/main/.env.local
NEXT_PUBLIC_API_URL=https://api.yoohoo.guru
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXTAUTH_URL=https://www.yoohoo.guru
```

```bash
# apps/angel/.env.local
NEXT_PUBLIC_API_URL=https://api.yoohoo.guru
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXTAUTH_URL=https://angel.yoohoo.guru
```

You can also use a shared `.env.shared` file at the root.

## Development Workflow

### Old Workflow

```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

### New Workflow

```bash
# Run all apps in parallel
npm run dev

# Or run specific app
npm run dev:main
npm run dev:angel
npm run dev:coach
```

## Building and Deployment

### Old Deployment

```bash
npm run build:frontend
# Deploy single app to Vercel
```

### New Deployment

```bash
# Build all apps
npm run build

# Or build specific apps
npm run build:main
npm run build:angel
```

Each app is deployed as a separate Vercel project with its own custom domain.

## Breaking Changes

### 1. Import Paths

**Before:**
```javascript
import Header from '../components/Header';
```

**After:**
```typescript
import { Header } from '@yoohooguru/shared';
```

### 2. Navigation

**Before:**
```javascript
navigate('/skills')
```

**After:**
```javascript
window.location.href = 'https://coach.yoohoo.guru'
```

### 3. API Calls

API endpoints remain the same, but ensure you're using the correct API URL for your environment.

### 4. Legacy Routes Removed

The following routes no longer exist in the main app:
- `/skills` (now at coach.yoohoo.guru)
- `/angels-list` (now at angel.yoohoo.guru)
- `/modified` (now at heroes.yoohoo.guru)
- `/dashboard` (now at dashboard.yoohoo.guru)

## Migrating Your Code

### Step 1: Identify Which App

Determine which app your code belongs to:
- Homepage/landing content → `apps/main`
- Skills/coaching features → `apps/coach`
- Angel's List features → `apps/angel`
- Hero Guru's features → `apps/heroes`
- Dashboard features → `apps/dashboard`
- Subject-specific content → respective `apps/*` folder

### Step 2: Move Files

Move your files to the appropriate app's directory structure:

```bash
# Old location
frontend/src/screens/YourComponent.js

# New location
apps/<app-name>/pages/your-route.tsx
# or
apps/<app-name>/components/YourComponent.tsx
```

### Step 3: Update Imports

Change imports to use shared packages:

```typescript
// Old
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

// New
import { Header } from '@yoohooguru/shared';
import { useAuth } from '@yoohooguru/auth';
```

### Step 4: Update Navigation

Change internal routes to external URLs:

```typescript
// Old
navigate('/skills')

// New
window.location.href = 'https://coach.yoohoo.guru'
```

### Step 5: Test

Test your changes:

```bash
# Development
npm run dev:<app-name>

# Build
npm run build:<app-name>
```

## Common Issues

### Issue: Can't import from @yoohooguru/shared

**Solution**: Make sure you've run `npm install` at the root to link workspaces.

### Issue: Environment variables not loading

**Solution**: Create `.env.local` in your app directory and add required variables.

### Issue: Auth not working across subdomains

**Solution**: Ensure `AUTH_COOKIE_DOMAIN=.yoohoo.guru` is set in production environment.

### Issue: Module not found

**Solution**: Check that package.json includes correct dependencies and workspace references.

## Backwards Compatibility

The old `frontend/` directory is being kept temporarily for backwards compatibility. It will be removed once all functionality is migrated to the new app structure.

## Questions?

For questions or issues with migration, please:
1. Check this guide
2. Review MONOREPO_README.md
3. Open an issue on GitHub

## Timeline

- **Phase 1** (Current): Monorepo structure created, core apps deployed
- **Phase 2**: Migrate all functionality from old frontend to new apps
- **Phase 3**: Remove old frontend directory
- **Phase 4**: Full production deployment of all apps
