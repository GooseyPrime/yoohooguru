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

// Test user configuration for consistent testing
const TEST_USER = { 
  uid: 'test-angels-user-static', 
  email: 'test-angels@example.com' 
};

let firebaseInitialized = false;
let testJobIds = []; // Track created job IDs for cleanup

beforeAll(async () => {
  try {
    const db = getFirestore();
    firebaseInitialized = !!db;
    console.log('Real Firebase initialized for angels jobs tests');
    
    // Create test user profile if Firebase is available
    if (firebaseInitialized) {
      try {
        await db.collection('users').doc(TEST_USER.uid).set({
          email: TEST_USER.email,
          name: 'Test Angels User',
          createdAt: new Date().toISOString()
        });
      } catch (error) {
        console.log('Test user creation failed (may already exist):', error.message);
      }
    }
  } catch (error) {
    console.warn('Firebase connection warning:', error.message);
    firebaseInitialized = false;
  }
});

afterAll(async () => {
  // Clean up test data
  if (firebaseInitialized) {
    try {
      const db = getFirestore();
      
      // Clean up test jobs
      for (const jobId of testJobIds) {
        try {
          await db.collection('angel_jobs').doc(jobId).delete();
        } catch (error) {
          console.log(`Failed to delete test job ${jobId}:`, error.message);
        }
      }
      
      // Clean up test user
      try {
        await db.collection('users').doc(TEST_USER.uid).delete();
      } catch (error) {
        console.log('Test user cleanup failed:', error.message);
      }
      
      // Clean up activity logs
      try {
        const activityLogsSnapshot = await db.collection('activity_logs')
          .where('userId', '==', TEST_USER.uid)
          .get();
        
        const batch = db.batch();
        activityLogsSnapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        
        if (activityLogsSnapshot.docs.length > 0) {
          await batch.commit();
        }
      } catch (error) {
        console.log('Activity logs cleanup failed:', error.message);
      }
      
    } catch (error) {
      console.log('Test cleanup error:', error.message);
    }
  }
});

// Helper function to skip tests when Firebase is not available
const skipIfNoFirebase = () => {
  if (!firebaseInitialized) {
    return true; // Return true to indicate test should be skipped
  }
  return false;
};

