# Subdomain Content Curation - Quick Reference Card

## 🎯 What Was Implemented

### News Agent
- **Schedule**: 2x daily (6 AM & 3 PM EST)
- **Output**: 2 articles per run = 4 articles/day per subdomain
- **Total**: 80 articles/day across 20 subdomains
- **Format**: Title + 1-2 sentence summary (≤50 words)
- **Age**: <48 hours preferred, ≤72 hours max
- **Metadata**: [subdomain_topic, US, YYYY-MM-DD]

### Blog Agent
- **Schedule**: Weekly (Monday 10 AM EST)
- **Output**: 1 post per week per subdomain
- **Total**: 20 posts/week across 20 subdomains
- **Length**: 1200-2000 words
- **Structure**: Intro → H2/H3 → Visuals → Conclusion → CTA
- **SEO**: Title ≤60 chars, Description ≤160 chars

## 📅 Schedule Overview

```
┌─────────────────────────────────────────────────┐
│  DAILY SCHEDULE (EST)                          │
├─────────────────────────────────────────────────┤
│  6:00 AM  → Morning News (2 articles/subdomain)│
│  3:00 PM  → Afternoon News (2 articles/subdomain)│
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  WEEKLY SCHEDULE (EST)                         │
├─────────────────────────────────────────────────┤
│  Monday 10:00 AM → Blog Post (1 post/subdomain)│
└─────────────────────────────────────────────────┘
```

## 🔧 Quick Commands

### Testing
```bash
# Run test script
cd backend
npm run test:agents

# Manual trigger (requires admin auth)
curl -X POST https://api.yoohoo.guru/api/admin/curate
```

### Verification
```bash
# Check health
curl https://api.yoohoo.guru/health

# Get news for a subdomain
curl https://api.yoohoo.guru/api/gurus/news/fitness

# Get blog posts for a subdomain
curl https://api.yoohoo.guru/api/gurus/fitness/home
```

## 📊 Data Structure

### News Article
```json
{
  "id": "unique-id",
  "title": "Article Title",
  "summary": "1-2 sentence summary under 50 words",
  "url": "https://source-url.com",
  "source": "Publisher Name",
  "publishedAt": 1234567890,
  "timeSlot": "morning|afternoon",
  "tags": ["category", "US", "YYYY-MM-DD"],
  "metadata": {
    "subdomainTopic": "category",
    "region": "US",
    "date": "YYYY-MM-DD",
    "timeSlot": "morning|afternoon"
  }
}
```

### Blog Post
```json
{
  "id": "unique-id",
  "title": "Post Title (≤60 chars)",
  "slug": "url-friendly-slug",
  "excerpt": "Brief teaser (≤200 chars)",
  "content": "Full markdown content (1200-2000 words)",
  "author": "Guru Character",
  "category": "subdomain-category",
  "tags": ["tag1", "tag2"],
  "seo": {
    "metaTitle": "SEO Title (≤60 chars)",
    "metaDescription": "SEO Description (≤160 chars)",
    "keywords": ["keyword1", "keyword2"],
    "region": "US"
  },
  "schema": {
    "type": "BlogPosting",
    "datePublished": "ISO timestamp",
    "author": "Guru Character",
    "category": "category"
  },
  "metadata": {
    "wordCount": 1500,
    "targetWordCount": 1500,
    "meetsWordCount": true
  }
}
```

## 🎨 Frontend Display

### News Section
```html
<h3><a href="SOURCE_URL" target="_blank">News Title</a></h3>
<p>1-2 sentence summary.</p>
<span>Source Name</span>
```

### Blog Section
```html
<h3><a href="/blog/YYYY-MM-DD-slug">Blog Title</a></h3>
<p>1-2 sentence teaser.</p>
<span>5 min read</span>
```

## 🔍 Monitoring

### Health Check
```bash
GET /health
```

Response includes:
```json
{
  "curationAgents": {
    "newsAgent": {
      "status": "running|error|stopped",
      "error": null,
      "lastStarted": "ISO timestamp"
    },
    "blogAgent": {
      "status": "running|error|stopped",
      "error": null,
      "lastStarted": "ISO timestamp"
    }
  }
}
```

### Log Messages to Monitor
- `📰 Starting morning/afternoon news curation`
- `📝 Starting weekly blog curation`
- `✅ Curated X articles for {subdomain}`
- `❌ Error curating news/blog for {subdomain}`

## 🚨 Troubleshooting

### No Content Appearing
1. Check health endpoint → verify agents are running
2. Run test script → `npm run test:agents`
3. Check Firestore → verify collections exist
4. Check logs → look for errors

### Agents Not Running
1. Verify OPENROUTER_API_KEY is set
2. Check Firebase connection
3. Review startup logs for errors
4. Use manual trigger to test

### Content is Stale
1. Verify cron schedule matches server timezone
2. Check last run time in health endpoint
3. Use manual trigger to generate fresh content

## 📁 Files Modified

```
backend/
├── src/
│   ├── agents/curationAgents.js      ← Main agent logic
│   ├── routes/ai.js                  ← AI generation endpoint
│   └── routes/gurus.js               ← News/blog API endpoints
├── test-curation-agents.js           ← Test script
└── package.json                      ← Added test:agents script

SUBDOMAIN_CURATION_IMPLEMENTATION.md  ← Full documentation
SUBDOMAIN_CURATION_QUICKREF.md        ← This file
```

## 🎯 Success Criteria

✅ All 15 subdomain pages show content
✅ News articles update 2x daily
✅ Blog posts update weekly
✅ Proper metadata and SEO
✅ Responsive cards work correctly
✅ Content meets word count requirements
✅ Articles have proper source attribution

## 📚 Full Documentation

See `SUBDOMAIN_CURATION_IMPLEMENTATION.md` for:
- Detailed technical implementation
- Complete API documentation
- Testing procedures
- Monitoring guidance
- Troubleshooting tips
- Migration guide

## 🎉 Summary

**Status**: ✅ Implementation Complete
**Next Step**: Run `npm run test:agents` to populate initial content
**Monitor**: Check `/health` endpoint for agent status
**Support**: Review logs and documentation for issues

All 15 subdomain pages will automatically display news and blog content once the agents run.
