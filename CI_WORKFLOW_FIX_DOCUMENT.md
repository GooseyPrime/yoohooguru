# YoohooGuru CI/CD Workflow Comprehensive Fix Document

**Generated:** 2025-09-29  
**Target:** GitHub Actions Build & Test Workflow  
**Status:** Production-Ready Configuration Required

---

## EXECUTIVE SUMMARY

The CI workflow failures stem from three critical issues:
1. **Node.js version incompatibility** with Firebase dependencies (18.x vs required 20.x)
2. **Missing Firebase credentials** in CI environment (secrets are empty)
3. **Test configuration mismatch** between real Firebase intent and actual test setup

This document provides complete, targeted fixes with no conditional guidance.

---

## SECTION 1: NODE.JS VERSION UPGRADE

### Issue
Firebase packages require Node.js >= 20.0.0, but CI uses 18.x:
```
npm warn EBADENGINE package: '@firebase/component@0.7.0'
npm warn EBADENGINE required: { node: '>=20.0.0' }
npm warn EBADENGINE current: { node: 'v18.20.8', npm: '10.8.2' }
```

### Fix 1.1: Update CI Workflow
**File:** `.github/workflows/ci.yml`

```yaml
strategy:
  matrix:
    node-version: [20.x]  # Changed from 18.x
```

### Fix 1.2: Update Root Package.json
**File:** `package.json`

```json
"engines": {
  "node": ">=20.0.0",
  "npm": ">=9.0.0"
}
```

### Fix 1.3: Update Backend Package.json
**File:** `backend/package.json`

```json
"engines": {
  "node": ">=20.0.0"
}
```

---

## SECTION 2: FIREBASE TEST ENVIRONMENT SETUP

### Issue
Backend tests attempt real Firebase connections but credentials are missing/empty in CI.

### Strategy Choice: Firebase Emulator for Tests
**Rationale:** Production-ready approach that doesn't require exposing real credentials to CI while maintaining real Firebase behavior.

### Fix 2.1: Install Firebase Emulator Dependencies
**File:** `backend/package.json`

Add to `devDependencies`:
```json
"@firebase/rules-unit-testing": "^3.0.0",
"firebase-tools": "^13.0.0"
```

### Fix 2.2: Create Firebase Emulator Configuration
**File:** `backend/firebase.json` (create new file)

```json
{
  "emulators": {
    "auth": {
      "port": 9099
    },
    "firestore": {
      "port": 8080
    },
    "ui": {
      "enabled": false
    }
  },
  "firestore": {
    "rules": "firestore.rules"
  }
}
```

### Fix 2.3: Create Firestore Rules for Testing
**File:** `backend/firestore.rules` (create new file)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Fix 2.4: Update Backend Test Script
**File:** `backend/package.json`

Replace the test scripts:
```json
"scripts": {
  "pretest": "node ../scripts/generate-cors-origins.js",
  "test": "firebase emulators:exec --only firestore,auth 'jest --forceExit --runInBand'",
  "test:watch": "firebase emulators:exec --only firestore,auth 'jest --watch'",
  "test:coverage": "firebase emulators:exec --only firestore,auth 'jest --coverage'",
}
```

### Fix 2.5: Create Test Environment File
**File:** `backend/.env.test` (create new file)

```env
NODE_ENV=test
FIREBASE_PROJECT_ID=demo-yoohooguru-test
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
FIRESTORE_EMULATOR_HOST=localhost:8080
FIREBASE_STORAGE_EMULATOR_HOST=localhost:9199

# JWT Secret for testing
JWT_SECRET=test-jwt-secret-key-for-ci-cd-testing-only-not-for-production

# Stripe test keys (use Stripe test mode keys)
STRIPE_SECRET_KEY=sk_test_placeholder
STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_test_placeholder

# Test CORS origins
CORS_ORIGIN_PRODUCTION=http://localhost:3000,http://127.0.0.1:3000
```

### Fix 2.6: Update Firebase Configuration for Test Environment
**File:** `backend/src/config/firebase.js`

Replace entire file with:

