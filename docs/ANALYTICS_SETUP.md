# Analytics and Monitoring Setup

## Vercel Speed Insights & Analytics

✅ **Installed and Configured:**
- `@vercel/speed-insights` - Performance monitoring
- `@vercel/analytics` - User behavior tracking
- Automatically enabled on Vercel production deployments

## Google Analytics & Tag Manager

### Environment Variables Required:
```bash
# Add these to Vercel Environment Variables
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_CONTAINER_ID=GTM-XXXXXXX
NEXT_PUBLIC_VERCEL_ANALYTICS=true
```

### Setup Steps:
1. **Google Analytics 4:**
   - Create GA4 property at https://analytics.google.com
   - Copy the Measurement ID (G-XXXXXXXXXX)
   - Add to Vercel environment variables

2. **Google Tag Manager:**
   - Create container at https://tagmanager.google.com
   - Copy the Container ID (GTM-XXXXXXX)
   - Add to Vercel environment variables

## Analytics Features Implemented:

### Automatic Tracking:
- ✅ Page views across all routes
- ✅ Cross-subdomain tracking (heroes.yoohoo.guru, coach.yoohoo.guru, etc.)
- ✅ Performance metrics via Vercel Speed Insights

### Custom Event Tracking:
Use the `useAnalytics` hook in components:

```typescript
import { useAnalytics } from '../components/useAnalytics'

const { trackUserSignup, trackSessionBooking, trackSearchQuery } = useAnalytics()

// Track user signup
trackUserSignup('google')

// Track session booking
trackSessionBooking('coach', 'video_call')

// Track search
trackSearchQuery('javascript', 'coding')
```

### Available Tracking Methods:
- `trackEvent(action, category, label?, value?)`
- `trackPageView(url, title?)`
- `trackUserSignup(method)`
- `trackUserLogin(method)`
- `trackSessionBooking(guruType, sessionType)`
- `trackSearchQuery(query, category)`

## Files Added/Modified:

### Core Files:
- `pages/_app.tsx` - Added Analytics and SpeedInsights components
- `pages/_document.tsx` - Added GA and GTM scripts in head
- `next.config.js` - Added analytics environment variables

### Custom Components:
- `components/useAnalytics.ts` - Custom hook for event tracking
- `components/AnalyticsPageTracker.tsx` - Automatic page view tracking

### Configuration:
- `turbo.json` - Added analytics env vars to build config
- `.env.local.example` - Added analytics variable examples

## Monitoring Dashboard Access:

1. **Vercel Analytics:** 
   - Visit Vercel Dashboard → Project → Analytics tab
   - Real-time performance and user metrics

2. **Google Analytics:**
   - Visit https://analytics.google.com
   - Real-time and historical user behavior data

3. **Google Tag Manager:**
   - Visit https://tagmanager.google.com
   - Manage and deploy additional tracking tags

## Security & Privacy:

- ✅ GDPR compliant (with proper cookie consent)
- ✅ Analytics scripts load conditionally based on environment variables
- ✅ No PII tracked without explicit consent
- ✅ Cross-subdomain tracking configured for `.yoohoo.guru` domain

## Performance Impact:

- **Vercel Analytics:** ~1KB additional bundle size
- **Speed Insights:** ~2KB additional bundle size
- **Google Analytics:** ~45KB (loaded asynchronously)
- **Total Impact:** Minimal, all scripts load asynchronously

## Next Steps:

1. Add analytics environment variables to Vercel project
2. Set up Google Analytics 4 property
3. Set up Google Tag Manager container
4. Configure cookie consent banner (if required for GDPR)
5. Set up conversion goals and funnels in GA4