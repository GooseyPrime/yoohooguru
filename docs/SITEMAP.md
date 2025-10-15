# Sitemap Documentation - Turborepo Monorepo

## Overview

The yoohoo.guru platform is a **Turborepo monorepo** with 25 Next.js applications, each deployed as a separate subdomain. Each app should have its own sitemap, and a master sitemap index should coordinate them all.

## Sitemap Architecture

### Master Sitemap Index
**Location**: `https://www.yoohoo.guru/sitemap.xml`  
**Purpose**: Coordinate all 25 subdomain sitemaps

### Per-App Sitemaps

Each Next.js app in `/apps` should generate its own sitemap:

| App | Sitemap URL | Routes |
|-----|-------------|--------|
| Main | https://www.yoohoo.guru/sitemap.xml | /, /about, /how-it-works, /pricing, /contact, /login, /signup, /terms, /privacy |
| Angel | https://angel.yoohoo.guru/sitemap.xml | /, /services, /about, /contact |
| Coach | https://coach.yoohoo.guru/sitemap.xml | /, /skills, /teachers, /about, /contact |
| Heroes | https://heroes.yoohoo.guru/sitemap.xml | /, /sessions, /about, /contact |
| Dashboard | https://dashboard.yoohoo.guru/sitemap.xml | /, /profile, /skills, /bookings |
| Art | https://art.yoohoo.guru/sitemap.xml | /, /teachers, /skills, /about, /contact |
| Business | https://business.yoohoo.guru/sitemap.xml | /, /teachers, /skills, /about, /contact |
| ...and 18 more | | |

## Sitemap Structure for Subject Guru Apps

Each of the 20 subject guru apps (art, business, coding, cooking, crafts, data, design, finance, fitness, gardening, home, investing, language, marketing, music, photography, sales, tech, wellness, writing) should include:

**Standard Routes (5 pages per app):**
- `/` (Landing page - Priority 0.8, Weekly updates)
- `/teachers` (Teacher listings - Priority 0.7, Weekly updates)
- `/skills` (Skills catalog - Priority 0.7, Weekly updates)
- `/about` (About page - Priority 0.6, Monthly updates)
- `/contact` (Contact - Priority 0.5, Monthly updates)

## Priority and Update Frequency