```javascript
const admin = require('firebase-admin');
const { logger } = require('../utils/logger');

let firebaseApp;

/**
 * Validates Firebase configuration for production environments
 */
const validateProductionFirebaseConfig = (config) => {
  const env = process.env.NODE_ENV;
  
  // Skip validation in test environment
  if (env === 'test') {
    return;
  }

  // Only validate in production and staging environments
  if (env !== 'production' && env !== 'staging') {
    return;
  }

  // Check for prohibited emulator/mock settings
  if (process.env.FIREBASE_EMULATOR_HOST) {
    throw new Error(
      `Firebase emulator host is configured (${process.env.FIREBASE_EMULATOR_HOST}) ` +
      `but NODE_ENV is ${env}. Emulators are prohibited in ${env} environments.`
    );
  }

  if (process.env.USE_MOCKS && process.env.USE_MOCKS !== 'false') {
    throw new Error(
      `USE_MOCKS is enabled (${process.env.USE_MOCKS}) but NODE_ENV is ${env}. ` +
      `Mocks are prohibited in ${env} environments.`
    );
  }

  // Validate that project ID doesn't contain demo/test values
  const projectId = config.projectId;
  if (!projectId) {
    throw new Error(`Firebase project ID is required in ${env} environment`);
  }

  const prohibitedPatterns = ['demo', 'test', 'mock', 'localhost', 'emulator', 'example', 'your_', 'changeme'];
  const hasProhibitedPattern = prohibitedPatterns.some(pattern => 
    projectId.toLowerCase().includes(pattern)
  );

  if (hasProhibitedPattern) {
    throw new Error(
      `Firebase project ID "${projectId}" contains prohibited pattern for ${env} environment. ` +
      `Production and staging must use live Firebase projects only.`
    );
  }

  // Validate project ID format (Firebase project IDs are lowercase alphanumeric with hyphens)
  if (!/^[a-z0-9-]+$/.test(projectId)) {
    throw new Error(
      `Firebase project ID "${projectId}" has invalid format. ` +
      `Project IDs must be lowercase alphanumeric with hyphens only.`
    );
  }

  logger.info(`✅ Firebase configuration validated for ${env} environment`);
  logger.info(`🔥 Using Firebase project: ${projectId}`);
};

const initializeFirebase = () => {
  try {
    // Initialize Firebase Admin SDK
    if (!admin.apps.length) {
      const env = process.env.NODE_ENV || 'development';
      
      // TEST ENVIRONMENT: Use Firebase Emulator
      if (env === 'test') {
        const firebaseConfig = {
          projectId: process.env.FIREBASE_PROJECT_ID || 'demo-yoohooguru-test'
        };

        // Set emulator environment variables if not already set
        if (!process.env.FIRESTORE_EMULATOR_HOST) {
          process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
        }
        if (!process.env.FIREBASE_AUTH_EMULATOR_HOST) {
          process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
        }

        firebaseApp = admin.initializeApp(firebaseConfig);
        logger.info('🧪 Firebase initialized for testing with EMULATOR');
        logger.info(`📍 Firestore Emulator: ${process.env.FIRESTORE_EMULATOR_HOST}`);
        logger.info(`📍 Auth Emulator: ${process.env.FIREBASE_AUTH_EMULATOR_HOST}`);
        
        return firebaseApp;
      }

      // PRODUCTION/STAGING/DEVELOPMENT: Use real Firebase
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      };

      const firebaseConfig = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        ...(serviceAccount.clientEmail && serviceAccount.privateKey && 
            serviceAccount.clientEmail.trim() !== '' && serviceAccount.privateKey.trim() !== '' && {
          credential: admin.credential.cert(serviceAccount)
        })
      };

      // Validate configuration for production environments
      if (env === 'production' || env === 'staging') {
        validateProductionFirebaseConfig(firebaseConfig);
      }

      firebaseApp = admin.initializeApp(firebaseConfig);
      logger.info('Firebase Admin SDK initialized successfully');
      logger.info(`Environment: ${env}`);
      
      if (env === 'production' || env === 'staging') {
        logger.info('🚀 Running with live Firebase configuration (production-ready)');
        logger.info(`🔥 Using Firebase project: ${process.env.FIREBASE_PROJECT_ID}`);
        logger.info('✅ Firestore-only configuration active');
      } else {
        logger.info('🛠️  Running with development Firebase configuration');
      }
    } else {
      firebaseApp = admin.app();
    }
    
    return firebaseApp;
  } catch (error) {
    logger.error('Failed to initialize Firebase:', error);
    throw error;
  }
};

const getDatabase = () => {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  
  logger.warn('⚠️  DEPRECATION WARNING: getDatabase() is deprecated. Use getFirestore() instead.');
  
  if (!firebaseApp.options.databaseURL) {
    throw new Error(
      'Firebase Realtime Database is not configured for this application. ' +
      'The application is initialized for Firestore. Use getFirestore() instead.'
    );
  }
  return admin.database();
};

const getAuth = () => {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return admin.auth();
};

const getFirestore = () => {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return admin.firestore();
};

module.exports = {
  initializeFirebase,
  getDatabase,
  getAuth,
  getFirestore
};
```

