/**
 * Validation utilities for route parameters
 * Provides security validation to prevent SSRF and path traversal attacks
 */

/**
 * Validates a slug parameter to ensure it contains only safe characters.
 * Prevents SSRF and path traversal attacks by restricting to alphanumeric characters, hyphens, and underscores.
 * 
 * @param slug - The slug value to validate (from router.query or other sources)
 * @returns true if the slug is valid, false otherwise
 * 
 * @example
 * const isValid = isValidSlug(router.query.slug);
 * if (!isValid) {
 *   setError('Invalid blog post identifier');
 *   return;
 * }
 */
export function isValidSlug(slug: string | string[] | undefined): boolean {
  // Ensure slug is a string
  if (typeof slug !== 'string') {
    return false;
  }
  
  // Check for valid characters: alphanumeric, hyphens, and underscores only
  // This prevents path traversal (../) and SSRF attacks
  const slugPattern = /^[A-Za-z0-9\-_]+$/;
  return slugPattern.test(slug);
}

/**
 * Validates an ID parameter to ensure it contains only safe characters.
 * Prevents SSRF and path traversal attacks by restricting to alphanumeric characters, hyphens, and underscores.
 * 
 * @param id - The ID value to validate (from router.query or other sources)
 * @returns true if the ID is valid, false otherwise
 * 
 * @example
 * const isValid = isValidId(router.query.id);
 * if (!isValid) {
 *   setError('Invalid session identifier');
 *   return;
 * }
 */
export function isValidId(id: string | string[] | undefined): boolean {
  // ID validation follows the same rules as slug validation
  return isValidSlug(id);
}
