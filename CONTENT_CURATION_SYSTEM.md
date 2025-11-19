# YooHoo.guru Content Curation System

## Overview

The YooHoo.guru platform features a comprehensive AI-powered content curation system that automatically generates and manages content across 28 subdomain sites. This document outlines the complete system architecture and implementation.

## System Components

### 1. Frontend Components

#### NewsSection Component
**Location**: `apps/main/components/NewsSection.tsx`

Displays curated news articles on subdomain homepages with:
- Article title, summary, and source
- Links to original news articles (external sources)
- Timestamp showing article freshness
- Responsive grid layout
- Loading and error states

**Usage**:
```tsx
<NewsSection subdomain="cooking" limit={5} />
```

#### BlogList Component
**Location**: `apps/main/components/BlogList.tsx`

Displays blog post previews on subdomain homepages with:
- Post title, excerpt, and author
- Read time and publish date
- Tags and categories
- Links to full blog posts (internal)
- Responsive card layout

**Usage**:
```tsx
<BlogList subdomain="cooking" limit={6} showExcerpts={true} />
```

#### Blog Post Pages
**Location**: `apps/main/pages/_apps/{subdomain}/blog/[slug].tsx`

Full blog post pages featuring:
- Complete markdown-rendered content (1200-2000 words)
- Affiliate link disclaimers
- Related posts sidebar
- SEO-optimized metadata
- Author information and tags

#### Blog Index Pages
**Location**: `apps/main/pages/_apps/{subdomain}/blog/index.tsx`

Blog listing pages with:
- Paginated post grid
- Tag filtering
- Search and sort options
- Responsive layout

### 2. Backend Agents

#### News Curation Agent
**Location**: `backend/src/agents/curationAgents.js`

**Schedule**: Twice daily (6 AM & 3 PM EST)
**Output**: 2 articles per subdomain per slot = 96 articles/day total

**CRITICAL: This agent searches for REAL news articles from external sources**
**Features**:
- Searches real news sources using Perplexity AI with web search
- Finds articles <72 hours old from credible U.S. sources
- AI creates 1-2 sentence summaries (<50 words)
- Links to original news source URLs (external)
- Automatic cleanup (keeps 10 most recent per subdomain)
- NO fake or generated news content

**Database Storage**: `Firestore: gurus/{subdomain}/news` (subcollection structure)
**API Endpoint**: `/api/news/{subdomain}` - reads from the same subcollection path

#### Blog Curation Agent
**Location**: `backend/src/agents/curationAgents.js`

**Schedule**: Weekly on Mondays at 10 AM EST
**Output**: 1 blog post per subdomain per week = 24 posts/week

**Features**:
- AI generates complete 1200-2000 word blog posts
- Creates homepage intro/summary (1-2 sentences)
- Structured with H2/H3 subheadings
- 2-4 contextual affiliate links
- Minimum 2 internal links
- Schema markup for rich snippets
- Automatic topic rotation

**Database Storage**: `Firestore: gurus/{subdomain}/posts` (subcollection structure)
**API Endpoint**: `/api/{subdomain}/posts` - reads from the same subcollection path

#### Backup Agent
**Location**: `backend/src/agents/backupAgent.js`

**Schedule**: Daily at 2 AM EST
**Output**: Complete content snapshots with historical preservation

**Features**:
- Backs up all news articles (with original source URLs)
- Backs up all blog posts (full content)
- Backs up site statistics and metadata
- Dual storage (Firestore + JSON files)
- Permanent historical retention (NO automatic cleanup)
- Restoration capability for site re-deployment
- Disaster recovery support

**Storage Locations**:
- Firestore: `backups` collection (permanent retention)
- Files: `backend/backups/backup-YYYY-MM-DD-timestamp.json`
- Historical archive: All content preserved for re-deployment scenarios

### 3. API Endpoints

#### Content Endpoints
```bash
# Get subdomain homepage data (featured posts, stats)
GET /api/{subdomain}/home

# Get blog posts with pagination
GET /api/{subdomain}/posts?page=1&limit=12&tag=skill

# Get single blog post
GET /api/{subdomain}/posts/{slug}

# Get news articles
GET /api/news/{subdomain}
```

#### Admin Endpoints (require authentication)
```bash
# Trigger manual content curation
POST /api/admin/curate

# Get agent statuses
GET /api/admin/agents-status

# Create manual backup
POST /api/admin/backup/create

# List available backups
GET /api/admin/backup/list

# Restore from backup
POST /api/admin/backup/restore
Body: { "backupId": "backup-YYYY-MM-DD-timestamp" }

# Get backup agent status
GET /api/admin/backup/status
```

## Content Specifications

### News Articles

**Format**:
```javascript
{
  id: "unique-id",
  title: "Article Title",
  summary: "1-2 sentence summary (<50 words)",
  source: "Publisher Name",
  url: "https://source-url.com",
  publishedAt: timestamp,
  curatedAt: timestamp,
  subdomain: "subdomain-name",
  timeSlot: "morning" | "afternoon",
  tags: ["category", "US", "YYYY-MM-DD"]
}
```

