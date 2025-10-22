/**
 * API v1 Routes
 * Versioned API routes for backward compatibility
 * 
 * @module routes/v1
 */

const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('../auth');
const userRoutes = require('../users');
const skillRoutes = require('../skills');
const exchangeRoutes = require('../exchanges');
const paymentRoutes = require('../payments');
const aiRoutes = require('../ai');
const matchmakingRoutes = require('../matchmaking');
const adminRoutes = require('../admin');
const featureFlagRoutes = require('../featureFlags');
const liabilityRoutes = require('../liability');
const webhookRoutes = require('../webhooks');
const angelsRoutes = require('../angels');
const connectRoutes = require('../connect');
const payoutsRoutes = require('../payouts');
const onboardingRoutes = require('../onboarding');
const documentsRoutes = require('../documents');
const gurusRoutes = require('../gurus');
const sessionsRoutes = require('../sessions');
const modifiedMastersRoutes = require('../modifiedMasters');
const resourcesRoutes = require('../resources');
const locationsRoutes = require('../locations');
const imagesRoutes = require('../images');
const agoraRoutes = require('../agora');

// Mount all v1 routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/skills', skillRoutes);
router.use('/exchanges', exchangeRoutes);
router.use('/payments', paymentRoutes);
router.use('/ai', aiRoutes);
router.use('/matchmaking', matchmakingRoutes);
router.use('/admin', adminRoutes);
router.use('/feature-flags', featureFlagRoutes);
router.use('/flags', featureFlagRoutes); // Alias
router.use('/liability', liabilityRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/angels', angelsRoutes);
router.use('/connect', connectRoutes);
router.use('/payouts', payoutsRoutes);
router.use('/onboarding', onboardingRoutes);
router.use('/documents', documentsRoutes);
router.use('/gurus', gurusRoutes);
router.use('/sessions', sessionsRoutes);
router.use('/modified-masters', modifiedMastersRoutes);
router.use('/resources', resourcesRoutes);
router.use('/locations', locationsRoutes);
router.use('/images', imagesRoutes);
router.use('/agora', agoraRoutes);

module.exports = router;
