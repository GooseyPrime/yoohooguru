/**
 * Firebase Admin Mock for Testing
 * 
 * This mock provides a minimal implementation of firebase-admin for test environments.
 * It should NEVER be used in production, staging, or development environments.
 * 
 * @module test/mocks/firebase-admin-mock
 */

/**
 * Creates a mock Firebase Admin SDK instance for testing
 * @returns {Object} Mock firebase-admin instance
 */
function createFirebaseAdminMock() {
  return {
    apps: { length: 0 },
    initializeApp: (config) => ({
      options: config
    }),
    app: () => ({}),
    auth: () => ({
      verifyIdToken: (_token) => Promise.resolve({
        uid: 'test-user-123',
        email: 'test@example.com'
      }),
      createUser: (properties) => Promise.resolve({
        uid: 'test-user-' + Date.now(),
        email: properties.email,
        ...properties
      }),
      getUserByEmail: (email) => Promise.resolve({
        uid: 'test-user-123',
        email: email
      }),
      deleteUser: (_uid) => Promise.resolve(),
      updateUser: (_uid, _properties) => Promise.resolve({
        uid: 'test-user-123'
      })
    }),
    firestore: () => ({
      collection: (_name) => ({
        doc: (_id) => ({
          get: () => Promise.resolve({ 
            exists: false,
            data: () => null
          }),
          set: () => Promise.resolve(),
          update: () => Promise.resolve(),
          delete: () => Promise.resolve()
        }),
        get: () => Promise.resolve({ docs: [] }),
        add: () => Promise.resolve({ id: 'test-doc-id-' + Date.now() }),
        where: () => ({
          get: () => Promise.resolve({ docs: [] }),
          limit: () => ({
            get: () => Promise.resolve({ docs: [] })
          })
        }),
        orderBy: () => ({
          get: () => Promise.resolve({ docs: [] }),
          limit: () => ({
            get: () => Promise.resolve({ docs: [] })
          })
        }),
        limit: () => ({
          get: () => Promise.resolve({ docs: [] })
        })
      }),
      batch: () => ({
        set: () => {},
        update: () => {},
        delete: () => {},
        commit: () => Promise.resolve()
      }),
      Timestamp: {
        now: () => ({ seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 }),
        fromDate: (date) => ({ 
          seconds: Math.floor(date.getTime() / 1000), 
          nanoseconds: 0 
        })
      }
    }),
    credential: {
      cert: () => ({})
    }
  };
}

module.exports = {
  createFirebaseAdminMock
};
