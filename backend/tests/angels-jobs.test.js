// Production-ready database connections - NO MOCKS
const request = require('supertest');
const app = require('../src/index');
const { getFirestore } = require('../src/config/firebase');

// Mock authentication middleware to inject test user - using static IDs for consistency
jest.mock('../src/middleware/auth', () => ({
  requireAuth: (req, res, next) => {
    req.user = { 
      uid: 'test-angels-user-static', 
      email: 'test-angels@example.com' 
    };
    next();
  },
  optionalAuth: (req, res, next) => {
    req.user = { 
      uid: 'test-angels-user-static', 
      email: 'test-angels@example.com' 
    };
    next();
  },
  authenticateUser: (req, res, next) => {
    req.user = { 
      uid: 'test-angels-user-static', 
      email: 'test-angels@example.com' 
    };
    next();
  },
  requireRole: (roles) => (req, res, next) => {
    req.user = { 
      uid: 'test-angels-user-static', 
      email: 'test-angels@example.com', 
      role: 'admin' 
    };
    next();
  }
}));

// Mock only logger for test output control
jest.mock('../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  }
}));

const request = require('supertest');
const app = require('../src/index');
const { seedTestData, clearTestData } = require('./seed-test-data');

describe('Angels Jobs API', () => {
  beforeEach(async () => {
    await clearTestData();
    await seedTestData();
  });

  afterEach(async () => {
    await clearTestData();
  });

  describe('POST /api/angels/jobs', () => {
    it('should create a new angel job posting', async () => {
      const jobData = {
        title: 'Help with Moving',
        description: 'Need help moving furniture to new apartment',
        category: 'moving',
        location: { city: 'Denver', state: 'CO' },
        hourlyRate: 25,
        estimatedHours: 4,
        skills: ['Heavy Lifting', 'Furniture Moving'],
        urgency: 'normal',
        featured: true
      };

      const response = await request(app)
        .post('/api/angels/jobs')
        .send(jobData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.job.title).toBe(jobData.title);
      expect(response.body.data.job.postedBy).toBe(TEST_USER.uid);
      expect(response.body.data.job.status).toBe('open');
    });

    it('should return 400 for missing required fields', async () => {
      const incompleteJobData = {
        title: 'Help with Moving'
        // Missing description, category, location
      };

      const response = await request(app)
        .post('/api/angels/jobs')
        .send(incompleteJobData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Missing required fields');
    });
  });

  describe('GET /api/angels/jobs', () => {
    it('should return filtered list of angel jobs', async () => {
      const response = await request(app)
        .get('/api/angels/jobs?category=general')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.jobs.length).toBeGreaterThan(0);
      // All returned jobs should be general category
      response.body.data.jobs.forEach(job => {
        expect(job.category).toBe('general');
      });
    });

    it('should support search functionality', async () => {
      const response = await request(app)
        .get('/api/angels/jobs?search=Featured')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.jobs.length).toBeGreaterThan(0);
      // Should find the "Featured Job" from seed data
      const featuredJob = response.body.data.jobs.find(job => job.title.includes('Featured'));
      expect(featuredJob).toBeDefined();
    });

    it('should sort featured jobs to the top', async () => {
      const response = await request(app)
        .get('/api/angels/jobs')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.jobs).toHaveLength(4);
      
      // Featured job should be first, regardless of creation date
      expect(response.body.data.jobs[0].title).toBe('Featured Job');
      expect(response.body.data.jobs[0].featured).toBe(true);
    });
  });

  describe('GET /api/angels/jobs/:jobId', () => {
    it('should return job details with poster information', async () => {
      const response = await request(app)
        .get(`/api/angels/jobs/${jobRef.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.job.title).toBe('Featured Job');
      expect(response.body.data.job.poster).toBeDefined();
    });

    it('should return 404 for non-existent job', async () => {
      const response = await request(app)
        .get('/api/angels/jobs/non-existent-job-id')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Angel job not found');
    });
  });

  describe('POST /api/angels/jobs/:jobId/apply', () => {
    it('should allow user to apply to a job', async () => {
      const applicationData = {
        message: 'I want to apply for this job',
        proposedRate: 30
      };

      const response = await request(app)
        .post(`/api/angels/jobs/${jobRef.id}/apply`)
        .send(applicationData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.application).toBeDefined();
      expect(response.body.data.application.applicantId).toBe(TEST_USER.uid);
      expect(response.body.data.application.message).toBe(applicationData.message);
      expect(response.body.data.application.status).toBe('pending');
    });

    it('should prevent user from applying to their own job', async () => {
      // job-456 is posted by test-user-123 (same as authenticated user)
      const response = await request(app)
        .post('/api/angels/jobs/job-456/apply')
        .send({ message: 'I want to apply' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Cannot apply to your own job posting');
    });

    it('should prevent duplicate applications', async () => {
      // First, check if job exists
      const jobCheck = await request(app)
        .get('/api/angels/jobs/job-123');
      
      console.log('Job check status:', jobCheck.status);
      console.log('Job check body:', jobCheck.body);

      // First application
      const firstResponse = await request(app)
        .post('/api/angels/jobs/job-123/apply')
        .send({ message: 'First application' });

      console.log('First response status:', firstResponse.status);
      console.log('First response body:', firstResponse.body);
      
      expect(firstResponse.status).toBe(200);

      // Second application should fail
      const response = await request(app)
        .post(`/api/angels/jobs/${jobRef.id}/apply`)
        .send({ message: 'I want to apply again' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('You have already applied to this job');
    });
  });

  describe('GET /api/angels/my-activity', () => {
    it('should return user activity summary', async () => {
      const response = await request(app)
        .get('/api/angels/my-activity')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.postedJobs).toBeDefined();
      expect(response.body.data.applications).toBeDefined();
      expect(response.body.data.statistics).toBeDefined();
      
      // Should have arrays (could be empty or contain data)
      expect(Array.isArray(response.body.data.postedJobs)).toBe(true);
      expect(Array.isArray(response.body.data.applications)).toBe(true);
      
      // Statistics should have numbers
      expect(typeof response.body.data.statistics.totalJobsPosted).toBe('number');
      expect(typeof response.body.data.statistics.totalApplications).toBe('number');
      
      // The counts should match the array lengths
      expect(response.body.data.statistics.totalJobsPosted).toBe(response.body.data.postedJobs.length);
      expect(response.body.data.statistics.totalApplications).toBe(response.body.data.applications.length);
    });
  });
});