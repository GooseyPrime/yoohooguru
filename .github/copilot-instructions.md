# RIPPLE Community Platform - Developer Instructions

RIPPLE Community is a neighborhood-based skill-sharing platform where users exchange skills, discover purpose, and create exponential community impact.

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Current Project State

**CRITICAL**: This is an early-stage repository currently containing only README.md and LICENSE files. The actual application codebase has not been implemented yet.

## Working Effectively

### Initial Repository Setup
When starting development on this repository:

1. **Always start by understanding the current state:**
   ```bash
   ls -la
   find . -name "*.json" -o -name "*.js" -o -name "*.ts" -o -name "*.py" -o -name "package.json" -o -name "requirements.txt" -o -name "Dockerfile" | head -20
   ```

2. **Check for existing configuration files:**
   ```bash
   ls -la package.json pyproject.toml Cargo.toml pom.xml build.gradle requirements.txt Pipfile 2>/dev/null || echo "No configuration files found yet"
   ```

### Technology Stack Guidelines

Based on the skill-sharing platform requirements, common technology stacks include:

**Frontend Web Application:**
- React.js with TypeScript
- Vue.js with TypeScript  
- Angular with TypeScript
- Build tools: Vite, Webpack, or Create React App

**Mobile Application:**
- React Native
- Flutter
- Native iOS/Android

**Backend API:**
- Node.js with Express/Fastify
- Python with FastAPI/Django
- Java with Spring Boot
- Go with Gin/Echo

**Database:**
- PostgreSQL (recommended for relational data)
- MongoDB (for document-based storage)
- Redis (for caching and sessions)

### Development Environment Setup

**When a package.json exists (Node.js project):**
```bash
# Install Node.js dependencies
npm install
# Or if using yarn
yarn install
# Or if using pnpm
pnpm install

# NEVER CANCEL: Initial dependency installation may take 5-10 minutes depending on project size
# Set timeout to 15+ minutes for npm install commands
```

**When requirements.txt exists (Python project):**
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate
# Install dependencies
pip install -r requirements.txt
# NEVER CANCEL: Python dependency installation may take 5-15 minutes
# Set timeout to 20+ minutes for pip install commands
```

**When Dockerfile exists:**
```bash
# Build Docker image
docker build -t ripple-community .
# NEVER CANCEL: Docker builds may take 10-30 minutes depending on base image and dependencies
# Set timeout to 45+ minutes for docker build commands
```

### Building the Application

**For Node.js projects:**
```bash
# Build the application
npm run build
# NEVER CANCEL: Build process may take 10-30 minutes for large applications
# Set timeout to 45+ minutes for build commands

# Alternative build commands to try:
npm run compile
npm run dist
yarn build
pnpm build
```

**For Python projects:**
```bash
# Install in development mode
pip install -e .
# Or build wheel
python setup.py bdist_wheel
# NEVER CANCEL: Python builds may take 5-20 minutes
# Set timeout to 30+ minutes for Python build commands
```

### Running Tests

**For Node.js projects:**
```bash
# Run test suite
npm test
# NEVER CANCEL: Test suites may take 5-30 minutes depending on coverage
# Set timeout to 45+ minutes for test commands

# Alternative test commands:
npm run test:unit
npm run test:integration
npm run test:e2e
jest
```

**For Python projects:**
```bash
# Run tests with pytest
pytest
# Or with unittest
python -m unittest discover
# NEVER CANCEL: Python test suites may take 10-45 minutes
# Set timeout to 60+ minutes for comprehensive test suites
```

### Running the Application

**Development server (common patterns):**
```bash
# Node.js applications
npm run dev
npm start
npm run serve
yarn dev
pnpm dev

# Python applications
python app.py
python manage.py runserver
flask run
uvicorn main:app --reload

