const { getAuth } = require('../config/firebase');
const { logger } = require('../utils/logger');

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: { message: 'No token provided' }
      });
    }

    const token = authHeader.substring(7);
    
    // Handle test environment
    if (process.env.NODE_ENV === 'test') {
      // In test environment, create a mock user based on the token
      if (token === 'test-token') {
        req.user = { 
          uid: 'test-user-123', 
          email: 'test@example.com',
          role: 'user'
        };
        return next();
      } else if (token === 'admin-token') {
        req.user = { 
          uid: 'test-admin-456', 
          email: 'admin@example.com',
          role: 'admin'
        };
        return next();
      } else {
        return res.status(401).json({
          success: false,
          error: { message: 'Invalid test token' }
        });
      }
    }
    
    // Production/development environment: verify real Firebase token
    const decodedToken = await getAuth().verifyIdToken(token);
    req.user = decodedToken;
    
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(401).json({
      success: false,
      error: { message: 'Invalid or expired token' }
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      // Handle test environment
      if (process.env.NODE_ENV === 'test') {
        if (token === 'test-token') {
          req.user = { 
            uid: 'test-user-123', 
            email: 'test@example.com',
            role: 'user'
          };
        } else if (token === 'admin-token') {
          req.user = { 
            uid: 'test-admin-456', 
            email: 'admin@example.com',
            role: 'admin'
          };
        }
        return next();
      }
      
      // Production/development environment
      const decodedToken = await getAuth().verifyIdToken(token);
      req.user = decodedToken;
    }
    
    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    next();
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication required' }
      });
    }

    const userRole = req.user.role || 'user';
    
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: { message: 'Insufficient permissions' }
      });
    }

    next();
  };
};

module.exports = {
  authenticateUser,
  requireAuth: authenticateUser, // Alias for convenience
  optionalAuth,
  requireRole
};