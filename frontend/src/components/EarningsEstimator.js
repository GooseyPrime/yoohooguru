import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Calculator, TrendingUp, MapPin, Star } from 'lucide-react';
import { EARNINGS_DATA } from '../config/pricing';
import Button from './Button';

const EstimatorContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: var(--r-lg);
  padding: 2rem;
  margin: 2rem 0;
  border: 1px solid ${props => props.theme.colors.border};
`;

const EstimatorHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  h2 {
    font-size: var(--text-2xl);
    color: ${props => props.theme.colors.text};
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  p {
    color: ${props => props.theme.colors.muted};
    line-height: 1.6;
  }
`;

const EstimatorForm = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;

  label {
    font-weight: 500;
    color: ${props => props.theme.colors.text};
    margin-bottom: 0.5rem;
    font-size: var(--text-sm);
  }

  select, input {
    padding: 0.75rem;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: var(--r-md);
    background: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.text};
    font-size: var(--text-sm);

    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.pri};
      box-shadow: 0 0 0 3px rgba(124, 140, 255, 0.1);
    }
  }

  .range-display {
    font-size: var(--text-xs);
    color: ${props => props.theme.colors.muted};
    margin-top: 0.25rem;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`;

const CategoryCard = styled.div`
  border: 2px solid ${props => props.selected ? props.theme.colors.pri : props.theme.colors.border};
  border-radius: var(--r-md);
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.selected ? 'rgba(124, 140, 255, 0.05)' : props.theme.colors.surface};

  &:hover {
    border-color: ${props => props.theme.colors.pri};
    background: rgba(124, 140, 255, 0.02);
  }

  .icon {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .name {
    font-size: var(--text-xs);
    color: ${props => props.theme.colors.text};
    font-weight: 500;
  }
`;

const EstimateResults = styled.div`
  background: linear-gradient(135deg, rgba(124, 140, 255, 0.1) 0%, rgba(46, 213, 115, 0.1) 100%);
  border-radius: var(--r-md);
  padding: 2rem;
  text-align: center;
  margin: 1.5rem 0;
`;

const EarningsDisplay = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 1.5rem 0;
`;

const EarningsStat = styled.div`
  text-align: center;

  .value {
    font-size: var(--text-2xl);
    font-weight: bold;
    color: ${props => props.theme.colors.pri};
    margin-bottom: 0.25rem;
  }

  .label {
    font-size: var(--text-sm);
    color: ${props => props.theme.colors.muted};
    font-weight: 500;
  }

  .sublabel {
    font-size: var(--text-xs);
    color: ${props => props.theme.colors.muted};
    margin-top: 0.25rem;
  }
`;

const BreakdownSection = styled.div`
  margin-top: 1.5rem;
  
  h4 {
    font-size: var(--text-md);
    color: ${props => props.theme.colors.text};
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const SkillList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const SkillItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: ${props => props.theme.colors.elev};
  border-radius: var(--r-sm);

  .skill-name {
    font-size: var(--text-sm);
    color: ${props => props.theme.colors.text};
  }

  .skill-rate {
    font-size: var(--text-sm);
    font-weight: 600;
    color: ${props => props.theme.colors.pri};
  }

  .demand-indicator {
    font-size: var(--text-xs);
    padding: 0.25rem 0.5rem;
    border-radius: var(--r-sm);
    margin-left: 0.5rem;

    &.very-high {
      background: rgba(39, 174, 96, 0.2);
      color: #27ae60;
    }

    &.high {
      background: rgba(52, 152, 219, 0.2);
      color: #3498db;
    }

    &.medium {
      background: rgba(241, 196, 15, 0.2);
      color: #f1c40f;
    }

    &.low {
      background: rgba(231, 76, 60, 0.2);
      color: #e74c3c;
    }
  }
`;

function EarningsEstimator() {
  const [selectedCategory, setSelectedCategory] = useState('tutoring');
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [experience, setExperience] = useState('intermediate');
  const [locationType, setLocationType] = useState('suburban');
  const [estimatedEarnings, setEstimatedEarnings] = useState({
    hourly: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0
  });

  useEffect(() => {
    calculateEarnings();
  }, [selectedCategory, hoursPerWeek, experience, locationType]);

  const calculateEarnings = () => {
    const category = EARNINGS_DATA.categories.find(cat => cat.id === selectedCategory);
    if (!category) return;

    const baseRate = category.baseRate;
    const demandMultiplier = category.demandMultiplier;
    const experienceMultiplier = EARNINGS_DATA.experienceMultipliers[experience];
    const locationMultiplier = EARNINGS_DATA.locationMultipliers[locationType];

    const hourlyRate = Math.round(baseRate * demandMultiplier * experienceMultiplier * locationMultiplier);
    const weeklyEarnings = hourlyRate * hoursPerWeek;
    const monthlyEarnings = weeklyEarnings * 4.33; // Average weeks per month
    const yearlyEarnings = monthlyEarnings * 12;

    setEstimatedEarnings({
      hourly: hourlyRate,
      weekly: weeklyEarnings,
      monthly: Math.round(monthlyEarnings),
      yearly: Math.round(yearlyEarnings)
    });
  };

  const selectedCategoryData = EARNINGS_DATA.categories.find(cat => cat.id === selectedCategory);
  const formatCurrency = (amount) => `$${amount.toLocaleString()}`;

  return (
    <EstimatorContainer>
      <EstimatorHeader>
        <h2>
          <Calculator size={24} />
          Earnings Estimator
        </h2>
        <p>
          Estimate your potential earnings based on your skills, experience, and location.
          These are average rates from our community data.
        </p>
      </EstimatorHeader>

      <EstimatorForm>
        <FormGroup>
          <label htmlFor="category">Service Category</label>
          <CategoryGrid>
            {EARNINGS_DATA.categories.map(category => (
              <CategoryCard
                key={category.id}
                selected={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div className="icon">{category.icon}</div>
                <div className="name">{category.name}</div>
              </CategoryCard>
            ))}
          </CategoryGrid>
        </FormGroup>

        <FormGroup>
          <label htmlFor="hours">Hours per week</label>
          <input
            type="range"
            id="hours"
            min="1"
            max="40"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
          />
          <div className="range-display">{hoursPerWeek} hours per week</div>
        </FormGroup>

        <FormGroup>
          <label htmlFor="experience">Experience Level</label>
          <select
            id="experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          >
            <option value="beginner">Beginner (0-1 years)</option>
            <option value="intermediate">Intermediate (1-3 years)</option>
            <option value="experienced">Experienced (3-5 years)</option>
            <option value="expert">Expert (5+ years)</option>
          </select>
        </FormGroup>

        <FormGroup>
          <label htmlFor="location">Location Type</label>
          <select
            id="location"
            value={locationType}
            onChange={(e) => setLocationType(e.target.value)}
          >
            <option value="urban">Urban / City</option>
            <option value="suburban">Suburban</option>
            <option value="rural">Rural</option>
          </select>
        </FormGroup>
      </EstimatorForm>

      <EstimateResults>
        <h3>Your Estimated Earnings</h3>
        <EarningsDisplay>
          <EarningsStat>
            <div className="value">{formatCurrency(estimatedEarnings.hourly)}</div>
            <div className="label">Per Hour</div>
          </EarningsStat>
          <EarningsStat>
            <div className="value">{formatCurrency(estimatedEarnings.weekly)}</div>
            <div className="label">Per Week</div>
            <div className="sublabel">{hoursPerWeek} hours</div>
          </EarningsStat>
          <EarningsStat>
            <div className="value">{formatCurrency(estimatedEarnings.monthly)}</div>
            <div className="label">Per Month</div>
            <div className="sublabel">~17 hours monthly</div>
          </EarningsStat>
          <EarningsStat>
            <div className="value">{formatCurrency(estimatedEarnings.yearly)}</div>
            <div className="label">Per Year</div>
            <div className="sublabel">Part-time income</div>
          </EarningsStat>
        </EarningsDisplay>

        <Button 
          variant="primary" 
          onClick={() => window.location.href = '/signup'}
          style={{ marginTop: '1rem' }}
        >
          Start Earning Today
        </Button>
      </EstimateResults>

      {selectedCategoryData && (
        <BreakdownSection>
          <h4>
            <TrendingUp size={18} />
            Popular {selectedCategoryData.name} Services
          </h4>
          <SkillList>
            {selectedCategoryData.skills.map((skill, index) => (
              <SkillItem key={index}>
                <div>
                  <span className="skill-name">{skill.name}</span>
                  <span className={`demand-indicator ${skill.demand}`}>
                    {skill.demand.replace('-', ' ')} demand
                  </span>
                </div>
                <span className="skill-rate">${skill.rate}/hr</span>
              </SkillItem>
            ))}
          </SkillList>
        </BreakdownSection>
      )}

      <div style={{ 
        textAlign: 'center', 
        marginTop: '2rem', 
        padding: '1rem',
        background: 'rgba(124, 140, 255, 0.05)',
        borderRadius: 'var(--r-md)',
        fontSize: 'var(--text-sm)',
        color: 'var(--muted)'
      }}>
        💡 <strong>Tip:</strong> Actual earnings may vary based on demand, seasonality, 
        and individual performance. These estimates are based on community averages.
      </div>
    </EstimatorContainer>
  );
}

export default EarningsEstimator;