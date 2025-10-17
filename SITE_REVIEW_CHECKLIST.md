# Site Review Action Checklist

**Purpose:** Quick reference checklist for addressing all site review findings  
**Date:** October 17, 2025  
**Status:** In Progress

---

## 🔴 CRITICAL - Must Complete Before Launch

### Legal Documents
- [ ] Draft Terms of Service
  - [ ] Platform usage terms
  - [ ] User responsibilities
  - [ ] Liability limitations
  - [ ] Dispute resolution
- [ ] Draft Privacy Policy
  - [ ] GDPR compliance
  - [ ] CCPA compliance
  - [ ] Data collection practices
  - [ ] Cookie policy
- [ ] Draft Safety Guidelines
  - [ ] Meeting safety tips
  - [ ] Red flags to watch
  - [ ] Reporting procedures
- [ ] Legal counsel review
- [ ] Publish documents to production
- [ ] Implement acceptance tracking

### Content Fixes
- [ ] Fix Angel's List content
  - [ ] Change hero section to gig marketplace focus
  - [ ] Update CTAs: "Post a Job", "Browse Angels"
  - [ ] Remove learning-focused language
  - [ ] Add service marketplace messaging
- [ ] Fix navigation typo: "Hero Guru's" → "Hero Gurus"

### Environment Configuration
- [ ] Firebase Configuration
  - [ ] FIREBASE_API_KEY
  - [ ] FIREBASE_AUTH_DOMAIN
  - [ ] FIREBASE_PROJECT_ID
  - [ ] FIREBASE_STORAGE_BUCKET
  - [ ] FIREBASE_MESSAGING_SENDER_ID
  - [ ] FIREBASE_APP_ID
- [ ] Stripe Configuration
  - [ ] STRIPE_SECRET_KEY
  - [ ] STRIPE_PUBLISHABLE_KEY
  - [ ] STRIPE_WEBHOOK_SECRET
  - [ ] STRIPE_CONNECT_CLIENT_ID
- [ ] Google Maps
  - [ ] GOOGLE_MAPS_API_KEY
  - [ ] Enable required APIs (Maps, Places, Geocoding)
- [ ] AI Services
  - [ ] OPENROUTER_API_KEY
- [ ] Video Chat (choose one)
  - [ ] AGORA_APP_ID (recommended) OR
  - [ ] TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN
- [ ] Document all variables in .env.example

---

## ⚠️ HIGH PRIORITY - Week 1-2

### Deployment Verification
- [ ] Verify www.yoohoo.guru → apps/main (not redirecting)
- [ ] Verify heroes.yoohoo.guru → apps/heroes
- [ ] Verify coach.yoohoo.guru → apps/coach
- [ ] Verify angel.yoohoo.guru → apps/angel
- [ ] Verify dashboard.yoohoo.guru → apps/dashboard
- [ ] Test 5 priority category subdomains:
  - [ ] cooking.yoohoo.guru
  - [ ] coding.yoohoo.guru
  - [ ] fitness.yoohoo.guru
  - [ ] business.yoohoo.guru
  - [ ] art.yoohoo.guru
- [ ] Verify backend API accessible
- [ ] Test CORS configuration
- [ ] Verify SSL certificates

### Authentication Testing
- [ ] User registration works
  - [ ] Email/password signup
  - [ ] Validation errors display
  - [ ] User created in Firebase
  - [ ] Redirect after signup
- [ ] User login works
  - [ ] Email/password login
  - [ ] "Remember me" persists
  - [ ] Invalid credentials show error
  - [ ] Redirect to dashboard
- [ ] Google OAuth works
  - [ ] "Sign in with Google" button
  - [ ] OAuth flow completes
  - [ ] User profile created
- [ ] Password reset works
  - [ ] "Forgot password" sends email
  - [ ] Reset link works
  - [ ] New password saves
- [ ] Session management works
  - [ ] Session persists across reloads
  - [ ] Session persists across subdomains
  - [ ] Logout works correctly
- [ ] Protected routes work
  - [ ] Unauthenticated redirected to login
  - [ ] Authenticated access dashboard

### Payment Testing
- [ ] Stripe Connect onboarding
  - [ ] Guru starts onboarding flow
  - [ ] Express account created
  - [ ] Onboarding completes
  - [ ] Access Express dashboard
