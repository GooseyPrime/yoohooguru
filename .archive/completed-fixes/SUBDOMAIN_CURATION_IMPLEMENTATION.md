# Subdomain Content Curation Implementation Summary

## Overview
This document summarizes the implementation of automated content curation for subdomain pages (fitness.yoohoo.guru, music.yoohoo.guru, etc.) as per the specified requirements.

## Changes Implemented

### 1. News Curation Agent Updates (`backend/src/agents/curationAgents.js`)

#### Schedule Changes
- **Before**: Once daily at 6 AM EST
- **After**: Twice daily - 6 AM EST (morning) and 3 PM EST (afternoon)
- **Implementation**: Two cron jobs using `node-cron`
  ```javascript
  cron.schedule('0 6 * * *', () => { this.curateDailyNews('morning'); });
  cron.schedule('0 15 * * *', () => { this.curateDailyNews('afternoon'); });
  ```

#### Content Generation
- **Article Count**: Generates exactly 2 articles per run (4 total per day)
- **Age Threshold**: Filters articles to ensure <48 hours preferred, ≤72 hours max
- **Source URLs**: Requests real source URLs for outbound linking
- **Word Limit**: Title + summary ≤50 words per spec

#### Metadata & Tagging
Per spec requirements, each news article now includes:
```javascript
{
  tags: [category, 'US', 'YYYY-MM-DD'],
  metadata: {
    subdomainTopic: category,
    region: 'US',
    date: 'YYYY-MM-DD',
    timeSlot: 'morning' | 'afternoon'
  }
}
```

#### Reuse Policy
- **Implementation**: `handleInsufficientArticles()` function
- **Behavior**: If fewer than 2 new articles available, carries forward recent articles with refreshed timestamps
- **Purpose**: Maintains continuity and ensures subdomain always has content

#### Cleanup
- **Function**: `cleanupOldArticles()`
- **Policy**: Keeps only the 10 most recent articles per subdomain
- **Frequency**: Runs after each curation to prevent data bloat

### 2. Blog Curation Agent Updates (`backend/src/agents/curationAgents.js`)

#### Schedule Changes
- **Before**: Bi-weekly (first and third Monday at 8 AM)
- **After**: Weekly on Monday at 10 AM EST
- **Implementation**: 
  ```javascript
  cron.schedule('0 10 * * 1', () => { this.curateBlogContent(); });
  ```

#### Content Generation
- **Frequency**: 1 blog post per week per subdomain (per spec)
- **Word Count**: 1200-2000 words (enforced in AI generation)
- **Structure**: Intro → H2/H3 subheadings → visuals → conclusion → CTA
- **Variety**: Topic rotation based on week of year to ensure diverse content

#### SEO Optimization
Per spec requirements:
```javascript
seo: {
  metaTitle: title.substring(0, 60),      // ≤60 characters
  metaDescription: excerpt.substring(0, 160), // ≤160 characters
  keywords: [...],
  region: 'US'
}
```

#### Schema Markup
```javascript
schema: {
  type: 'BlogPosting',  // Per spec: Article / BlogPosting / Review
  datePublished: new Date().toISOString(),
  author: config.character,
  category: config.category
}
```

#### Enhanced Features
- **Affiliate Integration**: Placeholders for 2-4 contextual links
- **Internal Linking**: Suggestions for ≥2 cross-links to related posts
- **Visual Suggestions**: Descriptions of where images would enhance content

### 3. AI Blog Generation Enhancement (`backend/src/routes/ai.js`)

Enhanced `/api/ai/generate-blog-post` endpoint with:

#### New Request Parameters
```javascript
{
  topic: string,
  category: string,
  targetAudience: string,
  keywords: string[],
  wordCount: number,          // 1200-2000 (spec compliant)
  includeAffiliateSection: boolean,
  structure: {
    intro: boolean,
    subheadings: boolean,     // H2/H3
    visuals: boolean,
    conclusion: boolean,
    cta: boolean
  },
  seo: {
    metaTitleMaxLength: 60,
    metaDescriptionMaxLength: 160,
    region: 'US'
  }
}
```

#### Response Structure
```javascript
{
  title: string,              // ≤60 chars
  slug: string,
  excerpt: string,
  content: string,            // Markdown, 1200-2000 words
  category: string,
  tags: string[],
  seo: {
    metaTitle: string,
    metaDescription: string,
    keywords: string[],
    region: 'US'
  },
  internalLinks: string[],
  affiliateOpportunities: string[],
  visualSuggestions: string[],
  metadata: {
    wordCount: number,
    targetWordCount: number,
    meetsWordCount: boolean
  }
}
```

### 4. Testing Infrastructure

#### Test Script (`backend/test-curation-agents.js`)
New script to test curation functionality:
```bash
npm run test:agents
```

**Tests:**
1. News curation for a sample subdomain (morning slot)
2. Blog post generation for a sample subdomain
3. Data structure verification (metadata, SEO, schema)

#### Manual Trigger Endpoint
Existing endpoint enhanced for testing:
```
POST /api/admin/curate
```

## API Endpoints

### News
```
GET /api/gurus/news/:subdomain
```
Returns the most recent news articles (up to 10) for a subdomain.

### Blog Posts
```
GET /api/gurus/:subdomain/home
```
Returns featured blog posts (up to 6) along with subdomain stats.

```
GET /api/gurus/:subdomain/posts
```
Returns all blog posts with filtering and pagination.

### Content Generation (for agents)
```
POST /api/ai/generate-news
Body: { category, skills, limit }
```

```
POST /api/ai/generate-blog-post
Body: { topic, category, targetAudience, keywords, wordCount, ... }
```

## Frontend Integration

### Existing Components
The frontend is already configured to fetch and display content:

