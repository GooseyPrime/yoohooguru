import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  color: #fbbf24;
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
  margin-top: 1.5rem;
`;

const Text = styled.p`
  color: #b0b0b0;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const PriceDisplay = styled.div`
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.2) 100%);
  border-radius: 1rem;
  margin: 2rem 0;
`;

const PriceAmount = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: #fbbf24;
  margin-bottom: 0.5rem;
`;

const PriceLabel = styled.div`
  color: #ffffff;
  font-size: 1.2rem;
`;

const PriceRange = styled.div`
  color: #b0b0b0;
  font-size: 1rem;
  margin-top: 0.5rem;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  color: #b0b0b0;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 0.5rem;
  border-left: 3px solid #fbbf24;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  color: #ffffff;
  font-size: 1rem;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: #fbbf24;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  color: #ffffff;
  font-size: 1rem;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: #fbbf24;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #000000;
  padding: 1rem 2rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
  width: 100%;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #fbbf24;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 2rem auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default function AIPriceRecommendation() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    skill: '',
    experience: 'intermediate',
    location: 'remote',
    sessionType: 'one-on-one'
  });

  const getRecommendation = async () => {
    if (!formData.skill) {
      setError('Please enter a skill');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/price-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to get price recommendation');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to generate price recommendation. Please try again.');
      console.error('Price recommendation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>💰 AI Price Recommendation</Title>
        <Text>
          Get data-driven pricing recommendations based on your skills, experience, and market conditions.
        </Text>

        {!result && (
          <>
            <Input
              type="text"
              placeholder="Your skill (e.g., React Development, Piano Lessons)"
              value={formData.skill}
              onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
            />

            <Select
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            >
              <option value="beginner">Beginner (0-2 years)</option>
              <option value="intermediate">Intermediate (2-5 years)</option>
              <option value="advanced">Advanced (5-10 years)</option>
              <option value="expert">Expert (10+ years)</option>
            </Select>

            <Select
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            >
              <option value="remote">Remote</option>
              <option value="us">United States</option>
              <option value="uk">United Kingdom</option>
              <option value="eu">European Union</option>
              <option value="asia">Asia</option>
              <option value="other">Other</option>
            </Select>

            <Select
              value={formData.sessionType}
              onChange={(e) => setFormData({ ...formData, sessionType: e.target.value })}
            >
              <option value="one-on-one">One-on-One Session</option>
              <option value="group">Group Session</option>
              <option value="workshop">Workshop</option>
              <option value="course">Full Course</option>
            </Select>

            <Button onClick={getRecommendation} disabled={isLoading}>
              {isLoading ? 'Analyzing...' : 'Get Price Recommendation'}
            </Button>
          </>
        )}

        {isLoading && <LoadingSpinner />}

        {error && (
          <div style={{ color: '#ff6b6b', textAlign: 'center', padding: '1rem' }}>
            {error}
          </div>
        )}

        {result && (
          <>
            <PriceDisplay>
              <PriceAmount>${result.recommendedPrice}</PriceAmount>
              <PriceLabel>Recommended Hourly Rate</PriceLabel>
              <PriceRange>
                Range: ${result.priceRange?.min} - ${result.priceRange?.max}
              </PriceRange>
            </PriceDisplay>

            <SectionTitle>📊 Factors Affecting Price</SectionTitle>
            <List>
              {result.factors?.map((factor: string, index: number) => (
                <ListItem key={index}>{factor}</ListItem>
              ))}
            </List>

            <SectionTitle>📈 Market Comparison</SectionTitle>
            <Card style={{ background: 'rgba(251, 191, 36, 0.1)' }}>
              <Text style={{ color: '#ffffff' }}>{result.marketComparison}</Text>
            </Card>

            <SectionTitle>💡 Pricing Strategy</SectionTitle>
            <Card style={{ background: 'rgba(251, 191, 36, 0.1)' }}>
              <Text style={{ color: '#ffffff' }}>{result.pricingStrategy}</Text>
            </Card>

            <SectionTitle>✨ Value Proposition</SectionTitle>
            <Card style={{ background: 'rgba(251, 191, 36, 0.1)' }}>
              <Text style={{ color: '#ffffff' }}>{result.valueProposition}</Text>
            </Card>

            <Button onClick={() => setResult(null)} style={{ marginTop: '2rem' }}>
              Get New Recommendation
            </Button>
          </>
        )}
      </Card>
    </Container>
  );
}