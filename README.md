# YoohooGuru Platform Implementation

This repository contains the complete implementation of the YoohooGuru three-pillar skill-sharing platform based on the business documentation requirements.

## Platform Overview

YoohooGuru is a comprehensive skill-sharing platform with three distinct pillars:

1. **Coach Guru** (coach.yoohoo.guru) - Paid skill-sharing marketplace with 15% platform commission
2. **Hero Gurus** (heroes.yoohoo.guru) - Free accessible learning for people with disabilities (100% free, no contracts)
3. **Angel's List** (angel.yoohoo.guru) - Gig marketplace for local services with 10-15% tiered commission

## Repository Structure

```
yoohooguru/
├── apps/
│   └── main/                 # Main Next.js application
│       ├── components/       # Reusable components
│       │   ├── ai/           # AI-powered features
│       │   ├── compliance/   # Compliance requirements
│       │   ├── disputes/     # Dispute resolution
│       │   ├── location/     # Location services
│       │   ├── payments/     # Payment processing
│       │   ├── profile/      # Profile management
│       │   ├── ratings/      # Rating and review system
│       │   ├── sessions/     # Session booking
│       │   ├── skills/       # Skill categorization
│       │   └── video/        # Video conferencing
│       ├── pages/            # Page routes
│       │   ├── _apps/        # Subdomain pages
│       │   ├── angel/        # Angel-specific pages
│       │   ├── compliance/   # Compliance pages
│       │   ├── disputes/     # Dispute resolution pages
│       │   ├── guru/         # Guru-specific pages
│       │   ├── heroes/       # Hero Guru-specific pages
│       │   ├── learning/     # AI learning assessment pages
│       │   ├── location/     # Location search pages
│       │   ├── session/      # Session pages
│       │   └── skills/       # Skills marketplace pages
│       └── public/           # Static assets
├── packages/
│   ├── auth/                 # Authentication utilities
│   └── shared/               # Shared components and types
└── backend/                  # Backend services
```

## Dependencies

The implementation includes the following key dependencies:

- `@stripe/stripe-js` - Stripe JavaScript SDK
- `@stripe/react-stripe-js` - React components for Stripe
- `stripe` - Stripe Node.js library
- `@googlemaps/js-api-loader` - Google Maps API loader
- `agora-rtc-sdk-ng` - Agora video conferencing SDK
- `next-auth` - Authentication for Next.js
- `styled-components` - CSS-in-JS styling

## Core Features

### User Role System
- **Gunu** (Learner): Basic learning permissions
- **Guru** (Teacher): Paid skill-sharing capabilities
- **Angel** (Service provider): Gig marketplace participation
- **Hero Guru** (Accessible teacher): Free adaptive learning instruction
- **Admin** (Platform administrator): Management permissions

### Dashboard
Role-based dashboard showing relevant features for each user type:
- Gunu: Skill search, learning schedule, progress tracking, AI matching
- Guru: Teaching profile, session management, earnings tracking, ratings
- Hero Guru: Accessible teaching profile, adaptive sessions, community impact, ratings
- Angel: Service listings, request management, earnings tracking, ratings
- Admin: Analytics, user management, platform settings, content moderation

### Profile Management
Role-specific profile pages with appropriate fields and validation:
- `/guru/profile`
- `/heroes/profile`
- `/angel/profile`

### Skill Marketplace
- Category-based skill browsing with 24 core subdomains
- Search and filtering capabilities
- Detailed category pages with subcategories

### Payment System
- Integrated Stripe payment processing
- Webhook handlers for payment events
- Session booking with integrated payment flow

### Video Conferencing
- Agora-powered real-time video sessions
- Audio/video controls and user management
- Session-specific video rooms

### Location Services
- Google Maps integration for geographical matching
- Location search functionality
- Current location detection

### AI Learning Assessment
- Learning style assessment with 5-question evaluation
- Personalized recommendations based on assessment
- Progress tracking during assessment

### Rating System
- Star-based rating system (1-5 stars)
- Written reviews and feedback
- Average rating display

### Dispute Resolution
- Dispute submission forms
- Dispute type categorization
- Resolution preference options

### Compliance Requirements
- Category-specific compliance rules
- Risk level classification (high, medium, low)
- Detailed requirement documentation

## API Routes

- `/api/stripe/webhook` - Stripe webhook handler for payment events

## Subdomain Pages

- `/pages/_apps/coach/index.tsx` - Coach Guru marketplace
- `/pages/_apps/heroes/index.tsx` - Hero Gurus accessibility platform
- `/pages/_apps/angel/index.tsx` - Angel's List gig marketplace

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

The implementation requires the following environment variables (add to `.env.local`):

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `NEXT_PUBLIC_AGORA_APP_ID` - Agora application ID
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API key
- `GOOGLE_OAUTH_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_OAUTH_CLIENT_SECRET` - Google OAuth client secret
- `NEXTAUTH_SECRET` - NextAuth secret for session encryption

## Implementation Notes

1. This implementation provides a complete frontend structure based on the business documentation
2. Backend services and API integrations are represented with placeholder components
3. Actual API keys and secrets need to be configured for production deployment
4. Database integration and user role assignment would need to be implemented in a production environment
5. Webhook handlers are implemented but require actual Stripe configuration
6. Video conferencing components require actual Agora tokens and channel management
7. Google Maps components require actual API keys and geolocation services

## Changelog

See [CHANGES.md](CHANGES.md) for a comprehensive list of all implemented features and modifications.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.