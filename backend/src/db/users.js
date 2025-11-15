const { getFirestore } = require('../config/firebase');

const getCollection = () => {
  const firestore = getFirestore();
  if (!firestore) {
    throw new Error('Firestore not initialized');
  }
  return firestore.collection('users');
};

/**
 * Merge/update user profile data
 * @param {string} userId - User ID
 * @param {Object} patch - Fields to update
 * @returns {Object} Updated user document
 */
async function merge(userId, patch) {
  const col = getCollection();
  const now = Date.now();
  
  const updateData = {
    ...patch,
    updatedAt: now
  };
  
  await col.doc(userId).set(updateData, { merge: true });
  const doc = await col.doc(userId).get();
  
  return { id: doc.id, ...doc.data() };
}

/**
 * Get a user by ID
 * @param {string} userId - User ID
 * @returns {Object|null} User document or null if not found
 */
async function get(userId) {
  const col = getCollection();
  const doc = await col.doc(userId).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

/**
 * Create a new user document
 * @param {string} userId - User ID
 * @param {Object} userData - User data
 * @returns {Object} Created user document
 */
async function create(userId, userData) {
  const col = getCollection();
  const now = Date.now();
  
  const newUserData = {
    ...userData,
    createdAt: now,
    updatedAt: now
  };
  
  await col.doc(userId).set(newUserData);
  return { id: userId, ...newUserData };
}

/**
 * Update accessibility preferences
 * @param {string} userId - User ID
 * @param {Object} accessibility - Accessibility preferences
 * @returns {Object} Updated user document
 */
async function updateAccessibility(userId, accessibility) {
  return merge(userId, { accessibility });
}

/**
 * Update Modified Masters preferences
 * @param {string} userId - User ID
 * @param {Object} modifiedMasters - Modified Masters preferences
 * @returns {Object} Updated user document
 */
async function updateModifiedMasters(userId, modifiedMasters) {
  return merge(userId, { modifiedMasters });
}

/**
 * Find users with specific Modified Masters preferences
 * @param {Object} filters - Search filters
 * @param {boolean} filters.wantsToTeach - User wants to teach
 * @param {boolean} filters.wantsToLearn - User wants to learn
 * @param {string} filters.tag - Specific tag filter
 * @returns {Array} Array of matching users
 */
async function findModifiedMasters({ wantsToTeach, wantsToLearn, tag } = {}) {
  const col = getCollection();
  let query = col.where('modifiedMasters.visible', '==', true);
  
  if (typeof wantsToTeach === 'boolean') {
    query = query.where('modifiedMasters.wantsToTeach', '==', wantsToTeach);
  }
  
  if (typeof wantsToLearn === 'boolean') {
    query = query.where('modifiedMasters.wantsToLearn', '==', wantsToLearn);
  }
  
  if (tag) {
    query = query.where('modifiedMasters.tags', 'array-contains', tag);
  }
  
  const snap = await query.limit(50).get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Get users with accessibility needs
 * @param {string} accessibilityType - Type of accessibility filter
 * @returns {Array} Array of users with specified accessibility needs
 */
async function findByAccessibility(accessibilityType) {
  const col = getCollection();
  const query = col.where(`accessibility.${accessibilityType}`, '!=', null).limit(50);
  
  const snap = await query.get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Update user's last activity timestamp
 * @param {string} userId - User ID
 * @returns {Object} Updated user document
 */
async function updateLastActivity(userId) {
  return merge(userId, { lastActivity: Date.now() });
}

module.exports = {
  merge,
  get,
  create,
  updateAccessibility,
  updateModifiedMasters,
  findModifiedMasters,
  findByAccessibility,
  updateLastActivity,
  updateDisabilityAttestation,
  updateHeroGuruPrefs,
  findHeroGurusProvidingFreeServices,
  findUsersWithDisabilityAttestation
};
/**
 * Update disability attestation
 * @param {string} userId - User ID
 * @param {Object} attestation - Disability attestation data
 * @returns {Object} Updated user document
 */
async function updateDisabilityAttestation(userId, attestation) {
  return merge(userId, { disabilityAttestation: attestation });
}

/**
 * Update Hero Guru preferences
 * @param {string} userId - User ID
 * @param {Object} heroGuruPrefs - Hero Guru preferences
 * @returns {Object} Updated user document
 */
async function updateHeroGuruPrefs(userId, heroGuruPrefs) {
  return merge(userId, { heroGuruPrefs });
}

/**
 * Find Hero Gurus who provide free services
 * @param {Object} filters - Search filters
 * @returns {Array} Array of Hero Gurus
 */
async function findHeroGurusProvidingFreeServices(/* filters = {} */) {
  const col = getCollection();
  let query = col
    .where('heroGuruPrefs.provideFreeServices', '==', true)
    .where('heroGuruPrefs.visible', '==', true);
  
  const snap = await query.limit(50).get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Find users with disability attestation
 * @param {boolean} verified - Filter by verification status
 * @returns {Array} Array of users with disability attestation
 */
async function findUsersWithDisabilityAttestation(verified = null) {
  const col = getCollection();
  let query = col.where('disabilityAttestation.attested', '==', true);
  
  if (verified !== null) {
    query = query.where('disabilityAttestation.documentationVerified', '==', verified);
  }
  
  const snap = await query.limit(100).get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
