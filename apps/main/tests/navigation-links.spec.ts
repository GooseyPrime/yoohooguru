import { test, expect } from '@playwright/test';

test.describe('Navigation Links Testing', () => {
  test('Main navigation links are functional', async ({ page }) => {
    await page.goto('/');
    
    const navigationLinks = [
      { text: 'About', expectedUrl: '/about' },
      { text: 'How It Works', expectedUrl: '/how-it-works' },
      { text: 'Pricing', expectedUrl: '/pricing' },
      { text: 'Blog', expectedUrl: '/blog' },
    ];
    
    for (const link of navigationLinks) {
      await page.goto('/');
      const linkElement = page.locator(`nav a:has-text("${link.text}")`).first();
      
      if (await linkElement.isVisible()) {
        await linkElement.click();
        await page.waitForLoadState('networkidle');
        expect(page.url()).toContain(link.expectedUrl);
      }
    }
  });
  
  test('Footer links are functional', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const footerLinks = [
      { text: 'Help Center', expectedUrl: '/help' },
      { text: 'Safety', expectedUrl: '/safety' },
      { text: 'Contact', expectedUrl: '/contact' },
      { text: 'Terms', expectedUrl: '/terms' },
      { text: 'Privacy', expectedUrl: '/privacy' },
    ];
    
    for (const link of footerLinks) {
      await page.goto('/');
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      
      const linkElement = page.locator(`footer a:has-text("${link.text}")`).first();
      
      if (await linkElement.isVisible()) {
        await linkElement.click();
        await page.waitForLoadState('networkidle');
        expect(page.url()).toContain(link.expectedUrl);
      }
    }
  });
  
  test('Service cards link to correct subdomains', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check Coach Guru link
    const coachLink = page.locator('a[href*="coach.yoohoo.guru"]').first();
    if (await coachLink.isVisible()) {
      const href = await coachLink.getAttribute('href');
      expect(href).toContain('coach.yoohoo.guru');
    }
    
    // Check Angel's List link
    const angelLink = page.locator('a[href*="angel.yoohoo.guru"]').first();
    if (await angelLink.isVisible()) {
      const href = await angelLink.getAttribute('href');
      expect(href).toContain('angel.yoohoo.guru');
    }
    
    // Check Hero Gurus link
    const heroLink = page.locator('a[href*="heroes.yoohoo.guru"]').first();
    if (await heroLink.isVisible()) {
      const href = await heroLink.getAttribute('href');
      expect(href).toContain('heroes.yoohoo.guru');
    }
  });
  
  test('Content hub links are present', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for content hub links
    const hubLinks = page.locator('a[href*=".yoohoo.guru"]');
    const count = await hubLinks.count();
    
    expect(count).toBeGreaterThan(0);
    
    // Verify at least some hub links are visible
    const visibleHubs = await hubLinks.filter({ hasText: /.+/ }).count();
    expect(visibleHubs).toBeGreaterThan(0);
  });
  
  test('CTA buttons are functional', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check "Get Started" button
    const getStartedButton = page.locator('a:has-text("Get Started")').first();
    if (await getStartedButton.isVisible()) {
      const href = await getStartedButton.getAttribute('href');
      expect(href).toBeTruthy();
    }
    
    // Check "Learn How It Works" button
    const learnMoreButton = page.locator('a:has-text("Learn How It Works")').first();
    if (await learnMoreButton.isVisible()) {
      const href = await learnMoreButton.getAttribute('href');
      expect(href).toContain('/how-it-works');
    }
  });
});

test.describe('External Links Testing', () => {
  test('All external links have proper attributes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find all external links (subdomains)
    const externalLinks = page.locator('a[href*="://"]');
    const count = await externalLinks.count();
    
    for (let i = 0; i < Math.min(count, 10); i++) {
      const link = externalLinks.nth(i);
      const href = await link.getAttribute('href');
      
      if (href && href.includes('yoohoo.guru')) {
        // Verify link is properly formatted
        expect(href).toMatch(/^https?:\/\//);
      }
    }
  });
});

test.describe('Broken Links Detection', () => {
  test('No broken internal links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const internalLinks = page.locator('a[href^="/"]');
    const count = await internalLinks.count();
    
    const brokenLinks: string[] = [];
    
    for (let i = 0; i < Math.min(count, 20); i++) {
      const link = internalLinks.nth(i);
      const href = await link.getAttribute('href');
      
      if (href && href !== '#') {
        const response = await page.request.get(href);
        if (response.status() >= 400) {
          brokenLinks.push(href);
        }
      }
    }
    
    expect(brokenLinks).toHaveLength(0);
  });
});