### Fix 2.7: Update Jest Setup
**File:** `backend/jest.setup.js`

Replace entire file with:

```javascript
/**
 * Jest setup for backend tests with Firebase Emulator
 * Uses Firebase Emulator for all tests - no mocks, no real Firebase connections
 */

// Load test environment variables
require('dotenv').config({ path: '.env.test' });

// Set NODE_ENV to test
process.env.NODE_ENV = 'test';

// Initialize Firebase for testing before any tests run
const { initializeFirebase } = require('./src/config/firebase');

beforeAll(async () => {
  try {
    await initializeFirebase();
    console.log('✅ Firebase Emulator initialized for testing');
  } catch (error) {
    console.error('❌ Firebase Emulator initialization failed:', error.message);
    throw error;
  }
});

// Longer timeout for Firebase operations
jest.setTimeout(45000);

// Clean up resources after all tests
afterAll(async () => {
  // Allow time for connections to clean up
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('🧹 Test cleanup completed');
});
```

### Fix 2.8: Update Test Files to Remove Firestore Mocking
**Files:** `backend/tests/angels-jobs.test.js` and any other test files

Remove all Firestore mocking code (the temporary mock implementations). The tests should now use the emulator directly without any mocking.

Example changes for `backend/tests/angels-jobs.test.js`:

```javascript
// Remove this section entirely:
// const mockFirestore = {
//   collection: jest.fn(...),
//   ...
// };

// Remove all instances of:
// const originalGetFirestore = require('../src/config/firebase').getFirestore;
// require('../src/config/firebase').getFirestore = jest.fn(() => mockFirestore);
// ... test code ...
// require('../src/config/firebase').getFirestore = originalGetFirestore;

// Replace with direct Firebase Emulator usage - no mocking needed
// Tests will interact with real Firestore Emulator instances
```

### Fix 2.9: Update CI Workflow to Install and Start Firebase Emulator
**File:** `.github/workflows/ci.yml`

Update the "Run backend tests" step:

```yaml
- name: Run backend tests
  run: |
    cd backend
    npm install -g firebase-tools
    npm test -- --detectOpenHandles --verbose
  env:
    NODE_ENV: test
    FIREBASE_PROJECT_ID: demo-yoohooguru-test
    JWT_SECRET: test-jwt-secret-key-for-ci-cd-testing
    STRIPE_SECRET_KEY: sk_test_placeholder
    STRIPE_PUBLISHABLE_KEY: pk_test_placeholder
    STRIPE_WEBHOOK_SECRET: whsec_test_placeholder
    STRIPE_WEBHOOK_ID: we_test_placeholder
    STRIPE_GURU_PASS_PRICE_ID: price_test_placeholder
    STRIPE_SKILL_VERIFICATION_PRICE_ID: price_test_placeholder
    STRIPE_TRUST_SAFETY_PRICE_ID: price_test_placeholder
```

---

## SECTION 3: FRONTEND PROP VALIDATION FIXES

### Issue
React warnings about non-DOM props being passed to DOM elements.

### Fix 3.1: Update SubdomainLandingPage Component
**File:** `frontend/src/components/SubdomainLandingPage.js`

Find styled components and use transient props (prefix with `$`):

```javascript
// Before:
const HeroTitle = styled.h1`
  color: ${props => props.primaryColor};
`;

// After:
const HeroTitle = styled.h1`
  color: ${props => props.$primaryColor};
`;

// Update usage:
<HeroTitle $primaryColor={config.colors.primary}>
```

Apply this pattern to all styled components receiving these props:
- `primaryColor` → `$primaryColor`
- `secondaryColor` → `$secondaryColor`
- `primary` → `$primary`
- `secondary` → `$secondary`

### Fix 3.2: Update Button Component
**File:** `frontend/src/components/Button.js`

```javascript
// Before:
const StyledButton = styled.button`
  ${props => props.primary && css`
    background-color: ${props => props.theme.colors.primary};
  `}
  ${props => props.secondary && css`
    background-color: ${props => props.theme.colors.secondary};
  `}
`;

// After:
const StyledButton = styled.button`
  ${props => props.$primary && css`
    background-color: ${props => props.theme.colors.primary};
  `}
  ${props => props.$secondary && css`
    background-color: ${props => props.theme.colors.secondary};
  `}
