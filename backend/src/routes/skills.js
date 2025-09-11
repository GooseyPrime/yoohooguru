const express = require('express');
const { getFirestore } = require('../firebase/admin');
const skillsDB = require('../db/skills');
const { optionalAuth } = require('../middleware/auth');
const { logger } = require('../utils/logger');
const { categorizeSkill, getSkillCategories } = require('../utils/skillCategorization');

const router = express.Router();

// AI Skill Matching Algorithm
function calculateSkillMatchScore(userA, userB) {
  let matchScore = 0;
  let matchDetails = [];

  // Direct skill matches (user A offers what user B wants)
  const userAOffered = (userA.skillsOffered || []).map(s => s.toLowerCase());
  const userBWanted = (userB.skillsWanted || []).map(s => s.toLowerCase());
  
  userAOffered.forEach(skillA => {
    userBWanted.forEach(skillB => {
      if (skillA.includes(skillB) || skillB.includes(skillA)) {
        matchScore += 10; // High score for direct matches
        matchDetails.push({
          type: 'direct_match',
          teacherSkill: skillA,
          learnerWant: skillB,
          points: 10
        });
      }
    });
  });

  // Reverse matches (user B offers what user A wants)
  const userBOffered = (userB.skillsOffered || []).map(s => s.toLowerCase());
  const userAWanted = (userA.skillsWanted || []).map(s => s.toLowerCase());
  
  userBOffered.forEach(skillB => {
    userAWanted.forEach(skillA => {
      if (skillB.includes(skillA) || skillA.includes(skillB)) {
        matchScore += 10; // High score for mutual exchange potential
        matchDetails.push({
          type: 'reverse_match',
          teacherSkill: skillB,
          learnerWant: skillA,
          points: 10
        });
      }
    });
  });

  // Category-based matches (same category skills)
  userAOffered.forEach(skillA => {
    const categoryA = categorizeSkill(skillA);
    userBWanted.forEach(skillB => {
      const categoryB = categorizeSkill(skillB);
      if (categoryA === categoryB && categoryA !== 'Other') {
        matchScore += 3; // Lower score for category matches
        matchDetails.push({
          type: 'category_match',
          category: categoryA,
          points: 3
        });
      }
    });
  });

  // Location proximity bonus (if both have location data)
  if (userA.location && userB.location) {
    // Simple same-city check (can be enhanced with actual distance calculation)
    if (userA.location.city === userB.location.city) {
      matchScore += 5;
      matchDetails.push({
        type: 'location_bonus',
        city: userA.location.city,
        points: 5
      });
    }
  }

  return {
    score: matchScore,
    details: matchDetails
  };
}

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      category, 
      search, 
      popular = false, 
      isModifiedMasters, 
      status = 'published',
      tag,
      style 
    } = req.query;
    
    // Use new Firestore-based skills collection
    const skills = await skillsDB.find({
      q: search,
      tag,
      style,
      isModifiedMasters: isModifiedMasters === 'true',
      status
    });

    // Apply category filter (client-side for now, can be moved to DB later)
    let filteredSkills = skills;
    if (category) {
      filteredSkills = skills.filter(skill => {
        const skillCategory = categorizeSkill(skill.title);
        return skillCategory === category;
      });
    }

    // Apply popularity filter (for now, just check if skill has been used in sessions)
    if (popular === 'true') {
      // For now, consider skills with resources as popular
      filteredSkills = filteredSkills.filter(skill => 
        skill.resources && skill.resources.length > 0
      );
    }

    res.json({
      success: true,
      data: {
        skills: filteredSkills,
        total: filteredSkills.length,
        categories: getSkillCategories()
      }
    });

  } catch (error) {
    logger.error('Get skills error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch skills' }
    });
  }
});