### Priority Scale (0.0 - 1.0)
- **1.0**: Main homepage (www.yoohoo.guru)
- **0.9**: Core platform features (Angel's List, Coach Guru)
- **0.8**: Subject guru landing pages
- **0.7**: Content and service pages
- **0.6**: About and community pages
- **0.5**: Support and contact pages
- **0.4**: Authentication pages
- **0.3**: Legal pages (lowest priority)

### Update Frequency
- **Daily**: Main homepage, high-traffic pages
- **Weekly**: Platform features, guru landing pages, skill listings
- **Monthly**: Information pages, support pages
- **Yearly**: Legal and authentication pages

## Next.js Sitemap Generation

Each Next.js app in `/apps` should use Next.js's built-in sitemap generation:

### Example: apps/main/app/sitemap.ts

```typescript
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://www.yoohoo.guru',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: 'https://www.yoohoo.guru/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.yoohoo.guru/pricing',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Add all routes...
  ]
}
```

### Example: apps/art/app/sitemap.ts

```typescript
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://art.yoohoo.guru',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://art.yoohoo.guru/teachers',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://art.yoohoo.guru/skills',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: 'https://art.yoohoo.guru/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://art.yoohoo.guru/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}
```

## Master Sitemap Index

The main app (`apps/main`) should also generate a sitemap index that references all other apps:

### apps/main/app/sitemap-index.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://www.yoohoo.guru/sitemap.xml</loc>
    <lastmod>2025-10-15</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://angel.yoohoo.guru/sitemap.xml</loc>
    <lastmod>2025-10-15</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://coach.yoohoo.guru/sitemap.xml</loc>
    <lastmod>2025-10-15</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://heroes.yoohoo.guru/sitemap.xml</loc>
    <lastmod>2025-10-15</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://dashboard.yoohoo.guru/sitemap.xml</loc>
    <lastmod>2025-10-15</lastmod>
  </sitemap>
  <!-- Add all 20 subject guru apps -->
  <sitemap>
    <loc>https://art.yoohoo.guru/sitemap.xml</loc>
    <lastmod>2025-10-15</lastmod>
  </sitemap>
  <!-- ... and 19 more -->
</sitemapindex>
```

## SEO Integration

### Search Engine Submission

Submit sitemaps for each subdomain to major search engines:

1. **Google Search Console**: 
   - Add each subdomain as a separate property
   - Submit sitemap for each: `https://[subdomain].yoohoo.guru/sitemap.xml`
   - Submit master sitemap index: `https://www.yoohoo.guru/sitemap-index.xml`

2. **Bing Webmaster Tools**: 
   - Similar process for each subdomain

### Robots.txt for Each App

Each Next.js app should have a `robots.txt`:

```typescript
// apps/main/app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/', '/admin/'],
    },
    sitemap: 'https://www.yoohoo.guru/sitemap.xml',
  }
}
```

## Implementation Checklist

### Per-App Setup (25 apps)
- [ ] Create `app/sitemap.ts` in each app
- [ ] Add all routes for that subdomain
- [ ] Set appropriate priorities and update frequencies
- [ ] Create `app/robots.ts` in each app
- [ ] Test sitemap generation: `https://[subdomain].yoohoo.guru/sitemap.xml`

### Main App Additional Setup
- [ ] Create `app/sitemap-index.xml` with all 25 sitemaps
- [ ] Update master robots.txt to reference sitemap index
- [ ] Submit to Google Search Console
- [ ] Submit to Bing Webmaster Tools

### Validation
- [ ] Validate each sitemap: `https://www.xml-sitemaps.com/validate-xml-sitemap.html`
- [ ] Test all sitemap URLs are accessible
- [ ] Verify correct domain and protocol (https) for all URLs
- [ ] Check Google Search Console for indexing issues

## Technical Details

### File Format
- **Format**: XML Sitemaps Protocol 0.9
- **Encoding**: UTF-8
- **Generated by**: Next.js built-in sitemap generation

### Size Limits
- **Current Total URLs**: ~125-150 (5 routes × 25 apps + main app routes)
- **XML Sitemap limit**: 50,000 URLs per sitemap (well within limits)
- **File size limit**: 50MB uncompressed (current ~20KB total)

### Build Integration
- Sitemaps are automatically generated during Next.js build
- No additional build configuration required
- Each app's sitemap is independent

## Maintenance Schedule

### Regular Updates
- **When to regenerate**: Automatically on each deployment
- **Manual updates**: Only needed when routes change
- **Monitoring**: Check Google Search Console monthly

### Updates Required When
- New routes added to any app
- Apps added or removed from monorepo
- Route structure changes in any app
- Priority adjustments needed

## Troubleshooting

### Common Issues

1. **Sitemap not found (404)**
   - Ensure `app/sitemap.ts` exists in the app
   - Rebuild and redeploy the app
   - Check Vercel deployment logs

2. **Missing routes in sitemap**
   - Add routes to the `sitemap()` function
   - Rebuild and redeploy

3. **Wrong domain in URLs**
   - Update URLs in `sitemap.ts` to match custom domain
   - Ensure environment variables are set correctly

4. **Search engines not indexing**
   - Check Google Search Console for errors
   - Verify robots.txt is not blocking
   - Ensure sitemaps are submitted to search engines

### Verification Commands

```bash
# Check if sitemap exists for each app
curl -I https://www.yoohoo.guru/sitemap.xml
curl -I https://angel.yoohoo.guru/sitemap.xml
curl -I https://art.yoohoo.guru/sitemap.xml
# ...repeat for all 25 apps

# Download and validate
curl https://www.yoohoo.guru/sitemap.xml | xmllint --format -
```