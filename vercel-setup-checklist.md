# Vercel Project Setup Checklist - yoohooguru-main

## Prerequisites
- [ ] Vercel account created
- [ ] Domain yoohoo.guru owned and accessible
- [ ] Firebase project credentials ready
- [ ] Stripe API keys ready (if using payments)

## Step 1: Create and Link Project

```bash
# From repository root
npx vercel login
npx vercel link
```

**During link process:**
- Project name: `yoohooguru-main`
- Scope: Your Vercel account/team
- Link to existing: No (create new)
- Directory: `./` (root)

## Step 2: Configure Build Settings

**Navigate to:** Vercel Dashboard → yoohooguru-main → Settings → General

### Build & Development Settings
- [ ] Framework Preset: **Next.js**
- [ ] Root Directory: **apps/main**
- [ ] Build Command: **npm run build**
- [ ] Output Directory: **.next**
- [ ] Install Command: **npm install**
- [ ] Node.js Version: **20.x**

### Git Integration
**Navigate to:** Settings → Git

- [ ] Repository connected: **GooseyPrime/yoohooguru**
- [ ] Production Branch: **main**
- [ ] Auto-deploy on push: **Enabled**

## Step 3: Add All 29 Domains

**Navigate to:** Settings → Domains

Copy and paste each domain from `vercel-domains-list.txt`:

### Core Domains (5)
- [ ] www.yoohoo.guru
- [ ] angel.yoohoo.guru
- [ ] coach.yoohoo.guru
- [ ] heroes.yoohoo.guru
- [ ] dashboard.yoohoo.guru

### Subject Domains (24)
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

**Total: 29 domains**

## Step 4: Configure DNS (External)

**In your DNS provider (e.g., Cloudflare, Route53):**

### Option 1: Wildcard DNS (Recommended - Easiest)
```
Type: CNAME
Name: *
Value: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

This single record handles all 29 subdomains automatically.

### Option 2: Individual CNAME Records
If wildcard not supported, create 29 individual CNAME records:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: CNAME
Name: angel
Value: cname.vercel-dns.com

... (repeat for all 29 subdomains)
```

### Verify DNS
After adding DNS records, verify propagation:
```bash
dig www.yoohoo.guru
dig angel.yoohoo.guru
# Should point to Vercel
```

## Step 5: Set Environment Variables

**Navigate to:** Settings → Environment Variables

### Required Variables (Production, Preview, Development)

#### API Configuration
- [ ] `NEXT_PUBLIC_API_URL`
  - Value: `https://api.yoohoo.guru`
  - Environments: Production, Preview, Development

#### Firebase Configuration (All Public)
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
  - Value: (from Firebase Console)
  - Environments: Production, Preview, Development

- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - Value: `your-project.firebaseapp.com`
  - Environments: Production, Preview, Development

- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - Value: (from Firebase Console)
  - Environments: Production, Preview, Development

- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - Value: `your-project.appspot.com`
  - Environments: Production, Preview, Development

- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - Value: (from Firebase Console)
  - Environments: Production, Preview, Development

- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
  - Value: (from Firebase Console)
  - Environments: Production, Preview, Development

#### NextAuth Configuration (SECRET - Generate New)
- [ ] `NEXTAUTH_SECRET`
  - Generate: `openssl rand -base64 32`
  - Environments: Production, Preview, Development
  - **CRITICAL:** Keep this secret, never commit to git

- [ ] `NEXTAUTH_URL`
  - Value: `https://www.yoohoo.guru`
  - Environments: Production only

#### Cross-Subdomain Authentication (CRITICAL!)
- [ ] `AUTH_COOKIE_DOMAIN`
  - Value: `.yoohoo.guru` (note the leading dot!)
  - Environments: Production, Preview, Development
  - **This enables SSO across all 29 subdomains**

#### Stripe Configuration (Optional)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - Value: `pk_live_...` or `pk_test_...`
  - Environments: Production (live), Preview/Dev (test)

#### Agora Video Configuration (Optional)
- [ ] `NEXT_PUBLIC_AGORA_APP_ID`
  - Value: (from Agora Console)
  - Environments: Production, Preview, Development

- [ ] `NEXT_PUBLIC_AGORA_REGION`
  - Value: `us` (or your region)
  - Environments: Production, Preview, Development

#### Feature Flags (Optional)
- [ ] `FEATURE_HERO_GURUS`
  - Value: `true` or `false`
  - Default: `true`

- [ ] `FEATURE_BACKGROUND_CHECKS`
  - Value: `true` or `false`
  - Default: `false`

## Step 6: Deploy

### Option 1: Deploy via Git Push (Recommended)
```bash
git add .
git commit -m "Configure Vercel project"
git push origin main
```
Vercel will automatically detect the push and deploy.

### Option 2: Deploy via CLI
```bash
npx vercel --prod
```

## Step 7: Verify Deployment

### Check Deployment Status
**Navigate to:** Deployments tab in Vercel dashboard

