# Deployment Guide for YooHoo.Guru Monorepo

## ⚠️ DEPRECATED - See GATEWAY_ARCHITECTURE.md

**This deployment guide is deprecated.** The platform has been refactored to use a single gateway architecture that eliminates the need for separate Vercel projects.

**➡️ For current deployment instructions, see [GATEWAY_ARCHITECTURE.md](./GATEWAY_ARCHITECTURE.md)**

The new gateway architecture:
- Uses a single Vercel project for all subdomains
- Supports unlimited subdomains via Edge Middleware
- Simplifies environment variable management
- Reduces deployment complexity

---

## Overview (Legacy)

This guide explains the old multi-project deployment approach, which is no longer used.

## Prerequisites

- Vercel account
- Vercel CLI installed: `npm i -g vercel`
- Access to project environment variables

## Deployment Structure

Each app in `/apps` should be deployed as a separate Vercel project with its own custom domain:

| App | Directory | Domain |
|-----|-----------|--------|
| Main | `apps/main` | www.yoohoo.guru |
| Angel | `apps/angel` | angel.yoohoo.guru |
| Coach | `apps/coach` | coach.yoohoo.guru |
| Heroes | `apps/heroes` | heroes.yoohoo.guru |
| Dashboard | `apps/dashboard` | dashboard.yoohoo.guru |
| Cooking | `apps/cooking` | cooking.yoohoo.guru |
| ... | ... | ... |

## Step-by-Step Deployment

### 1. Deploy Main App (www.yoohoo.guru)

```bash
cd apps/main
vercel
```

**Configure:**
- Project Name: `yoohooguru-main`
- Root Directory: `apps/main`
- Framework: Next.js
- Build Command: `next build`
- Output Directory: `.next`
- Custom Domain: `www.yoohoo.guru`

**Environment Variables:**
```bash
NEXTAUTH_URL=https://www.yoohoo.guru
NEXTAUTH_SECRET=<your-secret>
NEXT_PUBLIC_API_URL=https://api.yoohoo.guru
NEXT_PUBLIC_FIREBASE_API_KEY=<your-key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your-domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your-bucket>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
NEXT_PUBLIC_FIREBASE_APP_ID=<your-app-id>
AUTH_COOKIE_DOMAIN=.yoohoo.guru
```

### 2. Deploy Angel's List App

```bash
cd apps/angel
vercel
```

**Configure:**
- Project Name: `yoohooguru-angel`
- Root Directory: `apps/angel`
- Custom Domain: `angel.yoohoo.guru`
- Same environment variables as above but with `NEXTAUTH_URL=https://angel.yoohoo.guru`

### 3. Deploy Coach Guru App

```bash
cd apps/coach
vercel
```

**Configure:**
- Project Name: `yoohooguru-coach`
- Root Directory: `apps/coach`
- Custom Domain: `coach.yoohoo.guru`
- Same environment variables as above but with `NEXTAUTH_URL=https://coach.yoohoo.guru`

### 4. Deploy Hero Guru's App

```bash
cd apps/heroes
vercel
```

**Configure:**
- Project Name: `yoohooguru-heroes`
- Root Directory: `apps/heroes`
- Custom Domain: `heroes.yoohoo.guru`
- Same environment variables as above but with `NEXTAUTH_URL=https://heroes.yoohoo.guru`

### 5. Deploy Dashboard App

```bash
cd apps/dashboard
vercel
```

**Configure:**
- Project Name: `yoohooguru-dashboard`
- Root Directory: `apps/dashboard`
- Custom Domain: `dashboard.yoohoo.guru`
- Same environment variables as above but with `NEXTAUTH_URL=https://dashboard.yoohoo.guru`

### 6. Deploy Subject Apps

Repeat for each subject app (cooking, coding, art, business, crafts, data, design, finance, fitness, gardening, home, investing, language, marketing, music, photography, sales, tech, wellness, writing):

```bash
cd apps/<app-name>
vercel
```

## Automated Deployment with GitHub

### Setup GitHub Integration

1. Connect your GitHub repository to Vercel
2. Create a separate Vercel project for each app
3. Configure project settings:
   - **Root Directory**: `apps/<app-name>`
   - **Build Command**: `cd ../.. && npm run build:<app-name>`
   - **Output Directory**: `apps/<app-name>/.next`

### Vercel Configuration Files

Create `vercel.json` in each app directory:

```json
{
  "buildCommand": "cd ../.. && turbo run build --filter=@yoohooguru/<app-name>",
  "installCommand": "cd ../.. && npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

## DNS Configuration

Configure DNS records for each subdomain:

```
www.yoohoo.guru     CNAME   cname.vercel-dns.com
angel.yoohoo.guru   CNAME   cname.vercel-dns.com
coach.yoohoo.guru   CNAME   cname.vercel-dns.com
heroes.yoohoo.guru  CNAME   cname.vercel-dns.com
dashboard.yoohoo.guru CNAME cname.vercel-dns.com
... (repeat for all subject apps)
```

## Environment Variables Management

### Shared Variables

Use Vercel's environment variable inheritance or create `.env.shared` at root:

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

# Auth Configuration
AUTH_COOKIE_DOMAIN=.yoohoo.guru
NEXTAUTH_SECRET=<secret>
```

### App-Specific Variables

Each app needs its own `NEXTAUTH_URL`:

```bash
# Main app
NEXTAUTH_URL=https://www.yoohoo.guru

# Angel app
NEXTAUTH_URL=https://angel.yoohoo.guru

# etc...
```

## Testing Deployment

### Local Testing

Before deploying, test locally:

```bash
# Test specific app
npm run dev:main
npm run dev:angel
npm run dev:coach

# Test all apps
npm run dev
```

### Production Testing

After deployment:

1. Visit each subdomain
2. Test authentication across subdomains
3. Verify cross-subdomain cookie sharing
4. Test API connectivity
5. Check that all links work correctly

## Troubleshooting

### Build Failures

If builds fail:

1. Check that all dependencies are installed at root
2. Verify `turbo.json` configuration
3. Ensure `package.json` workspaces are correct
4. Check build logs in Vercel dashboard

### Authentication Issues

If auth doesn't work across subdomains:

1. Verify `AUTH_COOKIE_DOMAIN=.yoohoo.guru` is set
2. Check `NEXTAUTH_URL` is correct for each app
3. Ensure cookies are being set with correct domain
4. Test in incognito mode to rule out cached cookies

### API Connection Issues

If apps can't connect to API:

1. Verify `NEXT_PUBLIC_API_URL` is set correctly
2. Check CORS settings in backend
3. Ensure backend API is deployed and accessible
4. Test API endpoints directly

## Rollback

To rollback a deployment:

```bash
vercel rollback <deployment-url>
```

Or use Vercel dashboard to rollback to previous deployment.

## Continuous Deployment

Vercel automatically deploys:
- `main` branch → Production
- Other branches → Preview deployments

Configure branch protection rules in GitHub to require reviews before merging to main.

## Monitoring

Use Vercel Analytics and Logs to monitor:
- Build times
- Error rates
- Traffic patterns
- Performance metrics

## Support

For deployment issues:
- Check Vercel documentation: https://vercel.com/docs
- Review build logs in Vercel dashboard
- Consult MONOREPO_README.md for architecture details
