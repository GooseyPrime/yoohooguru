/**
 * Modified Masters API Routes
 * Handles MM-specific skills, resources, and accessibility features
 */

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { getConfig } = require('../config/appConfig');
const { getDatabase } = require('../config/firebase');
const { logger } = require('../utils/logger');
const { 
  COACHING_STYLES, 
  RESOURCE_TYPES, 
  SKILL_STATUSES,
  createResourceLink,
  validateCoachingStyles,
  validateResourceLink
} = require('../types/models');

const router = express.Router();
const config = getConfig();

// Early return empty router if feature is disabled
if (!config.featureModifiedMasters) {
  module.exports = router;
} else {

/**
 * @desc    Get Modified Masters skills
 * @route   GET /api/modified-masters/skills
 * @access  Public
 */
router.get('/skills', optionalAuth, async (req, res) => {
  try {
    const db = getDatabase();
    if (!db) {
      return res.status(503).json({
        success: false,
        error: { message: 'Database not available' }
      });
    }

    const { tag, q: searchQuery, style } = req.query;

    // Get all skills from users (following existing pattern)
    const usersSnapshot = await db.ref('users').once('value');
    const skills = [];

    usersSnapshot.forEach(childSnapshot => {
      const user = { id: childSnapshot.key, ...childSnapshot.val() };
      
      // Only include skills marked as Modified Masters
      if (user.skillsOffered && user.modifiedMasters?.wantsToTeach) {
        user.skillsOffered.forEach(skill => {
          // Check if this skill has MM data
          if (user.modifiedMastersSkills && user.modifiedMastersSkills[skill]) {
            const mmSkillData = user.modifiedMastersSkills[skill];
            
            // Only show published skills (or all if no review required)
            if (mmSkillData.status === SKILL_STATUSES.PUBLISHED || 
                !config.modifiedMastersRequireReview) {
              
              // Apply filters
              let includeSkill = true;
              
              if (tag && (!mmSkillData.accessibilityTags || !mmSkillData.accessibilityTags.includes(tag))) {
                includeSkill = false;
              }
              
              if (searchQuery && !skill.toLowerCase().includes(searchQuery.toLowerCase())) {
                includeSkill = false;
              }
              
              if (style && (!mmSkillData.coachingStyles || !mmSkillData.coachingStyles.includes(style))) {
                includeSkill = false;
              }
              
              if (includeSkill) {
                skills.push({
                  id: `${user.id}-${skill}`,
                  title: skill,
                  summary: mmSkillData.summary || `Learn ${skill} with accessibility-first approach`,
                  coachId: user.id,
                  coachName: user.displayName || user.name || 'Anonymous Coach',
                  isModifiedMasters: true,
                  accessibilityTags: mmSkillData.accessibilityTags || [],
                  coachingStyles: mmSkillData.coachingStyles || [],
                  resources: mmSkillData.resources || [],
                  status: mmSkillData.status || SKILL_STATUSES.PUBLISHED,
                  createdAt: mmSkillData.createdAt || Date.now(),
                  updatedAt: mmSkillData.updatedAt || mmSkillData.createdAt || Date.now()
                });
              }
            }
          } else {
            // Basic MM skill without extended data
            if (!searchQuery || skill.toLowerCase().includes(searchQuery.toLowerCase())) {
              skills.push({
                id: `${user.id}-${skill}`,
                title: skill,
                summary: `Learn ${skill} with Modified Masters community`,
                coachId: user.id,
                coachName: user.displayName || user.name || 'Anonymous Coach',
                isModifiedMasters: true,
                accessibilityTags: [],
                coachingStyles: [],
                resources: [],
                status: SKILL_STATUSES.PUBLISHED,
                createdAt: Date.now(),
                updatedAt: Date.now()
              });
            }
          }
        });
      }
    });

    // Sort by creation date (most recent first)
    skills.sort((a, b) => b.createdAt - a.createdAt);

    logger.info(`Found ${skills.length} Modified Masters skills`);

    res.json({
      success: true,
      data: { skills }
    });

  } catch (error) {
    logger.error('Get MM skills error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch Modified Masters skills' }
    });
  }
});

/**
 * @desc    Create/update Modified Masters skill
 * @route   POST /api/modified-masters/skills
 * @access  Private
 */