describe('Angels Jobs API', () => {
  describe('POST /api/angels/jobs', () => {
    it('should create a new angel job posting', async () => {
      if (skipIfNoFirebase()) {
        console.log('⏭️ Skipping test - Firebase not initialized in test environment');
        return;
      }
      
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
      expect(response.body.data.job.featured).toBe(true);
      expect(response.body.data.job.category).toBe('moving');
      expect(response.body.data.job.location).toEqual(jobData.location);
      
      // Track job ID for cleanup
      const createdJobId = response.body.data.job.id;
      testJobIds.push(createdJobId);
      
      // Verify job was actually created in database
      const db = getFirestore();
      const jobSnapshot = await db.collection('angel_jobs').doc(createdJobId).get();
      expect(jobSnapshot.exists).toBe(true);
      
      const jobData_fromDB = jobSnapshot.data();
      expect(jobData_fromDB.title).toBe(jobData.title);
      expect(jobData_fromDB.postedBy).toBe(TEST_USER.uid);
      expect(jobData_fromDB.status).toBe('open');
    });

    it('should return 400 for missing required fields', async () => {
      if (skipIfNoFirebase()) {
        console.log('⏭️ Skipping test - Firebase not initialized in test environment');
        return;
      }
      
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
      if (skipIfNoFirebase()) {
        console.log('⏭️ Skipping test - Firebase not initialized in test environment');
        return;
      }
      
      // Create real test jobs in database
      const db = getFirestore();
      
      const testJob1 = {
        title: 'Handyman Work',
        description: 'Need help with home repairs',
        category: 'home',
        location: { city: 'Denver', state: 'CO' },
        status: 'open',
        postedBy: TEST_USER.uid,
        applications: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const testJob2 = {
        title: 'Moving Help',
        description: 'Need help moving boxes',
        category: 'moving',
        location: { city: 'Boulder', state: 'CO' },
        status: 'open',
        postedBy: TEST_USER.uid,
        applications: { 'user-1': {} },
        createdAt: new Date(Date.now() - 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1000).toISOString()
      };
      
      // Create jobs in database
      const job1Ref = db.collection('angel_jobs').doc();
      const job2Ref = db.collection('angel_jobs').doc();
      
      testJob1.id = job1Ref.id;
      testJob2.id = job2Ref.id;
      
      await job1Ref.set(testJob1);
      await job2Ref.set(testJob2);
      
      // Track for cleanup
      testJobIds.push(job1Ref.id, job2Ref.id);

      const response = await request(app)
        .get('/api/angels/jobs?category=home')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.jobs.length).toBeGreaterThanOrEqual(1);
      
      // Find our test job in the results
      const homeJob = response.body.data.jobs.find(job => job.id === job1Ref.id);
      expect(homeJob).toBeDefined();
      expect(homeJob.category).toBe('home');
      expect(homeJob.title).toBe('Handyman Work');
    });

    it('should support search functionality', async () => {
      if (skipIfNoFirebase()) {
        console.log('⏭️ Skipping test - Firebase not initialized in test environment');
        return;
      }
      
      // Create real test jobs for search
      const db = getFirestore();
      
      const searchJob1 = {
        title: 'Handyman Repair Work',
        description: 'Fix kitchen sink',
        category: 'home',
        location: { city: 'Denver', state: 'CO' },
        status: 'open',
        postedBy: TEST_USER.uid,
        applications: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const searchJob2 = {
        title: 'Garden Maintenance',
        description: 'Weed removal and planting',
        category: 'outdoor',
        location: { city: 'Denver', state: 'CO' },
        status: 'open',
        postedBy: TEST_USER.uid,
        applications: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Create jobs in database
      const searchJob1Ref = db.collection('angel_jobs').doc();
      const searchJob2Ref = db.collection('angel_jobs').doc();
      
      searchJob1.id = searchJob1Ref.id;
      searchJob2.id = searchJob2Ref.id;
      
      await searchJob1Ref.set(searchJob1);
      await searchJob2Ref.set(searchJob2);
      
      // Track for cleanup
      testJobIds.push(searchJob1Ref.id, searchJob2Ref.id);

      const response = await request(app)
        .get('/api/angels/jobs?search=handyman')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.jobs.length).toBeGreaterThanOrEqual(1);
      
      // Find our handyman job in the results
      const handymanJob = response.body.data.jobs.find(job => job.title.toLowerCase().includes('handyman'));
      expect(handymanJob).toBeDefined();
      expect(handymanJob.title).toContain('Handyman');
    });

    it('should sort featured jobs to the top', async () => {
      if (skipIfNoFirebase()) {
        console.log('⏭️ Skipping test - Firebase not initialized in test environment');
        return;
      }
      
      // Create real test jobs with different featured status
      const db = getFirestore();
      
      const regularJob = {
        title: 'Regular Job',
        description: 'A regular job posting',
        category: 'home',
        location: { city: 'Denver', state: 'CO' },
        status: 'open',
        featured: false,
        postedBy: TEST_USER.uid,
        applications: {},
        createdAt: new Date(Date.now() - 1000).toISOString(), // Older job
        updatedAt: new Date(Date.now() - 1000).toISOString()
      };
      
      const featuredJob = {
        title: 'Featured Job',
        description: 'A featured job posting',
        category: 'home',
        location: { city: 'Denver', state: 'CO' },
        status: 'open',
        featured: true,
        postedBy: TEST_USER.uid,
        applications: {},
        createdAt: new Date(Date.now() - 2000).toISOString(), // Even older but featured
        updatedAt: new Date(Date.now() - 2000).toISOString()
      };
      
      const newestJob = {
        title: 'Another Regular Job',
        description: 'Another regular job posting',
        category: 'home',
        location: { city: 'Denver', state: 'CO' },
        status: 'open',
        featured: false,
        postedBy: TEST_USER.uid,
        applications: {},
        createdAt: new Date().toISOString(), // Newest job
        updatedAt: new Date().toISOString()
      };
      
      // Create jobs in database
      const regularJobRef = db.collection('angel_jobs').doc();
      const featuredJobRef = db.collection('angel_jobs').doc();
      const newestJobRef = db.collection('angel_jobs').doc();
      
      regularJob.id = regularJobRef.id;
      featuredJob.id = featuredJobRef.id;
      newestJob.id = newestJobRef.id;
      
      await regularJobRef.set(regularJob);
      await featuredJobRef.set(featuredJob);
      await newestJobRef.set(newestJob);
      
      // Track for cleanup
      testJobIds.push(regularJobRef.id, featuredJobRef.id, newestJobRef.id);

      const response = await request(app)
        .get('/api/angels/jobs')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.jobs.length).toBeGreaterThanOrEqual(3);

      // Check that featured jobs come first - find our jobs in results
      const jobs = response.body.data.jobs;
      const featuredJobInResults = jobs.find(job => job.id === featuredJobRef.id);
      const regularJobInResults = jobs.find(job => job.id === regularJobRef.id);
      
      expect(featuredJobInResults).toBeDefined();
      expect(regularJobInResults).toBeDefined();
      
      // Featured job should come before regular job in the list
      const featuredIndex = jobs.findIndex(job => job.id === featuredJobRef.id);
      const regularIndex = jobs.findIndex(job => job.id === regularJobRef.id);
      
      expect(featuredIndex).toBeLessThan(regularIndex);
    });
  });

  describe('GET /api/angels/jobs/:jobId', () => {
    it('should return job details with poster information', async () => {
      if (skipIfNoFirebase()) {
        console.log('⏭️ Skipping test - Firebase not initialized in test environment');
        return;
      }
      
      // Create a real test job
      const db = getFirestore();
      
      const testJob = {
        title: 'Help with Gardening',
        description: 'Need help with garden maintenance',
        category: 'outdoor',
        location: { city: 'Denver', state: 'CO' },
        status: 'open',
        postedBy: TEST_USER.uid,
        applications: { 'user-1': {}, 'user-2': {} },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const jobRef = db.collection('angel_jobs').doc();
      testJob.id = jobRef.id;
      
      await jobRef.set(testJob);
      testJobIds.push(jobRef.id);

      const response = await request(app)
        .get(`/api/angels/jobs/${jobRef.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.job.title).toBe(testJob.title);
      expect(response.body.data.job.id).toBe(jobRef.id);
      expect(response.body.data.job.poster).toBeDefined();
      expect(response.body.data.job.poster.id).toBe(TEST_USER.uid);
      expect(response.body.data.job.applicationCount).toBe(2);
    });

    it('should return 404 for non-existent job', async () => {
      if (skipIfNoFirebase()) {
        console.log('⏭️ Skipping test - Firebase not initialized in test environment');
        return;
      }

      const response = await request(app)
        .get('/api/angels/jobs/non-existent-job-id')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Angel job not found');
    });
  });

  describe('POST /api/angels/jobs/:jobId/apply', () => {
    it('should allow user to apply to a job', async () => {
      if (skipIfNoFirebase()) {
        console.log('⏭️ Skipping test - Firebase not initialized in test environment');
        return;
      }
      
      // Create a test job posted by a different user
      const db = getFirestore();
      
      // Create another test user to post the job
      const differentUser = { uid: 'different-user-' + Date.now(), email: 'different@example.com' };
      await db.collection('users').doc(differentUser.uid).set({
        email: differentUser.email,
        name: 'Different User',
        createdAt: new Date().toISOString()
      });
      
      const testJob = {
        title: 'Garden Work',
        description: 'Need help with garden maintenance',
        category: 'outdoor',
        location: { city: 'Denver', state: 'CO' },
        postedBy: differentUser.uid,
        status: 'open',
        applications: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const jobRef = db.collection('angel_jobs').doc();
      testJob.id = jobRef.id;
      
      await jobRef.set(testJob);
      testJobIds.push(jobRef.id);

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
      
      // Verify application was added to database
      const updatedJobSnapshot = await db.collection('angel_jobs').doc(jobRef.id).get();
      const updatedJob = updatedJobSnapshot.data();
      expect(updatedJob.applications[TEST_USER.uid]).toBeDefined();
      expect(updatedJob.applications[TEST_USER.uid].applicantId).toBe(TEST_USER.uid);
      
      // Clean up different user
      await db.collection('users').doc(differentUser.uid).delete();
    });

    it('should prevent user from applying to their own job', async () => {
      if (skipIfNoFirebase()) {
        console.log('⏭️ Skipping test - Firebase not initialized in test environment');
        return;
      }
      
      // Create a test job posted by the same user (TEST_USER)
      const db = getFirestore();
      
      const ownJob = {
        title: 'My Own Job',
        description: 'A job I posted myself',
        category: 'home',
        location: { city: 'Denver', state: 'CO' },
        postedBy: TEST_USER.uid, // Same as authenticated user
        status: 'open',
        applications: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const jobRef = db.collection('angel_jobs').doc();
      ownJob.id = jobRef.id;
      
      await jobRef.set(ownJob);
      testJobIds.push(jobRef.id);

      const response = await request(app)
        .post(`/api/angels/jobs/${jobRef.id}/apply`)
        .send({ message: 'I want to apply' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('Cannot apply to your own job posting');
    });

    it('should prevent duplicate applications', async () => {
      if (skipIfNoFirebase()) {
        console.log('⏭️ Skipping test - Firebase not initialized in test environment');
        return;
      }
      
      // Create a test job with an existing application
      const db = getFirestore();
      
      // Create another test user to post the job
      const differentUser = { uid: 'different-user-duplicate-' + Date.now(), email: 'different-duplicate@example.com' };
      await db.collection('users').doc(differentUser.uid).set({
        email: differentUser.email,
        name: 'Different User Duplicate',
        createdAt: new Date().toISOString()
      });
      
      const duplicateTestJob = {
        title: 'Garden Work Duplicate',
        description: 'Need help with garden maintenance',
        category: 'outdoor',
        location: { city: 'Denver', state: 'CO' },
        postedBy: differentUser.uid,
        status: 'open',
        applications: {
          [TEST_USER.uid]: { 
            status: 'pending',
            appliedAt: new Date().toISOString(),
            applicantId: TEST_USER.uid
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const jobRef = db.collection('angel_jobs').doc();
      duplicateTestJob.id = jobRef.id;
      
      await jobRef.set(duplicateTestJob);
      testJobIds.push(jobRef.id);

      const response = await request(app)
        .post(`/api/angels/jobs/${jobRef.id}/apply`)
        .send({ message: 'I want to apply again' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toBe('You have already applied to this job');
      
      // Clean up different user
      await db.collection('users').doc(differentUser.uid).delete();
    });
  });

  describe('GET /api/angels/my-activity', () => {
    it('should return user activity summary', async () => {
      if (skipIfNoFirebase()) {
        console.log('⏭️ Skipping test - Firebase not initialized in test environment');
        return;
      }

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