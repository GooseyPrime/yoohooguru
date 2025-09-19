const request = require('supertest');
const express = require('express');
const authRoutes = require('../src/routes/auth');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

// Mock Firebase Admin SDK
jest.mock('../src/firebase/admin', () => ({
  getAuth: jest.fn(() => ({
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
    verifyIdToken: jest.fn(),
  })),
}));

// Mock database
jest.mock('../src/db/users', () => ({
  create: jest.fn(),
  get: jest.fn(),
  merge: jest.fn(),
}));

// Mock auth middleware
jest.mock('../src/middleware/auth', () => ({
  authenticateUser: (req, res, next) => {
    req.user = { uid: 'test-uid', email: 'test@example.com' };
    next();
  },
}));

// Mock logger
jest.mock('../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('Account Recovery and Management', () => {
  describe('Profile Visibility', () => {
    it('should allow hiding user profile', async () => {
      const usersDB = require('../src/db/users');
      usersDB.merge.mockResolvedValue({ isHidden: true });

      const response = await request(app)
        .put('/auth/profile/visibility')
        .send({ hidden: true });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.isHidden).toBe(true);
      expect(usersDB.merge).toHaveBeenCalledWith('test-uid', expect.objectContaining({
        isHidden: true,
        hiddenAt: expect.any(String),
      }));
    });

    it('should allow showing user profile', async () => {
      const usersDB = require('../src/db/users');
      usersDB.merge.mockResolvedValue({ isHidden: false });

      const response = await request(app)
        .put('/auth/profile/visibility')
        .send({ hidden: false });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.isHidden).toBe(false);
      expect(usersDB.merge).toHaveBeenCalledWith('test-uid', expect.objectContaining({
        isHidden: false,
        hiddenAt: null,
      }));
    });

    it('should reject invalid visibility value', async () => {
      const response = await request(app)
        .put('/auth/profile/visibility')
        .send({ hidden: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Account Deletion', () => {
    it('should schedule account deletion with email confirmation', async () => {
      const usersDB = require('../src/db/users');
      usersDB.merge.mockResolvedValue({});

      const response = await request(app)
        .delete('/auth/account')
        .send({ confirmEmail: 'test@example.com' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.daysUntilDeletion).toBe(30);
      expect(usersDB.merge).toHaveBeenCalledWith('test-uid', expect.objectContaining({
        deletionScheduled: true,
        isActive: false,
        isHidden: true,
      }));
    });

    it('should reject deletion without email confirmation', async () => {
      const response = await request(app)
        .delete('/auth/account')
        .send({ confirmEmail: 'wrong@example.com' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject deletion without email', async () => {
      const response = await request(app)
        .delete('/auth/account')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Account Restoration', () => {
    it('should restore deleted account', async () => {
      const usersDB = require('../src/db/users');
      usersDB.get.mockResolvedValue({ deletionScheduled: true });
      usersDB.merge.mockResolvedValue({});

      const response = await request(app)
        .put('/auth/account/restore')
        .send({});

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(usersDB.merge).toHaveBeenCalledWith('test-uid', expect.objectContaining({
        deletionScheduled: false,
        isActive: true,
        isHidden: false,
      }));
    });

    it('should reject restoration when no deletion request exists', async () => {
      const usersDB = require('../src/db/users');
      usersDB.get.mockResolvedValue({ deletionScheduled: false });

      const response = await request(app)
        .put('/auth/account/restore')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe.skip('Account Merging', () => {
    it('should create merge request for valid email', async () => {
      const { getAuth } = require('../src/firebase/admin');
      const usersDB = require('../src/db/users');
      
      const mockAuth = getAuth();
      mockAuth.getUserByEmail.mockResolvedValue({ 
        uid: 'target-uid', 
        email: 'target@example.com' 
      });
      usersDB.merge.mockResolvedValue({});

      const response = await request(app)
        .post('/auth/merge/request')
        .send({ 
          targetEmail: 'target@example.com',
          provider: 'google.com'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.targetEmail).toBe('target@example.com');
      expect(usersDB.merge).toHaveBeenCalledWith('test-uid', expect.objectContaining({
        pendingMergeRequest: expect.objectContaining({
          fromUid: 'test-uid',
          toEmail: 'target@example.com',
          provider: 'google.com',
          status: 'pending',
        }),
      }));
    });

    it('should reject merge with non-existent email', async () => {
      const { getAuth } = require('../src/firebase/admin');
      
      const mockAuth = getAuth();
      mockAuth.getUserByEmail.mockRejectedValue({ code: 'auth/user-not-found' });

      const response = await request(app)
        .post('/auth/merge/request')
        .send({ 
          targetEmail: 'nonexistent@example.com',
          provider: 'google.com'
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should reject merge with same account', async () => {
      const { getAuth } = require('../src/firebase/admin');
      
      const mockAuth = getAuth();
      mockAuth.getUserByEmail.mockResolvedValue({ 
        uid: 'test-uid', // Same as current user
        email: 'test@example.com' 
      });

      const response = await request(app)
        .post('/auth/merge/request')
        .send({ 
          targetEmail: 'test@example.com',
          provider: 'google.com'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject invalid provider', async () => {
      const response = await request(app)
        .post('/auth/merge/request')
        .send({ 
          targetEmail: 'target@example.com',
          provider: 'invalid-provider'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});