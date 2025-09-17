import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from '../components/Button';
import EarningsEstimator from '../components/EarningsEstimator';
import SEOMetadata from '../components/SEOMetadata';
import { PRICING_CONFIG } from '../config/pricing';
import { Check, Star, Zap } from 'lucide-react';

const Container = styled.div`
  min-height: calc(100vh - 140px);
  padding: 2rem 1rem;
  background: ${props => props.theme.colors.bg};
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: var(--text-3xl);
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: var(--text-lg);
  color: ${props => props.theme.colors.muted};
  text-align: center;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

const PlanCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: ${props => props.popular ? '2px solid ' + props.theme.colors.pri : '1px solid ' + props.theme.colors.border};
  border-radius: var(--r-lg);
  padding: 2rem;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadow.lg};
  }

  ${props => props.popular && `
    transform: scale(1.05);
    box-shadow: ${props.theme.shadow.lg};
    
    &:hover {
      transform: scale(1.05) translateY(-4px);
    }
  `}
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, ${props => props.theme.colors.pri} 0%, #6c5ce7 100%);
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: var(--r-full);
  font-size: var(--text-sm);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  box-shadow: 0 4px 12px rgba(124, 140, 255, 0.3);
`;

const PlanHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h3 {
    font-size: var(--text-xl);
    color: ${props => props.theme.colors.text};
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  .description {
    color: ${props => props.theme.colors.muted};
    font-size: var(--text-sm);
    line-height: 1.5;
    margin-bottom: 1.5rem;
  }

  .price {
    font-size: var(--text-3xl);
    font-weight: bold;
    color: ${props => props.theme.colors.text};
    margin-bottom: 0.25rem;
    
    .currency {
      font-size: var(--text-lg);
      vertical-align: top;
    }
  }

  .interval {
    color: ${props => props.theme.colors.muted};
    font-size: var(--text-sm);
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0;

  li {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.5rem 0;
    color: ${props => props.theme.colors.text};
    font-size: var(--text-sm);
    line-height: 1.5;

    .check-icon {
      color: ${props => props.theme.colors.suc};
      flex-shrink: 0;
      margin-top: 0.125rem;
    }

    &.limitation {
      opacity: 0.7;
      
      .check-icon {
        color: ${props => props.theme.colors.muted};
      }
    }
  }
`;

const PlanCTA = styled.div`
  margin-top: 2rem;
`;

const StripePricingSection = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: var(--r-lg);
  padding: 2rem;
  margin: 3rem 0;
  border: 1px solid ${props => props.theme.colors.border};
  text-align: center;
  
  h2 {
    font-size: var(--text-2xl);
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.text};
  }
  
  p {
    font-size: var(--text-base);
    color: ${props => props.theme.colors.muted};
    margin-bottom: 2rem;
    line-height: 1.6;
  }
  
  stripe-pricing-table {
    max-width: 100%;
    margin: 0 auto;
  }
  
  .fallback-message {
    padding: 1rem;
    background: ${props => props.theme.colors.elev};
    border-radius: var(--r-md);
    border: 1px dashed ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.muted};
    font-size: var(--text-sm);
    margin-top: 1rem;
  }
`;

function PricingPage() {
  const [stripeLoaded, setStripeLoaded] = useState(false);

  useEffect(() => {
    // Check if Stripe pricing table script is loaded
    const checkStripeLoaded = () => {
      if (typeof window !== 'undefined' && window.customElements && window.customElements.get('stripe-pricing-table')) {
        setStripeLoaded(true);
      }
    };

    // Check immediately
    checkStripeLoaded();

    // Set up interval to check for Stripe loading
    const interval = setInterval(checkStripeLoaded, 500);
    
    // Clean up after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const seoData = {
    title: 'Pricing Plans - yoohoo.guru',
    description: 'Choose the perfect plan for your skill-sharing journey. From free community access to premium professional tools.',
    keywords: 'pricing, plans, subscription, skill sharing, community, premium',
    ogTitle: 'yoohoo.guru Pricing - Find Your Perfect Plan',
    ogDescription: 'Start free or upgrade to premium features. Flexible plans for every type of skill sharer.',
    canonicalUrl: window.location.href
  };

  const handlePlanSelect = (plan) => {
    if (plan.id === 'community') {
      // Free plan - go to signup
      window.location.href = '/signup';
    } else {
      // Paid plans - integrate with Stripe
      // This would normally trigger Stripe Checkout
      console.log(`Selected plan: ${plan.id}`);
      // For now, redirect to signup with plan parameter
      window.location.href = `/signup?plan=${plan.id}`;
    }
  };

  return (
    <Container>
      <SEOMetadata {...seoData} />
      <Content>
        <Title>Choose Your Plan</Title>
        <Subtitle>
          Start free and upgrade as you grow. All plans include our core community features 
          with additional tools to help you succeed.
        </Subtitle>

        <PlansGrid>
          {PRICING_CONFIG.plans.map((plan) => (
            <PlanCard key={plan.id} popular={plan.popular}>
              {plan.popular && (
                <PopularBadge>
                  <Star size={14} />
                  Most Popular
                </PopularBadge>
              )}
              
              <PlanHeader>
                <h3>{plan.name}</h3>
                <div className="description">{plan.description}</div>
                <div className="price">
                  {plan.price === 0 ? (
                    'Free'
                  ) : (
                    <>
                      <span className="currency">$</span>
                      {plan.price}
                    </>
                  )}
                </div>
                <div className="interval">
                  {plan.interval === 'forever' ? 'Forever' : `per ${plan.interval}`}
                </div>
              </PlanHeader>

              <FeatureList>
                {plan.features.map((feature, index) => (
                  <li key={index}>
                    <Check size={16} className="check-icon" />
                    {feature}
                  </li>
                ))}
                {plan.limitations.map((limitation, index) => (
                  <li key={`limitation-${index}`} className="limitation">
                    <Check size={16} className="check-icon" />
                    {limitation}
                  </li>
                ))}
              </FeatureList>

              <PlanCTA>
                <Button
                  variant={plan.ctaVariant}
                  size="lg"
                  onClick={() => handlePlanSelect(plan)}
                  style={{ width: '100%' }}
                >
                  {plan.cta}
                </Button>
              </PlanCTA>
            </PlanCard>
          ))}
        </PlansGrid>

        {/* Stripe Pricing Table Fallback */}
        <StripePricingSection>
          <h2>Secure Payment Processing</h2>
          <p>
            All payments are processed securely through Stripe. You can cancel or change 
            your plan at any time.
          </p>
          
          {stripeLoaded && PRICING_CONFIG.stripe.publishableKey !== 'pk_test_your_stripe_publishable_key' ? (
            <stripe-pricing-table
              pricing-table-id={PRICING_CONFIG.stripe.pricingTableId}
              publishable-key={PRICING_CONFIG.stripe.publishableKey}
            ></stripe-pricing-table>
          ) : (
            <div className="fallback-message">
              🔧 <strong>Development Mode:</strong> Stripe pricing table will appear here when 
              configured with your publishable key and pricing table ID. 
              <br />
              <small>
                Set REACT_APP_STRIPE_PUBLISHABLE_KEY and REACT_APP_STRIPE_PRICING_TABLE_ID 
                in your environment variables.
              </small>
            </div>
          )}
        </StripePricingSection>

        {/* Interactive Earnings Estimator */}
        <EarningsEstimator />

        {/* Trust and Security Section */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(124, 140, 255, 0.05) 0%, rgba(46, 213, 115, 0.05) 100%)',
          borderRadius: 'var(--r-lg)',
          padding: '2rem',
          textAlign: 'center',
          margin: '3rem 0',
          border: '1px solid var(--border)'
        }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Zap size={20} />
            Why Choose yoohoo.guru?
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginTop: '2rem'
          }}>
            <div>
              <h4>🔒 Secure & Trusted</h4>
              <p>All payments processed through Stripe with bank-level security.</p>
            </div>
            <div>
              <h4>🤝 Community First</h4>
              <p>Built for neighbors helping neighbors with local connections.</p>
            </div>
            <div>
              <h4>📈 Grow Your Income</h4>
              <p>Tools and features designed to help you maximize your earnings.</p>
            </div>
            <div>
              <h4>💡 AI-Powered</h4>
              <p>Smart matching technology connects you with the right opportunities.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div style={{ textAlign: 'center', margin: '3rem 0' }}>
          <h2>Ready to Start Sharing Skills?</h2>
          <p style={{ marginBottom: '2rem', color: 'var(--muted)' }}>
            Join thousands of community members already earning and learning on yoohoo.guru
          </p>
          <Button 
            variant="primary" 
            size="lg" 
            onClick={() => window.location.href = '/signup'}
            style={{ marginRight: '1rem' }}
          >
            Get Started Free
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => window.location.href = '/how-it-works'}
          >
            Learn More
          </Button>
        </div>
      </Content>
    </Container>
  );
}

export default PricingPage;