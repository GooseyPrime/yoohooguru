# AI Content Generation - Deployment Guide

## Overview

The YooHoo.Guru platform uses **AI curation agents** to generate all content dynamically. Mock data is **strictly prohibited** and should never be committed to the repository.

## Content Generation System

### AI Curation Agents

Located in: `backend/src/agents/curationAgents.js`

Two main agents handle content generation:

1. **NewsCurationAgent**
   - Runs: Twice daily at 6 AM and 3 PM EST
   - Generates: 2 news articles per subdomain per run
   - Retention: Maximum 10 most recent articles per subdomain
   - Article age: Must be <72 hours old
   - Auto-cleanup: Yes

2. **BlogCurationAgent**
   - Runs: Weekly on Mondays at 10 AM EST
   - Generates: 1 blog post per subdomain per week
   - Word count: 1200-2000 words
   - SEO: Optimized (≤60 char title, ≤160 char description)
   - Features: Affiliate links, internal linking, proper structure

### AI Providers

**Primary:** OpenRouter
- Claude 3.5 Sonnet
- Perplexity (for news with web search)

**Fallback:** OpenAI
- GPT-4o-mini

## Initial Deployment Setup

### Prerequisites

1. Set required environment variables:
```bash
export OPENROUTER_API_KEY=your_openrouter_key_here
export OPENAI_API_KEY=your_openai_key_here  # Optional fallback
export NODE_ENV=production
```

2. Ensure Firestore is configured and accessible

### Run Initialization

Generate initial content for all 20 subdomains:

```bash
# Generate all content (recommended for first deployment)
node scripts/initialize-ai-content.js
```

This will:
- Generate 2 news articles for each of 20 subdomains (40 total)
- Generate 1 blog post for each of 20 subdomains (20 total)
- Store all content in Firestore
- Take approximately 10-20 minutes depending on AI API response times

### Advanced Options

```bash
# Generate only news articles
node scripts/initialize-ai-content.js --type=news

# Generate only blog posts
node scripts/initialize-ai-content.js --type=blog

# Generate content for specific subdomain
node scripts/initialize-ai-content.js --subdomain=cooking

# Combine options
node scripts/initialize-ai-content.js --subdomain=tech --type=news
```

## Content Storage

All content is stored in Firestore:

- **News Articles:** `gurus/{subdomain}/news`
- **Blog Posts:** `gurus/{subdomain}/posts`

### Firestore Document Structure

**News Article:**
```javascript
{
  id: "unique-id",
  title: "Article Title (<60 chars)",
  summary: "Brief summary (≤50 words)",
  url: "https://source.com/article",
  source: "Publisher Name",
  publishedAt: timestamp,
  curatedAt: timestamp,
  subdomain: "cooking",
  timeSlot: "morning" | "afternoon" | "initial",
  aiGenerated: true,
  tags: ["culinary", "US", "2025-10-15"],
  metadata: {
    subdomainTopic: "culinary",
    region: "US",
    date: "2025-10-15",
    timeSlot: "morning"
  }
}
```

**Blog Post:**
```javascript
{
  id: "unique-id",
  title: "Blog Post Title",
  slug: "url-friendly-slug",
  excerpt: "Brief excerpt (≤160 chars)",
  content: "Full markdown content (1200-2000 words)",
  author: "Guru Name",
  category: "Category",
  tags: ["tag1", "tag2"],
  publishedAt: timestamp,
  curatedAt: timestamp,
  subdomain: "cooking",
  status: "published",
  featured: true,
  estimatedReadTime: "8 min",
  viewCount: 0,
  seo: {
    metaTitle: "Title ≤60 chars",
    metaDescription: "Description ≤160 chars",
    keywords: ["keyword1", "keyword2"],
    region: "US"
  },
  schema: {
    type: "BlogPosting",
    datePublished: "ISO timestamp",
    author: "Guru Name",
    category: "Category"
  },
  metadata: {
    subdomainTopic: "culinary",
    region: "US",
    date: "2025-10-15",
    wordCount: 1543
  }
}
```

## API Endpoints

Content is served via existing API endpoints in `backend/src/routes/gurus.js`:

- `GET /api/gurus/:subdomain/home` - Homepage with featured posts and stats
- `GET /api/gurus/news/:subdomain` - Latest news articles (up to 10)
- `GET /api/gurus/:subdomain/posts` - All blog posts with pagination
- `GET /api/gurus/:subdomain/posts/:slug` - Individual blog post

