import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const Container = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  padding: 2rem;
`;

const Content = styled.div`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

function OnboardingPayout() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [payoutMethod, setPayoutMethod] = useState('');

  const handleMethodSelect = (method) => {
    setPayoutMethod(method);
  };

  const handleContinue = () => {
    // This line contains the unescaped single quote that needs to be fixed
    console.log('User selected payout method and we&apos;re ready to continue');
    navigate('/dashboard');
  };

  return (
    <Container theme={theme}>
      <Content>
        <Title theme={theme}>Set Up Your Payout</Title>
        <p>Choose how you&apos;d like to receive payments for your skills.</p>
        
        <div style={{ margin: '2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            onClick={() => handleMethodSelect('paypal')}
            style={{
              padding: '1rem',
              border: payoutMethod === 'paypal' ? '2px solid var(--primary)' : '1px solid var(--border)',
              borderRadius: '8px',
              cursor: 'pointer',
              background: payoutMethod === 'paypal' ? 'var(--primary-light)' : 'var(--surface)'
            }}
          >
            <h3>PayPal</h3>
            <p>Quick and secure payments</p>
          </div>
          
          <div
            onClick={() => handleMethodSelect('stripe')}
            style={{
              padding: '1rem',
              border: payoutMethod === 'stripe' ? '2px solid var(--primary)' : '1px solid var(--border)',
              borderRadius: '8px',
              cursor: 'pointer',
              background: payoutMethod === 'stripe' ? 'var(--primary-light)' : 'var(--surface)'
            }}
          >
            <h3>Bank Transfer (Stripe)</h3>
            <p>Direct to your bank account</p>
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={!payoutMethod}
          style={{
            padding: '1rem 2rem',
            background: payoutMethod ? 'var(--primary)' : 'var(--gray-400)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: payoutMethod ? 'pointer' : 'not-allowed',
            fontSize: '1rem'
          }}
        >
          Complete Setup
        </button>
      </Content>
    </Container>
  );
}

export default OnboardingPayout;