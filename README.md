# 🌊 RIPPLE Community

A comprehensive skill-sharing platform where users exchange skills, discover purpose, and create exponential community impact. Built with React Native Web, Node.js, Firebase, and AI integration.

## 🚀 Features

- **🔐 User Authentication**: Firebase Auth with Google, Email, and Apple Sign-In
- **🤝 Real-Time Skill Matching**: AI-powered algorithms for connecting learners and teachers
- **🧭 Tiered Progression System**: Stone Dropper → Wave Maker → Current Creator → Tide Turner
- **🧑‍🏫 AI-Moderated Teaching Sessions**: Skill-specific templates for effective learning
- **📊 Impact Tracking**: Visualize community contributions and personal growth
- **💸 Micro-Transactions**: Seamless payment system ($0.99–$2.99 per exchange)
- **🏘️ Community Features**: Local events, mentorship, and neighborhood challenges
- **📱 Progressive Web App**: Works seamlessly across all devices

## 🛠️ Technical Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React Native Web, Styled Components, React Router |
| **Backend** | Node.js, Express.js, Firebase Admin SDK |
| **Database** | Firebase Realtime Database (offline sync) |
| **Authentication** | Firebase Auth (Google, Email, Apple) |
| **Payments** | Stripe |
| **AI** | OpenRouter API |
| **Hosting** | PWA Deployment Ready |
| **Styling** | Styled Components, Custom Design System |

## 🎨 Design System

- **Brand Colors**:
  - Ripple Blue: `#007BFF`
  - Growth Green: `#28A745`
  - Energy Orange: `#FD7E14`
- **Typography**:
  - Headings: Montserrat
  - Body: Open Sans
- **Mobile-First**: Responsive design with WCAG 2.1 compliance

## 📁 Project Structure

```
RIPPLE/
├── backend/                 # Node.js Express API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper utilities
│   │   └── config/          # Configuration files
│   └── tests/               # Backend tests
├── frontend/                # React Native Web App
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── screens/         # Page components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services
│   │   ├── utils/           # Helper utilities
│   │   └── styles/          # Global styles
│   └── public/              # Static assets
├── docs/                    # Documentation
├── assets/                  # Shared assets
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Firebase project with Realtime Database enabled
- Stripe account for payments (optional for development)
- OpenRouter API key for AI features (optional for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/GooseyPrime/RIPPLE.git
   cd RIPPLE
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration values
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend API: `http://localhost:3001`
   - Frontend App: `http://localhost:3000`

### Individual Development

**Backend Only:**
```bash
cd backend
npm install
npm run dev
```

**Frontend Only:**
```bash
cd frontend
npm install
npm run dev
```

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
FIREBASE_PROJECT_ID=your_project_id

# Stripe Configuration (Optional)
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret

# OpenRouter AI Configuration (Optional)
OPENROUTER_API_KEY=your_openrouter_api_key

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
```

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password and Google providers
3. Set up Realtime Database
4. Download service account key for backend
5. Configure Firebase config in frontend

## 🧪 Testing

```bash
# Run all tests
npm test

# Frontend tests
npm run test:frontend

# Backend tests
npm run test:backend

# With coverage
npm run test:coverage
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy Frontend (PWA)

The frontend is configured as a Progressive Web App and can be deployed to:
- Netlify
- Vercel
- Firebase Hosting
- Any static hosting service

### Deploy Backend

The backend can be deployed to:
- Firebase Functions
- Railway
- Heroku
- DigitalOcean
- AWS/GCP/Azure

## 📊 Database Schema

### Users Collection
```javascript
{
  uid: "user_id",
  email: "user@example.com",
  displayName: "John Doe",
  skillsOffered: ["JavaScript", "React"],
  skillsWanted: ["Python", "Machine Learning"],
  tier: "Wave Maker",
  exchangesCompleted: 15,
  averageRating: 4.8,
  totalHoursTaught: 45,
  location: "San Francisco, CA",
  availability: ["Monday 9-11 AM", "Wednesday 2-4 PM"],
  purposeStory: "I love sharing knowledge...",
  joinDate: "2024-01-15T10:30:00Z"
}
```

### Exchanges Collection
```javascript
{
  exchangeId: "exchange_id",
  skill: "React Development",
  teacherId: "teacher_uid",
  learnerId: "learner_uid",
  sessionTemplate: "technical",
  status: "completed",
  dateScheduled: "2024-01-20T14:00:00Z",
  duration: 90,
  paymentAmount: 1.99,
  ratings: {
    teacherRating: 5,
    learnerRating: 4
  },
  feedback: "Great session!",
  aiModerationNotes: "Session completed successfully"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow ESLint configuration
- Write tests for new features
- Update documentation
- Use conventional commit messages
- Ensure mobile responsiveness

## 📝 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Skills Endpoints

- `GET /api/skills` - Get all skills
- `GET /api/skills/:skillName` - Get skill details
- `GET /api/skills/suggestions/autocomplete` - Skill suggestions

### Users Endpoints

- `GET /api/users` - Get users with filters
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/search/skills` - Search users by skills

## 🎯 Roadmap

### Phase 1 (Current)
- [x] Basic project structure
- [x] Authentication system
- [x] User management
- [x] Skills browsing
- [ ] Complete signup flow
- [ ] Profile management

### Phase 2
- [ ] Skill matching algorithm
- [ ] Payment integration
- [ ] AI session moderation
- [ ] Real-time messaging

### Phase 3
- [ ] Mobile app optimization
- [ ] Advanced AI features
- [ ] Community events
- [ ] Analytics dashboard

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@ripplecommunity.com
- 💬 Discord: [Join our community](https://discord.gg/ripple)
- 📚 Documentation: [docs.ripplecommunity.com](https://docs.ripplecommunity.com)

## 🙏 Acknowledgments

- Firebase for real-time database and authentication
- React Native Web for cross-platform development
- Stripe for payment processing
- OpenRouter for AI integration
- The open-source community for amazing tools and libraries

---

**Built with ❤️ by the RIPPLE Community Team**

*Creating ripples of positive impact, one skill exchange at a time.* 🌊
