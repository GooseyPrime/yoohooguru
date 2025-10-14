# Subdomain Content Specification for AI Agents

This document provides comprehensive content guidelines for AI agents that curate news articles and generate blog posts for yoohoo.guru subdomains.

## Table of Contents

1. [Global Content Rules](#global-content-rules)
2. [News Content Specification](#news-content-specification)
3. [Blog Content Specification](#blog-content-specification)
4. [Subdomain-Specific Guidelines](#subdomain-specific-guidelines)
5. [Content Quality Standards](#content-quality-standards)
6. [Metadata and SEO Requirements](#metadata-and-seo-requirements)

---

## Global Content Rules

### Publishing Schedule

#### Daily News
- **Frequency**: 2 news articles per subdomain per day (4 total across 2 time slots)
- **Morning Slot**: 6:00 AM - 9:00 AM EST (publish 2 articles)
- **Afternoon Slot**: 3:00 PM - 6:00 PM EST (publish 2 articles)
- **Total Volume**: 80 articles per day across 20 subdomains

#### Weekly Blog Posts
- **Frequency**: 1 blog post per subdomain per week
- **Schedule**: Monday, 10:00 AM EST
- **Total Volume**: 20 blog posts per week across 20 subdomains

### Source Requirements

#### News Sources
- **Region**: United States only
- **Reputable Sources**: Major news outlets, industry publications, verified media
- **Freshness**: Articles must be less than 48 hours old (preferred), maximum 72 hours
- **Attribution**: Always include source name and URL for outbound linking
- **Verification**: Ensure sources are legitimate U.S.-based publishers

#### Content Restrictions
- No fake news, misinformation, or unverified claims
- No political extremism or controversial social issues
- No adult content, violence, or offensive material
- No copyright violations or plagiarism
- Family-friendly and professional tone

---

## News Content Specification

### Format Requirements

#### Title
- Maximum 50 words (combined title + summary)
- Clear, concise, and informative
- Action-oriented when possible
- Include key topic/skill keyword

#### Summary
- 1-2 sentences maximum
- Total word count (title + summary): ≤50 words
- Engaging and newsworthy
- Avoid clickbait or sensationalism

#### Metadata
Every news article must include:
```javascript
{
  id: 'unique-identifier',
  title: 'Article Title',
  summary: '1-2 sentence summary',
  url: 'https://source-url.com',
  source: 'Publisher Name',
  publishedAt: timestamp,
  curatedAt: timestamp,
  subdomain: 'subdomain-name',
  timeSlot: 'morning' | 'afternoon',
  aiGenerated: true,
  tags: [category, 'US', 'YYYY-MM-DD'],
  metadata: {
    subdomainTopic: 'category',
    region: 'US',
    date: 'YYYY-MM-DD',
    timeSlot: 'morning' | 'afternoon'
  }
}
```

### Content Discovery Strategy

For each subdomain, AI agents should:
1. Search for news related to the subdomain's primary skills
2. Filter for U.S. sources only
3. Verify article age (<48 hours preferred, ≤72 hours max)
4. Select the 2 most relevant and newsworthy articles
5. Extract or generate concise summaries
6. Obtain real source URLs for attribution

### Reuse Policy

If fewer than 2 new articles are available:
- Carry forward recent articles with refreshed timestamps
- Maintain content continuity
- Ensure subdomain always displays current content
- Maximum reuse: 7 days before requiring new content

### Cleanup Policy

- Keep only the 10 most recent articles per subdomain
- Run cleanup after each curation cycle
- Prevent database bloat
- Archive older articles if needed for analytics

---

## Blog Content Specification

### Format Requirements

#### Length
- **Word Count**: 1,200 - 2,000 words
- Must meet minimum threshold for SEO effectiveness
- Should not exceed maximum for readability

#### Structure
Blog posts must follow this structure:

1. **Introduction** (150-200 words)
   - Hook the reader with an engaging opening
   - State the topic and value proposition
   - Preview what the reader will learn

2. **Body Content** (800-1,500 words)
   - Use H2 and H3 subheadings for organization
   - Include bullet points and numbered lists for scannability
   - Provide actionable advice and practical tips
   - Use examples and case studies when relevant

3. **Visual Elements**
   - Suggest locations for images, infographics, or diagrams
   - Alt text suggestions for accessibility
   - Captions that add value

4. **Conclusion** (100-150 words)
   - Summarize key takeaways
   - Reinforce main message
   - Encourage reader action

5. **Call-to-Action (CTA) Box**
   - Invite readers to explore yoohoo.guru
   - Link to skill search or subdomain landing page
   - Encourage skill sharing and community participation

#### SEO Optimization

**Meta Title**
- Maximum 60 characters
- Include primary keyword
- Compelling and descriptive

**Meta Description**
- Maximum 160 characters
- Include call-to-action
- Summarize article value

**Keywords**
- 5-10 relevant keywords
- Mix of primary and long-tail keywords
- Natural integration in content

**URL Slug**
- Format: `/blog/YYYY-MM-DD-title-slug`
- Lowercase, hyphen-separated
- Include primary keyword

#### Schema Markup
```javascript
{
  type: 'BlogPosting' | 'Article' | 'Review',
  datePublished: 'ISO-8601 timestamp',
  author: 'Guru Character',
  category: 'subdomain-category',
  wordCount: 1200-2000
}
```

### Content Enhancement

#### Affiliate Integration
- Include 2-4 contextual affiliate links naturally in content
- Link to relevant products, courses, or tools
- Full disclosure: "This post may contain affiliate links"
- Links should genuinely add value

#### Internal Linking
- Minimum 2 cross-links to related blog posts
- Link to subdomain landing pages
- Link to skill search or category pages
- Improve site navigation and SEO

#### Topic Variety
Rotate through these topic categories weekly:
1. **How-To Guides**: Step-by-step tutorials
2. **Best Practices**: Industry standards and expert advice
3. **Tool Reviews**: Product and software comparisons
4. **Trend Analysis**: Industry news and emerging topics
5. **Case Studies**: Success stories and real-world examples
6. **Beginner Guides**: Introduction to skills and topics
7. **Advanced Techniques**: Expert-level strategies

---

## Subdomain-Specific Guidelines

### 1. cooking.yoohoo.guru
**Character**: Chef Guru  
**Category**: Culinary  
**Primary Skills**: cooking, baking, nutrition, meal-prep, food-styling

#### News Topics
- New restaurant openings and chef interviews
- Food safety and health regulations
- Culinary trends and techniques
- Cookbook releases and reviews
- Kitchen technology innovations

#### Blog Topics
- Recipe development and testing
- Knife skills and cooking techniques
- Meal planning and batch cooking
- Nutrition and dietary considerations
- Kitchen equipment buying guides

---

### 2. music.yoohoo.guru
**Character**: Music Guru  
**Category**: Audio  
**Primary Skills**: guitar, piano, vocals, production, composition

#### News Topics
- Music industry news and releases
- Artist interviews and profiles
- Music technology and gear announcements
- Concert and event highlights
- Music education trends

#### Blog Topics
- Instrument learning techniques
- Music theory fundamentals
- Recording and production tips
- Practice routines and strategies
- Gear reviews and recommendations

---

### 3. fitness.yoohoo.guru
**Character**: Fitness Guru  
**Category**: Health  
**Primary Skills**: personal-training, yoga, strength-training, nutrition, wellness

#### News Topics
- Fitness research and studies
- Health and wellness trends
- New workout programs and methods
- Nutrition science updates
- Athlete profiles and achievements

#### Blog Topics
- Workout routines and programs
- Exercise form and technique
- Nutrition and meal planning
- Recovery and injury prevention
- Fitness equipment reviews

---

### 4. tech.yoohoo.guru
**Character**: Tech Guru  
**Category**: Technology  
**Primary Skills**: programming, web-development, mobile-apps, data-science, ai-ml

#### News Topics
- Technology product launches
- Software updates and releases
- Tech industry developments
- Cybersecurity news
- AI and machine learning advances

#### Blog Topics
- Programming tutorials
- Framework comparisons
- Development best practices
- Tool and library reviews
- Career advice for developers

---

### 5. art.yoohoo.guru
**Character**: Art Guru  
**Category**: Creative  
**Primary Skills**: drawing, painting, digital-art, sculpture, photography

#### News Topics
- Gallery openings and exhibitions
- Artist features and interviews
- Art market trends
- Digital art technology
- Art education news

#### Blog Topics
- Technique tutorials
- Art supply reviews
- Style exploration guides
- Portfolio development
- Art business and marketing

---

### 6. language.yoohoo.guru
**Character**: Language Guru  
**Category**: Education  
**Primary Skills**: english, spanish, french, mandarin, conversation

#### News Topics
- Language learning research
- Translation technology updates
- Cultural exchange programs
- Education policy changes
- Linguistics discoveries

#### Blog Topics
- Language learning strategies
- Grammar and vocabulary tips
- Cultural context and idioms
- Study resource recommendations
- Immersion techniques

---

### 7. business.yoohoo.guru
**Character**: Business Guru  
**Category**: Professional  
**Primary Skills**: entrepreneurship, management, strategy, consulting, leadership

#### News Topics
- Business news and trends
- Startup funding and exits
- Management innovations
- Economic indicators
- Leadership insights

#### Blog Topics
- Business planning guides
- Management strategies
- Startup advice and tips
- Leadership development
- Business tool reviews

---

### 8. design.yoohoo.guru
**Character**: Design Guru  
**Category**: Creative  
**Primary Skills**: graphic-design, ui-ux, branding, typography, color-theory

#### News Topics
- Design trends and innovations
- Software and tool releases
- Designer spotlights
- Agency and project showcases
- Design awards and recognition

#### Blog Topics
- Design principles tutorials
- Tool and software guides
- Portfolio development tips
- Client management strategies
- Design process workflows

---

### 9. writing.yoohoo.guru
**Character**: Writing Guru  
**Category**: Creative  
**Primary Skills**: creative-writing, copywriting, content-writing, editing, storytelling

#### News Topics
- Publishing industry news
- Author interviews and releases
- Writing contests and awards
- Content marketing trends
- Writing tool announcements

#### Blog Topics
- Writing technique guides
- Genre-specific tips
- Editing and revision strategies
- Publishing pathway advice
- Writing career development

---

### 10. photography.yoohoo.guru
**Character**: Photography Guru  
**Category**: Creative  
**Primary Skills**: portrait, landscape, commercial, editing, lighting

#### News Topics
- Camera and equipment releases
- Photography competitions
- Photographer features
- Industry trends and techniques
- Photography event coverage

#### Blog Topics
- Camera technique tutorials
- Lighting setup guides
- Post-processing workflows
- Gear reviews and comparisons
- Photography business tips

---

### 11. gardening.yoohoo.guru
**Character**: Garden Guru  
**Category**: Lifestyle  
**Primary Skills**: vegetables, flowers, landscaping, composting, plant-care

#### News Topics
- Gardening trends and techniques
- Plant discoveries and science
- Seasonal gardening updates
- Sustainable gardening practices
- Garden event coverage

#### Blog Topics
- Growing guides by season
- Pest and disease management
- Soil health and composting
- Garden design ideas
- Tool and product reviews

---

### 12. crafts.yoohoo.guru
**Character**: Crafts Guru  
**Category**: Creative  
**Primary Skills**: knitting, sewing, woodworking, jewelry-making, diy

#### News Topics
- Craft trends and movements
- Crafting event coverage
- New material and tool releases
- Crafter spotlights
- Craft market trends

#### Blog Topics
- Project tutorials and patterns
- Technique demonstrations
- Material guides and reviews
- Craft business advice
- Design inspiration ideas

---

### 13. wellness.yoohoo.guru
**Character**: Wellness Guru  
**Category**: Health  
**Primary Skills**: meditation, mindfulness, stress-management, holistic-health, self-care

#### News Topics
- Wellness research and studies
- Mental health awareness
- Holistic health trends
- Wellness product launches
- Expert interviews and insights

#### Blog Topics
- Meditation and mindfulness guides
- Stress reduction techniques
- Self-care routines
- Holistic health approaches
- Wellness lifestyle tips

---

### 14. finance.yoohoo.guru
**Character**: Finance Guru  
**Category**: Professional  
**Primary Skills**: budgeting, accounting, tax-prep, financial-planning, bookkeeping

#### News Topics
- Financial market updates
- Tax law changes
- Accounting standards updates
- Personal finance trends
- Economic analysis

#### Blog Topics
- Budgeting strategies
- Tax preparation tips
- Investment basics
- Debt management advice
- Financial planning guides

---

### 15. home.yoohoo.guru
**Character**: Home Guru  
**Category**: Lifestyle  
**Primary Skills**: home-improvement, interior-design, organization, cleaning, repair

#### News Topics
- Home improvement trends
- Real estate market updates
- Home product innovations
- DIY project showcases
- Home technology news

#### Blog Topics
- Home improvement tutorials
- Organizing systems and tips
- Interior design ideas
- Maintenance and repair guides
- Product reviews and recommendations

---

### 16. data.yoohoo.guru
**Character**: Data Guru  
**Category**: Technology  
**Primary Skills**: data-science, analytics, machine-learning, sql, python

#### News Topics
- Data science advances
- Analytics tool releases
- Machine learning research
- Industry applications of AI/ML
- Data privacy and security

#### Blog Topics
- Data analysis tutorials
- SQL and Python guides
- Machine learning explanations
- Data visualization techniques
- Analytics tool comparisons

---

### 17. investing.yoohoo.guru
**Character**: Investing Guru  
**Category**: Finance  
**Primary Skills**: stock-trading, portfolio-management, cryptocurrency, real-estate-investing, options-trading

#### News Topics
- Stock market analysis
- Investment strategy updates
- Cryptocurrency developments
- Real estate market trends
- Economic policy impacts

#### Blog Topics
- Investment strategy guides
- Portfolio diversification tips
- Market analysis techniques
- Risk management strategies
- Investment tool reviews

---

### 18. marketing.yoohoo.guru
**Character**: Marketing Guru  
**Category**: Professional  
**Primary Skills**: digital-marketing, seo, social-media, content-marketing, email-marketing

#### News Topics
- Marketing platform updates
- Digital marketing trends
- Campaign case studies
- SEO algorithm changes
- Social media news

#### Blog Topics
- Marketing strategy guides
- SEO optimization techniques
- Social media tactics
- Content marketing workflows
- Marketing tool tutorials

---

### 19. sales.yoohoo.guru
**Character**: Sales Guru  
**Category**: Professional  
**Primary Skills**: sales-techniques, negotiation, cold-calling, closing, crm

#### News Topics
- Sales methodology trends
- CRM platform updates
- Sales technology innovations
- Industry best practices
- Sales leader interviews

#### Blog Topics
- Sales technique tutorials
- Negotiation strategies
- CRM usage guides
- Lead generation tactics
- Sales process optimization

---

### 20. coding.yoohoo.guru
**Character**: Coding Guru  
**Category**: Technology  
**Primary Skills**: javascript, python, react, node-js, algorithms

#### News Topics
- Programming language updates
- Framework releases
- Developer tool announcements
- Coding bootcamp news
- Tech hiring trends

#### Blog Topics
- Coding tutorials by language
- Algorithm explanations
- Framework comparison guides
- Best practices and patterns
- Developer career advice

---

## Content Quality Standards

### Writing Quality

#### Tone and Voice
- **Professional yet approachable**: Avoid overly technical jargon
- **Authoritative**: Present information confidently
- **Encouraging**: Inspire readers to learn and grow
- **Authentic**: Match the character personality of each subdomain

#### Readability
- Use short paragraphs (2-4 sentences)
- Include subheadings every 200-300 words
- Use bullet points and numbered lists
- Write at 8th-10th grade reading level
- Avoid passive voice when possible

#### Accuracy
- Verify all facts and statistics
- Cite sources when making claims
- Avoid outdated information
- Update content if circumstances change
- Correct errors promptly

### Engagement Factors

#### Actionable Content
- Provide practical, implementable advice
- Include step-by-step instructions when relevant
- Offer clear takeaways
- Enable readers to apply knowledge immediately

#### Value Addition
- Answer common questions
- Solve real problems
- Save readers time or money
- Inspire learning and growth

#### Community Connection
- Reference the yoohoo.guru community
- Encourage skill sharing
- Mention local impact and connections
- Invite participation and engagement

---

## Metadata and SEO Requirements

### Tags and Categories

Every piece of content must include:

#### News Articles
```javascript
tags: [
  'subdomain-category',  // e.g., 'culinary', 'technology'
  'US',                  // region identifier
  'YYYY-MM-DD'          // publication date
]
```

#### Blog Posts
```javascript
tags: [
  'topic-tag-1',        // e.g., 'javascript', 'yoga', 'budgeting'
  'topic-tag-2',
  'topic-tag-3',
  'subdomain-category',
  'US',
  'YYYY-MM-DD'
]
```

### SEO Best Practices

#### Keyword Optimization
- Primary keyword in title (first 50 characters)
- Primary keyword in first paragraph
- LSI (Latent Semantic Indexing) keywords throughout
- Keyword density: 1-2% (natural integration)
- Keywords in H2 and H3 headings

#### Meta Tags
```javascript
{
  metaTitle: 'Primary Keyword | Subdomain Name',  // ≤60 chars
  metaDescription: 'Compelling description with CTA',  // ≤160 chars
  keywords: ['primary', 'secondary', 'long-tail', 'keywords'],
  canonicalUrl: 'https://subdomain.yoohoo.guru/path',
  ogImage: 'url-to-social-share-image',
  ogType: 'article'
}
```

#### Structured Data
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Article Title",
  "author": {
    "@type": "Person",
    "name": "Guru Character"
  },
  "datePublished": "2025-01-15T10:00:00Z",
  "dateModified": "2025-01-15T10:00:00Z",
  "publisher": {
    "@type": "Organization",
    "name": "yoohoo.guru",
    "logo": {
      "@type": "ImageObject",
      "url": "https://yoohoo.guru/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://subdomain.yoohoo.guru/blog/article-slug"
  }
}
```

### Image Requirements

#### Blog Post Images
- **Minimum Resolution**: 1200x630 pixels (for social sharing)
- **Aspect Ratio**: 16:9 or 1.91:1
- **File Format**: JPEG or WebP (optimized)
- **File Size**: Under 200KB (optimized for performance)
- **Alt Text**: Descriptive, includes keywords when natural
- **Filename**: descriptive-with-keywords.jpg

#### News Articles
- Source image URL if available
- Fallback to subdomain default image
- Alt text required for accessibility

---

## Implementation Notes for AI Agents

### Content Generation Workflow

1. **Topic Selection**
   - Review subdomain configuration
   - Consider recent article history
   - Ensure topic variety and rotation
   - Align with current trends and seasonality

2. **Research Phase**
   - Gather source material from reputable outlets
   - Verify information accuracy
   - Check for U.S. source requirement (news)
   - Validate article freshness (<48 hours for news)

3. **Content Creation**
   - Follow format specifications exactly
   - Meet word count requirements
   - Include all required metadata
   - Apply SEO best practices

4. **Quality Review**
   - Check for factual accuracy
   - Verify proper formatting
   - Ensure readability and flow
   - Confirm metadata completeness

5. **Publishing**
   - Store in Firestore: `gurus/{subdomain}/news` or `gurus/{subdomain}/posts`
   - Apply proper tags and metadata
   - Set correct timestamps
   - Trigger cleanup for old content

### Error Handling

#### Insufficient News Sources
- Implement reuse policy (carry forward recent articles)
- Adjust search parameters
- Consider broader topic interpretation
- Log warnings for monitoring

#### Content Generation Failures
- Retry with alternative AI model
- Fall back to placeholder content (dev only)
- Alert administrators
- Queue for manual review

#### Quality Issues
- Run automated quality checks
- Verify minimum word counts
- Check for plagiarism
- Ensure metadata completeness

---

## Monitoring and Maintenance

### Success Metrics

Track the following for each subdomain:

- **Article Count**: 4 news articles per day, 1 blog post per week
- **Freshness**: News articles <48 hours old
- **Engagement**: Click-through rates on articles
- **Quality**: Readability scores, word counts
- **SEO Performance**: Search rankings, organic traffic

### Monthly Maintenance Tasks

1. **Broken Link Check**: Verify all source URLs
2. **Duplicate Detection**: Scan for duplicate headlines or content
3. **Affiliate Link Validation**: Ensure affiliate links work
4. **Content Diversity Review**: Verify topic rotation
5. **SEO Performance Analysis**: Review rankings and traffic

### Continuous Improvement

- Analyze top-performing content
- Identify low-engagement articles
- Adjust topic mix based on performance
- Update content guidelines as needed
- Incorporate user feedback

---

## Conclusion

This specification provides comprehensive guidelines for AI agents curating news and generating blog content across all 20 yoohoo.guru subdomains. By following these standards, we ensure:

✅ Consistent quality across all subdomains  
✅ SEO-optimized content for better discovery  
✅ Engaging, valuable content for users  
✅ Proper attribution and ethical sourcing  
✅ Scalable automation with quality control  

**Last Updated**: 2025-10-14  
**Version**: 1.0  
**Maintained By**: Content Operations Team

For questions or updates to this specification, please refer to:
- `SUBDOMAIN_CURATION_IMPLEMENTATION.md` - Technical implementation details
- `SUBDOMAIN_CURATION_QUICKREF.md` - Quick reference guide
- `backend/src/agents/curationAgents.js` - Agent implementation code
