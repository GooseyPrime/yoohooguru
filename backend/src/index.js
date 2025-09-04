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

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Firebase
initializeFirebase();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yoohoo.guru', 'https://www.yoohoo.guru']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// General middleware
app.use(compression());
app.use(cookieParser());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from frontend build
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
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

// Onboarding routes
const onboardingRoutes = require('./routes/onboarding');
app.use('/api/onboarding', onboardingRoutes);

// Documents routes
const documentsRoutes = require('./routes/documents');
app.use('/api/documents', documentsRoutes);

// API status endpoint (moved from root to avoid conflicts)
app.get('/api', (req, res) => {
  res.json({
    message: '🎯 Welcome to yoohoo.guru API',
    version: '1.0.0',
    description: 'Skill-sharing platform backend',
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
  logger.info(`🎯 yoohoo.guru Backend server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;