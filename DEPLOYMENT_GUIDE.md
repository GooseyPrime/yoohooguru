# Deployment Guide - Updated for Single-App Architecture

## Overview

YooHooGuru uses a **single Next.js application** architecture that serves all 29 subdomains through middleware-based routing. This guide covers deployment to Vercel (frontend) and Railway (backend).

## Architecture Changes (November 2024)

### Previous Architecture (Deprecated)
- Multiple separate Next.js apps (one per subdomain)
- Complex deployment with 29 separate Vercel projects
- Difficult to maintain and update

### Current Architecture (Active)
- **Single Next.js app** at `apps/main/`
- **Middleware-based routing** for all subdomains
- **One Vercel deployment** serving all 29 subdomains
- **Centralized authentication** and shared pages

## Vercel Deployment (Frontend)

### Prerequisites
- Vercel account connected to GitHub
- All 29 custom domains configured in Vercel
- Environment variables configured

### Project Configuration

**Single Vercel Project:**
- **Project Name**: yoohooguru-main (or similar)
- **Framework**: Next.js
- **Root Directory**: `apps/main`
- **Build Command**: `cd ../.. && npm run build`
- **Output Directory**: `apps/main/.next`
- **Install Command**: `npm ci`

### Vercel Configuration

The root `vercel.json` contains all routing and redirect configuration:

```json
{
  "buildCommand": "cd apps/main && npm run build",
  "outputDirectory": "apps/main/.next",
  "installCommand": "npm ci",
  "framework": "nextjs",
  
  "redirects": [
    {
      "source": "/",
      "has": [{"type": "host", "value": "yoohoo.guru"}],
      "destination": "https://www.yoohoo.guru",
      "permanent": true
    },
    {
      "source": "/login",
      "has": [{"type": "host", "value": "(art|business|coding|...).yoohoo.guru"}],
      "destination": "https://www.yoohoo.guru/login",
      "permanent": false
    }
    // ... additional redirects for all shared pages
  ],
  
  "rewrites": [
    {
      "source": "/api/backend/:path*",
      "destination": "https://api.yoohoo.guru/api/:path*"
    }
  ]
}
```

**Key Features:**
- **Subdomain redirects**: All auth/legal pages redirect to main site
- **API rewrites**: Frontend API calls proxied to backend
- **Security headers**: CSP, HSTS, and other security headers
- **Cache control**: Optimized caching for static assets

### Custom Domains

Configure all 29 domains in Vercel dashboard:

**Core Services:**
- www.yoohoo.guru (main landing)
- coach.yoohoo.guru (professional marketplace)
- angel.yoohoo.guru (local services)
- heroes.yoohoo.guru (volunteering)
- dashboard.yoohoo.guru (user dashboard)

**Content Hubs (24 subdomains):**
- art.yoohoo.guru
- business.yoohoo.guru
- coding.yoohoo.guru
- cooking.yoohoo.guru
- crafts.yoohoo.guru
- data.yoohoo.guru
- design.yoohoo.guru
- finance.yoohoo.guru
- fitness.yoohoo.guru
- gardening.yoohoo.guru
- history.yoohoo.guru
- home.yoohoo.guru
- investing.yoohoo.guru
- language.yoohoo.guru
- marketing.yoohoo.guru
- math.yoohoo.guru
- music.yoohoo.guru
- photography.yoohoo.guru
- sales.yoohoo.guru
- science.yoohoo.guru
- sports.yoohoo.guru
- tech.yoohoo.guru
- wellness.yoohoo.guru
- writing.yoohoo.guru

### Environment Variables

Configure in Vercel dashboard for all environments (Production, Preview, Development):

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your_secure_secret_key
NEXTAUTH_URL=https://www.yoohoo.guru
AUTH_COOKIE_DOMAIN=.yoohoo.guru

# Google OAuth
GOOGLE_OAUTH_CLIENT_ID=your_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_client_secret

# Firebase (Frontend)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# API Configuration
NEXT_PUBLIC_API_URL=https://api.yoohoo.guru

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_CONTAINER_ID=GTM-XXXXXXX
```

### Deployment Process

**Automatic Deployment:**
```bash
# Push to main branch triggers automatic deployment
git push origin main
```

**Manual Deployment:**
```bash
# Using Vercel CLI
vercel --prod

# Or deploy specific branch
vercel --prod --branch=staging
```

### Post-Deployment Verification

After deployment, verify:

1. **All subdomains resolve correctly**:
   ```bash
   curl -I https://www.yoohoo.guru
   curl -I https://coach.yoohoo.guru
   curl -I https://art.yoohoo.guru
   # ... test all 29 subdomains
   ```

2. **Redirects work properly**:
   ```bash
   curl -I https://heroes.yoohoo.guru/login
   # Should redirect to https://www.yoohoo.guru/login
   ```

3. **Authentication works across subdomains**:
   - Sign in at www.yoohoo.guru
   - Navigate to any subdomain
   - Verify session persists

4. **Middleware routing works**:
   - Visit each subdomain
   - Verify correct content loads
   - Check browser console for errors

## DNS Configuration

Configure DNS records for all subdomains to point to Vercel:

```
# Main domain
yoohoo.guru         A       76.76.21.21
www.yoohoo.guru     CNAME   cname.vercel-dns.com

