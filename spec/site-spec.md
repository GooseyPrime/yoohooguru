# YooHoo Guru — Site Specification (MVP, Stripe-only)

## Brand & Architecture
- Hub: yoohoo.guru — landing, global search, blog/CMS
- Angel’s List: rentals & small jobs (path /angels-list or subdomain angel.yoohoo.guru)
- Coach Yeti: coach.yoohoo.guru — structured skill-swap sessions
- Optional thematic subdomains (e.g., cooking.yoohoo.guru)
- Wildcard DNS/SSL enabled for subdomain routing
- Nested Subdomains: Each persona/product has its own subdomain (e.g., angel.yoohoo.guru, coach.yoohoo.guru, cooking.yoohoo.guru). 
- Subdomain routing is handled by backend middleware (req.subdomains[0]) and theming logic in frontend utils.


## Core Features (MVP)
1) Authentication & Profiles
   - Email login (Google optional)
   - Profile: avatar, city/ZIP, short bio

2) Listings (Angel’s List)
   - Post, browse, search, moderation queue

3) Skill Offers/Asks (Coach Yeti)
   - Users list what they teach / want to learn
   - Basic matchmaking to other users

4) Matching
   - Score: skills overlap, schedule fit, distance/remote, rating, price fit

5) Booking & Payments — **Stripe only**
   - Pricing & publishable key served by backend: **GET `/api/payments/config`**
   - Customer checkout uses Stripe (Price IDs from env)
   - Provider onboarding/payouts via **Stripe Connect Express**
     - Start onboarding: `/api/connect/start`
     - Express login link: `/api/connect/login-link`
     - Balance/payouts endpoints as in repo (`connect.js`, `payouts.js`)
   - Webhooks handled at `/api/webhooks/stripe` (see `stripeWebhooks.js`)
   - No internal “credits” or wallet/escrow in MVP

6) Reputation
   - Ratings + tags post-session; influences match rank

7) Admin
   - Approve/deny flagged items
   - Document review per compliance rules

## Content & AI Publishing
- Blog/News: Public content hub at yoohoo.guru/blog
- Admin UI: Blog editor screen exists; posts stored in Firestore/DB
- AI Agent: Backend route + cron job (newsJob.js) can generate draft blog entries and news updates
  - Drafts must be human-reviewed before publish
  - Cron schedule disabled in MVP, but logic present
- MVP Goal: Ensure AI-generated blog drafts are stored and viewable in Admin, even if publish is manual

## Data Model (starter)
- users, profiles, skills, user_skills
- offers, asks, matches, bookings
- transactions (Stripe IDs for charges/payouts)
- reviews, disputes
- subdomains (for theming/branding)

## SEO & Metadata
- <title> 50–60 chars, unique
- <meta name="description"> 140–160 chars
- Open Graph + Twitter cards
- Canonical URLs, XML sitemaps
- robots.txt present (staging: no-index)

## Accessibility & Performance
- Axe-clean basics, proper alt text, AA contrast, visible focus styles
- Reasonable CLS on mobile
- Lazy-load heavy media

## Content & UX
- Tone: friendly, professional; mascots are a light touch
- Clear CTAs: “Post a job” (Angel) • “Teach a skill” • “Learn a skill” (Coach Yeti)
- Safety/disclaimer at checkout: marketplace status, waivers, dispute window

## Observability
- Basic error logging (surface in QA and production logs)

## Definition of Done (MVP)
- Hub + Angel’s List + Coach Yeti live on production URLs
- No console errors on key pages (Playwright smoke)
- Stripe config endpoint and Connect onboarding functional
- Admin basics operational
