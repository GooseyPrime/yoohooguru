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
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn().mockResolvedValue({ exists: false }),
        set: jest.fn().mockResolvedValue(),
        update: jest.fn().mockResolvedValue()
      })),
      get: jest.fn().mockResolvedValue({ forEach: jest.fn() })
    }))
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
  let mockDb;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create a fresh mock for each test
    mockDb = {
      collection: jest.fn()
    };
    
    // Mock the Firebase config to return our fresh mock
    const { getFirestore } = require('../src/config/firebase');
    getFirestore.mockReturnValue(mockDb);
    
    app = express();
    app.use(express.json());
    app.use('/onboarding', onboardingRoutes);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /onboarding/requirements', () => {
    test('should return unified requirements for selected categories', async () => {
      // Mock user selected categories
      const mockCategoriesData = {
        'tutoring': { selectedAt: '2024-01-01T00:00:00.000Z' },
        'handyman': { selectedAt: '2024-01-01T00:00:00.000Z' }
      };

      // Mock legacy requirements
      const mockRequirementsData = [
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

      // Setup mocks
      mockDb.collection.mockImplementation((collectionName) => {
        if (collectionName === 'profile_categories') {
          return {
            doc: (uid) => ({
              get: () => Promise.resolve({
                exists: true,
                data: () => mockCategoriesData
              })
            })
          };
        }
        if (collectionName === 'category_requirements') {
          return {
            get: () => Promise.resolve({
              forEach: (callback) => {
                mockRequirementsData.forEach(callback);
              }
            })
          };
        }
        return { doc: () => ({ get: () => Promise.resolve({ exists: false }) }) };
      });

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
      // Mock user selected categories with unknown category
      const mockCategoriesData = {
        'unknown-category': { selectedAt: '2024-01-01T00:00:00.000Z' }
      };

      mockDb.collection.mockImplementation((collectionName) => {
        if (collectionName === 'profile_categories') {
          return {
            doc: (uid) => ({
              get: () => Promise.resolve({
                exists: true,
                data: () => mockCategoriesData
              })
            })
          };
        }
        if (collectionName === 'category_requirements') {
          return {
            get: () => Promise.resolve({
              forEach: () => {} // No requirements found
            })
          };
        }
        return { doc: () => ({ get: () => Promise.resolve({ exists: false }) }) };
      });

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
      mockDb.collection.mockImplementation(() => {
        throw new Error('Database connection failed');
      });

      const response = await request(app)
        .get('/onboarding/requirements')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Failed to load requirements');
    });
  });
});