# COMPREHENSIVE USER FLOWS - YOOHOO.GURU

## MULTI-ROLE & IDENTITY SWITCHING SCENARIOS

### 1. **Guru Who Wants to Learn** (Role Switching)
**Scenario:** Web dev teacher wants to book a guitar lesson
- **Flow:** Dashboard → Browse Gurus → Filter by "Guitar" → Book Session
- **Key Challenge:** User has Guru role but needs to act as Learner (Gunu)
- **Solution:** All users can book sessions regardless of role
- **Status:** ✅ Supported (browse page works for all users)

### 2. **Guru Who Needs Local Service** (Cross-Platform Usage)
**Scenario:** Teacher needs to hire landscaper while logged in as Guru
- **Flow:** Dashboard → Angel's List → Browse Landscapers → Book Directly
- **OR:** Post Gig → Review Applicants → Hire
- **Key Challenge:** Guru navigating to Angel services
- **Status:** ❌ Angel browsing page missing, job posting exists

### 3. **Multi-Role User** (Guru + Angel + Hero)
**Scenario:** User teaches coding (Guru), offers lawn care (Angel), volunteers for disabled learners (Hero)
- **Flow:** Profile → Manage Roles → Toggle each role on/off
- **Dashboard:** Shows cards for all active roles
- **Key Challenge:** Role management UI
- **Status:** ⚠️ Partial - roles exist, management UI incomplete

### 4. **Learner Becomes Guru** (Inspiration Journey)
**Scenario:** Student learns web dev, decides to teach it
- **Flow:** Complete Session → "Become a Guru" prompt → Onboarding Wizard
- **Key Challenge:** Seamless transition from learner to teacher
- **Status:** ❌ Onboarding wizard UI missing

---

## PROFILE CREATION & MANAGEMENT

### 5. **Create Guru Profile - New Skill** (Hot Yoga Example)
**Scenario:** Yoga instructor wants to teach "Hot Yoga" (not in system)
- **Flow:**
  1. Sign up → Select "Guru" role
  2. Start onboarding
  3. Enter skill: "Hot Yoga"
  4. **AI Categorization:** System suggests category placement
     - Primary: Fitness & Wellness
     - Secondary: Yoga, Mind-Body
     - Tags: Hot, Bikram, Heat Therapy
  5. System creates new skill entry
  6. Guru completes profile
  7. Skill becomes searchable
- **Backend:** Skill auto-generation with AI classification
- **Status:** ❌ Skill creation flow missing

### 6. **Edit Existing Profile**
**Pages:**
- `/profile` - General user profile
- `/guru/profile` - Guru-specific settings
- `/angel/profile` - Angel-specific settings
- `/heroes/profile` - Hero Guru settings
**Status:** ✅ All profile pages exist

### 7. **Add New Skill to Existing Profile**
**Flow:** Profile → Skills Section → Add Skill → AI suggests or manual entry
**Status:** ⚠️ Manual add exists, AI suggestion missing

### 8. **Deactivate/Reactivate Guru Status**
**Flow:** Profile → Account Settings → Deactivate Teaching
**Status:** ❌ Toggle missing

### 9. **Switch Between Hero and Paid Guru**
**Flow:** Hero Profile → Toggle "Provide Free Services" → Changes role
**Status:** ✅ Toggle exists in HeroGuruSettings

### 10. **Delete Account**
**Flow:** Settings → Privacy → Delete Account → Confirmation
**Status:** ❌ Not implemented

---

## BOOKING LIFECYCLE

### 11. **Standard Session Booking**
**Flow:** Browse → Select Guru → Choose Date/Time → Pay → Confirm
**Status:** ✅ Complete

### 12. **Reschedule Session**
**Flow:** Dashboard → My Sessions → Select Session → Request Reschedule
**Status:** ❌ Reschedule UI missing

### 13. **Cancel Session**
**Scenarios:**
- Cancel before 24hr cutoff (full refund)
- Cancel within 24hr (partial refund)
- No-show (no refund)
**Flow:** My Sessions → Cancel → Reason → Confirm
**Status:** ❌ Cancellation flow missing

