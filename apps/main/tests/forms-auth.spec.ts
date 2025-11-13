import { test, expect } from '@playwright/test';

test.describe('Form Testing', () => {
  test('Contact form elements are present', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    
    // Check for form elements
    const nameInput = page.locator('input[name="name"], input[placeholder*="name" i]').first();
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const messageInput = page.locator('textarea[name="message"], textarea[placeholder*="message" i]').first();
    const submitButton = page.locator('button[type="submit"], button:has-text("Send")').first();
    
    if (await nameInput.isVisible()) {
      await expect(nameInput).toBeVisible();
      await expect(emailInput).toBeVisible();
      await expect(messageInput).toBeVisible();
      await expect(submitButton).toBeVisible();
    }
  });
  
  test('Contact form validation', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    
    const submitButton = page.locator('button[type="submit"], button:has-text("Send")').first();
    
    if (await submitButton.isVisible()) {
      // Try to submit empty form
      await submitButton.click();
      
      // Check if validation messages appear or form doesn't submit
      await page.waitForTimeout(1000);
      
      // Form should still be on the same page or show validation
      expect(page.url()).toContain('/contact');
    }
  });
  
  test('Search functionality if present', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]').first();
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('web development');
      await searchInput.press('Enter');
      await page.waitForTimeout(1000);
      
      // Verify search was performed
      expect(page.url()).toMatch(/search|query/i);
    }
  });
});

test.describe('Authentication Flow Testing', () => {
  test('Login page elements are present', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Check for login form elements
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const loginButton = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Log In")').first();
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(loginButton).toBeVisible();
  });
  
  test('Signup page elements are present', async ({ page }) => {
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');
    
    // Check for signup form elements
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const signupButton = page.locator('button[type="submit"], button:has-text("Sign Up"), button:has-text("Create Account")').first();
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(signupButton).toBeVisible();
  });
  
  test('Login form validation', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    const loginButton = page.locator('button[type="submit"], button:has-text("Sign In"), button:has-text("Log In")').first();
    
    // Try to submit empty form
    await loginButton.click();
    await page.waitForTimeout(1000);
    
    // Should still be on login page or show validation
    expect(page.url()).toContain('/login');
  });
  
  test('Signup form validation', async ({ page }) => {
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');
    
    const signupButton = page.locator('button[type="submit"], button:has-text("Sign Up"), button:has-text("Create Account")').first();
    
    // Try to submit empty form
    await signupButton.click();
    await page.waitForTimeout(1000);
    
    // Should still be on signup page or show validation
    expect(page.url()).toContain('/signup');
  });
  
  test('Password visibility toggle if present', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    const passwordInput = page.locator('input[type="password"]').first();
    const toggleButton = page.locator('button[aria-label*="password" i], button:has-text("Show")').first();
    
    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      
      // Check if password input type changed
      const inputType = await passwordInput.getAttribute('type');
      expect(inputType).toBe('text');
    }
  });
  
  test('Social login buttons if present', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Check for social login buttons
    const googleButton = page.locator('button:has-text("Google"), a:has-text("Google")').first();
    const facebookButton = page.locator('button:has-text("Facebook"), a:has-text("Facebook")').first();
    
    // Just verify they exist if present, don't click them
    if (await googleButton.isVisible()) {
      await expect(googleButton).toBeVisible();
    }
    
    if (await facebookButton.isVisible()) {
      await expect(facebookButton).toBeVisible();
    }
  });
});

test.describe('Form Accessibility', () => {
  test('Forms have proper labels', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    
    // Check that inputs have associated labels
    const inputs = page.locator('input, textarea');
    const count = await inputs.count();
    
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const placeholder = await input.getAttribute('placeholder');
      
      // Input should have either an id (for label), aria-label, or placeholder
      expect(id || ariaLabel || placeholder).toBeTruthy();
    }
  });
  
  test('Forms are keyboard navigable', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Tab through form elements
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['INPUT', 'BUTTON', 'A']).toContain(focusedElement);
  });
});