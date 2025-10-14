/**
 * Tests for newly added subdomains (data, investing, marketing, sales, coding)
 * Validates that the new subdomains are properly configured and ready for content curation
 */

const { 
  getSubdomainConfig, 
  getAllSubdomains, 
  isValidSubdomain 
} = require('../src/config/subdomains');

describe('New Subdomains Configuration', () => {
  const newSubdomains = ['data', 'investing', 'marketing', 'sales', 'coding'];

  describe('Subdomain Validation', () => {
    test.each(newSubdomains)('%s should be a valid subdomain', (subdomain) => {
      expect(isValidSubdomain(subdomain)).toBe(true);
    });

    it('should have 20 total subdomains configured', () => {
      const allSubdomains = getAllSubdomains();
      expect(allSubdomains.length).toBe(20);
    });

    it('should include all new subdomains in the list', () => {
      const allSubdomains = getAllSubdomains();
      newSubdomains.forEach(subdomain => {
        expect(allSubdomains).toContain(subdomain);
      });
    });
  });

  describe('Configuration Completeness', () => {
    test.each(newSubdomains)('%s should have complete configuration', (subdomain) => {
      const config = getSubdomainConfig(subdomain);
      
      expect(config).toBeDefined();
      expect(config).toHaveProperty('character');
      expect(config).toHaveProperty('category');
      expect(config).toHaveProperty('primarySkills');
      expect(config).toHaveProperty('affiliateCategories');
      expect(config).toHaveProperty('theme');
      expect(config).toHaveProperty('seo');
      
      // Verify character naming convention
      expect(config.character).toContain('Guru');
      
      // Verify primarySkills is an array with at least 3 skills
      expect(Array.isArray(config.primarySkills)).toBe(true);
      expect(config.primarySkills.length).toBeGreaterThanOrEqual(3);
      
      // Verify affiliateCategories is an array
      expect(Array.isArray(config.affiliateCategories)).toBe(true);
      expect(config.affiliateCategories.length).toBeGreaterThan(0);
    });

    test.each(newSubdomains)('%s should have valid theme configuration', (subdomain) => {
      const config = getSubdomainConfig(subdomain);
      
      expect(config.theme).toHaveProperty('primaryColor');
      expect(config.theme).toHaveProperty('secondaryColor');
      expect(config.theme).toHaveProperty('accentColor');
      expect(config.theme).toHaveProperty('icon');
      expect(config.theme).toHaveProperty('emoji');
      
      // Verify color format (should be hex colors)
      expect(config.theme.primaryColor).toMatch(/^#[0-9a-f]{6}$/i);
      expect(config.theme.secondaryColor).toMatch(/^#[0-9a-f]{6}$/i);
      expect(config.theme.accentColor).toMatch(/^#[0-9a-f]{6}$/i);
    });

    test.each(newSubdomains)('%s should have valid SEO configuration', (subdomain) => {
      const config = getSubdomainConfig(subdomain);
      
      expect(config.seo).toHaveProperty('title');
      expect(config.seo).toHaveProperty('description');
      expect(config.seo).toHaveProperty('keywords');
      
      // SEO title should include subdomain name and "Guru"
      expect(config.seo.title).toContain('Guru');
      
      // Description should be meaningful
      expect(config.seo.description.length).toBeGreaterThan(50);
      
      // Keywords should be an array
      expect(Array.isArray(config.seo.keywords)).toBe(true);
      expect(config.seo.keywords.length).toBeGreaterThan(0);
    });
  });

  describe('Specific Subdomain Details', () => {
    it('data subdomain should be technology category', () => {
      const config = getSubdomainConfig('data');
      expect(config.category).toBe('technology');
      expect(config.character).toBe('Data Guru');
    });

    it('investing subdomain should be finance category', () => {
      const config = getSubdomainConfig('investing');
      expect(config.category).toBe('finance');
      expect(config.character).toBe('Investing Guru');
    });

    it('marketing subdomain should be professional category', () => {
      const config = getSubdomainConfig('marketing');
      expect(config.category).toBe('professional');
      expect(config.character).toBe('Marketing Guru');
    });

    it('sales subdomain should be professional category', () => {
      const config = getSubdomainConfig('sales');
      expect(config.category).toBe('professional');
      expect(config.character).toBe('Sales Guru');
    });

    it('coding subdomain should be technology category', () => {
      const config = getSubdomainConfig('coding');
      expect(config.category).toBe('technology');
      expect(config.character).toBe('Coding Guru');
    });
  });

  describe('Content Curation Readiness', () => {
    test.each(newSubdomains)('%s should be ready for news curation', (subdomain) => {
      const config = getSubdomainConfig(subdomain);
      
      // Verify it has enough skills for news generation
      expect(config.primarySkills.length).toBeGreaterThanOrEqual(3);
      
      // Verify it has a category for topic selection
      expect(config.category).toBeTruthy();
      expect(config.category.length).toBeGreaterThan(0);
    });

    test.each(newSubdomains)('%s should be ready for blog curation', (subdomain) => {
      const config = getSubdomainConfig(subdomain);
      
      // Verify it has primary skills for blog topic generation
      expect(config.primarySkills).toBeDefined();
      expect(config.primarySkills.length).toBeGreaterThan(0);
      
      // Verify it has affiliate categories for monetization
      expect(config.affiliateCategories).toBeDefined();
      expect(config.affiliateCategories.length).toBeGreaterThan(0);
    });
  });
});
