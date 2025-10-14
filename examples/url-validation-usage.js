/**
 * URL Validation Usage Examples
 * 
 * This file demonstrates how to use the secure URL validation utilities
 * in various scenarios throughout the application.
 */

const {
  validateUrl,
  validateRedirectUrl,
  validateResourceUrl,
  sanitizeUrl,
  isSafeUrl
} = require('../backend/src/utils/urlValidation');

// ============================================================================
// Example 1: Validating User-Submitted Resource URLs
// ============================================================================

/**
 * When users submit educational resources, video links, or documentation URLs
 */
function handleResourceSubmission(req, res) {
  const { title, url, type } = req.body;

  // Validate the resource URL
  const validation = validateResourceUrl(url);
  
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid resource URL',
        details: validation.error
      }
    });
  }

  // Safe to store and use
  const resource = {
    title,
    url: validation.parsedUrl.href, // Use the parsed, normalized URL
    type
  };

  // Save to database...
  return res.json({
    success: true,
    data: resource
  });
}

// ============================================================================
// Example 2: Validating OAuth Callback Redirects
// ============================================================================

/**
 * After OAuth authentication, validate the redirect URL
 */
function handleOAuthCallback(req, res) {
  const { redirect_uri } = req.query;

  // Validate redirect against trusted domains
  const validation = validateRedirectUrl(redirect_uri, {
    trustedDomains: ['yoohoo.guru', 'www.yoohoo.guru', 'localhost'],
    requireHttps: process.env.NODE_ENV === 'production'
  });

  if (!validation.valid) {
    // Don't redirect to untrusted domains
    // Log the attempt and redirect to safe default
    console.warn('Blocked untrusted redirect:', {
      attempted: redirect_uri,
      error: validation.error
    });
    return res.redirect('/');
  }

  // Safe to redirect
  return res.redirect(validation.sanitizedUrl);
}

// ============================================================================
// Example 3: Validating Webhook URLs
// ============================================================================

/**
 * When users configure webhook endpoints
 */
function updateWebhookEndpoint(req, res) {
  const { webhookUrl } = req.body;

  // Validate webhook URL with stricter requirements
  const validation = validateUrl(webhookUrl, {
    requireHttps: true, // Webhooks should use HTTPS
    allowedProtocols: ['https:'], // Only HTTPS
    allowedDomains: null // Allow any domain for flexibility
  });

  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid webhook URL',
        details: validation.error
      }
    });
  }

  // Update user's webhook configuration...
  return res.json({
    success: true,
    webhookUrl: validation.parsedUrl.href
  });
}

// ============================================================================
// Example 4: Quick Safety Check in Middleware
// ============================================================================

/**
 * Middleware to validate URL parameters
 */
function validateUrlParam(paramName) {
  return (req, res, next) => {
    const url = req.query[paramName] || req.body[paramName];
    
    if (url && !isSafeUrl(url)) {
      return res.status(400).json({
        success: false,
        error: {
          message: `Invalid or unsafe URL in parameter: ${paramName}`
        }
      });
    }

    next();
  };
}

// Usage in routes:
// app.get('/api/preview', validateUrlParam('url'), handlePreview);

// ============================================================================
// Example 5: Sanitizing URLs Before Display
// ============================================================================

/**
 * Sanitize user-submitted URLs before displaying in UI
 */
function getResourcesForDisplay(resources) {
  return resources.map(resource => ({
    ...resource,
    url: sanitizeUrl(resource.url) || '#', // Fallback to # if invalid
    displayUrl: resource.url // Keep original for debugging
  }));
}

// ============================================================================
// Example 6: Environment-Specific Validation
// ============================================================================

/**
 * Different validation rules for development vs production
 */