### 14. **Modify Session Details**
**Changes:** Duration, location type (video ↔ in-person)
**Status:** ❌ Modification UI missing

### 15. **Request Refund**
**Flow:** Session History → Request Refund → Reason → Submit
**Status:** ❌ Refund request missing

### 16. **No-Show Handling**
**Scenarios:**
- Guru doesn't show → Auto-refund + penalty
- Learner doesn't show → Guru gets paid
**Status:** ❌ No-show workflow missing

---

## ANGEL'S LIST - LOCAL SERVICES

### 17. **Browse Angel Services** (Direct Booking)
**Scenario:** User wants to SEE available landscapers and CHOOSE one
**Flow:**
- Homepage → Angel's List → Category: Landscaping
- View Providers (profiles, ratings, prices, availability)
- Select Provider → Book Service → Choose Date/Time → Pay
**Status:** ❌ Service provider browsing page MISSING (exists in legacy only)

### 18. **Book Angel Directly** (vs. Posting Gig)
**Key Difference:**
- **Browse & Book:** User picks provider, books immediately
- **Post Gig:** User describes job, providers apply
**Status:** ❌ Direct booking not implemented (only gig posting exists)

### 19. **Post Angel Gig**
**Flow:** Jobs → Post Job → Fill Form → Submit
**Status:** ✅ Exists at `/jobs/post`

### 20. **Apply to Angel Gig**
**Flow:** Jobs → Browse → Select Job → Apply → Submit Proposal
**API:** ✅ `/api/angels/jobs/:jobId/apply` exists
**UI:** ❌ Application form page missing

### 21. **Accept/Reject Angel Applications**
**Flow:** Dashboard → My Jobs → View Applicants → Accept One
**API:** ✅ `/api/angels/jobs/:jobId/applications/:applicantId` exists
**UI:** ❌ Application management page missing

### 22. **Complete Angel Job**
**Flow:** My Jobs → Mark Complete → Rate & Review
**API:** ✅ `/api/angels/jobs/:jobId/complete` exists
**UI:** ❌ Completion flow missing

---

## REMOTE JOB POSTING & APPLICATIONS

### 23. **Post Remote Job** (Different from Angel)
**Use Case:** Hire remote developer, designer, writer
**Flow:** Jobs → Post Job → Select "Remote" → Fill Details
**Status:** ✅ Job posting exists

### 24. **Apply to Remote Job**
**Flow:** Jobs → Browse → Apply → Submit Proposal
**Status:** ❌ Application page missing

### 25. **Review Job Applications** (Employer)
**Flow:** Dashboard → My Posted Jobs → View Applications → Select Candidate
**Status:** ❌ Application review UI missing

### 26. **Accept Applicant**
**Flow:** Review Applications → Accept → Send Message
**Status:** ❌ Acceptance flow missing

### 27. **Complete Job & Pay**
**Flow:** My Jobs → Mark Complete → Release Payment → Rate
**Status:** ❌ Completion flow missing

---

## HERO GURUS (FREE ACCESSIBLE LEARNING)

### 28. **Disabled Learner Attestation**
**Flow:** Visit heroes.yoohoo.guru → Attestation Prompt → Sign Form → Submit
**Status:** ✅ Complete (DisabilityAttestationForm component)

### 29. **Browse Hero Gurus**
**Flow:** Heroes Homepage → "Find Accessible Learning" → Browse Free Teachers
**Status:** ⚠️ Button exists, browse page not connected

### 30. **Book Hero Session** (Free)
**Flow:** Browse Heroes → Select → Book (no payment)
**Status:** ✅ HeroGuruSessionBooking component exists

### 31. **Become Hero Guru**
**Flow:** "Become a Hero Guru" → Onboarding → Toggle Free Services
**Status:** ⚠️ Settings exist, onboarding flow incomplete

### 32. **Toggle Hero Status**
**Flow:** Hero Profile → "Provide Free Services" → On/Off
**Status:** ✅ Toggle exists