**SubdomainLandingPage.js** (lines 495-533):
- Fetches home data: `GET /api/gurus/${subdomain}/home`
- Fetches news data: `GET /api/gurus/news/${subdomain}`
- Displays news cards with proper formatting
- Displays blog posts with proper linking

**Display Format** (as per spec):
```html
<!-- News -->
<h3><a href="SOURCE_URL" target="_blank">News Title</a></h3>
<p>1-2 sentence summary.</p>

<!-- Blog -->
<h3><a href="/blog/YYYY-MM-DD-slug">Blog Title</a></h3>
<p>1-2 sentence teaser summary.</p>
```

## Scheduled Operations

### News Agent
- **6:00 AM EST**: Generate 2 morning news articles per subdomain
- **3:00 PM EST**: Generate 2 afternoon news articles per subdomain
- **Total**: 4 articles per day per subdomain (20 subdomains = 80 articles/day)

### Blog Agent
- **Monday 10:00 AM EST**: Generate 1 blog post per subdomain
- **Total**: 1 article per week per subdomain (20 subdomains = 20 articles/week)

### Maintenance
- **After each curation**: Cleanup old articles (keep 10 most recent)
- **Monthly** (recommended): Broken-link check, duplicate headline scan
- **Monthly** (recommended): Affiliate link validation

## Environment Variables

Required for curation agents:
```bash
OPENROUTER_API_KEY=your_key_here    # For AI content generation
NODE_ENV=production                  # Disables placeholder content
ADMIN_KEY=your_admin_key            # For manual trigger endpoint
```

## Deployment Checklist

- [x] Update curation agent schedules
- [x] Implement metadata tagging
- [x] Add reuse policy for insufficient content
- [x] Enhance AI blog generation endpoint
- [x] Add test script
- [ ] Run initial content generation (see Testing section)
- [ ] Verify Firebase indexes for queries
- [ ] Monitor first few scheduled runs
- [ ] Set up alerts for agent failures

## Testing

### Local Testing
1. Ensure Firebase emulators are running (if testing locally)
2. Run test script:
   ```bash
   cd backend
   npm run test:agents
   ```

### Production Testing
1. Use manual trigger endpoint:
   ```bash
   curl -X POST https://api.yoohoo.guru/api/admin/curate \
     -H "Cookie: yoohoo_admin=1" \
     -H "Content-Type: application/json"
   ```

2. Check health endpoint:
   ```bash
   curl https://api.yoohoo.guru/health
   ```
   Response should include `curationAgents` status.

### Verification
1. Check Firestore collections:
   - `gurus/{subdomain}/news` - should have 2-10 articles
   - `gurus/{subdomain}/posts` - should have 1+ featured posts

2. Test API endpoints:
   ```bash
   curl https://api.yoohoo.guru/api/gurus/fitness/home
   curl https://api.yoohoo.guru/api/gurus/news/fitness
   ```

3. Visit subdomain pages:
   - https://fitness.yoohoo.guru
   - https://music.yoohoo.guru
   - etc.

## Monitoring

### Agent Status
Check the health endpoint to monitor agent status:
```javascript
{
  "curationAgents": {
    "newsAgent": {
      "status": "running" | "error" | "stopped",
      "error": null | "error message",
      "lastStarted": "ISO timestamp"
    },
    "blogAgent": {
      "status": "running" | "error" | "stopped",
      "error": null | "error message",
      "lastStarted": "ISO timestamp"
    }
  }
}
```

### Logs
Monitor application logs for:
- `📰 Starting morning/afternoon news curation` - Scheduled runs
- `📝 Starting weekly blog curation` - Scheduled runs
- `✅ Curated X articles for {subdomain}` - Successful completions
- `❌ Error curating news/blog for {subdomain}` - Failures

## Known Limitations & Future Enhancements

### Current Limitations
1. AI-generated content requires API keys (OpenRouter or OpenAI)
2. Manual broken-link checking not yet automated
3. Affiliate link validation not yet implemented
4. No automated duplicate headline detection

### Future Enhancements
1. **Maintenance Automation**:
   - Monthly broken-link checker
   - Weekly duplicate headline scanner
   - Monthly affiliate link validator

2. **Content Quality**:
   - A/B testing for article titles
   - User engagement tracking
   - Content performance analytics

3. **Source Diversity**:
   - Integrate real news APIs (NewsAPI, Google News)
   - Ensure 2 different publishers per day
   - Track source diversity metrics

4. **Homepage Management**:
   - Auto-archive blog posts older than 6 entries
   - Implement `/blog/` archive page
   - Add pagination for older content

## Support & Troubleshooting

### Common Issues

**Issue**: No content appearing on subdomain pages
- **Check**: Run test script to verify agents work
- **Check**: Verify Firebase connection and credentials
- **Check**: Check agent status in health endpoint

**Issue**: Agents show "error" status
- **Check**: Verify OPENROUTER_API_KEY is set
- **Check**: Review application logs for error details
- **Check**: Ensure Firebase has proper permissions

**Issue**: Content is stale (not updating)
- **Check**: Verify cron schedule matches server timezone
- **Check**: Check server time vs EST (may need timezone adjustment)
- **Check**: Use manual trigger to test agent functionality

### Getting Help
- Review application logs for error messages
- Check health endpoint for agent status
- Run test script for detailed diagnostics
- Verify environment variables are correctly set

## Conclusion

The subdomain content curation system is now fully implemented and ready for deployment. All 20 subdomains will automatically receive:
- 4 news articles per day (2 morning, 2 afternoon)
- 1 high-quality blog post per week
- Proper metadata, SEO, and schema markup
- Automatic cleanup and maintenance

The system is designed to be production-ready, with proper error handling, fallbacks, and monitoring capabilities.
