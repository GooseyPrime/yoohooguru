# PR Planning Prompt (YooHoo Guru)

When QA tests fail or new scope is added, generate a clear PR plan before coding.

## Structure
- Title: Conventional Commits style (e.g., fix(console): remove error on /coach)
- Scope: Which files/features are touched and why
- Acceptance Criteria: Explicit test IDs/names from /qa/tests or new tests that must pass
- Spec Mapping: Sections from /spec/site-spec.md implemented or modified
- Ops/Compliance Mapping: Rules from /spec/liability-ops-standard.md impacted
- Risk/Impact/Monitoring: Possible regressions (UX, SEO, data, compliance, Stripe, AI drafts, subdomains) and how to check
- Rollback Plan: Exact steps to revert if merged prematurely
- Post-Merge Tasks: Follow-up issues or extensions (tests, docs, cleanup)

## Requirements
- Plan must be surgical (single clear objective).
- Acceptance Criteria must map directly to QA test outputs or new tests.
- Do not expand scope beyond MVP unless explicitly approved.
- Every plan should be copy-pasted into the PR description before implementation.

## Example

Title: fix(payments): ensure payouts panel loads without console errors

Scope: Update PayoutsPanel.js (frontend) and connect.js (backend) to correctly fetch Stripe balance and show loading state.

Acceptance Criteria:
- qa/tests/console.spec.ts: no console errors on /account/payouts
- Stripe test keys: GET /api/connect/balance returns 200

Spec Mapping:
- site-spec.md § Booking & Payments (Stripe-only)

Ops/Compliance Mapping:
- liability-ops-standard.md § Checkout Disclosures (waiver text shown before payment)

Risk/Impact/Monitoring:
- Risk: may break Stripe Connect onboarding flow
- Monitor: run Stripe test account through onboarding + payouts on staging

Rollback Plan:
- Revert commit via GitHub
- Restore previous Stripe env config from .env.example

Post-Merge Tasks:
- Add Playwright test for /account/payouts screen
- Update admin docs on how Stripe Connect balance is displayed
