import { test, expect } from '@playwright/test';

// Replace with your deployed domains when available
const SUBDOMAIN_URLS = [
  process.env.ANGEL_URL || 'https://angel.yoohoo.guru',
  process.env.COACH_URL || 'https://coach.yoohoo.guru',
];

for (const url of SUBDOMAIN_URLS) {
  test(`subdomain loads without console errors: ${url}`, async ({ page }) => {
    const errors: string[] = [];

    page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`);
    });

    await page.goto(url, { waitUntil: 'networkidle' });

    // Expect page to load main content
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Ensure no console errors
    expect(errors, `Console errors found on ${url}:\n${errors.join('\n')}`).toHaveLength(0);
  });
}
