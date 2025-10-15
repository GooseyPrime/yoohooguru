# Gateway Architecture Migration - Deployment Checklist

## ✅ Completed Refactoring

This PR successfully transforms the YooHoo.Guru platform from a multi-project Vercel deployment to a single gateway architecture.

### What Changed

#### 1. Middleware-Based Routing ✅
- Created `apps/main/middleware.ts` with subdomain detection and routing
- Middleware maps 29 subdomains to their respective pages
- Supports unlimited subdomains via Edge Middleware

#### 2. Consolidated Page Structure ✅
- All app pages moved to `apps/main/pages/_apps/`
- Each subdomain has its directory: `_apps/angel/`, `_apps/coach/`, etc.
- 29 apps consolidated into single Next.js application

#### 3. Build Configuration ✅
- Updated `vercel.json` to build from `apps/main`
- Updated `next.config.js` for gateway architecture
- Removed complex multi-project configuration

#### 4. Documentation ✅
- Created `GATEWAY_ARCHITECTURE.md` - comprehensive deployment guide
- Updated `MONOREPO_README.md` to reflect new architecture
- Deprecated old `DEPLOYMENT_GUIDE.md` (legacy approach)

#### 5. Testing ✅
- Build successful: All 29 apps compile correctly
- TypeScript validation passes
- Local testing confirms:
  - `www.yoohoo.guru` → Main app homepage
  - `angel.yoohoo.guru` → Angel's List page
  - `coding.yoohoo.guru` → Coding Guru page

## 📋 Deployment Checklist

Follow these steps to deploy the new architecture to Vercel:

### Step 1: Backup Current Deployment
- [ ] Note down all environment variables from current Vercel projects
- [ ] Document all custom domain configurations
- [ ] Take screenshots of current working deployments

### Step 2: DNS Configuration
- [ ] Add wildcard DNS record: `*.yoohoo.guru CNAME cname.vercel-dns.com`
- [ ] Verify DNS propagation: `dig *.yoohoo.guru`

### Step 3: Create New Vercel Project
- [ ] Go to Vercel Dashboard
- [ ] Create new project from this repository
- [ ] Configure project settings:
  - **Name**: `yoohooguru-gateway` (or similar)
  - **Root Directory**: Leave empty
  - **Build Command**: `cd apps/main && npm run build`
  - **Output Directory**: `apps/main/.next`
  - **Install Command**: `npm ci && cd apps/main && npm ci`
  - **Framework Preset**: Next.js

### Step 4: Configure Environment Variables
Copy all variables from `.env.shared.example` or existing projects:

- [ ] `NEXT_PUBLIC_API_URL`
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `NEXTAUTH_SECRET`
- [ ] `AUTH_COOKIE_DOMAIN=.yoohoo.guru`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] Any other app-specific variables

### Step 5: Add Custom Domains
In Vercel project settings → Domains, add:

- [ ] www.yoohoo.guru
- [ ] angel.yoohoo.guru
- [ ] coach.yoohoo.guru
- [ ] heroes.yoohoo.guru
- [ ] dashboard.yoohoo.guru
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

### Step 6: Deploy and Test
- [ ] Merge this PR to main branch
- [ ] Wait for Vercel to build and deploy (5-10 minutes)
- [ ] Test each subdomain:
  - [ ] www.yoohoo.guru - Loads homepage
  - [ ] angel.yoohoo.guru - Loads Angel's List
  - [ ] coach.yoohoo.guru - Loads Coach Guru
  - [ ] coding.yoohoo.guru - Loads Coding Guru
  - [ ] ... (test critical subdomains)
- [ ] Test authentication across subdomains
- [ ] Test API connectivity
- [ ] Check browser console for errors

### Step 7: Cleanup Old Projects (After Verification)
⚠️ **Only do this after confirming new deployment works**

- [ ] Archive old Vercel projects (don't delete immediately)
- [ ] Update any external links/bookmarks
- [ ] Update documentation/wiki if applicable
- [ ] Notify team of new architecture

## 🎉 Benefits of New Architecture

1. **No More Project Limits**: Supports unlimited subdomains
2. **Simpler Deployment**: Single build/deploy pipeline
3. **Centralized Config**: One place for environment variables
4. **Faster Deploys**: ~5-10 min vs 29 separate builds
5. **Easier to Maintain**: Add new subdomains without new projects
6. **Cost Effective**: One Vercel project vs multiple

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all dependencies installed: `npm ci && cd apps/main && npm ci`
- Test locally: `cd apps/main && npm run build`

### Subdomain Not Working
1. Verify subdomain added to Vercel domains
2. Check DNS propagation: `dig subdomain.yoohoo.guru`
3. Verify middleware mapping in `apps/main/middleware.ts`
4. Check page exists at `apps/main/pages/_apps/<subdomain>/index.tsx`

### Authentication Issues
1. Verify `AUTH_COOKIE_DOMAIN=.yoohoo.guru` is set
2. Clear browser cookies and test in incognito
3. Check cookies in browser DevTools (should have `.yoohoo.guru` domain)

### Need Help?
- See `GATEWAY_ARCHITECTURE.md` for detailed documentation
- Review middleware code in `apps/main/middleware.ts`
- Check Vercel logs for runtime errors

## 📚 Documentation

- **[GATEWAY_ARCHITECTURE.md](./GATEWAY_ARCHITECTURE.md)** - Complete deployment guide
- **[MONOREPO_README.md](./MONOREPO_README.md)** - Repository structure
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Legacy guide (deprecated)

## 🚀 Next Steps

After successful deployment:

1. **Monitor**: Check Vercel Analytics for traffic patterns
2. **Optimize**: Review bundle sizes and performance metrics
3. **Extend**: Add new subdomains by creating directories in `_apps/`
4. **Scale**: Consider adding dynamic routes for user-generated subdomains

---

**Questions or issues?** Refer to the documentation or open an issue.
