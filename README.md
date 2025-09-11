
# yoohoo.guru Platform

A comprehensive skill-sharing platform where users exchange skills, discover purpose, and create exponential community impact through neighborhood-based connections.

## 📋 Table of Contents

- [🚀 Platform Overview](#-platform-overview)
- [📁 Project Structure](#-project-structure)  
- [🏃‍♂️ Quick Start](#️-quick-start)
- [🌍 Deployment](#-deployment)
  - [Vercel + Railway + Firebase Stack](#-recommended-vercel--railway--firebase-stack)
  - [Alternative Deployment Options](#-alternative-deployment-options)
- [📱 User Manual & Platform Features](#-user-manual--platform-features)
  - [Core Features Overview](#-core-features-overview)
  - [Getting Started](#-getting-started---home-page)
  - [Authentication & Account Setup](#-authentication--account-setup)
  - [Skills Marketplace](#-skills-marketplace)
  - [Guru Dashboard](#-guru-teacher-dashboard)
  - [Angel's List Service Marketplace](#️-angels-list---service-marketplace)
  - [Safety & Compliance](#️-safety--compliance-features)
  - [Recent Updates](#-recent-updates-last-4-prs)
- [Environment Configuration](#environment-configuration)
- [🔧 Configuration Management](#-configuration-management)
- [🔌 API Endpoints](#-api-endpoints)
- [🧪 Testing](#-testing)
- [🔒 Security & Deployment Standards](#-security--deployment-standards)
- [🔍 Development Commands](#-development-commands)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🆘 Support](#-support)

## 🚀 Platform Overview

**Status: 🟢 ACTIVE** | **Version: 1.0.0** | **Architecture: Full Stack**

This is a modern, full-stack web application built with:
- **Frontend**: React with Webpack, styled-components, and PWA support
- **Backend**: Node.js with Express, Firebase integration, and comprehensive API
- **Configuration**: Environment-driven architecture for flexible deployment

### ✅ Key Features

- **🎯 Skill Sharing Marketplace** - Connect community members for skill exchange
- **🔐 Firebase Authentication** - Secure user management and authentication
- **💳 Stripe Integration** - Payment processing for premium features
- **🤖 AI-Powered Recommendations** - Smart skill matching using OpenRouter
- **📱 Progressive Web App** - Mobile-optimized with offline capabilities
- **🛡️ Enterprise Security** - Rate limiting, CORS protection, and input validation
- **⚙️ Environment-Driven Configuration** - Fully configurable via environment variables

## 📁 Project Structure

```
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── screens/         # Main page components
│   │   ├── contexts/        # React contexts (Auth, etc.)
│   │   └── utils/           # Frontend utilities
│   ├── public/              # Static assets
│   ├── webpack.config.js    # Webpack configuration
│   └── package.json         # Frontend dependencies
├── backend/                  # Node.js backend API
│   ├── src/
│   │   ├── config/          # Configuration management
│   │   ├── routes/          # API route handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── utils/           # Backend utilities
│   │   └── lib/             # Business logic libraries
│   ├── tests/               # Backend test suites
│   └── package.json         # Backend dependencies
├── docs/                     # Documentation
│   ├── ENVIRONMENT_VARIABLES.md  # Complete env var guide
│   ├── DEPLOYMENT.md         # Deployment instructions
│   ├── RAILWAY_DEPLOYMENT.md # Railway-specific guide
│   └── FIREBASE_POLICY.md    # Firebase usage policy & standards
├── .env.example             # Environment variables template
├── package.json             # Root workspace configuration
└── README.md                # This file
```

## 🏃‍♂️ Quick Start

### Prerequisites

- **Node.js 18+** and npm
- **Firebase project** (for authentication and data)
- **Environment configuration** (see [Environment Variables Guide](./docs/ENVIRONMENT_VARIABLES.md))

### 1. Clone and Install

```bash
git clone https://github.com/GooseyPrime/yoohooguru.git
cd yoohooguru

# Install all dependencies (frontend + backend)
npm run install:all
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# See docs/ENVIRONMENT_VARIABLES.md for complete guide
```

**Minimum required variables:**
```env
# Firebase (required)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_API_KEY=your_api_key

# Security (required for production)
JWT_SECRET=your_super_secret_key

# App Branding (optional, defaults to yoohoo.guru)
APP_BRAND_NAME=yoohoo.guru
REACT_APP_BRAND_NAME=yoohoo.guru
```

### 3. Development

```bash
# Run both frontend and backend
npm run dev

# Or run separately:
npm run dev:frontend  # React dev server on port 3000
npm run dev:backend   # Express API server on port 3001
```

### 4. Production Build

```bash
# Build everything (first build: 15-60+ seconds, subsequent: 4-15 seconds)
npm run build

# Fast build (skips some optimizations for development)
npm run build:fast

# Clean build with optimization and timing
npm run build:clean

# Start production server
npm start
```

**Build Performance Notes:**
- First-time builds (cold cache): 15 seconds - 6+ minutes depending on hardware
- Subsequent builds (warm cache): 4-15 seconds
- Environment factors affect build time (CPU, RAM, storage type, OS)
- See [Build Performance Guide](docs/BUILD_PERFORMANCE.md) for optimization tips

## 🌍 Deployment

The platform supports multiple deployment architectures with complete environment configuration:

### 📁 **Deployment Directory Guide (PowerShell & Terminal)**

**Important**: This is a monorepo with different deployment requirements depending on your target platform. Here's exactly which directory to be in:

#### **For Full-Stack Deployment (Frontend + Backend)**
```powershell
# Navigate to repository root
cd yoohooguru

# These platforms deploy the entire application:
# ✅ Railway (recommended) - deploys both frontend & backend
railway up .

# ✅ Docker - full application deployment  
docker-compose up -d
```

#### **For Frontend-Only Deployment**
```powershell
# Navigate to frontend directory
cd yoohooguru/frontend

# These platforms deploy only the React frontend:
# ✅ Vercel - frontend hosting
npx vercel --prod

# ✅ Netlify - frontend hosting
netlify deploy --prod

# ✅ Firebase Hosting - frontend hosting
firebase deploy --only hosting
```

#### **For Backend-Only Deployment**
```powershell
# Navigate to backend directory  
cd yoohooguru/backend

# These platforms deploy only the Node.js API:
# ✅ Railway (backend service only)
railway up

# ✅ Heroku - backend hosting
heroku create your-app-name
git push heroku main
```

#### **Quick Reference by Platform**

| Platform | Directory | Command | Deploys |
|----------|-----------|---------|---------|
| **Railway** (Full-Stack) | `yoohooguru/` | `railway up .` | Frontend + Backend |
| **Railway** (Backend-Only) | `yoohooguru/backend/` | `railway up` | Backend API only |
| **Vercel** | `yoohooguru/frontend/` | `npx vercel --prod` | Frontend only |
| **Netlify** | `yoohooguru/frontend/` | `netlify deploy --prod` | Frontend only |
| **Firebase Hosting** | `yoohooguru/frontend/` | `firebase deploy --only hosting` | Frontend only |
| **Docker** | `yoohooguru/` | `docker-compose up -d` | Frontend + Backend |
| **Heroku** | `yoohooguru/backend/` | `git push heroku main` | Backend only |

#### **Environment Variables by Deployment Type**

**Frontend-Only Deployment** - Set these in your hosting platform dashboard:
```env
REACT_APP_API_URL=https://your-backend.railway.app/api
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_BRAND_NAME=yoohoo.guru
```

**Backend-Only Deployment** - Set these in your hosting platform dashboard:
```env
NODE_ENV=production
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_API_KEY=your_key
JWT_SECRET=your_secret_key
```

**Full-Stack Deployment** - Set both frontend and backend variables in your platform dashboard.

### 🚀 **Recommended: Vercel + Railway + Firebase Stack**

The optimal production setup for yoohoo.guru combines:
- **[Vercel](https://vercel.com)** - Frontend deployment (React PWA)
- **[Railway](https://railway.app)** - Backend API deployment (Node.js)  
- **[Firebase](https://firebase.google.com)** - Database, authentication, and real-time features

#### Quick Deploy (5 minutes)

**Frontend to Vercel:**
```powershell
# Navigate to frontend directory (IMPORTANT: Must be in frontend/ directory)
cd yoohooguru/frontend

# Deploy frontend to Vercel
npx vercel --prod

# Set environment variables in Vercel dashboard
REACT_APP_API_URL=https://your-backend.railway.app/api
REACT_APP_FIREBASE_API_KEY=your_firebase_key
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
```

#### Detailed Vercel Frontend Setup

**Prerequisites:**
- Vercel account ([sign up free](https://vercel.com))
- GitHub repository connected to Vercel

**Step 1: Initial Deployment**
```powershell
# Navigate to frontend directory (IMPORTANT: Must be in frontend/ directory)
cd yoohooguru/frontend

# Deploy to Vercel
npx vercel --prod
```

**Step 2: Project Configuration**
Create `frontend/vercel.json`:
```json
{
  "framework": "webpack",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "functions": {},
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": { "cache-control": "s-maxage=31536000,immutable" },
      "dest": "/static/$1"
    },
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ],
  "env": {
    "REACT_APP_API_URL": "@react_app_api_url",
    "REACT_APP_FIREBASE_API_KEY": "@react_app_firebase_api_key",
    "REACT_APP_FIREBASE_PROJECT_ID": "@react_app_firebase_project_id",
    "REACT_APP_FIREBASE_AUTH_DOMAIN": "@react_app_firebase_auth_domain",
    "REACT_APP_BRAND_NAME": "@react_app_brand_name"
  }
}
```

**Step 3: Environment Variables in Vercel Dashboard**
```bash
# Required - Set in Vercel project settings
REACT_APP_API_URL=https://your-backend.railway.app/api
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com

# Optional - Branding customization
REACT_APP_BRAND_NAME=yoohoo.guru
REACT_APP_DISPLAY_NAME=yoohoo.guru
REACT_APP_SUPPORT_EMAIL=support@yoohoo.guru
```

**Step 4: Custom Domain (Optional)**
1. Add domain in Vercel dashboard
2. Configure DNS to point to Vercel
3. SSL certificate auto-provisioned

#### Detailed Railway Backend Setup

**Prerequisites:**
- Railway account ([sign up free](https://railway.app))
- Repository ready for deployment

**Step 1: Deploy Backend**
```powershell
# Install Railway CLI
npm install -g @railway/cli
railway login

# Navigate to repository root (IMPORTANT: Must be in root directory)
cd yoohooguru

# Deploy the entire application (frontend + backend)
railway up .
```

**Step 2: Environment Variables in Railway Dashboard**
```bash
# Core Configuration
railway variables set NODE_ENV=production
railway variables set PORT=8000  # Railway will override this

# Firebase Configuration  
railway variables set FIREBASE_PROJECT_ID=your_project_id
railway variables set FIREBASE_API_KEY=your_api_key
railway variables set FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
railway variables set FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
railway variables set FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your_project.iam.gserviceaccount.com
railway variables set FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----"

# Security & Authentication
railway variables set JWT_SECRET=your_super_secret_jwt_key
railway variables set JWT_EXPIRES_IN=7d

# External APIs
railway variables set OPENROUTER_API_KEY=your_openrouter_key
railway variables set STRIPE_SECRET_KEY=sk_live_your_stripe_key
railway variables set STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# CORS (update with your Vercel domain)
railway variables set CORS_ORIGIN_PRODUCTION=https://your-app.vercel.app,https://your-custom-domain.com
```

**Step 3: Domain Configuration**
```bash
# Add custom domain (optional)
railway domain add api.yourdomain.com
```

#### Firebase Database Setup

**Step 1: Create Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create new project: "yoohoo-guru-production"
3. Enable Realtime Database and Firestore

**Step 2: Security Rules**
Set in Firebase Console → Database → Rules:
```javascript
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'",
        ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('role').val() === 'admin'"
      }
    },
    "skills": {
      ".read": true,
      ".write": "auth !== null"
    },
    "exchanges": {
      "$exchangeId": {
        ".read": "data.child('teacherId').val() === auth.uid || data.child('learnerId').val() === auth.uid",
        ".write": "data.child('teacherId').val() === auth.uid || data.child('learnerId').val() === auth.uid"
      }
    }
  }
}
```

**Step 3: Authentication Setup**
1. Enable Google Sign-In in Authentication → Sign-in method
2. Add authorized domains: `localhost`, `your-app.vercel.app`, `yourdomain.com`
3. Download service account key for backend

**Step 4: Indexes for Performance**
```json
{
  "indexes": {
    "users": {
      "tier": {},
      "location": {},
      "verified": {}
    },
    "exchanges": {
      "teacherId": {},
      "learnerId": {},
      "status": {},
      "createdAt": {}
    },
    "skills": {
      "category": {},
      "subcategory": {},
      "location": {}
    }
  }
}
```

#### Deployment Verification & Testing

**Step 1: Verify Local Build**
```bash
# Test the complete build process locally
npm run install:all
npm run build

# Verify individual components
npm run test
npm run lint
```

**Step 2: Test Production Deployment**
```bash
# Test frontend build (should create dist/ folder)
cd frontend
npm run build
ls -la dist/  # Should contain index.html, static assets

# Test backend startup
cd ../backend  
npm start
# Should show: "Server running on port 3001"
```

**Step 3: Validate Environment Setup**
```bash
# Validate Firebase configuration (if configured)
npm run firebase:validate

# Validate Railway deployment readiness
npm run railway:validate

# Check environment variables
node -e "console.log('Environment check:', process.env.NODE_ENV)"
```

**Step 4: Post-Deployment Health Checks**
```bash
# Frontend health check
curl https://your-app.vercel.app

# Backend health check  
curl https://your-backend.railway.app/health

# API functionality test
curl https://your-backend.railway.app/api
```

**Expected Responses:**
- Frontend: Should load React application homepage
- Backend `/health`: `{"status":"OK","timestamp":"...","uptime":...}`
- Backend `/api`: `{"message":"yoohoo.guru API is running","version":"1.0.0"}`

#### Troubleshooting Common Issues

**Vercel Build Failures:**
```bash
# Check build logs in Vercel dashboard
# Common fixes:
- Ensure all REACT_APP_ environment variables are set
- Verify Node.js version compatibility (18+)
- Check for missing dependencies in frontend/package.json
```

**Railway Deployment Issues:**
```bash
# Check Railway logs
railway logs --tail

# Common fixes:
- Verify PORT environment variable is not hardcoded
- Ensure all Firebase environment variables are set
- Check that /health endpoint returns 200 status
```

**Firebase Connection Problems:**
```bash
# Validate Firebase configuration
# Common fixes:
- Verify project ID matches environment variables
- Check Firebase rules allow read/write access
- Ensure service account credentials are valid
```

### 📋 **Alternative Deployment Options**

- **[Railway Full-Stack](./docs/RAILWAY_DEPLOYMENT.md)** - Deploy from `yoohooguru/` (root directory)
- **[Netlify + Railway](./docs/DEPLOYMENT.md)** - Frontend from `yoohooguru/frontend/`, Backend from `yoohooguru/backend/`
- **[Docker](./docker-compose.yml)** - Deploy from `yoohooguru/` (root directory)
- **[Custom Infrastructure](./docs/DEPLOYMENT.md)** - Deploy from appropriate directory based on your setup

**💡 Tip**: Always check the [Deployment Directory Guide](#-deployment-directory-guide-powershell--terminal) above to ensure you're in the correct directory for your chosen platform.

### 🚀 **Production Deployment Checklist**

**Pre-Deployment:**
- [ ] Firebase project configured with proper security rules
- [ ] Environment variables documented and secured
- [ ] Local build and tests passing (`npm run build && npm test`)
- [ ] Domain names registered and DNS configured

**Vercel Frontend:**
- [ ] Vercel account connected to GitHub repository
- [ ] All `REACT_APP_*` environment variables set in Vercel dashboard
- [ ] Custom domain added and SSL certificate active
- [ ] Build and deployment successful

**Railway Backend:**
- [ ] Railway CLI installed and authenticated
- [ ] All required environment variables set in Railway dashboard
- [ ] Health check endpoint responding (`/health`)
- [ ] API endpoints functional (`/api`)

**Firebase Database:**
- [ ] Security rules configured for production
- [ ] Indexes created for optimal query performance
- [ ] Authentication providers enabled and configured
- [ ] Backup strategy implemented

**Post-Deployment:**
- [ ] End-to-end user flows tested (registration, login, skill booking)
- [ ] Payment processing validated (Stripe integration)
- [ ] Email notifications working
- [ ] Mobile/PWA functionality verified
- [ ] Performance monitoring setup (optional)

## 📱 User Manual & Platform Features

### 🎯 **Core Features Overview**

**yoohoo.guru** is a comprehensive skill-sharing platform that connects community members for mutual learning and professional services.

#### **For Skill Learners**
- **Skill Discovery** - Browse hundreds of skills across 15+ categories
- **Teacher Matching** - AI-powered recommendations for perfect skill matches
- **Booking System** - Schedule lessons and services with integrated payments
- **Progress Tracking** - Monitor your learning journey and achievements
- **Community Groups** - Join skill-specific communities and discussions

#### **For Skill Teachers (Gurus)**
- **Profile Creation** - Showcase your expertise with media, credentials, and reviews
- **Service Listings** - Create offerings for lessons, consulting, and projects
- **Availability Management** - Set schedules and manage booking calendar
- **Payment Processing** - Secure payments via Stripe with instant payouts
- **Student Communication** - In-platform messaging and video calls

#### **For Service Seekers (Angel's List)**
- **Job Posting** - Post projects and tasks needing skilled professionals
- **Talent Discovery** - Browse verified professionals in your area
- **Proposal Management** - Review bids and select the best candidates
- **Project Tracking** - Monitor progress and handle milestone payments
- **Quality Assurance** - Rating and review system for completed work

### 🏠 **Getting Started - Home Page**

**Hero Section**: Features the mission statement *"A community where you can swap skills, share services, or find trusted local help"* with primary navigation to:
- **Learn a Skill** - Browse teachers and book lessons
- **Teach a Skill** - Create your guru profile and start earning
- **Find Help** - Post jobs on Angel's List marketplace

**Featured Content**:
- **Popular Skills** - Trending categories like cooking, music, coding
- **Success Stories** - Community testimonials and achievements  
- **Local Gurus** - Nearby teachers and service providers

### 🔐 **Authentication & Account Setup**

#### **User Registration**
1. **Sign Up Options**:
   - Email and password registration
   - Google OAuth integration
   - Facebook social login (when enabled)

2. **Profile Completion**:
   - Basic information (name, location, bio)
   - Skill interests and teaching expertise
   - Verification documents (optional for basic features)

3. **Account Verification**:
   - Email confirmation required
   - Phone verification (optional)
   - Identity verification for premium features

#### **User Roles & Permissions**

**Basic User** (Free):
- Browse skills and teachers
- Book standard lessons
- Basic profile features
- Community participation

**Verified Guru** (Enhanced):
- Create skill offerings  
- Receive payments via Stripe Connect
- Advanced profile with media uploads
- Priority in search results
- Access to analytics dashboard

**Professional Service Provider**:
- Angel's List marketplace access
- Project bidding capabilities
- Background check verification
- Commercial insurance options
- Advanced booking management

### 🎓 **Skills Marketplace**

#### **Skill Categories**
The platform organizes skills into 15+ major categories:

**Creative Arts**: Music, Art, Photography, Writing, Crafts
**Technical Skills**: Programming, Web Design, Data Science, Engineering  
**Life Skills**: Cooking, Home Improvement, Gardening, Organization
**Health & Fitness**: Personal Training, Yoga, Nutrition, Mental Health
**Business Skills**: Marketing, Finance, Leadership, Entrepreneurship
**Language & Communication**: Foreign Languages, Public Speaking, Writing

#### **Finding the Right Teacher**
1. **Search & Filters**:
   - Skill category and subcategory
   - Geographic proximity (5-50 mile radius)
   - Price range and session length
   - Availability and scheduling
   - Teacher experience level and ratings

2. **AI-Powered Matching**:
   - Personalized recommendations based on your profile
   - Learning style compatibility assessment
   - Schedule and location optimization
   - Price and budget alignment

3. **Teacher Profiles**:
   - Detailed bio and teaching philosophy
   - Skills offered with experience levels
   - Portfolio samples and student work
   - Reviews and ratings from previous students
   - Video introduction and teaching samples
   - Availability calendar and booking options

#### **Booking Process**
1. **Lesson Selection**:
   - Choose skill and specific lesson type
   - Select session length (30min, 1hr, 2hr, custom)
   - Pick location (teacher's space, your location, online)

2. **Scheduling**:
   - View teacher's available time slots
   - Select preferred date and time
   - Add special requests or preparation notes

3. **Payment & Confirmation**:
   - Secure payment via Stripe
   - Automatic confirmation emails
   - Calendar integration (Google, Apple, Outlook)
   - Pre-session preparation materials

### 👨‍🏫 **Guru (Teacher) Dashboard**

#### **Getting Started as a Guru**
1. **Profile Setup**:
   - Complete verification process
   - Upload professional photos and videos
   - Add credentials and certifications
   - Set teaching rates and availability

2. **Stripe Connect Onboarding**:
   - Link bank account for payments
   - Complete tax information (1099 handling)
   - Set payout preferences (weekly/instant)
   - Configure payment methods for students

3. **Skill Offerings Creation**:
   - Define what you teach and skill levels
   - Create lesson packages and pricing
   - Set location preferences and travel radius
   - Upload teaching materials and resources

#### **Managing Your Business**
1. **Booking Management**:
   - View upcoming lessons in calendar format
   - Accept/decline lesson requests
   - Manage recurring student sessions
   - Handle cancellations and rescheduling

2. **Student Communication**:
   - In-platform messaging system
   - Video call integration for online lessons
   - Assignment and homework management
   - Progress tracking and feedback tools

3. **Financial Management**:
   - Earnings dashboard with analytics
   - Payment history and transaction details
   - Tax document generation (1099-NEC)
   - Payout management and scheduling

4. **Performance Analytics**:
   - Student satisfaction ratings
   - Booking conversion rates
   - Profile view and inquiry statistics
   - Revenue trends and projections

### 🛠️ **Angel's List - Service Marketplace**

#### **For Service Seekers (Posting Jobs)**
1. **Job Creation**:
   - Select service category (handyman, tech, creative, etc.)
   - Describe project scope and requirements
   - Set budget range and timeline
   - Add photos or reference materials
   - Specify location and access requirements

2. **Talent Selection**:
   - Review professional profiles and proposals
   - Compare pricing and availability
   - Check ratings, reviews, and portfolios
   - Interview candidates via platform messaging
   - Select provider and finalize agreement

3. **Project Management**:
   - Milestone-based payment system
   - Progress updates and photo documentation
   - Change request and scope management
   - Quality assurance and completion review

#### **For Service Providers (Finding Work)**
1. **Professional Setup**:
   - Complete business profile with licenses
   - Upload portfolio and previous work samples
   - Set service areas and specializations
   - Configure pricing and availability

2. **Job Bidding**:
   - Browse available projects in your area
   - Submit detailed proposals with pricing
   - Showcase relevant experience and examples
   - Communicate directly with potential clients

3. **Project Execution**:
   - Accept approved projects and payments
   - Update progress with photos and notes
   - Handle client communication and requests
   - Complete projects and request reviews

### 🛡️ **Safety & Compliance Features**

#### **Work Classification System**
The platform categorizes services into safety-appropriate classes:

**Class A - Casual Help** ✅ *Available at Launch*
- Light errands and organization
- Basic tutoring and homework help
- Simple technology assistance
- *Requirements*: ID recommended

**Class B - Odd Jobs** ✅ *Available at Launch*  
- Basic handyman work and repairs
- Furniture assembly and mounting
- Basic lawn care and gardening
- *Requirements*: General liability insurance recommended

**Class C - Skilled Trades** ⏳ *Phased Rollout*
- Electrical, plumbing, HVAC work
- Major home renovations
- Professional installations
- *Requirements*: Valid trade license + GL insurance

**Class D - Transportation** ⏳ *Phased Rollout*
- Moving and hauling services  
- Delivery and logistics
- Vehicle-based services
- *Requirements*: Valid driver's license + auto insurance

**Class E - Childcare/Tutoring** ✅ *Available with Limits*
- Babysitting and childcare
- Academic tutoring and test prep
- Youth coaching and mentoring
- *Requirements*: Background check, CPR certification

**Class F - Cleaning Services** ✅ *Available at Launch*
- Deep cleaning and move-out cleans
- Regular house cleaning services
- Organization and decluttering
- *Requirements*: General liability insurance recommended

**Class G - Prohibited** ❌ *Not Allowed*
- Roofing and high-risk construction
- Gas line and major electrical work
- Medical or healthcare services
- Legal or financial advice

#### **Safety Features**
- **Identity Verification**: Photo ID and address confirmation
- **Background Checks**: Criminal history screening for child/elder care
- **Insurance Verification**: Liability and professional coverage validation
- **Secure Payments**: All transactions through Stripe with dispute resolution
- **Rating System**: Two-way reviews for accountability
- **Emergency Support**: 24/7 platform support for active sessions

### 💬 **Communication & Community**

#### **Messaging System**
- **Direct Messages**: Private conversations between users
- **Group Chats**: Skill-specific community discussions
- **Video Calls**: Integrated video for online lessons and consultations
- **File Sharing**: Exchange documents, photos, and resources
- **Translation**: Multi-language support for diverse communities

#### **Community Features**
- **Skill Groups**: Join communities around specific interests
- **Local Events**: Discover workshops and meetups in your area
- **Success Stories**: Share achievements and learning milestones
- **Q&A Forums**: Get advice from experts and peers
- **Resource Library**: Access guides, tutorials, and learning materials

### 📊 **Analytics & Insights**

#### **For Learners**
- **Learning Progress**: Track skills mastered and hours invested
- **Goal Setting**: Set and monitor learning objectives
- **Achievement Badges**: Earn recognition for milestones
- **Spending Analytics**: Monitor learning investment and ROI

#### **For Teachers**
- **Earnings Dashboard**: Revenue tracking and forecasting
- **Student Progress**: Monitor learner advancement and satisfaction
- **Performance Metrics**: Booking rates, cancellations, and reviews
- **Market Analytics**: Demand trends in your skill areas

#### **For Service Providers**
- **Business Dashboard**: Project pipeline and revenue tracking
- **Client Analytics**: Repeat business and referral rates
- **Market Opportunities**: Trending services in your area
- **Performance Scoring**: Rating trends and improvement areas

### 🔧 **Advanced Features**

#### **API Integration**
- **Calendar Sync**: Google Calendar, Apple Calendar, Outlook integration
- **Payment Processing**: Stripe Connect for seamless transactions
- **Video Conferencing**: Zoom, Google Meet, and native video calls
- **Document Storage**: Secure file storage and sharing
- **Notification System**: Email, SMS, and push notifications

#### **Mobile Experience**
- **Progressive Web App**: Native app experience in browsers
- **Offline Capabilities**: Access core features without internet
- **Push Notifications**: Real-time alerts for bookings and messages
- **Mobile Payments**: Touch ID and Face ID payment authentication
- **Location Services**: GPS-based teacher and service discovery

### 📞 **Support & Help**

#### **Getting Help**
- **Help Center**: Comprehensive guides and FAQs
- **Live Chat**: Real-time support during business hours
- **Email Support**: support@yoohoo.guru for detailed issues
- **Video Tutorials**: Step-by-step platform walkthroughs
- **Community Support**: Peer assistance in forums

#### **Safety Reporting**
- **Report Issues**: Easy reporting for safety or quality concerns
- **Emergency Contact**: 24/7 support for active sessions
- **Dispute Resolution**: Mediation services for conflicts
- **Fraud Protection**: Secure reporting for suspicious activity

### 🆕 **Recent Updates (Last 4 PRs)**

#### **PR #107 - CI Workflow & Image Fixes** ✅ *Completed*
- Fixed TypeError in CI workflow for reliable deployments
- Added missing favicon.ico to prevent browser errors
- Fixed hardcoded production URLs in image loading
- Enhanced error handling in logger utilities
- Updated environment variable documentation

#### **PR #105 - Liability & Compliance System** ✅ *Completed*
- **Angel's List MVP**: Complete job posting and bidding marketplace
- **SkillShare MVP**: Enhanced skill discovery with AI matching
- **Subdomain Architecture**: Individual guru domain support  
- **Compliance System**: Work classification and safety requirements
- **Firebase Authentication**: Unified auth across all platform features
- **Workflow Fixes**: Resolved all critical CI/CD infrastructure issues

#### **PR #101 - Performance Optimizations** ✅ *Completed*
- **Webpack Optimization**: 4-5x faster build times with thread-loader
- **Docker Multi-Stage**: 40x+ faster subsequent builds with layer caching
- **Production Configuration**: Optimized nginx setup for static assets
- **Bundle Analysis**: Added tools for monitoring and optimizing bundle sizes

#### **PR #99 - Security & UX Improvements** ✅ *Completed*
- **CSP Fixes**: Resolved Content Security Policy violations for Firebase
- **Form Enhancement**: Added autocomplete attributes for better UX
- **Browser Compatibility**: Fixed authentication popup blocking issues
- **Accessibility**: Improved form accessibility with proper autocomplete

This comprehensive platform provides everything needed for a thriving skill-sharing community with enterprise-grade safety, security, and user experience features.

### Environment Configuration

This platform is **fully environment-driven** with 40+ configurable variables:

- **🎨 Branding**: Customize app name, emails, contact info
- **🔗 URLs**: Configure domains, CORS origins, API endpoints  
- **🔧 Performance**: Adjust rate limits, cache settings, file upload limits
- **🚀 Features**: Enable/disable features via feature flags
- **🔐 Security**: Configure secrets, authentication, permissions

**📋 [Complete Environment Variables Guide](./docs/ENVIRONMENT_VARIABLES.md)**

## 🔧 Configuration Management

### Centralized Configuration

The platform uses a centralized configuration system with validation:

```javascript
// Backend configuration with validation
const { getConfig, validateConfig } = require('./backend/src/config/appConfig');
const config = getConfig();        // Load all environment variables
validateConfig(config);            // Validate required variables
```

### Environment-Specific Settings

```bash
# Development (automatic defaults)
NODE_ENV=development

# Production (requires all security variables)
NODE_ENV=production
JWT_SECRET=required_in_production
FIREBASE_PROJECT_ID=required_in_production
```

### Feature Flags

Control feature availability across environments:

```env
# Feature flags (environment-driven)
FEATURE_AI_RECOMMENDATIONS=true
FEATURE_DARK_MODE=false
FEATURE_MOBILE_APP=true
ADMIN_WRITE_ENABLED=false
```

## 🔌 API Endpoints

### Core API
- **GET /api** - API status and welcome message
- **GET /health** - Health check with system info
- **GET /api/feature-flags** - Available feature flags

### Authentication & Users
- **POST /api/auth/login** - User authentication
- **POST /api/auth/register** - User registration
- **GET /api/users/profile** - User profile management

### Skills & Exchanges
- **GET /api/skills** - Browse available skills
- **POST /api/skills** - Create skill offering
- **GET /api/exchanges** - Skill exchange history
- **POST /api/exchanges** - Request skill exchange

### Payments & Premium
- **POST /api/payments/create-intent** - Create payment
- **POST /api/payments/webhook** - Stripe webhook handler

### AI & Recommendations
- **POST /api/ai/recommendations** - Get AI-powered skill matches
- **POST /api/ai/chat** - AI assistant for skill guidance

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests separately
npm run test:frontend   # React component tests
npm run test:backend    # Express API tests

# Run with coverage
npm run test:coverage
```

### Test Coverage
- **Backend**: 31 tests covering API endpoints, utilities, and business logic
- **Frontend**: Component testing with Jest and React Testing Library
- **Integration**: End-to-end API testing with supertest

## 🔒 Security & Deployment Standards

### Firebase Production Policy

**🚨 Important**: This project enforces strict Firebase usage policies to ensure production deployments use live cloud infrastructure.

- **✅ Production/Staging**: Must use live Firebase projects only
- **❌ Prohibited**: Emulators, mocks, or demo configurations in deployed environments  
- **🔍 Enforcement**: Automated validation in CI/CD pipeline
- **📋 Documentation**: See [Firebase Policy Guide](./docs/FIREBASE_POLICY.md)

```bash
# Validate Firebase configuration before deployment
./scripts/validate-firebase-production.sh
```

### Environment Security
- All secrets managed via environment variables
- No hardcoded credentials in source code
- Production configurations validated at build time
- Separate Firebase projects for different environments

## 🔍 Development Commands

```bash
# Install dependencies
npm run install:all

# Development
npm run dev                 # Start both frontend and backend
npm run dev:frontend        # Frontend only (port 3000)
npm run dev:backend         # Backend only (port 3001)

# Building
npm run build               # Build both for production (see performance notes above)
npm run build:fast          # Fast build (skips optimizations)
npm run build:clean         # Clean build with optimization script
npm run build:analyze       # Build with bundle analysis
npm run build:frontend      # Build React app only
npm run build:backend       # Prepare backend for production

# Testing
npm test                    # Run all tests
npm run lint                # Check code style
npm run format              # Format code

# Deployment
npm start                   # Start production server
npm run deploy              # Deploy to configured services
```

## 🔒 Security Features

- **🛡️ Input Validation** - Comprehensive request validation with express-validator
- **🔐 Authentication** - Firebase Auth integration with JWT tokens
- **🚦 Rate Limiting** - Configurable rate limits per endpoint
- **🌐 CORS Protection** - Environment-configurable CORS origins
- **🔒 Helmet.js** - Security headers and protection middleware
- **📝 Audit Logging** - Comprehensive request/response logging

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Configure environment** (copy `.env.example` to `.env`)
4. **Make changes** with tests
5. **Run tests** (`npm test`)
6. **Commit changes** (`git commit -m 'Add amazing feature'`)
7. **Push to branch** (`git push origin feature/amazing-feature`)
8. **Open Pull Request**

### Development Guidelines

- **Environment-driven**: All configuration via environment variables
- **Test coverage**: Add tests for new features
- **Documentation**: Update docs for configuration changes
- **Security**: Follow security best practices
- **Performance**: Consider performance impact of changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **📚 Documentation**: [docs/](./docs/) directory
- **🐛 Issues**: [GitHub Issues](https://github.com/GooseyPrime/yoohooguru/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/GooseyPrime/yoohooguru/discussions)
- **📧 Contact**: support@yoohoo.guru (configurable via `APP_SUPPORT_EMAIL`)

---

**Built with ❤️ for community skill sharing and exponential impact** 🚀

## Stripe Connect (Express)

Endpoints:
- POST `/api/connect/start`   → creates or reuses Express account and returns onboarding link
- GET  `/api/connect/status`  → returns charges/payouts readiness
- POST `/api/webhooks/stripe` → Stripe webhook (use raw body)

Webhook URL (prod): `https://yoohoo.guru/api/webhooks/stripe`  
Set `STRIPE_WEBHOOK_SECRET` from the Dashboard after adding the endpoint.

Booking charges should use Stripe Checkout with:
- `payment_intent_data.application_fee_amount`
- `payment_intent_data.transfer_data.destination = {connectedAccountId}`

Environment:
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `PUBLIC_BASE_URL`

The server will start on `http://localhost:8000`

### 5. Access the API

- **Root endpoint**: http://localhost:8000/
- **Health check**: http://localhost:8000/health
- **API documentation**: http://localhost:8000/docs
- **Alternative docs**: http://localhost:8000/redoc

## Testing

### Run All Tests

```bash
pytest tests/ -v
```

### Run Specific Test Classes

```bash
# Test root endpoint
pytest tests/test_main.py::TestRootEndpoint -v

# Test health endpoint
pytest tests/test_main.py::TestHealthEndpoint -v

# Test API documentation
pytest tests/test_main.py::TestAPIDocumentation -v
```

### Test Coverage

```bash
# Install coverage if not already installed
pip install coverage

# Run tests with coverage
coverage run -m pytest tests/
coverage report
coverage html  # Generate HTML coverage report
```

## Railway Deployment

### Quick Deploy to Railway

The easiest way to deploy yoohoo.guru backend to production:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy from repository root
railway up .
```

The repository is pre-configured for Railway with:
- `railway.json` - Deployment configuration
- `Procfile` - Process specification
- Health checks at `/health` endpoint

### Environment Variables for Railway

Set these in your Railway dashboard:

```bash
railway variables set NODE_ENV=production
railway variables set FIREBASE_PROJECT_ID=your_project_id
railway variables set FIREBASE_API_KEY=your_api_key
railway variables set JWT_SECRET=your_secret_key
# ... other variables from .env.example
```

For detailed Railway deployment instructions, see [Railway Deployment Guide](docs/RAILWAY_DEPLOYMENT.md).

## Docker Deployment

### Build Docker Image

```bash
docker build -t yoohooguru-mcp-server .
```

### Run Docker Container

```bash
# Run in foreground
docker run -p 8000:8000 yoohooguru-mcp-server

# Run in background
docker run -d -p 8000:8000 --name yoohooguru-server yoohooguru-mcp-server

# View logs
docker logs yoohooguru-server

# Stop container
docker stop yoohooguru-server
```

### Docker Compose (Optional)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  yoohooguru-server:
    build: .
    ports:
      - "8000:8000"
    environment:
      - ENVIRONMENT=production
      - LOG_LEVEL=info
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

Run with Docker Compose:

```bash
docker-compose up -d
```

## Environment Variables

The server supports the following environment variables for configuration:

| Variable | Default | Description |
|----------|---------|-------------|
| `HOST` | `0.0.0.0` | Server host address |
| `PORT` | `8000` | Server port |
| `LOG_LEVEL` | `info` | Logging level (debug, info, warning, error) |
| `ENVIRONMENT` | `development` | Environment (development, staging, production) |
| `DATABASE_URL` | `None` | Database connection URL (for future use) |
| `REDIS_URL` | `None` | Redis connection URL (for future use) |
| `SECRET_KEY` | `None` | Secret key for JWT tokens (for future use) |

Example:

```bash
export HOST=0.0.0.0
export PORT=8080
export LOG_LEVEL=debug
export ENVIRONMENT=development
python src/main.py
```

## API Response Format

All endpoints return JSON responses with the following structure:

```json
{
    "status": "healthy",
    "message": "yoohoo.guru MCP Server is running",
    "timestamp": "2025-08-30T19:21:46.822343Z",
    "version": "1.0.0"
}
```

## Code Quality

The codebase follows modern Python best practices:

- **PEP 8** compliance for code style
- **Type hints** for all functions and methods
- **Pydantic models** for data validation
- **Comprehensive docstrings** for all modules and functions
- **Structured logging** for debugging and monitoring

## Development Guidelines

### Adding New Endpoints

1. Add new route methods to the `MCPServer` class in `src/main.py`
2. Create corresponding Pydantic models if needed
3. Add comprehensive tests in `tests/test_main.py`
4. Update this README with new endpoint documentation

### Extending the Configuration

1. Add new settings to the `Settings` class in `src/config.py`
2. Update environment variable documentation in this README
3. Add corresponding tests if the settings affect functionality

## Monitoring and Health Checks

### Current Status: ✅ ACTIVE

The MCP server is currently **ACTIVE** and operational. All health checks pass successfully.

The server provides comprehensive health check endpoints suitable for:

- **Load balancers** (ALB, HAProxy, etc.)
- **Container orchestration** (Kubernetes, Docker Swarm)
- **Monitoring systems** (Prometheus, DataDog, etc.)

### Health Endpoints

| Endpoint | Purpose | Response |
|----------|---------|----------|
| `GET /` | Service status | Returns server running confirmation |
| `GET /health` | Health monitoring | Returns operational status for load balancers |

### Verify Server Status

```bash
# Check if server is running
curl http://localhost:8000/health

# Expected response:
{
  "status": "healthy",
  "message": "Service is operational",
  "timestamp": "2025-08-30T21:00:17.783451Z",
  "version": "1.0.0"
}

# Test all endpoints
curl http://localhost:8000/           # Root status
curl http://localhost:8000/docs       # API documentation
curl http://localhost:8000/openapi.json  # OpenAPI schema
```

### Automated Status Verification

Use the provided verification script for comprehensive status checking:

```bash
# Run comprehensive status check
python scripts/verify_mcp_status.py

# Output JSON for monitoring integration
python scripts/verify_mcp_status.py --json

# Check remote server
python scripts/verify_mcp_status.py --url https://your-domain.com
```

**Example output:**
```
🎯 yoohoo.guru MCP Server Status Check
Testing server at: http://localhost:8000
------------------------------------------------------------
✅ Root endpoint (/)
   Status: healthy
   Message: yoohoo.guru MCP Server is running
   ✓ Response matches expected format
   Response time: 0.003s

✅ Health check (/health)
   Status: healthy
   Message: Service is operational
   Response time: 0.001s

✅ API Documentation (/docs)
   Response time: 0.001s

✅ OpenAPI Schema (/openapi.json)
   Response time: 0.002s

------------------------------------------------------------
🎉 MCP Server Status: ACTIVE - All checks passed!
```

### Health Check Integration

For production monitoring, configure your monitoring system to:

1. **Endpoint**: `GET /health`
2. **Expected Status Code**: `200`
3. **Expected Response**: `{"status": "healthy"}`
4. **Check Interval**: 30 seconds
5. **Timeout**: 5 seconds
6. **Retries**: 3

## Future Extensions

The MCP (Multi-Component Platform) architecture is designed to support:

- **User authentication and authorization**
- **Skill management APIs**
- **Community features**
- **Real-time messaging**
- **File upload and storage**
- **Search and filtering**
- **Analytics and reporting**

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Make your changes following the coding standards
4. Add tests for new functionality
5. Ensure all tests pass (`pytest tests/`)
6. Update documentation as needed
7. Commit your changes (`git commit -am 'Add new feature'`)
8. Push to the branch (`git push origin feature/new-feature`)
9. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions, issues, or contributions, please:

1. Check the [Issues](https://github.com/GooseyPrime/yoohooguru/issues) page
2. Create a new issue if needed
3. Provide detailed information about your problem or suggestion

## Next Steps

1. **Database Integration**: Add PostgreSQL or MongoDB support
2. **Authentication**: Implement JWT-based authentication
3. **API Versioning**: Add versioned API endpoints
4. **Rate Limiting**: Implement request rate limiting
5. **Caching**: Add Redis-based caching
6. **Monitoring**: Integrate with monitoring solutions
7. **CI/CD**: Set up automated testing and deployment pipelines

### Stripe Connect — Debit cards & Instant Payouts (Express)

**Connect → Settings → Payouts**
- Require at least one external account: **ON**
- Collection method: **Financial Connections (with manual fallback)**
- Saved bank accounts (Link): **Allow**
- Allow debit cards: **ON**  ← required for Instant Payouts
- Payout schedule: **Weekly (Friday)** (default)
- Instant Payouts: **ON**
- Statement descriptor (payouts): `YOOHOO GURU PAYOUT`

Gurus can manage payout methods in the Stripe Express Dashboard (button in **/account/payouts**).
