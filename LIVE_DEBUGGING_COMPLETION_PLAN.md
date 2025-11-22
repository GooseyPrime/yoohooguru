# Live Debugging Completion Plan - Production Site

**Created**: November 22, 2025
**For**: Next Claude Code Agent
**Branch**: `claude/review-debugging-report-012Z9bMXqqgWKBeeLKGxCshQ`
**Purpose**: Complete live debugging and production verification of yoohoo.guru platform

---

## 📖 Quick Start for Next Agent

### STEP 1: Read Context (5 minutes)

**Required Reading**:
1. ✅ Read this file completely (you're doing it now!)
2. ✅ Read `PRODUCTION_DEBUGGING_REPORT.md` (sections 1-3 minimum)

**Key Takeaway**: Previous report claims were inaccurate. System is healthier than reported.

---

### STEP 2: Verify Environment (2 minutes)

```bash
# Check current branch
git branch --show-current
# Should be: claude/review-debugging-report-012Z9bMXqqgWKBeeLKGxCshQ

# Check dependencies (should already be installed from previous session)
ls node_modules/typescript && echo "✅ TypeScript present" || echo "❌ Run: npm install --include=dev"
ls node_modules/turbo && echo "✅ Turbo present" || echo "❌ Run: npm install --include=dev"

# Quick build test
npm run build 2>&1 | grep -E "✓|error|failed" | head -20
```

**Expected**: Build succeeds, all packages compile

---

### STEP 3: Decision Tree

```
START
  ↓
Are dependencies installed? (check node_modules/typescript)
  ├─ NO → Run: npm install --include=dev → Verify build works → Continue
  └─ YES → Continue
  ↓
Does build work? (npm run build)
  ├─ NO → Check error, fix, document → Continue
  └─ YES → Continue
  ↓
Choose debugging focus:
  ├─ A) Production Site Verification → Go to PHASE 1
  ├─ B) Fix TypeScript Type Conflicts → Go to PHASE 2
  ├─ C) Debug AI Blog Curation → Go to PHASE 3
  └─ D) End-to-End Testing → Go to PHASE 4
```

---

## 🎯 Overall Mission

**Objective**: Verify and debug the live production deployment of yoohoo.guru

**Context**:
- Platform is a skill-sharing marketplace with 29 subdomain-specific apps
- Backend API on Railway, Frontend on Vercel
- News and blog API endpoints recently added (already deployed)
- Current issues are minor (type conflicts, AI generation)

---

## 📊 Current State Summary

### ✅ What's Working

| Component | Status | Evidence |
|-----------|--------|----------|
| npm workspaces | ✅ Working | 1,949 packages installed |
| Build system | ✅ Working | Completes in ~60s |
| Turbo | ✅ Working | v2.6.1 orchestrating builds |
| Next.js compilation | ✅ Working | 35 pages generated |
| Backend build | ✅ Working | Completes successfully |
| News API | ✅ Deployed | Merged in PR #540 |
| Blog API | ✅ Deployed | Merged in PR #540 |
| Firebase integration | ✅ Working | Connects to production |

### ⚠️ Known Issues

| Issue | Severity | Impact | Status |
|-------|----------|--------|--------|
| TypeScript type conflicts | Low | Dev experience only | Documented, fix available |
| AI blog curation failing | Medium | No auto-generated content | Needs API key verification |
| Multiple @types/react versions | Low | Type checking errors | Documented, fix available |

### ❓ Unknown / Needs Verification

| Item | Priority | Why Important |
|------|----------|---------------|
| Production endpoints live? | **HIGH** | Core functionality |
| Frontend-backend connectivity | **HIGH** | End-to-end flow |
| News displaying on subdomains | **HIGH** | User-facing feature |
| Blog posts displaying | **HIGH** | User-facing feature |
| API response times | Medium | Performance |
| Error rates in production | Medium | Stability |
| SEO metadata working | Medium | Discoverability |

---

## 🔍 PHASE 1: Production Site Verification (HIGH PRIORITY)

**Goal**: Verify live production site is functional and APIs are working

### 1.1 Identify Production URLs

```bash
# Check vercel.json for deployment config
cat vercel.json | grep -E "domain|alias" | head -10

# Check backend deployment
cat railway.json 2>/dev/null || cat backend/package.json | grep -A5 "scripts"

# Expected URLs:
# Frontend: https://yoohoo.guru (and subdomains)
# Backend: https://api.yoohoo.guru OR Railway URL
```

**Action**: Document the actual production URLs

---

### 1.2 Test Production API Endpoints

**Priority 1: News API**

```bash
# Test 1: Get news for a specific subdomain
curl -X GET "https://api.yoohoo.guru/api/news/music?limit=5" \
  -H "Accept: application/json" | jq '.'

# Expected: JSON response with news array
# Success: HTTP 200, news array with items
# Failure: Document exact error response

# Test 2: Get news across all subdomains
curl -X GET "https://api.yoohoo.guru/api/news?limit=10" \
  -H "Accept: application/json" | jq '.'

# Test 3: Test invalid subdomain (should fail gracefully)
curl -X GET "https://api.yoohoo.guru/api/news/invalid?limit=5" \
  -H "Accept: application/json" | jq '.'

# Expected: HTTP 400 with error message
```

**Priority 2: Blog Posts API**

```bash
# Test 1: Get mixed blog posts
curl -X GET "https://api.yoohoo.guru/api/blog/posts?limit=6" \
  -H "Accept: application/json" | jq '.'

# Expected: JSON response with posts array

# Test 2: Get subdomain-specific posts
curl -X GET "https://api.yoohoo.guru/api/music/posts?limit=5&page=1" \
  -H "Accept: application/json" | jq '.'

# Test 3: Get single post by slug (need real slug from Test 1 or 2)
# First, extract a slug from previous response
SLUG="<insert-slug-here>"
curl -X GET "https://api.yoohoo.guru/api/blog/posts/$SLUG" \
  -H "Accept: application/json" | jq '.'

# Expected: Full post content with related posts
```

**Priority 3: Test All Subdomains**

```bash
# Get list of valid subdomains
cat subdomains-config.js | grep -E "subdomain:|id:" | head -30

# Test each subdomain's news endpoint
for subdomain in music coding fitness art business tech; do
  echo "Testing: $subdomain"
  curl -s "https://api.yoohoo.guru/api/news/$subdomain?limit=2" | jq '.count'
  sleep 1
done

# Test each subdomain's posts endpoint
for subdomain in music coding fitness art business tech; do
  echo "Testing: $subdomain"
  curl -s "https://api.yoohoo.guru/api/$subdomain/posts?limit=2" | jq '.pagination'
  sleep 1
done
```

**Document Results**: Create a table of working vs. failing endpoints

---

### 1.3 Test Frontend Pages

**Priority 1: Subdomain Homepage**

```bash
# Test if subdomains resolve
curl -I "https://music.yoohoo.guru" | grep -E "HTTP|Location"
curl -I "https://coding.yoohoo.guru" | grep -E "HTTP|Location"
curl -I "https://fitness.yoohoo.guru" | grep -E "HTTP|Location"

# Expected: HTTP 200 or 301/302 redirect
# Document: Any 404s or 500s
```

**Priority 2: News/Blog Pages on Subdomains**

```bash
# Check if blog routes exist on subdomains
curl -I "https://music.yoohoo.guru/_apps/music/blog" | grep HTTP
curl -I "https://coding.yoohoo.guru/_apps/coding/blog" | grep HTTP

# Check individual blog post pages
curl -I "https://music.yoohoo.guru/_apps/music/blog/[some-slug]" | grep HTTP
```

**Priority 3: API Integration on Frontend**

```bash
# Fetch page and check for API calls
curl -s "https://music.yoohoo.guru/_apps/music/blog" | grep -o "api.*news\|api.*posts" | head -10

# Look for error states or loading indicators
curl -s "https://music.yoohoo.guru/_apps/music" | grep -i "error\|loading\|no.*found"
```

**Action**: Document which pages show news/blogs correctly

---

### 1.4 Verify Backend-Frontend Connection

**Check CORS Configuration**

```bash
# Test OPTIONS request
curl -X OPTIONS "https://api.yoohoo.guru/api/news/music" \
  -H "Origin: https://music.yoohoo.guru" \
  -H "Access-Control-Request-Method: GET" \
  -i

# Expected: CORS headers present
# Access-Control-Allow-Origin: https://music.yoohoo.guru (or *)
```

**Check API Proxy Rewrites**

```bash
# Read Next.js config for rewrites
cat apps/main/next.config.js | grep -A20 "rewrites"

# Verify rewrite rules match backend URL
# Expected: /api/backend/* → backend API URL
```

**Test from Frontend Context**

```bash
# Make request as if from browser
curl -X GET "https://yoohoo.guru/api/backend/news/music?limit=3" \
  -H "Referer: https://yoohoo.guru" \
  -H "User-Agent: Mozilla/5.0" | jq '.'

# This tests the Next.js rewrite proxy
```

**Action**: Document any connectivity issues

---

### 1.5 Check Firestore Data

**Verify Collections Exist**

The APIs query these Firestore paths:
- News: `gurus/{subdomain}/news`
- Posts: `gurus/{subdomain}/posts`

```bash
# Check if Firebase Admin SDK is configured locally
cat backend/.env.example | grep FIREBASE

# Test Firestore connection
cd backend && npm run test:firebase 2>/dev/null || node -e "
const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();
db.collection('gurus').doc('music').collection('news').limit(1).get()
  .then(snap => console.log('✅ Firestore connected, docs:', snap.size))
  .catch(err => console.error('❌ Firestore error:', err.message));
"
```

**Expected Data Structure**

```
Firestore:
  gurus/
    music/
      news/
        {newsId}/
          - title: string
          - summary: string
          - url: string
          - source: string
          - publishedAt: timestamp
          - imageUrl: string (optional)
      posts/
        {postId}/
          - title: string
          - slug: string
          - content: string
          - excerpt: string
          - status: "published"
          - publishedAt: timestamp
          - tags: array
```

**Action**: Verify at least one subdomain has news and posts data

---

### 1.6 Production Logs Analysis

**Backend Logs** (Railway or deployment platform)

```bash
# If using Railway CLI
railway logs --tail 100 | grep -E "error|warn|news|blog|posts"

# Look for:
# - API endpoint hits
# - Error responses
# - Database connection issues
# - CORS errors
```

**Frontend Logs** (Vercel)

```bash
# If using Vercel CLI
vercel logs <deployment-url> --since 1h | grep -E "error|api|news|blog"

# Look for:
# - Failed API requests
# - Client-side errors
# - SSR errors
```

**Action**: Document any recurring errors or warnings

---

### 📋 PHASE 1 Deliverable

Create a file: `PRODUCTION_VERIFICATION_RESULTS.md`

**Required Sections**:
1. **API Endpoints Status** - Table of all endpoints tested
2. **Frontend Pages Status** - Which pages load successfully
3. **Data Verification** - Firestore collection status
4. **Integration Issues** - Any connectivity problems found
5. **Next Steps** - Based on what was found

**Decision Point**:
- ✅ If all working → Document success, move to PHASE 4 (E2E testing)
- ⚠️ If APIs failing → Debug API issues first (see TROUBLESHOOTING section)
- ⚠️ If frontend issues → Debug frontend integration (see TROUBLESHOOTING section)
- ❌ If data missing → Need to populate Firestore or trigger blog curation

---

## 🔧 PHASE 2: Fix TypeScript Type Conflicts (MEDIUM PRIORITY)

**Goal**: Resolve duplicate @types/react versions causing type errors

### 2.1 Understand the Problem

**Current Issue**:
- TypeScript error in `packages/shared/src/components/Button.tsx:133`
- Root cause: Multiple versions of `@types/react` installed

```bash
# Check all @types/react installations
find . -name "@types" -type d | grep -v node_modules/.cache
npm list @types/react --depth=0 --all

# Expected output showing multiple versions:
# ├─ @types/react@19.2.6 (root)
# └─ packages/shared/node_modules/@types/react@X.X.X
```

### 2.2 Solution Approach

**Option A: npm Overrides (Recommended)**

```bash
# 1. Add to root package.json
cat >> package.json.tmp << 'EOF'
{
  "overrides": {
    "@types/react": "^19.2.6",
    "@types/react-dom": "^19.2.0"
  }
}
EOF

# Use Edit tool to add overrides section to package.json
# Location: After "devDependencies" section, before "workspaces"

# 2. Clean and reinstall
rm -rf node_modules package-lock.json
rm -rf apps/main/node_modules
rm -rf backend/node_modules
rm -rf packages/*/node_modules

# 3. Fresh install
npm install --include=dev

# 4. Verify single version
npm list @types/react --depth=0 --all
# Should show only one version
```

**Option B: Workspace Dependencies (Alternative)**

```bash
# Move @types/react to root devDependencies only
# Remove from all workspace package.json files

# Check current locations
grep -r "@types/react" --include="package.json" .

# Remove from workspace packages (use Edit tool)
# Keep only in root package.json devDependencies
```

### 2.3 Verify Fix

```bash
# Run TypeScript check
npx tsc --project apps/main/tsconfig.json --noEmit 2>&1 | grep "error TS" | wc -l

# Expected: 0 errors (or fewer than before)

# Run full build
npm run build

# Expected: Still succeeds (should work even better now)
```

### 2.4 Enable TypeScript Checking

**Update Next.js Config**

```javascript
// apps/main/next.config.js
// Change from:
typescript: {
  ignoreBuildErrors: true,
}

// Change to:
typescript: {
  ignoreBuildErrors: false,  // Now that errors are fixed
}
```

**Test**:
```bash
npm run build:main
# Should complete without TypeScript errors
```

### 📋 PHASE 2 Deliverable

**Commit Message Template**:
```
Fix TypeScript type conflicts by enforcing single @types/react version

Problem:
- Multiple versions of @types/react causing type incompatibility
- Error in packages/shared/src/components/Button.tsx:133
- Build succeeding only due to ignoreBuildErrors: true

Solution:
- Add npm overrides to enforce @types/react@19.2.6
- Clean install all node_modules
- Verify TypeScript compilation succeeds

Result:
- TypeScript errors reduced from X to 0
- Enabled strict type checking in production builds
- Better type safety for development

Testing:
- npx tsc --noEmit completes successfully
- npm run build completes without ignoring errors
```

---

## 🤖 PHASE 3: Debug AI Blog Curation (MEDIUM PRIORITY)

**Goal**: Fix automated blog content generation failing for all subdomains

### 3.1 Understand Current State

**Observed Behavior** (from build logs):
```
❌ AI generation failed for handyman in production - skipping
❌ AI generation failed for life-coaching in production - skipping
... (all 29 subdomains failing)
```

**Expected Behavior**:
- Post-build script generates weekly blog posts
- Uses AI (OpenRouter) to create content
- Stores in Firestore: `gurus/{subdomain}/posts`

### 3.2 Locate Blog Curation System

```bash
# Main script
cat backend/scripts/trigger-blog-curation.js | head -50

# Blog agent logic
cat backend/agents/blog-agent.js 2>/dev/null || \
  find backend -name "*blog*agent*" -type f | head -5

# Configuration
cat backend/config/subdomains.js | grep -A5 "getAllSubdomains"

# Dependencies check
cat backend/package.json | grep -E "openai|openrouter|anthropic"
```

### 3.3 Test Locally

**Verify Environment Variables**

```bash
# Check required env vars
cat backend/.env.example | grep -E "OPENROUTER|ANTHROPIC|OPENAI|API_KEY"

# Check if set locally
node -e "console.log('OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY ? '✅ Set' : '❌ Missing')"

# Test Firebase credentials
node -e "
const fs = require('fs');
const hasKey = process.env.FIREBASE_SERVICE_ACCOUNT || fs.existsSync('backend/firebase-adminsdk.json');
console.log('Firebase credentials:', hasKey ? '✅ Set' : '❌ Missing');
"
```

**Run Curation Manually**

```bash
cd backend

# Dry run (if available)
npm run curate:blogs -- --dry-run --subdomain=music 2>&1 | head -50

# Or full run for one subdomain
npm run curate:blogs -- --subdomain=music 2>&1 | tee blog-curation-test.log

# Check for errors
grep -E "error|failed|Error" blog-curation-test.log
```

### 3.4 Common Failure Modes

**A) Missing API Keys**

