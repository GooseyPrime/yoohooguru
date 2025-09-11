/**
 * Session Database Adapter
 * Handles distance session storage and retrieval using Firestore
 */

const { getFirestore } = require('../config/firebase');
const { logger } = require('../utils/logger');
const { createDistanceSession, validateSessionData } = require('../types/session');

/**
 * Create a new distance session
 * @param {Object} sessionData - Session data
 * @returns {Promise<Object>} Created session
 */
async function create(sessionData) {
  try {
    const db = getFirestore();
    if (!db) {
      throw new Error('Database not available');
    }

    // Validate session data
    const validation = validateSessionData(sessionData);
    if (!validation.valid) {
      throw new Error(`Invalid session data: ${validation.errors.join(', ')}`);
    }

    const session = createDistanceSession(sessionData);
    
    // Store in Firestore sessions collection
    await db.collection('sessions').doc(session.id).set(session);

    logger.info(`Distance session created: ${session.id} for skill ${session.skillId}`);
    return session;
  } catch (error) {
    logger.error('Error creating distance session:', error);
    throw error;
  }
}

/**
 * Get a session by ID
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object|null>} Session object or null if not found
 */
async function get(sessionId) {
  try {
    const db = getFirestore();
    if (!db) {
      return null;
    }

    const docRef = db.collection('sessions').doc(sessionId);
    const doc = await docRef.get();
    
    if (doc.exists) {
      return { id: sessionId, ...doc.data() };
    }
    
    return null;
  } catch (error) {
    logger.error('Error fetching session:', error);
    throw error;
  }
}

/**
 * Get sessions by user (as coach or learner)
 * @param {string} userId - User ID
 * @param {string} role - Role: 'coach' or 'learner'
 * @returns {Promise<Array>} Array of sessions
 */
async function byUser(userId, role = 'coach') {
  try {
    const db = getFirestore();
    if (!db) {
      return [];
    }

    // Query sessions collection based on role
    const fieldName = role === 'coach' ? 'coachId' : 'learnerId';
    const querySnapshot = await db.collection('sessions')
      .where(fieldName, '==', userId)
      .get();

    const sessions = [];
    querySnapshot.forEach(doc => {
      sessions.push({ id: doc.id, ...doc.data() });
    });

    // Sort by startTime (most recent first)
    sessions.sort((a, b) => b.startTime - a.startTime);
    
    logger.info(`Found ${sessions.length} sessions for user ${userId} as ${role}`);
    return sessions;
  } catch (error) {
    logger.error('Error fetching user sessions:', error);
    throw error;
  }
}

/**
 * Update session status
 * @param {string} sessionId - Session ID
 * @param {string} status - New status
 * @returns {Promise<Object|null>} Updated session
 */
async function updateStatus(sessionId, status) {
  try {
    const db = getFirestore();
    if (!db) {
      throw new Error('Database not available');
    }

    const docRef = db.collection('sessions').doc(sessionId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return null;
    }

    const updateData = {
      status,
      updatedAt: Date.now()
    };
    
    await docRef.update(updateData);

    // Get updated document
    const updatedDoc = await docRef.get();
    const session = { id: sessionId, ...updatedDoc.data() };
    
    logger.info(`Session ${sessionId} status updated to ${status}`);
    return session;
  } catch (error) {
    logger.error('Error updating session status:', error);
    throw error;
  }
}

/**
 * Get sessions by skill ID
 * @param {string} skillId - Skill ID
 * @returns {Promise<Array>} Array of sessions
 */
async function bySkill(skillId) {
  try {
    const db = getFirestore();
    if (!db) {
      return [];
    }

    const querySnapshot = await db.collection('sessions')
      .where('skillId', '==', skillId)
      .get();

    const sessions = [];
    querySnapshot.forEach(doc => {
      sessions.push({ id: doc.id, ...doc.data() });
    });

    // Sort by startTime (most recent first)
    sessions.sort((a, b) => b.startTime - a.startTime);
    
    return sessions;
  } catch (error) {
    logger.error('Error fetching sessions by skill:', error);
    throw error;
  }
}

/**
 * Delete a session (soft delete by setting status to canceled)
 * @param {string} sessionId - Session ID
 * @returns {Promise<boolean>} Success status
 */
async function remove(sessionId) {
  try {
    const db = getFirestore();
    if (!db) {
      throw new Error('Database not available');
    }

    await updateStatus(sessionId, 'canceled');
    logger.info(`Session ${sessionId} canceled (soft delete)`);
    return true;
  } catch (error) {
    logger.error('Error canceling session:', error);
    throw error;
  }
}

module.exports = {
  create,
  get,
  byUser,
  updateStatus,
  bySkill,
  remove
};