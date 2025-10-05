const { getFirestore } = require('../config/firebase');
const admin = require('firebase-admin');

const getCollection = () => {
  const firestore = getFirestore();
  if (!firestore) {
    throw new Error('Firestore not initialized');
  }
  return firestore.collection('skills');
};

/**
 * Create a new skill document
 * @param {Object} doc - Skill document data
 * @returns {Object} Created skill with ID
 */
async function create(doc) {
  const col = getCollection();
  const ref = col.doc();
  const now = Date.now();
  const skillData = { 
    ...doc, 
    createdAt: now, 
    updatedAt: now,
    status: doc.status || 'pending' // Default to pending for moderation
  };
  
  await ref.set(skillData);
  return { id: ref.id, ...skillData };
}

/**
 * Find skills with various filters
 * @param {Object} options - Query options
 * @param {string} options.q - Search query (text search)
 * @param {string} options.tag - Accessibility tag filter
 * @param {string} options.style - Coaching style filter  
 * @param {boolean} options.isModifiedMasters - Filter by Modified Masters
 * @param {string} options.status - Filter by status
 * @returns {Array} Array of matching skills
 */
async function find({ q, tag, style, isModifiedMasters, status } = {}) {
  const col = getCollection();
  let query = col;
  
  // Apply Firestore native filters
  if (typeof isModifiedMasters === 'boolean') {
    query = query.where('isModifiedMasters', '==', isModifiedMasters);
  }
  
  if (status) {
    query = query.where('status', '==', status);
  }
  
  // For array-contains filters (preferred for tags and styles)
  if (tag) {
    query = query.where('accessibilityTags', 'array-contains', tag);
  }
  
  if (style) {
    query = query.where('coachingStyles', 'array-contains', style);
  }

  // Execute query with limit
  const snap = await query.limit(100).get();
  let items = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  // Client-side text search (since Firestore doesn't have full-text search)
  if (q) {
    const queryLower = String(q).toLowerCase();
    items = items.filter((skill) =>
      (skill.title || '').toLowerCase().includes(queryLower) ||
      (skill.summary || '').toLowerCase().includes(queryLower)
    );
  }
  
  return items;
}

/**
 * Get a skill by ID
 * @param {string} id - Skill ID
 * @returns {Object|null} Skill document or null if not found
 */
async function get(id) {
  const col = getCollection();
  const doc = await col.doc(id).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

/**
 * Update a skill document
 * @param {string} id - Skill ID
 * @param {Object} patch - Fields to update
 * @returns {Object} Updated skill document
 */
async function update(id, patch) {
  const col = getCollection();
  const updateData = {
    ...patch,
    updatedAt: Date.now()
  };
  
  await col.doc(id).set(updateData, { merge: true });
  const doc = await col.doc(id).get();
  return { id: doc.id, ...doc.data() };
}

/**
 * Add a resource to a skill
 * @param {string} id - Skill ID
 * @param {Object} link - Resource link object
 * @returns {Object} Updated skill document
 */
async function addResource(id, link) {
  const col = getCollection();
  const ref = col.doc(id);
  
  const resourceData = {
    id: require('uuid').v4(),
    addedAt: Date.now(),
    ...link
  };
  
  await ref.set({
    resources: admin.firestore.FieldValue.arrayUnion(resourceData),
    updatedAt: Date.now()
  }, { merge: true });
  
  const doc = await ref.get();
  return { id: doc.id, ...doc.data() };
}

/**
 * Get skills created by a specific user
 * @param {string} userId - User ID
 * @returns {Array} Array of user's skills
 */
async function getByCreator(userId) {
  const col = getCollection();
  const snap = await col
    .where('createdBy', '==', userId)
    .orderBy('createdAt', 'desc')
    .limit(50)
    .get();
  
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

module.exports = {
  create,
  find,
  get,
  update,
  addResource,
  getByCreator
};