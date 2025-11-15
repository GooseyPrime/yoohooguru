const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateUser, requireRole } = require('../middleware/auth');
const usersDB = require('../db/users');
const { logger } = require('../utils/logger');
const { createDisabilityAttestation } = require('../types/models');

const router = express.Router();

/**
 * @desc    Submit disability attestation
 * @route   POST /api/attestation/disability
 * @access  Private
 */
router.post('/disability', [
  authenticateUser,
  body('fullLegalName').trim().isLength({ min: 2, max: 100 }).withMessage('Full legal name is required'),
  body('attestationText').trim().isLength({ min: 10 }).withMessage('Attestation text is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      });
    }

    const { fullLegalName, attestationText } = req.body;
    const userId = req.user.uid;

    // Create attestation object
    const attestation = createDisabilityAttestation({
      attested: true,
      attestedAt: new Date().toISOString(),
      fullLegalName,
      attestationText,
      documentationProvided: false,
      documentationVerified: false,
      verifiedBy: null,
      verifiedAt: null,
      verificationNotes: ''
    });

    // Update user profile
    await usersDB.updateDisabilityAttestation(userId, attestation);

    logger.info(`Disability attestation submitted for user: ${userId}`);

    res.json({
      success: true,
      message: 'Disability attestation submitted successfully',
      data: {
        attested: true,
        attestedAt: attestation.attestedAt
      }
    });

  } catch (error) {
    logger.error('Disability attestation submission error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to submit attestation' }
    });
  }
});

/**
 * @desc    Get disability attestation status
 * @route   GET /api/attestation/disability/status
 * @access  Private
 */
router.get('/disability/status', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    const user = await usersDB.get(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    const attestation = user.disabilityAttestation || {
      attested: false,
      documentationVerified: false
    };

    res.json({
      success: true,
      data: {
        attested: attestation.attested,
        attestedAt: attestation.attestedAt,
        documentationVerified: attestation.documentationVerified,
        verifiedAt: attestation.verifiedAt
      }
    });

  } catch (error) {
    logger.error('Get attestation status error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch attestation status' }
    });
  }
});

/**
 * @desc    Verify disability attestation (Admin only)
 * @route   PUT /api/attestation/disability/verify/:userId
 * @access  Admin
 */
router.put('/disability/verify/:userId', [
  authenticateUser,
  requireRole(['admin']),
  body('verified').isBoolean().withMessage('Verified status is required'),
  body('verificationNotes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Validation failed', details: errors.array() }
      });
    }

    const { userId } = req.params;
    const { verified, verificationNotes } = req.body;
    const adminId = req.user.uid;

    // Get current user data
    const user = await usersDB.get(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }

    // Update attestation verification
    const updatedAttestation = {
      ...user.disabilityAttestation,
      documentationVerified: verified,
      verifiedBy: adminId,
      verifiedAt: new Date().toISOString(),
      verificationNotes: verificationNotes || ''
    };

    await usersDB.updateDisabilityAttestation(userId, updatedAttestation);

    logger.info(`Disability attestation ${verified ? 'verified' : 'rejected'} for user: ${userId} by admin: ${adminId}`);

    res.json({
      success: true,
      message: `Attestation ${verified ? 'verified' : 'rejected'} successfully`,
      data: {
        verified,
        verifiedAt: updatedAttestation.verifiedAt
      }
    });

  } catch (error) {
    logger.error('Attestation verification error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to verify attestation' }
    });
  }
});

/**
 * @desc    Get users pending attestation verification (Admin only)
 * @route   GET /api/attestation/disability/pending
 * @access  Admin
 */
router.get('/disability/pending', [
  authenticateUser,
  requireRole(['admin'])
], async (req, res) => {
  try {
    const users = await usersDB.findUsersWithDisabilityAttestation(false);

    // Remove sensitive information
    const sanitizedUsers = users.map(user => ({
      id: user.id,
      displayName: user.displayName,
      email: user.email,
      attestedAt: user.disabilityAttestation?.attestedAt,
      fullLegalName: user.disabilityAttestation?.fullLegalName
    }));

    res.json({
      success: true,
      data: {
        users: sanitizedUsers,
        total: sanitizedUsers.length
      }
    });

  } catch (error) {
    logger.error('Get pending attestations error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch pending attestations' }
    });
  }
});

module.exports = router;