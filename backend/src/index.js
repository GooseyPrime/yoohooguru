require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const csrf = require('lusca').csrf;

const { initializeFirebase, getFirestore } = require('./config/firebase');
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
const { requestIdMiddleware } = require('./middleware/requestId');
const { startCurationAgents, getCurationAgentStatus } = require('./agents/curationAgents');
const { startBackupAgent } = require('./agents/backupAgent');
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('./config/swagger');

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
const imagesRoutes = require('./routes/images');


const app = express();

// Disable x-powered-by header for security (prevents exposing Express.js)
app.disable('x-powered-by');

// Load and validate configuration
const config = getConfig();
validateConfig(config);

const PORT = config.port;

// Initialize Firebase
initializeFirebase();

// Validate SESSION_SECRET is set and secure
if (!process.env.SESSION_SECRET) {
  logger.error('SESSION_SECRET environment variable is not set. This is required for session management.');
  logger.error('Generate a secure secret with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
  process.exit(1);
}

// Reject insecure/default SESSION_SECRET values
const insecureSecretPatterns = [
  'your_secure_session_secret',
  'change_this',
  'changethis',
  'your_super_secret',
  'example',
  'default',
  'secret123',
  'password',
  'test'
];

const sessionSecret = process.env.SESSION_SECRET.toLowerCase();
const isInsecureSecret = insecureSecretPatterns.some(pattern =>
  sessionSecret.includes(pattern)
);

if (isInsecureSecret && (config.nodeEnv === 'production' || config.nodeEnv === 'staging')) {
  logger.error('❌ SECURITY ERROR: SESSION_SECRET contains insecure/default value');
  logger.error('Generate a secure secret with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
  process.exit(1);
}

// Warn if SESSION_SECRET is too short (less than 32 characters)
if (process.env.SESSION_SECRET.length < 32 && (config.nodeEnv === 'production' || config.nodeEnv === 'staging')) {
  logger.error('❌ SECURITY ERROR: SESSION_SECRET is too short (must be at least 32 characters)');
  logger.error('Generate a secure secret with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
  process.exit(1);
}

// Configure Express to trust proxy headers appropriately for the deployment environment
// This is required for express-rate-limit to work correctly when deployed behind a proxy
if (config.nodeEnv === 'production' || config.nodeEnv === 'staging') {
  // In production/staging (Railway), trust proxy headers to get real client IPs
  // Railway's load balancer sets X-Forwarded-For with the real client IP first
  app.set('trust proxy', true);
} else {
  // In development/test, do not trust proxy headers to avoid rate limiting errors
  app.set('trust proxy', false);
}

// --- Core Middleware Setup ---

// Generate CSP nonce for each request to enable strict CSP without 'unsafe-inline'
// This is a more secure alternative to 'unsafe-inline' for inline scripts
const crypto = require('crypto');
app.use((req, res, next) => {
  // Generate a unique nonce for this request
  res.locals.cspNonce = crypto.randomBytes(16).toString('base64');
  next();
});

// Security headers, CORS, and Compression
// Configure Content Security Policy with nonce-based inline script support
// Note: 'unsafe-inline' is maintained as fallback for browsers that don't support nonces
// In production with separately deployed frontend (Vercel), the frontend should implement
// its own CSP with nonces. This CSP primarily protects the API when SERVE_FRONTEND=true
app.use((req, res, next) => {
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        // Use nonce for inline scripts instead of 'unsafe-inline' where possible
        // Note: 'unsafe-inline' is ignored by browsers that support nonces
        "script-src": [
          "'self'",
          `'nonce-${res.locals.cspNonce}'`,
          "https://js.stripe.com",
          "https://apis.google.com",
          "https://www.google.com",
          "https://gstatic.com",
          "https://accounts.google.com",
          "https://www.googletagmanager.com",
          "https://www.google-analytics.com",
          "'unsafe-inline'" // Fallback for browsers that don't support nonces
        ],
        "script-src-elem": [
          "'self'",
          `'nonce-${res.locals.cspNonce}'`,
          "https://js.stripe.com",
          "https://apis.google.com",
          "https://www.google.com",
          "https://gstatic.com",
          "https://accounts.google.com",
          "https://www.googletagmanager.com",
          "https://www.google-analytics.com",
          "'unsafe-inline'" // Fallback for browsers that don't support nonces
        ],
        "frame-src": ["'self'", "https://js.stripe.com", "https://accounts.google.com", "https://*.firebaseapp.com", "https://www.google.com"],
        "connect-src": ["'self'", "https://api.stripe.com", "https://accounts.google.com", "https://www.googleapis.com", "https://identitytoolkit.googleapis.com", "https://securetoken.googleapis.com", "https://oauth2.googleapis.com", "https://api.unsplash.com", "https://images.unsplash.com", "https://api.bigdatacloud.net", "https://api-bdc.io", "https://www.google-analytics.com", "https://analytics.google.com", "https://stats.g.doubleclick.net"],
      },
    },
    // Add missing security headers
    crossOriginEmbedderPolicy: false, // Allow embedding for Stripe iframes
    noSniff: true, // Add X-Content-Type-Options: nosniff
  })(req, res, next);
});
// Configure CORS with proper origin validation
const corsOrigins = getCorsOrigins(config);
const corsOptions = {
  origin: (origin, callback) => {
    // Handle undefined origin (can occur for same-origin requests or server-side requests)
    if (!origin) {
      return callback(null, true);
    }

    // If corsOrigins is a function, delegate to it
    if (typeof corsOrigins === 'function') {
      return corsOrigins(origin, callback);
    }

    // If corsOrigins is an array or string, check if origin is allowed
    if (Array.isArray(corsOrigins)) {
      if (corsOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    }

    if (typeof corsOrigins === 'string') {
      if (corsOrigins === origin) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    }

    // Default: disallow
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};

app.use(cors(corsOptions));

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

// Session middleware (required for lusca CSRF protection)
// Validate SESSION_SECRET is set
if (!process.env.SESSION_SECRET) {
  logger.error('SESSION_SECRET environment variable is not set');
  throw new Error('SESSION_SECRET is required for session management and CSRF protection. Please set it in your .env file.');
}

// Configure session store based on environment
// In production, use Firestore to avoid memory leaks and support horizontal scaling
// In development/test, use the default MemoryStore for simplicity
let sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.nodeEnv === 'production', // Use secure cookies in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
};

if (config.nodeEnv === 'production' || config.nodeEnv === 'staging') {
  // Use Firestore session store in production/staging to prevent memory leaks
  const FirestoreStore = require('firestore-store')(session);
  const database = getFirestore();

  sessionConfig.store = new FirestoreStore({
    database: database,
    collection: 'sessions' // Store sessions in a dedicated Firestore collection
  });

  logger.info('✅ Session store: Using Firestore for production-ready session management');
} else {
  // Development/test environment - using MemoryStore with warnings
  logger.info('ℹ️  Session store: Using MemoryStore for development/testing');
  logger.warn('⚠️  WARNING: MemoryStore is not designed for production use!');
  logger.warn('⚠️  - It will leak memory under most conditions');
  logger.warn('⚠️  - It does not scale past a single process');
  logger.warn('⚠️  - It is meant for development and testing only');

  // Set up cleanup interval for MemoryStore to prevent memory leaks in development
  // This is a basic cleanup mechanism - for production, always use Firestore
  const sessionCleanupInterval = setInterval(() => {
    // In development, log a reminder about memory cleanup
    logger.debug('💾 MemoryStore session cleanup check (development only)');
  }, 60 * 60 * 1000); // Every hour

  // Clear interval on shutdown to prevent memory leaks
  process.on('SIGTERM', () => {
    clearInterval(sessionCleanupInterval);
  });

  process.on('SIGINT', () => {
    clearInterval(sessionCleanupInterval);
  });
}

app.use(session(sessionConfig));

// --- Webhook Routes (MUST be before CSRF to avoid token validation) ---

// Stripe webhook route MUST:
// 1. Come BEFORE CSRF middleware (webhooks don't have CSRF tokens)
// 2. Use raw body parser to verify Stripe signatures
// 3. Come BEFORE the general express.json() parser
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// CSRF protection (disabled in test environment to simplify testing)
// Skip CSRF validation for webhook endpoints (they use signature verification instead)
if (config.nodeEnv !== 'test') {
  app.use((req, res, next) => {
    // Skip CSRF for webhook routes
    if (req.path.startsWith('/api/webhooks/')) {
      return next();
    }
    // Apply CSRF protection to all other routes
    return csrf()(req, res, next);
  });
}

// Rate limiting for API routes
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: config.rateLimitMessage,
  standardHeaders: true,
  legacyHeaders: false,
  // Remove custom keyGenerator to use the default IPv6-compatible one
});
app.use('/api/', limiter);

