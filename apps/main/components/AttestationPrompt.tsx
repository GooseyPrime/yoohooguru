import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const PromptOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
`;

const PromptCard = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 3rem;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
`;

const Icon = styled.div`
  font-size: 4rem;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  color: #ffffff;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: #b0b0b0;
  text-align: center;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.variant === 'primary' ? `
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
    }
  ` : `
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  `}
`;

interface AttestationPromptProps {
  userRole: string;
  onDismiss: () => void;
}

export default function AttestationPrompt({ userRole, onDismiss }: AttestationPromptProps) {
  const router = useRouter();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Check if user needs to see attestation prompt
    const checkAttestationStatus = async () => {
      try {
        const response = await fetch('/api/backend/attestation/disability/status');
        if (response.ok) {
          const data = await response.json();
          
          // Show prompt if user is a Gunu and hasn't attested
          if (userRole === 'gunu' && !data.data.attested) {
            setShouldShow(true);
          }
        }
      } catch (error) {
        console.error('Error checking attestation status:', error);
      }
    };

    checkAttestationStatus();
  }, [userRole]);

  const handleComplete = () => {
    router.push('/attestation/disability');
  };

  const handleLater = () => {
    setShouldShow(false);
    onDismiss();
  };

  if (!shouldShow) {
    return null;
  }

  return (
    <PromptOverlay>
      <PromptCard>
        <Icon>♿</Icon>
        <Title>Access Hero Gurus Program</Title>
        <Description>
          Would you like to access our Hero Gurus program? This program provides free learning sessions
          from volunteer Gurus for individuals with disabilities.
          <br /><br />
          To access this program, you'll need to complete a simple disability self-attestation form.
          This helps us ensure the program serves those it was designed for.
        </Description>
        <ButtonGroup>
          <Button variant="primary" onClick={handleComplete}>
            Complete Attestation Now
          </Button>
          <Button variant="secondary" onClick={handleLater}>
            Maybe Later
          </Button>
        </ButtonGroup>
      </PromptCard>
    </PromptOverlay>
  );
}