- [ ] Latest deployment shows "Ready" status
- [ ] Build completed without errors
- [ ] All 29 domains listed in deployment

### Check Edge Middleware
**Navigate to:** Latest Deployment → Functions tab

- [ ] Function `middleware` is listed
- [ ] Runtime: `edge`
- [ ] No errors

### Test Each Domain
```bash
# Test main domain
curl -I https://www.yoohoo.guru/

# Test core subdomains
curl -I https://angel.yoohoo.guru/
curl -I https://coach.yoohoo.guru/
curl -I https://heroes.yoohoo.guru/
curl -I https://dashboard.yoohoo.guru/

# Test subject subdomains (sample)
curl -I https://coding.yoohoo.guru/
curl -I https://art.yoohoo.guru/
curl -I https://business.yoohoo.guru/

# All should return 200 OK
```

### Browser Testing
- [ ] Visit www.yoohoo.guru - loads correctly
- [ ] Visit angel.yoohoo.guru - loads Angel Investor page
- [ ] Visit coach.yoohoo.guru - loads Coach page
- [ ] Visit coding.yoohoo.guru - loads Coding subject page
- [ ] No 404 errors
- [ ] No redirect loops
- [ ] SSL certificate valid on all domains

### Authentication Testing
- [ ] Login on www.yoohoo.guru
- [ ] Navigate to angel.yoohoo.guru (should stay logged in)
- [ ] Navigate to coding.yoohoo.guru (should stay logged in)
- [ ] Logout on any subdomain
- [ ] Verify logged out on all subdomains

## Step 8: Firebase Configuration

**Navigate to:** Firebase Console → Authentication → Settings → Authorized Domains

Add all 29 domains:
- [ ] www.yoohoo.guru
- [ ] angel.yoohoo.guru
- [ ] coach.yoohoo.guru
- [ ] heroes.yoohoo.guru
- [ ] dashboard.yoohoo.guru
- [ ] (all 24 subject domains)

**This allows Firebase auth to work on all subdomains.**

## Step 9: Monitor First Deployment

### Check Vercel Logs
**Navigate to:** Latest Deployment → Logs

- [ ] No error logs
- [ ] Middleware routing logs present
- [ ] Build completed successfully

### Check Vercel Analytics (Optional)
**Navigate to:** Analytics tab

- [ ] Traffic showing for domains
- [ ] No unusual error rates

## Post-Setup Verification

Run the automated verification script:
```bash
bash scripts/verify-vercel-setup.sh
```

This will verify:
- [x] Vercel CLI authenticated
- [x] Project linked
- [x] Domains configured
- [x] Environment variables set
- [x] Middleware configuration
- [x] Page structure
- [x] vercel.json settings

## Troubleshooting

### Issue: Domains show "Invalid Configuration"
**Solution:**
- Verify DNS CNAME records point to `cname.vercel-dns.com`
- Wait for DNS propagation (can take up to 48 hours, usually < 1 hour)

### Issue: Build fails
**Solution:**
- Check build logs in Vercel dashboard
- Verify all dependencies in package.json
- Run `npm run build` locally in `apps/main` to test

### Issue: Authentication doesn't work across subdomains
**Solution:**
- Verify `AUTH_COOKIE_DOMAIN=.yoohoo.guru` (with leading dot!)
- Ensure HTTPS is enabled on all domains
- Clear browser cookies and test in incognito mode

### Issue: Subdomain shows 404
**Solution:**
- Verify page exists at `apps/main/pages/_apps/<subdomain>/index.tsx`
- Check middleware mapping includes the subdomain
- Verify domain is added in Vercel dashboard

## Completion Checklist

- [ ] Project `yoohooguru-main` created and linked
- [ ] Build settings configured correctly
- [ ] All 29 domains added to Vercel
- [ ] DNS configured (wildcard or individual CNAMEs)
- [ ] All environment variables set
- [ ] Deployment successful (status: Ready)
- [ ] Edge middleware running
- [ ] All domains accessible via HTTPS
- [ ] Cross-subdomain authentication working
- [ ] Firebase authorized domains configured
- [ ] Automated verification script passes

## Estimated Setup Time

- Steps 1-2 (Project setup): 5 minutes
- Step 3 (Add domains): 10-15 minutes
- Step 4 (DNS configuration): 5 minutes
- Step 5 (Environment variables): 10-15 minutes
- Step 6 (Deploy): 5-10 minutes
- Step 7-9 (Verification): 10-15 minutes

**Total: 45-60 minutes**

## Next Steps After Setup

1. Test all critical user flows
2. Set up monitoring/alerting
3. Configure Vercel Analytics (optional)
4. Set up Vercel Web Analytics (optional)
5. Review security headers in vercel.json
6. Document any custom configurations

---

**Project:** yoohooguru-main
**Architecture:** Gateway with Edge Middleware
**Domains:** 29 subdomains
**Platform:** Vercel
**Framework:** Next.js 14+