// @desc    Get skill details
// @route   GET /api/skills/:skillName
// @access  Public
router.get('/:skillName', async (req, res) => {
  try {
    const { skillName } = req.params;
    const skillLower = skillName.toLowerCase();
    
    const db = getDatabase();
    const usersSnapshot = await db.ref('users').once('value');
    
    const teachers = [];
    const learners = [];

    usersSnapshot.forEach(childSnapshot => {
      const user = { id: childSnapshot.key, ...childSnapshot.val() };
      
      // Remove sensitive information
      delete user.email;
      delete user.lastLoginAt;

      // Check if user offers this skill
      if (user.skillsOffered && user.skillsOffered.some(skill => 
        skill.toLowerCase().includes(skillLower))) {
        teachers.push({
          ...user,
          type: 'teacher'
        });
      }

      // Check if user wants this skill
      if (user.skillsWanted && user.skillsWanted.some(skill => 
        skill.toLowerCase().includes(skillLower))) {
        learners.push({
          ...user,
          type: 'learner'
        });
      }
    });

    res.json({
      success: true,
      data: {
        skill: skillName,
        category: categorizeSkill(skillName),
        teachers,
        learners,
        totalTeachers: teachers.length,
        totalLearners: learners.length
      }
    });

  } catch (error) {
    logger.error('Get skill details error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch skill details' }
    });
  }
});

// @desc    Get skill suggestions
// @route   GET /api/skills/suggestions
// @access  Public
router.get('/suggestions/autocomplete', async (req, res) => {
  try {
    const { q: query, limit = 10 } = req.query;
    
    if (!query || query.length < 2) {
      return res.json({
        success: true,
        data: { suggestions: [] }
      });
    }

    const db = getDatabase();
    const usersSnapshot = await db.ref('users').once('value');
    const skillsSet = new Set();

    usersSnapshot.forEach(childSnapshot => {
      const user = childSnapshot.val();
      
      (user.skillsOffered || []).forEach(skill => skillsSet.add(skill));
      (user.skillsWanted || []).forEach(skill => skillsSet.add(skill));
    });

    const searchTerm = query.toLowerCase();
    const suggestions = Array.from(skillsSet)
      .filter(skill => skill.toLowerCase().includes(searchTerm))
      .slice(0, parseInt(limit))
      .map(skill => ({
        name: skill,
        category: categorizeSkill(skill)
      }));

    res.json({
      success: true,
      data: { suggestions }
    });

  } catch (error) {
    logger.error('Get skill suggestions error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch suggestions' }
    });
  }
});

// @desc    Get AI-powered skill matches for a user
// @route   GET /api/skills/matches/:userId
// @access  Public (with user ID)
router.get('/matches/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, minScore = 5 } = req.query;

    const db = getDatabase();
    
    // Get the target user
    const targetUserSnapshot = await db.ref(`users/${userId}`).once('value');
    if (!targetUserSnapshot.exists()) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    const targetUser = { id: userId, ...targetUserSnapshot.val() };
    
    // Get all other users
    const usersSnapshot = await db.ref('users').once('value');
    const matches = [];

    usersSnapshot.forEach(childSnapshot => {
      const otherUserId = childSnapshot.key;
      if (otherUserId !== userId) {
        const otherUser = { id: otherUserId, ...childSnapshot.val() };
        
        // Calculate match score
        const matchResult = calculateSkillMatchScore(targetUser, otherUser);
        
        if (matchResult.score >= minScore) {
          // Remove sensitive information
          delete otherUser.email;
          delete otherUser.lastLoginAt;
          
          matches.push({
            user: otherUser,
            matchScore: matchResult.score,
            matchDetails: matchResult.details
          });
        }
      }
    });

    // Sort by match score (highest first) and limit results
    const sortedMatches = matches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: {
        targetUserId: userId,
        matches: sortedMatches,
        totalMatches: sortedMatches.length,
        algorithm: 'ai_skill_matching_v1'
      }
    });

  } catch (error) {
    logger.error('Get skill matches error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch skill matches' }
    });
  }
});