// Request ID tracking middleware (must come early for comprehensive tracking)
app.use(requestIdMiddleware);

// Request logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Subdomain detection middleware (must come before routes)
app.use(subdomainHandler);

// --- Body Parsers ---

// General JSON and URL-encoded parsers for all other routes
app.use(express.json({ limit: config.expressJsonLimit }));
app.use(express.urlencoded({ extended: true, limit: config.expressUrlLimit }));

// Handle body parser errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    logger.warn('Malformed request body', {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      error: err.message
    });
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid request body'
      }
    });
  }
  next(err);
});

// --- Static File Serving ---

// Conditionally serve static files from the frontend build directory
// Only when SERVE_FRONTEND is true (for local development or monolithic deployment)
const fs = require('fs');
const frontendDistPath = config.serveFrontend
  ? path.join(__dirname, '../../frontend/dist')
  : null;

if (config.serveFrontend) {
  // Additional safety check: verify frontend files exist before serving
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

// Health check endpoint (enhanced for better observability)
app.get('/health', async (req, res) => {
  try {
    const agentStatus = getCurationAgentStatus();
    const firestore = getFirestore();

    // Check Firestore connection
    let firestoreStatus = 'unknown';
    try {
      await firestore.collection('_health').doc('check').set({
        timestamp: new Date().toISOString()
      }, { merge: true });
      firestoreStatus = 'connected';
    } catch (firestoreError) {
      logger.error('Firestore health check failed:', firestoreError);
      firestoreStatus = 'error';
    }

    // Memory usage
    const memoryUsage = process.memoryUsage();
    const memoryUsageMB = {
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      external: Math.round(memoryUsage.external / 1024 / 1024)
    };

    // System info
    const uptimeSeconds = process.uptime();
    const uptimeFormatted = `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m ${Math.floor(uptimeSeconds % 60)}s`;

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: Math.floor(uptimeSeconds),
        formatted: uptimeFormatted
      },
      environment: config.nodeEnv,
      version: config.apiVersion || '1.0.0',
      services: {
        api: 'operational',
        firestore: firestoreStatus,
        curationAgents: agentStatus
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        memory: memoryUsageMB,
        pid: process.pid
      },
      features: {
        apiVersioning: true,
        requestIdTracking: true,
        csrfProtection: config.nodeEnv !== 'test'
      }
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

// Swagger API documentation
// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'YoohooGuru API Documentation',
  customCss: '.swagger-ui .topbar { display: none }',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true
  }
}));

// OpenAPI JSON spec endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the API and its dependencies
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 */

// API v1 routes (versioned)
const v1Routes = require('./routes/v1');
app.use('/api/v1', v1Routes);

// Legacy API routes (for backwards compatibility) - redirect to v1
// These will be maintained for backward compatibility but /api/v1/* is preferred
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
app.use('/api/images', imagesRoutes);

// Hero Guru's routes (formerly Modified Masters) - conditionally mounted
if (config.featureHeroGurus || config.featureModifiedMasters) {
  app.use('/api/sessions', sessionsRoutes);
  // New primary endpoint
  app.use('/api/heroes', modifiedMastersRoutes);
  // Legacy endpoint for backwards compatibility
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

    // Start backup agent
    try {
      startBackupAgent();
    } catch (error) {
      logger.error('Failed to start backup agent:', {
        message: error.message,
        stack: error.stack,
        environment: config.nodeEnv
      });

      if (config.nodeEnv === 'production' && process.env.FAIL_ON_AGENT_ERROR !== 'true') {
        logger.warn('⚠️ Server continuing despite backup agent failures (production mode)');
      }
    }
  });
}

module.exports = app;
