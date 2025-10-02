
const { test, expect } = require('@playwright/test');

// Critical routes for MVP
const ROUTES = ['/', '/angels-list', '/coach', '/blog'];

for (const route of ROUTES) {
  test(`no console errors on ${route}`, async ({ page, baseURL }) => {
    const errors = [];

    page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`);
    });

    await page.goto(route, { waitUntil: 'networkidle' });

    expect(errors, `Console errors found on ${route}: \n${errors.join('\n')}`).toHaveLength(0);
  });
}