```bash
# Symptom: "API key not found" or "401 Unauthorized"

# Fix: Set API key
export OPENROUTER_API_KEY="your-key-here"

# Or in .env file
echo "OPENROUTER_API_KEY=your-key" >> backend/.env

# Verify in production (Railway/deployment platform)
# Check environment variables in dashboard
```

**B) API Rate Limits**

```bash
# Symptom: "429 Too Many Requests" or "Rate limit exceeded"

# Fix: Add delays between requests
# Check if blog-agent has rate limiting logic
cat backend/agents/blog-agent.js | grep -A5 "sleep\|delay\|timeout"

# May need to add:
# await sleep(1000); // 1 second between requests
```

**C) Invalid Prompts**

```bash
# Symptom: AI returns empty or error response

# Debug: Check prompt construction
cat backend/agents/blog-agent.js | grep -A20 "prompt\|messages"

# Test with simpler prompt
node -e "
const openrouter = require('openrouter'); // or whatever client
// Test basic API call
"
```

**D) Firestore Permission Issues**

```bash
# Symptom: "Permission denied" when writing to Firestore

# Check Firebase rules
cat firestore.rules | grep -A10 "gurus"

# Verify service account has write permissions
# Test write manually:
node backend/test-firestore-write.js # Create this if needed
```