**Requirements**:
- <48 hours old (preferred), ≤72 hours maximum
- U.S. sources only
- 50-word limit (title + summary combined)
- Proper source attribution

### Blog Posts

**Format**:
```javascript
{
  id: "post-id",
  title: "SEO-optimized title (≤60 chars)",
  slug: "url-friendly-slug",
  excerpt: "2-3 sentence teaser",
  content: "1200-2000 word markdown content",
  author: "Guru Character Name",
  category: "subdomain-category",
  tags: ["skill", "tag2", "tag3"],
  publishedAt: timestamp,
  seo: {
    metaTitle: "Title (≤60 chars)",
    metaDescription: "Description (≤160 chars)",
    keywords: ["keyword1", "keyword2"]
  },
  internalLinks: ["related-topic-1", "related-topic-2"],
  hasAffiliateLinks: true,
  readTime: "7 min"
}
```

**Requirements**:
- Word count: 1200-2000 words
- Structure: Intro, H2/H3 subheadings, conclusion, CTA
- 2-4 contextual affiliate links per post
- Minimum 2 internal links to related content
- SEO-optimized metadata

## Affiliate Content Integration

### Affiliate Link Placement
- **Location**: Naturally embedded in blog post content
- **Disclosure**: Clear disclaimer in post footer
- **Volume**: 2-4 links per 1200-2000 word post (≤0.3% link density)
- **Relevance**: Contextually appropriate to topic
- **Value**: Must genuinely help the reader

### Affiliate Categories by Subdomain
Each subdomain has specific affiliate categories defined in `backend/src/config/subdomains.js`:

```javascript
cooking: ['kitchen-tools', 'cookbooks', 'ingredients', 'appliances']
tech: ['courses', 'books', 'software', 'hardware']
fitness: ['equipment', 'supplements', 'apparel', 'accessories']
// ... and 25 more subdomains
```

## Subdomain Pages

### Homepage Layout
Each subdomain homepage (`apps/main/pages/_apps/{subdomain}/index.tsx`) includes:

1. **Hero Section**: Subdomain title and description
2. **News Section**: 5 most recent curated news articles
3. **Blog List**: 6 most recent/featured blog posts

### Blog Section
Each subdomain has a dedicated blog section at `/{subdomain}/blog`:

- **Index Page**: Paginated list of all blog posts with tag filtering
- **Post Pages**: Full blog posts with related content and affiliate links

## Setup Scripts

### Initial Setup
```bash
# Install dependencies
cd apps/main && npm install react-markdown

# Set up blog pages for all subdomains
node scripts/setup-subdomain-blogs.js

# Update subdomain homepages with news and blog sections
node scripts/update-subdomain-homepages.js
```

## Monitoring and Management

### Agent Status
Check the status of all agents:
```bash
GET /api/admin/agents-status
```

Response:
```json
{
  "success": true,
  "agents": {
    "curation": {
      "newsAgent": { "status": "running", "lastStarted": "..." },
      "blogAgent": { "status": "running", "lastStarted": "..." }
    },
    "backup": {
      "status": "running",
      "lastBackup": 1234567890,
      "totalBackups": 150
    }
  }
}
```

### Manual Triggers
Administrators can manually trigger content generation or backups via the admin API when needed.

## Environment Variables

```bash
# Agent Control
DISABLE_CURATION_AGENTS=false  # Set to true to disable curation
DISABLE_BACKUP_AGENT=false     # Set to true to disable backups
FAIL_ON_AGENT_ERROR=false      # Set to true to crash on agent errors

# API Configuration
NEXT_PUBLIC_API_URL=https://api.yoohoo.guru  # Frontend API endpoint

# AI Provider Keys (for curation)
OPENROUTER_API_KEY=your_key
OPENAI_API_KEY=your_key (optional fallback)
```

## Disaster Recovery

### In Case of Site Blackout

1. **Locate Most Recent Backup**:
   ```bash
   ls -lt backend/backups/
   # Or via API: GET /api/admin/backup/list
   ```

2. **Restore from Backup**:
   ```bash
   POST /api/admin/backup/restore
   Body: { "backupId": "backup-2025-10-22-1729584000000" }
   ```

3. **Verify Restoration**:
   - Check subdomain homepages for content
   - Verify blog posts are accessible
   - Confirm news articles are displaying

### Backup Contents
Each backup includes:
- All news articles from all 28 subdomains
- All blog posts from all 28 subdomains
- Site statistics and metadata
- Timestamps and version information

## Content Quality Standards

### Editorial Guidelines
- No fake news, misinformation, or unverified claims
- No political extremism or controversial social issues
- No adult content or inappropriate material
- No copyright violations or plagiarism
- Family-friendly and professional tone
- U.S.-focused content

### SEO Best Practices
- Title tags ≤60 characters
- Meta descriptions ≤160 characters
- Proper heading hierarchy (H1 → H2 → H3)
- Internal linking to related content
- Schema markup for rich snippets
- Mobile-responsive design

## Testing