function getValidationOptions() {
  if (process.env.NODE_ENV === 'production') {
    return {
      requireHttps: true,
      trustedDomains: [
        'yoohoo.guru',
        'www.yoohoo.guru',
        'api.yoohoo.guru'
      ]
    };
  } else {
    // More permissive in development
    return {
      requireHttps: false,
      trustedDomains: [
        'yoohoo.guru',
        'www.yoohoo.guru',
        'api.yoohoo.guru',
        'localhost',
        '127.0.0.1'
      ]
    };
  }
}

function validateRedirectWithEnv(url) {
  const options = getValidationOptions();
  return validateRedirectUrl(url, options);
}

// ============================================================================
// Example 7: Error Handling and User Feedback
// ============================================================================

/**
 * Provide user-friendly error messages based on validation errors
 */
function getUserFriendlyError(validationError) {
  const errorMap = {
    'Protocol "javascript:" is not allowed': 
      'JavaScript URLs are not allowed for security reasons',
    'Protocol "data:" is not allowed': 
      'Data URLs are not allowed for security reasons',
    'URL contains suspicious patterns': 
      'This URL contains suspicious characters and cannot be used',
    'Domain "': 
      'This domain is not in our list of allowed domains',
    'HTTPS protocol is required': 
      'Please use a secure HTTPS URL instead of HTTP',
    'Invalid URL format': 
      'This does not appear to be a valid URL. Please check the format.'
  };

  for (const [key, friendlyMessage] of Object.entries(errorMap)) {
    if (validationError.includes(key)) {
      return friendlyMessage;
    }
  }

  return 'Invalid URL. Please check and try again.';
}

// ============================================================================
// Anti-Patterns to Avoid
// ============================================================================

/**
 * ❌ DON'T DO THIS: Using basic URL constructor only
 */
// function unsafeValidation(url) {
//   try {
//     new URL(url);
//     return true; // VULNERABLE: Doesn't check protocol!
//   } catch {
//     return false;
//   }
// }

/**
 * ❌ DON'T DO THIS: Simple regex validation
 */
// function unsafeRegexValidation(url) {
//   // Vulnerable to protocol bypass
//   return /^https?:\/\/.+/.test(url);
// }

/**
 * ❌ DON'T DO THIS: Trusting user input directly
 */
// function unsafeRedirect(req, res) {
//   const { redirect } = req.query;
//   res.redirect(redirect); // VULNERABLE: Open redirect attack!
// }

/**
 * ✅ DO THIS INSTEAD
 */
function safeRedirect(req, res) {
  const { redirect } = req.query;
  
  const validation = validateRedirectUrl(redirect);
  
  if (validation.valid) {
    res.redirect(validation.sanitizedUrl);
  } else {
    res.redirect('/'); // Safe fallback
  }
}

// ============================================================================
// Testing Your URL Validation
// ============================================================================

/**
 * Example test cases to verify your implementation
 */
function runValidationTests() {
  const testCases = [
    // Should pass
    { url: 'https://example.com', shouldPass: true },
    { url: 'http://localhost:3000', shouldPass: true },
    
    // Should fail
    { url: 'javascript:alert(1)', shouldPass: false },
    { url: 'data:text/html,<script>alert(1)</script>', shouldPass: false },
    { url: 'https://trusted.com@evil.com', shouldPass: false }
  ];

  testCases.forEach(({ url, shouldPass }) => {
    const result = validateResourceUrl(url);
    const passed = result.valid === shouldPass;
    
    console.log(`${passed ? '✅' : '❌'} ${url}: ${result.valid ? 'Valid' : 'Invalid'}`);
    if (!result.valid) {
      console.log(`   Error: ${result.error}`);
    }
  });
}

// ============================================================================
// Export for use in your application
// ============================================================================

module.exports = {
  handleResourceSubmission,
  handleOAuthCallback,
  updateWebhookEndpoint,
  validateUrlParam,
  getResourcesForDisplay,
  validateRedirectWithEnv,
  getUserFriendlyError,
  safeRedirect,
  runValidationTests
};
