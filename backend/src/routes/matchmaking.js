/**
 * Enhanced Matchmaking API Routes
 * Provides AI-powered guru-understudy matching with OpenRouter and ChatGPT fallback
 */

const express = require('express');
const { authenticateUser } = require('../middleware/auth');
const AIMatchmakingService = require('../lib/aiMatchmakingService');
const usersDB = require('../db/users');
const { logger } = require('../utils/logger');

const router = express.Router();
const aiMatchmaker = new AIMatchmakingService();

/**
 * Get AI-powered skill matches for a user (guru finding understudies)
 * GET /api/matchmaking/guru/:userId/matches
 */
router.get('/guru/:userId/matches', authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 5, minScore = 70 } = req.query;

    // Verify user exists and is a guru
    const guru = await usersDB.get(userId);
    if (!guru) {
      return res.status(404).json({
        success: false,
        error: 'Guru not found'
      });
    }

    if (guru.role !== 'guru') {
      return res.status(400).json({
        success: false,
        error: 'User must be a guru to get understudy matches'
      });
    }

    // Get potential understudies (for demo, we'll use mock data)
    // In production, this would query the users database
    const { sampleUnderstudies } = require('../scripts/seedFullDatabase');
    const understudies = sampleUnderstudies.filter(u => u.id !== userId);

    // Generate AI matches
    const matches = await aiMatchmaker.generateSkillMatches(guru, understudies, {
      limit: parseInt(limit),
      minScore: parseInt(minScore)
    });

    res.json({
      success: true,
      data: {
        guruId: userId,
        matches,
        algorithm: 'ai_enhanced',
        totalPotentialMatches: understudies.length,
        aiProvider: matches[0]?.aiProvider || 'none'
      }
    });

  } catch (error) {
    logger.error('Guru matching error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get AI-powered guru recommendations for an understudy
 * GET /api/matchmaking/understudy/:userId/recommendations
 */
router.get('/understudy/:userId/recommendations', authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 5, skill } = req.query;

    // Verify user exists
    const understudy = await usersDB.get(userId);
    if (!understudy) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get available gurus (for demo, using mock data)
    const { sampleGurus } = require('../scripts/seedFullDatabase');
    
    // Filter gurus by skill if specified
    let availableGurus = sampleGurus;
    if (skill) {
      availableGurus = sampleGurus.filter(guru => 
        guru.skillsOffered?.some(s => 
          s.toLowerCase().includes(skill.toLowerCase())
        )
      );
    }

    // Generate matches (reverse perspective - find gurus for understudy)
    const guruRecommendations = [];
    for (const guru of availableGurus.slice(0, limit)) {
      const matches = await aiMatchmaker.generateSkillMatches(guru, [understudy], {
        limit: 1,
        minScore: 50 // Lower threshold for recommendations
      });
      
      if (matches.length > 0) {
        guruRecommendations.push({
          guru: {
            id: guru.id,
            displayName: guru.displayName,
            photoURL: guru.photoURL,
            skillsOffered: guru.skillsOffered,
            experience: guru.experience,
            rating: guru.rating,
            totalSessions: guru.totalSessions,
            price: guru.price,
            verified: guru.verified
          },
          matchScore: matches[0].matchScore,
          matchType: matches[0].matchType,
          reasoning: matches[0].reasoning,
          recommendations: matches[0].recommendations
        });
      }
    }

    // Sort by match score
    guruRecommendations.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      data: {
        understudyId: userId,
        recommendations: guruRecommendations,
        searchSkill: skill,
        totalAvailableGurus: availableGurus.length
      }
    });

  } catch (error) {
    logger.error('Understudy recommendations error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Generate personalized learning path recommendations
 * POST /api/matchmaking/learning-recommendations
 */
router.post('/learning-recommendations', authenticateUser, async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    // Get user profile
    const user = await usersDB.get(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Get available skills (for demo, using mock data)
    const { sampleSkills } = require('../scripts/seedFullDatabase');

    // Generate AI-powered recommendations
    const recommendations = await aiMatchmaker.generateLearningRecommendations(user, sampleSkills);

    res.json({
      success: true,
      data: {
        userId,
        recommendations,
        generatedAt: Date.now()
      }
    });

  } catch (error) {
    logger.error('Learning recommendations error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get available skill categories with AI-generated descriptions
 * GET /api/matchmaking/skill-categories
 */
router.get('/skill-categories', async (req, res) => {
  try {
    // For demo, return predefined categories
    // In production, this would aggregate from the skills database
    const categories = [
      {
        name: 'Programming',
        description: 'Software development, coding, and technical skills',
        subcategories: ['Web Development', 'Mobile Development', 'Data Science', 'DevOps'],
        skillCount: 45,
        averageRating: 4.7
      },
      {
        name: 'Fitness',
        description: 'Physical health, exercise, and wellness training',
        subcategories: ['Personal Training', 'Nutrition', 'Yoga', 'Sports'],
        skillCount: 32,
        averageRating: 4.8
      },
      {
        name: 'Languages',
        description: 'Foreign language learning and communication skills',
        subcategories: ['Spanish', 'French', 'Mandarin', 'English'],
        skillCount: 28,
        averageRating: 4.6
      },
      {
        name: 'Music',
        description: 'Musical instruments, theory, and performance',
        subcategories: ['Piano', 'Guitar', 'Vocals', 'Music Theory'],
        skillCount: 24,
        averageRating: 4.9
      },
      {
        name: 'Design',
        description: 'Visual design, UI/UX, and creative arts',
        subcategories: ['UI/UX', 'Graphic Design', 'Illustration', 'Photography'],
        skillCount: 19,
        averageRating: 4.7
      }
    ];

    res.json({
      success: true,
      data: {
        categories,
        totalCategories: categories.length,
        totalSkills: categories.reduce((sum, cat) => sum + cat.skillCount, 0)
      }
    });

  } catch (error) {
    logger.error('Skill categories error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get AI service configuration and status
 * GET /api/matchmaking/ai-status
 */
router.get('/ai-status', authenticateUser, async (req, res) => {
  try {
    const status = aiMatchmaker.getConfigurationStatus();
    
    res.json({
      success: true,
      data: {
        ...status,
        capabilities: {
          skillMatching: status.openrouterConfigured || status.openaiConfigured,
          learningRecommendations: status.openrouterConfigured || status.openaiConfigured,
          contentGeneration: status.openrouterConfigured || status.openaiConfigured,
          fallbackSupport: status.fallbackEnabled && status.openaiConfigured
        },
        lastChecked: Date.now()
      }
    });

  } catch (error) {
    logger.error('AI status error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Advanced skill matching with filters
 * POST /api/matchmaking/advanced-search
 */
router.post('/advanced-search', authenticateUser, async (req, res) => {
  try {
    const { 
      userType = 'understudy', 
      skills = [], 
      location, 
      priceRange, 
      availability, 
      experience,
      limit = 10
    } = req.body;

    // Get all users based on type
    const { sampleGurus, sampleUnderstudies } = require('../scripts/seedFullDatabase');
    const searchPool = userType === 'guru' ? sampleGurus : sampleUnderstudies;

    // Apply filters
    let filteredUsers = searchPool.filter(user => {
      // Skill filter
      if (skills.length > 0) {
        const userSkills = userType === 'guru' ? user.skillsOffered : user.skillsWanted;
        const hasMatchingSkill = skills.some(searchSkill => 
          userSkills?.some(userSkill => 
            userSkill.toLowerCase().includes(searchSkill.toLowerCase()) ||
            searchSkill.toLowerCase().includes(userSkill.toLowerCase())
          )
        );
        if (!hasMatchingSkill) return false;
      }

      // Location filter
      if (location && user.location) {
        if (!user.location.toLowerCase().includes(location.toLowerCase())) {
          return false;
        }
      }

      // Price range filter (for gurus)
      if (priceRange && user.price && userType === 'guru') {
        const { min = 0, max = 1000 } = priceRange;
        if (user.price.min > max || user.price.max < min) {
          return false;
        }
      }

      // Availability filter
      if (availability && user.availability) {
        const hasMatchingAvailability = availability.some(slot => 
          user.availability.includes(slot)
        );
        if (!hasMatchingAvailability) return false;
      }

      return true;
    });

    // Limit results
    filteredUsers = filteredUsers.slice(0, limit);

    res.json({
      success: true,
      data: {
        results: filteredUsers,
        filters: { userType, skills, location, priceRange, availability, experience },
        totalResults: filteredUsers.length,
        searchedAt: Date.now()
      }
    });

  } catch (error) {
    logger.error('Advanced search error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;