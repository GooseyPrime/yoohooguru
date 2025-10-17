const express = require('express');
const { getFirestore } = require('../config/firebase');
const { authenticateUser, optionalAuth } = require('../middleware/auth');
const { logger } = require('../utils/logger');
const { handleValidationErrors, query } = require('../middleware/validation');

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of users with optional filtering by tier, skills, and location
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *         description: Maximum number of users to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of users to skip
 *       - in: query
 *         name: tier
 *         schema:
 *           type: string
 *           enum: [free, premium, enterprise]
 *         description: Filter by subscription tier
 *       - in: query
 *         name: skills
 *         schema:
 *           type: string
 *         description: Comma-separated list of skills to filter by
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location (partial match)
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                     limit:
 *                       type: number
 *                     offset:
 *                       type: number
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.get('/', [
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt().withMessage('Limit must be between 1 and 100'),
  query('offset').optional().isInt({ min: 0 }).toInt().withMessage('Offset must be a non-negative integer'),
  query('tier').optional().trim(),
  query('skills').optional().trim(),
  query('location').optional().trim(),
  handleValidationErrors
], optionalAuth, async (req, res) => {
  try {
    const { tier, skills, location, limit = 50, offset = 0 } = req.query;
    
    const db = getFirestore();
    let usersQuery = db.collection('users');
    
    // Apply basic limiting
    if (limit) {
      usersQuery = usersQuery.limit(parseInt(limit));
    }

    const snapshot = await usersQuery.get();
    let users = [];

    snapshot.forEach(doc => {
      const user = { id: doc.id, ...doc.data() };
      
      // Remove sensitive information
      delete user.email;
      delete user.lastLoginAt;
      
      // Apply filters
      if (tier && user.tier !== tier) return;
      if (location && !user.location.toLowerCase().includes(location.toLowerCase())) return;
      if (skills) {
        const skillsArray = skills.split(',').map(s => s.trim().toLowerCase());
        const userSkills = [...(user.skillsOffered || []), ...(user.skillsWanted || [])]
          .map(s => s.toLowerCase());
        
        if (!skillsArray.some(skill => userSkills.some(userSkill => userSkill.includes(skill)))) {
          return;
        }
      }
      
      users.push(user);
    });

    // Apply pagination
    const startIndex = parseInt(offset);
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = users.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        users: paginatedUsers,
        total: users.length,
        page: Math.floor(startIndex / limit) + 1,
        totalPages: Math.ceil(users.length / limit)
      }
    });

  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch users' }
    });
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const db = getFirestore();
    const userSnapshot = await db.collection('users').doc(id).get();
    const userData = userSnapshot.exists ? userSnapshot.data() : null;

    if (!userData) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    // Remove sensitive information
    delete userData.email;
    delete userData.lastLoginAt;

    res.json({
      success: true,
      data: { id, ...userData }
    });

  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch user' }
    });
  }
});

// @desc    Search users by skills
// @route   GET /api/users/search/skills
// @access  Public
router.get('/search/skills', async (req, res) => {
  try {
    const { q: query, type = 'both' } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: { message: 'Search query is required' }
      });
    }

    const searchTerm = query.toLowerCase();
    const db = getFirestore();
    const snapshot = await db.collection('users').get();
    const results = [];

    snapshot.forEach(doc => {
      const user = { id: doc.id, ...doc.data() };
      
      // Remove sensitive information
      delete user.email;
      delete user.lastLoginAt;
      
      let matchFound = false;
      
      if (type === 'offered' || type === 'both') {
        const offeredSkills = user.skillsOffered || [];
        if (offeredSkills.some(skill => skill.toLowerCase().includes(searchTerm))) {
          matchFound = true;
        }
      }
      
      if (type === 'wanted' || type === 'both') {
        const wantedSkills = user.skillsWanted || [];
        if (wantedSkills.some(skill => skill.toLowerCase().includes(searchTerm))) {
          matchFound = true;
        }
      }
      
      if (matchFound) {
        results.push(user);
      }
    });

    res.json({
      success: true,
      data: {
        users: results,
        query: query,
        total: results.length
      }
    });

  } catch (error) {
    logger.error('Search users error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Search failed' }
    });
  }
});

// @desc    Get user statistics
// @route   GET /api/users/:id/stats
// @access  Public
router.get('/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    
    const db = getFirestore();
    
    // Get user data
    const userSnapshot = await db.collection('users').doc(id).get();
    const userData = userSnapshot.exists ? userSnapshot.data() : null;

    if (!userData) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    // Get user's exchanges
    const exchangesSnapshot = await db.collection('exchanges')
      .where('teacherId', '==', id)
      .get();
    
    let totalExchanges = 0;
    let totalRating = 0;
    let ratingCount = 0;

    exchangesSnapshot.forEach(doc => {
      const exchange = doc.data();
      totalExchanges++;
      
      if (exchange.ratings && exchange.ratings.teacherRating) {
        totalRating += exchange.ratings.teacherRating;
        ratingCount++;
      }
    });

    const averageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        exchangesCompleted: totalExchanges,
        averageRating: parseFloat(averageRating),
        totalHoursTaught: userData.totalHoursTaught || 0,
        tier: userData.tier || 'Stone Dropper',
        joinDate: userData.joinDate,
        skillsOfferedCount: (userData.skillsOffered || []).length,
        skillsWantedCount: (userData.skillsWanted || []).length
      }
    });

  } catch (error) {
    logger.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch user statistics' }
    });
  }
});

// @desc    Update user tier
// @route   PUT /api/users/:id/tier
// @access  Private (admin or self)
router.put('/:id/tier', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { tier } = req.body;
    
    const validTiers = ['Stone Dropper', 'Wave Maker', 'Current Creator', 'Tide Turner'];
    
    if (!validTiers.includes(tier)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid tier' }
      });
    }

    // Check if user can update this profile
    if (req.user.uid !== id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: { message: 'Unauthorized to update this user' }
      });
    }

    const db = getFirestore();
    await db.collection('users').doc(id).update({
      tier,
      updatedAt: new Date().toISOString()
    });

    logger.info(`Tier updated for user ${id}: ${tier}`);

    res.json({
      success: true,
      data: { message: 'Tier updated successfully', tier }
    });

  } catch (error) {
    logger.error('Update tier error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update tier' }
    });
  }
});

// @desc    Get user profile with stats (for authenticated user)
// @route   GET /api/users/:id/profile
// @access  Private
router.get('/:id/profile', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verify user is requesting their own profile
    if (req.user.uid !== id) {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied' }
      });
    }
    
    const db = getFirestore();
    const [profileSnap, sessionsSnap] = await Promise.all([
      db.collection('profiles').doc(id).get(),
      db.collection('sessions').where('learnerId', '==', id).get()
    ]);
    
    const profile = profileSnap.exists ? profileSnap.data() : {};
    const sessionsBooked = sessionsSnap.size || 0;
    
    // Calculate profile stats
    const skillsLearning = profile.skillsWanted?.length || 0;
    const skillsTeaching = profile.skillsOffered?.length || 0;
    
    res.json({
      success: true,
      displayName: profile.displayName || '',
      email: profile.email || '',
      photoUrl: profile.photoUrl || '',
      city: profile.city || '',
      zip: profile.zip || '',
      bio: profile.bio || '',
      userType: profile.userType || '',
      skillsOffered: profile.skillsOffered || [],
      skillsWanted: profile.skillsWanted || [],
      skillsLearning,
      skillsTeaching,
      sessionsBooked
    });

  } catch (error) {
    logger.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch profile' }
    });
  }
});

module.exports = router;