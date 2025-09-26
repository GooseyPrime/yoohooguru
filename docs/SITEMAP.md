# Sitemap Documentation

## Overview

The yoohoo.guru platform includes a comprehensive XML sitemap that covers all public routes across the main domain and guru subdomains. The sitemap follows XML Sitemaps Protocol 0.9 standards and is optimized for search engine discovery.

## Sitemap Location

- **Production URL**: `https://yoohoo.guru/sitemap.xml`
- **Local File**: `frontend/public/sitemap.xml`
- **Robots.txt Reference**: Listed in `/robots.txt`

## Structure

### Main Domain Routes (18 URLs)
The main `yoohoo.guru` domain includes:

**Core Platform Pages:**
- `/` (Homepage - Priority 1.0, Daily updates)
- `/skills` (SkillShare - Priority 0.9, Weekly updates)
- `/angels-list` (Service Marketplace - Priority 0.9, Weekly updates)
- `/about` (About page - Priority 0.8, Monthly updates)
- `/how-it-works` (How it works - Priority 0.8, Monthly updates)
- `/pricing` (Pricing - Priority 0.8, Monthly updates)

**Community Pages:**
- `/blog` (Blog - Priority 0.7, Weekly updates)
- `/success-stories` (Success Stories - Priority 0.7, Weekly updates)
- `/events` (Events - Priority 0.6, Weekly updates)
- `/forum` (Forum - Priority 0.6, Daily updates)
- `/mentorship` (Mentorship - Priority 0.6, Weekly updates)

**Support Pages:**
- `/help` (Help Center - Priority 0.5, Monthly updates)
- `/contact` (Contact - Priority 0.5, Monthly updates)
- `/safety` (Safety - Priority 0.5, Monthly updates)

**Legal Pages:**
- `/privacy` (Privacy Policy - Priority 0.3, Yearly updates)
- `/terms` (Terms of Service - Priority 0.3, Yearly updates)

**Authentication Pages:**
- `/login` (Login - Priority 0.4, Yearly updates)
- `/signup` (Signup - Priority 0.4, Yearly updates)

### Guru Subdomain Routes (70 URLs)
Each of the 14 guru subdomains includes 5 pages:

**Guru Subdomains:**
- `cooking.yoohoo.guru`
- `music.yoohoo.guru`
- `fitness.yoohoo.guru`
- `tech.yoohoo.guru`
- `art.yoohoo.guru`
- `language.yoohoo.guru`
- `business.yoohoo.guru`
- `design.yoohoo.guru`
- `writing.yoohoo.guru`
- `garden.yoohoo.guru`
- `crafts.yoohoo.guru`
- `wellness.yoohoo.guru`
- `finance.yoohoo.guru`
- `home.yoohoo.guru`

**Routes per Subdomain:**
- `/` (Landing page - Priority 0.8, Weekly updates)
- `/about` (About - Priority 0.6, Monthly updates)
- `/blog` (Blog - Priority 0.6, Weekly updates)
- `/services` (Services - Priority 0.7, Weekly updates)
- `/contact` (Contact - Priority 0.5, Monthly updates)

## Priority and Update Frequency

### Priority Scale (0.0 - 1.0)
- **1.0**: Homepage (most important)
- **0.9**: Core platform features (skills, angels-list)
- **0.8**: Main information pages (about, how-it-works, pricing) and guru landing pages
- **0.7**: Content pages (blog, success-stories) and guru services
- **0.6**: Community features (events, forum, mentorship) and guru content
- **0.5**: Support pages and guru contact pages
- **0.4**: Authentication pages
- **0.3**: Legal pages (lowest priority)

### Update Frequency
- **Daily**: Homepage, forum (high activity expected)
- **Weekly**: Platform features, community pages, guru content
- **Monthly**: Information pages, support, guru static pages
- **Yearly**: Legal and authentication pages

## Management

### Automated Generation
Use the sitemap generation script to maintain the sitemap:

```bash
# Check current sitemap status
node scripts/generate-sitemap.js

# Force regenerate sitemap
node scripts/generate-sitemap.js --force
```

### When to Update
Run the generation script when:
- Adding new public routes to the main site
- Adding new guru subdomains
- Changing the site structure
- Updating route priorities

### Manual Updates
For quick updates, you can edit `frontend/public/sitemap.xml` directly, but it's recommended to use the script to maintain consistency.

## SEO Integration

### Search Engine Submission
Submit the sitemap to major search engines:
- **Google Search Console**: `https://search.google.com/search-console`
- **Bing Webmaster Tools**: `https://www.bing.com/webmasters`

### Validation
Validate the sitemap using:
- **Online Validator**: `https://www.xml-sitemaps.com/validate-xml-sitemap.html`
- **Google Search Console**: Check for indexing issues

### Robots.txt Integration
The sitemap is referenced in `robots.txt`:
```
Sitemap: https://yoohoo.guru/sitemap.xml
```

### HTML Integration
The sitemap is referenced in the main `index.html` template:
```html
<link rel="sitemap" type="application/xml" href="/sitemap.xml" />
```

## Technical Details

### File Format
- **Format**: XML Sitemaps Protocol 0.9
- **Encoding**: UTF-8
- **Schema**: `http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd`

### Build Integration
The sitemap is automatically included in the production build:
- Webpack copies `frontend/public/sitemap.xml` to `frontend/dist/sitemap.xml`
- No additional build configuration required

### Size Limits
- Current URLs: 88
- XML Sitemap limit: 50,000 URLs (we're well within limits)
- File size limit: 50MB uncompressed (current file is ~15KB)

## Maintenance Schedule

### Regular Checks (Monthly)
- Validate sitemap structure
- Check for broken URLs
- Verify search engine submission status

### Updates Required When
- New public routes are added
- Subdomains are added/removed
- Route structure changes
- Priority adjustments needed

### Monitoring
Monitor sitemap performance through:
- Google Search Console sitemap reports
- Server logs for sitemap.xml requests
- SEO audit tools

## Troubleshooting

### Common Issues
1. **Build not including sitemap**: Check that `frontend/public/sitemap.xml` exists
2. **Robots.txt not found**: Ensure `frontend/public/robots.txt` exists and references sitemap
3. **XML validation errors**: Run the generation script to ensure proper format
4. **Search engines not indexing**: Check Search Console for sitemap errors

### Verification Commands
```bash
# Check if sitemap exists in build
ls -la frontend/dist/sitemap.xml

# Validate XML format (if xmllint available)
xmllint --noout frontend/public/sitemap.xml

# Test sitemap accessibility locally
curl -I http://localhost:3000/sitemap.xml
```

## Future Enhancements

### Potential Improvements
- **Dynamic sitemap generation**: Generate sitemap from API for dynamic content
- **Image sitemaps**: Add image sitemap for better image SEO
- **Video sitemaps**: Add video sitemap if video content is added
- **News sitemaps**: Add news sitemap for blog content if needed
- **Multilingual support**: Add hreflang annotations if internationalization is added

### Integration with CMS
If a content management system is added, the sitemap should be updated to:
- Include dynamic blog post URLs
- Update lastmod dates automatically
- Exclude unpublished content
- Handle URL changes automatically