## Automated Operation

Once initialized, the AI curation agents run automatically on schedule:

### News Articles
- **Morning Run:** 6:00 AM EST
- **Afternoon Run:** 3:00 PM EST
- **Output:** 2 new articles per subdomain per run
- **Total:** 40 articles per run (20 subdomains × 2 articles)
- **Daily Total:** 80 new articles across platform

### Blog Posts
- **Run Time:** Monday 10:00 AM EST
- **Output:** 1 new post per subdomain
- **Total:** 20 new posts per week

## Monitoring

Check agent status via:

```javascript
const { getCurationAgentStatus } = require('./backend/src/agents/curationAgents');
const status = getCurationAgentStatus();
console.log(status);
```

Output:
```javascript
{
  newsAgent: {
    status: 'running',
    error: null,
    lastStarted: '2025-10-15T10:00:00.000Z'
  },
  blogAgent: {
    status: 'running',
    error: null,
    lastStarted: '2025-10-15T10:00:00.000Z'
  },
  environment: 'production',
  timestamp: '2025-10-15T10:00:00.000Z'
}
```

## Manual Triggering

For testing or admin purposes, manually trigger curation:

```javascript
const { triggerManualCuration } = require('./backend/src/agents/curationAgents');
await triggerManualCuration();
```

Or via API (requires admin auth):
```bash
curl -X POST https://api.yoohoo.guru/api/admin/trigger-curation \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

## Troubleshooting

### No Content Generated

1. Check API keys are set:
```bash
echo $OPENROUTER_API_KEY
echo $OPENAI_API_KEY
```

2. Check Firestore connection:
```javascript
const { getFirestore } = require('./backend/src/config/firebase');
const db = getFirestore();
console.log(db ? 'Connected' : 'Not connected');
```

3. Check agent status:
```javascript
const status = getCurationAgentStatus();
console.log(status);
```

### Content Not Appearing on Frontend

1. Verify Firestore documents exist:
```bash
# Check in Firebase Console
# Collection: gurus/{subdomain}/news
# Collection: gurus/{subdomain}/posts
```

2. Test API endpoint directly:
```bash
curl https://api.yoohoo.guru/api/gurus/cooking/home
curl https://api.yoohoo.guru/api/gurus/news/cooking
```

3. Check frontend is fetching from correct API URL

### Rate Limiting

If hitting API rate limits:
- Add delays between subdomain processing (built into initialization script)
- Use `--subdomain` flag to process one at a time
- Ensure API keys have sufficient quota

## Best Practices

1. **Never commit mock data** - Use AI generation exclusively
2. **Run initialization on deployment** - Fresh content for launch
3. **Monitor agent status** - Ensure scheduled jobs are running
4. **Check Firestore storage** - Verify auto-cleanup is working
5. **Review generated content** - Spot-check for quality
6. **Set up alerts** - Monitor for agent failures
7. **Keep API keys secure** - Use environment variables only

## Scheduled Maintenance

### Weekly Tasks
- Review generated blog posts for quality
- Check Firestore storage usage
- Verify agent cron jobs are running

### Monthly Tasks
- Review AI provider costs and usage
- Update content generation prompts if needed
- Archive old content if necessary
- Review and update subdomain configurations

## Emergency Procedures

### If Agents Stop Working

1. Check logs for errors
2. Verify API keys are valid
3. Restart the backend server
4. Manually trigger curation
5. Check Firestore permissions

### If Content Quality Declines

1. Review AI prompts in `curationAgents.js`
2. Test different AI models
3. Adjust content generation parameters
4. Implement additional filtering

### If Storage Fills Up

1. Verify auto-cleanup is running
2. Manually remove old content if needed
3. Adjust retention policies
4. Archive content to cold storage

---

## Summary

✅ All content generated by AI  
✅ No mock data in repository  
✅ Automated scheduled generation  
✅ Firestore storage with auto-cleanup  
✅ Multiple AI providers with fallback  
✅ Easy initialization for deployment  

For questions or issues, see:
- `backend/src/agents/curationAgents.js` - Agent implementation
- `scripts/initialize-ai-content.js` - Initialization script
- `.github/copilot-instructions.md` - Development policies
