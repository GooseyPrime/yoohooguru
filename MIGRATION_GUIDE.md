# Migration Guide: Single Frontend to Gateway Architecture

This guide explains how the yoohoo.guru repository structure has been refactored from a single frontend application to a gateway architecture using Edge Middleware for unlimited subdomain support.

## Overview

The platform has been restructured to serve all subdomains through a single Next.js application with intelligent Edge Middleware routing. This provides:

- **Unlimited Subdomains**: No project count limits with gateway architecture
- **Single Deployment**: One build serves all 29 subdomains
- **Shared Code**: Common components and utilities in `packages/shared`
- **Scalability**: Easy to add new subdomains without new deployments
- **Cross-Subdomain Auth**: Seamless authentication across all subdomains

## Structure Mapping

### Old Structure → New Structure

```
OLD:                                  NEW:
frontend/                             
├── src/                              
│   ├── screens/                      
│   │   ├── HomePage.js         →    apps/main/pages/_apps/main/index.tsx
│   │   ├── SkillsPage.js       →    apps/main/pages/_apps/coach/index.tsx
│   │   ├── AngelsListPage.js   →    apps/main/pages/_apps/angel/index.tsx
│   │   ├── ModifiedMasters.js  →    apps/main/pages/_apps/heroes/index.tsx
│   │   ├── DashboardPage.js    →    apps/main/pages/_apps/dashboard/index.tsx
│   │   └── [others]            →    apps/main/pages/_apps/[subdomain]/
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
    ├── index.tsx               →    apps/main/pages/_apps/main/index.tsx
    ├── skills.tsx              →    apps/main/pages/_apps/coach/index.tsx
    ├── angels-list.tsx         →    apps/main/pages/_apps/angel/index.tsx
    ├── modified.tsx            →    apps/main/pages/_apps/heroes/index.tsx
    └── dashboard.tsx           →    apps/main/pages/_apps/dashboard/index.tsx

NEW: Gateway Architecture
apps/main/
├── middleware.ts               →    Edge Middleware for subdomain routing
└── pages/
    └── _apps/
        ├── main/              →    www.yoohoo.guru
        ├── angel/             →    angel.yoohoo.guru
        ├── coach/             →    coach.yoohoo.guru
        ├── heroes/            →    heroes.yoohoo.guru
        ├── dashboard/         →    dashboard.yoohoo.guru
        └── [24 subjects]/     →    [subject].yoohoo.guru
```

## Application Mapping

| Old Route | New Page | Subdomain | Routing |
|-----------|----------|-----------|---------|
| `/` | `apps/main/pages/_apps/main` | www.yoohoo.guru | Edge Middleware |
| `/skills` | `apps/main/pages/_apps/coach` | coach.yoohoo.guru | Edge Middleware |
| `/angels-list` | `apps/main/pages/_apps/angel` | angel.yoohoo.guru | Edge Middleware |
| `/modified` or `/heroes` | `apps/main/pages/_apps/heroes` | heroes.yoohoo.guru | Edge Middleware |
| `/dashboard` | `apps/main/pages/_apps/dashboard` | dashboard.yoohoo.guru | Edge Middleware |
| N/A | `apps/main/pages/_apps/[subject]` | [subject].yoohoo.guru | Edge Middleware |

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

### After (Gateway Architecture)

```typescript
// apps/main/pages/_apps/main/index.tsx
import { Header, Button } from '@yoohooguru/shared';
import { useAuth } from '@yoohooguru/auth';

export default function HomePage() {
  // Component code
}
```

All subdomains are routed through Edge Middleware in `apps/main/middleware.ts`.

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

### New Deployment (Gateway Architecture)

```bash
# Build main app (serves all subdomains)
npm run build:main

# Deploy once to Vercel
vercel --prod
```

The gateway architecture requires only a single Vercel project. All 29 subdomains are added as custom domains to this one project, and Edge Middleware handles the routing.

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

### 4. Subdomain Routing

With the gateway architecture, all subdomains are automatically routed through Edge Middleware. No separate deployments required - just add the domain to your Vercel project.

## Migrating Your Code

### Step 1: Identify Page Location

Determine which subdomain your code belongs to and place it under `apps/main/pages/_apps/[subdomain]/`:
- Homepage/landing content → `apps/main/pages/_apps/main`
- Skills/coaching features → `apps/main/pages/_apps/coach`
- Angel's List features → `apps/main/pages/_apps/angel`
- Hero Guru's features → `apps/main/pages/_apps/heroes`
- Dashboard features → `apps/main/pages/_apps/dashboard`
- Subject-specific content → `apps/main/pages/_apps/[subject]`

### Step 2: Move Files

Move your files to the appropriate subdomain directory:

```bash
# Old location
frontend/src/screens/YourComponent.js

# New location
apps/main/pages/_apps/[subdomain]/your-route.tsx
# or
apps/main/components/YourComponent.tsx
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
# Development (test locally with different subdomains)
npm run dev:main

# Build (single build serves all subdomains)
npm run build:main
```

### Step 6: Deploy

With gateway architecture, deploy once to serve all subdomains:

```bash
vercel --prod
```

Add the subdomain as a custom domain in Vercel dashboard - middleware will handle routing automatically.

## Common Issues

### Issue: Can't import from @yoohooguru/shared

**Solution**: Make sure you've run `npm install` at the root to link workspaces.

### Issue: Environment variables not loading

**Solution**: Create `.env.local` in `apps/main` directory and add required variables. With gateway architecture, you only need one set of environment variables.

### Issue: Subdomain routing not working

**Solution**: Ensure the subdomain is:
1. Added to Vercel project domains
2. Mapped in `apps/main/middleware.ts` SUBDOMAIN_MAP
3. Has a corresponding page at `apps/main/pages/_apps/[subdomain]/index.tsx`

### Issue: Module not found

**Solution**: Check that package.json includes correct dependencies and workspace references.

## Backwards Compatibility

The gateway architecture serves all content from a single deployment at `apps/main`. The Edge Middleware automatically routes requests based on subdomain, so no manual routing configuration is needed.

## Questions?

For questions or issues with migration, please:
1. Check this guide
2. Review GATEWAY_ARCHITECTURE.md
3. Review MONOREPO_README.md
4. Open an issue on GitHub

## Timeline

- **Phase 1** (Completed): Gateway architecture implemented with Edge Middleware
- **Phase 2** (Completed): All 29 subdomains configured and routed
- **Phase 3** (Completed): Documentation updated to reflect gateway architecture
- **Phase 4** (Current): Production deployment of gateway to Vercel
