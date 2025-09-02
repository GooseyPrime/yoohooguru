const express = require('express');
const { getDatabase } = require('../config/firebase');
const { optionalAuth } = require('../middleware/auth');
const { logger } = require('../utils/logger');
const { categorizeSkill, getSkillCategories } = require('../utils/skillCategorization');

const router = express.Router();

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, search, popular = false } = req.query;
    
    const db = getDatabase();
    
    // Get all skills from users
    const usersSnapshot = await db.ref('users').once('value');
    const skillsMap = new Map();

    usersSnapshot.forEach(childSnapshot => {
      const user = childSnapshot.val();
      
      // Count offered skills
      (user.skillsOffered || []).forEach(skill => {
        const skillLower = skill.toLowerCase();
        if (!skillsMap.has(skillLower)) {
          skillsMap.set(skillLower, {
            name: skill,
            offeredBy: 0,
            wantedBy: 0,
            category: categorizeSkill(skill)
          });
        }
        skillsMap.get(skillLower).offeredBy++;
      });

      // Count wanted skills
      (user.skillsWanted || []).forEach(skill => {
        const skillLower = skill.toLowerCase();
        if (!skillsMap.has(skillLower)) {
          skillsMap.set(skillLower, {
            name: skill,
            offeredBy: 0,
            wantedBy: 0,
            category: categorizeSkill(skill)
          });
        }
        skillsMap.get(skillLower).wantedBy++;
      });
    });

    let skills = Array.from(skillsMap.values());

    // Apply filters
    if (category) {
      skills = skills.filter(skill => skill.category === category);
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      skills = skills.filter(skill => 
        skill.name.toLowerCase().includes(searchTerm)
      );
    }

    if (popular === 'true') {
      skills = skills.filter(skill => skill.offeredBy > 0 && skill.wantedBy > 0);
    }

    // Sort by popularity (total mentions)
    skills.sort((a, b) => (b.offeredBy + b.wantedBy) - (a.offeredBy + a.wantedBy));

    res.json({
      success: true,
      data: {
        skills,
        total: skills.length,
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

module.exports = router;