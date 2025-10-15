# Gateway Architecture - Infinite Subdomain Support

## Overview

The YooHoo.Guru platform has been refactored to use a **single gateway architecture** that bypasses Vercel's 10-project limit. This allows us to support unlimited subdomains through a single Vercel project using Edge Middleware for subdomain routing.

## Architecture Summary

### Before (Multi-Project)
- ❌ Each subdomain required a separate Vercel project
- ❌ Limited to 10 projects per repository
- ❌ Complex environment variable management across projects
- ❌ Difficult to maintain consistency

### After (Gateway)
- ✅ One Vercel project handles all subdomains
- ✅ Unlimited subdomain support via Edge Middleware
- ✅ Single deployment pipeline
- ✅ Shared configuration via `.env.shared`
- ✅ Centralized build and deployment

## How It Works

### 1. Wildcard DNS
Configure wildcard DNS for `*.yoohoo.guru` to point to the single Vercel deployment:

```
*.yoohoo.guru    CNAME   cname.vercel-dns.com
```

This ensures all subdomains (angel.yoohoo.guru, coding.yoohoo.guru, etc.) resolve to the same deployment.

### 2. Edge Middleware Routing
The `apps/main/middleware.ts` file intercepts all requests and determines which app to serve based on the subdomain:

```typescript
// Request: https://angel.yoohoo.guru/
// Middleware extracts "angel" from hostname
// Rewrites to: /_apps/angel/index
```

The rewrite is **internal** - users still see the original URL in their browser.

### 3. Consolidated Pages Structure
All app pages are consolidated under `apps/main/pages/_apps/`:

```
apps/main/pages/
├── _app.tsx              # Global app wrapper
├── index.tsx             # Fallback/root page
└── _apps/
    ├── main/
    │   └── index.tsx     # www.yoohoo.guru
    ├── angel/
    │   └── index.tsx     # angel.yoohoo.guru
    ├── coach/
    │   └── index.tsx     # coach.yoohoo.guru
    ├── coding/
    │   └── index.tsx     # coding.yoohoo.guru
    └── ... (29 total apps)
```

## Deployment

### Single Vercel Project Setup

1. **Create one Vercel project** for the entire repository
2. **Configure project settings**:
   - **Root Directory**: Leave empty (deploy from root)
   - **Build Command**: `cd apps/main && npm run build`
   - **Output Directory**: `apps/main/.next`
   - **Framework**: Next.js
   - **Install Command**: `npm ci && cd apps/main && npm ci`

3. **Set custom domains** in Vercel project settings:
   - www.yoohoo.guru
   - angel.yoohoo.guru
   - coach.yoohoo.guru
   - heroes.yoohoo.guru
   - dashboard.yoohoo.guru
   - ... (add all 29 subdomains)

### Environment Variables

Set these in your **single Vercel project**:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.yoohoo.guru

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=<key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<project-id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<bucket>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<sender-id>
NEXT_PUBLIC_FIREBASE_APP_ID=<app-id>

# NextAuth Configuration
NEXTAUTH_SECRET=<secret>

# Auth Cookie Domain (for cross-subdomain authentication)
AUTH_COOKIE_DOMAIN=.yoohoo.guru

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<key>

# Feature Flags
FEATURE_HERO_GURUS=true
FEATURE_BACKGROUND_CHECKS=false
```

**Note**: No need for per-subdomain `NEXTAUTH_URL` - the middleware handles this dynamically.

## Development

### Local Development

Run the gateway app locally:

```bash
# Install dependencies
npm install
cd apps/main && npm install

# Run development server
cd apps/main && npm run dev
```

Test different subdomains by modifying your `/etc/hosts` file:

```
127.0.0.1  www.yoohoo.local
127.0.0.1  angel.yoohoo.local
127.0.0.1  coach.yoohoo.local
```

Then access: `http://www.yoohoo.local:3000`, `http://angel.yoohoo.local:3000`, etc.