// @desc    Get optimal skill exchange pairs in the community
// @route   GET /api/skills/exchange-pairs
// @access  Public
router.get('/exchange-pairs', async (req, res) => {
  try {
    const { limit = 20, minScore = 10 } = req.query;

    const db = getDatabase();
    const usersSnapshot = await db.ref('users').once('value');
    const users = [];
    
    // Collect all users
    usersSnapshot.forEach(childSnapshot => {
      const user = { id: childSnapshot.key, ...childSnapshot.val() };
      delete user.email;
      delete user.lastLoginAt;
      users.push(user);
    });

    const exchangePairs = [];

    // Calculate mutual exchange potential between all user pairs
    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        const userA = users[i];
        const userB = users[j];
        
        const matchResult = calculateSkillMatchScore(userA, userB);
        
        // Check for mutual exchange potential (both users can teach each other)
        const mutualExchange = matchResult.details.some(detail => 
          detail.type === 'direct_match'
        ) && matchResult.details.some(detail => 
          detail.type === 'reverse_match'
        );

        if (matchResult.score >= minScore && mutualExchange) {
          exchangePairs.push({
            userA: userA,
            userB: userB,
            exchangeScore: matchResult.score,
            exchangeDetails: matchResult.details,
            mutualExchange: true
          });
        }
      }
    }

    // Sort by exchange score and limit results
    const sortedPairs = exchangePairs
      .sort((a, b) => b.exchangeScore - a.exchangeScore)
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: {
        exchangePairs: sortedPairs,
        totalPairs: sortedPairs.length,
        algorithm: 'mutual_skill_exchange_v1'
      }
    });

  } catch (error) {
    logger.error('Get exchange pairs error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch exchange pairs' }
    });
  }
});

// NEW FIRESTORE-BASED SKILL MANAGEMENT ROUTES

// @desc    Create a new skill
// @route   POST /api/skills
// @access  Private
router.post('/', optionalAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication required to create skills' }
      });
    }

    const {
      title,
      summary,
      isModifiedMasters = false,
      accessibilityTags = [],
      coachingStyles = []
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        error: { message: 'Skill title is required' }
      });
    }

    const skillData = {
      title,
      summary,
      createdBy: req.user.uid,
      isModifiedMasters,
      accessibilityTags,
      coachingStyles,
      resources: [],
      status: 'published' // For now, auto-publish. Can add moderation later.
    };

    const skill = await skillsDB.create(skillData);

    res.status(201).json({
      success: true,
      data: { skill }
    });

  } catch (error) {
    logger.error('Create skill error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create skill' }
    });
  }
});

// @desc    Get skill by ID
// @route   GET /api/skills/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const skill = await skillsDB.get(req.params.id);
    
    if (!skill) {
      return res.status(404).json({
        success: false,
        error: { message: 'Skill not found' }
      });
    }

    res.json({
      success: true,
      data: { skill }
    });

  } catch (error) {
    logger.error('Get skill error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch skill' }
    });
  }
});

// @desc    Update skill
// @route   PUT /api/skills/:id  
// @access  Private
router.put('/:id', optionalAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication required' }
      });
    }

    const skill = await skillsDB.get(req.params.id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        error: { message: 'Skill not found' }
      });
    }

    // Check ownership
    if (skill.createdBy !== req.user.uid) {
      return res.status(403).json({
        success: false,
        error: { message: 'Not authorized to update this skill' }
      });
    }

    const updates = req.body;
    delete updates.createdBy; // Prevent changing ownership
    delete updates.createdAt; // Prevent changing creation date

    const updatedSkill = await skillsDB.update(req.params.id, updates);

    res.json({
      success: true,
      data: { skill: updatedSkill }
    });

  } catch (error) {
    logger.error('Update skill error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update skill' }
    });
  }
});

// @desc    Add resource to skill
// @route   POST /api/skills/:id/resources
// @access  Private  
router.post('/:id/resources', optionalAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication required' }
      });
    }

    const { title, url, type } = req.body;
    if (!title || !url) {
      return res.status(400).json({
        success: false,
        error: { message: 'Resource title and URL are required' }
      });
    }

    const resource = {
      title,
      url,
      type: type || 'link',
      addedBy: req.user.uid
    };

    const updatedSkill = await skillsDB.addResource(req.params.id, resource);

    res.json({
      success: true,
      data: { skill: updatedSkill }
    });

  } catch (error) {
    logger.error('Add resource error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to add resource' }
    });
  }
});

// @desc    Get skills by creator
// @route   GET /api/skills/user/:userId
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const skills = await skillsDB.getByCreator(req.params.userId);

    res.json({
      success: true,
      data: {
        skills,
        total: skills.length
      }
    });

  } catch (error) {
    logger.error('Get user skills error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch user skills' }
    });
  }
});

module.exports = router;