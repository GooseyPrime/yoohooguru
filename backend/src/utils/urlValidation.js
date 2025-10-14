/**
 * Secure URL Validation Utility
 * 
 * Addresses validator.js vulnerability CVE-2024-XXXXX where isURL() uses '://' 
 * as delimiter while browsers use ':' as delimiter, leading to protocol/domain 
 * validation bypass and potential XSS/Open Redirect attacks.
 * 
 * This implementation:
 * 1. Uses browser-native URL parsing (aligns with browser behavior)
 * 2. Validates protocol strictly (no bypass via malformed protocols)
 * 3. Validates domain against allowlist
 * 4. Prevents protocol confusion attacks
 * 5. Prevents open redirect attacks
 */

const { logger } = require('./logger');

/**
 * Safe protocols allowed in URLs
 */
const SAFE_PROTOCOLS = ['http:', 'https:'];

/**
 * Default trusted domains for redirect validation
 */
const TRUSTED_DOMAINS = [
  'yoohoo.guru',
  'www.yoohoo.guru',
  'api.yoohoo.guru',
  'localhost'
];

/**
 * Validate URL with security checks
 * 
 * @param {string} urlString - URL string to validate
 * @param {Object} options - Validation options
 * @param {boolean} options.requireHttps - Require HTTPS protocol (default: false)
 * @param {string[]} options.allowedProtocols - List of allowed protocols (default: ['http:', 'https:'])
 * @param {string[]} options.allowedDomains - List of allowed domains for domain validation (optional)
 * @param {boolean} options.allowSubdomains - Allow subdomains of allowedDomains (default: true)
 * @param {boolean} options.allowWildcardSubdomains - Allow any subdomain (default: false)
 * @returns {Object} { valid: boolean, error?: string, parsedUrl?: URL }
 */
function validateUrl(urlString, options = {}) {
  const {
    requireHttps = false,
    allowedProtocols = SAFE_PROTOCOLS,
    allowedDomains = null,
    allowSubdomains = true,
    allowWildcardSubdomains = false
  } = options;

  // Basic type check
  if (!urlString || typeof urlString !== 'string') {
    return {
      valid: false,
      error: 'URL must be a non-empty string'
    };
  }

  // Trim whitespace
  urlString = urlString.trim();

  // Check for protocol confusion attacks
  // validator.js vulnerability: uses '://' as delimiter
  // Browser behavior: uses ':' as delimiter
  // Attack example: "javascript://example.com/%0Aalert(1)" bypasses validator.js but executes in browser
  const colonIndex = urlString.indexOf(':');
  if (colonIndex === -1) {
    return {
      valid: false,
      error: 'URL must include a protocol (http: or https:)'
    };
  }

  // Extract the protocol before first ':'
  const protocolPart = urlString.substring(0, colonIndex + 1).toLowerCase();
  
  // Validate protocol before parsing
  if (!allowedProtocols.includes(protocolPart)) {
    return {
      valid: false,
      error: `Protocol "${protocolPart}" is not allowed. Allowed protocols: ${allowedProtocols.join(', ')}`
    };
  }

  // Additional HTTPS check
  if (requireHttps && protocolPart !== 'https:') {
    return {
      valid: false,
      error: 'HTTPS protocol is required'
    };
  }

  // Parse URL using browser-native URL API
  // This aligns with actual browser behavior
  let parsedUrl;
  try {
    parsedUrl = new URL(urlString);
  } catch (error) {
    return {
      valid: false,
      error: 'Invalid URL format'
    };
  }

  // Verify protocol matches (defense in depth)
  if (!allowedProtocols.includes(parsedUrl.protocol)) {
    return {
      valid: false,
      error: `Protocol "${parsedUrl.protocol}" is not allowed`
    };
  }

  // Domain validation (if allowedDomains specified)
  if (allowedDomains && allowedDomains.length > 0) {
    const hostname = parsedUrl.hostname.toLowerCase();
    let domainValid = false;

    for (const allowedDomain of allowedDomains) {
      const allowedDomainLower = allowedDomain.toLowerCase();
      
      // Exact match
      if (hostname === allowedDomainLower) {
        domainValid = true;
        break;
      }

      // Subdomain match (if enabled)
      if (allowSubdomains) {
        // Check if hostname ends with .allowedDomain
        if (hostname.endsWith('.' + allowedDomainLower)) {
          domainValid = true;
          break;
        }
      }
    }

    // Wildcard subdomain support (for development)
    if (!domainValid && allowWildcardSubdomains && hostname.includes('.')) {
      const parts = hostname.split('.');
      if (parts.length >= 2) {
        domainValid = true;
      }
    }

    if (!domainValid) {
      return {
        valid: false,
        error: `Domain "${hostname}" is not in the allowed domains list`
      };
    }
  }

  // Check for suspicious patterns that could indicate attacks
  const suspiciousPatterns = [
    /@/, // @ symbol can be used to obscure the actual domain
    /\s/, // Whitespace in URLs
    /%00/, // Null byte
    /%0[ad]/i, // Newline/carriage return
    /javascript:/i, // JavaScript protocol (should be caught by protocol check)
    /data:/i, // Data URLs (should be caught by protocol check)
    /file:/i, // File protocol (should be caught by protocol check)
    /vbscript:/i // VBScript protocol
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(urlString)) {
      return {
        valid: false,
        error: 'URL contains suspicious patterns'
      };
    }
  }

  return {
    valid: true,
    parsedUrl
  };
}

