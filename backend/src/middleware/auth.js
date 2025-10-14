const { getAuth } = require('../config/firebase');
const { logger } = require('../utils/logger');
const jwt = require('jsonwebtoken');

/**
 * Authenticate user with support for both Firebase tokens and NextAuth JWT tokens
 * This allows for gradual migration from Firebase Auth to NextAuth
 */
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    // Try to get token from Authorization header first
    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    // Fallback: Read from NextAuth session cookie
    if (!token && req.cookies) {
      token = req.cookies['__Secure-next-auth.session-token'] || req.cookies['next-auth.session-token'];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: 'No token provided' }
      });
    }
    
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
    
    // Try NextAuth JWT verification first (if NEXTAUTH_SECRET is configured)
    if (process.env.NEXTAUTH_SECRET) {
      try {
        const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
        
        // NextAuth JWT structure: map to Firebase-compatible format
        req.user = {
          uid: decoded.id || decoded.sub,
          email: decoded.email,
          membershipTier: decoded.membershipTier || 'free',
          role: decoded.role || 'user'
        };
        
        logger.debug('Authenticated via NextAuth JWT');
        return next();
      } catch (nextAuthError) {
        // If NextAuth JWT verification fails, fall through to Firebase verification
        logger.debug('NextAuth JWT verification failed, trying Firebase token:', nextAuthError.message);
      }
    }
    
    // Fallback: Verify as Firebase token
    try {
      const decodedToken = await getAuth().verifyIdToken(token);
      req.user = decodedToken;
      logger.debug('Authenticated via Firebase token');
      next();
    } catch (firebaseError) {
      logger.error('Authentication failed for both NextAuth and Firebase:', firebaseError);
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid or expired token' }
      });
    }
    
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
    let token = null;
    
    // Try Authorization header first
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    // Fallback: Read from NextAuth session cookie
    if (!token && req.cookies) {
      token = req.cookies['__Secure-next-auth.session-token'] || req.cookies['next-auth.session-token'];
    }
    
    if (token) {
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
      
      // Try NextAuth JWT first
      if (process.env.NEXTAUTH_SECRET) {
        try {
          const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
          req.user = {
            uid: decoded.id || decoded.sub,
            email: decoded.email,
            membershipTier: decoded.membershipTier || 'free',
            role: decoded.role || 'user'
          };
          return next();
        } catch (error) {
          // Fall through to Firebase
        }
      }
      
      // Try Firebase token
      try {
        const decodedToken = await getAuth().verifyIdToken(token);
        req.user = decodedToken;
      } catch (error) {
        // Token is invalid, but optionalAuth continues without user
        logger.debug('Optional auth: Invalid token, continuing without user');
      }
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