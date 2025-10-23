# YoohooGuru Platform Implementation

This repository contains the complete implementation of the YoohooGuru three-pillar skill-sharing platform based on the business documentation requirements.

## Platform Overview

YoohooGuru is a comprehensive skill-sharing platform with three distinct pillars:

1. **Coach Guru** (coach.yoohoo.guru) - Paid skill-sharing marketplace with 15% platform commission
2. **Hero Gurus** (heroes.yoohoo.guru) - Free accessible learning for people with disabilities (100% free, no contracts)
3. **Angel's List** (angel.yoohoo.guru) - Gig marketplace for local services with 10-15% tiered commission

## Repository Structure

```
yoohooguru/
├── apps/                    # Next.js application with gateway architecture
│   └── main/               # Single app serving all 29 subdomains
│       ├── middleware.ts   # Edge Middleware for subdomain routing
│       ├── pages/
│       │   └── _apps/      # All 29 subdomain pages (5 core + 24 subjects)
│       └── ...
├── packages/               # Shared packages
│   ├── shared/            # Shared UI components and utilities
│   ├── auth/              # Authentication utilities (NextAuth, Firebase)
│   └── db/                # Database access layer (Firestore)
├── backend/               # Backend API (Railway deployment)
│   ├── src/
│   │   ├── config/       # Configuration management
│   │   ├── routes/       # API route handlers
│   │   ├── middleware/   # Express middleware
│   │   ├── utils/        # Backend utilities
│   │   └── lib/          # Business logic libraries
│   ├── tests/            # Backend test suites
│   └── package.json      # Backend dependencies
├── frontend/             # Legacy frontend (being phased out)
├── docs/                 # Documentation
│   ├── ENVIRONMENT_VARIABLES.md  # Complete env var guide
│   ├── DEPLOYMENT.md      # Deployment instructions
│   ├── SITEMAP.md         # Sitemap and routing guide
│   ├── RAILWAY_DEPLOYMENT.md # Railway-specific guide
│   └── FIREBASE_POLICY.md # Firebase usage policy & standards
├── turbo.json            # Turborepo configuration
├── package.json          # Root workspace configuration
├── .env.shared.example   # Shared environment variables template
└── README.md             # This file

See MONOREPO_README.md and GATEWAY_ARCHITECTURE.md for complete documentation.
```

## 🏃‍♂️ Quick Start

### Prerequisites

- **Node.js 20+** and npm 9+
- **Firebase project** (for authentication and data)
- **Environment configuration** (see [Environment Variables Guide](./docs/ENVIRONMENT_VARIABLES.md))

### 1. Clone and Install

```bash
git clone https://github.com/GooseyPrime/yoohooguru.git
cd yoohooguru

# Install all dependencies (uses Turborepo workspaces)
npm install
```

### 2. Environment Setup

```bash
# Copy shared environment template
cp .env.shared.example .env.shared

# Edit .env.shared with your configuration
# See docs/ENVIRONMENT_VARIABLES.md for complete guide
```

**Minimum required variables:**
```env
# Firebase (required)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key

# NextAuth (required for authentication)
NEXTAUTH_SECRET=your_super_secret_key
NEXTAUTH_URL=http://localhost:3000

# Auth Cookie Domain (for cross-subdomain authentication)
AUTH_COOKIE_DOMAIN=.yoohoo.guru
```

```

### 3. Development with Turborepo

```bash
# Run all apps in development mode
npm run dev

# Or run specific apps:
npm run dev:main        # Homepage (www.yoohoo.guru)
npm run dev:angel       # Angel's List
npm run dev:coach       # Coach Guru
npm run dev:heroes      # Hero Guru's
npm run dev:dashboard   # User Dashboard

# Run legacy frontend (being phased out)
npm run dev:frontend

# Run backend API
npm run dev:backend
```

### 4. Production Build

```bash
# Build all apps with Turborepo
npm run build

