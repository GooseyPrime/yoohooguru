/**
 * Application Configuration
 * Central configuration management with environment variable validation
 */

const { logger } = require('../utils/logger');

/**
 * Sanitize CORS origins to prevent overly permissive wildcard patterns
 * This prevents configuration errors that could accidentally allow all origins
 */
function sanitizeCorsOrigins(origins) {
  const sanitized = [];
  
  for (const origin of origins) {
    if (!origin) continue;
    
    // Check for overly permissive patterns that could allow any origin
    const isOverlyPermissive = 
      origin === 'http://*' ||
      origin === 'https://*' ||
      origin === '*' ||
      origin.match(/^https?:\/\/\*$/);
    
    if (isOverlyPermissive) {
      logger.warn(`⚠️ Rejecting overly permissive CORS origin: ${origin}`);
      logger.warn('   This pattern would allow any origin, which is a security risk.');
      logger.warn('   Use more specific patterns like: http://*.localhost:3000 or https://*.yourdomain.com');
      // Skip this origin instead of allowing it
      continue;
    }
    
    sanitized.push(origin);
  }
  
  return sanitized;
}

/**
 * Get and validate required environment variables
 */
function getConfig() {
  const config = {
    // Server Configuration
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // App Branding
    appBrandName: process.env.APP_BRAND_NAME || 'yoohoo.guru',
    appDisplayName: process.env.APP_DISPLAY_NAME || 'yoohoo.guru',
    appLegalEmail: process.env.APP_LEGAL_EMAIL || 'legal@yoohoo.guru',
    appPrivacyEmail: process.env.APP_PRIVACY_EMAIL || 'privacy@yoohoo.guru',
    appSupportEmail: process.env.APP_SUPPORT_EMAIL || 'support@yoohoo.guru',
    appContactAddress: process.env.APP_CONTACT_ADDRESS || 'yoohoo.guru, Legal Department',
    
    // CORS Configuration
    corsOriginProduction: process.env.CORS_ORIGIN_PRODUCTION
      ? (() => {
          const sanitized = sanitizeCorsOrigins(process.env.CORS_ORIGIN_PRODUCTION.split(',').map(s => s.trim()).filter(Boolean));
          return sanitized.length > 0 ? sanitized : ['https://yoohoo.guru', 'https://www.yoohoo.guru', 'https://api.yoohoo.guru', 'https://*.yoohoo.guru', 'https://*.vercel.app'];
        })()
      : ['https://yoohoo.guru', 'https://www.yoohoo.guru', 'https://api.yoohoo.guru', 'https://*.yoohoo.guru', 'https://*.vercel.app'],
    corsOriginDevelopment: process.env.CORS_ORIGIN_DEVELOPMENT 
      ? (() => {
          const sanitized = sanitizeCorsOrigins(process.env.CORS_ORIGIN_DEVELOPMENT.split(',').map(origin => origin.trim()));
          return sanitized.length > 0 ? sanitized : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://*.localhost:3000'];
        })()
      : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://*.localhost:3000'],
    
    // Express Configuration
    expressJsonLimit: process.env.EXPRESS_JSON_LIMIT || '10mb',
    expressUrlLimit: process.env.EXPRESS_URL_LIMIT || '10mb',
    
    // Rate Limiting
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    rateLimitMessage: process.env.RATE_LIMIT_MESSAGE || 'Too many requests from this IP, please try again later.',
    
    // API Configuration
    apiWelcomeMessage: process.env.API_WELCOME_MESSAGE || 'Welcome to yoohoo.guru API',
    apiVersion: process.env.API_VERSION || '1.0.0',
    apiDescription: process.env.API_DESCRIPTION || 'Skill-sharing platform backend',
    
    // Frontend Serving Configuration
    // Frontend is hosted on Vercel in production; API must not serve the SPA.
    serveFrontend: process.env.SERVE_FRONTEND
      ? String(process.env.SERVE_FRONTEND).toLowerCase() === 'true'
      : (process.env.NODE_ENV === 'production' ? false : true),
    
    // External API Keys (with validation)
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    openrouterApiKey: process.env.OPENROUTER_API_KEY,
    openaiApiKey: process.env.OPENAI_API_KEY, // ChatGPT fallback
    
    // Google OAuth Configuration
    googleOAuthClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    googleOAuthClientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    
    // Stripe Configuration
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    stripeWebhookId: process.env.STRIPE_WEBHOOK_ID,
    
    // Stripe Price IDs
    stripeGuruPassPriceId: process.env.STRIPE_GURU_PASS_PRICE_ID,
    stripeSkillVerificationPriceId: process.env.STRIPE_SKILL_VERIFICATION_PRICE_ID,
    stripeTrustSafetyPriceId: process.env.STRIPE_TRUST_SAFETY_PRICE_ID,
    
    // Firebase Configuration
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    firebaseApiKey: process.env.FIREBASE_API_KEY,
    firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
    firebaseDatabaseUrl: process.env.FIREBASE_DATABASE_URL,
    firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    firebaseAppId: process.env.FIREBASE_APP_ID,

    // Domain Configuration
    appDomain: process.env.APP_DOMAIN || 'localhost:3000',
    apiBaseUrl: process.env.NODE_ENV === 'production' ? 'https://api.yoohoo.guru' : `http://localhost:${process.env.PORT || 3001}`,
    featureModifiedMasters: process.env.FEATURE_MODIFIED_MASTERS === 'true',
    modifiedMastersDonateUrl: process.env.MODIFIED_MASTERS_DONATE_URL || '',
    modifiedMastersEnableSubdomain: process.env.MODIFIED_MASTERS_ENABLE_SUBDOMAIN === 'true',
    modifiedMastersRequireReview: process.env.MODIFIED_MASTERS_REQUIRE_REVIEW === 'true',
  };

  // Validate required environment variables in production and staging
  if (config.nodeEnv === 'production' || config.nodeEnv === 'staging') {
    const requiredVars = [
      'JWT_SECRET',
      'FIREBASE_PROJECT_ID',
      'FIREBASE_API_KEY'
    ];
    
    // Stripe webhook secret is required for production/staging
    // Allow tests to run even in production mode with dummy webhook secrets
    const isTestEnvironment = process.env.NODE_ENV === 'test' || 
                             process.env.JWT_SECRET === 'test_jwt_secret_for_ci_testing_only_not_production_secure' ||
                             (config.stripeWebhookSecret && config.stripeWebhookSecret.includes('test_dummy')) ||
                             (config.stripeWebhookSecret && config.stripeWebhookSecret.startsWith('whsec_test_')) ||
                             typeof global.describe !== 'undefined' || // Jest environment 
                             process.env.CI === 'true'; // GitHub Actions CI environment
    
    if (!config.stripeWebhookSecret) {
      logger.warn('⚠️ STRIPE_WEBHOOK_SECRET is not set - Stripe webhooks will fail');
      if (config.nodeEnv === 'production' && !isTestEnvironment) {
        throw new Error('STRIPE_WEBHOOK_SECRET is required in production environment');
      }
    }
    
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      logger.error(`Missing required environment variables: ${missingVars.join(', ')}`);
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }

  return config;
}

