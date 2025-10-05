
const { getFirestore } = require('../config/firebase');

const getCollection = () => {
  const firestore = getFirestore();
  if (!firestore) {
    throw new Error('Firestore not initialized');
  }
  return firestore.collection('sessions');
};

/**
 * Create a new session document
 * @param {Object} session - Session document data
 * @returns {Object} Created session with ID
 */
async function create(session) {
  const col = getCollection();
  const ref = col.doc();
  const now = Date.now();
  const sessionData = {
    ...session,
    createdAt: now,
    status: session.status || 'requested' // Default to requested
  };
  
  await ref.set(sessionData);
  return { id: ref.id, ...sessionData };
}

/**
 * Get sessions for a user (either as coach or learner)
 * @param {string} userId - User ID
 * @param {string} role - 'coach' or 'learner'
 * @returns {Array} Array of user's sessions
 */
async function byUser(userId, role) {
  const col = getCollection();
  const field = role === 'coach' ? 'coachId' : 'learnerId';
  
  const snap = await col
    .where(field, '==', userId)
    .orderBy('startTime', 'desc')
    .limit(50)
    .get();
  
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Update session status
 * @param {string} id - Session ID
 * @param {string} status - New status
 * @returns {Object} Updated session document
 */
async function updateStatus(id, status) {
  const col = getCollection();
  await col.doc(id).set({ 
    status,
    updatedAt: Date.now()
  }, { merge: true });
  
  const doc = await col.doc(id).get();
  return { id: doc.id, ...doc.data() };
}

/**
 * Get a session by ID
 * @param {string} id - Session ID
 * @returns {Object|null} Session document or null if not found
 */
async function get(id) {
  const col = getCollection();
  const doc = await col.doc(id).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

/**
 * Update a session document
 * @param {string} id - Session ID
 * @param {Object} patch - Fields to update
 * @returns {Object} Updated session document
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
 * Get sessions for a specific skill
 * @param {string} skillId - Skill ID
 * @returns {Array} Array of sessions for the skill
 */
async function getBySkill(skillId) {
  const col = getCollection();
  const snap = await col
    .where('skillId', '==', skillId)
    .orderBy('startTime', 'desc')
    .limit(50)
    .get();
  
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Get upcoming sessions (for reminders, etc.)
 * @param {number} timeRange - Time range in milliseconds from now
 * @returns {Array} Array of upcoming sessions
 */
async function getUpcoming(timeRange = 24 * 60 * 60 * 1000) { // Default: 24 hours
  const col = getCollection();
  const now = Date.now();
  const future = now + timeRange;
  
  const snap = await col
    .where('startTime', '>', now)
    .where('startTime', '<', future)
    .where('status', '==', 'confirmed')
    .orderBy('startTime', 'asc')
    .get();
  
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

module.exports = {
  create,
  byUser,
  updateStatus,
  get,
  update,
  getBySkill,
  getUpcoming
};