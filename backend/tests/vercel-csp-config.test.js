/**
 * Test for vercel.json Content Security Policy configuration
 * Ensures CSP includes necessary domains for application functionality
 */

const fs = require('fs');
const path = require('path');

describe('Vercel CSP Configuration', () => {
  let vercelConfig;
  let cspHeader;

  beforeAll(() => {
    // Read vercel.json from the root of the repository
    const vercelConfigPath = path.join(__dirname, '../../vercel.json');
    const vercelConfigContent = fs.readFileSync(vercelConfigPath, 'utf8');
    vercelConfig = JSON.parse(vercelConfigContent);

    // Find the CSP header in the headers array
    const headersConfig = vercelConfig.headers || [];
    const globalHeaders = headersConfig.find(h => h.source === '/:path*');
    
    if (globalHeaders && globalHeaders.headers) {
      const cspHeaderObj = globalHeaders.headers.find(h => h.key === 'Content-Security-Policy');
      cspHeader = cspHeaderObj ? cspHeaderObj.value : null;
    }
  });

  it('should have a valid vercel.json configuration', () => {
    expect(vercelConfig).toBeDefined();
    expect(vercelConfig).toBeInstanceOf(Object);
  });

  it('should have headers configuration', () => {
    expect(vercelConfig.headers).toBeDefined();
    expect(Array.isArray(vercelConfig.headers)).toBe(true);
  });

  it('should have a Content-Security-Policy header defined', () => {
    expect(cspHeader).toBeDefined();
    expect(cspHeader).not.toBeNull();
    expect(typeof cspHeader).toBe('string');
  });

  describe('CSP script-src directive', () => {
    it('should include Google domains for authentication', () => {
      expect(cspHeader).toContain('https://apis.google.com');
      expect(cspHeader).toContain('https://accounts.google.com');
      expect(cspHeader).toContain('https://www.google.com');
      expect(cspHeader).toContain('https://www.gstatic.com');
    });

    it('should include Stripe for payment processing', () => {
      expect(cspHeader).toContain('https://js.stripe.com');
    });

    it('should include Google Tag Manager', () => {
      expect(cspHeader).toContain('https://www.googletagmanager.com');
    });

    it('should include Google Maps', () => {
      expect(cspHeader).toContain('https://maps.googleapis.com');
    });
  });

  describe('CSP other directives', () => {
    it('should have default-src directive', () => {
      expect(cspHeader).toContain("default-src 'self'");
    });

    it('should have style-src directive', () => {
      expect(cspHeader).toContain("style-src");
    });

    it('should have connect-src directive', () => {
      expect(cspHeader).toContain("connect-src");
    });

    it('should have frame-src directive', () => {
      expect(cspHeader).toContain("frame-src");
    });

    it('should have img-src directive', () => {
      expect(cspHeader).toContain("img-src");
    });

    it('should have font-src directive', () => {
      expect(cspHeader).toContain("font-src");
    });
  });
});