---

## SKILL CREATION & CATEGORIZATION

### 33. **Add Non-Existent Skill** ("Hot Yoga" Example)
**Problem:** User enters skill not in database
**Solution - AI Categorization Flow:**

```
User Input: "Hot Yoga"
  ↓
AI Analysis (via OpenRouter):
  - Searches web for "hot yoga" definition
  - Analyzes skill category
  - Suggests taxonomy:
    * Primary Category: Fitness & Wellness
    * Secondary Categories: Yoga, Mind-Body, Heat Therapy
    * Related Skills: Bikram Yoga, Vinyasa, Power Yoga
    * Compliance: Fitness instructor certification recommended
  ↓
User Confirmation: "Does this look right?"
  ↓
Skill Created & Added to Database:
  - Immediately searchable
  - Appears in browse filters
  - Tagged for future users
```

**Required:**
- `/api/ai/categorize-skill` endpoint
- OpenRouter integration with web search
- Skill creation UI
**Status:** ❌ Not implemented

### 34. **Skill Approval Workflow**
**Options:**
- Auto-approve (AI categorization trusted)
- Admin review (new skills flagged)
**Status:** ❌ No workflow exists

### 35. **Skill Taxonomy Management**
**Needs:**
- Hierarchical skill tree
- Tag relationships
- Synonym mapping ("hot yoga" = "bikram yoga")
**Status:** ❌ Basic categories exist, no taxonomy management

---

## AI AGENT INTEGRATIONS

### 36. **AI Matchmaking**
**Purpose:** Find perfect guru based on learning style
**Status:** ✅ Built at `/ai/matchmaking` (created in previous PR)

### 37. **AI Profile Assistant**
**Purpose:** Help optimize guru profile for discoverability
**Component:** ✅ `AIProfileAssistant.tsx` exists
**Integration:** ❌ Not connected to profile creation flow

### 38. **AI Pricing Recommendations**
**Purpose:** Suggest competitive hourly rate
**Component:** ✅ `AIPriceRecommendation.tsx` exists
**Integration:** ❌ Not in pricing setup flow

### 39. **AI Job Helper**
**Purpose:** Help write effective job postings
**Component:** ✅ `AIJobHelper.tsx` exists
**Integration:** ❌ Not in job post flow

### 40. **AI Candidate Selection**
**Purpose:** Analyze and rank job applicants
**Component:** ✅ `AICandidateSelection.tsx` exists
**Integration:** ❌ Not in application review flow

### 41. **AI Teaching Assistant**
**Purpose:** Session preparation help for gurus
**Component:** ✅ `AITeachingAssistant.tsx` exists
**Integration:** ❌ Not accessible anywhere

### 42. **Homepage AI Assistant** ⭐ **NEW - TOP PRIORITY**
**Purpose:** Conversational guide for ALL user intents
**Features:**
- Understand user intent through conversation
- Ask clarifying questions
- Provide personalized recommendations
- Execute actions (redirect, pre-fill forms, start workflows)
- Uses OpenRouter with web search
**Status:** ❌ Not built yet - **BUILDING THIS NEXT**

---

## SEARCH & DISCOVERY

### 43. **Search by Skill Name**
**Flow:** Browse → Search: "guitar" → Filter results
**Status:** ✅ Works in `/browse`

### 44. **Search by Location**
**Flow:** Browse → "Near me" OR enter city
**Status:** ⚠️ Location filter exists, map view not connected

### 45. **Filter by Price Range**
**Status:** ✅ Works in `/browse`

### 46. **Filter by Availability**
**Status:** ❌ Not implemented

### 47. **Filter by Rating**
**Status:** ❌ Not implemented

### 48. **Map-Based Search**
**Page:** ✅ `/location/search` exists
**Integration:** ❌ Not connected to browse flow

---

## REVIEWS & RATINGS

### 49. **Leave Review After Session**
**Flow:** Session Complete → Rate Guru → Write Review → Submit
**Page:** `/guru/[id]/ratings`
**Status:** ⚠️ Page exists, post-session flow incomplete