# Build specific apps:
npm run build:main      # Homepage
npm run build:angel     # Angel's List
npm run build:coach     # Coach Guru
npm run build:heroes    # Hero Guru's
npm run build:dashboard # User Dashboard

# Build legacy frontend (being phased out)
npm run build:frontend

# Build backend
npm run build:backend
```

# Clean build with optimization and timing
npm run build:clean

# Start production server
npm start
```

**Build Performance Notes:**
- First-time builds (cold cache): 15 seconds - 6+ minutes depending on hardware
- Subsequent builds (warm cache): 4-15 seconds
- Environment factors affect build time (CPU, RAM, storage type, OS)
- See [Build Performance Guide](docs/BUILD_PERFORMANCE.md) for optimization tips

## 🌍 Deployment

The platform supports multiple deployment architectures with complete environment configuration:

### 🔒 **Deployment Control & Security**

**Important**: This repository implements **deployment control** to prevent premature deployments:

✅ **Secure Deployment Flow:**
- PRs **do NOT** trigger automatic Vercel deployments
- Production deployments **only** occur after merge to `main` branch
- All deployments require code review and approval

📋 **Verify Deployment Control:**
```bash
# Check deployment configuration
./scripts/verify-deployment-control.sh

# Expected output: "Deployment control is properly configured!"
```

📖 **Details:** See [Vercel Deployment Control Guide](docs/VERCEL_DEPLOYMENT_CONTROL.md)

### 📁 **Standardized Deployment Configuration**

**Critical**: This monorepo requires **consistent service initialization and platform configuration** to avoid deployment failures. Follow this exact process:

#### **🎯 Step 1: Service Initialization & Linking**

**Always initialize services from the repository root:**

```powershell
# Navigate to repository root (REQUIRED)
cd yoohooguru

# Initialize/link all services from root directory
railway login && railway link                    # Link Railway project
vercel link                                      # Link Vercel project  
firebase init                                    # Initialize Firebase project (optional)
```

#### **⚙️ Step 2: Platform Console Configuration**

**Configure these exact settings in each platform's dashboard:**

| Platform | Service Type | Root Directory Setting | Build Command | Output Directory |
|----------|-------------|------------------------|---------------|------------------|
| **Railway** (Full-Stack) | Web Service | `/` (root) | `npm run build` | - |
| **Railway** (Backend-Only) | Web Service | `/backend` | `npm install && npm start` | - |
| **Vercel** (Frontend) | Next.js App | `/` (root) | `cd apps/main && npm run build` | `apps/main/.next` |
| **Firebase** (Frontend) | Hosting | - | `npm run build` | `frontend/dist` |

#### **🚀 Step 3: Deployment Commands**

**Run deployment commands from the repository root (always):**

```powershell
# IMPORTANT: Always stay in repository root for all deployments
cd yoohooguru

# Deploy based on your platform configuration:

# Railway Full-Stack (root directory configured as "/")
railway up

# Railway Backend-Only (root directory configured as "/backend") 
railway up

# Vercel Frontend (root directory configured as "/")
vercel --prod

# Firebase Frontend (build configured to output to "frontend/dist")
firebase deploy --only hosting

# Docker Full-Stack (always from root)
docker-compose up -d
```

#### **🔧 Platform-Specific Setup Instructions**

**Railway Setup:**
```powershell
cd yoohooguru
railway login
railway link

# In Railway Dashboard → Settings:
# - Root Directory: "/" (for full-stack) OR "/backend" (for backend-only)
# - Build Command: "npm run build" (full-stack) OR "npm install && npm start" (backend-only)
# - Start Command: "npm start"
```

**Vercel Setup:**
```powershell
cd yoohooguru
vercel link

# In Vercel Dashboard → Settings → General:
# - Root Directory: "frontend"  
# - Build Command: "npm run build"
# - Output Directory: "dist"
# - Install Command: "npm install"
```

#### **Environment Variables by Platform**

**Railway (Full-Stack or Backend-Only):**
```env
NODE_ENV=production
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_API_KEY=your_key
JWT_SECRET=your_secret_key
PORT=8000
```

