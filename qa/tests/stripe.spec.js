
const { test, expect } = require('@playwright/test');

test.describe('Stripe API endpoints', () => {
  test('payments config returns publishable key', async ({ request, baseURL }) => {
    const res = await request.get(`${baseURL}/api/payments/config`);
    expect(res.status()).toBe(200);

    const data = await res.json();
    expect(data).toHaveProperty('publishableKey');
    expect(typeof data.publishableKey).toBe('string');
  });

  test('connect balance endpoint responds', async ({ request, baseURL }) => {
    const res = await request.get(`${baseURL}/api/connect/balance`);
    // In test mode this may be mocked or return 401 if not authenticated,
    // so only assert that it returns a defined status <500
    expect(res.status()).toBeLessThan(500);
  });

  test('connect login link endpoint responds', async ({ request, baseURL }) => {
    const res = await request.get(`${baseURL}/api/connect/login-link`);
    expect(res.status()).toBeLessThan(500);
  });
});
