
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '../../components/Button';

const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem;
  background: ${props => props.theme.colors.bg};
  min-height: calc(100vh - 140px);
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: ${props => props.theme.colors.muted};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const StatusCard = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.lg}px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 2rem;
  background: ${props => props.theme.colors.surface};
`;

const StatusTitle = styled.h3`
  color: ${props => props.success ? props.theme.colors.succ : props.theme.colors.text};
  margin-bottom: 1rem;
`;

const StatusText = styled.p`
  color: ${props => props.theme.colors.muted};
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const StatusDetails = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.muted};
  margin-bottom: 0.5rem;
`;

const ErrorText = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.err};
  margin-bottom: 1rem;
`;

const SecondaryButton = styled.button`
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.md}px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.theme.colors.pri};
  }
`;

const ContinueSection = styled.div`
  text-align: center;
`;

export default function OnboardingPayout() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/connect/status', { credentials: 'include' });
      const json = await res.json();
      setStatus(json);
    } catch {
      setStatus(null);
    }
  };

  useEffect(() => { fetchStatus(); }, []);

  const start = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/connect/start', { method: 'POST', headers: { 'Content-Type':'application/json' }, credentials: 'include' });
      const json = await res.json();
      if (json?.url) window.location.href = json.url;
    } finally {
      setLoading(false);
    }
  };

  const ready = status?.connected && status?.charges_enabled && status?.payouts_enabled && status?.details_submitted;

  return (
    <Container>
      <Title>Setup Payout Method</Title>
      <Description>Connect your bank account to receive payments for your services.</Description>
      
      <StatusCard>
        {ready ? (
          <div>
            <StatusTitle success>✅ Payouts Connected</StatusTitle>
            <StatusText>Your payout method is ready to receive payments.</StatusText>
            <SecondaryButton onClick={fetchStatus}>
              Refresh Status
            </SecondaryButton>
          </div>
        ) : (
          <div>
            <StatusTitle>Connect Your Payout Method</StatusTitle>
            {status?.connected ? (
              <div>
                <StatusText>Your Stripe account needs additional setup.</StatusText>
                <StatusDetails>
                  Charges: {status?.charges_enabled ? '✅' : '❌'} | 
                  Payouts: {status?.payouts_enabled ? '✅' : '❌'} | 
                  Details: {status?.details_submitted ? '✅' : '❌'}
                </StatusDetails>
                {status?.currently_due?.length > 0 && (
                  <ErrorText>
                    Missing: {status.currently_due.join(', ')}
                  </ErrorText>
                )}
              </div>
            ) : (
              <StatusText>Connect your bank account through Stripe to receive payments.</StatusText>
            )}
            <Button 
              onClick={start}
              disabled={loading}
              variant="primary"
              style={{marginTop: '1rem'}}
            >
              {loading ? 'Connecting...' : 'Connect Payouts'}
            </Button>
          </div>
        )}
      </StatusCard>

      <ContinueSection>
        <Button 
          onClick={() => window.location.href = '/onboarding/review'}
          disabled={!ready}
          variant={ready ? "primary" : "secondary"}
          size="lg"
        >
          Continue to Review
        </Button>
      </ContinueSection>
    </Container>
  );
}
