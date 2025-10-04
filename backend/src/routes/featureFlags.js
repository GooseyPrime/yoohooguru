const express = require('express');
const { getPublicFlags, getAllFlags, updateFlag } = require('../lib/featureFlags');
const { logger } = require('../utils/logger');

const router = express.Router();

/**
 * Get public feature flags (for client-side use)
 */
router.get('/', (req, res) => {
  try {
    const flags = getPublicFlags();
    // Generate version timestamp
    const now = new Date();
    const version = now.toISOString().replace(/[-:]/g, '').split('.')[0].replace('T', '.');
    
    // Set Content-Type header explicitly
    res.setHeader('Content-Type', 'application/json');
    
    // Return in format: { features: {...}, version: "YYYYMMDD.HHMM" }
    res.json({ 
      features: flags,
      version: version
    });
  } catch (error) {
    logger.error('Error getting feature flags:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Internal server error' } 
    });
  }
});

/**
 * Get all feature flags (admin only)
 */
router.get('/admin', (req, res) => {
  const adminCookie = req.cookies?.yoohoo_admin;
  
  if (adminCookie !== '1') {
    return res.status(401).json({ 
      success: false, 
      error: { message: 'Admin authentication required' } 
    });
  }

  try {
    const flags = getAllFlags();
    res.json({ success: true, flags });
  } catch (error) {
    logger.error('Error getting admin feature flags:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Internal server error' } 
    });
  }
});

/**
 * Update a feature flag (admin only, write operations enabled)
 */
router.patch('/admin/:flagName', (req, res) => {
  const adminCookie = req.cookies?.yoohoo_admin;
  
  if (adminCookie !== '1') {
    return res.status(401).json({ 
      success: false, 
      error: { message: 'Admin authentication required' } 
    });
  }

  const adminWriteEnabled = process.env.ADMIN_WRITE_ENABLED === 'true';
  if (!adminWriteEnabled) {
    return res.status(403).json({ 
      success: false, 
      error: { message: 'Admin write operations disabled' } 
    });
  }

  const { flagName } = req.params;
  const { enabled } = req.body;

  if (typeof enabled !== 'boolean') {
    return res.status(400).json({ 
      success: false, 
      error: { message: 'enabled field must be a boolean' } 
    });
  }

  try {
    const success = updateFlag(flagName, enabled);
    
    if (!success) {
      return res.status(404).json({ 
        success: false, 
        error: { message: 'Feature flag not found' } 
      });
    }

    logger.info(`Feature flag ${flagName} updated to ${enabled}`, { 
      admin: true, 
      ip: req.ip 
    });

    res.json({ 
      success: true, 
      message: `Feature flag ${flagName} updated`,
      flagName,
      enabled 
    });
  } catch (error) {
    logger.error('Error updating feature flag:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Internal server error' } 
    });
  }
});

module.exports = router;