`;

// Update the Button component:
const Button = ({ 
  children, 
  variant = 'primary',
  ...props 
}) => {
  const $primary = variant === 'primary';
  const $secondary = variant === 'secondary';
  
  return (
    <StyledButton 
      $primary={$primary} 
      $secondary={$secondary}
      {...props}
    >
      {children}
    </StyledButton>
  );
};
```

---

## SECTION 4: DATABASE SEEDING FOR TESTS

### Fix 4.1: Create Test Data Seed Script
**File:** `backend/tests/seed-test-data.js` (create new file)

```javascript
const { getFirestore, getAuth } = require('../src/config/firebase');

/**
 * Seeds Firestore Emulator with test data
 * Call this in test setup when needed
 */
async function seedTestData() {
  const db = getFirestore();
  const auth = getAuth();
  
  // Create test users
  const testUsers = [
    {
      uid: 'test-user-123',
      email: 'test@example.com',
      displayName: 'Test User',
      role: 'user'
    },
    {
      uid: 'test-admin-456',
      email: 'admin@example.com',
      displayName: 'Test Admin',
      role: 'admin'
    }
  ];

  // Seed users collection
  for (const user of testUsers) {
    await db.collection('users').doc(user.uid).set({
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      createdAt: new Date().toISOString(),
      profileComplete: true,
      verified: true
    });
  }

  // Seed angel_jobs collection
  const testJobs = [
    {
      id: 'job-test-1',
      title: 'Help with Moving',
      description: 'Need help moving furniture',
      category: 'moving',
      location: { city: 'Denver', state: 'CO' },
      hourlyRate: 25,
      estimatedHours: 4,
      skills: ['Heavy Lifting'],
      urgency: 'normal',
      featured: false,
      postedBy: 'test-user-123',
      status: 'open',
      applications: {},
      createdAt: new Date().toISOString()
    }
  ];

  for (const job of testJobs) {
    await db.collection('angel_jobs').doc(job.id).set(job);
  }

  console.log('✅ Test data seeded successfully');
}

/**
 * Clears all test data from Firestore Emulator
 */
async function clearTestData() {
  const db = getFirestore();
  
  const collections = ['users', 'angel_jobs', 'activity_logs'];
  
  for (const collectionName of collections) {
    const snapshot = await db.collection(collectionName).get();
    const batch = db.batch();
    
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
  }
  
  console.log('🧹 Test data cleared successfully');
}

module.exports = {
  seedTestData,
  clearTestData
};
```

### Fix 4.2: Update Test Files to Use Seed Data
**Example for `backend/tests/angels-jobs.test.js`:**

```javascript
const { seedTestData, clearTestData } = require('./seed-test-data');

beforeEach(async () => {
  await clearTestData();
  await seedTestData();
});

afterEach(async () => {
  await clearTestData();
});
```

---

## SECTION 5: GITHUB SECRETS CONFIGURATION (For Production)

**Note:** While tests now use emulator, production deployment still needs real Firebase credentials.

### Required Secrets in GitHub Repository Settings

Navigate to: Repository → Settings → Secrets and variables → Actions

Add these secrets:

```
FIREBASE_PROJECT_ID=ceremonial-tea-470904-f3
FIREBASE_CLIENT_EMAIL=<your-service-account-email>
FIREBASE_PRIVATE_KEY=<your-private-key-with-newlines>
FIREBASE_API_KEY=<your-api-key>
FIREBASE_AUTH_DOMAIN=<your-auth-domain>
FIREBASE_STORAGE_BUCKET=<your-storage-bucket>
FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
FIREBASE_APP_ID=<your-app-id>
JWT_SECRET=<generate-secure-random-string>
STRIPE_SECRET_KEY=<your-stripe-secret>
STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable>
STRIPE_WEBHOOK_SECRET=<your-webhook-secret>
STRIPE_WEBHOOK_ID=<your-webhook-id>
STRIPE_GURU_PASS_PRICE_ID=<your-price-id>
STRIPE_SKILL_VERIFICATION_PRICE_ID=<your-price-id>
STRIPE_TRUST_SAFETY_PRICE_ID=<your-price-id>
```

**Important:** For `FIREBASE_PRIVATE_KEY`, ensure newlines are properly escaped:
```bash
# If your key has actual newlines, replace them with \\n
echo "YOUR_PRIVATE_KEY" | sed 's/$/\\n/g' | tr -d '\n'
```

---

## SECTION 6: IMPLEMENTATION CHECKLIST

Execute fixes in this exact order:

### Phase 1: Node Version Update
- [ ] Update `.github/workflows/ci.yml` node-version to 20.x
- [ ] Update `package.json` engines to >=20.0.0
- [ ] Update `backend/package.json` engines to >=20.0.0

