# Operational & Compliance Standard (MVP)

This file defines the minimum operational guardrails and compliance checks that must be honored in MVP.

## Profile Gate (Required Before Booking)
- Legal name and profile photo
- City/ZIP and short bio
- 18+ attestation
- Phone + email on file
- Stripe Connect Express onboarding completed (account must exist in Stripe)

## Work Classification
A. Casual Help
   - Errands, light cleaning, yard work
   - No professional license required

B. Skilled Odd Jobs
   - Handyman basics, appliance installs (non-gas), basic repairs
   - Tool safety required

C. Skilled Trades (Licensed) — Phase-In
   - Electrical, plumbing, HVAC/refrigerants, gas appliances, pest control, tree felling >15ft
   - Requires trade license + general liability insurance
   - Not bookable in MVP without admin override

D. Transport/Hauling — Phase-In
   - Own vehicle + auto insurance
   - Commercial auto insurance recommended
   - Not bookable in MVP without admin override

E. Childcare/Tutoring/Fitness — Limited MVP
   - Tutoring and fitness allowed with disclaimers
   - Background checks/CPR certification recommended but not enforced in MVP
   - No unsupervised childcare in MVP

F. Cleaning (Paid)
   - Standard cleaning tasks allowed
   - No mold, asbestos, or hazardous material remediation

G. Prohibited (MVP and beyond)
   - Roofing or structural work without license
   - Gas line work without license
   - Hazardous materials, asbestos, lead, medical procedures
   - Armed security or bodyguard services
   - Tree climbing >15ft without ISA arborist credentials
   - Fumigation

## Insurance & Licensing (Future Enforcement)
- Badge system exists but enforcement logic not wired in MVP
- Uploads (license/COI PDFs) may be stored, but not blocking booking yet
- Badges to be displayed in profile once documents exist

## Checkout Disclosures
Every booking flow must show:
- Independent Contractor acknowledgement
- Liability waiver text
- Home access expectations
- 72-hour dispute window
- Link to prohibited categories

## UI Badges
- Verified ID (profile basics complete)
- Stripe Onboarded (Connect account active)
- License on file (future)
- Insurance on file (future)
- Background check (future)

## Admin Queues
- Flagged profiles or listings (stub exists)
- Pending/expiring documents (future)
- High-risk keywords (future)

## Server Guards (MVP)
- Booking blocked if: 
  - Profile incomplete (missing legal name/photo/18+)
  - Stripe Connect onboarding not completed
- Categories C/D require admin approval override until compliance logic is phased in
