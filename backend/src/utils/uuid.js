/**
 * UUID utility for CommonJS compatibility with ES module uuid v13+
 * This module provides a CommonJS-compatible interface using crypto.randomUUID
 * as a fallback for the ES module uuid package
 */

/**
 * Generate a random UUID v4 using crypto.randomUUID (Node.js 15.6+)
 * Falls back to a custom implementation for older environments
 * @returns {string} UUID v4 string
 */
function v4Sync() {
    // Use Node.js built-in crypto.randomUUID if available (Node 15.6+)
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    // Fallback implementation for environments without crypto.randomUUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Asynchronous UUID v4 generator (for compatibility with async patterns)
 * @returns {Promise<string>} UUID v4 string
 */
async function v4() {
    return v4Sync();
}

module.exports = {
    v4,
    v4Sync,
    // For backward compatibility with require('uuid').v4()
    uuidv4: v4Sync
};