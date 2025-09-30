const {
  CATEGORY_MAPPING,
  convertLegacyRequirements,
  inferRiskLevel,
  createUnifiedRequirements,
  getComplianceCategory
} = require('../src/utils/requirementsMapper');

describe('Requirements Mapper', () => {
  describe('Category Mapping', () => {
    test('should map old categories to compliance categories', () => {
      expect(getComplianceCategory('tutoring')).toBe('tutoring');
      expect(getComplianceCategory('fitness')).toBe('physical-training');
      expect(getComplianceCategory('handyman')).toBe('construction');
      expect(getComplianceCategory('cleaning')).toBe('arts-crafts');
    });

    test('should return null for unmapped categories', () => {
      expect(getComplianceCategory('nonexistent')).toBeNull();
    });
  });

  describe('Legacy Requirements Conversion', () => {
    test('should convert license requirements', () => {
      const legacy = { requires_license: true };
      const result = convertLegacyRequirements(legacy);
      
      expect(result.documents).toContain('professional_license');
      expect(result.verification).toContain('license_verification');
      expect(result.badges).toContain('licensed-professional');
    });

    test('should convert general liability requirements', () => {
      const legacy = { 
        requires_gl: true, 
        min_gl_per_occurrence_cents: 200000000 
      };
      const result = convertLegacyRequirements(legacy);
      
      expect(result.documents).toContain('liability_insurance');
      expect(result.insurance.types).toContain('general_liability');
      expect(result.insurance.minimumCoverage).toBe(2000000);
      expect(result.badges).toContain('insured-provider');
    });

    test('should convert auto insurance requirements', () => {
      const legacy = { requires_auto_insurance: true };
      const result = convertLegacyRequirements(legacy);
      
      expect(result.documents).toContain('auto_insurance');
      expect(result.insurance.types).toContain('auto_liability');
      expect(result.insurance.minimumCoverage).toBe(500000);
    });

    test('should convert background check requirements', () => {
      const legacy = { requires_background_check: true };
      const result = convertLegacyRequirements(legacy);
      
      expect(result.documents).toContain('background_check');
      expect(result.verification).toContain('background_check');
      expect(result.badges).toContain('background-verified');
    });
  });

  describe('Risk Level Inference', () => {
    test('should infer high risk for licensed categories', () => {
      const legacy = { requires_license: true };
      expect(inferRiskLevel(legacy)).toBe('high');
    });

    test('should infer medium risk for GL or background check', () => {
      expect(inferRiskLevel({ requires_gl: true })).toBe('medium');
      expect(inferRiskLevel({ requires_background_check: true })).toBe('medium');
    });

    test('should infer low risk for minimal requirements', () => {
      expect(inferRiskLevel({})).toBe('low');
      expect(inferRiskLevel({ requires_license: false })).toBe('low');
    });
  });

  describe('Unified Requirements Creation', () => {
    test('should prefer compliance requirements when available', () => {
      const categorySlug = 'tutoring';
      const legacy = { requires_license: false };
      const compliance = {
        name: 'Tutoring & Education',
        riskLevel: 'medium',
        required: {
          profile: ['displayName', 'bio', 'location'],
          documents: ['background_check'],
          badges: ['background-verified'],
          verification: ['background_check'],
          insurance: { types: [], minimumCoverage: 0 }
        },
        restrictions: { minAge: 18 }
      };
      
      const result = createUnifiedRequirements(categorySlug, legacy, compliance);
      
      expect(result.name).toBe('Tutoring & Education');
      expect(result.riskLevel).toBe('medium');
      expect(result.required.documents).toContain('background_check');
      expect(result.legacy.requires_license).toBe(false);
    });

    test('should convert from legacy when no compliance requirements', () => {
      const categorySlug = 'handyman';
      const legacy = { 
        requires_gl: true,
        min_gl_per_occurrence_cents: 100000000,
        notes: 'No gas, roofing, or structural work.'
      };
      
      const result = createUnifiedRequirements(categorySlug, legacy, null);
      
      expect(result.riskLevel).toBe('medium');
      expect(result.required.documents).toContain('liability_insurance');
      expect(result.required.insurance.minimumCoverage).toBe(1000000);
      expect(result.legacy.notes).toBe('No gas, roofing, or structural work.');
    });

    test('should provide fallback for unknown categories', () => {
      const result = createUnifiedRequirements('unknown', null, null);
      
      expect(result.slug).toBe('unknown');
      expect(result.riskLevel).toBe('low');
      expect(result.required.documents).toEqual([]);
      expect(result.restrictions.minAge).toBe(16);
    });
  });
});