### 3.5 Fix and Verify

**After identifying issue**:

```bash
# 1. Apply fix (API key, rate limit, prompt, etc.)

# 2. Test on single subdomain
cd backend && npm run curate:blogs -- --subdomain=music

# 3. Verify in Firestore
# Check that new post was created in gurus/music/posts

# 4. Test on multiple subdomains
npm run curate:blogs -- --limit=3

# 5. Run full curation
npm run curate:blogs

# 6. Check success rate
grep "successfully" <log-file> | wc -l
```

### 3.6 Production Deployment

**Set Environment Variables**

```bash
# Railway (example)
railway variables set OPENROUTER_API_KEY="your-key"

# Vercel (example)
vercel env add OPENROUTER_API_KEY production

# Or via platform dashboard
```

**Test in Production**

```bash
# Trigger via deployment hook (if configured)
curl -X POST "https://api.yoohoo.guru/hooks/curate-blogs" \
  -H "Authorization: Bearer $DEPLOY_HOOK_TOKEN"

# Or manually via SSH/console
railway run npm run curate:blogs
```

### 📋 PHASE 3 Deliverable

**Document**:
1. Root cause of AI generation failures
2. Environment variables needed
3. Fix applied
4. Test results (success rate)
5. Production deployment steps

**Success Criteria**:
- ✅ At least 80% of subdomains generate blog posts successfully
- ✅ Posts appear in Firestore
- ✅ Posts accessible via API (`/api/{subdomain}/posts`)
- ✅ Build completes without AI errors in logs

