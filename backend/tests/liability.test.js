const request = require('supertest');
const { app, server } = require('../src/index'); // Assumes server is exported from index.js
const { getDatabase } = require('../src/config/firebase');

// Mock Firebase
jest.mock('../src/config/firebase', () => ({
  getDatabase: jest.fn(() => ({
    ref: jest.fn(() => ({
      get: jest.fn(),
      update: jest.fn()
    }))
  }))
}));

// Mock Auth Middleware
jest.mock('../src/middleware/auth', () => ({
  authenticateUser: (req, res, next) => {
    req.user = { uid: 'test-user-123' };
    next();
  }
}));

describe('Liability Waiver', () => {
  let mockDb;

  beforeEach(() => {
    // Setup mock database for each test
    mockDb = {
      ref: jest.fn(() => ({
        get: jest.fn().mockResolvedValue({ val: () => ({ name: 'Test User' }) }), // Default to user existing
        update: jest.fn().mockResolvedValue()
      }))
    };
    getDatabase.mockReturnValue(mockDb);
    jest.clearAllMocks();
  });

  // Add this cleanup hook to close the server after all tests in this file run
  afterAll((done) => {
    server.close(done);
  });

  describe('POST /api/liability/sign', () => {
    test('should sign the liability waiver for an authenticated user', async () => {
      const response = await request(app)
        .post('/api/liability/sign')
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.message).toBe('Liability waiver signed successfully.');

      const dbRef = mockDb.ref(`users/test-user-123`);
      expect(dbRef).toHaveBeenCalled();
      expect(dbRef().update).toHaveBeenCalledWith({
        liability_waiver_signed: true,
        liability_waiver_timestamp: expect.any(Number)
      });
    });

    test('should return an error if user profile is not found', async () => {
        // Override mock for this specific test
        mockDb.ref().get.mockResolvedValue({ val: () => null });

        const response = await request(app)
            .post('/api/liability/sign')
            .expect(404);

        expect(response.body.ok).toBe(false);
        expect(response.body.error).toBe('User profile not found.');
    });


    test('should handle database errors gracefully', async () => {
        // Mock a database update failure
        mockDb.ref().update.mockRejectedValue(new Error('Database error'));

        const response = await request(app)
            .post('/api/liability/sign')
            .expect(500);

        expect(response.body.ok).toBe(false);
        expect(response.body.error).toBe('Failed to sign liability waiver.');
    });
  });
});
