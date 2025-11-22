# Deployment Instructions - Critical Fixes Needed

**Created**: November 22, 2025
**Priority**: HIGH - Production features need deployment

---

## 🚨 What I've Done

### 1. Fixed Blog Posts API ✅
- Added missing Firestore composite indexes to `firestore.indexes.json`
- Created deployment script: `deploy-firestore-indexes.sh`
- Ready to deploy (requires your Firebase credentials)

### 2. Verified HomepageAssistant Code ✅
- Component exists and is properly integrated
- Code is deployed to production (in main branch)
- But NOT rendering on live site - needs investigation

---

## 🚀 Deploy Firestore Indexes NOW

Run this script (requires Firebase authentication):
```bash
./deploy-firestore-indexes.sh
```

Or manually:
```bash
firebase login
firebase deploy --only firestore:indexes --project=ceremonial-tea-470904-f3
```

**This fixes the HTTP 500 error on blog posts API**

---

## 🔍 Investigate HomepageAssistant

The AI chat widget should appear on https://www.yoohoo.guru but doesn't.

### Check:
1. Browser console for errors
2. Vercel deployment logs
3. OPENROUTER_API_KEY environment variable

### Quick test:
Visit https://www.yoohoo.guru - look for floating chat button in bottom-right corner

---

See `PRODUCTION_VERIFICATION_RESULTS.md` for complete debugging report.