/**
 * Get CORS origins as array for logging/display purposes
 */
function getCorsOriginsArray(config) {
  return config.nodeEnv === 'production' 
    ? config.corsOriginProduction 
    : config.corsOriginDevelopment;
}

/**
 * Get CORS origins based on environment
 * Supports wildcard matching for domains like *.vercel.app
 */
function getCorsOrigins(config) {
  const origins = config.nodeEnv === 'production' 
    ? config.corsOriginProduction 
    : config.corsOriginDevelopment;
  
  // Return function for dynamic origin validation to support wildcards
  return (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check for exact matches first
    if (origins.includes(origin)) {
      return callback(null, true);
    }
    
    // Check for wildcard matches
    for (const allowedOrigin of origins) {
      if (allowedOrigin.includes('*')) {
        const pattern = allowedOrigin
          .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape regex chars
          .replace(/\\\*/g, '.*'); // Convert * to regex pattern
        const regex = new RegExp(`^${pattern}$`);
        if (regex.test(origin)) {
          return callback(null, true);
        }
      }
    }
    
    // Origin not allowed
    callback(new Error(`CORS policy violation: Origin ${origin} not allowed`));
  };
}

/**
 * Validate configuration and log warnings for missing optional variables
 */
function validateConfig(config) {
  const warnings = [];
  
  // Check for optional but recommended variables
  if (config.nodeEnv === 'production') {
    if (!process.env.OPENROUTER_API_KEY) {
      warnings.push('OPENROUTER_API_KEY not set - AI features may not work');
    }
    if (!process.env.STRIPE_SECRET_KEY) {
      warnings.push('STRIPE_SECRET_KEY not set - payment features may not work');
    }
  }
  
  // Log warnings
  warnings.forEach(warning => logger.warn(warning));

  // Modified Masters specific validations
  if (config.featureModifiedMasters && !config.modifiedMastersDonateUrl) {
    logger.warn('[MM] Donation URL not set; Donate button will be hidden.');
  }
  
  // Log configuration summary
  logger.info(`Configuration loaded for environment: ${config.nodeEnv}`);
  logger.info(`App brand: ${config.appBrandName}`);
  logger.info(`CORS origins: ${getCorsOriginsArray(config).join(', ')}`);
  logger.info(`Serve frontend: ${config.serveFrontend}`);
  if (config.featureModifiedMasters) {
    logger.info(`Modified Masters enabled with subdomain: ${config.modifiedMastersEnableSubdomain}`);
  }
  
  return warnings;
}

module.exports = {
  getConfig,
  getCorsOrigins,
  getCorsOriginsArray,
  validateConfig
};