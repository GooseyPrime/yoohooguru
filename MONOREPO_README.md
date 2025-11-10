# YooHoo.Guru Monorepo

This is the monorepo for yoohoo.guru, a comprehensive skill-sharing platform. The repository uses Turborepo to manage multiple Next.js applications and shared packages.

## Repository Structure

```
yoohooguru/
├── apps/                    # Next.js application with gateway architecture
│   └── main/               # Single app serving all subdomains
│       ├── middleware.ts   # Edge Middleware for subdomain routing
│       ├── pages/
│       │   ├── _app.tsx
│       │   ├── index.tsx
│       │   └── _apps/      # All subdomain pages consolidated here
│       │       ├── main/           # www.yoohoo.guru
│       │       ├── angel/          # angel.yoohoo.guru
│       │       ├── coach/          # coach.yoohoo.guru
│       │       ├── heroes/         # heroes.yoohoo.guru
│       │       ├── dashboard/      # dashboard.yoohoo.guru
│       │       ├── art/            # art.yoohoo.guru
│       │       ├── business/       # business.yoohoo.guru
│       │       ├── coding/         # coding.yoohoo.guru
│       │       ├── cooking/        # cooking.yoohoo.guru
│       │       ├── crafts/         # crafts.yoohoo.guru
│       │       ├── data/           # data.yoohoo.guru
│       │       ├── design/         # design.yoohoo.guru
│       │       ├── finance/        # finance.yoohoo.guru
│       │       ├── fitness/        # fitness.yoohoo.guru
│       │       ├── gardening/      # gardening.yoohoo.guru
│       │       ├── history/        # history.yoohoo.guru
│       │       ├── home/           # home.yoohoo.guru
│       │       ├── investing/      # investing.yoohoo.guru
│       │       ├── language/       # language.yoohoo.guru
│       │       ├── marketing/      # marketing.yoohoo.guru
│       │       ├── math/           # math.yoohoo.guru
│       │       ├── music/          # music.yoohoo.guru
│       │       ├── photography/    # photography.yoohoo.guru
│       │       ├── sales/          # sales.yoohoo.guru
│       │       ├── science/        # science.yoohoo.guru
│       │       ├── sports/         # sports.yoohoo.guru
│       │       ├── tech/           # tech.yoohoo.guru
│       │       ├── wellness/       # wellness.yoohoo.guru
│       │       └── writing/        # writing.yoohoo.guru
│       └── ...
├── packages/               # Shared packages
│   ├── shared/            # Shared UI components and utilities
│   ├── auth/              # Authentication utilities (NextAuth, Firebase)
│   └── db/                # Database access layer (Firestore)
├── backend/               # Backend API (Railway deployment)
├── frontend/              # Legacy frontend (being migrated)
└── turbo.json            # Turborepo configuration
```

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm >= 9.0.0

### Installation

```bash
# Install dependencies for all workspaces
npm install
```

**Note:** This monorepo uses **Turborepo** for build orchestration. Turborepo is a high-performance build system that:
- Coordinates builds across multiple packages
- Caches build outputs for faster rebuilds
- Runs tasks in parallel when possible
- Manages build dependencies automatically

The `turbo.json` file at the root defines all build tasks and their relationships.

### Development

Run the main app in development mode (all subdomains route through this):

```bash
# Homepage (serves all subdomains via middleware)
npm run dev:main

# Backend API
npm run dev:backend
```

To test different subdomains locally, modify your `/etc/hosts` file:
```
127.0.0.1  www.yoohoo.local
127.0.0.1  angel.yoohoo.local
127.0.0.1  coach.yoohoo.local
```

Then access: `http://www.yoohoo.local:3000`, `http://angel.yoohoo.local:3000`, etc.

### Building

Build the main app (serves all subdomains):

```bash
npm run build
```

This command uses **Turborepo** to orchestrate the build:
- Runs `turbo run build --filter=@yoohooguru/main --filter=yoohooguru-backend`
- Automatically builds dependencies in the correct order
- Caches outputs for faster subsequent builds
- Handles parallel execution when possible

Build specific components individually (for development):

```bash
npm run build:main
npm run build:backend
```

**For production deployments, always use `npm run build`** to leverage Turborepo's build orchestration and caching.

### Testing

Run tests across all workspaces:

```bash
npm test
```

### Linting

Lint all code:

```bash
npm run lint
```

## Deployment

The repository uses a **Gateway Architecture** for deployment - a single Vercel project handles all subdomains via Edge Middleware:

- **Single Vercel project** deploys `apps/main`
- **Edge Middleware** routes subdomains to appropriate pages
- **Wildcard DNS** (`*.yoohoo.guru`) points to one deployment
- **All subdomain pages** consolidated under `apps/main/pages/_apps/`

### Subdomain Mapping

All 29 subdomains are routed through Edge Middleware:

