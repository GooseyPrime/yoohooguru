# SEO Implementation Guide - yoohoo.guru

## Overview

This document outlines the SEO implementation strategy for the yoohoo.guru platform, including sitemap management, canonical URL handling, and best practices for search engine indexing.

## Table of Contents

1. [Canonical URL Strategy](#canonical-url-strategy)
2. [Sitemap Architecture](#sitemap-architecture)
3. [SEO Metadata Implementation](#seo-metadata-implementation)
4. [Robots.txt Configuration](#robotstxt-configuration)
5. [Common Indexing Issues and Solutions](#common-indexing-issues-and-solutions)
6. [Search Console Submission](#search-console-submission)
7. [Maintenance and Monitoring](#maintenance-and-monitoring)

## Canonical URL Strategy

### Main Domain

**Canonical Format:** `https://www.yoohoo.guru`

All main domain URLs MUST use the `www` subdomain to avoid duplicate content issues. The SEOMetadata component automatically normalizes URLs to the canonical format.

**Examples:**
- ✅ Correct: `https://www.yoohoo.guru/`
- ✅ Correct: `https://www.yoohoo.guru/skills`
- ❌ Wrong: `https://yoohoo.guru/` (missing www)
- ❌ Wrong: `http://www.yoohoo.guru/` (insecure protocol)

### Guru Subdomains

**Format:** `https://{subdomain}.yoohoo.guru`

Guru subdomains do NOT use `www` prefix.

**Examples:**
- ✅ Correct: `https://design.yoohoo.guru/`
- ✅ Correct: `https://music.yoohoo.guru/about`
- ❌ Wrong: `https://www.design.yoohoo.guru/` (unnecessary www)

### Implementation

The canonical URL is automatically set by the `SEOMetadata` component:

```javascript
// In frontend/src/components/SEOMetadata.js
// Automatically normalizes yoohoo.guru to www.yoohoo.guru
const currentUrl = new URL(window.location.href);
if (currentUrl.hostname === 'yoohoo.guru') {
  currentUrl.hostname = 'www.yoohoo.guru';
}
```

## Sitemap Architecture

### Generation

Sitemaps are generated using `scripts/generate-sitemap.js`:

```bash
# Generate sitemap
node scripts/generate-sitemap.js --force

# Validate sitemap
node scripts/validate-seo-files.js
```

### Structure

**Location:** `frontend/public/sitemap.xml`

**Contents:**
- 20 main domain routes (www.yoohoo.guru)
- 260 guru subdomain routes (20 subdomains × 13 routes each)
- **Total: 280 URLs**

### Route Configuration

Main domain routes are defined in `scripts/generate-sitemap.js`:

```javascript
const MAIN_ROUTES = [
  // Core platform pages
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/skills', priority: '0.9', changefreq: 'weekly' },
  { url: '/angels-list', priority: '0.9', changefreq: 'weekly' },
  // ... more routes
];
```

Guru subdomain routes:

```javascript
const GURU_ROUTES = [
  { url: '/', priority: '0.8', changefreq: 'weekly' },
  { url: '/about', priority: '0.6', changefreq: 'monthly' },
  { url: '/blog', priority: '0.6', changefreq: 'weekly' },
  { url: '/services', priority: '0.7', changefreq: 'weekly' },
  { url: '/contact', priority: '0.5', changefreq: 'monthly' },
  { url: '/skills', priority: '0.7', changefreq: 'weekly' },
  { url: '/angels-list', priority: '0.7', changefreq: 'weekly' },
  { url: '/mentorship', priority: '0.6', changefreq: 'weekly' },
  { url: '/success-stories', priority: '0.6', changefreq: 'weekly' },
  { url: '/pricing', priority: '0.6', changefreq: 'monthly' },
  { url: '/safety', priority: '0.5', changefreq: 'monthly' },
  { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { url: '/modified', priority: '0.4', changefreq: 'weekly' }
];
```

### Priority Guidelines

- **1.0**: Main homepage only
- **0.9**: Core platform features (skills, angels-list)
- **0.8**: Subject guru landing pages, main about page
- **0.7**: Content pages (blog, services, success-stories)
- **0.6**: Community and info pages (about, mentorship)
- **0.5**: Support pages (contact, safety, help)
- **0.4**: Auth pages (login, signup, forgot-password)
- **0.3**: Legal pages (privacy, terms)

### Update Frequency

- **Daily**: Main homepage, high-traffic pages
- **Weekly**: Platform features, guru landing pages, content pages
- **Monthly**: Information pages, support pages
- **Yearly**: Legal and authentication pages

## SEO Metadata Implementation

### Using SEOMetadata Component

Both JavaScript and TypeScript versions are available:

```javascript
// In a React component
import SEOMetadata from '../components/SEOMetadata';

function MyPage() {
  return (
    <>
      <SEOMetadata 
        title="Page Title - yoohoo.guru"
        description="A detailed description of at least 50 characters"
        keywords="relevant, keywords, here"
        ogTitle="Social Media Title"
        ogDescription="Social media description"
        ogImage="https://www.yoohoo.guru/images/og-image.jpg"
        ogUrl="https://www.yoohoo.guru/page-url"
        canonicalUrl="https://www.yoohoo.guru/page-url"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Page Name"
        }}
      />
      {/* Page content */}
    </>
  );
}
```

### Automatic Features

1. **Canonical URL Normalization**: Automatically adds `www` to main domain URLs
2. **Meta Tag Creation**: Dynamically creates missing meta tags
3. **Open Graph Tags**: Full OG support for social sharing
4. **Twitter Cards**: Automatic Twitter card meta tags
5. **Structured Data**: JSON-LD structured data injection

### Best Practices

1. **Always provide unique descriptions**: Never use the same description across multiple pages
2. **Description length**: 50-160 characters recommended
3. **Title format**: Use pattern "Page Name - yoohoo.guru" or "Page Name | Section - yoohoo.guru"
4. **Keywords**: Use relevant, specific keywords (3-10 recommended)
5. **Images**: Always provide OG images (1200×630px recommended)

## Robots.txt Configuration

**Location:** `frontend/public/robots.txt`

```
User-agent: *
Allow: /

# Sitemap
Sitemap: https://www.yoohoo.guru/sitemap.xml

# Block admin and private routes
Disallow: /admin/
Disallow: /dashboard/
Disallow: /profile/
Disallow: /account/
Disallow: /onboarding/

# Block API endpoints
Disallow: /api/

# Allow public pages
Allow: /skills
Allow: /angels-list
Allow: /about
# ... more public routes
```

### Key Points

- Main sitemap URL uses canonical `www.yoohoo.guru`
- Private routes are explicitly blocked
- Public routes are explicitly allowed to ensure crawling
- API endpoints are blocked to prevent unnecessary crawling

## Common Indexing Issues and Solutions

### Issue 1: Duplicate without User-Selected Canonical

**Symptom:** Pages show as "Duplicate without user-selected canonical" in Google Search Console

**Causes:**
- Missing or incorrect canonical tags
- Using `yoohoo.guru` instead of `www.yoohoo.guru`
- Conflicting canonical URLs across pages

**Solution:**
1. Ensure SEOMetadata component is used on all pages
2. Explicitly set `canonicalUrl` prop when needed
3. Verify sitemap uses correct canonical URLs
4. Check that automatic normalization is working

### Issue 2: Not Found (404)

**Symptom:** Pages return 404 errors

**Causes:**
- Route not defined in router
- Subdomain not configured properly
- Missing DNS records

**Solution:**
1. Verify route exists in `AppRouter.js`
2. Check subdomain configuration
3. Ensure sitemap only includes accessible routes
4. Remove 404 URLs from sitemap

### Issue 3: Crawled - Currently Not Indexed

**Symptom:** Pages are crawled but not indexed by Google

**Causes:**
- Low-quality content
- Thin content (too little text)
- Duplicate content
- Missing or poor meta descriptions
- Slow page load times

**Solution:**
1. Add unique, valuable content (minimum 300 words recommended)
2. Improve meta descriptions (make them unique and compelling)
3. Add structured data for better understanding
4. Optimize page load performance
5. Ensure mobile-friendliness

### Issue 4: Discovered - Currently Not Indexed

**Symptom:** Pages discovered but not crawled or indexed

**Causes:**
- Low priority in sitemap
- New pages not yet crawled
- Crawl budget limitations
- Internal linking issues

**Solution:**
1. Submit sitemap to Search Console
2. Request indexing for important pages
3. Improve internal linking structure
4. Increase priority in sitemap for important pages
5. Be patient - new pages take time to index

### Issue 5: Soft 404

**Symptom:** Pages treated as 404 even though they return 200 status

**Causes:**
- Empty or near-empty content
- Error messages displayed on page
- Generic "coming soon" content
- JavaScript errors preventing content rendering

**Solution:**
1. Add substantial, unique content
2. Remove error messages from production pages
3. Ensure content renders properly
4. Check for JavaScript console errors
5. Verify proper HTTP status codes

### Issue 6: Page with Redirect

**Symptom:** HTTP pages redirect to HTTPS (expected behavior)

**Causes:**
- HTTP to HTTPS redirect (this is correct!)
- Sitemap contains HTTP URLs instead of HTTPS

**Solution:**
1. Ensure all sitemap URLs use HTTPS
2. This is normal and expected - just ensure sitemap is correct
3. Update any HTTP links in content to HTTPS

## Search Console Submission

### Google Search Console

1. **Add Property** for each domain:
   - `www.yoohoo.guru` (main site)
   - Each guru subdomain (`design.yoohoo.guru`, `music.yoohoo.guru`, etc.)

2. **Verify Ownership:**
   - Upload verification file to `public/` directory
   - Or use DNS TXT record verification
   - Or use meta tag in HTML head

3. **Submit Sitemap:**
   ```
   https://www.yoohoo.guru/sitemap.xml
   ```

4. **Request Indexing:**
   - For critical pages, use "Request Indexing" feature
   - Limit: ~10 requests per day per property

### Bing Webmaster Tools

Similar process to Google Search Console:
1. Add and verify site
2. Submit sitemap
3. Monitor indexing status

### Ongoing Monitoring

- Check Search Console weekly for:
  - Indexing errors
  - Coverage issues
  - Manual actions
  - Security issues
- Review Core Web Vitals monthly
- Monitor crawl stats and sitemap processing

## Maintenance and Monitoring

### Monthly Tasks

1. **Regenerate sitemap** if routes changed:
   ```bash
   node scripts/generate-sitemap.js --force
   ```

2. **Validate SEO files:**
   ```bash
   node scripts/validate-seo-files.js
   ```

3. **Check Search Console** for:
   - New indexing issues
   - Coverage problems
   - Performance issues

### When Adding New Routes

1. Add route to `MAIN_ROUTES` or `GURU_ROUTES` in `generate-sitemap.js`
2. Regenerate sitemap: `node scripts/generate-sitemap.js --force`
3. Validate: `node scripts/validate-seo-files.js`
4. Commit updated sitemap
5. Submit updated sitemap to Search Console
6. Request indexing for new important pages

### When Adding New Subdomains

1. Add subdomain to `GURU_SUBDOMAINS` array in `generate-sitemap.js`
2. Regenerate sitemap
3. Validate sitemap
4. Configure DNS and hosting
5. Add subdomain as new property in Search Console
6. Submit sitemap for new subdomain

### Regular Audits

**Quarterly:**
- Full SEO audit using tools (Screaming Frog, SEMrush, etc.)
- Review and update meta descriptions
- Check for broken links
- Verify canonical URLs across all pages
- Review and optimize page load times

**Annually:**
- Comprehensive content review and optimization
- Update legal pages (privacy, terms)
- Review and update structured data
- Audit and improve internal linking structure

## Troubleshooting

### Sitemap Not Updating

```bash
# Force regeneration
node scripts/generate-sitemap.js --force

# Verify changes
git diff frontend/public/sitemap.xml

# Check file permissions
ls -la frontend/public/sitemap.xml
```

### Canonical URLs Not Working

1. Check browser console for JavaScript errors
2. Verify SEOMetadata component is imported and used
3. Inspect page source to verify canonical link tag
4. Test URL normalization logic:
   ```javascript
   const url = new URL('https://yoohoo.guru/test');
   if (url.hostname === 'yoohoo.guru') {
     url.hostname = 'www.yoohoo.guru';
   }
   console.log(url.href); // Should output: https://www.yoohoo.guru/test
   ```

### Routes Missing from Sitemap

1. Check route definition in `generate-sitemap.js`
2. Verify route exists in `AppRouter.js`
3. Regenerate sitemap with `--force` flag
4. Validate with `validate-seo-files.js`

## Tools and Resources

### Internal Scripts

- `scripts/generate-sitemap.js` - Generate sitemap
- `scripts/validate-seo-files.js` - Validate SEO files

### External Tools

- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)
- [Screaming Frog SEO Spider](https://www.screamingfrog.co.uk/seo-spider/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev/)

### Documentation

- [Google Search Central](https://developers.google.com/search)
- [Sitemap Protocol](https://www.sitemaps.org/protocol.html)
- [Robots.txt Specification](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [Canonical URLs Guide](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)

## Support

For questions or issues related to SEO implementation, consult:
1. This documentation
2. Google Search Console Help
3. Repository maintainers
4. SEO team (if available)

---

**Last Updated:** 2025-10-15  
**Document Version:** 1.0  
**Maintained by:** Development Team
