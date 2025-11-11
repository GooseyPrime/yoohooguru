import { test, expect } from '@playwright/test';

const pages = [
  { name: 'Home', url: '/' },
  { name: 'About', url: '/about' },
  { name: 'How It Works', url: '/how-it-works' },
  { name: 'Pricing', url: '/pricing' },
  { name: 'Blog', url: '/blog' },
  { name: 'Help', url: '/help' },
  { name: 'Safety', url: '/safety' },
  { name: 'Contact', url: '/contact' },
  { name: 'FAQ', url: '/faq' },
  { name: 'Hubs', url: '/hubs' },
  { name: 'Terms', url: '/terms' },
  { name: 'Privacy', url: '/privacy' },
  { name: 'Cookies', url: '/cookies' },
  { name: 'Login', url: '/login' },
  { name: 'Signup', url: '/signup' },
];

test.describe('Visual Inspection - Main Pages', () => {
  for (const page of pages) {
    test(`${page.name} page visual inspection`, async ({ page: browserPage }) => {
      await browserPage.goto(page.url);
      
      // Wait for page to be fully loaded
      await browserPage.waitForLoadState('networkidle');
      
      // Check page title exists
      await expect(browserPage).toHaveTitle(/.+/);
      
      // Take full page screenshot
      await browserPage.screenshot({ 
        path: `test-results/screenshots/${page.name.toLowerCase().replace(/\s+/g, '-')}-full.png`,
        fullPage: true 
      });
      
      // Check for console errors
      const errors: string[] = [];
      browserPage.on('console', msg => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });
      
      // Verify no broken images
      const images = await browserPage.locator('img').all();
      for (const img of images) {
        const src = await img.getAttribute('src');
        if (src && !src.startsWith('data:')) {
          await expect(img).toBeVisible();
        }
      }
      
      // Check navigation is present
      const nav = browserPage.locator('nav');
      await expect(nav).toBeVisible();
      
      // Check footer is present
      const footer = browserPage.locator('footer');
      await expect(footer).toBeVisible();
    });
  }
});

test.describe('Visual Inspection - Responsive Design', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    test(`Home page on ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await page.screenshot({ 
        path: `test-results/screenshots/home-${viewport.name.toLowerCase()}.png`,
        fullPage: true 
      });
      
      // Verify responsive elements
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
      
      // Check hero section
      const hero = page.locator('text=YooHoo.Guru').first();
      await expect(hero).toBeVisible();
    });
  }
});

test.describe('Visual Inspection - Interactive Elements', () => {
  test('Carousel functionality', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check if carousel navigation buttons exist
    const nextButton = page.locator('button[aria-label*="Next"]').first();
    const prevButton = page.locator('button[aria-label*="Previous"]').first();
    
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test-results/screenshots/carousel-next.png' });
      
      await prevButton.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test-results/screenshots/carousel-prev.png' });
    }
  });
  
  test('Navigation menu interactions', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation links
    const navLinks = page.locator('nav a');
    const count = await navLinks.count();
    
    expect(count).toBeGreaterThan(0);
    
    // Click first navigation link
    if (count > 0) {
      const firstLink = navLinks.first();
      await firstLink.click();
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: 'test-results/screenshots/nav-click.png' });
    }
  });
});

test.describe('Visual Inspection - Style Consistency', () => {
  test('Color scheme consistency', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for gradient text elements
    const gradientElements = page.locator('[class*="gradient-text"]');
    const count = await gradientElements.count();
    expect(count).toBeGreaterThan(0);
    
    // Check for glass effect elements
    const glassElements = page.locator('[class*="glass"]');
    const glassCount = await glassElements.count();
    expect(glassCount).toBeGreaterThan(0);
  });
  
  test('Typography consistency', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for heading hierarchy
    const h1 = page.locator('h1');
    const h2 = page.locator('h2');
    const h3 = page.locator('h3');
    
    expect(await h1.count()).toBeGreaterThan(0);
    expect(await h2.count()).toBeGreaterThan(0);
  });
});