### Verify Content Display
1. Visit any subdomain: `https://cooking.yoohoo.guru`
2. Check news section displays recent articles
3. Check blog section displays recent posts
4. Click through to full blog posts
5. Verify affiliate links and disclaimers

### Verify Agents
1. Check agent status: `GET /api/admin/agents-status`
2. Trigger manual curation: `POST /api/admin/curate`
3. Verify new content appears in database and frontend

### Verify Backups
1. Check backup status: `GET /api/admin/backup/status`
2. Create manual backup: `POST /api/admin/backup/create`
3. List backups: `GET /api/admin/backup/list`
4. Verify backup files exist in `backend/backups/`

## Architecture Summary

```
┌─────────────────────────────────────────────────────┐
│                  CONTENT FLOW                        │
└─────────────────────────────────────────────────────┘

                    CURATION AGENTS
                           │
              ┌────────────┴────────────┐
              │                         │
         News Agent                Blog Agent
      (2x daily @ 6AM, 3PM)    (Weekly @ Mon 10AM)
              │                         │
              ├─────────────┬───────────┤
              │             │           │
         AI Providers   Firestore   Backup Agent
     (Perplexity/Claude)  Storage   (Daily @ 2AM)
              │             │           │
              └─────────────┼───────────┘
                           │
                    FRONTEND DISPLAY
                           │
              ┌────────────┴────────────┐
              │                         │
          News Section             Blog Section
       (5 recent articles)     (6 recent posts)
              │                         │
              └─────────────┬───────────┘
                           │
                   28 Subdomain Sites
```

## Maintenance

### Regular Tasks
- **Weekly**: Review agent logs for errors
- **Monthly**: Check backup file sizes and cleanup if needed
- **Quarterly**: Review content quality and SEO performance
- **As Needed**: Manually trigger curation for important updates

### Logs
All agent activity is logged with timestamps and details:
- `✅` Success messages
- `❌` Error messages
- `⚠️` Warning messages
- `🔄` Process messages

Check logs in backend console or logging service.

## Troubleshooting

### Blog Posts Not Displaying on Subdomain Pages

**Symptom**: Subdomain homepages show "Blog posts temporarily unavailable"

**Root Cause**: Database collection path mismatch

**Solution**: Verify API routes are querying the correct Firestore path:
- ✅ Correct: `db.collection('gurus').doc(subdomain).collection('posts')`
- ❌ Incorrect: `db.collection('posts').where('subdomain', '==', subdomain)`

**Verification**:
```bash
# Check API route configuration
grep "collection('gurus')" backend/src/routes/posts.js
grep "collection('gurus')" backend/src/routes/news.js
```

### News Articles Not Displaying

**Symptom**: NewsSection component shows "News temporarily unavailable"

**Root Cause**: Same as above - collection path mismatch

**Solution**: Same fix as blog posts - ensure routes query `gurus/{subdomain}/news`

### Build Warnings About Google Analytics

**Symptom**: ESLint warning `@next/next/next-script-for-ga` during build

**Root Cause**: Next.js suggests using `next/script` component, but this is incorrect for `_document.tsx`

**Solution**: Add ESLint exception comment:
```tsx
{/* eslint-disable-next-line @next/next/next-script-for-ga */}
<script id="google-analytics" dangerouslySetInnerHTML={{...}} />
```

**Why**: In `_document.tsx`, you must use regular HTML `<script>` tags. The `next/script` component is only for pages and components.

### "BlogCurationAgent is not a constructor" Error

**Symptom**: Build fails with TypeError during `postbuild` step

**Root Cause**: Incorrect import in `trigger-blog-curation.js`

**Solution**: Import the instance, not the class:
```javascript
// ❌ Incorrect
const BlogCurationAgent = require('../src/agents/curationAgents').BlogCurationAgent;
const agent = new BlogCurationAgent();

// ✅ Correct
const { blogCurationAgent } = require('../src/agents/curationAgents');
await blogCurationAgent.triggerManually();
```

### Missing Subdomains (angel, coach, heroes)

**Symptom**: Content for angel.yoohoo.guru, coach.yoohoo.guru, or heroes.yoohoo.guru not appearing

**Root Cause**: VALID_SUBJECTS arrays missing these subdomains

**Solution**: Update VALID_SUBJECTS to include all subdomains:
```javascript
// In posts.js, news.js, BlogList.tsx, NewsSection.tsx
const { getAllSubdomains } = require('../config/subdomains'); // Backend
const VALID_SUBJECTS = getAllSubdomains().filter(s => !['www', 'api'].includes(s));
```

Or for frontend:
```typescript
const VALID_SUBJECTS = [
  'angel', 'art', 'auto', 'business', 'coach', 'coding', 'cooking', 'crafts', 'data',
  'design', 'finance', 'fitness', 'gardening', 'heroes', 'history',
  'home', 'investing', 'language', 'marketing', 'math',
  'mechanical', 'music', 'photography', 'sales', 'science', 'sports',
  'tech', 'wellness', 'writing'
];
```

---

**Last Updated**: 2025-11-19
**Version**: 1.1.0
**Maintained By**: YooHoo.guru Development Team
