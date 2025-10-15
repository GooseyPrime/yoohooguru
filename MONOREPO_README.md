# YooHoo.Guru Monorepo

This is the monorepo for yoohoo.guru, a comprehensive skill-sharing platform. The repository uses Turborepo to manage multiple Next.js applications and shared packages.

## Repository Structure

```
yoohooguru/
├── apps/                    # All Next.js applications
│   ├── main/               # www.yoohoo.guru (homepage)
│   ├── angel/              # angel.yoohoo.guru (Angel's List)
│   ├── coach/              # coach.yoohoo.guru (Coach Guru)
│   ├── heroes/             # heroes.yoohoo.guru (Hero Guru's)
│   ├── dashboard/          # dashboard.yoohoo.guru (User Dashboard)
│   ├── cooking/            # cooking.yoohoo.guru
│   ├── coding/             # coding.yoohoo.guru
│   ├── art/                # art.yoohoo.guru
│   ├── business/           # business.yoohoo.guru
│   ├── crafts/             # crafts.yoohoo.guru
│   ├── data/               # data.yoohoo.guru
│   ├── design/             # design.yoohoo.guru
│   ├── finance/            # finance.yoohoo.guru
│   ├── fitness/            # fitness.yoohoo.guru
│   ├── gardening/          # gardening.yoohoo.guru
│   ├── history/            # history.yoohoo.guru
│   ├── home/               # home.yoohoo.guru
│   ├── investing/          # investing.yoohoo.guru
│   ├── language/           # language.yoohoo.guru
│   ├── marketing/          # marketing.yoohoo.guru
│   ├── math/               # math.yoohoo.guru
│   ├── music/              # music.yoohoo.guru
│   ├── photography/        # photography.yoohoo.guru
│   ├── sales/              # sales.yoohoo.guru
│   ├── science/            # science.yoohoo.guru
│   ├── sports/             # sports.yoohoo.guru
│   ├── tech/               # tech.yoohoo.guru
│   ├── wellness/           # wellness.yoohoo.guru
│   └── writing/            # writing.yoohoo.guru
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

### Development

Run all apps in development mode:

```bash
npm run dev
```

Run specific apps:

```bash
# Homepage
npm run dev:main

# Angel's List
npm run dev:angel

# Coach Guru
npm run dev:coach

# Hero Guru's
npm run dev:heroes

# User Dashboard
npm run dev:dashboard

# Backend API
npm run dev:backend
```

### Building

Build all apps:

```bash
npm run build
```

Build specific apps:

```bash
npm run build:main
npm run build:angel
npm run build:coach
npm run build:heroes
npm run build:dashboard
```

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

Each app in the `apps/` directory is deployed to its corresponding subdomain:

- `apps/main` → www.yoohoo.guru
- `apps/angel` → angel.yoohoo.guru
- `apps/coach` → coach.yoohoo.guru
- `apps/heroes` → heroes.yoohoo.guru
- `apps/dashboard` → dashboard.yoohoo.guru
- Subject apps (cooking, coding, etc.) → their respective subdomains

### Vercel Deployment

Each app should be configured as a separate Vercel project:

1. Connect your repository to Vercel
2. Create a new project for each app
3. Set the root directory to the app's directory (e.g., `apps/main`)
4. Configure environment variables for each project
5. Set custom domain for each project

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