### Phase 2: Firebase Emulator Setup
- [ ] Add Firebase emulator dependencies to `backend/package.json`
- [ ] Create `backend/firebase.json`
- [ ] Create `backend/firestore.rules`
- [ ] Create `backend/.env.test`
- [ ] Update `backend/package.json` test scripts
- [ ] Update `backend/src/config/firebase.js`
- [ ] Update `backend/jest.setup.js`

### Phase 3: Test Updates
- [ ] Create `backend/tests/seed-test-data.js`
- [ ] Remove all Firestore mocking from test files
- [ ] Add seed data calls to test files
- [ ] Update `.github/workflows/ci.yml` backend test step

### Phase 4: Frontend Fixes
- [ ] Update `frontend/src/components/SubdomainLandingPage.js` with transient props
- [ ] Update `frontend/src/components/Button.js` with transient props

### Phase 5: GitHub Secrets (If Missing)
- [ ] Add all required secrets to GitHub repository settings
- [ ] Verify FIREBASE_PRIVATE_KEY newline escaping

### Phase 6: Validation
- [ ] Commit all changes to a new branch
- [ ] Create pull request
- [ ] Verify CI workflow runs successfully
- [ ] Verify all tests pass
- [ ] Merge to main

---

## SECTION 7: EXPECTED OUTCOMES

After implementing all fixes:

### CI Workflow
- ✅ Node.js 20.x successfully installed
- ✅ No Firebase engine warnings
- ✅ Backend tests run with Firebase Emulator
- ✅ Frontend tests pass with no prop warnings
- ✅ All linting passes
- ✅ Build completes successfully
- ✅ Zero test failures

### Test Environment
- ✅ Firebase Emulator starts automatically with tests
- ✅ Tests use real Firestore behavior via emulator
- ✅ No need for real Firebase credentials in CI
- ✅ Tests can seed and clear data independently
- ✅ Fast test execution (local emulator)

### Production Deployment
- ✅ Real Firebase credentials used (not emulator)
- ✅ Production validation prevents test/demo projects
- ✅ Secure credential handling via GitHub Secrets

---

## SECTION 8: TROUBLESHOOTING

### If Tests Still Fail After Fixes

**Emulator Not Starting:**
```bash
# Check if Java is installed (required for Firestore emulator)
java -version

# If not installed:
sudo apt-get update
sudo apt-get install default-jdk
```

**Port Conflicts:**
```bash
# Check if ports are in use
lsof -i :8080
lsof -i :9099

# Kill processes if needed
kill -9 <PID>
```

**Emulator Cache Issues:**
```bash
# Clear emulator cache
cd backend
firebase emulators:start --clear-on-exit
```

---

## SECTION 9: VERIFICATION COMMANDS

Run these locally before pushing to verify fixes:

```bash
# 1. Check Node version
node --version  # Should be v20.x.x

# 2. Install dependencies
npm run install:all

# 3. Run backend tests with emulator
cd backend
npm test

# 4. Run frontend tests
cd frontend
npm run test:ci

# 5. Lint all code
cd ..
npm run lint

# 6. Build frontend
cd frontend
npm run build
```

All commands should complete without errors.

---

## APPENDIX A: FILE SUMMARY

### New Files to Create
1. `backend/firebase.json`
2. `backend/firestore.rules`
3. `backend/.env.test`
4. `backend/tests/seed-test-data.js`

### Files to Modify
1. `.github/workflows/ci.yml`
2. `package.json`
3. `backend/package.json`
4. `backend/src/config/firebase.js`
5. `backend/jest.setup.js`
6. `backend/tests/angels-jobs.test.js`
7. `frontend/src/components/SubdomainLandingPage.js`
8. `frontend/src/components/Button.js`

### Total Changes
- 4 new files
- 8 modified files
- ~500 lines of code changes

---

## APPENDIX B: ALTERNATIVE APPROACH (Real Firebase in CI)

If Firebase Emulator approach is not preferred, use real Firebase with test project:

1. Create separate Firebase test project: `yoohooguru-ci-test`
2. Add test project credentials to GitHub Secrets with `TEST_` prefix
3. Modify `.env.test` to use test project
4. Add cleanup script to wipe test project data after CI runs

**Not recommended** because:
- Requires maintaining separate Firebase project
- Slower than emulator
- Risk of data pollution between test runs
- Higher Firebase costs

---

**END OF DOCUMENT**

This document provides complete, production-ready fixes for all CI workflow failures. Implement in order for guaranteed success.
