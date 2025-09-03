
import React from 'react';
import ComingSoon from '../../components/ComingSoon';
import Button from '../../components/Button';

export default function OnboardingPayout() {
  // This would integrate with Stripe Connect Express onboarding in production
  const handleSetupPayout = () => {
    // For demo purposes, we'll just mark as ready
    // In production, this would redirect to Stripe Express onboarding
    alert('Payout setup is Coming Soon. For demo, we\'ll mark as complete.');
    // Temporarily set payout_ready for demo
    window.location.href = '/onboarding/review';
  };

  return (
    <div style={{maxWidth: '720px', margin: '0 auto', padding: '2rem'}}>
      <h2>Setup Payout Method</h2>
      <p>Connect your bank account to receive payments for your services.</p>
      
      <div style={{border: '1px solid #e5e7eb', borderRadius: '8px', padding: '2rem', textAlign: 'center', marginBottom: '2rem'}}>
        <h3>Stripe Connect Integration <ComingSoon /></h3>
        <p style={{color: '#6b7280', marginBottom: '1.5rem'}}>
          Secure bank account setup and instant payouts will be available soon.
        </p>
        <Button onClick={handleSetupPayout} variant="primary">
          Setup Payout (Demo)
        </Button>
      </div>

      <div style={{fontSize: '0.875rem', color: '#6b7280'}}>
        <h4>What you&apos;ll need:</h4>
        <ul>
          <li>Bank account information</li>
          <li>Tax ID (SSN or EIN)</li>
          <li>Government-issued ID</li>
          <li>Business details (if applicable)</li>
        </ul>
      </div>

      <div style={{marginTop: '2rem'}}>
        <a href="/onboarding/review" style={{color: 'var(--primary)', textDecoration: 'none'}}>
          Continue to Review →
        </a>
      </div>
    </div>
  );
}
