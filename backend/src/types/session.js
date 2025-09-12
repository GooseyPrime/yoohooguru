/**
 * Distance Session Types and Models
 * Defines types for Modified Masters distance learning sessions
 */

const SESSION_MODES = {
  VIDEO: 'video',
  PHONE: 'phone', 
  CHAT: 'chat',
  ASYNC: 'async'
};

const SESSION_RECORD_POLICIES = {
  PROHIBITED: 'prohibited',
  ALLOWED: 'allowed', 
  ALLOW_WITH_CONSENT: 'allow-with-consent'
};

const SESSION_STATUSES = {
  REQUESTED: 'requested',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELED: 'canceled'
};

/**
 * Create a new distance session object
 * @param {Object} sessionData - Session data
 * @returns {Object} DistanceSession object
 */
function createDistanceSession({
  id,
  skillId,
  coachId,
  learnerId,
  mode = SESSION_MODES.VIDEO,
  startTime,
  endTime,
  joinUrl = '',
  captionsRequired = false,
  aslRequested = false,
  recordPolicy = SESSION_RECORD_POLICIES.ALLOW_WITH_CONSENT,
  createdAt = Date.now(),
  status = SESSION_STATUSES.REQUESTED
}) {
  return {
    id,
    skillId,
    coachId,
    learnerId,
    mode,
    startTime, // epoch ms UTC
    endTime,   // epoch ms UTC
    joinUrl,
    captionsRequired,
    aslRequested,
    recordPolicy,
    createdAt,
    status
  };
}

/**
 * Validate session data
 * @param {Object} sessionData - Session data to validate
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateSessionData(sessionData) {
  const errors = [];
  
  if (!sessionData.skillId) errors.push('skillId is required');
  if (!sessionData.coachId) errors.push('coachId is required'); 
  if (!sessionData.learnerId) errors.push('learnerId is required');
  if (!sessionData.startTime || !Number.isInteger(sessionData.startTime)) {
    errors.push('startTime must be a valid epoch timestamp');
  }
  if (!sessionData.endTime || !Number.isInteger(sessionData.endTime)) {
    errors.push('endTime must be a valid epoch timestamp');
  }
  if (sessionData.startTime && sessionData.endTime && sessionData.endTime <= sessionData.startTime) {
    errors.push('endTime must be after startTime');
  }
  if (sessionData.mode && !Object.values(SESSION_MODES).includes(sessionData.mode)) {
    errors.push(`mode must be one of: ${Object.values(SESSION_MODES).join(', ')}`);
  }
  if (sessionData.recordPolicy && !Object.values(SESSION_RECORD_POLICIES).includes(sessionData.recordPolicy)) {
    errors.push(`recordPolicy must be one of: ${Object.values(SESSION_RECORD_POLICIES).join(', ')}`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  SESSION_MODES,
  SESSION_RECORD_POLICIES,
  SESSION_STATUSES,
  createDistanceSession,
  validateSessionData
};