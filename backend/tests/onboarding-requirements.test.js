// Test data that can be overridden per test
let mockTestData = {
  profileCategories: {
    'tutoring': { selectedAt: '2024-01-01T00:00:00.000Z' },
    'handyman': { selectedAt: '2024-01-01T00:00:00.000Z' }
  },
  categoryRequirements: [
    {
      id: 'tutoring',
      data: () => ({
        slug: 'tutoring',
        requires_license: false,
        requires_gl: false,
        requires_background_check: false,
        notes: 'Guardian present for minors (MVP).'
      })
    },
    {
      id: 'handyman',
      data: () => ({
        slug: 'handyman',
        requires_license: false,
        requires_gl: true,
        min_gl_per_occurrence_cents: 100000000,
        min_gl_aggregate_cents: 200000000,
        notes: 'No gas, roofing, or structural work.'
      })
    }
  ],
  shouldThrowError: false
};

// Mock Firebase - default setup that will be overridden in tests
jest.mock('../src/config/firebase', () => ({
  getFirestore: jest.fn(() => ({
    collection: jest.fn((collectionName) => {
      if (mockTestData.shouldThrowError) {
        throw new Error('Database connection failed');
      }
      
      if (collectionName === 'profile_categories') {
        return {
          doc: jest.fn((docId) => ({
            get: jest.fn(() => Promise.resolve({ 
              exists: Object.keys(mockTestData.profileCategories).length > 0, 
              data: () => mockTestData.profileCategories
            })),
            set: jest.fn(() => Promise.resolve()),
            update: jest.fn(() => Promise.resolve())
          }))
        };
      }
      if (collectionName === 'category_requirements') {
        return {
          get: jest.fn(() => Promise.resolve({ 
            forEach: (callback) => {
              mockTestData.categoryRequirements.forEach(callback);
            }
          }))
        };
      }
      return {
        doc: jest.fn(() => ({
          get: jest.fn(() => Promise.resolve({ exists: false, data: () => ({}) })),
          set: jest.fn(() => Promise.resolve()),
          update: jest.fn(() => Promise.resolve())
        })),
        get: jest.fn(() => Promise.resolve({ forEach: () => {} }))
      };
    })
  }))
}));

// Mock auth middleware
jest.mock('../src/middleware/auth', () => ({
  authenticateUser: jest.fn((req, res, next) => {
    req.user = { uid: 'test-user' };
    next();
  })
}));

// Mock logger - clean version for final implementation
jest.mock('../src/utils/logger', () => ({
  logger: {
    error: jest.fn()
  }
}));

// Mock compliance requirements
jest.mock('../src/config/complianceRequirements', () => ({
  COMPLIANCE_REQUIREMENTS: {
    'tutoring': {
      name: 'Tutoring & Education',
      riskLevel: 'medium',
      required: {
        profile: ['displayName', 'bio', 'location', 'photo', 'education'],
        documents: ['background_check', 'education_verification'],
        badges: ['background-verified'],
        verification: ['background_check'],
        insurance: { types: ['general_liability'], minimumCoverage: 500000 }
      },
      restrictions: { minAge: 18, requiresWaiver: false, parentalConsentRequired: true }
    },
    'construction': {
      name: 'Construction & Home Repair',
      riskLevel: 'high',
      required: {
        profile: ['displayName', 'bio', 'location', 'photo'],
        documents: ['contractors_license', 'liability_insurance', 'workers_comp'],
        badges: ['licensed-professional', 'insured-provider'],
        verification: ['license_verification'],
        insurance: { types: ['general_liability', 'workers_compensation'], minimumCoverage: 1000000 }
      },
      restrictions: { minAge: 18, requiresWaiver: true, propertyWaiverRequired: true }
    }
  }
}));

const request = require('supertest');
const express = require('express');
const onboardingRoutes = require('../src/routes/onboarding');
const { authenticateUser } = require('../src/middleware/auth');

describe('Onboarding Requirements Endpoint', () => {
  let app;
  let mockFirestore;

  beforeEach(() => {
    // Reset test data to defaults
    mockTestData.profileCategories = {
      'tutoring': { selectedAt: '2024-01-01T00:00:00.000Z' },
      'handyman': { selectedAt: '2024-01-01T00:00:00.000Z' }
    };
    mockTestData.categoryRequirements = [
      {
        id: 'tutoring',
        data: () => ({
          slug: 'tutoring',
          requires_license: false,
          requires_gl: false,
          requires_background_check: false,
          notes: 'Guardian present for minors (MVP).'
        })
      },
      {
        id: 'handyman',
        data: () => ({
          slug: 'handyman',
          requires_license: false,
          requires_gl: true,
          min_gl_per_occurrence_cents: 100000000,
          min_gl_aggregate_cents: 200000000,
          notes: 'No gas, roofing, or structural work.'
        })
      }
    ];
    mockTestData.shouldThrowError = false;

    app = express();
    app.use(express.json());
    app.use('/onboarding', onboardingRoutes);

    const { getFirestore } = require('../src/config/firebase');
    mockFirestore = getFirestore();
    
    // Clear any previous mock implementations
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /onboarding/requirements', () => {
    test('should return unified requirements for selected categories', async () => {
      const response = await request(app)
        .get('/onboarding/requirements');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.needed).toHaveLength(2);

      // Check tutoring requirements
      const tutoringReq = response.body.data.needed.find(r => r.slug === 'tutoring');
      expect(tutoringReq).toBeDefined();
      expect(tutoringReq.name).toBe('Tutoring & Education');
      expect(tutoringReq.riskLevel).toBe('medium');
      expect(tutoringReq.legacy.notes).toBe('Guardian present for minors (MVP).');

      // Check handyman requirements
      const handymanReq = response.body.data.needed.find(r => r.slug === 'handyman');
      expect(handymanReq).toBeDefined();
      expect(handymanReq.name).toBe('Construction & Home Repair');
      expect(handymanReq.legacy.requires_gl).toBe(true);
      expect(handymanReq.legacy.notes).toBe('No gas, roofing, or structural work.');
    });

    test('should handle categories with no legacy requirements', async () => {
      // Override test data to have unknown category with no legacy requirements
      mockTestData.profileCategories = {
        'unknown-category': { selectedAt: '2024-01-01T00:00:00.000Z' }
      };
      mockTestData.categoryRequirements = []; // No legacy requirements found
      mockTestData.shouldThrowError = false;

      const response = await request(app)
        .get('/onboarding/requirements')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.needed).toHaveLength(1);

      const unknownReq = response.body.data.needed[0];
      expect(unknownReq.slug).toBe('unknown-category');
      expect(unknownReq.riskLevel).toBe('low'); // Default fallback
      expect(unknownReq.required.documents).toEqual([]);
    });

    test('should handle authentication errors', async () => {
      // Mock auth failure
      const { authenticateUser } = require('../src/middleware/auth');
      authenticateUser.mockImplementationOnce((req, res, next) => {
        res.status(401).json({ error: 'Unauthorized' });
      });

      await request(app)
        .get('/onboarding/requirements')
        .expect(401);
    });

    test('should handle database errors gracefully', async () => {
      // Set up mock to throw error
      mockTestData.shouldThrowError = true;

      const response = await request(app)
        .get('/onboarding/requirements')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Failed to load requirements');
    });
  });
});