router.post('/skills', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.uid || req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'User authentication required' }
      });
    }

    const db = getDatabase();
    if (!db) {
      return res.status(503).json({
        success: false,
        error: { message: 'Database not available' }
      });
    }

    const {
      title,
      summary,
      accessibilityTags = [],
      coachingStyles = [],
      resources = []
    } = req.body;

    if (!title || typeof title !== 'string') {
      return res.status(400).json({
        success: false,
        error: { message: 'Skill title is required' }
      });
    }

    // Validate coaching styles
    if (coachingStyles.length > 0) {
      const validation = validateCoachingStyles(coachingStyles);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          error: { message: validation.errors.join(', ') }
        });
      }
    }

    // Prepare skill data
    const skillData = {
      title,
      summary: summary || `Learn ${title} with accessibility-first approach`,
      isModifiedMasters: true,
      accessibilityTags,
      coachingStyles,
      resources,
      status: config.modifiedMastersRequireReview ? SKILL_STATUSES.PENDING : SKILL_STATUSES.PUBLISHED,
      createdAt: Date.now(),
      createdBy: userId
    };

    // Update user's MM skills
    const userRef = db.ref(`users/${userId}`);
    const userSnapshot = await userRef.once('value');
    const userData = userSnapshot.val() || {};

    // Initialize MM data if needed
    if (!userData.modifiedMasters) {
      userData.modifiedMasters = {
        wantsToTeach: true,
        wantsToLearn: false,
        tags: [],
        visible: true,
        coachingStyles: coachingStyles
      };
    }

    if (!userData.modifiedMastersSkills) {
      userData.modifiedMastersSkills = {};
    }

    // Add skill to skillsOffered if not already there
    if (!userData.skillsOffered) {
      userData.skillsOffered = [];
    }
    if (!userData.skillsOffered.includes(title)) {
      userData.skillsOffered.push(title);
    }

    // Store MM-specific skill data
    userData.modifiedMastersSkills[title] = skillData;

    await userRef.set(userData);

    logger.info(`Modified Masters skill created: ${title} by user ${userId}`);

    res.status(201).json({
      success: true,
      data: { skill: skillData }
    });

  } catch (error) {
    logger.error('Create MM skill error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to create Modified Masters skill' }
    });
  }
});

/**
 * @desc    Add resource to Modified Masters skill
 * @route   POST /api/modified-masters/skills/:skillId/resources
 * @access  Private
 */
router.post('/skills/:skillId/resources', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.uid || req.user?.id;
    const { skillId } = req.params;
    const { title, url, type } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'User authentication required' }
      });
    }

    // Parse skillId (format: userId-skillName)
    const [skillUserId, ...skillNameParts] = skillId.split('-');
    const skillName = skillNameParts.join('-');

    // Only skill owner can add resources
    if (skillUserId !== userId) {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied' }
      });
    }

    const resourceData = { title, url, type };
    const validation = validateResourceLink(resourceData);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: { message: validation.errors.join(', ') }
      });
    }

    const db = getDatabase();
    if (!db) {
      return res.status(503).json({
        success: false,
        error: { message: 'Database not available' }
      });
    }

    const resource = createResourceLink({
      id: uuidv4(),
      title,
      url,
      type: type || RESOURCE_TYPES.SITE,
      addedBy: userId
    });

    // Add resource to skill
    const skillPath = `users/${skillUserId}/modifiedMastersSkills/${skillName}/resources`;
    const resourcesRef = db.ref(skillPath);
    const resourcesSnapshot = await resourcesRef.once('value');
    const currentResources = resourcesSnapshot.val() || [];
    
    currentResources.push(resource);
    await resourcesRef.set(currentResources);

    // Update skill's updatedAt
    await db.ref(`users/${skillUserId}/modifiedMastersSkills/${skillName}/updatedAt`).set(Date.now());

    logger.info(`Resource added to MM skill ${skillName} by user ${userId}`);

    res.status(201).json({
      success: true,
      data: { resource }
    });

  } catch (error) {
    logger.error('Add MM resource error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to add resource' }
    });
  }
});

/**
 * @desc    Get Modified Masters configuration/metadata
 * @route   GET /api/modified-masters/config
 * @access  Public
 */
router.get('/config', (req, res) => {
  res.json({
    success: true,
    data: {
      enabled: config.featureModifiedMasters,
      donateUrl: config.modifiedMastersDonateUrl,
      subdomainEnabled: config.modifiedMastersEnableSubdomain,
      reviewRequired: config.modifiedMastersRequireReview,
      coachingStyles: Object.values(COACHING_STYLES),
      resourceTypes: Object.values(RESOURCE_TYPES)
    }
  });
});

} // End of feature flag check

module.exports = router;