# NEVER CANCEL: Development servers may take 2-5 minutes to start
# Set timeout to 10+ minutes for server startup
```

### Validation Requirements

**ALWAYS perform these validation steps after making changes:**

1. **Linting and Code Quality:**
   ```bash
   # Common linting commands to try
   npm run lint
   eslint .
   flake8 .
   black . --check
   mypy .
   # NEVER CANCEL: Linting may take 2-10 minutes for large codebases
   # Set timeout to 15+ minutes for lint commands
   ```

2. **Formatting:**
   ```bash
   # Code formatting commands
   npm run format
   prettier --write .
   black .
   # NEVER CANCEL: Formatting may take 2-5 minutes
   # Set timeout to 10+ minutes for format commands
   ```

3. **Manual Testing Scenarios:**
   - **User Registration Flow**: Test user signup, email verification, profile creation
   - **Skill Posting**: Create a new skill offering, edit details, publish
   - **Skill Discovery**: Search for skills, filter by location/category, view skill details
   - **Skill Exchange**: Request a skill, communicate with skill provider, complete exchange
   - **Community Features**: Join neighborhood groups, participate in discussions
   - **User Profile**: Update profile, manage skills, view exchange history

4. **API Testing (when backend exists):**
   ```bash
   # Test API endpoints
   curl -X GET http://localhost:3000/api/health
   curl -X GET http://localhost:3000/api/skills
   # Test authentication endpoints
   curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"test123"}'
   ```

5. **Database Validation (when database exists):**
   ```bash
   # Check database connectivity
   # For PostgreSQL
   psql -h localhost -U username -d ripple_db -c "SELECT 1;"
   # For MongoDB
   mongosh --eval "db.adminCommand('ping')"
   ```

### CI/CD and GitHub Actions

**When .github/workflows/ exists, always run these before committing:**
```bash
# Check workflow syntax
ls .github/workflows/
# Validate workflow files if using act
act --list
# NEVER CANCEL: Workflow validation may take 2-5 minutes
# Set timeout to 10+ minutes
```

### Common Project Structures

**Web Application Structure:**
```
src/
  components/     # React/Vue components
  pages/         # Page components/routes
  services/      # API calls and business logic
  utils/         # Helper functions
  styles/        # CSS/SCSS files
public/          # Static assets
tests/           # Test files
docs/            # Documentation
```

**Backend API Structure:**
```
src/
  controllers/   # Request handlers
  models/        # Data models
  routes/        # API routes
  middleware/    # Custom middleware
  services/      # Business logic
  utils/         # Helper functions
tests/           # Test files
migrations/      # Database migrations
```

### Troubleshooting Common Issues

**Build Failures:**
- Check Node.js version: `node --version` (should be 16+ for modern projects)
- Check Python version: `python --version` (should be 3.8+ for modern projects)
- Clear dependency cache: `rm -rf node_modules package-lock.json && npm install`
- Clear Python cache: `pip cache purge && pip install -r requirements.txt`

**Port Conflicts:**
- Check running processes: `lsof -i :3000` (replace 3000 with your port)
- Kill conflicting processes: `kill -9 $(lsof -t -i:3000)`

**Database Connection Issues:**
- Verify database is running: `docker ps` or `systemctl status postgresql`
- Check connection strings in environment variables
- Verify database exists and user has permissions

### Environment Variables

**Common environment variables to check:**
```bash
# Check if .env file exists
ls -la .env .env.local .env.development .env.production

# Common variables for skill-sharing platforms:
DATABASE_URL=postgresql://user:pass@localhost:5432/ripple_db
JWT_SECRET=your-secret-key
API_BASE_URL=http://localhost:3000
REDIS_URL=redis://localhost:6379
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10MB
```

### Performance Considerations

**When making changes, always consider:**
- Database query optimization (use EXPLAIN for complex queries)
- Image optimization and lazy loading
- API response caching
- Bundle size optimization for frontend
- Memory usage for long-running processes

### Security Best Practices

**Always implement and test:**
- Input validation and sanitization
- Authentication and authorization
- HTTPS in production
- Rate limiting on APIs
- SQL injection prevention
- XSS protection
- CSRF protection for forms

### Documentation Updates

**When adding new features, update:**
- API documentation (OpenAPI/Swagger)
- README.md with new setup steps
- Component documentation for frontend
- Database schema documentation

### Deployment Preparation

**Before deploying, always verify:**
```bash
# Production build works
NODE_ENV=production npm run build
# Tests pass in production mode
NODE_ENV=production npm test
# Environment variables are configured
# Database migrations are applied
# Static assets are optimized
```

## Time Expectations

**CRITICAL - NEVER CANCEL these operations:**
- Initial dependency installation: 5-15 minutes (timeout: 20+ minutes)
- Full application build: 10-30 minutes (timeout: 45+ minutes)
- Complete test suite: 5-45 minutes (timeout: 60+ minutes)
- Database migrations: 1-10 minutes (timeout: 15+ minutes)
- Docker image build: 10-30 minutes (timeout: 45+ minutes)
- Production deployment: 5-20 minutes (timeout: 30+ minutes)

## Quick Reference Commands

**Daily development workflow:**
```bash
# 1. Update dependencies
npm install
# 2. Start development server
npm run dev
# 3. Run tests in watch mode
npm run test:watch
# 4. Lint and format before committing
npm run lint && npm run format
```

**When the project structure changes, always re-run these instructions from the beginning to understand the new setup.**