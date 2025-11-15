/**
 * Validation Utilities
 * Safe validation functions to prevent ReDoS and other security issues
 */

/**
 * Validate email address safely
 * Uses length check first to prevent ReDoS attacks
 * @param email - Email address to validate
 * @returns true if valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  // RFC 5321 maximum email length
  const MAX_EMAIL_LENGTH = 254;
  
  // Check length first to prevent ReDoS
  if (!email || email.length > MAX_EMAIL_LENGTH) {
    return false;
  }
  
  // Basic format check: must have @ and at least one . after @
  const atIndex = email.indexOf('@');
  if (atIndex === -1 || atIndex === 0 || atIndex === email.length - 1) {
    return false;
  }
  
  const domainPart = email.substring(atIndex + 1);
  const dotIndex = domainPart.indexOf('.');
  if (dotIndex === -1 || dotIndex === 0 || dotIndex === domainPart.length - 1) {
    return false;
  }
  
  // Check for invalid characters
  const validChars = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  // Limit regex execution time by checking length first
  if (email.length <= 320) { // Practical maximum
    return validChars.test(email);
  }
  
  return false;
}

/**
 * Validate string length
 * @param str - String to validate
 * @param min - Minimum length
 * @param max - Maximum length
 * @returns true if valid, false otherwise
 */
export function isValidLength(str: string, min: number, max: number): boolean {
  if (!str) return false;
  const length = str.length;
  return length >= min && length <= max;
}

/**
 * Sanitize string input
 * Removes potentially dangerous characters
 * @param str - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(str: string): string {
  if (!str) return '';
  
  // Remove null bytes and control characters
  return str
    .replace(/\0/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();
}

/**
 * Validate name (letters, spaces, hyphens, apostrophes only)
 * @param name - Name to validate
 * @returns true if valid, false otherwise
 */
export function isValidName(name: string): boolean {
  if (!name || name.length < 1 || name.length > 100) {
    return false;
  }
  
  // Allow letters, spaces, hyphens, apostrophes, and common international characters
  const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
  return nameRegex.test(name);
}

/**
 * Validate URL
 * @param url - URL to validate
 * @returns true if valid, false otherwise
 */
export function isValidUrl(url: string): boolean {
  if (!url || url.length > 2048) {
    return false;
  }
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}