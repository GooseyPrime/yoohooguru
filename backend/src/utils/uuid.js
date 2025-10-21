/**
 * UUID utility for CommonJS compatibility with ES module uuid v13+
 * This module provides a CommonJS-compatible interface for the ES module uuid package
 */

let uuidModule = null;

/**
 * Dynamically import uuid ES module
 * @returns {Promise<Object>} UUID module with v4 function
 */
async function loadUuid() {
  if (!uuidModule) {
    try {
      uuidModule = await import('uuid');
    } catch (error) {
      throw new Error(`Failed to load uuid module: ${error.message}`);
    }
  }
  return uuidModule;
}

/**
 * Generate a random UUID v4
 * @returns {Promise<string>} UUID v4 string
 */
async function v4() {
  const uuid = await loadUuid();
  return uuid.v4();
}

/**
 * Synchronous UUID v4 generator (for backward compatibility)
 * Note: This is a fallback that uses crypto.randomUUID if available
 * @returns {string} UUID v4 string
 */
function v4Sync() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

module.exports = {
  v4,
  v4Sync,
  // For backward compatibility with require('uuid').v4()
  uuidv4: v4Sync
};