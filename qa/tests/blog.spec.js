import { test, expect } from '@playwright/test';

test.describe('Blog & AI Drafts', () => {
  test('blog page loads without console errors', async ({ page, baseURL }) => {
    const errors = [];

    page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`);
    });

    await page.goto(`${baseURL}/blog`, { waitUntil: 'networkidle' });

    const main = page.locator('main');
    await expect(main).toBeVisible();

    expect(errors, `Console errors found on /blog:\n${errors.join('\n')}`).toHaveLength(0);
  });

  test('AI news draft endpoint responds', async ({ request, baseURL }) => {
    // Adjust path if your backend uses a different route (e.g., /api/openai/news)
    const res = await request.get(`${baseURL}/api/openai/news`);
    expect(res.status()).toBeLessThan(500);

    // Optionally check if JSON body contains "draft" or "success"
    try {
      const data = await res.json();
      expect(data).toBeDefined();
    } catch {
      // If not JSON, just ensure status <500
    }
  });
});
