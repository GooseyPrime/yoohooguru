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

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Vercel Edge Network                           │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Edge Middleware (middleware.ts)                           │ │
│  │  - Subdomain detection and routing                         │ │
│  │  - Rewrites subdomain.yoohoo.guru → /_apps/subdomain/     │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js Application                         │
│                         (apps/main)                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Pages Structure:                                          │ │
│  │  - pages/index.tsx (www.yoohoo.guru)                      │ │
│  │  - pages/_apps/coach/ (coach.yoohoo.guru)                 │ │
│  │  - pages/_apps/angel/ (angel.yoohoo.guru)                 │ │
│  │  - pages/_apps/[subject]/ (24 content hubs)               │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (API Requests)
┌─────────────────────────────────────────────────────────────────┐
│                    Railway Backend API                           │
│                       (backend/src)                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Express Routes:                                           │ │
│  │  - /api/auth - Authentication                              │ │
│  │  - /api/users - User management                            │ │
│  │  - /api/skills - Skill marketplace                         │ │
│  │  - /api/exchanges - Skill exchanges                        │ │
│  │  - /api/payments - Stripe integration                      │ │
│  │  - /api/admin/curate - AI content generation              │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  AI Curation Agents (cron scheduled):                      │ │
│  │  - News Agent: 6 AM & 3 PM EST (2 articles/subdomain)     │ │
│  │  - Blog Agent: Monday 10 AM EST (1 post/subdomain)        │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Firebase Services                          │
│  ┌──────────────────────┐  ┌──────────────────────────────────┐ │
│  │   Authentication     │  │         Firestore DB             │ │
│  │  - Email/Password    │  │  Collections:                    │ │
│  │  - Google OAuth      │  │  - users                         │ │
│  │  - Session tokens    │  │  - skills                        │ │
│  └──────────────────────┘  │  - exchanges                     │ │
│                            │  - news (AI-curated)             │ │
│  ┌──────────────────────┐  │  - blogs (AI-curated)            │ │
│  │      Storage         │  │  - services (Angel's List)       │ │
│  │  - User avatars      │  │  - sessions (Coach Guru)         │ │
│  │  - Document uploads  │  │  - volunteers (Hero Gurus)       │ │
│  └──────────────────────┘  └──────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     External Services                            │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│  │    Stripe    │  │  OpenRouter  │  │   Google Maps API   │   │
│  │   Payments   │  │  AI Content  │  │  Location Services  │   │
│  └──────────────┘  └──────────────┘  └─────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Patterns

#### 1. User Authentication Flow
```
User → Next.js → NextAuth → Firebase Auth → Session Cookie (domain: .yoohoo.guru)
```
- Cross-subdomain authentication via shared cookie domain
- JWT tokens stored in HTTP-only cookies
- Firebase custom tokens for API authentication

#### 2. Content Serving Flow (Static)
```
Request → Vercel Edge → Middleware → Next.js SSG → CDN Cache
```
- Pages are statically generated at build time
- Edge middleware handles subdomain routing
- Content served from Vercel's global CDN

#### 3. API Request Flow (Dynamic)
```
User → Next.js → Railway API → Firebase Firestore → Response
```
- Client-side fetches to `https://api.yoohoo.guru`
- Express middleware validates JWT tokens
- Firestore queries with security rules enforcement

#### 4. AI Content Curation Flow
```
Cron Schedule → Curation Agent → OpenRouter AI → Firebase Firestore → Next.js Revalidation
```
- Automated content generation on schedule
- News: 2x daily (6 AM, 3 PM EST) - 2 articles per subdomain
- Blogs: Weekly (Monday 10 AM EST) - 1 post per subdomain
- Content stored in Firestore with subdomain tagging

#### 5. Payment Processing Flow
```
User → Stripe Checkout → Webhook → Railway API → Firebase Update → Email Notification
```
- Stripe hosted checkout for payments
- Webhook events processed by backend
- Transaction records stored in Firestore

### Single-App Monorepo with Middleware Routing
```
yoohooguru/
├── apps/
│   └── main/                    # Single Next.js app serving all 29 subdomains
│       ├── middleware.ts        # Subdomain routing via Edge Middleware
│       ├── pages/
│       │   ├── _apps/          # All 29 subdomain pages
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

The platform uses a sophisticated middleware-based routing system to serve all 29 subdomains from a single Next.js application.

#### How It Works
- **Middleware-based routing**: `apps/main/middleware.ts` intercepts all subdomain requests
- **Rewrites**: `coach.yoohoo.guru/` → `/_apps/coach/` (internally)
- **User sees**: `coach.yoohoo.guru/` (no URL change)
- **Serves**: `apps/main/pages/_apps/coach/index.tsx`

#### Page Structure
```
apps/main/pages/
├── index.tsx                    # www.yoohoo.guru (main landing)
├── login.tsx                    # Centralized authentication
├── signup.tsx                   # Centralized registration
├── terms.tsx                    # Terms of service
├── privacy.tsx                  # Privacy policy
├── safety.tsx                   # Safety guidelines
├── contact.tsx                  # Contact page
├── faq.tsx                      # FAQ
├── help.tsx                     # Help center
├── pricing.tsx                  # Pricing information
├── how-it-works.tsx            # How it works
├── hubs.tsx                     # Community hubs
├── about.tsx                    # About page
└── _apps/                       # Subdomain pages
    ├── coach/                   # coach.yoohoo.guru
    │   ├── index.tsx           # Landing page
    │   ├── experts.tsx         # Expert listings
    │   └── session/            # Session pages
    ├── angel/                   # angel.yoohoo.guru
    ├── heroes/                  # heroes.yoohoo.guru
    │   ├── index.tsx           # Landing page
    │   ├── profile.tsx         # User profile
    │   └── skills.tsx          # Skills marketplace
    ├── art/                     # art.yoohoo.guru
    ├── business/                # business.yoohoo.guru
    └── [22 more subdomains]/    # Other content hubs
```

#### Shared Pages Across Subdomains

All authentication and legal pages are centralized on `www.yoohoo.guru` and accessed via redirects:

**Centralized Pages:**
- `/login` - Sign in page (NextAuth with Google OAuth)
- `/signup` - Registration page
- `/terms` - Terms of service
- `/privacy` - Privacy policy
- `/safety` - Safety guidelines
- `/contact` - Contact page
- `/faq` - Frequently asked questions
- `/help` - Help center
- `/pricing` - Pricing information
- `/how-it-works` - Platform guide
- `/hubs` - Community hubs overview
- `/about` - About the platform

**Subdomain Redirects:**
When users visit these pages on any subdomain (e.g., `heroes.yoohoo.guru/login`), they are automatically redirected to the main site (e.g., `www.yoohoo.guru/login`). This ensures:
- **Consistent authentication** across all subdomains
- **Single source of truth** for legal and support pages
- **Easier maintenance** - update once, applies everywhere
- **Better SEO** - canonical URLs on main domain

**Configuration:**
Redirects are configured in `vercel.json`:
```json
{
  "redirects": [
    {
      "source": "/login",
      "has": [{"type": "host", "value": "(art|business|...).yoohoo.guru"}],
      "destination": "https://www.yoohoo.guru/login",
      "permanent": false
    }
    // ... similar redirects for all shared pages
  ]
}
```

#### Authentication Flow

**Cross-Subdomain Authentication:**
1. User signs in at `www.yoohoo.guru/login`
2. NextAuth creates session with cookie domain `.yoohoo.guru`
3. Session is valid across all subdomains
4. User can navigate to any subdomain while staying authenticated

**Authentication Terminology:**
- **Primary CTA**: "Get Started" (for new users)
- **Secondary CTA**: "Sign In" (for existing users)
- **URLs**: `/signup` and `/login` (SEO-friendly)
- **Page Titles**: "Sign Up" and "Sign In"

**NextAuth Configuration:**
- Located at: `apps/main/pages/api/auth/[...nextauth].ts`
- Providers: Google OAuth, Email/Password
- Session: JWT with HTTP-only cookies
- Cookie Domain: `.yoohoo.guru` (works across all subdomains)
- Shared package: `@yoohooguru/auth` for configuration

### Technology Stack### Technology Stack
- **Frontend**: Next.js 14, React 18, TailwindCSS 4, Orbitron design system
- **Backend**: Node.js/Express on Railway
- **Database**: Firebase (Firestore + Auth + Storage)
- **Payments**: Stripe + Stripe Connect
- **Deployment**: Vercel (frontend), Railway (backend), Cloudflare (CDN)

## Quick Start

### Prerequisites
- Node.js 20+
- npm 10+ (uses workspaces)
- Firebase project with Firestore and Auth enabled
- Stripe account (for payments)
- Railway account (for backend deployment)
- Vercel account (for frontend deployment)

### Development Installation
```bash
# Clone repository
git clone https://github.com/GooseyPrime/yoohooguru.git
cd yoohooguru

# Install all dependencies (uses npm workspaces)
npm install

# Verify installation (optional - builds individual apps for development)
npm run build:main  # Build frontend only
npm run build:backend  # Build backend only
```

> **Note:** For development, you can build individual apps using `npm run build:main` or `npm run build:backend`. However, for production builds and deployment, always use the root-level `npm run build` command which uses **Turborepo** to coordinate builds across all workspaces.

### Production Installation
For production deployments, use `npm ci` for reproducible builds:

```bash
# Clean install from package-lock.json (production-ready)
npm ci

# Build for production (uses Turborepo to coordinate builds)
npm run build
```

> **Important:** The root `npm run build` command uses **Turborepo** to orchestrate the build process across all workspace packages. Turborepo:
> - Handles build dependencies automatically
> - Caches build outputs for faster rebuilds
> - Runs builds in parallel when possible
> - Ensures packages are built in the correct order
> 
> Always use this command for production builds rather than building individual packages.

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

## Production Deployment

### Overview
The platform uses a **gateway architecture** with a single Next.js app serving all 29 subdomains through Edge Middleware. This provides unlimited subdomain support without Vercel's project limits.

### Architecture Components
```
User Request → Vercel (Edge Middleware) → Next.js App → API Requests → Railway Backend → Firebase
                     ↓
            Subdomain Routing
        (coach.yoohoo.guru → /_apps/coach/)
```

### Vercel (Frontend) - Production Deployment

**Prerequisites:**
- Vercel account connected to your GitHub repository
- All 29 custom domains configured in DNS

**Configuration in Vercel Dashboard:**

1. **Build Settings:**
   ```
   Framework Preset: Next.js
   Root Directory: (leave empty)
   Build Command: npm run build
   Output Directory: apps/main/.next
   Install Command: npm ci
   Node.js Version: 20.x
   ```
   
   > **Note:** The build command `npm run build` uses **Turborepo** to coordinate builds across all workspace packages. This ensures the frontend and any shared packages are built in the correct order with optimal caching.
   >
   > **What is Turborepo?**
   > Turborepo is a high-performance build system for JavaScript/TypeScript monorepos. It:
   > - Coordinates builds across multiple packages in the workspace
   > - Caches build outputs to speed up subsequent builds
   > - Runs tasks in parallel when dependencies allow
   > - Manages build dependencies automatically
   >
   > The `turbo.json` file at the repository root defines all build tasks, their dependencies, and cache settings.

2. **Environment Variables** (add these in Vercel dashboard):
   ```bash
   # API Configuration
   NEXT_PUBLIC_API_URL=https://api.yoohoo.guru
   
   # Firebase Configuration (Frontend)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   # Authentication
   NEXTAUTH_SECRET=your_secure_secret_key
   NEXTAUTH_URL=https://www.yoohoo.guru
   AUTH_COOKIE_DOMAIN=.yoohoo.guru
   
   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

3. **Add Custom Domains** (all 29 subdomains):
   - Core: www, coach, angel, heroes, dashboard
   - Content: art, business, coding, cooking, crafts, data, design, finance, fitness, gardening, history, home, investing, language, marketing, math, music, photography, sales, science, sports, tech, wellness, writing

**Deploy:**
```bash
# Using Vercel CLI
vercel --prod

# Or push to main branch (auto-deploys via GitHub integration)
git push origin main
```

### Railway (Backend) - Production Deployment

**Prerequisites:**
- Railway account
- Firebase service account credentials
- Stripe API keys

**Configuration in Railway Dashboard:**

1. **Service Settings:**
   ```
   Root Directory: backend
   Build Command: (auto-detected from railway.json)
   Start Command: cd backend && npm start
   Health Check Path: /health
   ```

2. **Environment Variables** (add these in Railway dashboard):
   ```bash
   # Core Configuration
   NODE_ENV=production
   PORT=8000
   SERVE_FRONTEND=false
   
   # Firebase (Backend Service Account)
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   
   # Security
   JWT_SECRET=your_secure_jwt_secret
   SESSION_SECRET=your_secure_session_secret
   
   # Stripe
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   
   # AI Content Curation
   OPENROUTER_API_KEY=your_openrouter_key
   
   # CORS - All 29 frontend subdomains (comma-separated, no spaces)
   CORS_ORIGIN_PRODUCTION=https://www.yoohoo.guru,https://coach.yoohoo.guru,\
   https://angel.yoohoo.guru,https://heroes.yoohoo.guru,https://dashboard.yoohoo.guru,\
   https://art.yoohoo.guru,https://business.yoohoo.guru,https://coding.yoohoo.guru,\
   https://cooking.yoohoo.guru,https://crafts.yoohoo.guru,https://data.yoohoo.guru,\
   https://design.yoohoo.guru,https://finance.yoohoo.guru,https://fitness.yoohoo.guru,\
   https://gardening.yoohoo.guru,https://history.yoohoo.guru,https://home.yoohoo.guru,\
   https://investing.yoohoo.guru,https://language.yoohoo.guru,https://marketing.yoohoo.guru,\
   https://math.yoohoo.guru,https://music.yoohoo.guru,https://photography.yoohoo.guru,\
   https://sales.yoohoo.guru,https://science.yoohoo.guru,https://sports.yoohoo.guru,\
   https://tech.yoohoo.guru,https://wellness.yoohoo.guru,https://writing.yoohoo.guru
   ```

3. **Custom Domain:**
   - Add `api.yoohoo.guru` in Railway → Settings → Networking
   - Update DNS CNAME record to point to Railway

**Deploy:**
```bash
# Using Railway CLI
cd backend
railway up

# Or push to main branch (auto-deploys via GitHub integration)
git push origin main
```

### Post-Deployment Verification

**Frontend Health Check:**
```bash
# Test main subdomain
curl -I https://www.yoohoo.guru
# Should return: 200 OK

# Test subdomain routing
curl -I https://coach.yoohoo.guru
curl -I https://art.yoohoo.guru
# Should return: 200 OK with correct content
```

**Backend Health Check:**
```bash
# Test backend API
curl https://api.yoohoo.guru/health
# Should return: {"status":"ok","timestamp":"..."}

# Test CORS configuration
curl -H "Origin: https://www.yoohoo.guru" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS https://api.yoohoo.guru/api/auth/login
# Should return CORS headers
```

**Monitoring:**
- Vercel Dashboard: Check build logs and function logs
- Railway Dashboard: Monitor application logs and metrics
- Firebase Console: Monitor authentication and database usage

See [Full Deployment Guide](./docs/DEPLOYMENT.md) for detailed instructions and troubleshooting.

## Production Deployment Checklist

Use this checklist to ensure a complete and secure production deployment:

### Pre-Deployment
- [ ] All code changes committed and pushed to `main` branch
- [ ] All tests passing: `npm test`
- [ ] No security vulnerabilities: `npm audit`
- [ ] Environment variables documented in `.env.example`
- [ ] Firebase security rules updated and tested
- [ ] Stripe webhooks configured for production domain

### Vercel Frontend Deployment
- [ ] Vercel project created and linked to GitHub repo
- [ ] Build command configured: `npm run build` (uses Turborepo for build orchestration)
- [ ] Install command configured: `npm ci`
- [ ] All 29 custom domains added to Vercel project
- [ ] DNS records configured (wildcard CNAME for *.yoohoo.guru)
- [ ] Environment variables set in Vercel dashboard
- [ ] `NEXTAUTH_SECRET` is cryptographically secure (32+ chars)
- [ ] `AUTH_COOKIE_DOMAIN=.yoohoo.guru` for cross-subdomain auth
- [ ] Deployment successful and verified
- [ ] All subdomains accessible and loading correctly
- [ ] Turborepo build cache working correctly (check build logs)

### Railway Backend Deployment
- [ ] Railway project created and linked to GitHub repo
- [ ] Environment variables set in Railway dashboard
- [ ] `JWT_SECRET` and `SESSION_SECRET` are cryptographically secure
- [ ] Firebase service account credentials configured
- [ ] Stripe live keys configured (not test keys)
- [ ] OpenRouter API key configured (for AI content)
- [ ] CORS origins include all 29 frontend subdomains
- [ ] Custom domain `api.yoohoo.guru` configured
- [ ] DNS CNAME record pointing to Railway
- [ ] Health check endpoint responding: `/health`
- [ ] Deployment successful and verified

### Firebase Configuration
- [ ] All 29 subdomains added to Firebase authorized domains
- [ ] Firestore security rules deployed and tested
- [ ] Firestore indexes created for optimal queries
- [ ] Firebase Authentication enabled (Email/Password + Google OAuth)
- [ ] Storage bucket security rules configured
- [ ] Production service account created for backend

### Post-Deployment Verification
- [ ] Frontend health check: `curl -I https://www.yoohoo.guru` → 200 OK
- [ ] Backend health check: `curl https://api.yoohoo.guru/health` → `{"status":"ok"}`
- [ ] Test subdomain routing: `curl -I https://coach.yoohoo.guru` → 200 OK
- [ ] Test authentication flow (signup, login, logout)
- [ ] Test cross-subdomain authentication (login on www, navigate to coach)
- [ ] Test API integration (create user, fetch data)
- [ ] Test Stripe payment flow (checkout, webhook)
- [ ] Verify AI content curation agents are running
- [ ] Check cron schedules: News (6 AM, 3 PM EST), Blog (Monday 10 AM EST)
- [ ] Monitor error logs in Vercel and Railway dashboards
- [ ] Set up monitoring alerts (uptime, error rate)

### Security Verification
- [ ] HTTPS enabled on all domains (enforce SSL)
- [ ] Security headers present (Helmet.js, CSP, HSTS)
- [ ] Secrets not exposed in client-side code
- [ ] Rate limiting active on backend
- [ ] Firebase security rules prevent unauthorized access
- [ ] Stripe webhook signatures verified
- [ ] CORS restricted to known subdomains only
- [ ] No hardcoded credentials in codebase
- [ ] Dependencies scanned for vulnerabilities: `npm audit`

### Monitoring Setup
- [ ] Vercel analytics enabled
- [ ] Railway metrics dashboard configured
- [ ] Firebase usage monitoring enabled
- [ ] Stripe webhook events logging
- [ ] Error tracking configured (Sentry or similar)
- [ ] Uptime monitoring configured (UptimeRobot or similar)
- [ ] Log aggregation configured (if applicable)

### Documentation
- [ ] README.md updated with deployment info
- [ ] Environment variables documented
- [ ] API documentation accessible
- [ ] Deployment runbook created
- [ ] Rollback procedure documented

### Rollback Plan
If deployment fails or issues arise:
1. Immediately revert to previous deployment in Vercel/Railway
2. Check error logs for root cause
3. Verify environment variables are correct
4. Test fix in staging environment before redeploying
5. Document incident and resolution

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
