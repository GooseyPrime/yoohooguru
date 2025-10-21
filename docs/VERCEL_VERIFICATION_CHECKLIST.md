# Vercel Gateway Architecture - Verification Checklist

## Overview

This document provides a comprehensive checklist to verify that your Vercel project is properly configured for the Gateway Architecture serving 29 subdomains.

## Quick Verification (Command Line)

### Option 1: Run the Automated Script

```bash
# From repository root
./scripts/verify-vercel-setup.sh
```

### Option 2: Manual Vercel CLI Commands

```bash
# 1. Authenticate with Vercel
npx vercel login

# 2. Link the project (if not already linked)
npx vercel link

# 3. Check project status
npx vercel inspect

# 4. List configured domains
npx vercel domains ls

# 5. List environment variables (names only)
npx vercel env ls

# 6. Check deployment status
npx vercel ls
```

## Manual Dashboard Verification

### Step 1: Project Settings - General

Navigate to: **Vercel Dashboard → Your Project → Settings → General**

#### ✅ Framework Preset
- [ ] Set to: **Next.js**

#### ✅ Root Directory
- [ ] Set to: **apps/main** OR **leave empty**

#### ✅ Build & Output Settings
- [ ] Build Command: `npm run build` OR `cd apps/main && npm run build`
- [ ] Output Directory: `.next` OR `apps/main/.next`
- [ ] Install Command: `npm install` OR `npm ci && cd apps/main && npm ci`

#### ✅ Node.js Version
- [ ] Set to: **20.x** or higher

### Step 2: Domains Configuration

Navigate to: **Vercel Dashboard → Your Project → Settings → Domains**

#### ✅ Core Subdomains (5)
- [ ] www.yoohoo.guru
- [ ] angel.yoohoo.guru
- [ ] coach.yoohoo.guru
- [ ] heroes.yoohoo.guru
- [ ] dashboard.yoohoo.guru

#### ✅ Subject Subdomains (24)
- [ ] art.yoohoo.guru
- [ ] business.yoohoo.guru
- [ ] coding.yoohoo.guru
- [ ] cooking.yoohoo.guru
- [ ] crafts.yoohoo.guru
- [ ] data.yoohoo.guru
- [ ] design.yoohoo.guru
- [ ] finance.yoohoo.guru
- [ ] fitness.yoohoo.guru
- [ ] gardening.yoohoo.guru
- [ ] history.yoohoo.guru
- [ ] home.yoohoo.guru
- [ ] investing.yoohoo.guru
- [ ] language.yoohoo.guru
- [ ] marketing.yoohoo.guru
- [ ] math.yoohoo.guru
- [ ] music.yoohoo.guru
- [ ] photography.yoohoo.guru
- [ ] sales.yoohoo.guru
- [ ] science.yoohoo.guru
- [ ] sports.yoohoo.guru
- [ ] tech.yoohoo.guru
- [ ] wellness.yoohoo.guru
- [ ] writing.yoohoo.guru

**Total Expected: 29 domains**

#### Domain Status
Each domain should show:
- [ ] Status: **Valid** (green checkmark)
- [ ] SSL: **Enabled** (automatic)
- [ ] Redirects: Configured if needed

### Step 3: Environment Variables

Navigate to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

#### ✅ Required Variables (Production)

##### API Configuration
- [ ] `NEXT_PUBLIC_API_URL`
  - Example: `https://api.yoohoo.guru`
  - Environment: Production, Preview, Development

##### Firebase Configuration
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
  - Environment: Production, Preview, Development

##### NextAuth Configuration
- [ ] `NEXTAUTH_SECRET`
  - Strong random secret (generate: `openssl rand -base64 32`)
  - Environment: Production, Preview, Development

- [ ] `NEXTAUTH_URL`
  - Example: `https://www.yoohoo.guru`
  - Environment: Production only (automatic in Preview/Dev)

##### Cross-Subdomain Authentication (CRITICAL)
- [ ] `AUTH_COOKIE_DOMAIN`
  - **MUST BE**: `.yoohoo.guru` (note the leading dot)
  - Environment: Production, Preview, Development
  - **This is critical for SSO across all subdomains**

##### Stripe Configuration (if applicable)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - Environment: Production, Preview, Development

#### ✅ Optional Variables

##### Feature Flags
- [ ] `FEATURE_HERO_GURUS` (default: true)
- [ ] `FEATURE_BACKGROUND_CHECKS` (default: false)

### Step 4: Git Integration

Navigate to: **Vercel Dashboard → Your Project → Settings → Git**

- [ ] GitHub repository connected
- [ ] Production branch: `main`
- [ ] Auto-deploy enabled for production branch
- [ ] Preview deployments: Enabled for pull requests

### Step 5: Deployment Configuration

Navigate to: **Vercel Dashboard → Your Project → Deployments**

#### ✅ Latest Deployment
- [ ] Status: **Ready** (successful)
- [ ] Build time: Reasonable (< 5 minutes typically)
- [ ] No errors in build logs

#### ✅ Deployment Domains
Check that the deployment is serving all domains:
- [ ] Click on deployment
- [ ] Check "Domains" tab
- [ ] Verify all 29 domains are listed

### Step 6: Function Configuration (Edge Middleware)

Navigate to: **Vercel Dashboard → Your Project → Deployments → [Latest] → Functions**

