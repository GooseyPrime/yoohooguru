# Admin Guide - YooHoo.Guru Platform

This guide documents all administrative features, routes, and tools available to platform administrators.

## Table of Contents

1. [Accessing the Admin Dashboard](#accessing-the-admin-dashboard)
2. [Admin Routes](#admin-routes)
3. [AI Agent Management](#ai-agent-management)
4. [Content Moderation](#content-moderation)
5. [User Management](#user-management)
6. [Analytics and Reporting](#analytics-and-reporting)
7. [Security and Permissions](#security-and-permissions)

---

## Accessing the Admin Dashboard

### Admin Dashboard URL
```
https://www.yoohoo.guru/admin
```

### Authentication

Admins must authenticate with an admin key:

1. Navigate to `/admin`
2. Enter admin key (set in `ADMIN_KEY` environment variable)
3. Admin session is stored in cookie for duration of browser session

**Setting Admin Key:**
```bash
# Backend environment variable
ADMIN_KEY=your-secure-admin-key-here
```

**Security Note:** Change the admin key regularly and never share it publicly.

---

## Admin Routes

### Frontend Routes

#### Main Admin Dashboard
- **Route:** `/admin`
- **File:** `apps/main/pages/admin/index.tsx`
- **Features:**
  - Overview dashboard with platform metrics
  - AI agent status monitoring
  - Content management
  - User management
  - Settings

#### Site Text Management  
- **Route:** `/admin/site-text`
- **File:** `apps/main/pages/admin/site-text.tsx`
- **Features:**
  - Edit site-wide text and copy
  - Manage translations (future feature)
  - Update help text and tooltips

### Backend API Routes

All backend admin routes are prefixed with `/api/admin/` and require admin authentication.

#### Agent Management

**GET `/api/admin/agents-status`**
- Returns status of all AI curation agents
- Response includes:
  - News agent status, last run time, errors
  - Blog agent status, last run time, errors
  - Environment info
  - Timestamp

**POST `/api/admin/curate`**
- Manually trigger content curation
- Runs both news and blog agents
- Returns execution results

#### Content Management

**GET `/api/admin/queue`**
- Get moderation queue
- Returns pending items needing review:
  - Listings flagged for review
  - Reported users
  - Disputed reviews
  - AI-generated content needing approval

**POST `/api/admin/approve/:itemId`**
- Approve a queued item
- Parameters:
  - `itemId`: ID of item to approve
- Response: Updated item status

**POST `/api/admin/deny/:itemId`**
- Deny/reject a queued item
- Parameters:
  - `itemId`: ID of item to deny
  - `reason`: Explanation for denial
- Response: Updated item status

#### Analytics

**GET `/api/admin/analytics`**
- Get platform-wide analytics
- Response includes:
  - User metrics (total, active, new)
  - Content metrics (posts, articles, services)
  - Revenue metrics (GMV, platform fees, payouts)
  - Engagement metrics (sessions, bookings, reviews)

#### System Status

**GET `/api/admin/system-status`**
- Detailed system health check
- Response includes:
  - Database connection status
  - Stripe API status
  - Firebase status
  - Agent status
  - Performance metrics (response times, error rates)

---

## AI Agent Management

### Content Curation Agents

The platform uses two AI agents for automated content generation:

#### News Curation Agent
- **Schedule:** Twice daily (6 AM and 3 PM EST)
- **Function:** Curates 2 news articles per subdomain (48 total daily)
- **Source:** US news via OpenRouter/Perplexity
- **Storage:** Firestore `gurus/{subdomain}/news/`
- **Retention:** 10 most recent articles per subdomain

#### Blog Curation Agent
- **Schedule:** Weekly (Mondays at 10 AM EST)
- **Function:** Generates 1 blog post per subdomain (24 total weekly)
- **Content:** 1,200-2,000 word SEO-optimized articles with affiliate links
- **Storage:** Firestore `gurus/{subdomain}/posts/`
- **Rotation:** 7-category cycle (How-To, Best Practices, Reviews, etc.)

### Managing Agents

**View Agent Status:**
1. Go to Admin Dashboard → AI Agents tab
2. View current status of each agent
3. See last run time and any errors

**Manually Trigger Curation:**
1. Go to Admin Dashboard
2. Click "Trigger Content Curation" button
3. Confirm action
4. Monitor execution in real-time
5. View results and any errors

**Agent Logs:**
- Backend console logs include agent execution details
- Check Railway logs for production agent runs
- Look for `[NewsAgent]` and `[BlogAgent]` prefixes

---

## Content Moderation

### Moderation Queue

**Accessing the Queue:**
- Admin Dashboard → Queue tab
- Shows all items needing review

**Item Types:**

1. **Flagged Listings (Angel's List)**
   - Users can flag inappropriate listings
   - Admin reviews and approves/denies
   - Denied listings are hidden and provider notified

2. **Reported Users**
   - Users can report other users for violations
   - Admin reviews evidence and takes action
   - Actions: warning, suspension, ban

3. **Disputed Reviews**
   - Reviews can be disputed if inaccurate/abusive
   - Admin reviews both sides
   - Actions: keep, edit, remove

4. **AI Content Review (Optional)**
   - If enabled, AI-generated blog posts require approval
   - Admin reviews for quality and accuracy
   - Actions: publish, edit, reject

**Moderation Workflow:**

1. **Review Item:**
   - Click on item in queue
   - View all details, evidence, history
   - Check user reputation and past violations

2. **Make Decision:**
   - Approve: Item goes live
   - Deny: Item removed, user notified
   - Edit: Make changes and approve
   - Flag for further review: Keep in queue

3. **Document Decision:**
   - Add admin notes explaining reasoning
   - Notes are internal only (users don't see them)

4. **Communicate:**
   - System sends automated notification to affected users
   - Include reason for denial when applicable

---

## User Management

### User Dashboard

**Accessing User Management:**
- Admin Dashboard → Users tab
- Search, filter, and view all platform users

**User Information:**
- Profile details (name, email, photo)
- Account status (active, suspended, banned)
- Role (Gunu, Guru, Hero, Angel)
- Metrics (bookings, reviews, revenue)
- Compliance status (verified documents, background checks)

**User Actions:**

**1. View User Profile**
```
GET /api/admin/users/:userId
```
- Full user details
- Activity history
- Compliance documents
- Booking history
- Reviews given/received

**2. Suspend User**
```
POST /api/admin/users/:userId/suspend
Body: { reason: "Violation of ToS", duration: "30 days" }
```
- Temporarily restrict access
- User notified via email
- Can set duration or indefinite

**3. Ban User**
```
POST /api/admin/users/:userId/ban
Body: { reason: "Repeated violations", permanent: true }
```
- Permanently remove access
- All listings deactivated
- Pending payouts processed
- User cannot create new account

**4. Verify User**
```
POST /api/admin/users/:userId/verify
Body: { verificationType: "identity" | "skill" | "background" }
```
- Manually verify user documents
- Grant verification badges
- Update compliance status

---

## Analytics and Reporting

### Platform Metrics

**Dashboard Overview:**
- Real-time user count (total, active today)
- Transaction volume (last 24h, last 7d, last 30d)
- Revenue metrics (GMV, platform fees)
- Content metrics (posts, articles, services)

**Detailed Reports:**

**1. User Growth**
- New user registrations over time
- User retention rates
- User type distribution (Guru/Gunu/Hero/Angel)

**2. Revenue Analysis**
- Gross Merchandise Value (GMV) trends
- Platform fee revenue
- Stripe Connect payouts
- Revenue by subdomain/category

**3. Content Performance**
- Blog post views and engagement
- News article click-through rates
- Affiliate link performance
- Lead capture conversion rates

**4. Engagement Metrics**
- Session bookings (Coach Guru)
- Service completions (Angel's List)
- Volunteer hours (Hero Gurus)
- Review submission rates

### Exporting Data

**CSV Exports:**
```
GET /api/admin/export/users
GET /api/admin/export/transactions
GET /api/admin/export/bookings
```

Returns CSV file for download.

---

## Security and Permissions

### Admin Authentication

**Cookie-Based Authentication:**
- Admin key verified on login
- Session cookie set: `yoohoo_admin=1`
- Cookie expires on browser close
- All admin routes check for cookie

**API Authentication:**
```javascript
// Backend middleware checks for admin cookie
function requireAdmin(req, res, next) {
  if (req.cookies.yoohoo_admin !== '1') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}
```

### Permission Levels

**Current System:**
- Single admin level (all or nothing)
- Admins have full platform access

**Future Enhancement:**
- Role-based access control (RBAC)
- Granular permissions per admin user
- Audit logs for all admin actions

### Security Best Practices

1. **Protect Admin Key:**
   - Use strong, random key (32+ characters)
   - Rotate key every 90 days
   - Never commit to git or share publicly

2. **Monitor Admin Activity:**
   - Review Railway/Vercel logs regularly
   - Check for unusual admin actions
   - Implement audit logging (future)

3. **Limit Admin Access:**
   - Only grant admin access to trusted team members
   - Revoke access immediately when team member leaves
   - Use separate admin accounts (no shared credentials)

4. **Secure Admin Environment:**
   - Use 2FA for Railway/Vercel accounts
   - Require strong passwords
   - Enable IP allowlisting if possible

---

## Common Admin Tasks

### 1. Review and Approve New Service Listings

1. Go to Admin Dashboard → Queue → Listings
2. Filter by "Pending Approval"
3. Review each listing:
   - Check for appropriate content
   - Verify pricing is reasonable
   - Ensure images are appropriate
   - Check for policy violations
4. Approve or deny with reason
5. User receives notification

### 2. Investigate User Report

1. Go to Admin Dashboard → Users
2. Search for reported user
3. Review:
   - Report details and evidence
   - User's booking history
   - Previous violations
   - Reviews from other users
4. Make decision:
   - No action (false report)
   - Warning (first offense)
   - Suspension (repeated issues)
   - Ban (severe violations)
5. Document reasoning in admin notes

### 3. Manually Trigger Content Generation

1. Go to Admin Dashboard → AI Agents
2. Click "Trigger Curation"
3. Wait for execution (may take 2-5 minutes)
4. Review results:
   - Check if articles were generated
   - Verify content quality
   - Check for any errors
5. If errors, review logs in Railway

### 4. Monitor Platform Health

1. Go to Admin Dashboard → Overview
2. Review key metrics:
   - Agent status (should be "running")
   - Database connection (should be "connected")
   - Error rate (should be <1%)
3. If issues detected:
   - Check system status endpoint
   - Review Railway logs
   - Contact development team if needed

### 5. Process Refund Request

1. User submits refund request (creates dispute)
2. Go to Admin Dashboard → Queue → Disputes
3. Review dispute details:
   - Booking information
   - User's complaint
   - Provider's response
   - Session evidence (photos, messages)
4. Make decision:
   - Full refund: Process in Stripe Dashboard
   - Partial refund: Calculate amount, process
   - No refund: Deny with explanation
5. Update dispute status
6. Both parties notified automatically

---

## Troubleshooting

### Common Issues

**1. "Invalid admin key" error**
- Verify `ADMIN_KEY` environment variable is set correctly
- Check for typos or extra spaces
- Ensure backend has been redeployed after changing key

**2. AI agents not running**
- Check OpenRouter API key is valid
- Verify cron schedule is configured correctly
- Review agent logs in Railway for errors
- Manually trigger to test

**3. Cannot approve/deny items**
- Check admin authentication cookie
- Verify backend API is accessible
- Review browser console for errors
- Check network tab for failed requests

**4. Analytics not loading**
- Verify Firestore connection
- Check that analytics data exists
- Review backend logs for database errors

### Getting Help

If you encounter issues as an admin:

1. Check this guide first
2. Review Railway/Vercel logs
3. Test in development environment
4. Contact development team with:
   - What you were trying to do
   - Error messages or screenshots
   - Steps to reproduce

---

## Appendix

### Admin API Reference

Quick reference for all admin API endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Authenticate admin |
| GET | `/api/admin/agents-status` | Get AI agent status |
| POST | `/api/admin/curate` | Trigger content curation |
| GET | `/api/admin/queue` | Get moderation queue |
| POST | `/api/admin/approve/:itemId` | Approve item |
| POST | `/api/admin/deny/:itemId` | Deny item |
| GET | `/api/admin/analytics` | Get platform analytics |
| GET | `/api/admin/system-status` | System health check |
| GET | `/api/admin/users` | List all users |
| GET | `/api/admin/users/:userId` | Get user details |
| POST | `/api/admin/users/:userId/suspend` | Suspend user |
| POST | `/api/admin/users/:userId/ban` | Ban user |
| POST | `/api/admin/users/:userId/verify` | Verify user |
| GET | `/api/admin/export/users` | Export users CSV |
| GET | `/api/admin/export/transactions` | Export transactions CSV |
| GET | `/api/admin/export/bookings` | Export bookings CSV |

### Admin Dashboard Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `?` | Show help |
| `q` | Go to queue |
| `u` | Go to users |
| `a` | Go to analytics |
| `s` | Go to settings |
| `/` | Focus search |
| `Esc` | Close modal |

---

**Last Updated:** November 13, 2025  
**Maintainer:** Development Team  
**Related Docs:** [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md), [ARCHITECTURE.md](./ARCHITECTURE.md)
