/**
 * Accessibility Utilities
 * Helper functions for improving accessibility throughout the application
 */

/**
 * Generate a unique ID for form elements
 * Useful for connecting labels with inputs
 */
export function generateId(prefix: string = 'element'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Announce message to screen readers
 * Uses ARIA live regions to announce dynamic content changes
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Check if element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  if (element.tabIndex < 0) return false;
  if (element.hasAttribute('disabled')) return false;
  if (element.getAttribute('aria-hidden') === 'true') return false;

  const tagName = element.tagName.toLowerCase();
  const focusableTags = ['a', 'button', 'input', 'select', 'textarea'];

  return focusableTags.includes(tagName) || element.tabIndex >= 0;
}

/**
 * Trap focus within a container (useful for modals)
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Get contrast ratio between two colors
 * Useful for checking WCAG compliance
 */
export function getContrastRatio(color1: string, color2: string): number {
  const getLuminance = (color: string): number => {
    // Simple RGB extraction (works for hex colors)
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const [rs, gs, bs] = [r, g, b].map((c) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA standards
 */
export function meetsWCAGAA(foreground: string, background: string, isLargeText: boolean = false): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Check if contrast ratio meets WCAG AAA standards
 */
export function meetsWCAGAAA(foreground: string, background: string, isLargeText: boolean = false): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 4.5 : ratio >= 7;
}

/**
 * Format file size for screen readers
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Math.round(bytes / Math.pow(k, i))} ${sizes[i]}`;
}

/**
 * Format date for screen readers
 */
export function formatDateForScreenReader(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Create visually hidden text (for screen readers only)
 */
export function createScreenReaderText(text: string): HTMLSpanElement {
  const span = document.createElement('span');
  span.className = 'sr-only';
  span.textContent = text;
  return span;
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Check if user prefers dark mode
 */
export function prefersDarkMode(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Validate ARIA attributes
 */
export function validateARIA(element: HTMLElement): string[] {
  const errors: string[] = [];

  // Check for required ARIA attributes
  const role = element.getAttribute('role');
  if (role) {
    // Check for required attributes based on role
    const requiredAttrs: Record<string, string[]> = {
      button: [],
      checkbox: ['aria-checked'],
      radio: ['aria-checked'],
      slider: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
      progressbar: ['aria-valuenow', 'aria-valuemin', 'aria-valuemax'],
    };

    const required = requiredAttrs[role];
    if (required) {
      required.forEach((attr) => {
        if (!element.hasAttribute(attr)) {
          errors.push(`Missing required attribute: ${attr} for role="${role}"`);
        }
      });
    }
  }

  return errors;
}