---

## 🧪 PHASE 4: End-to-End Testing (FINAL VALIDATION)

**Goal**: Comprehensive user flow testing to ensure complete functionality

### 4.1 User Flow Testing

**Flow 1: Subdomain Homepage → Blog → Post**

```bash
# Test as user
# 1. Visit subdomain homepage
curl -s "https://music.yoohoo.guru" | grep -o "blog\|news\|posts" | head -5

# 2. Navigate to blog page
curl -s "https://music.yoohoo.guru/_apps/music/blog" > blog-page.html

# Check for posts
cat blog-page.html | grep -o "post.*title\|article.*heading" | head -10

# 3. Click on post
# Extract first post slug from blog page
SLUG=$(cat blog-page.html | grep -oP 'href="/.*?/blog/\K[^"]+' | head -1)
curl -s "https://music.yoohoo.guru/_apps/music/blog/$SLUG" > post-page.html

# Verify post content loaded
cat post-page.html | grep -i "loading\|error" && echo "⚠️ Issue" || echo "✅ Loaded"
```

**Flow 2: API Request → Response → Frontend Display**

```bash
# 1. Make API request
curl -s "https://api.yoohoo.guru/api/news/music?limit=3" > api-response.json

# 2. Verify response structure
cat api-response.json | jq '.news[] | {title, url, publishedAt}'

# 3. Check if frontend would display it
# News component should handle this structure
cat apps/main/components/NewsSection.tsx 2>/dev/null || \
  find apps/main -name "*News*" -type f | head -5

# Verify component uses correct API endpoint
grep -r "api/news" apps/main/components apps/main/pages | head -10
```

