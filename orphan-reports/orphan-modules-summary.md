# Orphan Module Analysis Report

**Generated:** 2025-10-01T15:31:51.910Z

## Summary

- **Total Orphans:** 123
- **Unused Dependencies:** 7
- **Unreachable Modules:** 116
- **Orphaned Files:** 0

## Recommendations

### Remove 7 unused dependencies (medium priority)
These dependencies are taking up space and could pose security risks

**Action:** Run `npm uninstall <package-name>` for each unused dependency

### Remove or refactor 116 unreachable modules (low priority)
These modules are not reachable from any entry point and may be dead code

**Action:** Review each module and either delete it or add proper imports

## Details

### Unused Dependencies
**frontend:** @stripe/react-stripe-js, @stripe/stripe-js, date-fns, framer-motion, react-spring
**backend:** bcryptjs, multer

### Unreachable Modules
**frontend:**
- .eslintrc.js
- jest.config.js
- src/App.analytics.test.js
- src/App.test.js
- src/components/AccessibilityToolbar.js
- src/components/AdminGuard.js
- src/components/BadgeDisplay.js
- src/components/ComingSoon.js
- src/components/ComplianceDashboard.js
- src/components/ComplianceSetup.js
- src/components/EarningsEstimator.js
- src/components/ErrorBoundary.test.js
- src/components/HostSubdomainRouterGate.js
- src/components/LiabilityEnhancementDemo.js
- src/components/LiabilityWaiver.js
- src/components/LiabilityWaiverModal.js
- src/components/LocationMap.js
- src/components/ResourcesSection.js
- src/components/SessionCard.js
- src/components/SkillMatching.js
- src/components/SubdomainLandingPage.test.js
- src/components/VideoChat.js
- src/components/auth/AuthenticationPrompt.js
- src/components/auth/ProtectedRoute.js
- src/components/guru/GuruFeaturedPosts.js
- src/components/guru/GuruHeroSection.js
- src/config/pricing.js
- src/contexts/FeatureFlagsContext.js
- src/contexts/ThemeContext.js
- src/firebase/client.js
- src/hosting/hostRules.js
- src/lib/api.js
- src/lib/featureFlags.js
- src/lib/matchmakingApi.js
- src/lib/prefs.js
- src/lib/skillCategorization.js
- src/lib/skillsApi.js
- src/screens/AboutPage.js
- src/screens/AccountSettingsPage.js
- src/screens/AdminDashboardPage.js
- src/screens/AdminLoginPage.js
- src/screens/AngelsListPage.js
- src/screens/BlogPage.js
- src/screens/ComingSoonPage.js
- src/screens/ComingSoonPages.js
- src/screens/DashboardCoach.js
- src/screens/DashboardPage.js
- src/screens/DashboardUnderstudy.js
- src/screens/EventsPage.js
- src/screens/ForumPage.js
- src/screens/HowItWorksPage.js
- src/screens/MentorshipPage.js
- src/screens/ModifiedMasters.js
- src/screens/NotFoundPage.js
- src/screens/PricingPage.js
- src/screens/PrivacyPolicyPage.js
- src/screens/ProfilePage.js
- src/screens/SafetyPage.js
- src/screens/SkillsPage.js
- src/screens/SubdomainLandingPages.js
- src/screens/SubdomainNotFoundPage.js
- src/screens/SuccessStoriesPage.js
- src/screens/TermsAndConditionsPage.js
- src/screens/account/PayoutsPanel.js
- src/screens/guru/GuruHomePage.js
- src/screens/onboarding/OnboardingCategories.js
- src/screens/onboarding/OnboardingDocuments.js
- src/screens/onboarding/OnboardingPayout.js
- src/screens/onboarding/OnboardingProfile.js
- src/screens/onboarding/OnboardingRequirements.js
- src/screens/onboarding/OnboardingReview.js
- src/screens/onboarding/OnboardingStart.js
- src/setupTests.js
- src/styles/GlobalStyles.js
- src/utils/http.js
- webpack.config.js

**backend:**
- .eslintrc.js
- ai-content-migration.js
- jest.setup.js
- populate-initial-content.js
- seed-content.js
- show-content-summary.js
- src/index.test.js
- src/lib/auth.js
- src/routes/connectExpressLogin.js
- src/scripts/seedCategories.js
- src/utils/skillCategorization.test.js
- tests/account-recovery.test.js
- tests/ai-skill-matching.test.js
- tests/angels-jobs.test.js
- tests/basic.test.js
- tests/cors-config.test.js
- tests/cors-origin-sync.test.js
- tests/cors-subdomain.test.js
- tests/curationAgents.test.js
- tests/environment-validation.test.js
- tests/favicon.test.js
- tests/firebase-validation.test.js
- tests/frontend-serving.test.js
- tests/guru-subdomain-validation-simple.test.js
- tests/headers.test.js
- tests/host-binding.test.js
- tests/instant-payouts.test.js
- tests/liability.test.js
- tests/onboarding-requirements.test.js
- tests/payouts.test.js
- tests/railway-502-fix.test.js
- tests/rate-limit-proxy.test.js
- tests/requirementsMapper.test.js
- tests/secrets-integration.test.js
- tests/seed-test-data.js
- tests/stripe-config.test.js
- tests/stripe-warning.test.js
- tests/test.auth.spec.js
- tests/trust-proxy.test.js
- tests/webhooks.test.js


