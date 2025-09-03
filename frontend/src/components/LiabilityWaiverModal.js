import React, { useState } from 'react';
import styled from 'styled-components';
import { X, AlertTriangle, Shield } from 'lucide-react';
import { 
  getSkillRiskLevel, 
  requiresLiabilityWaiver, 
  getCategoryMetadata,
  categorizeSkill,
  RISK_LEVELS 
} from '../lib/skillCategorization';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: var(--radius-xl);
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: var(--radius-md);
  
  &:hover {
    background: var(--light-gray);
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h2 {
    color: var(--gray-900);
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
  
  p {
    color: var(--gray-600);
  }
`;

const RiskSection = styled.div`
  background: ${props => props.riskLevel === RISK_LEVELS.HIGH ? '#fef2f2' : '#fff7ed'};
  border: 2px solid ${props => props.riskLevel === RISK_LEVELS.HIGH ? '#fecaca' : '#fed7aa'};
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 2rem;
  
  h3 {
    color: ${props => props.riskLevel === RISK_LEVELS.HIGH ? '#dc2626' : '#ea580c'};
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  p {
    color: var(--gray-700);
    line-height: 1.6;
  }
`;

const WaiverText = styled.div`
  background: var(--light-gray);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  margin-bottom: 2rem;
  font-size: var(--text-sm);
  line-height: 1.6;
  color: var(--gray-700);
  max-height: 200px;
  overflow-y: auto;
`;

const ConsentSection = styled.div`
  margin-bottom: 2rem;
  
  label {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    cursor: pointer;
    line-height: 1.6;
    
    input[type="checkbox"] {
      margin-top: 0.25rem;
      transform: scale(1.2);
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  
  button {
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius-md);
    font-weight: var(--font-medium);
    cursor: pointer;
    
    &.cancel {
      background: var(--light-gray);
      border: 1px solid var(--gray-300);
      color: var(--gray-700);
      
      &:hover {
        background: var(--gray-200);
      }
    }
    
    &.accept {
      background: var(--primary);
      border: 1px solid var(--primary);
      color: white;
      
      &:hover {
        background: var(--primary-dark);
      }
      
      &:disabled {
        background: var(--gray-300);
        border-color: var(--gray-300);
        cursor: not-allowed;
      }
    }
  }
`;

/**
 * LiabilityWaiverModal Component
 * 
 * This component uses the shared skillCategorization utility to:
 * - Determine if a waiver is required based on skill risk level
 * - Display appropriate risk warnings
 * - Present category-specific waiver text
 * 
 * This prevents the duplication issue mentioned in the GitHub issue
 * by centralizing risk assessment logic.
 */
function LiabilityWaiverModal({ 
  isOpen, 
  onClose, 
  onAccept, 
  skillName,
  sessionType = 'skill exchange' 
}) {
  const [hasAgreed, setHasAgreed] = useState(false);
  
  if (!isOpen || !skillName) return null;
  
  // Use shared categorization logic to assess risk
  const category = categorizeSkill(skillName);
  const riskLevel = getSkillRiskLevel(skillName);
  const categoryMetadata = getCategoryMetadata(category);
  const requiresWaiver = requiresLiabilityWaiver(skillName);
  
  // If skill doesn't require waiver, auto-accept
  if (!requiresWaiver) {
    onAccept();
    return null;
  }
  
  const handleAccept = () => {
    if (hasAgreed) {
      onAccept();
    }
  };
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>
        
        <Header>
          <h2>
            <Shield size={24} color="#dc2626" />
            Liability Waiver Required
          </h2>
          <p>
            This {sessionType} involves {skillName} ({category}) which has been 
            classified as a {riskLevel} risk activity.
          </p>
        </Header>
        
        <RiskSection riskLevel={riskLevel}>
          <h3>
            <AlertTriangle size={20} />
            Risk Assessment: {riskLevel.toUpperCase()} RISK
          </h3>
          <p>{categoryMetadata?.description}</p>
          {riskLevel === RISK_LEVELS.HIGH && (
            <p>
              <strong>High Risk Activities</strong> may involve physical exertion, 
              use of tools or equipment, or potential for injury. Participants should 
              be in good physical condition and aware of potential risks.
            </p>
          )}
        </RiskSection>
        
        <WaiverText>
          <h4>Liability Waiver and Release</h4>
          <p>
            I acknowledge that participation in {skillName} activities carries inherent risks 
            including but not limited to physical injury, property damage, or other harm. 
            I understand that yoohoo.guru does not provide insurance coverage for activities 
            and that I participate entirely at my own risk.
          </p>
          <p>
            I hereby release, waive, discharge, and covenant not to sue yoohoo.guru, 
            its officers, employees, agents, and affiliates from any and all liability, 
            claims, demands, actions, and causes of action whatsoever arising out of 
            or related to any loss, damage, or injury that may be sustained by me 
            while participating in this {sessionType}.
          </p>
          <p>
            I understand that this waiver is binding and that I have read and 
            understood its terms. I am participating voluntarily and am of legal age 
            to sign this agreement.
          </p>
          <p>
            <strong>Category-Specific Risks for {category}:</strong><br />
            {categoryMetadata?.description}
          </p>
        </WaiverText>
        
        <ConsentSection>
          <label>
            <input
              type="checkbox"
              checked={hasAgreed}
              onChange={(e) => setHasAgreed(e.target.checked)}
            />
            <span>
              I have read, understood, and agree to the terms of this liability waiver. 
              I understand the risks associated with {skillName} and voluntarily 
              assume all risks of participation.
            </span>
          </label>
        </ConsentSection>
        
        <ButtonGroup>
          <button className="cancel" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="accept" 
            disabled={!hasAgreed}
            onClick={handleAccept}
          >
            Accept Waiver & Continue
          </button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
}

export default LiabilityWaiverModal;