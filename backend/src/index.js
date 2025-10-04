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
const csrf = require('lusca').csrf;

const { initializeFirebase } = require('./config/firebase');
const { getConfig, getCorsOrigins, validateConfig } = require('./config/appConfig');

// Rate limiter for frontend catch-all route (serving index.html)
const frontendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
const { logger } = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const { subdomainHandler } = require('./middleware/subdomainHandler');
const { startCurationAgents, getCurationAgentStatus } = require('./agents/curationAgents');

// Route Imports
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const skillRoutes = require('./routes/skills');
const exchangeRoutes = require('./routes/exchanges');
const paymentRoutes = require('./routes/payments');
const aiRoutes = require('./routes/ai');
const matchmakingRoutes = require('./routes/matchmaking');
const adminRoutes = require('./routes/admin');
const featureFlagRoutes = require('./routes/featureFlags');
const liabilityRoutes = require('./routes/liability');
const webhookRoutes = require('./routes/webhooks');
const stripeWebhooks = require('./routes/stripeWebhooks');
const angelsRoutes = require('./routes/angels');
const connectRoutes = require('./routes/connect');
const payoutsRoutes = require('./routes/payouts');
const onboardingRoutes = require('./routes/onboarding');
const documentsRoutes = require('./routes/documents');
const gurusRoutes = require('./routes/gurus');
const sessionsRoutes = require('./routes/sessions');
const modifiedMastersRoutes = require('./routes/modifiedMasters');
const resourcesRoutes = require('./routes/resources');
const locationsRoutes = require('./routes/locations');


const app = express();

// Load and validate configuration
const config = getConfig();
validateConfig(config);

const PORT = config.port;

// Initialize Firebase
initializeFirebase();

// Configure Express to trust proxy headers appropriately for the deployment environment
// This is required for express-rate-limit to work correctly when deployed behind a proxy
if (config.nodeEnv === 'production' || config.nodeEnv === 'staging') {
  // In production/staging (Railway), trust proxy headers to get real client IPs
  // Railway's load balancer sets X-Forwarded-For with the real client IP first
  app.set('trust proxy', true);
} else {
  // In development, we can trust all proxies since we control the environment
  app.set('trust proxy', true);
}

// --- Core Middleware Setup ---

// Security headers, CORS, and Compression
// FIX: Configure Content Security Policy to allow scripts from Stripe and Google
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "https://js.stripe.com", "https://apis.google.com", "https://www.google.com", "https://gstatic.com", "https://accounts.google.com", "https://www.googletagmanager.com", "https://www.google-analytics.com", "'unsafe-inline'"],
      "script-src-elem": ["'self'", "https://js.stripe.com", "https://apis.google.com", "https://www.google.com", "https://gstatic.com", "https://accounts.google.com", "https://www.googletagmanager.com", "https://www.google-analytics.com", "'unsafe-inline'"],
      "frame-src": ["'self'", "https://js.stripe.com", "https://accounts.google.com", "https://*.firebaseapp.com", "https://www.google.com"],
      "connect-src": ["'self'", "https://api.stripe.com", "https://accounts.google.com", "https://www.googleapis.com", "https://identitytoolkit.googleapis.com", "https://securetoken.googleapis.com", "https://oauth2.googleapis.com", "https://api.unsplash.com", "https://images.unsplash.com", "https://api.bigdatacloud.net", "https://www.google-analytics.com", "https://analytics.google.com"],
    },
  },
  // Add missing security headers
  crossOriginEmbedderPolicy: false, // Allow embedding for Stripe iframes
  noSniff: true, // Add X-Content-Type-Options: nosniff
}));
app.use(cors({
  origin: getCorsOrigins(config),
  credentials: true
}));

// Additional security headers for enhanced protection
app.use((req, res, next) => {
  // Prevent clickjacking attacks
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Enable XSS protection in browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Control referrer information
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions policy for enhanced privacy
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  next();
});

