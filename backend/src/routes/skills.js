const express = require('express');
const skillsDB = require('../db/skills');
const { optionalAuth } = require('../middleware/auth');
const { logger } = require('../utils/logger');
const { categorizeSkill, getSkillCategories, normalizeSkillCategory } = require('../utils/skillCategorization');
const AISkillCategorizationService = require('../lib/aiSkillCategorizationService');

const router = express.Router();
const aiSkillCategorizer = new AISkillCategorizationService();

// AI Skill Matching Algorithm - kept for future use when implementing legacy features
// eslint-disable-next-line no-unused-vars
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

  // Reverse skill matches (user B offers what user A wants)
  const userBOffered = (userB.skillsOffered || []).map(s => s.toLowerCase());
  const userAWanted = (userA.skillsWanted || []).map(s => s.toLowerCase());
  
  userBOffered.forEach(skillB => {
    userAWanted.forEach(skillA => {
      if (skillB.includes(skillA) || skillA.includes(skillB)) {
        matchScore += 10; // High score for reverse matches
        matchDetails.push({
          type: 'reverse_match',
          teacherSkill: skillB,
          learnerWant: skillA,
          points: 10
        });
      }
    });
  });

  // Category matches (lower score)
  const userACats = [...new Set([...userAOffered, ...userAWanted].map(s => categorizeSkill(s)))];
  const userBCats = [...new Set([...userBOffered, ...userBWanted].map(s => categorizeSkill(s)))];
  
  const commonCats = userACats.filter(cat => userBCats.includes(cat));
  commonCats.forEach(cat => {
    if (cat !== 'General') { // Avoid generic matches
      matchScore += 2;
      matchDetails.push({
        type: 'category_match',
        category: cat,
        points: 2
      });
    }
  });

  return { score: matchScore, details: matchDetails };
}

// @desc    Get all skills (NEW FIRESTORE VERSION)
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

    const skillsWithCategory = skills.map(skill => ({
      ...skill,
      category: normalizeSkillCategory(skill)
    }));

    // Apply category filter (client-side for now, can be moved to DB later)
    let filteredSkills = skillsWithCategory;
    if (category) {
      filteredSkills = skillsWithCategory.filter(skill => skill.category === category);
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

    const keywordCategory = categorizeSkill(title);
    let category = keywordCategory;
    let categorySource = 'keyword';
    let categoryConfidence = keywordCategory === 'Other' ? 0 : 1;
    let categoryReasoning;

    if (keywordCategory === 'Other') {
      const aiCategory = await aiSkillCategorizer.categorizeSkill({ title, summary });
      if (aiCategory && aiCategory.category) {
        category = aiCategory.category;
        categorySource = `ai-${aiCategory.provider}`;
        categoryConfidence = aiCategory.confidence ?? null;
        categoryReasoning = aiCategory.reasoning;
      } else {
        categorySource = 'keyword-fallback-other';
      }
    }

    const skillData = {
      title,
      summary,
      createdBy: req.user.uid,
      isModifiedMasters,
      accessibilityTags,
      coachingStyles,
      resources: [],
      status: 'published', // For now, auto-publish. Can add moderation later.
      category,
      categorySource
    };

    if (categoryConfidence !== null && categoryConfidence !== undefined) {
      skillData.categoryConfidence = categoryConfidence;
    }

    if (categoryReasoning) {
      skillData.categoryReasoning = categoryReasoning;
    }

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

    const normalizedSkill = { ...skill, category: normalizeSkillCategory(skill) };

    res.json({
      success: true,
      data: { skill: normalizedSkill }
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
    const normalizedSkills = skills.map(skill => ({ ...skill, category: normalizeSkillCategory(skill) }));

    res.json({
      success: true,
      data: {
        skills: normalizedSkills,
        total: normalizedSkills.length
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