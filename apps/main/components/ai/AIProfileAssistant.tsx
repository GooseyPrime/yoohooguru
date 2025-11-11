import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 900px;
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
  color: #667eea;
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
  margin-top: 1.5rem;
`;

const Text = styled.p`
  color: #b0b0b0;
  line-height: 1.6;
  margin-bottom: 1rem;
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
  border-left: 3px solid #667eea;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  border-radius: 1rem;
  font-size: 0.875rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  color: #ffffff;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const LoadingSpinner = styled.div`
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #667eea;
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

interface AIProfileAssistantProps {
  userType: 'guru' | 'gunu' | 'angel' | 'hero';
  currentProfile: any;
}

export default function AIProfileAssistant({ userType, currentProfile }: AIProfileAssistantProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [goals, setGoals] = useState('');

  const getAssistance = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/profile-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userType,
          currentProfile,
          goals: goals || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get profile assistance');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to generate profile assistance. Please try again.');
      console.error('Profile assistant error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>🤖 AI Profile Assistant</Title>
        <Text>
          Get personalized recommendations to optimize your profile and stand out to potential matches.
        </Text>

        {!result && (
          <>
            <TextArea
              placeholder="What are your goals? (Optional - helps us provide better recommendations)"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
            />
            <Button onClick={getAssistance} disabled={isLoading}>
              {isLoading ? 'Analyzing...' : 'Get AI Recommendations'}
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
            <SectionTitle>💡 Profile Suggestions</SectionTitle>
            <List>
              {result.suggestions?.map((suggestion: string, index: number) => (
                <ListItem key={index}>{suggestion}</ListItem>
              ))}
            </List>

            <SectionTitle>⚠️ Missing Elements</SectionTitle>
            <List>
              {result.missingElements?.map((element: string, index: number) => (
                <ListItem key={index}>{element}</ListItem>
              ))}
            </List>

            <SectionTitle>💪 Strength Areas</SectionTitle>
            <List>
              {result.strengthAreas?.map((area: string, index: number) => (
                <ListItem key={index}>{area}</ListItem>
              ))}
            </List>

            <SectionTitle>✨ Optimized Bio</SectionTitle>
            <Card style={{ background: 'rgba(102, 126, 234, 0.1)' }}>
              <Text style={{ color: '#ffffff' }}>{result.optimizedBio}</Text>
            </Card>

            <SectionTitle>🔑 Keyword Recommendations</SectionTitle>
            <div>
              {result.keywordRecommendations?.map((keyword: string, index: number) => (
                <Badge key={index}>{keyword}</Badge>
              ))}
            </div>

            <SectionTitle>🎯 Next Steps</SectionTitle>
            <List>
              {result.nextSteps?.map((step: string, index: number) => (
                <ListItem key={index}>{step}</ListItem>
              ))}
            </List>

            <Button onClick={() => setResult(null)} style={{ marginTop: '2rem' }}>
              Get New Recommendations
            </Button>
          </>
        )}
      </Card>
    </Container>
  );
}