**Flow 3: Search Functionality**

```bash
# If search is implemented
curl -s "https://yoohoo.guru/search?q=music" | grep -o "result" | wc -l

# Test API search endpoint
curl "https://api.yoohoo.guru/api/search?q=guitar&type=posts"
```

### 4.2 Performance Testing

**API Response Times**

```bash
# Test endpoint performance
for i in {1..10}; do
  time curl -s "https://api.yoohoo.guru/api/news/music?limit=5" > /dev/null
done

# Expected: < 1 second per request
# Document: Any requests > 2 seconds
```

**Page Load Times**

```bash
# Use curl with timing
curl -w "@-" -o /dev/null -s "https://music.yoohoo.guru" << 'EOF'
time_namelookup:  %{time_namelookup}\n
time_connect:  %{time_connect}\n
time_starttransfer:  %{time_starttransfer}\n
time_total:  %{time_total}\n
EOF

# Expected: Total time < 3 seconds
```

**Database Query Performance**

```bash
# Check Firestore indexes
cat firestore.indexes.json | jq '.'

# Verify indexes exist for:
# - orderBy publishedAt
# - where status == 'published' + orderBy publishedAt
```

### 4.3 Error Handling Testing

**Test Invalid Inputs**

```bash
# Invalid subdomain
curl -i "https://api.yoohoo.guru/api/news/invalid-subdomain"
# Expected: HTTP 400 with error message

# Invalid limit
curl -i "https://api.yoohoo.guru/api/news/music?limit=999"
# Expected: HTTP 400 with error message

# Invalid slug
curl -i "https://api.yoohoo.guru/api/blog/posts/nonexistent-slug"
# Expected: HTTP 404 with error message
```

