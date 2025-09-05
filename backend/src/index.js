require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const path = require('path');

const { initializeFirebase } = require('./config/firebase');
const { getConfig, getCorsOrigins, validateConfig } = require('./config/appConfig');
const { logger } = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const skillRoutes = require('./routes/skills');
const exchangeRoutes = require('./routes/exchanges');
const paymentRoutes = require('./routes/payments');
const aiRoutes = require('./routes/ai');
const adminRoutes = require('./routes/admin');
const featureFlagRoutes = require('./routes/featureFlags');
const liabilityRoutes = require('./routes/liability');
const webhookRoutes = require('./routes/webhooks');

const app = express();

// Load and validate configuration
const config = getConfig();
validateConfig(config);

const PORT = config.port;

// Initialize Firebase
initializeFirebase();

// Security middleware
app.use(helmet());

app.use(cors({
  origin: getCorsOrigins(config),
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: config.rateLimitMessage,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// 1) Webhook route MUST use raw parser to verify signatures
const stripeWebhooks = require('./routes/stripeWebhooks');
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// General middleware
app.use(compression());
app.use(cookieParser());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Raw body parsing for webhooks (must be before JSON parsing)
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));

app.use(express.json({ limit: config.expressJsonLimit }));
app.use(express.urlencoded({ extended: true, limit: config.expressUrlLimit }));

// Serve static files from frontend build
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
    version: config.apiVersion
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/exchanges', exchangeRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feature-flags', featureFlagRoutes);
app.use('/api/liability', liabilityRoutes);
app.use('/api/webhooks', webhookRoutes);

// 3) Connect routes (standard JSON)
const connectRoutes = require('./routes/connect');
app.use('/api/connect', connectRoutes);

// Payouts routes
const payoutsRoutes = require('./routes/payouts');
app.use('/api/payouts', payoutsRoutes);

// Connect Express Login routes
const connectExpressLogin = require('./routes/connectExpressLogin');
app.use('/api/connect', connectExpressLogin);

// Onboarding routes
const onboardingRoutes = require('./routes/onboarding');
app.use('/api/onboarding', onboardingRoutes);

// Documents routes
const documentsRoutes = require('./routes/documents');
app.use('/api/documents', documentsRoutes);

// API status endpoint (moved from root to avoid conflicts)
app.get('/api', (req, res) => {
  res.json({
    message: config.apiWelcomeMessage,
    version: config.apiVersion,
    description: config.apiDescription,
    documentation: '/api/docs',
    health: '/health'
  });
});

// Catch-all handler: send back React's index.html file for non-API routes
app.get('*', (req, res) => {
  // Only serve React app for non-API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      error: 'Route not found',
      message: `The requested API resource ${req.originalUrl} was not found on this server.`
    });
  }
  
  // Serve React app for all other routes
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  logger.info(`🎯 ${config.appBrandName} Backend server running on port ${PORT}`);
  logger.info(`Environment: ${config.nodeEnv}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;