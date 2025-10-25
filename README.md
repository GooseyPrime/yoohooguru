# YooHoo Guru Platform

A 24-subdomain AI-powered content and skill-sharing platform that combines automated content curation with marketplace functionality.

## Platform Overview

YooHooGuru operates as three core services plus 24 thematic content hubs:

### Core Services
1. **Hub** (www.yoohoo.guru) - Main landing page and global entry point
2. **Coach Guru** (coach.yoohoo.guru) - Professional skill-sharing marketplace (15% commission)
3. **Angel's List** (angel.yoohoo.guru) - Local services and gig marketplace (10-15% commission)
4. **Hero Gurus** (heroes.yoohoo.guru) - Community volunteering platform

### 24 Content Hubs
Subject-specific subdomains covering: art, business, coding, cooking, crafts, data, design, finance, fitness, gardening, history, home, investing, language, marketing, math, music, photography, sales, science, sports, tech, wellness, writing

Each subdomain features:
- AI-curated news (2 articles per day, twice daily)
- AI-generated blog posts (1 per week)
- Service marketplace integration
- Lead capture and monetization

## Architecture

### Single-App Monorepo with Middleware Routing
```
yoohooguru/
├── apps/
│   └── main/                    # Single Next.js app serving all 28 subdomains
│       ├── middleware.ts        # Subdomain routing via Edge Middleware
│       ├── pages/
│       │   ├── _apps/          # All 28 subdomain pages
│       │   │   ├── coach/
│       │   │   ├── angel/
│       │   │   ├── art/
│       │   │   └── ... (24 more subject hubs)
│       │   ├── index.tsx        # www.yoohoo.guru homepage
│       │   ├── login.tsx
│       │   └── dashboard.tsx
│       └── components/
│           ├── orbitron/        # Design system components
│           ├── NewsSection.tsx
│           └── BlogList.tsx
├── packages/
│   ├── shared/                  # Shared UI components
│   └── auth/                    # Authentication utilities
├── backend/                     # Express API (Railway)
│   ├── src/
│   │   ├── routes/             # API endpoints
│   │   ├── agents/             # AI content curation agents
│   │   └── config/             # Subdomain configurations
│   └── tests/
├── spec/                        # Platform specifications
│   └── site-spec.md            # Complete platform documentation
└── docs/                        # Additional documentation
```

### Routing Mechanism
- **Middleware-based routing**: apps/main/middleware.ts intercepts subdomain requests
- **Rewrites**: `coach.yoohoo.guru/` → `/_apps/coach/` (internally)
- **User sees**: `coach.yoohoo.guru/` (no URL change)
- **Serves**: `apps/main/pages/_apps/coach/index.tsx`

### Technology Stack
- **Frontend**: Next.js 14, React 18, TailwindCSS 4, Orbitron design system
- **Backend**: Node.js/Express on Railway
- **Database**: Firebase (Firestore + Auth + Storage)
- **Payments**: Stripe + Stripe Connect
- **Deployment**: Vercel (frontend), Railway (backend), Cloudflare (CDN)

## Quick Start

### Prerequisites
- Node.js 20+
- Firebase project
- Stripe account (for payments)

### Installation
```bash
# Clone repository
git clone https://github.com/GooseyPrime/yoohooguru.git
cd yoohooguru

# Install root dependencies
npm install

# Install main app dependencies
cd apps/main && npm install && cd ../..

# Install backend dependencies
cd backend && npm install && cd ..
```

### Environment Setup
```bash
# Frontend (apps/main/.env.local)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

# Backend (backend/.env)
NODE_ENV=development
PORT=3001
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_...
OPENROUTER_API_KEY=your_openrouter_key
```

### Development
```bash
# Run frontend (from apps/main)
cd apps/main
npm run dev
# Access at http://localhost:3000

# Run backend (from backend)
cd backend
npm run dev
# Access at http://localhost:3001
```

### Testing Subdomain Routing Locally
Since middleware relies on hostname detection, local subdomain testing requires host file configuration:

```bash
# Add to /etc/hosts (Mac/Linux) or C:\Windows\System32\drivers\etc\hosts (Windows)
127.0.0.1 coach.localhost
127.0.0.1 art.localhost
127.0.0.1 coding.localhost

# Access at:
# http://localhost:3000 (www)
# http://coach.localhost:3000 (coach subdomain)
# http://art.localhost:3000 (art subdomain)
```

## Deployment

### Vercel (Frontend)
```bash
cd yoohooguru
vercel --prod

# In Vercel Dashboard → Settings:
# - Build Command: cd apps/main && npm run build
# - Output Directory: apps/main/.next
# - Install Command: npm ci && cd apps/main && npm ci
```

**Add all subdomains in Vercel Dashboard → Domains:**
- www.yoohoo.guru
- coach.yoohoo.guru
- angel.yoohoo.guru
- heroes.yoohoo.guru
- dashboard.yoohoo.guru
- [all 24 subject subdomains]

### Railway (Backend)
```bash
cd yoohooguru/backend
railway up

# Or configure in Railway Dashboard:
# - Root Directory: backend
# - Build Command: npm install
# - Start Command: npm start
```

### Environment Variables
- **Vercel**: Add all `NEXT_PUBLIC_*` and `NEXTAUTH_*` variables
- **Railway**: Add `FIREBASE_*`, `STRIPE_*`, `OPENROUTER_API_KEY`, etc.

See [Environment Variables Guide](./docs/ENVIRONMENT_VARIABLES.md) for complete list.

## Recent Fixes (October 2025)

### ✅ Middleware Routing Fixed
- **Issue**: Subdomain pages not appearing in production
- **Root Cause**: Middleware designed for multi-app architecture, conflicting vercel.json redirects
- **Fix**: Refactored middleware for single-app architecture, removed conflicting redirects
- **Status**: Deployed and tested

### 🚧 Orbitron Theme Migration (In Progress)
- **Completed**: Coach subdomain, Login/Signup, Dashboard
- **Pending**: 24 content subdomain pages

## Documentation

- **[Site Specification](./spec/site-spec.md)** - Complete platform architecture and features
- **[Subdomain Content Spec](./docs/subdomain-content-spec.md)** - AI agent configuration
- **[Environment Variables](./docs/ENVIRONMENT_VARIABLES.md)** - Complete env var guide
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment instructions

## Platform Features

### Content Curation (AI Agents)
- **News Agent**: Runs 2x daily (6am, 3pm EST), publishes 2 articles per subdomain
- **Blog Agent**: Runs weekly (Monday 10am EST), publishes 1 blog post per subdomain
- **Monetization**: Embedded affiliate links, lead capture forms

### Marketplace Features
- **Coach Guru**: Skill matching, session booking, Stripe payments
- **Angel's List**: Service listings, project postings, provider ratings
- **Hero Gurus**: Volunteer opportunities, impact tracking

### Authentication
- Email/password + Google OAuth
- Cross-subdomain session sharing (via `.yoohoo.guru` cookie domain)
- Firebase Auth + NextAuth integration

## Testing

```bash
# Backend tests
cd backend
npm test

# QA tests (Playwright)
cd qa
npm test
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/GooseyPrime/yoohooguru/issues)
- **Documentation**: See [/docs](./docs) and [/spec](./spec) directories
- **Email**: support@yoohoo.guru