**Vercel/Netlify (Frontend-Only):**
```env
REACT_APP_API_URL=https://your-backend.railway.app/api
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_BRAND_NAME=yoohoo.guru
```

#### **🚨 Common Mistakes to Avoid**

❌ **DON'T**: Navigate to subdirectories before running deployment commands  
❌ **DON'T**: Set inconsistent root directory settings in platform dashboards  
❌ **DON'T**: Link services from subdirectories  

✅ **DO**: Always initialize and deploy from repository root (`yoohooguru/`)  
✅ **DO**: Configure platform root directories to match your deployment type  
✅ **DO**: Use consistent service linking across all platforms

#### **🔧 Troubleshooting Common Issues**

**Railway "Cannot locate backend" Error:**
```
Error: Build failed - cannot locate backend at yoohooguru/backend/backend
```
**Solution**: This happens when platform configuration doesn't match deployment approach
1. Check Railway Dashboard → Settings → Root Directory setting
2. For backend-only: Set to `/backend`, deploy from repository root
3. For full-stack: Set to `/` (root), deploy from repository root

**Vercel Build Path Errors:**
```
Error: No build output found at frontend/frontend/dist
```
**Solution**: Verify Vercel Dashboard → Settings → General configuration
1. Root Directory: `frontend` (not `frontend/frontend`)
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Always deploy from repository root

**Service Linking Issues:**
```
Error: No project linked to this directory
```
**Solution**: Re-link services from repository root
```powershell
cd yoohooguru  # Always link from root
railway link   # Re-link Railway
vercel link    # Re-link Vercel
```

### 🚀 **Deployment: Gateway Architecture**

