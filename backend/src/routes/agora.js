/**
 * Agora Video Conferencing Routes
 * Provides token generation for secure Agora RTC sessions
 * 
 * @module routes/agora
 */

const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-token');
const router = express.Router();
const logger = require('../utils/logger');

/**
 * POST /api/v1/agora/token
 * Generate Agora RTC token for video sessions
 * 
 * @body {string} channel - Channel name (typically session ID)
 * @body {string|number} uid - User ID (numeric or string)
 * @body {string} role - User role: 'publisher' or 'subscriber'
 * @returns {Object} Token and metadata
 */
router.post('/token', (req, res) => {
  try {
    const { channel, uid, role } = req.body;
    
    // Validate required parameters
    if (!channel || !uid) {
      logger.warn('Agora token request missing required parameters', { channel, uid });
      return res.status(400).json({ 
        success: false, 
        error: { message: 'channel and uid are required' }
      });
    }

    // Get Agora credentials from environment
    const appID = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    // Validate Agora configuration
    if (!appID || !appCertificate) {
      logger.error('Agora credentials not configured', {
        hasAppId: !!appID,
        hasCertificate: !!appCertificate
      });
      return res.status(500).json({ 
        success: false, 
        error: { message: 'Video conferencing service not configured' }
      });
    }

    // Token configuration
    const expirationTimeInSeconds = 3600; // 1 hour
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // Determine role (default to publisher for full capabilities)
    const agoraRole = role === 'subscriber' ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER;

    // Generate token
    const token = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channel,
      uid,
      agoraRole,
      privilegeExpiredTs
    );

    logger.info('Agora token generated successfully', {
      channel,
      uid,
      role: agoraRole === RtcRole.PUBLISHER ? 'publisher' : 'subscriber',
      expiresIn: expirationTimeInSeconds
    });

    res.json({ 
      success: true, 
      data: { 
        token,
        appId: appID,
        channel,
        uid,
        role: agoraRole === RtcRole.PUBLISHER ? 'publisher' : 'subscriber',
        expiresAt: privilegeExpiredTs,
        expiresIn: expirationTimeInSeconds
      }
    });
  } catch (error) {
    logger.error('Error generating Agora token:', error);
    res.status(500).json({ 
      success: false, 
      error: { message: 'Failed to generate video conference token' }
    });
  }
});

/**
 * GET /api/v1/agora/status
 * Check Agora service configuration status
 * 
 * @returns {Object} Configuration status
 */
router.get('/status', (req, res) => {
  const configured = !!(process.env.AGORA_APP_ID && process.env.AGORA_APP_CERTIFICATE);
  
  res.json({
    success: true,
    data: {
      configured,
      region: process.env.AGORA_REGION || 'us',
      features: {
        rtc: configured,
        chat: !!(process.env.AGORA_CHAT_APP_KEY),
        rest: !!(process.env.AGORA_REST_KEY)
      }
    }
  });
});

module.exports = router;
