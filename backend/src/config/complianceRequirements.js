// Profile compliance requirements by skill category
const COMPLIANCE_REQUIREMENTS = {
  'physical-training': {
    name: 'Physical Training & Fitness',
    riskLevel: 'high',
    required: {
      profile: ['displayName', 'bio', 'location', 'photo'],
      documents: ['liability_insurance', 'first_aid_cert'],
      badges: ['safety-certified', 'insured-provider'],
      verification: ['background_check'],
      insurance: {
        types: ['general_liability'],
        minimumCoverage: 1000000
      }
    },
    restrictions: {
      minAge: 18,
      maxParticipants: 8,
      requiresWaiver: true,
      emergencyContactRequired: true
    }
  },
  'childcare': {
    name: 'Childcare & Education',
    riskLevel: 'high',
    required: {
      profile: ['displayName', 'bio', 'location', 'photo', 'references'],
      documents: ['background_check', 'child_protection_training'],
      badges: ['background-verified'],
      verification: ['criminal_background_check', 'child_abuse_clearance'],
      insurance: {
        types: ['general_liability', 'professional_liability'],
        minimumCoverage: 1000000
      }
    },
    restrictions: {
      minAge: 21,
      maxParticipants: 6,
      requiresWaiver: true,
      parentalConsentRequired: true
    }
  },
  'medical': {
    name: 'Medical & Health Services',
    riskLevel: 'high',
    required: {
      profile: ['displayName', 'bio', 'location', 'photo', 'credentials'],
      documents: ['professional_license', 'malpractice_insurance'],
      badges: ['licensed-professional', 'insured-provider'],
      verification: ['license_verification', 'education_verification'],
      insurance: {
        types: ['malpractice', 'general_liability'],
        minimumCoverage: 2000000
      }
    },
    restrictions: {
      minAge: 25,
      scopeOfPractice: 'must_match_license',
      requiresWaiver: true,
      medicalHistoryRequired: true
    }
  },
  'construction': {
    name: 'Construction & Home Repair',
    riskLevel: 'high',
    required: {
      profile: ['displayName', 'bio', 'location', 'photo'],
      documents: ['contractors_license', 'liability_insurance', 'workers_comp'],
      badges: ['licensed-professional', 'insured-provider'],
      verification: ['license_verification'],
      insurance: {
        types: ['general_liability', 'workers_compensation'],
        minimumCoverage: 1000000
      }
    },
    restrictions: {
      minAge: 18,
      requiresWaiver: true,
      propertyWaiverRequired: true
    }
  },
  'automotive': {
    name: 'Automotive Services',
    riskLevel: 'medium',
    required: {
      profile: ['displayName', 'bio', 'location', 'photo'],
      documents: ['auto_insurance', 'mechanic_certification'],
      badges: ['insured-provider'],
      verification: ['certification_verification'],
      insurance: {
        types: ['auto_liability', 'garage_liability'],
        minimumCoverage: 500000
      }
    },
    restrictions: {
      minAge: 18,
      requiresWaiver: true,
      vehicleInspectionRequired: true
    }
  },
  'tutoring': {
    name: 'Tutoring & Education',
    riskLevel: 'medium',
    required: {
      profile: ['displayName', 'bio', 'location', 'photo', 'education'],
      documents: ['background_check', 'education_verification'],
      badges: ['background-verified'],
      verification: ['background_check'],
      insurance: {
        types: ['general_liability'],
        minimumCoverage: 500000
      }
    },
    restrictions: {
      minAge: 18,
      requiresWaiver: false,
      parentalConsentRequired: true
    }
  },
  'cooking': {
    name: 'Cooking & Food Services',
    riskLevel: 'medium',
    required: {
      profile: ['displayName', 'bio', 'location', 'photo'],
      documents: ['food_handlers_permit', 'kitchen_insurance'],
      badges: [],
      verification: ['food_safety_certification'],
      insurance: {
        types: ['general_liability'],
        minimumCoverage: 500000
      }
    },
    restrictions: {
      minAge: 18,
      allergyDisclosureRequired: true,
      kitchenInspectionRequired: true
    }
  },
  'arts-crafts': {
    name: 'Arts & Crafts',
    riskLevel: 'low',
    required: {
      profile: ['displayName', 'bio', 'location'],
      documents: [],
      badges: [],
      verification: [],
      insurance: {
        types: [],
        minimumCoverage: 0
      }
    },
    restrictions: {
      minAge: 16,
      requiresWaiver: false
    }
  },
  'technology': {
    name: 'Technology & IT',
    riskLevel: 'low',
    required: {
      profile: ['displayName', 'bio', 'location'],
      documents: [],
      badges: [],
      verification: [],
      insurance: {
        types: [],
        minimumCoverage: 0
      }
    },
    restrictions: {
      minAge: 16,
      requiresWaiver: false
    }
  }
};

module.exports = { COMPLIANCE_REQUIREMENTS };