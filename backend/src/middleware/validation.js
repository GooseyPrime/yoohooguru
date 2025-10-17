/**
 * Input Validation Middleware
 * Provides standardized input validation for API endpoints using express-validator
 * 
 * @module middleware/validation
 */

const { body, param, query, validationResult } = require('express-validator');
const { logger } = require('../utils/logger');

/**
 * Handle validation errors
 * Checks for validation errors and returns a standardized error response
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    logger.warn('Validation failed', {
      requestId: req.requestId,
      path: req.path,
      errors: errors.array()
    });
    
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        details: errors.array().map(err => ({
          field: err.path || err.param,
          message: err.msg,
          value: err.value
        }))
      }
    });
  }
  
  next();
};

/**
 * Common validation rules
 */
const validationRules = {
  /**
   * Email validation
   */
  email: () => 
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Must be a valid email address'),
  
  /**
   * Password validation (minimum 8 characters, at least one letter and one number)
   */
  password: () =>
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
      .withMessage('Password must contain at least one letter and one number'),
  
  /**
   * User ID validation (UUID or alphanumeric)
   */
  userId: (fieldName = 'userId') =>
    param(fieldName)
      .trim()
      .notEmpty()
      .withMessage(`${fieldName} is required`)
      .isLength({ min: 10, max: 128 })
      .withMessage(`${fieldName} must be between 10 and 128 characters`),
  
  /**
   * Skill ID validation
   */
  skillId: () =>
    param('skillId')
      .trim()
      .notEmpty()
      .withMessage('Skill ID is required'),
  
  /**
   * Name validation
   */
  name: (fieldName = 'name') =>
    body(fieldName)
      .trim()
      .notEmpty()
      .withMessage(`${fieldName} is required`)
      .isLength({ min: 2, max: 100 })
      .withMessage(`${fieldName} must be between 2 and 100 characters`)
      .matches(/^[a-zA-Z0-9\s\-']+$/)
      .withMessage(`${fieldName} contains invalid characters`),
  
  /**
   * Description validation
   */
  description: (fieldName = 'description', options = {}) =>
    body(fieldName)
      .trim()
      .isLength({ min: options.min || 10, max: options.max || 5000 })
      .withMessage(`${fieldName} must be between ${options.min || 10} and ${options.max || 5000} characters`),
  
  /**
   * URL validation
   */
  url: (fieldName = 'url') =>
    body(fieldName)
      .optional()
      .isURL({ protocols: ['http', 'https'], require_protocol: true })
      .withMessage(`${fieldName} must be a valid URL`),
  
  /**
   * Pagination - page number
   */
  page: () =>
    query('page')
      .optional()
      .isInt({ min: 1, max: 10000 })
      .withMessage('Page must be a positive integer')
      .toInt(),
  
  /**
   * Pagination - limit/per page
   */
  limit: (maxLimit = 100) =>
    query('limit')
      .optional()
      .isInt({ min: 1, max: maxLimit })
      .withMessage(`Limit must be between 1 and ${maxLimit}`)
      .toInt(),
  
  /**
   * Sort order validation
   */
  sortOrder: (validValues = ['asc', 'desc']) =>
    query('order')
      .optional()
      .isIn(validValues)
      .withMessage(`Order must be one of: ${validValues.join(', ')}`),
  
  /**
   * Boolean validation
   */
  boolean: (fieldName) =>
    body(fieldName)
      .optional()
      .isBoolean()
      .withMessage(`${fieldName} must be a boolean`)
      .toBoolean(),
  
  /**
   * Array validation
   */
  array: (fieldName, options = {}) =>
    body(fieldName)
      .isArray({ min: options.min, max: options.max })
      .withMessage(`${fieldName} must be an array${options.min ? ` with at least ${options.min} items` : ''}${options.max ? ` and at most ${options.max} items` : ''}`),
  
  /**
   * Enum validation
   */
  enum: (fieldName, validValues) =>
    body(fieldName)
      .isIn(validValues)
      .withMessage(`${fieldName} must be one of: ${validValues.join(', ')}`),
  
  /**
   * Date validation
   */
  date: (fieldName) =>
    body(fieldName)
      .isISO8601()
      .withMessage(`${fieldName} must be a valid ISO 8601 date`)
      .toDate(),
  
  /**
   * Phone number validation (international format)
   */
  phone: (fieldName = 'phone') =>
    body(fieldName)
      .optional()
      .matches(/^\+?[1-9]\d{1,14}$/)
      .withMessage(`${fieldName} must be a valid international phone number`),
  
  /**
   * Sanitize string (remove dangerous characters)
   */
  sanitizeString: (fieldName) =>
    body(fieldName)
      .trim()
      .escape()
};

/**
 * Preset validation chains for common operations
 */
const presetValidations = {
  /**
   * User registration validation
   */
  userRegistration: () => [
    validationRules.email(),
    validationRules.password(),
    validationRules.name('displayName'),
    handleValidationErrors
  ],
  
  /**
   * User login validation
   */
  userLogin: () => [
    validationRules.email(),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors
  ],
  
  /**
   * Skill creation validation
   */
  skillCreation: () => [
    validationRules.name('title'),
    validationRules.description('description', { min: 20, max: 2000 }),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('level').optional().isIn(['beginner', 'intermediate', 'advanced', 'expert']).withMessage('Invalid skill level'),
    handleValidationErrors
  ],
  
  /**
   * Pagination validation
   */
  pagination: () => [
    validationRules.page(),
    validationRules.limit(100),
    handleValidationErrors
  ],
  
  /**
   * ID parameter validation
   */
  idParam: (paramName = 'id') => [
    param(paramName).trim().notEmpty().withMessage(`${paramName} is required`),
    handleValidationErrors
  ]
};

module.exports = {
  validationRules,
  presetValidations,
  handleValidationErrors,
  // Re-export express-validator functions for custom validations
  body,
  param,
  query,
  validationResult
};
