const express = require('express');
const { body, validationResult } = require('express-validator');
const { getAuth } = require('../firebase/admin');
const usersDB = require('../db/users');
const { authenticateUser } = require('../middleware/auth');
const { logger } = require('../utils/logger');

const router = express.Router();

// Validation middleware
const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('displayName').trim().isLength({ min: 2, max: 50 }),
  body('skills').optional().isArray(),
  body('location').optional().trim()
];

// Validation rules for login (currently unused but may be needed later)
// const validateLogin = [
//   body('email').isEmail().normalizeEmail(),
//   body('password').exists()
// ];

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      });
    }

    const { email, password, displayName, skills = [], location = '' } = req.body;

    // Create user in Firebase Auth
    const userRecord = await getAuth().createUser({
      email,
      password,
      displayName
    });

    // Create user profile in Firestore
    const userProfile = {
      email,
      displayName,
      // Legacy skill fields for backward compatibility
      skillsOffered: skills.offered || [],
      skillsWanted: skills.wanted || [],
      // User tier and metrics
      tier: 'Stone Dropper',
      exchangesCompleted: 0,
      averageRating: 0,
      totalHoursTaught: 0,
      location,
      availability: [],
      purposeStory: '',
      joinDate: new Date().toISOString(),
      isActive: true,
      lastLoginAt: new Date().toISOString(),
      // Default accessibility preferences
      accessibility: {
        mobility: [],
        vision: [],
        hearing: [],
        neurodiversity: [],
        communicationPrefs: [],
        assistiveTech: []
      },
      // Default Modified Masters preferences
      modifiedMasters: {
        wantsToTeach: false,
        wantsToLearn: false,
        tags: [],
        visible: false,
        coachingStyles: []
      },
      liability: {
        termsAccepted: true,
        termsAcceptedAt: new Date().toISOString(),
        lastWaiverAccepted: null,
        lastWaiverId: null,
        totalWaivers: 0
      }
    };

    await usersDB.create(userRecord.uid, userProfile);

    logger.info(`User registered successfully: ${email}`);

    res.status(201).json({
      success: true,
      data: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        tier: userProfile.tier
      }
    });

  } catch (error) {
    logger.error('Registration error:', error);
    
    let message = 'Registration failed';
    if (error.code === 'auth/email-already-exists') {
      message = 'Email already registered';
    } else if (error.code === 'auth/weak-password') {
      message = 'Password is too weak';
    }

    res.status(400).json({
      success: false,
      error: { message }
    });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', authenticateUser, async (req, res) => {
  try {
    // Additional safety check - ensure user is authenticated
    if (!req.user || !req.user.uid) {
      logger.warn('Profile access attempt with invalid user object', { user: req.user });
      return res.status(401).json({
        success: false,
        error: { message: 'User authentication failed' }
      });
    }

    const userData = await usersDB.get(req.user.uid);

    if (!userData) {
      logger.info(`User profile not found for uid: ${req.user.uid}`);
      return res.status(404).json({
        success: false,
        error: { message: 'User profile not found' }
      });
    }

    res.json({
      success: true,
      data: userData
    });

  } catch (error) {
    logger.error('Profile fetch error:', {
      error: error.message,
      stack: error.stack,
      uid: req.user?.uid,
      url: req.originalUrl
    });
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch profile' }
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', authenticateUser, async (req, res) => {
  try {
    const allowedUpdates = [
      'displayName', 'skillsOffered', 'skillsWanted', 
      'location', 'availability', 'purposeStory',
      'accessibility', 'modifiedMasters'
    ];
    
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    updates.lastLoginAt = new Date().toISOString();

    const updatedUser = await usersDB.merge(req.user.uid, updates);

    logger.info(`Profile updated for user: ${req.user.uid}`);

    res.json({
      success: true,
      data: updatedUser
    });

  } catch (error) {
    logger.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update profile' }
    });
  }
});

// @desc    Verify token
// @route   POST /api/auth/verify
// @access  Public
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        error: { message: 'Token is required' }
      });
    }

    const auth = getAuth();
    if (!auth) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid token' }
      });
    }

    const decodedToken = await auth.verifyIdToken(token);
    
    res.json({
      success: true,
      data: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified
      }
    });

  } catch (error) {
    logger.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      error: { message: 'Invalid token' }
    });
  }
});