# Core services
coach.yoohoo.guru   CNAME   cname.vercel-dns.com
angel.yoohoo.guru   CNAME   cname.vercel-dns.com
heroes.yoohoo.guru  CNAME   cname.vercel-dns.com
dashboard.yoohoo.guru CNAME cname.vercel-dns.com

# Content hubs (24 subdomains)
art.yoohoo.guru     CNAME   cname.vercel-dns.com
business.yoohoo.guru CNAME  cname.vercel-dns.com
# ... repeat for all 24 content subdomains
```

## Routing and Authentication

### Middleware-Based Routing

The `apps/main/middleware.ts` file handles all subdomain routing:

```typescript
// Detects subdomain from hostname
// Rewrites subdomain.yoohoo.guru/* to /_apps/subdomain/*
// Serves content from apps/main/pages/_apps/subdomain/
```

**Valid Subdomains:**
- Core: www, angel, coach, heroes, dashboard
- Content: art, business, coding, cooking, crafts, data, design, finance, fitness, gardening, history, home, investing, language, marketing, math, music, photography, sales, science, sports, tech, wellness, writing

### Centralized Authentication

**NextAuth Configuration:**
- Location: `apps/main/pages/api/auth/[...nextauth].ts`
- Providers: Google OAuth, Email/Password
- Session: JWT with HTTP-only cookies
- Cookie Domain: `.yoohoo.guru` (works across all subdomains)

**Shared Pages:**
All authentication and legal pages are centralized on www.yoohoo.guru:
- `/login` - Sign in
- `/signup` - Registration
- `/terms` - Terms of service
- `/privacy` - Privacy policy
- `/safety` - Safety guidelines
- `/contact` - Contact
- `/faq` - FAQ
- `/help` - Help center
- `/pricing` - Pricing
- `/how-it-works` - Guide
- `/hubs` - Community hubs
- `/about` - About

**Subdomain Redirects:**
When users visit these pages on any subdomain, they are redirected to www.yoohoo.guru. This ensures consistent authentication and easier maintenance.

## Troubleshooting

### Common Issues

**1. Subdomain not resolving:**
- Verify DNS records are correct
- Check Vercel domain configuration
- Wait for DNS propagation (up to 48 hours)

**2. Authentication not working across subdomains:**
- Verify `AUTH_COOKIE_DOMAIN=.yoohoo.guru` is set
- Check browser cookies (should have domain `.yoohoo.guru`)
- Ensure HTTPS is enabled on all subdomains

**3. Middleware not routing correctly:**
- Check `apps/main/middleware.ts` configuration
- Verify subdomain is in `VALID_SUBDOMAINS` set
- Check Vercel deployment logs

**4. 404 errors on subdomain pages:**
- Verify page exists in `apps/main/pages/_apps/{subdomain}/`
- Check middleware rewrite rules
- Review vercel.json redirects

**5. Redirects not working:**
- Verify vercel.json redirect configuration
- Check redirect has correct subdomain pattern
- Test with curl to see actual HTTP response

### Debugging Tools

**Check deployment logs:**
```bash
vercel logs
```

**Test middleware locally:**
```bash
cd apps/main
npm run dev
# Test with: http://localhost:3000
```

**Verify environment variables:**
```bash
vercel env ls
```

## Rollback Procedure

If deployment fails or causes issues:

1. **Revert to previous deployment** in Vercel dashboard
2. **Or rollback via CLI:**
   ```bash
   vercel rollback
   ```

3. **Or revert Git commit:**
   ```bash
   git revert HEAD
   git push origin main
   ```

## Monitoring

**Set up monitoring for:**
- Uptime monitoring for all 29 subdomains
- Error tracking (Sentry, LogRocket)
- Performance monitoring (Vercel Analytics)
- API health checks

**Recommended tools:**
- Vercel Analytics (built-in)
- Sentry for error tracking
- UptimeRobot for uptime monitoring
- Google Analytics for user tracking

## Recent Changes (November 2024)

### PR #489: Fix Routing Issues and 404 Errors

**Changes:**
- Fixed broken redirects in vercel.json
- Added subdomain-to-main redirects for all shared pages
- Created missing subdomain pages (coach/experts, heroes/skills)
- Standardized authentication terminology

**Impact:**
- Reduced 404 errors from 149 to ~0-5
- Improved success rate from 34% to ~88%
- Consistent authentication across all subdomains

**Testing:**
After deploying PR #489, verify:
- All subdomain redirects work
- Authentication persists across subdomains
- No 404 errors on shared pages
- New subdomain pages load correctly

## Support

For deployment issues:
- Check Vercel deployment logs
- Review GitHub Actions (if configured)
- Check Railway logs for backend issues
- Run site audit tool to verify deployment