/**
 * Validate redirect URL
 * 
 * Stricter validation for redirect URLs to prevent open redirect attacks
 * 
 * @param {string} urlString - Redirect URL to validate
 * @param {Object} options - Validation options
 * @param {string} options.baseUrl - Base URL for relative path validation
 * @param {string[]} options.trustedDomains - List of trusted domains (default: TRUSTED_DOMAINS)
 * @param {boolean} options.requireHttps - Require HTTPS (default: true in production)
 * @returns {Object} { valid: boolean, error?: string, sanitizedUrl?: string }
 */
function validateRedirectUrl(urlString, options = {}) {
  const {
    trustedDomains = TRUSTED_DOMAINS,
    requireHttps = process.env.NODE_ENV === 'production'
  } = options;

  if (!urlString || typeof urlString !== 'string') {
    return {
      valid: false,
      error: 'Redirect URL must be a non-empty string'
    };
  }

  urlString = urlString.trim();

  // Allow relative paths (start with /)
  if (urlString.startsWith('/')) {
    // Validate that it's a proper relative path (not protocol-relative //)
    if (urlString.startsWith('//')) {
      return {
        valid: false,
        error: 'Protocol-relative URLs are not allowed for redirects'
      };
    }
    // Check for spaces and other suspicious characters in path
    if (/\s/.test(urlString)) {
      return {
        valid: false,
        error: 'Whitespace not allowed in relative paths'
      };
    }
    if (urlString.match(/^\/[^/]/)) {
      return {
        valid: true,
        sanitizedUrl: urlString
      };
    }
    return {
      valid: false,
      error: 'Invalid relative path format'
    };
  }

  // For absolute URLs, validate against trusted domains
  const validation = validateUrl(urlString, {
    requireHttps,
    allowedProtocols: ['http:', 'https:'],
    allowedDomains: trustedDomains,
    allowSubdomains: true,
    allowWildcardSubdomains: false
  });

  if (!validation.valid) {
    return validation;
  }

  return {
    valid: true,
    sanitizedUrl: validation.parsedUrl.href
  };
}

/**
 * Validate resource URL (for user-submitted links)
 * 
 * More permissive than redirect validation but still secure
 * 
 * @param {string} urlString - Resource URL to validate
 * @param {Object} options - Validation options
 * @returns {Object} { valid: boolean, error?: string, parsedUrl?: URL }
 */
function validateResourceUrl(urlString, options = {}) {
  const {
    requireHttps = false
  } = options;

  // Allow any domain for resources (educational links, etc.)
  // But still validate protocol and format
  return validateUrl(urlString, {
    requireHttps,
    allowedProtocols: ['http:', 'https:'],
    allowedDomains: null, // No domain restriction for resources
    allowSubdomains: true,
    allowWildcardSubdomains: true
  });
}

/**
 * Sanitize URL by parsing and reconstructing
 * 
 * @param {string} urlString - URL to sanitize
 * @returns {string|null} Sanitized URL or null if invalid
 */
function sanitizeUrl(urlString) {
  const validation = validateUrl(urlString, {
    allowedProtocols: SAFE_PROTOCOLS
  });

  if (!validation.valid || !validation.parsedUrl) {
    logger.warn('URL sanitization failed', { url: urlString, error: validation.error });
    return null;
  }

  return validation.parsedUrl.href;
}

/**
 * Check if URL is safe for use
 * 
 * Quick boolean check for use in middleware/guards
 * 
 * @param {string} urlString - URL to check
 * @returns {boolean} True if URL is safe
 */
function isSafeUrl(urlString) {
  const validation = validateUrl(urlString, {
    allowedProtocols: SAFE_PROTOCOLS
  });
  return validation.valid;
}

module.exports = {
  validateUrl,
  validateRedirectUrl,
  validateResourceUrl,
  sanitizeUrl,
  isSafeUrl,
  SAFE_PROTOCOLS,
  TRUSTED_DOMAINS
};