app.use(compression());
app.use(cookieParser());
app.use(csrf());

// Rate limiting for API routes
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: config.rateLimitMessage,
  standardHeaders: true,
  legacyHeaders: false,
  // FIX: Configure trust proxy settings for Railway deployment
  trustProxy: config.nodeEnv === 'production' ? 1 : false, // Only trust first proxy in production
  keyGenerator: (req) => {
    // Use X-Forwarded-For in production (Railway), real IP in development
    if (config.nodeEnv === 'production') {
      return req.ip || req.connection.remoteAddress || 'unknown';
    } else {
      return req.connection.remoteAddress || 'localhost';
    }
  }
});
app.use('/api/', limiter);

// Request logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Subdomain detection middleware (must come before routes)
app.use(subdomainHandler);

// --- Body Parsers ---

// Stripe webhook route MUST use a raw parser to verify signatures.
// It is critical this comes BEFORE the general express.json() parser.
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// General JSON and URL-encoded parsers for all other routes
app.use(express.json({ limit: config.expressJsonLimit }));
app.use(express.urlencoded({ extended: true, limit: config.expressUrlLimit }));

// --- Static File Serving ---

// Conditionally serve static files from the frontend build directory
// Only when SERVE_FRONTEND is true (for local development or monolithic deployment)
let frontendDistPath;
if (config.serveFrontend) {
  frontendDistPath = path.join(__dirname, '../../frontend/dist');
  
  // Additional safety check: verify frontend files exist before serving
  const fs = require('fs');
  if (fs.existsSync(frontendDistPath)) {
    // Configure static file serving with proper cache headers
    const staticOptions = {
      maxAge: '1y', // Cache static assets for 1 year
      etag: true,
      lastModified: true,
      setHeaders: (res, path) => {
        // Remove problematic must-revalidate directive
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        // Add security headers
        res.setHeader('X-Content-Type-Options', 'nosniff');
        
        // Special handling for different file types
        if (path.endsWith('.html')) {
          // HTML files should have shorter cache times
          res.setHeader('Cache-Control', 'public, max-age=3600');
        } else if (path.includes('/fonts/')) {
          // Font files can be cached longer
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      }
    };
    
    app.use(express.static(frontendDistPath, staticOptions));
    logger.info(`🎨 Frontend static files will be served from: ${frontendDistPath}`);
  } else {
    logger.warn(`🚨 Frontend serving enabled but dist directory not found: ${frontendDistPath}`);
    logger.warn('🚨 Frontend serving will be disabled for this session');
    config.serveFrontend = false; // Disable serving to prevent errors
  }
} else {
  logger.info('🎨 Frontend serving disabled - frontend deployed separately (Vercel)');
  if (config.nodeEnv === 'production') {
    logger.info('✅ Production mode: API-only server configuration active');
  }
}

// --- Application Routes ---

// FIX: Handle favicon.ico requests to prevent 502 errors
app.get('/favicon.ico', (req, res) => {
  // Return a minimal 1x1 transparent GIF as favicon
  const transparentGif = Buffer.from([
    0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00,
    0x01, 0x00, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00,
    0xff, 0xff, 0xff, 0x21, 0xf9, 0x04, 0x01, 0x00,
    0x00, 0x00, 0x00, 0x2c, 0x00, 0x00, 0x00, 0x00,
    0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x04,
    0x01, 0x00, 0x3b
  ]);
  
  res.setHeader('Content-Type', 'image/gif');
  res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
  res.send(transparentGif);
});

// Health check endpoint
app.get('/health', (req, res) => {
  try {
    const agentStatus = getCurationAgentStatus();
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.nodeEnv,
      version: config.apiVersion,
      curationAgents: agentStatus
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
      error: 'Health check failed',
      message: error.message
    });
  }
});