### 50. **Respond to Review** (Guru Response)
**Status:** ❌ Not implemented

### 51. **Report Inappropriate Review**
**Status:** ❌ Not implemented

### 52. **View All Reviews for Guru**
**Status:** ⚠️ Ratings page exists

---

## PAYMENTS & EARNINGS

### 53. **Add Payment Method**
**Flow:** Settings → Payment Methods → Add Card
**Status:** ❌ Payment method management missing

### 54. **Set Up Payouts** (Stripe Connect)
**Flow:** Onboarding → Payout Setup → Stripe Connect
**Backend:** ✅ `/api/payouts/*` exists
**UI:** ❌ Setup wizard missing

### 55. **View Earnings**
**Dashboard:** Guru/Angel cards show "Earnings" link
**Page:** `/guru/earnings`, `/angel/earnings`
**Status:** ❌ Earnings pages missing

### 56. **Request Payout**
**Backend:** ✅ `/api/payouts/instant` exists
**UI:** ❌ Payout request page missing

### 57. **View Transaction History**
**Status:** ❌ Not implemented

### 58. **Dispute Charge**
**Status:** ❌ Not implemented

---

## NOTIFICATIONS & COMMUNICATION

### 59-63. **All Notification Flows**
**Status:** ❌ No notification system implemented

---

## COMPLIANCE & VERIFICATION

### 64. **Upload Insurance Documents**
**Backend:** ✅ `/api/insurance/submit` exists
**UI:** ❌ Upload form missing

### 65. **Complete Background Check**
**Status:** ❌ Not implemented

### 66. **Request Verification Badge**
**Backend:** ✅ `/api/badges/request` exists
**UI:** ❌ Badge request page missing

### 67. **Compliance Dashboard**
**Backend:** ✅ `/api/compliance/dashboard` exists
**UI:** ❌ Dashboard page missing

---

## SUMMARY - WHAT EXISTS VS. WHAT'S MISSING

### ✅ **FULLY FUNCTIONAL:**
1. Basic guru browsing & booking
2. AI matchmaking
3. Hero Gurus attestation & free sessions
4. Job posting (both systems)
5. Profile editing
6. Angel jobs backend (complete API)

### ⚠️ **PARTIALLY FUNCTIONAL:**
1. Dashboard (cards exist, linked pages missing)
2. Skill management (basic add, no AI categorization)
3. Reviews (page exists, workflow incomplete)
4. Location search (components exist, not integrated)
5. All AI components (built but not integrated)

### ❌ **MISSING:**
1. **Onboarding wizard UI** (backend 100% ready!)
2. **Job/gig application pages**
3. **Angel service browsing** (browse providers directly)
4. **Session management** (reschedule, cancel, modify)
5. **Earnings & payout pages**
6. **Skill categorization with AI**
7. **All AI component integrations**
8. **Homepage AI assistant** ⭐
9. **Notification system**
10. **Payment method management**
11. **Badge & compliance UIs**

---

## NEXT STEPS - INTEGRATION PRIORITY

### 🔥 **PHASE 1 - HOMEPAGE AI ASSISTANT** (Do First!)
Build conversational AI that:
- Routes users to correct flows
- Handles skill creation with AI categorization
- Guides multi-role scenarios
- Pre-fills forms based on conversation
- Acts as universal navigation solution

### ⚡ **PHASE 2 - CRITICAL PAGES** (Do Second)
1. Job application page (`/jobs/[id]/apply`)
2. Application review page (employer view)
3. Angel service browsing (direct booking)
4. Guru onboarding wizard (8 steps)
5. Session management (reschedule/cancel)

### ✨ **PHASE 3 - INTEGRATIONS** (Do Third)
1. Connect all AI components to workflows
2. Map integration
3. Earnings & payout pages
4. Badge & compliance UIs
5. Notification system

---

**This document serves as the master blueprint for completing YooHoo.Guru's navigation and user flows.**
