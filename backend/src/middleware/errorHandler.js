const { logger } = require('../utils/logger');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(`Error ${err.message}`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    contentType: req.get('Content-Type'),
    stack: err.stack
  });

  // Default error
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    error.errors = Object.values(err.errors).map(val => val.message);
    logger.warn(`Validation error on ${req.method} ${req.originalUrl}`, {
      errors: error.errors,
      ip: req.ip
    });
  }

  // Firebase Auth error
  if (err.code && err.code.startsWith('auth/')) {
    statusCode = 401;
    message = 'Authentication Error';
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  // JWT expired
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate resource';
  }

  // Cast error
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid resource ID';
  }

  // CORS error - should return 403 not 500
  if (err.message && err.message.includes('CORS policy violation')) {
    statusCode = 403;
    message = 'Cross-origin request not allowed';
  }

  // Client disconnection errors
  if (err.code === 'ECONNRESET' || err.code === 'EPIPE' || err.code === 'ECONNABORTED') {
    statusCode = 400; // Use standard code; original intent was 499 (Client closed request)
    message = 'Client disconnected';
    // Optionally, add a custom header for diagnostics
    res.set('X-Original-Status', '499');
    // Don't log client disconnections as errors - they're normal
    logger.info(`Client disconnected: ${err.message}`, {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      code: err.code
    });
  }

  // Request timeout
  if (err.code === 'TIMEOUT' || err.timeout) {
    statusCode = 408;
    message = 'Request timeout';
  }

  // Custom errors
  if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      ...(error.errors && { details: error.errors })
    }
  });
};

module.exports = errorHandler;