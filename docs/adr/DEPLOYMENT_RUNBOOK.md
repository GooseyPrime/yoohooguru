# Deployment Runbook

This runbook provides step-by-step instructions for deploying the yoohoo.guru platform.

## Table of Contents

1. [Pre-deployment Checklist](#pre-deployment-checklist)
2. [Backend Deployment (Railway)](#backend-deployment-railway)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [Next.js Apps Deployment](#nextjs-apps-deployment)
5. [Post-deployment Verification](#post-deployment-verification)
6. [Rollback Procedures](#rollback-procedures)
7. [Troubleshooting](#troubleshooting)

## Pre-deployment Checklist

Before deploying, ensure:

- [ ] All tests pass: `npm test`
- [ ] Linting passes: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] Environment variables are up to date (see ENVIRONMENT_VARIABLES.md)
- [ ] Database migrations are ready (if any)
- [ ] Feature flags are configured correctly
- [ ] API versioning is maintained
- [ ] Request ID tracking is working
- [ ] Health check endpoints respond correctly
- [ ] No security vulnerabilities: `npm audit`

## Backend Deployment (Railway)

### Production Deployment

1. **Verify Environment Variables**
   ```bash
   railway variables list --service backend
   ```

2. **Deploy Backend**
   ```bash
   git push origin main
   # Railway auto-deploys from main branch
   ```

3. **Monitor Deployment**
   ```bash
   railway logs --service backend --follow
   ```

4. **Verify Health Check**
   ```bash
   curl https://api.yoohoo.guru/health
   ```

### Staging Deployment

1. **Deploy to Staging**
   ```bash
   git push origin staging
   # Railway auto-deploys staging branch
   ```

2. **Verify Staging**
   ```bash
   curl https://staging-api.yoohoo.guru/health
   ```

### Environment-Specific Variables

Ensure these are set in Railway:

- `NODE_ENV=production`
- `SESSION_SECRET` (32+ character random string)
- `FIREBASE_*` credentials
- `STRIPE_*` keys
- `OPENROUTER_API_KEY`
- `CORS_ORIGINS` (comma-separated list)

See [ENVIRONMENT_VARIABLES.md](../ENVIRONMENT_VARIABLES.md) for complete list.

## Frontend Deployment (Vercel)

### Production Deployment

1. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

3. **Verify Deployment**
   - Visit https://yoohoo.guru
   - Check browser console for errors
   - Test authentication flow
   - Verify API connectivity

### Preview Deployments

Vercel automatically creates preview deployments for PRs.

## Next.js Apps Deployment

Each subdomain app can be deployed independently to Vercel:

1. **Deploy Main App**
   ```bash
   cd apps/main
   vercel --prod
   ```

2. **Deploy Subdomain Apps**
   ```bash
   cd apps/angel
   vercel --prod
   
   cd apps/coach
   vercel --prod
   
   # Repeat for other subdomains
   ```

3. **Configure Domains**
   - main: yoohoo.guru
   - angel: angel.yoohoo.guru
   - coach: coach.yoohoo.guru
   - heroes: heroes.yoohoo.guru
   - dashboard: dashboard.yoohoo.guru

## Post-deployment Verification

### Automated Checks

Run the verification script:
```bash
npm run verify:deployment
```

### Manual Verification

1. **API Health Checks**
   ```bash
   # Production API
   curl https://api.yoohoo.guru/health
   curl https://api.yoohoo.guru/api/v1/status
   
   # Verify request ID in response headers
   curl -I https://api.yoohoo.guru/health | grep X-Request-ID
   ```

2. **Frontend Functionality**
   - [ ] Homepage loads
   - [ ] Authentication works
   - [ ] User can create/view profiles
   - [ ] Search functionality works
   - [ ] Payment flow works

3. **Subdomain Apps**
   - [ ] angel.yoohoo.guru loads
   - [ ] coach.yoohoo.guru loads
   - [ ] heroes.yoohoo.guru loads
   - [ ] dashboard.yoohoo.guru loads

4. **Monitoring**
   - Check Vercel Analytics
   - Check Railway metrics
   - Check Firebase console
   - Check Stripe dashboard

## Rollback Procedures

### Backend Rollback

1. **Identify Previous Deployment**
   ```bash
   railway deployments list --service backend
   ```

2. **Rollback to Previous Version**
   ```bash
   railway rollback <deployment-id>
   ```

3. **Verify Rollback**
   ```bash
   curl https://api.yoohoo.guru/health
   ```

### Frontend Rollback

1. **List Previous Deployments**
   ```bash
   vercel ls
   ```

2. **Promote Previous Deployment**
   ```bash
   vercel promote <deployment-url>
   ```

### Emergency Procedures

If the platform is down:

1. **Check Status Pages**
   - Railway: https://railway.app/status
   - Vercel: https://vercel-status.com
   - Firebase: https://status.firebase.google.com

2. **Check Logs**
   ```bash
   # Backend logs
   railway logs --service backend --lines 100
   
   # Frontend logs (Vercel dashboard)
   ```

3. **Rollback if Needed**
   Follow rollback procedures above

4. **Notify Team**
   - Post in #incidents channel
   - Update status page (if available)

## Troubleshooting

### Common Issues

**Issue: 502 Bad Gateway**
- Check Railway service is running: `railway status`
- Check backend logs: `railway logs`
- Verify environment variables are set
- Check health endpoint: `curl https://api.yoohoo.guru/health`

**Issue: API Version Not Found**
- Ensure v1 routes are mounted correctly
- Check deployment logs for errors
- Verify route imports in `backend/src/index.js`

**Issue: Request ID Missing**
- Check requestIdMiddleware is loaded
- Verify middleware order in `backend/src/index.js`
- Check response headers: `curl -I <url>`

**Issue: Authentication Failing**
- Verify Firebase credentials
- Check CORS configuration
- Verify SESSION_SECRET is set
- Check cookie settings

### Getting Help

1. Check existing documentation in `/docs`
2. Review ADRs in `/docs/adr`
3. Check deployment logs
4. Contact platform team

## Related Documentation

- [Environment Variables](../ENVIRONMENT_VARIABLES.md)
- [Railway Deployment](../RAILWAY_DEPLOYMENT.md)
- [Firebase Setup](../FIREBASE_SETUP.md)
- [ADR-0001: API Versioning](./0001-api-versioning.md)
- [ADR-0002: Request ID Tracking](./0002-request-id-tracking.md)