**Test Network Issues**

```bash
# Timeout handling
curl -m 1 "https://api.yoohoo.guru/api/news/music?limit=50"
# Should timeout gracefully

# Check error responses include helpful messages
curl -s "https://api.yoohoo.guru/api/news/invalid" | jq '.error, .message'
```

### 4.4 Security Testing

**CORS Configuration**

```bash
# Test from different origins
curl -X GET "https://api.yoohoo.guru/api/news/music" \
  -H "Origin: https://example.com" \
  -i | grep -i "access-control"

# Should allow only yoohoo.guru origins (or * if public API)
```

**Rate Limiting**

```bash
# Test if rate limiting exists
for i in {1..100}; do
  curl -s "https://api.yoohoo.guru/api/news/music" > /dev/null
done

# Check for 429 responses
```

**Input Validation**

```bash
# SQL Injection attempt (should fail safely)
curl "https://api.yoohoo.guru/api/news/'; DROP TABLE--"

# XSS attempt (should be sanitized)
curl "https://api.yoohoo.guru/api/news/<script>alert('xss')</script>"

# Should return 400 or sanitized responses, not 500
```

### 4.5 Browser Testing Checklist

**Manual Tests** (requires browser):

- [ ] Visit main site: https://yoohoo.guru
- [ ] Test subdomain routing: https://music.yoohoo.guru
- [ ] Click "Blog" navigation on subdomain
- [ ] Verify blog posts appear
- [ ] Click individual post
- [ ] Verify post content renders
- [ ] Check news section on subdomain homepage
- [ ] Verify news articles load
- [ ] Test responsive design (mobile view)
- [ ] Check browser console for errors
- [ ] Verify SEO meta tags present (view source)

### 4.6 Automated Testing

**If test suite exists**:

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd apps/main && npm test

# E2E tests
npm run test:e2e 2>/dev/null || \
  cd qa && npm install && npm test

