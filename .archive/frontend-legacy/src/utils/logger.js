/**
 * Frontend logger utility
 * Provides structured logging for the frontend application
 * 
 * @module utils/logger
 */

/**
 * Log levels enum
 */
const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error'
};

/**
 * Logger configuration
 */
const config = {
  // Enable debug logs in development
  enableDebug: process.env.NODE_ENV === 'development',
  // Prefix for all log messages
  prefix: '[YoohooGuru]'
};

/**
 * Format log message with timestamp and context
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} context - Additional context
 * @returns {string} Formatted message
 */
const formatMessage = (level, message, context) => {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` ${JSON.stringify(context)}` : '';
  return `${config.prefix} [${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
};

/**
 * Log a debug message
 * @param {string} message - Message to log
 * @param {Object} context - Optional context object
 */
const debug = (message, context = null) => {
  if (config.enableDebug) {
    console.log(formatMessage(LogLevel.DEBUG, message, context));
  }
};

/**
 * Log an info message
 * @param {string} message - Message to log
 * @param {Object} context - Optional context object
 */
const info = (message, context = null) => {
  console.log(formatMessage(LogLevel.INFO, message, context));
};

/**
 * Log a warning message
 * @param {string} message - Message to log
 * @param {Object} context - Optional context object
 */
const warn = (message, context = null) => {
  console.warn(formatMessage(LogLevel.WARN, message, context));
};

/**
 * Log an error message
 * @param {string} message - Message to log
 * @param {Error|Object} error - Error object or additional context
 */
const error = (message, error = null) => {
  const context = error instanceof Error 
    ? { message: error.message, stack: error.stack }
    : error;
  console.error(formatMessage(LogLevel.ERROR, message, context));
};

/**
 * Logger instance
 */
const logger = {
  debug,
  info,
  warn,
  error,
  LogLevel
};

export default logger;
