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
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const ScoreCircle = styled.div<{ score: number }>`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: conic-gradient(
    #10b981 ${props => props.score * 3.6}deg,
    rgba(255, 255, 255, 0.1) ${props => props.score * 3.6}deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem auto;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: #0a0a1a;
  }
`;

const ScoreText = styled.div`
  position: relative;
  z-index: 1;
  color: #ffffff;
  font-size: 2rem;
  font-weight: bold;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  color: #10b981;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  color: #b0b0b0;
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
  
  &::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #10b981;
  }
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

interface AIMatchmakingProps {
  guruId: string;
  gunuId: string;
  guruData: {
    skills: string[];
    experience: string;
    availability: string;
  };
  gunuData: {
    needs: string;
    level: string;
    goals: string;
  };
}

export default function AIMatchmaking({ guruId, gunuId, guruData, gunuData }: AIMatchmakingProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeMatch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/matchmaking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guruSkills: guruData.skills,
          guruExperience: guruData.experience,
          guruAvailability: guruData.availability,
          gunuNeeds: gunuData.needs,
          gunuLevel: gunuData.level,
          gunuGoals: gunuData.goals,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze match');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to generate matchmaking analysis. Please try again.');
      console.error('Matchmaking error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>AI-Powered Matchmaking Analysis</Title>
        
        {!result && !isLoading && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#b0b0b0', marginBottom: '2rem' }}>
              Get an AI-powered compatibility analysis to see how well this Guru matches your learning needs.
            </p>
            <Button onClick={analyzeMatch}>
              Analyze Match with AI
            </Button>
          </div>
        )}

        {isLoading && <LoadingSpinner />}

        {error && (
          <div style={{ color: '#ff6b6b', textAlign: 'center', padding: '1rem' }}>
            {error}
          </div>
        )}

        {result && (
          <>
            <ScoreCircle score={result.compatibilityScore}>
              <ScoreText>{result.compatibilityScore}%</ScoreText>
            </ScoreCircle>

            <Section>
              <SectionTitle>Strengths</SectionTitle>
              <List>
                {result.strengths?.map((strength: string, index: number) => (
                  <ListItem key={index}>{strength}</ListItem>
                ))}
              </List>
            </Section>

            <Section>
              <SectionTitle>Considerations</SectionTitle>
              <List>
                {result.considerations?.map((consideration: string, index: number) => (
                  <ListItem key={index}>{consideration}</ListItem>
                ))}
              </List>
            </Section>

            <Section>
              <SectionTitle>Recommendation</SectionTitle>
              <p style={{ color: '#b0b0b0', lineHeight: '1.6' }}>
                {result.recommendation}
              </p>
            </Section>

            <Section>
              <SectionTitle>Suggested Topics to Start With</SectionTitle>
              <List>
                {result.suggestedTopics?.map((topic: string, index: number) => (
                  <ListItem key={index}>{topic}</ListItem>
                ))}
              </List>
            </Section>
          </>
        )}
      </Card>
    </Container>
  );
}