// @desc    Hide/unhide user profile
// @route   PUT /api/auth/profile/visibility
// @access  Private
router.put('/profile/visibility', authenticateUser, async (req, res) => {
  try {
    const { hidden } = req.body;
    
    if (typeof hidden !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: { message: 'Hidden must be a boolean value' }
      });
    }

    const updates = { 
      isHidden: hidden,
      hiddenAt: hidden ? new Date().toISOString() : null
    };

    await usersDB.merge(req.user.uid, updates);

    logger.info(`Profile visibility updated for user: ${req.user.uid} - Hidden: ${hidden}`);

    res.json({
      success: true,
      data: { isHidden: hidden },
      message: hidden ? 'Profile hidden from public view' : 'Profile restored to public view'
    });

  } catch (error) {
    logger.error('Profile visibility update error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update profile visibility' }
    });
  }
});

// @desc    Request account deletion (soft delete with 30-day retention)
// @route   DELETE /api/auth/account
// @access  Private
router.delete('/account', authenticateUser, async (req, res) => {
  try {
    const { confirmEmail } = req.body;
    
    // Security: require email confirmation
    if (!confirmEmail || confirmEmail !== req.user.email) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email confirmation is required for account deletion' }
      });
    }

    const deleteScheduledDate = new Date();
    deleteScheduledDate.setDate(deleteScheduledDate.getDate() + 30); // 30 days from now
    
    const updates = {
      deletionScheduled: true,
      deletionScheduledAt: new Date().toISOString(),
      deletionScheduledDate: deleteScheduledDate.toISOString(),
      isActive: false,
      isHidden: true, // Hide profile immediately
      hiddenAt: new Date().toISOString()
    };

    await usersDB.merge(req.user.uid, updates);

    logger.info(`Account deletion scheduled for user: ${req.user.uid} - Scheduled for: ${deleteScheduledDate.toISOString()}`);

    res.json({
      success: true,
      data: {
        deletionScheduledDate: deleteScheduledDate.toISOString(),
        daysUntilDeletion: 30
      },
      message: 'Account deletion scheduled. Your account will be permanently deleted in 30 days. You can cancel this request by logging in before then.'
    });

  } catch (error) {
    logger.error('Account deletion scheduling error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to schedule account deletion' }
    });
  }
});

// @desc    Cancel account deletion
// @route   PUT /api/auth/account/restore
// @access  Private
router.put('/account/restore', authenticateUser, async (req, res) => {
  try {
    const userData = await usersDB.get(req.user.uid);
    
    if (!userData || !userData.deletionScheduled) {
      return res.status(400).json({
        success: false,
        error: { message: 'No account deletion request found' }
      });
    }

    const updates = {
      deletionScheduled: false,
      deletionScheduledAt: null,
      deletionScheduledDate: null,
      isActive: true,
      isHidden: false, // Restore visibility
      hiddenAt: null,
      restoredAt: new Date().toISOString()
    };

    await usersDB.merge(req.user.uid, updates);

    logger.info(`Account deletion cancelled for user: ${req.user.uid}`);

    res.json({
      success: true,
      message: 'Account deletion cancelled successfully. Your account has been restored.'
    });

  } catch (error) {
    logger.error('Account restoration error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to restore account' }
    });
  }
});

// @desc    Initiate account merge request (link Google account to email/password account)
// @route   POST /api/auth/merge/request
// @access  Private
router.post('/merge/request', authenticateUser, async (req, res) => {
  try {
    const { targetEmail, provider } = req.body;

    if (!targetEmail || !provider) {
      return res.status(400).json({
        success: false,
        error: { message: 'Target email and provider are required' }
      });
    }

    if (!['google.com', 'password'].includes(provider)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid provider. Only google.com and password are supported for merging.' }
      });
    }

    // Check if target account exists
    try {
      const targetUser = await getAuth().getUserByEmail(targetEmail);
      
      // Prevent merging with self
      if (targetUser.uid === req.user.uid) {
        return res.status(400).json({
          success: false,
          error: { message: 'Cannot merge account with itself' }
        });
      }

      // Store merge request in database
      const mergeRequest = {
        fromUid: req.user.uid,
        fromEmail: req.user.email,
        toEmail: targetEmail,
        toUid: targetUser.uid,
        provider,
        status: 'pending',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };

      // In a real implementation, you'd store this in a dedicated collection
      // For now, we'll add it to the user's profile
      await usersDB.merge(req.user.uid, { 
        pendingMergeRequest: mergeRequest 
      });

      logger.info(`Account merge requested: ${req.user.uid} -> ${targetEmail}`);

      res.json({
        success: true,
        data: {
          mergeRequestId: req.user.uid + '_' + Date.now(),
          targetEmail,
          expiresAt: mergeRequest.expiresAt
        },
        message: 'Account merge request created. Please verify your access to the target account to complete the merge.'
      });

    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        return res.status(404).json({
          success: false,
          error: { message: 'Target email account not found' }
        });
      }
      throw error;
    }

  } catch (error) {
    logger.error('Account merge request error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create merge request' }
    });
  }
});

module.exports = router;