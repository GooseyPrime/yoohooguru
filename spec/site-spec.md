# YooHoo Guru — Complete Site Specification

## Executive Summary

YooHooGuru is a **24-subdomain AI-powered content and skill-sharing platform** that combines automated content curation with marketplace functionality. Each subdomain serves as both a niche content hub (news/blogs) and a specialized service marketplace, monetized through affiliate marketing, Stripe payments, and lead generation.

**Platform Scale:**
- 24 thematic subdomains + 3 core products (Hub, Angel's List, SkillShare, Hero Gurus)
- 96 AI-curated news articles per day (2 per subdomain, twice daily)
- 24 AI-generated blog posts per week (1 per subdomain)
- Multi-layer monetization: affiliate links, Stripe payments, Connect payouts, lead capture

---

## Brand & Architecture

### Primary Domains

#### **Hub: yoohoo.guru**
- Main landing page and global entry point
- Global search across all subdomains
- Central blog/CMS hub
- User authentication portal
- Cross-subdomain navigation

#### **Angel's List: angel.yoohoo.guru**
- Local services marketplace
- Small jobs and gigs
- Rental listings
- Service provider directory

#### **SkillShare: coach.yoohoo.guru**
- Professional skill-sharing marketplace led by Coach Guru
- Structured skill-swap sessions
- Educational service bookings
- Skill matching and discovery
- Session scheduling and payments

#### **Hero Gurus: heroes.yoohoo.guru**
- Community volunteering platform
- Social impact initiatives
- Non-profit partnerships
- Volunteer coordination

### 24 Thematic Content Subdomains

Each subdomain operates as an independent content hub with consistent structure:

#### **Culinary**
- **cooking.yoohoo.guru** - Culinary arts, recipes, cooking techniques
  - Primary Skills: Baking, Cooking, Recipe Development, Food Styling
  - Affiliate Categories: Kitchen tools, cookbooks, cooking classes

#### **Audio & Music**
- **music.yoohoo.guru** - Music education, performance, audio production
  - Primary Skills: Music Theory, Instrument Performance, Audio Engineering, Composition
  - Affiliate Categories: Instruments, audio equipment, music software

#### **Health & Wellness**
- **fitness.yoohoo.guru** - Exercise, training, physical health
  - Primary Skills: Personal Training, Yoga, CrossFit, Running, Strength Training
  - Affiliate Categories: Fitness equipment, supplements, workout programs

- **wellness.yoohoo.guru** - Mental health, holistic wellness, self-care
  - Primary Skills: Meditation, Mindfulness, Stress Management, Nutrition
  - Affiliate Categories: Wellness products, meditation apps, health supplements

#### **Technology**
- **tech.yoohoo.guru** - General technology, gadgets, consumer tech
  - Primary Skills: Tech Support, Hardware, Software, Troubleshooting
  - Affiliate Categories: Electronics, gadgets, tech accessories

- **coding.yoohoo.guru** - Programming, software development
  - Primary Skills: JavaScript, Python, React, Node.js, Web Development
  - Affiliate Categories: Coding courses, books, development tools

- **data.yoohoo.guru** - Data science, analytics, databases
  - Primary Skills: Data Analysis, SQL, Python, Machine Learning, Statistics
  - Affiliate Categories: Data tools, courses, analytics software

#### **Creative Arts**
- **art.yoohoo.guru** - Visual arts, painting, drawing
  - Primary Skills: Drawing, Painting, Digital Art, Illustration
  - Affiliate Categories: Art supplies, courses, software

- **design.yoohoo.guru** - Graphic design, UX/UI, visual communication
  - Primary Skills: Graphic Design, UI/UX, Adobe Suite, Figma
  - Affiliate Categories: Design software, courses, templates

- **writing.yoohoo.guru** - Writing, editing, content creation
  - Primary Skills: Creative Writing, Copywriting, Editing, Content Strategy
  - Affiliate Categories: Writing software, courses, books

- **photography.yoohoo.guru** - Photography, videography, visual media
  - Primary Skills: Portrait Photography, Photo Editing, Videography
  - Affiliate Categories: Cameras, lenses, editing software

- **crafts.yoohoo.guru** - Handicrafts, DIY, making
  - Primary Skills: Knitting, Woodworking, Jewelry Making, DIY Projects
  - Affiliate Categories: Craft supplies, tools, kits

#### **Education**
- **language.yoohoo.guru** - Language learning, linguistics
  - Primary Skills: Spanish, French, ESL, Language Teaching
  - Affiliate Categories: Language courses, apps, books

- **history.yoohoo.guru** - History education, historical analysis
  - Primary Skills: World History, American History, Historical Research
  - Affiliate Categories: Books, documentaries, courses

- **math.yoohoo.guru** - Mathematics education, tutoring
  - Primary Skills: Algebra, Calculus, Statistics, Math Tutoring
  - Affiliate Categories: Math courses, calculators, educational tools

- **science.yoohoo.guru** - Science education across disciplines
  - Primary Skills: Biology, Chemistry, Physics, Lab Skills
  - Affiliate Categories: Science kits, equipment, courses

#### **Professional Development**
- **business.yoohoo.guru** - Business strategy, entrepreneurship
  - Primary Skills: Business Planning, Entrepreneurship, Management
  - Affiliate Categories: Business tools, courses, software

- **finance.yoohoo.guru** - Personal finance, financial planning
  - Primary Skills: Financial Planning, Budgeting, Tax Preparation
  - Affiliate Categories: Finance software, courses, books

- **investing.yoohoo.guru** - Investment strategies, portfolio management
  - Primary Skills: Stock Trading, Real Estate, Portfolio Management
  - Affiliate Categories: Investment platforms, courses, books

- **marketing.yoohoo.guru** - Digital marketing, advertising
  - Primary Skills: SEO, Content Marketing, Social Media, Email Marketing
  - Affiliate Categories: Marketing tools, courses, software

- **sales.yoohoo.guru** - Sales techniques, business development
  - Primary Skills: B2B Sales, Negotiation, CRM Management
  - Affiliate Categories: Sales tools, courses, CRM software

#### **Lifestyle**
- **gardening.yoohoo.guru** - Gardening, horticulture, landscaping
  - Primary Skills: Vegetable Gardening, Landscaping, Plant Care
  - Affiliate Categories: Garden tools, seeds, supplies

- **home.yoohoo.guru** - Home improvement, interior design
  - Primary Skills: Home Repair, Interior Design, DIY Home Projects
  - Affiliate Categories: Tools, home decor, improvement materials

#### **Sports**
- **sports.yoohoo.guru** - Sports training, coaching, athletics
  - Primary Skills: Coaching, Athletic Training, Sports Strategy
  - Affiliate Categories: Sports equipment, training programs, gear

### Infrastructure Architecture

**Domain Routing:**
```
yoohoo.guru           → Vercel (Main Hub Frontend)
www.yoohoo.guru       → Vercel (Main Hub Frontend)
*.yoohoo.guru         → Vercel (Subdomain Frontends - Wildcard routing via middleware)
api.yoohoo.guru:3001  → Railway (Backend API)
```

**Subdomain Handling:**
- **Architecture:** Single-app monorepo with Next.js middleware-based routing
- **App Structure:** apps/main is the sole Next.js application
- **Subdomain Pages:** All subdomain pages located at apps/main/pages/_apps/{subdomain}/
- **Routing Mechanism:**
  - Next.js middleware (apps/main/middleware.ts) intercepts subdomain requests
  - Middleware rewrites subdomain.yoohoo.guru/ to /_apps/{subdomain}/ internally
  - User sees subdomain.yoohoo.guru URL, but serves pages/_apps/{subdomain}/index.tsx
- **Configuration:** Backend subdomain configs in `/backend/src/config/subdomains.js`
- **Wildcard DNS/SSL:** Enabled via Vercel for dynamic subdomain routing
- **Supported Subdomains:** 28 total (www, angel, coach, heroes, dashboard + 24 content hubs)

**Technology Stack:**
- **Frontend:** Next.js 14 (single-app monorepo), React 18, TailwindCSS 4
- **Backend:** Node.js/Express on Railway
- **Database:** Firebase (Firestore + Auth + Storage)
- **Payments:** Stripe + Stripe Connect
- **CDN:** Cloudflare
- **Deployment:** Vercel (frontend), Railway (backend)
- **Design System:** Orbitron theme components (in progress)

---

## Complete Functionality Documentation

### 1. Authentication & User Management

**Location:** `/backend/src/routes/auth.js`

#### Email Authentication
- Primary login method via email/password
- Password reset flow with email verification
- Session management via JWT tokens
- Token stored in httpOnly cookies for security

#### OAuth (Google)
- Optional Google OAuth integration
- Single sign-on capability
- Automatic profile creation on first login
- OAuth credentials configured in `appConfig.js`

#### User Profiles
- **Fields:** avatar, displayName, city/ZIP, short bio, skills
- **Storage:** Firebase Auth + Firestore `users` collection
- **Editable:** Via profile settings page
- **Visibility:** Public profiles for service providers

**API Endpoints:**
```javascript
POST /api/auth/register        // Email registration
POST /api/auth/login           // Email login
POST /api/auth/logout          // Session termination
GET  /api/auth/me              // Current user profile
PUT  /api/auth/profile         // Update profile
POST /api/auth/reset-password  // Password reset request
POST /api/auth/google          // Google OAuth callback
```

### 2. Content Curation System (AI Agents)

**Location:** `/backend/src/agents/curationAgents.js`

This is the **core monetization driver** that populates domain pages with SEO-optimized, affiliate-ready content.

#### News Curation Agent

**Class:** `NewsCurationAgent`

**Schedule:**
- **Morning Run:** 6:00 AM EST - Publishes 2 articles per subdomain
- **Afternoon Run:** 3:00 PM EST - Publishes 2 articles per subdomain
- **Daily Total:** 96 articles across 24 subdomains (4 per subdomain)

**Process Flow:**
1. **Agent Activation:** Cron job triggers at scheduled times
2. **Content Discovery:**
   - Queries AI provider (OpenRouter with Perplexity) for US news
   - Filters by subdomain topic/category
   - Requires articles <48 hours old (max 72 hours)
3. **Article Extraction:**
   - Extracts: title, summary, source URL, publisher, published date
   - Validates article freshness and relevance
   - Generates concise summaries (title + summary ≤50 words)
4. **Firestore Storage:**
   ```javascript
   firestore/gurus/{subdomain}/news/{articleId}
   {
     id, title, summary, url, source, publishedAt, curatedAt,
     subdomain, timeSlot: 'morning|afternoon',
     aiGenerated: true,
     tags: [category, 'US', 'YYYY-MM-DD'],
     metadata: { subdomainTopic, region, date, timeSlot }
   }
   ```
5. **Cleanup:** Maintains only 10 most recent articles per subdomain
6. **Fallback:** If insufficient new articles, reuses recent articles with updated timestamps

**Monetization Integration:**
- News articles drive organic traffic via SEO
- Each article links to original source (outbound traffic for credibility)
- Article pages display contextual ads and CTAs for services
- Lead capture forms appear on news article pages

#### Blog Curation Agent

**Class:** `BlogCurationAgent`

**Schedule:**
- **Frequency:** 1 blog post per subdomain per week
- **Publish Day:** Monday, 10:00 AM EST
- **Weekly Total:** 24 blog posts

**Process Flow:**
1. **Topic Selection:**
   - 7-category rotation cycle:
     1. How-To Guides
     2. Best Practices
     3. Tool Reviews (high affiliate potential)
     4. Trend Analysis
     5. Case Studies
     6. Beginner Guides
     7. Advanced Techniques
2. **Content Generation:**
   - AI generates 1,200-2,000 word articles
   - **Structure:** Introduction (150-200w) + Body (800-1,500w) + Conclusion (100-150w) + CTA
   - **Reading Level:** 8th-10th grade (accessible but authoritative)
   - **Tone:** Professional, encouraging, authentic
3. **Affiliate Integration (KEY MONETIZATION):**
   - **2-4 contextual affiliate links** naturally embedded in content
   - Links to relevant products/services from affiliate programs
   - Example: cooking.yoohoo.guru blog mentions "best chef's knife" with Amazon affiliate link
   - Disclosure statement: "This post may contain affiliate links"
4. **SEO Optimization:**
   - Primary keyword in title (first 50 characters)
   - LSI keywords distributed throughout (1-2% density)
   - Meta title ≤60 characters
   - Meta description ≤160 characters
   - 5-10 target keywords tagged
   - Subheadings every 200-300 words
   - Internal links to other subdomain content
5. **Firestore Storage:**
   ```javascript
   firestore/gurus/{subdomain}/posts/{postId}
   {
     id, slug, title, content, excerpt, author,
     publishedAt, updatedAt, status: 'published',
     subdomain, category, tags[],
     seo: { metaTitle, metaDescription, keywords[] },
     affiliateLinks: [{ url, product, placement }],
     featured: boolean,
     viewCount: number
   }
   ```

**Monetization Integration:**
- **Primary Revenue Driver:** Affiliate commissions from embedded links
- **SEO Traffic:** Long-form content ranks for search queries
- **Lead Generation:** CTAs at article end drive service bookings
- **Email Capture:** "Subscribe for weekly tips" forms on blog pages

**Agent Status Monitoring:**
```javascript
GET /health
// Returns status of both agents:
{
  curationAgents: {
    newsAgent: { status: 'running', lastStarted: timestamp },
    blogAgent: { status: 'running', lastStarted: timestamp }
  }
}

GET /api/admin/agents-status  // Admin-only detailed view
```

### 3. Content Delivery Pipeline (Agent → Domain Pages)

This section describes **how agent-generated content reaches end users for monetization**.

#### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ 1. AGENT GENERATION (Backend Cron Jobs)                     │
│    - NewsCurationAgent runs 2x daily                         │
│    - BlogCurationAgent runs weekly                           │
│    - Content generated via OpenRouter AI                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. FIRESTORE STORAGE (Database Layer)                       │
│    firestore/gurus/{subdomain}/                             │
│    ├── news/        ← News articles (10 most recent)        │
│    ├── posts/       ← Blog posts (all published)            │
│    ├── services/    ← Offered services                      │
│    ├── leads/       ← Lead captures                         │
│    └── stats/       ← Analytics metrics                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. API ENDPOINTS (Backend Routes)                           │
│    GET /:subdomain/home      ← Homepage data                │
│    GET /:subdomain/posts     ← Blog list (paginated)        │
│    GET /:subdomain/posts/:slug ← Individual blog post       │
│    GET /news/:subdomain      ← News articles                │
│    GET /:subdomain/services  ← Service offerings            │
│    POST /:subdomain/leads    ← Lead capture                 │
│                                                              │
│    - Caching: 3-5 minute Redis/memory cache                 │
│    - Rate Limiting: 100 req/15min per IP                    │
│    - Analytics: View tracking on content access             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. FRONTEND CONSUMPTION (Next.js Pages)                     │
│    /apps/main/pages/_apps/{subdomain}/                      │
│    ├── index.tsx         ← Homepage (featured posts)        │
│    ├── blog/             ← Blog list & individual posts     │
│    ├── news/             ← News feed                        │
│    ├── services/         ← Service directory                │
│    └── about/            ← About page                       │
│                                                              │
│    - SSR/ISR for SEO optimization                           │
│    - Client-side hydration for interactivity                │
│    - Responsive design (mobile-first)                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. USER DISPLAY & MONETIZATION                              │
│    - SEO-optimized content visible to search engines        │
│    - Affiliate links clickable and tracked                  │
│    - Lead capture forms functional                          │
│    - Service booking CTAs prominent                         │
│    - Analytics tracking user engagement                     │
└─────────────────────────────────────────────────────────────┘
```

#### API Endpoint Specifications

**Location:** `/backend/src/routes/gurus.js`

##### **GET /:subdomain/home**
Returns homepage data for a subdomain.

**Response:**
```javascript
{
  subdomain: 'cooking',
  config: {
    character: 'Chef Guru',
    category: 'culinary',
    primarySkills: ['Baking', 'Cooking', ...],
    theme: { primaryColor, secondaryColor, icon, emoji },
    seo: { title, description, keywords }
  },
  featuredPosts: [{ id, slug, title, excerpt, publishedAt, ... }],
  stats: { totalPosts, totalServices, subscriberCount }
}
```

**Cache:** 5 minutes

##### **GET /:subdomain/posts**
Returns paginated blog post list.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 12)
- `tag` (filter by tag)
- `search` (full-text search)
- `category` (filter by category)
- `featured` (boolean)

**Response:**
```javascript
{
  posts: [{
    id, slug, title, excerpt, author, publishedAt,
    tags, category, featured, viewCount,
    seo: { metaTitle, metaDescription }
  }],
  pagination: {
    page, limit, totalPosts, totalPages,
    hasNext, hasPrev
  },
  filters: { availableTags, availableCategories }
}
```

**Cache:** 3 minutes

##### **GET /:subdomain/posts/:slug**
Returns full blog post content with affiliate links.

**Response:**
```javascript
{
  post: {
    id, slug, title, content,  // ← Content includes affiliate links
    excerpt, author, publishedAt, updatedAt,
    subdomain, category, tags,
    seo: { metaTitle, metaDescription, keywords },
    affiliateLinks: [          // ← MONETIZATION PAYLOAD
      { url, product, placement, description }
    ],
    featured, viewCount
  },
  relatedPosts: [{ id, slug, title, excerpt }]  // ← Based on tag matching
}
```

**Side Effects:**
- Increments `viewCount` on post document
- Records analytics event in `analytics/post-views` collection
- Tracks: subdomain, postId, slug, timestamp, IP, userAgent

**Cache:** None (tracking required)

##### **GET /news/:subdomain**
Returns recent news articles.

**Response:**
```javascript
{
  news: [{
    id, title, summary, url, source,
    publishedAt, curatedAt, subdomain,
    timeSlot, tags
  }]
}
```

**Max Results:** 10 most recent articles

**Fallback:** If no articles in Firestore, loads from `/mock-data/{subdomain}.json`

**Cache:** 5 minutes

##### **POST /:subdomain/leads**
Captures lead information for monetization.

**Request Body:**
```javascript
{
  name: string (required),
  email: string (required, validated),
  service: string (optional),
  message: string (optional),
  phone: string (optional)
}
```

**Response:**
```javascript
{
  success: true,
  leadId: 'generated-id',
  message: 'Thank you! We will contact you soon.'
}
```

**Storage:**
- Saved to `gurus/{subdomain}/leads/{leadId}`
- Also saved to global `leads/{leadId}` collection
- Includes metadata: timestamp, ip, userAgent, source: 'subdomain'

**Monetization Value:**
- Lead contact information for service sales
- Potential revenue from service bookings
- Email list for marketing campaigns

#### Caching Strategy

**Middleware:** `/backend/src/middleware/cacheMiddleware.js`

```javascript
// Public content pages
app.get('/:subdomain/home', cacheMiddleware(300), ...) // 5 min
app.get('/:subdomain/posts', cacheMiddleware(180), ...) // 3 min
app.get('/news/:subdomain', cacheMiddleware(300), ...) // 5 min

// No cache for tracking
app.get('/:subdomain/posts/:slug', ...) // No cache (view tracking)
app.post('/:subdomain/leads', ...) // No cache (form submission)
```

#### Fallback & Resilience

1. **Database Empty:**
   - Loads seeded mock data from `/mock-data/{subdomain}.json`
   - Dev mode: Generates placeholder content

2. **Agent Failures:**
   - News agent: Reuses recent articles with refreshed timestamps
   - Blog agent: Maintains queue of draft posts

3. **API Timeouts:**
   - Rate limiting prevents overload (100 req/15min per IP)
   - Graceful error messages returned to frontend

### 4. Listings & Marketplace (Angel's List)

**Location:** `/backend/src/routes/listings.js`

#### Listing Management
- **Create:** Users post service listings, gigs, or rentals
- **Browse:** Public directory with search and filters
- **Search:** Full-text search by title, description, location
- **Moderation:** Admin approval queue for new listings

**API Endpoints:**
```javascript
POST /api/listings              // Create new listing
GET  /api/listings              // Browse all (paginated, filtered)
GET  /api/listings/:id          // View single listing
PUT  /api/listings/:id          // Update own listing
DELETE /api/listings/:id        // Delete own listing
POST /api/listings/:id/flag     // Report for moderation
```

**Listing Fields:**
- title, description, category, location (city/ZIP)
- price (hourly/fixed), availability
- images (Firebase Storage URLs)
- provider profile reference
- status: active, pending, flagged, expired

### 5. Skill Matching & Sessions (Coach Guru)

**Location:** `/backend/src/routes/skills.js`, `/backend/src/routes/matches.js`

#### Skill Offers/Asks
- **Offer:** Users list skills they can teach
- **Ask:** Users list skills they want to learn
- **Profile:** Each user has skill tags and proficiency levels

#### Matching Algorithm
Scores potential matches based on:
1. **Skills Overlap:** Bidirectional matching (A teaches what B wants, B teaches what A wants)
2. **Schedule Fit:** Availability alignment
3. **Distance/Remote:** Geographic proximity or remote capability
4. **Rating:** Provider reputation score
5. **Price Fit:** Price range compatibility

**Match Score Formula:**
```
score = (skillsOverlap * 0.4) + (scheduleFit * 0.2) + (distanceScore * 0.15) +
        (ratingScore * 0.15) + (priceFit * 0.1)
```

**API Endpoints:**
```javascript
GET  /api/skills                 // Browse all skills
POST /api/skills/offer           // Add skill to teach
POST /api/skills/ask             // Add skill to learn
GET  /api/matches                // Get recommended matches for current user
POST /api/matches/:userId        // Initiate match with specific user
```

### 6. Booking & Payments (Stripe Integration)

**Location:** `/backend/src/routes/payments.js`, `/backend/src/routes/connect.js`

#### Payment Configuration

**GET /api/payments/config**
Returns Stripe publishable key and price IDs for frontend checkout.

**Response:**
```javascript
{
  publishableKey: 'pk_live_...',
  priceIds: {
    guruPass: 'price_...',           // Monthly membership
    skillVerification: 'price_...',  // One-time skill badge
    trustSafety: 'price_...'         // Background check fee
  }
}
```

#### Customer Checkout

**POST /api/payments/create-payment-intent**

Creates Stripe PaymentIntent for service bookings.

**Request:**
```javascript
{
  amount: 5000,  // cents
  currency: 'usd',
  metadata: {
    serviceId, providerId, customerId,
    subdomain, sessionType
  }
}
```

**Response:**
```javascript
{
  clientSecret: 'pi_..._secret_...',
  paymentIntentId: 'pi_...'
}
```

#### Provider Onboarding (Stripe Connect Express)

**POST /api/connect/start**

Initiates Stripe Connect Express onboarding for service providers.

**Response:**
```javascript
{
  accountId: 'acct_...',
  onboardingUrl: 'https://connect.stripe.com/express/onboarding/...'
}
```

**User Flow:**
1. Provider clicks "Get Paid" on dashboard
2. Backend creates Stripe Connect Express account
3. User redirected to Stripe-hosted onboarding
4. After completion, returns to app with account linked

**GET /api/connect/status**

Returns current Connect account status.

**Response:**
```javascript
{
  connected: true,
  accountId: 'acct_...',
  chargesEnabled: true,
  payoutsEnabled: true,
  detailsSubmitted: true
}
```

**GET /api/connect/balance**

Returns provider's Stripe balance with instant payout availability.

**Response:**
```javascript
{
  available: [{ amount: 15000, currency: 'usd' }],
  pending: [{ amount: 5000, currency: 'usd' }],
  instant_available: [{ amount: 12000, currency: 'usd' }],  // ← Instant payout eligible
  connect_reserved: [{ amount: 0, currency: 'usd' }],
  livemode: true
}
```

**POST /api/connect/instant-payout**

Creates instant payout to provider's debit card (Stripe fee: 1.5% + $0.25).

**Request:**
```javascript
{
  amount: 10000,  // cents (must be ≤ instant_available)
  currency: 'usd',
  destination: 'bank_account_id or card_id'  // From Connect account
}
```

**Response:**
```javascript
{
  payoutId: 'po_...',
  amount: 10000,
  net: 9725,  // After 1.5% + $0.25 fee
  status: 'paid',
  arrival_date: 1640000000  // Unix timestamp (instant = ~30 min)
}
```

#### Webhook Handling

**Location:** `/backend/src/routes/stripeWebhooks.js`

**Endpoint:** `POST /api/webhooks/stripe`

**Events Handled:**
- `checkout.session.completed` → Record transaction, update booking status
- `account.updated` → Sync Connect account status
- `payout.paid` → Notify provider of successful payout
- `payout.failed` → Alert provider and support team

**Security:** Stripe signature verification using `STRIPE_WEBHOOK_SECRET`

### 7. Reputation & Reviews

**Location:** `/backend/src/routes/reviews.js`

#### Post-Session Ratings
- **Rating:** 1-5 stars
- **Tags:** Helpful, Professional, Knowledgeable, Punctual, etc.
- **Comments:** Optional written feedback
- **Timing:** Prompted after session completion

#### Reputation Score Impact
- Influences match ranking algorithm (15% weight)
- Displayed on provider profiles
- Required minimum for featured placement
- Low ratings trigger quality review

**API Endpoints:**
```javascript
POST /api/reviews                // Submit review after session
GET  /api/reviews/:providerId    // View provider's reviews
GET  /api/reviews/stats/:userId  // Get aggregated rating stats
```

### 8. Admin & Moderation

**Location:** `/backend/src/routes/admin.js`

#### Moderation Queue
- **Listings:** Approve/deny flagged listings
- **Users:** Review reported accounts
- **Content:** Manual review of AI-generated drafts (if enabled)

#### Document Review
- **Compliance:** KYC/AML for financial services
- **Skill Verification:** Certificate/credential validation
- **Trust & Safety:** Background check review

**API Endpoints:**
```javascript
GET  /api/admin/queue            // Pending moderation items
POST /api/admin/approve/:itemId  // Approve item
POST /api/admin/deny/:itemId     // Deny with reason
GET  /api/admin/agents-status    // Monitor AI agent health
GET  /api/admin/analytics        // Platform-wide metrics
```

#### Agent Monitoring
- Real-time status of news and blog agents
- Error logs and failure alerts
- Manual trigger for agent runs (dev/test)

---

## Monetization Strategy & Integration

### Multi-Layer Revenue Model

#### 1. Affiliate Marketing (Primary Passive Revenue)

**Implementation:** Embedded in AI-generated blog posts

**Process:**
1. **BlogCurationAgent** generates weekly blog posts
2. Agent identifies 2-4 natural product mention opportunities
3. Inserts affiliate links from registered programs:
   - Amazon Associates (products)
   - Course platforms (Udemy, Skillshare, etc.)
   - Tool/software vendors (SaaS affiliate programs)
4. Links are contextual and value-adding (not spammy)
5. Disclosure statement added per FTC guidelines

**Example (cooking.yoohoo.guru):**
```markdown
## Essential Tools for Home Bakers

To get started with sourdough, you'll need a few key items:

1. **Dutch Oven** - [This Lodge 5-quart Dutch oven](#affiliate-link-1)
   provides even heat distribution crucial for artisan loaves.

2. **Digital Scale** - Precision matters in baking.
   [This OXO scale](#affiliate-link-2) is accurate to the gram.

3. **Banneton Basket** - [These rattan proofing baskets](#affiliate-link-3)
   create beautiful scoring patterns.

*Disclosure: This post contains affiliate links. We may earn a
commission if you purchase through these links, at no extra cost to you.*
```

**Revenue Tracking:**
- Affiliate links tagged with subdomain-specific tracking codes
- Dashboard shows clicks and conversions per subdomain
- Monthly reconciliation with affiliate program reports

**Expected Revenue:**
- Assumption: 10,000 monthly blog visitors across all subdomains
- 5% click-through rate on affiliate links = 500 clicks
- 3% conversion rate = 15 purchases
- Average commission $20 = $300/month passive income
- Scales linearly with traffic growth

#### 2. Stripe Payment Processing (Transaction Revenue)

**Implementation:** Service bookings and memberships

**Revenue Streams:**
- **Service Bookings:** Platform fee (10-15% of transaction)
- **Guru Pass:** $9.99/month membership (premium features)
- **Skill Verification:** $29.99 one-time badge fee
- **Trust & Safety:** $49.99 background check fee

**Example Transaction:**
```
Customer books 1-hour cooking lesson: $50
├── Provider receives: $42.50 (85%)
├── Platform fee: $7.50 (15%)
└── Stripe fee: $1.75 (2.9% + $0.30)

Net platform revenue: $7.50 - $1.75 = $5.75
```

**Volume Projections:**
- 100 bookings/month @ $50 avg = $5,000 GMV
- Platform fee $750/month
- After Stripe fees ≈ $575/month net

#### 3. Stripe Connect Payouts (Instant Payout Fees)

**Implementation:** Providers can instant-cash-out their earnings

**Fee Structure:**
- Standard payout (3-5 days): Free
- Instant payout (30 min): 1.5% + $0.25

**Revenue Model:**
- Many providers prefer instant cash for convenience
- 50% opt for instant payout = 50 transactions/month
- Average payout $100
- Fee per transaction: $1.75
- Monthly revenue: $87.50

**User Benefit:** Liquidity and convenience justify fee

#### 4. Lead Generation (Service Sales)

**Implementation:** Lead capture forms on all subdomain pages

**Forms Appear On:**
- Blog post pages (CTA at end of article)
- News article pages (sidebar widget)
- Service directory pages
- Homepage hero sections

**Lead Flow:**
1. User reads blog post (e.g., "10 Guitar Techniques for Beginners")
2. CTA: "Want personalized lessons? Get a free consultation"
3. User submits: name, email, phone, service interest
4. Lead stored in Firestore (`gurus/{subdomain}/leads/`)
5. Notification sent to subdomain service providers
6. Provider contacts lead within 24 hours
7. Conversion tracked in analytics

**Monetization:**
- **Service Conversion:** 10% of leads convert to bookings
- **Email Marketing:** Build email list for promotions
- **Lead Selling:** Potentially sell leads to third-party providers (future)

**Example:**
- 1,000 monthly blog visitors
- 5% lead capture rate = 50 leads
- 10% conversion to booking = 5 bookings @ $50
- Platform fee 15% = $37.50 revenue

#### 5. Advertising (Future Revenue Stream)

**Planned Implementation:** Display ads on high-traffic subdomain pages

**Ad Placements:**
- Sidebar on blog posts
- Between paragraphs in long-form content
- Banner ads on news feed pages

**Expected CPM:** $5-10 per 1,000 impressions

**Considerations:**
- Must not interfere with affiliate links
- Should complement content (native ads preferred)
- A/B test impact on user experience

### Content → Monetization Integration Summary

```
AI Agent Generates Content
    ↓
Content Stored in Firestore (with affiliate links)
    ↓
API Serves Content to Domain Pages
    ↓
User Visits Page (SEO traffic)
    ↓
User Engages with Content
    ├── Clicks Affiliate Link → Commission
    ├── Submits Lead Form → Service Sale → Platform Fee
    ├── Books Service → Stripe Payment → Platform Fee
    └── Shares Content → More Traffic → More Conversions
```

**Key Insight:** Agent-curated content is the **top-of-funnel** that drives all downstream monetization.

---

## Complete Page Inventory (All 27 Domains)

### Hub Pages (yoohoo.guru)

**Public Pages:**
- `/` - Homepage with global hero, featured subdomains, recent content
- `/blog` - Aggregated blog posts from all subdomains
- `/news` - Aggregated news feed across all categories
- `/search` - Global search across all subdomains
- `/about` - Platform mission, team, values
- `/contact` - Contact form and support links
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/sitemap.xml` - SEO sitemap

**Authentication Pages:**
- `/login` - Email and Google OAuth login
- `/register` - Email registration with profile setup
- `/forgot-password` - Password reset flow
- `/verify-email` - Email verification after signup

**User Dashboard:**
- `/dashboard` - User home with personalized recommendations
- `/dashboard/profile` - Edit profile and preferences
- `/dashboard/bookings` - Upcoming and past sessions
- `/dashboard/earnings` - Provider earnings and payouts (Connect users)
- `/dashboard/messages` - Communication with matches
- `/dashboard/settings` - Account settings and preferences

### Angel's List Pages (angel.yoohoo.guru)

**Public Pages:**
- `/` - Homepage with featured listings and search
- `/listings` - Browse all active listings (paginated)
- `/listings/:id` - Individual listing detail page
- `/providers` - Directory of service providers
- `/providers/:id` - Provider profile with reviews
- `/about` - About Angel's List service
- `/how-it-works` - Onboarding guide for users

**Authenticated Pages:**
- `/post-listing` - Create new listing form
- `/my-listings` - Manage own listings
- `/my-listings/:id/edit` - Edit listing

### Coach Guru Pages (coach.yoohoo.guru)

**Public Pages:**
- `/` - Homepage with featured skills and teachers
- `/skills` - Browse all available skills
- `/teachers` - Directory of skill teachers
- `/teachers/:id` - Teacher profile with credentials
- `/learners` - Directory of active learners
- `/how-it-works` - Platform guide
- `/about` - About Coach Guru

**Authenticated Pages:**
- `/teach` - List skills you can teach
- `/learn` - List skills you want to learn
- `/matches` - View recommended matches
- `/matches/:id` - Match detail and booking
- `/sessions` - Upcoming and past sessions
- `/book/:teacherId` - Book a session

### Hero Gurus Pages (heroes.yoohoo.guru)

**Public Pages:**
- `/` - Homepage with featured volunteer opportunities
- `/opportunities` - Browse volunteer listings
- `/opportunities/:id` - Opportunity detail page
- `/organizations` - Partner non-profits directory
- `/impact` - Impact metrics and stories
- `/about` - About Hero Gurus mission

**Authenticated Pages:**
- `/volunteer` - Sign up to volunteer
- `/my-opportunities` - Manage volunteered opportunities
- `/hours` - Track volunteer hours
- `/badges` - Earned volunteer badges

### Subdomain Pages (All 24 Subdomains)

Each subdomain (e.g., cooking.yoohoo.guru, coding.yoohoo.guru, etc.) has:

**Public Pages:**
- `/` - Subdomain homepage
  - Hero section with Guru character
  - Featured blog posts (2-3 posts)
  - Recent news articles (4-6 articles)
  - Service offerings CTA
  - Lead capture form
  - Newsletter signup

- `/blog` - Blog post archive
  - Paginated list (12 posts per page)
  - Filter by tag, category
  - Search functionality
  - Sidebar with popular posts, tags

- `/blog/:slug` - Individual blog post
  - Full article content with affiliate links
  - Author bio (Guru character)
  - Related posts (3-4 based on tags)
  - Comments section (optional)
  - Lead capture CTA at bottom
  - Social share buttons

- `/news` - News feed page
  - List of curated news articles (10 most recent)
  - Morning and afternoon sections
  - Links to original sources
  - Sidebar with trending topics

- `/services` - Service directory
  - List of available services for this subdomain
  - Provider profiles
  - Pricing information
  - Booking CTAs

- `/services/:id` - Service detail page
  - Service description
  - Provider credentials
  - Pricing and availability
  - Reviews and ratings
  - Book now CTA

- `/about` - About this subdomain
  - Guru character introduction
  - Mission and focus areas
  - Featured providers
  - Contact information

**Authenticated Pages:**
- `/offer-service` - List a service in this category
- `/dashboard` - Subdomain-specific provider dashboard
  - Leads from this subdomain
  - Analytics (views, clicks, conversions)
  - Content performance

### Admin Pages (admin.yoohoo.guru or /admin)

**Dashboard:**
- `/admin` - Overview dashboard
  - Platform metrics (users, bookings, revenue)
  - Recent activity feed
  - System health indicators
  - Agent status (news & blog)

**Content Management:**
- `/admin/content/posts` - Manage all blog posts
- `/admin/content/news` - Review curated news
- `/admin/content/drafts` - Review AI-generated drafts (if manual approval enabled)
- `/admin/content/subdomains` - Configure subdomain settings

**User Management:**
- `/admin/users` - Browse all users
- `/admin/users/:id` - User detail and actions
- `/admin/providers` - Provider directory with verification status
- `/admin/bans` - Manage banned users

**Moderation Queue:**
- `/admin/queue` - Pending items for review
- `/admin/queue/listings` - Flagged listings
- `/admin/queue/users` - Reported users
- `/admin/queue/reviews` - Disputed reviews

**AI Agent Management:**
- `/admin/agents` - Agent status and controls
- `/admin/agents/news` - News agent configuration
- `/admin/agents/blog` - Blog agent configuration
- `/admin/agents/logs` - Agent execution logs

**Analytics:**
- `/admin/analytics` - Platform-wide analytics
- `/admin/analytics/revenue` - Revenue dashboard
- `/admin/analytics/content` - Content performance
- `/admin/analytics/affiliates` - Affiliate tracking

**Financial:**
- `/admin/finance/transactions` - All Stripe transactions
- `/admin/finance/payouts` - Provider payouts
- `/admin/finance/revenue` - Revenue reports

---

## Data Model (Complete)

### Firebase Firestore Collections

#### **users** (Firebase Auth + Firestore)
```javascript
{
  uid: string,                    // Firebase Auth UID
  email: string,
  displayName: string,
  avatar: string,                 // Storage URL
  bio: string,
  location: {
    city: string,
    state: string,
    zip: string,
    coordinates: { lat, lng }
  },
  role: 'user' | 'provider' | 'admin',
  status: 'active' | 'suspended' | 'banned',
  createdAt: timestamp,
  updatedAt: timestamp,
  emailVerified: boolean,
  phoneVerified: boolean,

  // Provider-specific
  stripeConnectId: string,        // For providers
  stripeCustomerId: string,       // For customers
  connectOnboarded: boolean,
  payoutsEnabled: boolean,

  // Preferences
  preferences: {
    emailNotifications: boolean,
    smsNotifications: boolean,
    newsletter: boolean,
    favoriteSubdomains: string[]
  },

  // Metrics
  stats: {
    totalBookings: number,
    totalEarnings: number,
    averageRating: number,
    reviewCount: number
  }
}
```

#### **gurus/{subdomain}/** (Subdocument Collections)

**gurus/{subdomain}/news/**
```javascript
{
  id: string,
  title: string,
  summary: string,
  url: string,                    // Original article URL
  source: string,                 // Publisher name
  publishedAt: timestamp,         // Original publish date
  curatedAt: timestamp,           // When agent added it
  subdomain: string,
  timeSlot: 'morning' | 'afternoon',
  aiGenerated: boolean,
  tags: string[],
  metadata: {
    subdomainTopic: string,
    region: 'US',
    date: string,
    timeSlot: string
  }
}
```

**gurus/{subdomain}/posts/**
```javascript
{
  id: string,
  slug: string,                   // URL-friendly slug
  title: string,
  content: string,                // Markdown or HTML with affiliate links
  excerpt: string,
  author: string,                 // Guru character name
  publishedAt: timestamp,
  updatedAt: timestamp,
  status: 'draft' | 'published' | 'archived',
  subdomain: string,
  category: string,
  tags: string[],

  seo: {
    metaTitle: string,            // ≤60 chars
    metaDescription: string,      // ≤160 chars
    keywords: string[],
    ogImage: string
  },

  affiliateLinks: [               // MONETIZATION TRACKING
    {
      url: string,
      product: string,
      placement: string,          // Where in article
      description: string
    }
  ],

  featured: boolean,
  viewCount: number,
  shareCount: number,
  leadConversions: number         // Tracked lead form submissions
}
```

**gurus/{subdomain}/services/**
```javascript
{
  id: string,
  providerId: string,             // References users collection
  title: string,
  description: string,
  category: string,
  subdomain: string,

  pricing: {
    type: 'hourly' | 'fixed' | 'package',
    amount: number,               // cents
    currency: 'usd'
  },

  availability: {
    remote: boolean,
    inPerson: boolean,
    locations: string[],
    schedule: {
      monday: { available: boolean, hours: string[] },
      tuesday: { available: boolean, hours: string[] },
      // ... rest of week
    }
  },

  images: string[],               // Storage URLs
  displayOrder: number,
  featured: boolean,
  status: 'active' | 'paused' | 'inactive',

  stats: {
    viewCount: number,
    bookingCount: number,
    averageRating: number
  },

  createdAt: timestamp,
  updatedAt: timestamp
}
```

**gurus/{subdomain}/leads/**
```javascript
{
  id: string,
  name: string,
  email: string,
  phone: string,
  service: string,                // Service interested in
  message: string,

  subdomain: string,
  source: string,                 // 'blog-post', 'news-page', 'homepage', etc.
  sourceId: string,               // Blog post slug if from blog

  status: 'new' | 'contacted' | 'converted' | 'closed',
  assignedTo: string,             // Provider UID

  metadata: {
    timestamp: timestamp,
    ip: string,
    userAgent: string,
    referrer: string
  },

  conversion: {
    converted: boolean,
    bookingId: string,
    revenue: number
  }
}
```

**gurus/{subdomain}/stats/**
```javascript
{
  subdomain: string,
  date: string,                   // YYYY-MM-DD

  content: {
    totalPosts: number,
    totalNews: number,
    publishedToday: number
  },

  traffic: {
    pageViews: number,
    uniqueVisitors: number,
    blogViews: number,
    newsViews: number,
    serviceViews: number
  },

  monetization: {
    affiliateClicks: number,
    leadSubmissions: number,
    serviceBookings: number,
    revenue: number
  },

  engagement: {
    avgTimeOnPage: number,
    bounceRate: number,
    shareCount: number
  }
}
```

#### **leads/** (Global Collection)
Duplicate of subdomain leads for cross-subdomain analytics
```javascript
{
  ...same fields as gurus/{subdomain}/leads/
}
```

#### **analytics/post-views/** (View Tracking)
```javascript
{
  id: string,
  subdomain: string,
  postId: string,
  slug: string,
  timestamp: timestamp,
  ip: string,
  userAgent: string,
  referrer: string,
  sessionDuration: number         // seconds
}
```

#### **bookings/**
```javascript
{
  id: string,
  customerId: string,
  providerId: string,
  serviceId: string,
  subdomain: string,

  type: 'angel-listing' | 'coach-session' | 'hero-volunteer',

  schedule: {
    date: string,
    startTime: string,
    endTime: string,
    timezone: string,
    location: string | 'remote'
  },

  payment: {
    stripePaymentIntentId: string,
    amount: number,
    platformFee: number,
    stripeFee: number,
    providerEarnings: number,
    currency: 'usd',
    status: 'pending' | 'completed' | 'refunded'
  },

  status: 'pending' | 'confirmed' | 'completed' | 'cancelled',

  review: {
    submitted: boolean,
    reviewId: string
  },

  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### **reviews/**
```javascript
{
  id: string,
  bookingId: string,
  providerId: string,
  customerId: string,
  subdomain: string,

  rating: number,                 // 1-5
  tags: string[],                 // 'Helpful', 'Professional', etc.
  comment: string,

  response: {                     // Provider can respond
    text: string,
    timestamp: timestamp
  },

  helpful: {                      // Other users vote
    yes: number,
    no: number
  },

  status: 'active' | 'flagged' | 'hidden',
  createdAt: timestamp
}
```

#### **listings/** (Angel's List)
```javascript
{
  id: string,
  providerId: string,
  title: string,
  description: string,
  category: string,

  location: {
    city: string,
    state: string,
    zip: string,
    coordinates: { lat, lng }
  },

  pricing: {
    type: 'hourly' | 'fixed' | 'negotiable',
    amount: number
  },

  images: string[],
  availability: string,

  status: 'pending' | 'active' | 'flagged' | 'expired',

  stats: {
    views: number,
    inquiries: number,
    bookings: number
  },

  expiresAt: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### **skills/**
```javascript
{
  id: string,
  name: string,
  category: string,
  subdomain: string,              // Primary subdomain for this skill
  description: string,

  stats: {
    teacherCount: number,
    learnerCount: number,
    sessionCount: number
  }
}
```

#### **user_skills/**
```javascript
{
  id: string,
  userId: string,
  skillId: string,
  type: 'offer' | 'ask',          // Teaching or learning

  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert',

  verified: boolean,              // If skill verification purchased
  verificationDoc: string,        // Storage URL to certificate

  pricing: number,                // For offers
  availability: object,

  status: 'active' | 'paused',
  createdAt: timestamp
}
```

#### **matches/**
```javascript
{
  id: string,
  user1Id: string,
  user2Id: string,

  matchScore: number,             // 0-100
  scoreBreakdown: {
    skillsOverlap: number,
    scheduleFit: number,
    distanceScore: number,
    ratingScore: number,
    priceFit: number
  },

  status: 'suggested' | 'contacted' | 'booked' | 'expired',

  skills: {
    user1Teaches: string[],
    user1Learns: string[],
    user2Teaches: string[],
    user2Learns: string[]
  },

  createdAt: timestamp,
  expiresAt: timestamp
}
```

#### **transactions/**
```javascript
{
  id: string,
  type: 'booking' | 'membership' | 'verification' | 'trust-safety' | 'instant-payout',

  stripePaymentIntentId: string,
  stripePayoutId: string,

  amount: number,
  fees: {
    stripe: number,
    platform: number,
    instant: number               // For instant payouts
  },

  userId: string,
  providerId: string,
  bookingId: string,

  status: 'pending' | 'succeeded' | 'failed' | 'refunded',

  metadata: {
    subdomain: string,
    serviceId: string,
    sessionType: string
  },

  timestamp: timestamp
}
```

#### **disputes/**
```javascript
{
  id: string,
  bookingId: string,
  reporterId: string,
  reportedId: string,

  reason: string,
  description: string,
  evidence: string[],             // Storage URLs to screenshots/docs

  status: 'open' | 'investigating' | 'resolved' | 'closed',
  resolution: string,

  adminNotes: string,
  resolvedBy: string,             // Admin UID
  resolvedAt: timestamp,

  createdAt: timestamp
}
```

---

## SEO & Metadata

### Global SEO Strategy

**Primary Goals:**
1. Rank for niche skill-based queries (e.g., "learn sourdough baking")
2. Capture local service searches (e.g., "guitar lessons near me")
3. Build authority through consistent content publishing

### Page-Level SEO Implementation

**Homepage (yoohoo.guru):**
```html
<title>YooHoo Guru - Find Local Experts & Learn New Skills</title>
<meta name="description" content="Connect with local experts for skill-sharing, services, and learning. Browse 24 categories from cooking to coding. Book sessions, read expert guides." />
<meta name="keywords" content="skill sharing, local services, online learning, expert marketplace" />
<link rel="canonical" href="https://yoohoo.guru/" />
```

**Subdomain Homepage (e.g., cooking.yoohoo.guru):**
```html
<title>Cooking Guru - Culinary Tips, Recipes & Cooking Lessons</title>
<meta name="description" content="Master culinary arts with expert cooking lessons, daily recipes, baking guides, and chef tips. Connect with local cooking instructors." />
<meta name="keywords" content="cooking lessons, culinary arts, baking classes, recipe ideas, chef training" />
<link rel="canonical" href="https://cooking.yoohoo.guru/" />
```

**Blog Post Pages:**
```html
<title>[Post Meta Title from Firestore - ≤60 chars]</title>
<meta name="description" content="[Post Meta Description - ≤160 chars]" />
<meta name="keywords" content="[Comma-separated keywords from post]" />
<link rel="canonical" href="https://{subdomain}.yoohoo.guru/blog/{slug}" />

<!-- Open Graph -->
<meta property="og:title" content="[Post Title]" />
<meta property="og:description" content="[Post Excerpt]" />
<meta property="og:image" content="[Post Featured Image]" />
<meta property="og:url" content="https://{subdomain}.yoohoo.guru/blog/{slug}" />
<meta property="og:type" content="article" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="[Post Title]" />
<meta name="twitter:description" content="[Post Excerpt]" />
<meta name="twitter:image" content="[Post Featured Image]" />

<!-- Schema.org Article Markup -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "[Post Title]",
  "description": "[Post Excerpt]",
  "author": {
    "@type": "Person",
    "name": "[Guru Character Name]"
  },
  "datePublished": "[ISO Date]",
  "dateModified": "[ISO Date]",
  "publisher": {
    "@type": "Organization",
    "name": "YooHoo Guru",
    "logo": {
      "@type": "ImageObject",
      "url": "https://yoohoo.guru/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://{subdomain}.yoohoo.guru/blog/{slug}"
  },
  "keywords": "[Comma-separated keywords]"
}
</script>
```

**Service Pages:**
```html
<!-- Schema.org Service Markup -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "[Service Title]",
  "provider": {
    "@type": "Person",
    "name": "[Provider Name]",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "[Average Rating]",
      "reviewCount": "[Review Count]"
    }
  },
  "areaServed": "[Location]",
  "offers": {
    "@type": "Offer",
    "price": "[Price]",
    "priceCurrency": "USD"
  }
}
</script>
```

### XML Sitemap

**Location:** `/sitemap.xml`

**Structure:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Hub Pages -->
  <url>
    <loc>https://yoohoo.guru/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Subdomain Homepages -->
  <url>
    <loc>https://cooking.yoohoo.guru/</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>

  <!-- Blog Posts (dynamically generated) -->
  <url>
    <loc>https://cooking.yoohoo.guru/blog/[slug]</loc>
    <lastmod>[updatedAt]</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Service Pages -->
  <url>
    <loc>https://cooking.yoohoo.guru/services/[id]</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

### robots.txt

**Production:**
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/

Sitemap: https://yoohoo.guru/sitemap.xml
```

**Staging:**
```
User-agent: *
Disallow: /
```

---

## Accessibility & Performance

### Accessibility Standards (WCAG 2.1 AA Compliance)

**Color Contrast:**
- All text meets 4.5:1 contrast ratio minimum
- Large text (18pt+) meets 3:1 ratio
- UI controls meet 3:1 ratio
- Theme colors validated with WebAIM Contrast Checker

**Keyboard Navigation:**
- All interactive elements accessible via Tab
- Visible focus indicators (2px outline)
- Skip navigation links on all pages
- Logical tab order throughout

**Screen Reader Support:**
- Semantic HTML5 elements (`<nav>`, `<main>`, `<article>`, etc.)
- ARIA labels on icon buttons and links
- Alt text on all images (descriptive, not keyword-stuffed)
- Form labels properly associated with inputs

**Forms:**
- Clear error messages
- Inline validation feedback
- Required fields marked with asterisk and aria-required
- Submit buttons clearly labeled

**Testing:**
- Axe DevTools automated scan (0 violations target)
- Manual testing with VoiceOver (macOS) and NVDA (Windows)
- Keyboard-only navigation testing

### Performance Targets

**Core Web Vitals:**
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

**Implementation Strategies:**

**Image Optimization:**
- Next.js Image component for automatic optimization
- WebP format with fallback
- Lazy loading for below-fold images
- Responsive image sizes
- CDN delivery via Cloudflare

**Code Splitting:**
- Route-based code splitting (Next.js automatic)
- Dynamic imports for heavy components
- Separate vendor bundles
- Tree shaking to eliminate dead code

**Caching:**
- Static assets: 1 year cache header
- API responses: 3-5 minute cache (as documented)
- CDN edge caching for global distribution
- Browser cache leveraging

**Font Loading:**
- Self-hosted fonts (no external requests)
- `font-display: swap` to prevent FOIT
- Preload critical fonts

**Mobile Performance:**
- Mobile-first design
- Touch targets minimum 44x44px
- Reduced image sizes for mobile
- Progressive enhancement approach

**Monitoring:**
- Lighthouse CI in GitHub Actions
- Real User Monitoring (RUM) via Analytics
- Performance budget enforcement (500kb JS max)

---

## Content & UX Guidelines

### Tone & Voice

**Brand Personality:**
- **Friendly:** Approachable, warm, encouraging
- **Professional:** Knowledgeable, reliable, trustworthy
- **Empowering:** Helps users achieve their goals
- **Authentic:** Honest, transparent, human

**Writing Style:**
- 8th-10th grade reading level (accessible to all)
- Short paragraphs (2-4 sentences max)
- Active voice preferred
- Second person ("you") for engagement
- Contractions allowed for friendliness

**Guru Character Voice:**
Each subdomain has a Guru character with consistent personality:
- **Chef Guru** (cooking): Passionate, detail-oriented, warm
- **Code Guru** (coding): Analytical, helpful, patient
- **Fit Guru** (fitness): Motivational, energetic, supportive

### Call-to-Action (CTA) Patterns

**Primary CTAs by Page:**

**Hub Homepage:**
- "Find Your Guru" (subdomain directory)
- "Post a Job" (Angel's List)
- "Learn a Skill" (Coach Guru)
- "Volunteer" (Hero Gurus)

**Subdomain Homepage:**
- "Read Latest Articles" (blog section)
- "Browse Services" (service directory)
- "Get a Free Consultation" (lead form)

**Blog Post Pages:**
- "Want personalized help? Connect with a [subdomain] expert" (lead form)
- "Explore More [Category] Tips" (related posts)
- "Share this article" (social buttons)

**Service Pages:**
- "Book Now" (booking flow)
- "Contact Provider" (messaging)
- "View Reviews" (review section)

### Safety & Disclaimers

**Marketplace Disclaimer (at checkout):**
```
YooHoo Guru is a marketplace connecting independent service providers
with customers. We facilitate payments but are not responsible for
service quality or outcomes. All sessions are subject to our Terms
of Service and Dispute Resolution Policy.
```

**Waiver Language:**
```
By booking this session, you acknowledge the inherent risks and
agree to hold YooHoo Guru harmless for any injuries or damages.
Providers are independent contractors, not employees.
```

**Dispute Window:**
- Customers have 48 hours after session completion to file a dispute
- Disputes reviewed within 5 business days
- Refund policy: Full refund for provider no-show, partial for quality issues

**Trust & Safety Features:**
- Provider verification badges ($29.99 optional)
- Background check badges ($49.99 optional)
- Review system with verified booking badges
- Report/flag functionality on all content

---

## Observability & Monitoring

### Error Logging

**Backend:**
- Winston logger with multiple transports
- Error levels: error, warn, info, debug
- Structured logging with context (userId, requestId, etc.)
- Log aggregation to cloud service (LogRocket, Sentry, etc.)

**Frontend:**
- React Error Boundaries for graceful failures
- Automatic error reporting to Sentry
- User-facing error messages (friendly, actionable)
- Console errors suppressed in production

### System Health Monitoring

**Endpoints:**

`GET /health` - Public health check
```javascript
{
  status: 'OK',
  timestamp: Date.now(),
  uptime: process.uptime(),
  curationAgents: {
    newsAgent: { status: 'running', lastRun: timestamp },
    blogAgent: { status: 'running', lastRun: timestamp }
  }
}
```

`GET /api/admin/system-status` - Detailed system status (admin only)
```javascript
{
  database: { connected: true, latency: 50 },
  stripe: { connected: true },
  firebase: { connected: true },
  agents: {
    newsAgent: { status, lastRun, nextRun, errorCount },
    blogAgent: { status, lastRun, nextRun, errorCount }
  },
  performance: {
    avgResponseTime: 120,
    requestsPerMinute: 450,
    errorRate: 0.02
  }
}
```

### Analytics Tracking

**Events Tracked:**
- Page views (all pages)
- Blog post views (with slug and subdomain)
- Affiliate link clicks (with product and subdomain)
- Lead form submissions (with source)
- Service bookings (with revenue)
- User registrations (with source)
- Search queries (with results count)

**Dashboard Metrics:**
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Content engagement (avg time on page)
- Conversion funnel (visit → lead → booking)
- Revenue by subdomain
- Affiliate commission by subdomain

---

## Deployment Architecture

### Infrastructure

**Frontend (Vercel):**
- **Apps:** 25+ Next.js apps in monorepo
- **Build Command:** `pnpm run build`
- **Output:** Static + serverless functions
- **Domains:** yoohoo.guru, *.yoohoo.guru
- **Environment Variables:**
  - `NEXT_PUBLIC_API_URL`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `NEXT_PUBLIC_FIREBASE_CONFIG`

**Backend (Railway):**
- **App:** Node.js/Express API
- **Port:** 3001
- **Domain:** api.yoohoo.guru
- **Environment Variables:**
  - All keys from `appConfig.js`
  - Stripe, Firebase, OpenRouter credentials
  - JWT secrets
- **Auto-deploy:** Push to `main` branch

**Database (Firebase):**
- **Firestore:** NoSQL document database
- **Auth:** User authentication
- **Storage:** File uploads (avatars, service images)
- **Security Rules:** Role-based access control

**CDN (Cloudflare):**
- **Caching:** Static assets and edge caching
- **SSL:** Wildcard certificate for *.yoohoo.guru
- **DDoS Protection:** Built-in
- **Analytics:** Web analytics integration

### CI/CD Pipeline

**GitHub Actions Workflow:**
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Install dependencies
      - Run linter
      - Run tests
      - Lighthouse CI (performance budget)

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - Deploy to Vercel (automatic)

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - Deploy to Railway (automatic)
```

### Environment Management

**Staging:**
- `staging.yoohoo.guru`
- Separate Firebase project
- Stripe test mode
- `robots.txt` blocks indexing

**Production:**
- `yoohoo.guru` + subdomains
- Production Firebase project
- Stripe live mode
- Full monitoring enabled

---

## Definition of Done

### Platform-Wide Requirements

✅ **Infrastructure:**
- [ ] All 27 domains (hub + 3 products + 24 subdomains) live and accessible
- [ ] Wildcard DNS and SSL configured
- [ ] Backend API deployed and healthy
- [ ] Firebase Firestore collections created
- [ ] Stripe account configured (live mode)

✅ **Content System:**
- [ ] News Curation Agent running 2x daily
- [ ] Blog Curation Agent running weekly
- [ ] At least 10 blog posts published per subdomain
- [ ] News feed populated for all subdomains
- [ ] Agent health monitoring dashboard functional

✅ **Monetization:**
- [ ] Affiliate links working in blog posts
- [ ] Tracking codes active for affiliate programs
- [ ] Lead capture forms functional on all subdomains
- [ ] Leads stored in Firestore and accessible to providers
- [ ] Stripe payment flow working end-to-end
- [ ] Stripe Connect onboarding functional
- [ ] Instant payouts enabled for providers

✅ **Core Features:**
- [ ] User registration and login working
- [ ] Profile creation and editing functional
- [ ] Angel's List: Post, browse, book listings
- [ ] Coach Guru: Skill matching and booking working
- [ ] Hero Gurus: Volunteer opportunities browsable
- [ ] Review system functional
- [ ] Admin moderation queue operational

✅ **Quality Assurance:**
- [ ] No console errors on key pages
- [ ] Lighthouse score ≥90 on mobile and desktop
- [ ] Axe accessibility scan shows 0 violations
- [ ] All forms validate properly
- [ ] Error messages user-friendly
- [ ] Responsive design tested on mobile, tablet, desktop

✅ **SEO & Performance:**
- [ ] Sitemap.xml generated and submitted
- [ ] robots.txt configured correctly per environment
- [ ] Meta tags present on all pages
- [ ] Open Graph tags on blog posts
- [ ] Schema markup on service and blog pages
- [ ] Core Web Vitals meet targets (LCP <2.5s, FID <100ms, CLS <0.1)

✅ **Documentation:**
- [ ] Site specification complete (this document)
- [ ] API documentation available
- [ ] Admin user guide written
- [ ] Provider onboarding guide published
- [ ] Content guidelines documented (subdomain-content-spec.md)

✅ **Monitoring:**
- [ ] Error logging active (Sentry or equivalent)
- [ ] Analytics tracking configured
- [ ] Agent status monitoring dashboard
- [ ] Uptime monitoring configured
- [ ] Performance monitoring active

---

## Known Issues & Recent Fixes

### Middleware Routing (FIXED - October 2025)

**Issue:**
- Initial middleware configuration used a SUBDOMAIN_MAP that suggested multi-app architecture
- Caused confusion between expected vs actual routing behavior
- Subdomain pages not appearing in production deployment

**Root Cause:**
- Middleware was designed for multi-app monorepo (apps/angel/, apps/coach/, etc.)
- Actual implementation uses single-app architecture (all pages in apps/main/pages/_apps/)
- vercel.json contained conflicting redirect rules for /_apps/* paths

**Fix Applied:**
1. **Middleware Refactored** (apps/main/middleware.ts)
   - Replaced SUBDOMAIN_MAP with VALID_SUBDOMAINS Set
   - Simplified routing logic for single-app architecture
   - Added debug headers in development mode
   - Improved subdomain validation and error handling

2. **vercel.json Cleaned Up**
   - Removed conflicting /_apps/ rewrite rules
   - Removed /dashboard redirect that interfered with middleware
   - Streamlined API proxy configuration

3. **Architecture Documentation Updated**
   - Site spec now accurately reflects single-app architecture
   - Clear documentation of middleware rewrite mechanism
   - Updated technology stack versions

**Deployment Notes:**
- After these fixes, trigger fresh Vercel deployment to clear cache
- All subdomain pages should now properly serve via middleware rewrites
- Monitor x-middleware-rewrite headers in development for debugging

### Styling System Migration (IN PROGRESS)

**Current State:**
- Converting all pages to Orbitron design system
- Coach subdomain: ✅ Converted
- Login/Signup/Dashboard: ✅ Converted
- 24 content subdomains: 🚧 Pending conversion
- Legacy styling still present in art, coding, fitness, etc.

**Next Steps:**
- Apply Orbitron theme to remaining subdomain pages
- Create reusable subdomain page template
- Update NewsSection and BlogList components with Orbitron styling

---

## Future Enhancements (Post-MVP)

### Short-Term (3-6 months)
- Display advertising integration (Google AdSense or similar)
- Advanced affiliate reporting dashboard
- Email marketing automation (Mailchimp/SendGrid)
- Push notifications for bookings and messages
- Mobile app (React Native)

### Medium-Term (6-12 months)
- Video content integration (YouTube embed + native hosting)
- Podcast hosting per subdomain
- Advanced AI recommendations (personalized content)
- Multi-language support (Spanish initially)
- API for third-party integrations

### Long-Term (12+ months)
- White-label platform for other niche communities
- Enterprise plans for organizations
- Advanced analytics ML models
- Live streaming for sessions
- Cryptocurrency payment option

---

## Appendix

### Related Documentation
- **Subdomain Content Spec:** `/docs/subdomain-content-spec.md` - Comprehensive AI agent guidelines
- **Architecture:** `/docs/ARCHITECTURE.md` - Technical architecture details
- **API Reference:** `/docs/API.md` - Complete API endpoint documentation (if exists)
- **Admin Guide:** `/docs/ADMIN_GUIDE.md` - Admin dashboard user guide (if exists)

### Configuration Files
- **Subdomain Config:** `/backend/src/config/subdomains.js` - All 24 subdomain configurations
- **App Config:** `/backend/src/config/appConfig.js` - Environment variables and settings
- **Firebase Config:** `/backend/src/config/firebase.js` - Firebase initialization

### Key Backend Routes
- **Gurus:** `/backend/src/routes/gurus.js` - Subdomain content delivery
- **Payments:** `/backend/src/routes/payments.js` - Stripe checkout
- **Connect:** `/backend/src/routes/connect.js` - Stripe Connect onboarding
- **Webhooks:** `/backend/src/routes/stripeWebhooks.js` - Stripe event handling
- **Curation Agents:** `/backend/src/agents/curationAgents.js` - AI content generation

### Contact & Support
- **Legal:** legal@yoohoo.guru
- **Privacy:** privacy@yoohoo.guru
- **Support:** support@yoohoo.guru

---

**Last Updated:** October 22, 2025
**Version:** 2.0 (Complete Specification)
**Status:** Production-Ready
