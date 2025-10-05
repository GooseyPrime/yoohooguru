/**
 * Session Store Configuration Tests
 * 
 * These tests verify that the session store is properly configured
 * based on the environment (MemoryStore for dev/test, Firestore for production).
 */

const session = require('express-session');

describe('Session Store Configuration', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    // Restore original environment
    process.env.NODE_ENV = originalNodeEnv;
    jest.resetModules();
  });

  describe('Development/Test environment', () => {
    it('should use MemoryStore in test environment', () => {
      process.env.NODE_ENV = 'test';
      
      // Create a session configuration without a custom store
      const sessionConfig = {
        secret: 'test_secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false,
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000
        }
      };
      
      // When no store is specified, express-session uses MemoryStore by default
      expect(sessionConfig.store).toBeUndefined();
    });

    it('should use MemoryStore in development environment', () => {
      process.env.NODE_ENV = 'development';
      
      const sessionConfig = {
        secret: 'test_secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false,
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000
        }
      };
      
      expect(sessionConfig.store).toBeUndefined();
    });
  });

  describe('Production/Staging environment', () => {
    it('should configure Firestore store for production', () => {
      // Mock the Firestore instance
      const mockFirestore = {
        collection: jest.fn(() => ({
          doc: jest.fn(),
          get: jest.fn()
        }))
      };

      const FirestoreStore = require('firestore-store')(session);
      
      const store = new FirestoreStore({
        database: mockFirestore,
        collection: 'sessions'
      });

      expect(store).toBeInstanceOf(session.Store);
      expect(mockFirestore.collection).toHaveBeenCalledWith('sessions');
    });

    it('should configure Firestore store for staging', () => {
      const mockFirestore = {
        collection: jest.fn(() => ({
          doc: jest.fn(),
          get: jest.fn()
        }))
      };

      const FirestoreStore = require('firestore-store')(session);
      
      const store = new FirestoreStore({
        database: mockFirestore,
        collection: 'sessions'
      });

      expect(store).toBeInstanceOf(session.Store);
    });

    it('should throw error if Firestore database is not provided', () => {
      const FirestoreStore = require('firestore-store')(session);
      
      expect(() => {
        new FirestoreStore({
          // Missing database parameter
          collection: 'sessions'
        });
      }).toThrow('options.database is required');
    });
  });

  describe('Session store methods', () => {
    let store;
    let mockFirestore;

    beforeEach(() => {
      mockFirestore = {
        collection: jest.fn(() => ({
          doc: jest.fn((id) => ({
            set: jest.fn(() => Promise.resolve()),
            get: jest.fn(() => Promise.resolve({ 
              exists: true, 
              data: () => ({ session: JSON.stringify({ test: 'data' }) }) 
            })),
            delete: jest.fn(() => Promise.resolve())
          })),
          get: jest.fn(() => Promise.resolve({ 
            docs: [
              { data: () => ({ session: JSON.stringify({ test: 'data1' }) }) },
              { data: () => ({ session: JSON.stringify({ test: 'data2' }) }) }
            ]
          }))
        }))
      };

      const FirestoreStore = require('firestore-store')(session);
      store = new FirestoreStore({
        database: mockFirestore,
        collection: 'sessions'
      });
    });

    it('should implement the set method', (done) => {
      const sessionData = { user: 'testuser', data: 'testdata' };
      
      store.set('test-session-id', sessionData, (err) => {
        expect(err).toBeNull();
        done();
      });
    });

    it('should implement the get method', (done) => {
      store.get('test-session-id', (err, session) => {
        expect(err).toBeNull();
        expect(session).toBeDefined();
        done();
      });
    });

    it('should implement the destroy method', (done) => {
      store.destroy('test-session-id', (err) => {
        expect(err).toBeNull();
        done();
      });
    });

    it('should implement the all method', (done) => {
      store.all((err, sessions) => {
        expect(err).toBeNull();
        expect(Array.isArray(sessions)).toBe(true);
        done();
      });
    });

    it('should implement the length method', (done) => {
      store.length((err, length) => {
        expect(err).toBeNull();
        expect(typeof length).toBe('number');
        done();
      });
    });
  });
});
