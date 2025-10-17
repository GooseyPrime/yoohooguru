/**
 * Request ID Middleware
 * Adds a unique identifier to each request for tracing and debugging
 * 
 * @module middleware/requestId
 */

const { randomUUID } = require('crypto');
const { logger } = require('../utils/logger');

/**
 * Generate a unique request ID
 * @returns {string} UUID v4 request ID
 */
function generateRequestId() {
  return randomUUID();
}

/**
 * Request ID middleware
 * Adds X-Request-ID header to both incoming requests and outgoing responses
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function requestIdMiddleware(req, res, next) {
  // Use existing request ID from header or generate new one
  const requestId = req.get('X-Request-ID') || generateRequestId();
  
  // Attach to request object for logging
  req.requestId = requestId;
  
  // Set response header
  res.setHeader('X-Request-ID', requestId);
  
  // Log request with ID
  logger.info('Incoming request', {
    requestId,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  
  // Track response time
  const startTime = Date.now();
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info('Request completed', {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    });
  });
  
  next();
}

module.exports = { requestIdMiddleware, generateRequestId };
