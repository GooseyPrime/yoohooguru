/**
 * Tests for subdomain routing utilities
 */

import {
  isMastersHost,
  isCoachHost,
  isAngelHost,
  isCousinHost,
  getSubdomainName,
  getSubdomainType,
  getSubdomainRoute
} from './src/hosting/hostRules';

describe('Subdomain Detection', () => {
  describe('isCousinHost', () => {
    it('should return true for valid cousin subdomains', () => {
      expect(isCousinHost('art.yoohoo.guru')).toBe(true);
      expect(isCousinHost('fitness.yoohoo.guru')).toBe(true);
      expect(isCousinHost('tech.yoohoo.guru')).toBe(true);
      expect(isCousinHost('cooking.yoohoo.guru')).toBe(true);
    });

    it('should return false for special subdomains', () => {
      expect(isCousinHost('masters.yoohoo.guru')).toBe(false);
      expect(isCousinHost('coach.yoohoo.guru')).toBe(false);
      expect(isCousinHost('angel.yoohoo.guru')).toBe(false);
      expect(isCousinHost('www.yoohoo.guru')).toBe(false);
      expect(isCousinHost('api.yoohoo.guru')).toBe(false);
      expect(isCousinHost('admin.yoohoo.guru')).toBe(false);
    });

    it('should return false for apex domain', () => {
      expect(isCousinHost('yoohoo.guru')).toBe(false);
    });

    it('should return false for localhost', () => {
      expect(isCousinHost('localhost')).toBe(false);
      expect(isCousinHost('localhost:3000')).toBe(false);
    });
  });

  describe('getSubdomainName', () => {
    it('should extract subdomain name correctly', () => {
      expect(getSubdomainName('art.yoohoo.guru')).toBe('art');
      expect(getSubdomainName('fitness.yoohoo.guru')).toBe('fitness');
      expect(getSubdomainName('masters.yoohoo.guru')).toBe('masters');
      expect(getSubdomainName('coach.yoohoo.guru')).toBe('coach');
    });

    it('should return null for excluded subdomains', () => {
      expect(getSubdomainName('www.yoohoo.guru')).toBe(null);
      expect(getSubdomainName('api.yoohoo.guru')).toBe(null);
      expect(getSubdomainName('admin.yoohoo.guru')).toBe(null);
    });

    it('should return null for apex domain', () => {
      expect(getSubdomainName('yoohoo.guru')).toBe(null);
    });
  });

  describe('getSubdomainType', () => {
    it('should return correct type for special subdomains', () => {
      expect(getSubdomainType('masters.yoohoo.guru')).toBe('masters');
      expect(getSubdomainType('coach.yoohoo.guru')).toBe('coach');
      expect(getSubdomainType('angel.yoohoo.guru')).toBe('angel');
    });

    it('should return "cousin" for other subdomains', () => {
      expect(getSubdomainType('art.yoohoo.guru')).toBe('cousin');
      expect(getSubdomainType('fitness.yoohoo.guru')).toBe('cousin');
      expect(getSubdomainType('tech.yoohoo.guru')).toBe('cousin');
    });

    it('should return "main" for main domain', () => {
      expect(getSubdomainType('yoohoo.guru')).toBe('main');
      expect(getSubdomainType('www.yoohoo.guru')).toBe('main');
    });
  });

  describe('getSubdomainRoute', () => {
    it('should return correct routes for special subdomains', () => {
      expect(getSubdomainRoute('masters.yoohoo.guru')).toBe('/modified');
      expect(getSubdomainRoute('coach.yoohoo.guru')).toBe('/skills');
      expect(getSubdomainRoute('angel.yoohoo.guru')).toBe('/angels-list');
    });

    it('should return null for main domain and cousin subdomains', () => {
      expect(getSubdomainRoute('yoohoo.guru')).toBe(null);
      expect(getSubdomainRoute('www.yoohoo.guru')).toBe(null);
      expect(getSubdomainRoute('art.yoohoo.guru')).toBe(null);
      expect(getSubdomainRoute('fitness.yoohoo.guru')).toBe(null);
    });
  });

  describe('Special subdomain detection', () => {
    it('isMastersHost should work correctly', () => {
      expect(isMastersHost('masters.yoohoo.guru')).toBe(true);
      expect(isMastersHost('Masters.yoohoo.guru')).toBe(true);
      expect(isMastersHost('coach.yoohoo.guru')).toBe(false);
    });

    it('isCoachHost should work correctly', () => {
      expect(isCoachHost('coach.yoohoo.guru')).toBe(true);
      expect(isCoachHost('Coach.yoohoo.guru')).toBe(true);
      expect(isCoachHost('masters.yoohoo.guru')).toBe(false);
    });

    it('isAngelHost should work correctly', () => {
      expect(isAngelHost('angel.yoohoo.guru')).toBe(true);
      expect(isAngelHost('Angel.yoohoo.guru')).toBe(true);
      expect(isAngelHost('masters.yoohoo.guru')).toBe(false);
    });
  });
});