- [ ] Payment creation
  - [ ] User books session
  - [ ] Payment intent created
  - [ ] Payment method added
  - [ ] Payment authorized
- [ ] Payment processing
  - [ ] Payment captured after session
  - [ ] Platform fee deducted
  - [ ] Payout to Guru account
- [ ] Escrow system
  - [ ] Payment held in escrow
  - [ ] Manual capture works
  - [ ] Refund flow works
- [ ] Webhook handling
  - [ ] Webhooks received
  - [ ] Database updated
  - [ ] Failed payments handled

---

## 🟡 MEDIUM PRIORITY - Week 3-4

### Video Chat
- [ ] Choose provider (Agora recommended)
- [ ] Create provider account
- [ ] Configure API credentials
- [ ] Test video chat features
  - [ ] Room creation
  - [ ] Join room
  - [ ] Video streaming
  - [ ] Audio streaming
  - [ ] Screen sharing
  - [ ] Chat messaging
- [ ] Test on multiple browsers
- [ ] Test error scenarios

### Google Maps Integration
- [ ] Map displays correctly
- [ ] User location detected
- [ ] Guru markers displayed
- [ ] Address autocomplete works
- [ ] Distance calculation works
- [ ] Meeting point suggestions work
- [ ] Directions link generated

### Booking System
- [ ] Calendar displays availability
- [ ] Time slot selection works
- [ ] Session type selection works
- [ ] Location selection works (in-person)
- [ ] Booking created successfully
- [ ] Guru receives notification
- [ ] Booking appears in dashboard
- [ ] Cancel booking works
- [ ] Reschedule booking works

### AI Features
- [ ] AI matchmaking works
  - [ ] User questionnaire
  - [ ] Guru recommendations
  - [ ] Ranking algorithm
- [ ] Skill matching works
- [ ] Content curation works
  - [ ] News articles generated
  - [ ] Blog posts generated
- [ ] Rate suggestions work

### Content Differentiation
- [ ] Coach Guru content
  - [ ] Emphasizes paid mentorship
  - [ ] Professional development focus
  - [ ] Pricing information prominent
  - [ ] CTAs: "Find a Coach", "Become a Coach"
- [ ] Hero Gurus content
  - [ ] Emphasizes free mentorship
  - [ ] Disability support and accessibility
  - [ ] Community impact stories
  - [ ] CTAs: "Find a Hero", "Become a Hero"
- [ ] Angel's List content
  - [ ] Gig marketplace focus (already in critical section)
  - [ ] Service categories
  - [ ] CTAs: "Post a Job", "Browse Angels"