# Check test coverage
npm run test:coverage
```

### 📋 PHASE 4 Deliverable

**Create**: `E2E_TEST_RESULTS.md`

**Include**:
1. ✅ User Flow Test Results - All flows work?
2. ✅ Performance Metrics - Response times acceptable?
3. ✅ Error Handling - Fails gracefully?
4. ✅ Security Checks - No vulnerabilities?
5. ✅ Browser Compatibility - Works in Chrome/Firefox/Safari?
6. ✅ Overall Health Score - X/10

**Success Criteria**:
- All critical user flows work
- API response times < 2s
- No 500 errors
- No console errors
- SEO metadata present

---

## 🚨 TROUBLESHOOTING GUIDE

### Issue: API Returns 404

**Symptoms**:
```bash
curl https://api.yoohoo.guru/api/news/music
# {"error": "Not Found"}
```

**Debug Steps**:

1. **Verify route registration**
   ```bash
   # Check backend index.js or server.js
   cat backend/src/index.js | grep -A5 "news\|posts"

   # Should see:
   # app.use('/api/news', newsRouter);
   # app.use('/api', postsRouter);
   ```

2. **Check deployment**
   ```bash
   # Verify files deployed
   railway status # or deployment platform command

   # Check logs
   railway logs | grep "news\|posts\|routes"
   ```

3. **Test locally first**
   ```bash
   cd backend
   npm run dev

   # In another terminal
   curl http://localhost:3001/api/news/music
   ```

**Common Fixes**:
- Route not registered in main app
- Files not deployed (check .gitignore)
- Wrong base path (check route prefixes)

---

### Issue: API Returns Empty Array

**Symptoms**:
```bash
curl https://api.yoohoo.guru/api/news/music
# {"news": [], "count": 0}
```

**Debug Steps**:

1. **Check Firestore data**
   ```bash
   # Use Firebase console OR
   node backend/scripts/check-firestore-data.js music news

   # Check if collection exists
   # Check if documents have required fields
   ```

2. **Verify query**
   ```bash
   # Check orderBy field exists
   # Firestore requires index for orderBy on timestamp
   cat firestore.indexes.json
   ```

3. **Check permissions**
   ```bash
   cat firestore.rules | grep -A10 "gurus"
   # Should allow reads
   ```

**Common Fixes**:
- No data in Firestore (run blog curation)
- Missing Firestore index (deploy indexes)
- Field names mismatch (check schema)

---

### Issue: Frontend Not Displaying API Data

**Symptoms**:
- Page loads but no news/blogs shown
- Console error: "Failed to fetch"

**Debug Steps**:

1. **Check API call in browser console**
   ```javascript
   // Open DevTools → Network tab
   // Look for requests to /api/news or /api/backend
   ```

2. **Verify API integration**
   ```bash
   # Find component making API call
   grep -r "fetch.*news\|axios.*news" apps/main

   # Check API URL
   grep -r "api.yoohoo.guru\|/api/backend" apps/main
   ```

3. **Check CORS**
   ```bash
   # Backend should allow frontend origin
   cat backend/src/index.js | grep -A10 "cors"
   ```

4. **Test rewrite**
   ```bash
   # Next.js rewrites /api/backend/* to backend
   cat apps/main/next.config.js | grep -A20 "rewrites"
   ```

**Common Fixes**:
- CORS blocking request (add origin to CORS config)
- Wrong API URL in frontend code
- Rewrite not working (check Next.js config)
- API key required but not sent

---

### Issue: Build Fails After Changes

**Symptoms**:
```bash
npm run build
# Error: Cannot find module 'xyz'
```

**Debug Steps**:

1. **Clear caches**
   ```bash
   rm -rf .next .turbo node_modules/.cache
   npm run build
   ```

2. **Reinstall dependencies**
   ```bash
   rm -rf node_modules package-lock.json
   npm install --include=dev
   ```

3. **Check for import errors**
   ```bash
   # Look for missing dependencies
   npm list <missing-package>

   # Install if needed
   npm install <package>
   ```

**Common Fixes**:
- Cache corruption (clear caches)
- Missing dependency (install it)
- Import path wrong (fix import statement)

---

### Issue: TypeScript Errors After Dependency Update

**Symptoms**:
```bash
npx tsc --noEmit
# Error TS2304: Cannot find name 'XYZ'
```

**Debug Steps**:

1. **Check type definitions**
   ```bash
   npm list @types/<package>

   # Install if missing
   npm install -D @types/<package>
   ```

2. **Verify tsconfig**
   ```bash
   cat apps/main/tsconfig.json
   # Check "include" and "exclude" arrays
   ```

3. **Check for multiple versions**
   ```bash
   npm list <package> --depth=0 --all
   # Should be single version
   ```

**Common Fixes**:
- Install missing @types packages
- Enforce single version via overrides
- Update tsconfig include/exclude

---

## 📦 DELIVERABLES CHECKLIST

Before completing debugging session, ensure:

### Documentation

- [ ] `PRODUCTION_VERIFICATION_RESULTS.md` created
  - API endpoint status table
  - Frontend page status
  - Firestore data verification
  - Issues found and fixed

- [ ] `E2E_TEST_RESULTS.md` created (if reached Phase 4)
  - User flow test results
  - Performance metrics
  - Security check results
  - Overall health score

- [ ] Update `PRODUCTION_DEBUGGING_REPORT.md`
  - Add new findings
  - Document fixes applied
  - Update recommendations

### Code Changes

- [ ] All fixes committed with clear messages
- [ ] Branch pushed to remote
- [ ] No uncommitted changes (or documented why)

### Testing Evidence

- [ ] Screenshots of working features (if possible)
- [ ] API response samples saved
- [ ] Error logs captured (if issues found)
- [ ] Performance metrics documented

---

## 🎯 SUCCESS CRITERIA

**Session is complete when**:

### Minimum Requirements (Must Have)

✅ **Production Status Known**
- [ ] Documented which API endpoints work
- [ ] Documented which frontend pages load
- [ ] Identified any data missing from Firestore

✅ **Issues Documented**
- [ ] All errors/warnings documented
- [ ] Root causes identified where possible
- [ ] Fixes applied or workaround documented

✅ **Report Created**
- [ ] PRODUCTION_VERIFICATION_RESULTS.md exists
- [ ] Clear next steps documented
- [ ] Handoff to next agent (or user) is smooth

### Optimal Completion (Nice to Have)

✅ **All Features Working**
- [ ] News API returning data for all subdomains
- [ ] Blog posts API returning data
- [ ] Frontend displaying news/blogs correctly
- [ ] End-to-end user flows work

✅ **Technical Debt Addressed**
- [ ] TypeScript errors fixed (or documented why not)
- [ ] AI blog curation working (or documented why not)
- [ ] Build passes without warnings

✅ **Production Verified**
- [ ] Live endpoints tested and working
- [ ] Performance acceptable (< 2s response)
- [ ] No security vulnerabilities found

---

## 📞 ESCALATION POINTS

**When to ask user for help**:

1. **Missing Credentials**
   - Need: OPENROUTER_API_KEY, FIREBASE_SERVICE_ACCOUNT
   - Cannot: Test AI curation or Firestore without them
   - Ask: "I need API credentials to test X. Can you provide them?"

2. **Production Access**
   - Need: Railway/Vercel access to check logs or env vars
   - Cannot: Debug production issues without visibility
   - Ask: "Can you share production logs for the backend?"

3. **Breaking Changes**
   - Need: Confirmation before major refactor
   - Cannot: Change architecture without approval
   - Ask: "I found issue X. Fix requires changing Y. Proceed?"

4. **Data Population**
   - Need: Decision on populating Firestore
   - Cannot: Create test data without knowing preferences
   - Ask: "Firestore is empty. Should I populate with test data?"

---

## 🔄 HANDOFF TO NEXT AGENT

**If you cannot complete all phases**:

1. **Document Progress**
   ```markdown
   # HANDOFF_NOTES.md

   ## What I Completed
   - [x] Phase 1: Production verification (partial)
   - [ ] Phase 2: TypeScript fixes (not started)
   - [ ] Phase 3: AI curation (not started)
   - [ ] Phase 4: E2E testing (not started)

   ## What I Found
   - News API works but returns empty data
   - Firestore appears empty for subdomain "music"
   - TypeScript errors still present (1 error in Button.tsx)

   ## Blockers
   - Need OPENROUTER_API_KEY to test blog curation
   - Need Firestore populated with test data

   ## Recommended Next Steps
   1. Get API key from user
   2. Run blog curation for 2-3 subdomains
   3. Verify data appears in API responses
   4. Continue with Phase 4 E2E testing
   ```

2. **Commit All Work**
   ```bash
   git add -A
   git commit -m "WIP: Production debugging - completed Phase X"
   git push
   ```

3. **Update This Document**
   - Add checkbox indicating what you completed
   - Add notes in relevant sections
   - Update decision tree if needed

---

## 📚 REFERENCE

### Key Files

| File | Purpose |
|------|---------|
| `package.json` | Root workspace config |
| `apps/main/next.config.js` | Frontend build config |
| `backend/src/routes/news.js` | News API endpoint (164 lines) |
| `backend/src/routes/posts.js` | Blog posts API (390 lines) |
| `backend/scripts/trigger-blog-curation.js` | Blog generation script |
| `subdomains-config.js` | List of 29 subdomains |
| `firestore.rules` | Database security rules |
| `firestore.indexes.json` | Database query indexes |

### Important Commands

```bash
# Install dependencies
npm install --include=dev