// Main API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/exchanges', exchangeRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/matchmaking', matchmakingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feature-flags', featureFlagRoutes);
app.use('/api/flags', featureFlagRoutes); // Alias for feature-flags
app.use('/api/liability', liabilityRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/angels', angelsRoutes);
app.use('/api/connect', connectRoutes);
app.use('/api/payouts', payoutsRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/gurus', gurusRoutes);
app.use('/api/badges', require('./routes/badges'));
app.use('/api/compliance', require('./routes/compliance'));
app.use('/api/insurance', require('./routes/insurance'));
app.use('/api/demo', require('./routes/demo'));
app.use('/api/resources', resourcesRoutes);
app.use('/api', locationsRoutes);

// Modified Masters routes (conditionally mounted)
if (config.featureModifiedMasters) {
  app.use('/api/sessions', sessionsRoutes);
  app.use('/api/modified-masters', modifiedMastersRoutes);
}

// Non-API guru routes (for frontend direct access)
// Mount guru routes at both /api/gurus and /gurus for frontend compatibility
app.use('/gurus', gurusRoutes);

// Non-API auth routes (for frontend direct access)
// Mount auth routes at both /api/auth and /auth for frontend compatibility
app.use('/auth', authRoutes);

// API status endpoint
app.get('/api', (req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
  res.json({
    message: config.apiWelcomeMessage,
    version: config.apiVersion,
    description: config.apiDescription,
    documentation: '/api/docs',
    health: '/health'
  });
});

// --- Catch-all and Error Handling ---

// FIX: Catch-all for API routes. If a request starts with /api/ and hasn't been handled, it's a 404.
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API Route Not Found',
    message: `The requested API resource ${req.originalUrl} was not found on this server.`
  });
});

// FIX: Catch-all for frontend routes. Only serves the React app when frontend serving is enabled.
if (config.serveFrontend) {
  app.get('*', frontendLimiter, (req, res) => {
    try {
      res.sendFile(path.join(frontendDistPath, 'index.html'));
    } catch (error) {
      logger.error(`Error serving frontend file: ${error.message}`);
      res.status(404).json({
        error: 'Frontend Not Available',
        message: 'Frontend files are not available. Please ensure the frontend is built or deploy it separately.'
      });
    }
  });
} else {
  // When frontend is deployed separately, return API info for non-API routes
  app.get('*', (req, res) => {
    res.setHeader('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    res.status(404).json({
      error: 'Route Not Found',
      message: 'This is an API-only server. Frontend is deployed separately.',
      api: {
        version: config.apiVersion,
        baseUrl: '/api',
        health: '/health',
        documentation: 'https://github.com/GooseyPrime/yoohooguru'
      }
    });
  });
}

// Global error handling middleware (must be the VERY LAST app.use call)
app.use(errorHandler);

// --- Graceful Shutdown ---
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// --- Server Initialization ---
if (require.main === module) {
  // FIX: Bind to 0.0.0.0 (all interfaces) for Railway compatibility
  // Railway requires servers to bind to 0.0.0.0, not localhost/127.0.0.1
  const HOST = process.env.HOST || '0.0.0.0';
  
  app.listen(PORT, HOST, () => {
    logger.info(`🎯 ${config.appBrandName} Backend server running on ${HOST}:${PORT}`);
    logger.info(`Environment: ${config.nodeEnv}`);
    logger.info(`Health check: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/health`);
    
    // Start curation agents after server is running
    try {
      startCurationAgents();
    } catch (error) {
      logger.error('Failed to start curation agents:', {
        message: error.message,
        stack: error.stack,
        environment: config.nodeEnv
      });
      
      // In production, log this as a critical issue but don't crash the server
      // unless FAIL_ON_AGENT_ERROR is explicitly set
      if (config.nodeEnv === 'production' && process.env.FAIL_ON_AGENT_ERROR !== 'true') {
        logger.warn('⚠️ Server continuing despite curation agent failures (production mode)');
      }
    }
  });
}

module.exports = app;