### UI Consistency
- [ ] Button colors consistent (gold #FBBF24 for CTAs)
- [ ] Typography consistent
  - [ ] Body: Off-white (#E0E0E0)
  - [ ] Headings: White (#FFFFFF)
  - [ ] Links: Gold (#FBBF24)
- [ ] Spacing and layout consistent
- [ ] Responsive design verified
- [ ] Mobile optimization verified

### Accessibility Audit
- [ ] Run automated audits
  - [ ] WAVE accessibility tool
  - [ ] axe DevTools
  - [ ] Lighthouse accessibility
- [ ] Manual testing
  - [ ] Keyboard navigation
  - [ ] Screen reader testing
  - [ ] Focus indicators
  - [ ] Skip links
- [ ] WCAG 2.1 AA checklist
  - [ ] Color contrast (4.5:1)
  - [ ] Text resizing (200%)
  - [ ] Alternative text for images
  - [ ] Form labels and errors
  - [ ] ARIA labels and roles
  - [ ] Semantic HTML
- [ ] Fix identified issues
- [ ] Create accessibility statement

---

## 🟢 LOW PRIORITY - Week 5-8

### Mascot Imagery
- [ ] Design Sasquatch mascots
  - [ ] Coach Guru (main)
  - [ ] Hero Guru
  - [ ] Angel
  - [ ] 24 Cousin Gurus (categories)
- [ ] Create image assets
  - [ ] Hero section illustrations
  - [ ] Avatar-sized versions
  - [ ] Icon versions
- [ ] Implement in UI
  - [ ] Replace generic icons
  - [ ] Add to hero sections
  - [ ] Add to category pages
- [ ] Optimize images
  - [ ] WebP format
  - [ ] Proper sizing
  - [ ] Lazy loading

### Category Subdomain Content (Priority 5)
- [ ] cooking.yoohoo.guru
  - [ ] Hero section
  - [ ] Featured Gurus
  - [ ] Learning resources
  - [ ] Affiliate links
- [ ] coding.yoohoo.guru
- [ ] fitness.yoohoo.guru
- [ ] business.yoohoo.guru
- [ ] art.yoohoo.guru

### Informational Pages
- [ ] About Us
  - [ ] Mission and vision
  - [ ] Team information
  - [ ] Platform story
- [ ] How It Works
  - [ ] User journey for Gunus
  - [ ] User journey for Gurus
  - [ ] User journey for Angels
  - [ ] Step-by-step guides
- [ ] Pricing
  - [ ] Pricing tiers
  - [ ] Feature comparison
  - [ ] FAQ about pricing
- [ ] FAQ
  - [ ] Common questions
  - [ ] Troubleshooting
  - [ ] Policy clarifications
- [ ] Contact
  - [ ] Contact form
  - [ ] Support email
  - [ ] Social media links

### Blog & Resources
- [ ] Review AI curation agents
  - [ ] Test news generation
  - [ ] Test blog post generation
- [ ] Manual content creation
  - [ ] Welcome post
  - [ ] Platform guides
  - [ ] Success stories
- [ ] Content management
  - [ ] Admin editing interface
  - [ ] Publishing workflow
  - [ ] SEO optimization

---

## 🧪 TESTING & QA - Ongoing

### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers
  - [ ] iOS Safari
  - [ ] Chrome Android

### Performance Testing
- [ ] Lighthouse scores (target: 90+)
  - [ ] Performance
  - [ ] Accessibility
  - [ ] Best Practices
  - [ ] SEO
- [ ] Core Web Vitals
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1
- [ ] API response times
  - [ ] P50 < 200ms
  - [ ] P95 < 500ms
  - [ ] P99 < 1000ms

### Security Testing
- [ ] Run security audits
  - [ ] npm audit
  - [ ] OWASP ZAP scan
  - [ ] Snyk security scan
- [ ] Penetration testing
  - [ ] Authentication bypasses
  - [ ] XSS vulnerabilities
  - [ ] CSRF protection
- [ ] Data protection
  - [ ] PII handling
  - [ ] Data encryption
  - [ ] Secure storage
- [ ] Compliance checks
  - [ ] GDPR compliance
  - [ ] CCPA compliance

---

## 📊 Progress Tracking

### Overall Completion
- **Critical Items:** 0% complete (0/18)
- **High Priority:** 0% complete (0/48)
- **Medium Priority:** 0% complete (0/64)
- **Low Priority:** 0% complete (0/28)
- **Testing:** 0% complete (0/22)

**Total:** 0% complete (0/180 items)

### Phase Completion
- [ ] Phase 1: Critical Fixes (Week 1)
- [ ] Phase 2: Deployment Verification (Week 1-2)
- [ ] Phase 3: Integration Testing (Week 2-3)
- [ ] Phase 4: Polish (Week 3-4)
- [ ] Phase 5: Enhancement (Week 5-8)
- [ ] Phase 6: Testing & QA (Ongoing)

---

## 🎯 Success Milestones

### Week 2 Milestone
- [ ] Legal documents published
- [ ] Angel's List content fixed
- [ ] Environment variables verified
- [ ] Authentication tested

### Week 4 Milestone
- [ ] All subdomains accessible
- [ ] Payment flows tested
- [ ] Video chat functional
- [ ] Integration testing complete

### Week 8 Milestone
- [ ] Content unique per pillar
- [ ] UI consistent
- [ ] Accessibility compliant
- [ ] Performance optimized

### Week 12 Milestone (Launch Ready)
- [ ] All critical issues resolved
- [ ] Security audit passed
- [ ] Legal review complete
- [ ] Beta testing ready

---

## 📝 Notes & Issues

Use this section to track blockers, questions, and issues:

**Blockers:**
- 

**Questions:**
- 

**Issues:**
- 

---

**Last Updated:** October 17, 2025  
**Status:** Not Started  
**Next Review:** [Date]