- [ ] Edge middleware function listed
- [ ] Function: `middleware`
- [ ] Runtime: `edge`
- [ ] No errors

### Step 7: DNS Configuration (External)

Check your DNS provider (e.g., Cloudflare, Route53, etc.):

#### Option 1: Wildcard DNS (Recommended)
```
Type: CNAME
Name: *
Value: cname.vercel-dns.com
TTL: 3600
```

#### Option 2: Individual CNAME Records (Alternative)
Create a CNAME record for each of the 29 subdomains:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: CNAME
Name: angel
Value: cname.vercel-dns.com

... (repeat for all 29 subdomains)
```

## Testing After Configuration

### DNS Resolution Test

```bash
# Test DNS propagation for each subdomain
dig www.yoohoo.guru
dig angel.yoohoo.guru
dig coding.yoohoo.guru

# Should all point to Vercel
```

### HTTP/HTTPS Test

```bash
# Test each subdomain is accessible
curl -I https://www.yoohoo.guru/
curl -I https://angel.yoohoo.guru/
curl -I https://coach.yoohoo.guru/
curl -I https://heroes.yoohoo.guru/
curl -I https://dashboard.yoohoo.guru/

# All should return 200 OK
```

### Middleware Routing Test

Visit each subdomain in a browser and verify:
- [ ] Each subdomain loads the correct content
- [ ] No 404 errors
- [ ] No redirect loops
- [ ] URL stays on the subdomain (doesn't redirect away)

### Cross-Subdomain Authentication Test

1. [ ] Login on www.yoohoo.guru
2. [ ] Navigate to angel.yoohoo.guru
3. [ ] Verify you're still logged in (check auth state)
4. [ ] Navigate to coding.yoohoo.guru
5. [ ] Verify you're still logged in
6. [ ] Logout on any subdomain
7. [ ] Verify you're logged out on all subdomains

### SSL Certificate Test

```bash
# Check SSL certificate
openssl s_client -connect www.yoohoo.guru:443 -servername www.yoohoo.guru

# Verify:
# - Certificate is valid
# - Issued by Let's Encrypt (or other CA)
# - Covers all subdomains
```

## Common Issues & Solutions

### Issue: Subdomain shows 404 error

**Possible Causes:**
1. Domain not added to Vercel project
2. DNS not configured correctly
3. Page doesn't exist in `apps/main/pages/_apps/<subdomain>/`

**Solutions:**
1. Add domain in Vercel Dashboard → Domains
2. Check DNS propagation with `dig <subdomain>.yoohoo.guru`
3. Verify page exists at correct path

### Issue: Authentication doesn't work across subdomains

**Possible Causes:**
1. `AUTH_COOKIE_DOMAIN` not set to `.yoohoo.guru`
2. Missing leading dot in cookie domain
3. Not using HTTPS

**Solutions:**
1. Set `AUTH_COOKIE_DOMAIN=.yoohoo.guru` in Vercel env vars
2. Ensure leading dot is present
3. Ensure all subdomains use HTTPS

### Issue: Build fails

**Possible Causes:**
1. Incorrect build command or output directory
2. Missing dependencies
3. Environment variables not set

**Solutions:**
1. Check build logs in Vercel Dashboard
2. Verify `vercel.json` configuration
3. Ensure all env vars are set for correct environments

### Issue: Middleware not routing correctly

**Possible Causes:**
1. Middleware file not at correct path
2. Subdomain not in SUBDOMAIN_MAP
3. Middleware matcher excluding routes

**Solutions:**
1. Verify `apps/main/middleware.ts` exists
2. Check SUBDOMAIN_MAP includes subdomain
3. Review matcher configuration in middleware config

## Final Checklist

Before marking setup as complete:

- [ ] All 29 domains added to Vercel project
- [ ] All domains show "Valid" status with SSL
- [ ] All required environment variables set
- [ ] Latest deployment successful
- [ ] DNS configured (wildcard or individual CNAMEs)
- [ ] All subdomains load correctly in browser
- [ ] Cross-subdomain authentication works
- [ ] No console errors in browser
- [ ] Middleware routing logs show correct behavior
- [ ] Mobile responsiveness tested on key subdomains

## Monitoring & Maintenance

### Regular Checks

**Weekly:**
- [ ] Check deployment status
- [ ] Review error logs
- [ ] Monitor SSL certificate expiration

**Monthly:**
- [ ] Review environment variables for accuracy
- [ ] Test authentication flow
- [ ] Check all subdomains for accessibility

**When Adding New Subdomain:**
- [ ] Create page in `apps/main/pages/_apps/<subdomain>/`
- [ ] Add to SUBDOMAIN_MAP in middleware.ts
- [ ] Add domain in Vercel Dashboard
- [ ] Configure DNS record
- [ ] Deploy and test

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Middleware Documentation](https://nextjs.org/docs/advanced-features/middleware)
- [Gateway Architecture Guide](../GATEWAY_ARCHITECTURE.md)
- [Deployment Guide](../docs/DEPLOYMENT.md)

## Support

If you encounter issues not covered in this checklist:
1. Check Vercel build logs
2. Review browser console errors
3. Check middleware logs in Vercel Functions
4. Consult the Gateway Architecture documentation
5. Open an issue in the repository

---

**Last Updated:** 2025-10-21
**Vercel CLI Version:** 48.5.0
**Next.js Version:** 14.2.0