### Testing Middleware

The middleware logs subdomain routing to the console:

```bash
npm run dev:main
# Visit different URLs to see routing in action
```

## Adding New Subdomains

To add a new subdomain (e.g., `design.yoohoo.guru`):

1. **Create page directory**:
   ```bash
   mkdir -p apps/main/pages/_apps/design
   ```

2. **Add index page**:
   ```bash
   # Create apps/main/pages/_apps/design/index.tsx
   ```

3. **Update middleware** (if subdomain name differs from directory):
   ```typescript
   // apps/main/middleware.ts
   const SUBDOMAIN_MAP: Record<string, string> = {
     // ... existing mappings
     "design": "design",  // Add new mapping
   };
   ```

4. **Add domain to Vercel**:
   - Go to Vercel project settings
   - Navigate to "Domains"
   - Add `design.yoohoo.guru`

5. **Deploy**:
   ```bash
   git add .
   git commit -m "Add design subdomain"
   git push
   ```

## Migration from Old Architecture

If you previously had separate Vercel projects:

1. **Delete old Vercel projects** (after verifying gateway works)
2. **Update DNS records** to point all subdomains to the single project
3. **Consolidate environment variables** into the single project
4. **Remove per-app vercel.json files** (no longer needed)

## Troubleshooting

### Subdomain Not Working

1. Check DNS propagation: `dig subdomain.yoohoo.guru`
2. Verify subdomain is added to Vercel project domains
3. Check middleware mapping in `apps/main/middleware.ts`
4. Ensure page exists at `apps/main/pages/_apps/<subdomain>/index.tsx`

### Middleware Not Running

1. Verify middleware is at `apps/main/middleware.ts`
2. Check middleware config matcher is correct
3. Look for middleware errors in Vercel logs
4. Test locally with `npm run dev:main`

### Build Failures

1. Ensure all dependencies are installed: `npm ci && cd apps/main && npm ci`
2. Check for TypeScript errors: `cd apps/main && npm run build`
3. Verify shared package is building: `cd packages/shared && npm run build`
4. Review Vercel build logs

### Authentication Issues

The gateway architecture automatically handles cross-subdomain auth via the `AUTH_COOKIE_DOMAIN=.yoohoo.guru` setting. If auth isn't working:

1. Verify `AUTH_COOKIE_DOMAIN` is set in Vercel
2. Check that cookies are set with correct domain in browser DevTools
3. Ensure HTTPS is used (cookies with `.domain` require secure context)
4. Test in incognito mode to rule out cached cookies

## Benefits of Gateway Architecture

1. **Unlimited Subdomains**: No more 10-project limit
2. **Simpler Deployment**: One build, one deployment
3. **Consistent Configuration**: Single source of truth for env vars
4. **Faster Deploys**: Single build process vs. 29 separate builds
5. **Better DX**: Easier to add new subdomains and features
6. **Cost Effective**: One Vercel project vs. multiple projects

## Performance Considerations

- **Edge Middleware**: Runs on Cloudflare's edge network (low latency)
- **Static Generation**: All pages are pre-rendered at build time
- **Code Splitting**: Next.js automatically splits code per page
- **CDN**: Vercel's global CDN serves static assets

## Security

- Middleware runs in isolated edge runtime
- No access to Node.js APIs in middleware (security by design)
- All environment variables remain server-side
- CORS and CSP headers configured in `vercel.json`

## Future Enhancements

- [ ] Dynamic subdomain creation without rebuilds
- [ ] Subdomain-specific theming via middleware
- [ ] A/B testing via middleware routing
- [ ] Geolocation-based routing
- [ ] Rate limiting per subdomain

## Support

For issues with the gateway architecture:
1. Check this documentation
2. Review middleware logs in Vercel dashboard
3. Test locally with `npm run dev:main`
4. Consult `MONOREPO_README.md` for overall architecture
5. See `DEPLOYMENT_GUIDE.md` for legacy deployment info (deprecated)
