import styled from 'styled-components';

const ComplianceContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const ComplianceHeader = styled.h2`
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const CategoryCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 2rem;
`;

const CategoryTitle = styled.h3`
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RiskBadge = styled.span<{ risk: 'high' | 'medium' | 'low' }>`
  background: ${props => {
    switch (props.risk) {
      case 'high': return 'rgba(255, 107, 107, 0.2)';
      case 'medium': return 'rgba(255, 204, 0, 0.2)';
      case 'low': return 'rgba(81, 207, 102, 0.2)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.risk) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#ffcc00';
      case 'low': return '#51cf66';
      default: return '#b0b0b0';
    }
  }};
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  font-weight: 600;
`;

const RequirementList = styled.ul`
  color: #b0b0b0;
  line-height: 1.6;
  margin: 1rem 0;
  padding-left: 1.5rem;
`;

const RequirementItem = styled.li`
  margin-bottom: 0.5rem;
`;

const ComplianceNote = styled.div`
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 1rem;
  padding: 1.5rem;
  color: #b0b0b0;
  line-height: 1.6;
`;

interface ComplianceCategory {
  name: string;
  risk: 'high' | 'medium' | 'low';
  requirements: string[];
  description: string;
}

export default function ComplianceRequirements() {
  const complianceCategories: ComplianceCategory[] = [
    {
      name: 'Health & Medical',
      risk: 'high',
      description: 'Skills involving health advice, medical guidance, or physical therapy',
      requirements: [
        'Professional medical license or certification',
        'Background check required',
        'Liability insurance mandatory',
        'Disclaimer about non-medical advice',
        'Age verification (18+)',
        'Annual compliance training'
      ]
    },
    {
      name: 'Financial Services',
      risk: 'high',
      description: 'Skills involving financial advice, investment guidance, or tax preparation',
      requirements: [
        'Professional financial certification',
        'Background check required',
        'Liability insurance mandatory',
        'Disclaimer about financial advice',
        'Age verification (18+)',
        'Annual compliance training'
      ]
    },
    {
      name: 'Legal Services',
      risk: 'high',
      description: 'Skills involving legal advice or representation',
      requirements: [
        'Bar admission or legal certification',
        'Background check required',
        'Liability insurance mandatory',
        'Disclaimer about non-legal representation',
        'Age verification (18+)',
        'Annual compliance training'
      ]
    },
    {
      name: 'Education & Tutoring',
      risk: 'medium',
      description: 'Skills involving academic tutoring or educational services',
      requirements: [
        'Educational credentials verification',
        'Background check recommended',
        'Professional liability insurance',
        'Age verification (18+)',
        'Annual compliance training'
      ]
    },
    {
      name: 'Child-related Services',
      risk: 'high',
      description: 'Skills involving working with children or minors',
      requirements: [
        'Enhanced background check required',
        'Child protection training',
        'Liability insurance mandatory',
        'Parental consent for minors',
        'Age verification (18+)',
        'Annual compliance training'
      ]
    },
    {
      name: 'Technology & IT',
      risk: 'medium',
      description: 'Skills involving technical support or IT services',
      requirements: [
        'Professional certifications recommended',
        'Background check optional',
        'Professional liability insurance',
        'Data protection agreement',
        'Age verification (18+)'
      ]
    },
    {
      name: 'Creative Arts',
      risk: 'low',
      description: 'Skills involving artistic instruction or creative hobbies',
      requirements: [
        'Portfolio verification',
        'Background check optional',
        'Age verification (18+)'
      ]
    },
    {
      name: 'Fitness & Sports',
      risk: 'medium',
      description: 'Skills involving physical training or sports instruction',
      requirements: [
        'Fitness certification or degree',
        'First aid/CPR certification',
        'Professional liability insurance',
        'Background check recommended',
        'Age verification (18+)'
      ]
    },
    {
      name: 'General Skills',
      risk: 'low',
      description: 'Most other skill categories not listed above',
      requirements: [
        'Profile verification',
        'Background check optional',
        'Age verification (18+)'
      ]
    }
  ];

  return (
    <ComplianceContainer>
      <ComplianceHeader>Compliance Requirements by Category</ComplianceHeader>
      
      <CategoryGrid>
        {complianceCategories.map((category, index) => (
          <CategoryCard key={index}>
            <CategoryTitle>
              {category.name}
              <RiskBadge risk={category.risk}>
                {category.risk.charAt(0).toUpperCase() + category.risk.slice(1)} Risk
              </RiskBadge>
            </CategoryTitle>
            <p style={{color: '#b0b0b0', marginBottom: '1rem'}}>{category.description}</p>
            <RequirementList>
              {category.requirements.map((req, reqIndex) => (
                <RequirementItem key={reqIndex}>{req}</RequirementItem>
              ))}
            </RequirementList>
          </CategoryCard>
        ))}
      </CategoryGrid>
      
      <ComplianceNote>
        <h3 style={{color: '#667eea', marginBottom: '1rem'}}>Important Compliance Information</h3>
        <p>
          All Gurus must complete profile verification before offering services. 
          High-risk categories require additional documentation and background checks. 
          Compliance requirements are subject to change based on regulatory updates and platform policies.
        </p>
        <p style={{marginTop: '1rem'}}>
          For Hero Gurus (accessible learning platform), additional accessibility training 
          and accommodations verification may be required.
        </p>
      </ComplianceNote>
    </ComplianceContainer>
  );
}