# Build everything
npm run build

# Build specific workspace
npm run build:main    # Frontend
npm run build:backend # Backend

# Run locally
npm run dev:main      # Frontend on :3000
npm run dev:backend   # Backend on :3001

# Test TypeScript
npx tsc --project apps/main/tsconfig.json --noEmit

# Run blog curation
cd backend && npm run curate:blogs
```

### Environment Variables

```bash
# Backend (.env)
FIREBASE_SERVICE_ACCOUNT={...}  # Firebase credentials JSON
OPENROUTER_API_KEY=sk-...       # AI generation
NODE_ENV=production             # Environment
PORT=3001                       # Backend port

# Frontend (.env.local)
NEXT_PUBLIC_BACKEND_URL=https://api.yoohoo.guru
NEXT_PUBLIC_FIREBASE_CONFIG={...}
```

### Production URLs

```bash
# Frontend
https://yoohoo.guru              # Main site
https://music.yoohoo.guru        # Music subdomain
https://{subdomain}.yoohoo.guru  # Other subdomains

# Backend
https://api.yoohoo.guru          # API gateway

# API Endpoints
GET /api/news/:subdomain         # News for subdomain
GET /api/news                    # All news
GET /api/blog/posts              # Mixed blog posts
GET /api/blog/posts/:slug        # Single post
GET /api/:subdomain/posts        # Subdomain posts
```

---

## ✅ FINAL CHECKLIST

Before ending your session:

- [ ] Read PRODUCTION_DEBUGGING_REPORT.md (previous findings)
- [ ] Installed dependencies (`npm install --include=dev`)
- [ ] Verified build works (`npm run build`)
- [ ] Completed at least Phase 1 (production verification)
- [ ] Created PRODUCTION_VERIFICATION_RESULTS.md
- [ ] Documented all findings clearly
- [ ] Committed all work
- [ ] Pushed to remote
- [ ] Updated this document with your progress
- [ ] Created handoff notes if incomplete

**Good luck! 🚀**

---

**Last Updated**: November 22, 2025
**For Questions**: See PRODUCTION_DEBUGGING_REPORT.md or ask user