**Core Subdomains (5):**
- `www.yoohoo.guru` → `apps/main/pages/_apps/main`
- `angel.yoohoo.guru` → `apps/main/pages/_apps/angel`
- `coach.yoohoo.guru` → `apps/main/pages/_apps/coach`
- `heroes.yoohoo.guru` → `apps/main/pages/_apps/heroes`
- `dashboard.yoohoo.guru` → `apps/main/pages/_apps/dashboard`

**Subject Subdomains (24):**
- `art.yoohoo.guru` → `apps/main/pages/_apps/art`
- `business.yoohoo.guru` → `apps/main/pages/_apps/business`
- `coding.yoohoo.guru` → `apps/main/pages/_apps/coding`
- `cooking.yoohoo.guru` → `apps/main/pages/_apps/cooking`
- `crafts.yoohoo.guru` → `apps/main/pages/_apps/crafts`
- `data.yoohoo.guru` → `apps/main/pages/_apps/data`
- `design.yoohoo.guru` → `apps/main/pages/_apps/design`
- `finance.yoohoo.guru` → `apps/main/pages/_apps/finance`
- `fitness.yoohoo.guru` → `apps/main/pages/_apps/fitness`
- `gardening.yoohoo.guru` → `apps/main/pages/_apps/gardening`
- `history.yoohoo.guru` → `apps/main/pages/_apps/history`
- `home.yoohoo.guru` → `apps/main/pages/_apps/home`
- `investing.yoohoo.guru` → `apps/main/pages/_apps/investing`
- `language.yoohoo.guru` → `apps/main/pages/_apps/language`
- `marketing.yoohoo.guru` → `apps/main/pages/_apps/marketing`
- `math.yoohoo.guru` → `apps/main/pages/_apps/math`
- `music.yoohoo.guru` → `apps/main/pages/_apps/music`
- `photography.yoohoo.guru` → `apps/main/pages/_apps/photography`
- `sales.yoohoo.guru` → `apps/main/pages/_apps/sales`
- `science.yoohoo.guru` → `apps/main/pages/_apps/science`
- `sports.yoohoo.guru` → `apps/main/pages/_apps/sports`
- `tech.yoohoo.guru` → `apps/main/pages/_apps/tech`
- `wellness.yoohoo.guru` → `apps/main/pages/_apps/wellness`
- `writing.yoohoo.guru` → `apps/main/pages/_apps/writing`

### Vercel Deployment

**One Vercel project for all subdomains:**

1. Connect your repository to Vercel
2. Create a single project with:
   - Root Directory: Leave empty (deploy from root)
   - Build Command: `npm run build` (uses Turborepo)
   - Install Command: `npm ci`
   - Output Directory: `apps/main/.next`
3. Configure environment variables (see `.env.shared.example`)
4. Add all 29 custom domains to the single project
5. Set up wildcard DNS: `*.yoohoo.guru` → Vercel

**Why Turborepo?**
The build command `npm run build` uses Turborepo to:
- Coordinate builds across all workspace packages
- Build shared packages before the main app
- Cache build outputs for faster deployments
- Run builds in parallel when possible

For detailed deployment instructions, see **[GATEWAY_ARCHITECTURE.md](./GATEWAY_ARCHITECTURE.md)**.

### Environment Variables

Each app requires the following environment variables:

```bash
# NextAuth
NEXTAUTH_URL=https://subdomain.yoohoo.guru
NEXTAUTH_SECRET=<secret>

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=<key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<project-id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<bucket>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<sender-id>
NEXT_PUBLIC_FIREBASE_APP_ID=<app-id>

# API
NEXT_PUBLIC_API_URL=https://api.yoohoo.guru

# Auth Cookie Domain (for cross-subdomain auth)
AUTH_COOKIE_DOMAIN=.yoohoo.guru
```

## Shared Packages

### @yoohooguru/shared

Contains shared UI components, utilities, and styles used across all apps.

```typescript
import { Header, Footer, Button, Logo } from '@yoohooguru/shared';
```

### @yoohooguru/auth

Authentication utilities and NextAuth configuration for cross-subdomain authentication.

```typescript
import { authOptions, firebaseConfig } from '@yoohooguru/auth';
```

### @yoohooguru/db

Database access layer providing a unified interface to Firestore.

```typescript
import { getFirestore } from '@yoohooguru/db';
```

## Migration Guide

The repository is transitioning from a single frontend app to a multi-app monorepo structure. See `MIGRATION_GUIDE.md` for details on:

- How the old structure maps to the new structure
- Steps to migrate existing code
- Breaking changes and deprecations

## Architecture

### Authentication

All apps share authentication through:
- NextAuth with cookie domain set to `.yoohoo.guru`
- Firebase for user management
- JWT sessions shared across all subdomains

### Database

All apps connect to a single Firestore database through the `@yoohooguru/db` package. This ensures:
- Consistent data access patterns
- Shared user profiles across subdomains
- Centralized content management

### Backend API

The backend API (`/backend`) serves all apps and provides:
- REST endpoints for data access
- AI content generation
- Third-party integrations (Stripe, etc.)
- Authentication endpoints

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm test`
4. Run linting: `npm run lint`
5. Build to verify: `npm run build`
6. Submit a pull request

## License

MIT