The yoohoo.guru platform uses a gateway architecture with a single Vercel project:
- **[Vercel](https://vercel.com)** - Single Next.js app (`apps/main`) serving all 29 subdomains
- **[Railway](https://railway.app)** - Backend API (Node.js/Express)  
- **[Firebase](https://firebase.com)** - Database, authentication, and real-time features

**See [GATEWAY_ARCHITECTURE.md](./GATEWAY_ARCHITECTURE.md) for complete gateway deployment instructions.**

#### Gateway Deployment Overview

The platform uses Edge Middleware to route all subdomains through a single Vercel deployment:

| Type | Subdomains | Routing | Vercel Project |
|------|-----------|---------|----------------|
| Core | 5 (www, angel, coach, heroes, dashboard) | Edge Middleware | yoohooguru-main |
| Subjects | 24 (art, business, coding, etc.) | Edge Middleware | yoohooguru-main |
| **Total** | **29 subdomains** | **Single deployment** | **One project** |

**Quick Deploy:**
```bash
cd yoohooguru
vercel --prod

# In Vercel Dashboard → Settings:
# - Root Directory: "apps/main" (or leave empty)
# - Build Command: "cd apps/main && npm run build"
# - Output Directory: "apps/main/.next"
# - Add all 29 custom domains to the single project
```

**Deployment Documentation:**
- **[GATEWAY_ARCHITECTURE.md](./GATEWAY_ARCHITECTURE.md)** - Complete gateway architecture guide
- **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - DNS, Vercel, and Railway configuration (legacy)
- **[docs/ENVIRONMENT_VARIABLES.md](./docs/ENVIRONMENT_VARIABLES.md)** - All environment variables
- **[MONOREPO_README.md](./MONOREPO_README.md)** - Monorepo architecture overview

#### Railway Backend Deployment

**Prerequisites:**
- Railway account ([sign up free](https://railway.app))
- GitHub repository connected to Railway

**Quick Deploy:**
```bash
cd yoohooguru/backend
railway up

# Or configure in Railway Dashboard:
# - Root Directory: "backend"
# - Build Command: "npm install && npm run build"
# - Start Command: "npm start"
```

**Environment Variables in Railway Dashboard:**
```bash
NODE_ENV=production
SERVE_FRONTEND=false
CORS_ORIGIN_PRODUCTION=https://www.yoohoo.guru,https://angel.yoohoo.guru,https://coach.yoohoo.guru
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
JWT_SECRET=your_secure_jwt_secret
```

**See [docs/RAILWAY_DEPLOYMENT.md](./docs/RAILWAY_DEPLOYMENT.md) for complete backend deployment guide.**
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com

# Optional - Branding customization
REACT_APP_BRAND_NAME=yoohoo.guru
REACT_APP_DISPLAY_NAME=yoohoo.guru
REACT_APP_SUPPORT_EMAIL=support@yoohoo.guru
```

**Step 4: Custom Domain (Optional)**
1. Add domain in Vercel dashboard
2. Configure DNS to point to Vercel
3. SSL certificate auto-provisioned

#### Detailed Railway Backend Setup

**Prerequisites:**
- Railway account ([sign up free](https://railway.app))
- Repository ready for deployment

**Step 1: Deploy Backend**
```powershell
# Install Railway CLI
npm install -g @railway/cli
railway login

# Navigate to repository root and link project
cd yoohooguru
railway link

# Configure in Railway Dashboard → Settings:
# - Root Directory: "/" (for full-stack) OR "/backend" (for backend-only)
# - Build Command: "npm run build" (full-stack) OR "npm install && npm start" (backend-only)
# - Start Command: "npm start"

# Deploy (always from repository root)
railway up
```

**Step 2: Environment Variables in Railway Dashboard**
```bash
# Core Configuration
railway variables set NODE_ENV=production
railway variables set PORT=8000  # Railway will override this

# Firebase Configuration  
railway variables set FIREBASE_PROJECT_ID=your_project_id
railway variables set FIREBASE_API_KEY=your_api_key
railway variables set FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
railway variables set FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
railway variables set FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your_project.iam.gserviceaccount.com
railway variables set FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----"

# Security & Authentication
railway variables set JWT_SECRET=your_super_secret_jwt_key
railway variables set JWT_EXPIRES_IN=7d

# External APIs
railway variables set OPENROUTER_API_KEY=your_openrouter_key
railway variables set STRIPE_SECRET_KEY=sk_live_your_stripe_key
railway variables set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# CORS (update with your Vercel domain)
railway variables set CORS_ORIGIN_PRODUCTION=https://your-app.vercel.app,https://your-custom-domain.com
```

**Step 3: Domain Configuration**
```bash
# Add custom domain (optional)
railway domain add api.yourdomain.com
```

#### Firebase Database Setup

**Step 1: Create Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project: "yoohooguru" (set to production mode)
3. Enable Firestore database

**Step 2: Security Rules**
Set in Firebase Console → Database → Rules:
```javascript
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'",
        ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'"
      }
    },
    "skills": {
      ".read": true,
      ".write": "auth !== null"
    },
    "exchanges": {
      "$exchangeId": {
        ".read": "data.child('teacherId').val() === auth.uid || data.child('learnerId').val() === auth.uid",
        ".write": "data.child('teacherId').val() === auth.uid || data.child('learnerId').val() === auth.uid"
      }
    }
  }
}
```

**Step 3: Authentication Setup**
1. Enable Google Sign-In in Authentication → Sign-in method
2. Add authorized domains: `localhost`, `your-app.vercel.app`, `yourdomain.com`
3. Download service account key for backend

**Step 4: Indexes for Performance**
```json
{
  "indexes": {
    "users": {
      "tier": {},
      "location": {},
      "verified": {}
    },
    "exchanges": {
      "teacherId": {},
      "learnerId": {},
      "status": {},
      "createdAt": {}
    },
    "skills": {
      "category": {},
      "subcategory": {},
      "location": {}
    }
  }
}
```

#### Deployment Verification & Testing

**Step 1: Verify Local Build**
```bash
# Test the complete build process locally
npm run install:all
npm run build

# Verify individual components
npm run test
npm run lint
```

**Step 2: Test Production Deployment**
```bash
# Test frontend build (should create dist/ folder)
cd frontend
npm run build
ls -la dist/  # Should contain index.html, static assets

# Test backend startup
cd ../backend  
npm start
# Should show: "Server running on port 3001"
```

**Step 3: Validate Environment Setup**
```bash
# Validate Firebase configuration (if configured)
npm run firebase:validate

# Validate Railway deployment readiness
npm run railway:validate

# Check environment variables
node -e "console.log('Environment check:', process.env.NODE_ENV)"
```

**Step 4: Post-Deployment Health Checks**
```bash
# Frontend health check
curl https://your-app.vercel.app

# Backend health check  
curl https://your-backend.railway.app/health

# API functionality test
curl https://your-backend.railway.app/api
```

**Expected Responses:**
- Frontend: Should load React application homepage
- Backend `/health`: `{"status":"OK","timestamp":"...","uptime":...}`
- Backend `/api`: `{"message":"yoohoo.guru API is running","version":"1.0.0"}`

#### Troubleshooting Common Issues

**Vercel Build Failures:**
```bash
# Check build logs in Vercel dashboard
# Common fixes:
- Ensure all REACT_APP_ environment variables are set
- Verify Node.js version compatibility (18+)
- Check for missing dependencies in frontend/package.json
```

**Railway Deployment Issues:**
```bash
# Check Railway logs
railway logs --tail

# Common fixes:
- Verify PORT environment variable is not hardcoded
- Ensure all Firebase environment variables are set
- Check that /health endpoint returns 200 status
```

**Firebase Connection Problems:**
```bash
# Validate Firebase configuration
# Common fixes:
- Verify project ID matches environment variables
- Check Firebase rules allow read/write access
- Ensure service account credentials are valid
```

### 📋 **Alternative Deployment Options**

- **[Railway Full-Stack](./docs/RAILWAY_DEPLOYMENT.md)** - Deploy from `yoohooguru/` (root directory)
- **[Netlify + Railway](./docs/DEPLOYMENT.md)** - Frontend from `yoohooguru/frontend/`, Backend from `yoohooguru/backend/`
- **[Docker](./docker-compose.yml)** - Deploy from `yoohooguru/` (root directory)
- **[Custom Infrastructure](./docs/DEPLOYMENT.md)** - Deploy from appropriate directory based on your setup

#### **Quick Reference Summary**

| Platform | Platform Root Directory | Command (from `yoohooguru/`) | Deploys |
|----------|------------------------|-----------------------------|---------|
| **Railway** (Full-Stack) | `/` | `railway up` | Frontend + Backend |
| **Railway** (Backend-Only) | `/backend` | `railway up` | Backend API only |
| **Vercel** (Frontend) | `/` | `vercel --prod` | Frontend only |
| **Firebase** (Frontend) | - | `firebase deploy --only hosting` | Frontend only |
| **Docker** (Full-Stack) | - | `docker-compose up -d` | Frontend + Backend |

**Key Point**: Platform Root Directory is configured in the platform dashboard, but all deployment commands are run from the repository root (`yoohooguru/`).

### 🚀 **Production Deployment Checklist**

**Pre-Deployment:**
- [ ] Firebase project configured with proper security rules
- [ ] Environment variables documented and secured
- [ ] Local build and tests passing (`npm run build && npm test`)
- [ ] Domain names registered and DNS configured

**Vercel Frontend:**
- [ ] Vercel account connected to GitHub repository
- [ ] All `REACT_APP_*` environment variables set in Vercel dashboard
- [ ] Custom domain added and SSL certificate active
- [ ] Build and deployment successful

**Railway Backend:**
- [ ] Railway CLI installed and authenticated
- [ ] All required environment variables set in Railway dashboard
- [ ] Health check endpoint responding (`/health`)
- [ ] API endpoints functional (`/api`)

**Firebase Database:**
- [ ] Security rules configured for production
- [ ] Indexes created for optimal query performance
- [ ] Authentication providers enabled and configured
- [ ] Backup strategy implemented

**Post-Deployment:**
- [ ] End-to-end user flows tested (registration, login, skill booking)
- [ ] Payment processing validated (Stripe integration)
- [ ] Email notifications working
- [ ] Mobile/PWA functionality verified
- [ ] Performance monitoring setup (optional)

---

## 🌐 Gateway Architecture with 29 Subdomains

The YooHoo.guru platform uses a **Gateway Architecture with Edge Middleware** to serve all subdomains from a single Vercel deployment.

### All Subdomains (29 Total)

**Core Platform Subdomains (5):**
1. **www.yoohoo.guru** - Homepage and main platform
2. **angel.yoohoo.guru** - Angel's List service marketplace
3. **coach.yoohoo.guru** - Coach Guru skill-sharing
4. **heroes.yoohoo.guru** - Hero Guru's (formerly Modified Masters)
5. **dashboard.yoohoo.guru** - User dashboard

**Subject Guru Subdomains (24):**
6. **art.yoohoo.guru** - Art and creative skills
7. **business.yoohoo.guru** - Business and entrepreneurship
8. **coding.yoohoo.guru** - Programming and development
9. **cooking.yoohoo.guru** - Culinary arts and cooking
10. **crafts.yoohoo.guru** - Crafts and DIY
11. **data.yoohoo.guru** - Data science and analytics
12. **design.yoohoo.guru** - Design and UX
13. **finance.yoohoo.guru** - Finance and accounting
14. **fitness.yoohoo.guru** - Fitness and health
15. **gardening.yoohoo.guru** - Gardening and horticulture
16. **history.yoohoo.guru** - History and culture
17. **home.yoohoo.guru** - Home improvement
18. **investing.yoohoo.guru** - Investing and trading
19. **language.yoohoo.guru** - Languages and linguistics
20. **marketing.yoohoo.guru** - Marketing and sales
21. **math.yoohoo.guru** - Mathematics and logic
22. **music.yoohoo.guru** - Music and performance
23. **photography.yoohoo.guru** - Photography and videography
24. **sales.yoohoo.guru** - Sales techniques
25. **science.yoohoo.guru** - Science and research
26. **sports.yoohoo.guru** - Sports and athletics
27. **tech.yoohoo.guru** - Technology and gadgets
28. **wellness.yoohoo.guru** - Wellness and mindfulness
29. **writing.yoohoo.guru** - Writing and editing

### Gateway Architecture

All subdomains are served from a single Vercel project using Edge Middleware:

```typescript
// apps/main/middleware.ts handles subdomain routing
// Example: angel.yoohoo.guru → apps/main/pages/_apps/angel/index.tsx
```

### Cross-Subdomain Authentication

All subdomains share authentication via NextAuth with cross-subdomain cookie configuration:

```typescript
// packages/auth/src/nextauth.ts
cookies: {
  sessionToken: {
    options: {
      domain: '.yoohoo.guru',  // Shared across all subdomains
      httpOnly: true,
      sameSite: 'lax',
      secure: true
    }
  }
}
```

### Shared Code Architecture

All subdomains use shared packages via Turborepo workspaces:

- **@yoohooguru/shared** - UI components, utilities, and styles
- **@yoohooguru/auth** - NextAuth and Firebase authentication
- **@yoohooguru/db** - Firestore database access layer

**See [GATEWAY_ARCHITECTURE.md](./GATEWAY_ARCHITECTURE.md) for complete architecture documentation.**
   - Verify ownership

3. **Deploy:**
   - Subdomain automatically routes through existing build
   - Shows cousin landing page with monetization placeholders

### Customizing Cousin Content

To customize content for specific cousin subdomains, edit:
- **`frontend/src/screens/CousinSubdomainPage.js`** - Landing page component
- **`frontend/src/hosting/hostRules.js`** - Subdomain detection logic

### Environment Variables

All subdomains share the same environment variables from the main Vercel project. No per-subdomain configuration is needed.

### DNS Configuration

For wildcard subdomain support, configure DNS:
```
Type: CNAME
Name: *
Value: cname.vercel-dns.com
TTL: 3600
```

Then add each subdomain in Vercel Dashboard individually for SSL certificate provisioning.

### Benefits

✅ **Single Build** - One deployment serves all subdomains  
✅ **Shared Auth** - Users stay logged in across subdomains  
✅ **Instant Deployment** - New subdomains available immediately  
✅ **SEO-Friendly** - Each subdomain can have unique meta tags  
✅ **Monetization-Ready** - Built-in ad placement opportunities

---

## 📱 User Manual & Platform Features

### 🎯 **Core Features Overview**

**yoohoo.guru** is a comprehensive skill-sharing platform that connects community members for mutual learning and professional services.

#### **For Skill Learners**
- **Skill Discovery** - Browse hundreds of skills across 15+ categories
- **Teacher Matching** - AI-powered recommendations for perfect skill matches
- **Booking System** - Schedule lessons and services with integrated payments
- **Progress Tracking** - Monitor your learning journey and achievements
- **Community Groups** - Join skill-specific communities and discussions

#### **For Skill Teachers (Gurus)**
- **Profile Creation** - Showcase your expertise with media, credentials, and reviews
- **Service Listings** - Create offerings for lessons, consulting, and projects
- **Availability Management** - Set schedules and manage booking calendar
- **Payment Processing** - Secure payments via Stripe with instant payouts
- **Student Communication** - In-platform messaging and video calls

#### **For Service Seekers (Angel's List)**
- **Job Posting** - Post projects and tasks needing skilled professionals
- **Talent Discovery** - Browse verified professionals in your area
- **Proposal Management** - Review bids and select the best candidates
- **Project Tracking** - Monitor progress and handle milestone payments
- **Quality Assurance** - Rating and review system for completed work

### 🏠 **Getting Started - Home Page**

**Hero Section**: Features the mission statement *"A community where you can swap skills, share services, or find trusted local help"* with primary navigation to:
- **Learn a Skill** - Browse teachers and book lessons
- **Teach a Skill** - Create your guru profile and start earning
- **Find Help** - Post jobs on Angel's List marketplace

**Featured Content**:
- **Popular Skills** - Trending categories like cooking, music, coding
- **Success Stories** - Community testimonials and achievements  
- **Local Gurus** - Nearby teachers and service providers

### 🔐 **Authentication & Account Setup**

#### **User Registration**
1. **Sign Up Options**:
   - Email and password registration with password strength indicator
   - Google OAuth integration
   - Facebook social login (when enabled)
   - **NEW: Dual-role selection** - Users can be both teachers and learners!

2. **Profile Completion**:
   - Basic information (name, location, bio)
   - **Interest Selection**: Choose to teach, learn, or both
   - Skill interests and teaching expertise
   - Verification documents (optional for basic features)

3. **Account Verification**:
   - Email confirmation required
   - Phone verification (optional)
   - Identity verification for premium features

#### **User Roles & Permissions**

**All users can be BOTH teachers and learners simultaneously!**

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

The implementation requires the following environment variables (add to `.env.local`):

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `NEXT_PUBLIC_AGORA_APP_ID` - Agora application ID
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API key
- `GOOGLE_OAUTH_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_OAUTH_CLIENT_SECRET` - Google OAuth client secret
- `NEXTAUTH_SECRET` - NextAuth secret for session encryption

## Implementation Notes

1. This implementation provides a complete frontend structure based on the business documentation
2. Backend services and API integrations are represented with placeholder components
3. Actual API keys and secrets need to be configured for production deployment
4. Database integration and user role assignment would need to be implemented in a production environment
5. Webhook handlers are implemented but require actual Stripe configuration
6. Video conferencing components require actual Agora tokens and channel management
7. Google Maps components require actual API keys and geolocation services

## Changelog

See [CHANGES.md](CHANGES.md) for a comprehensive list of all implemented features and modifications.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.