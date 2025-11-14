const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateUser } = require('../middleware/auth');
const usersDB = require('../db/users');
const { logger } = require('../utils/logger');
const { createHeroGuruPrefs } = require('../types/models');

const router = express.Router();

/**
 * @desc    Update Hero Guru preferences (enable/disable free services)
 * @route   PUT /api/hero-gurus/preferences
 * @access  Private
 */
router.put('/preferences', [
  authenticateUser,
  body('provideFreeServices').isBoolean().withMessage('provideFreeServices must be a boolean'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      });
    }

    const { provideFreeServices } = req.body;
    const userId = req.user.uid;

    // Get current user data
    const user = await usersDB.get(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    // Check if user has hero-guru role
    if (user.role !== 'hero-guru' && user.role !== 'hero') {
      return res.status(403).json({
        success: false,
        error: { message: 'Only Hero Gurus can update these preferences' }
      });
    }

    // Update Hero Guru preferences
    const currentPrefs = user.heroGuruPrefs || {};
    const updatedPrefs = createHeroGuruPrefs({
      ...currentPrefs,
      provideFreeServices,
      enabledAt: provideFreeServices ? new Date().toISOString() : currentPrefs.enabledAt,
      disabledAt: !provideFreeServices ? new Date().toISOString() : currentPrefs.disabledAt,
      totalFreeSessionsProvided: currentPrefs.totalFreeSessionsProvided || 0,
      visible: true
    });

    await usersDB.updateHeroGuruPrefs(userId, updatedPrefs);

    logger.info(`Hero Guru preferences updated for user: ${userId} - Free services: ${provideFreeServices}`);

    res.json({
      success: true,
      message: `Free services ${provideFreeServices ? 'enabled' : 'disabled'} successfully`,
      data: updatedPrefs
    });

  } catch (error) {
    logger.error('Update Hero Guru preferences error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to update preferences' }
    });
  }
});

/**
 * @desc    Get Hero Guru preferences
 * @route   GET /api/hero-gurus/preferences
 * @access  Private
 */
router.get('/preferences', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await usersDB.get(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    const prefs = user.heroGuruPrefs || createHeroGuruPrefs();

    res.json({
      success: true,
      data: prefs
    });

  } catch (error) {
    logger.error('Get Hero Guru preferences error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch preferences' }
    });
  }
});

/**
 * @desc    Get list of Hero Gurus providing free services
 * @route   GET /api/hero-gurus/available
 * @access  Public
 */
router.get('/available', async (req, res) => {
  try {
    const heroGurus = await usersDB.findHeroGurusProvidingFreeServices();

    // Remove sensitive information
    const sanitizedHeroGurus = heroGurus.map(guru => ({
      id: guru.id,
      displayName: guru.displayName,
      skillsOffered: guru.skillsOffered || [],
      location: guru.location,
      averageRating: guru.averageRating,
      totalHoursTaught: guru.totalHoursTaught,
      accessibility: guru.accessibility,
      coachingStyles: guru.modifiedMasters?.coachingStyles || [],
      totalFreeSessionsProvided: guru.heroGuruPrefs?.totalFreeSessionsProvided || 0
    }));

    res.json({
      success: true,
      data: {
        heroGurus: sanitizedHeroGurus,
        total: sanitizedHeroGurus.length
      }
    });

  } catch (error) {
    logger.error('Get available Hero Gurus error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch Hero Gurus' }
    });
  }
});

/**
 * @desc    Check if user can access Hero Gurus section
 * @route   GET /api/hero-gurus/access-check
 * @access  Private
 */
router.get('/access-check', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await usersDB.get(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    // Check if user has attested to having a disability
    const hasAccess = user.disabilityAttestation?.attested === true;

    res.json({
      success: true,
      data: {
        hasAccess,
        attested: user.disabilityAttestation?.attested || false,
        verified: user.disabilityAttestation?.documentationVerified || false
      }
    });

  } catch (error) {
    logger.error('Hero Gurus access check error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to check access' }
    });
  }
});

module.exports = router;