import { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1000px;
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
  color: #8b5cf6;
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
  margin-top: 1.5rem;
`;

const Text = styled.p`
  color: #b0b0b0;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const CandidateCard = styled.div`
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const CandidateName = styled.h4`
  color: #ffffff;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const CandidateRank = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: bold;
  margin-right: 0.5rem;
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
  border-left: 3px solid #8b5cf6;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
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

const LoadingSpinner = styled.div`
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #8b5cf6;
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

const TopPickBanner = styled.div`
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  font-weight: bold;
  margin-bottom: 1rem;
`;

interface AICandidateSelectionProps {
  jobDescription: string;
  candidates: Array<{
    name: string;
    skills: string[];
    experience: string;
    rating: number;
  }>;
}

export default function AICandidateSelection({ jobDescription, candidates }: AICandidateSelectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeCandidate = async () => {
    if (!candidates || candidates.length === 0) {
      setError('No candidates to analyze');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/candidate-selection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobDescription,
          candidates
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze candidates');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to generate candidate analysis. Please try again.');
      console.error('Candidate selection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>🎯 AI Candidate Selection</Title>
        <Text>
          Get AI-powered analysis to identify the best candidates for your position.
        </Text>

        {!result && !isLoading && (
          <div style={{ textAlign: 'center' }}>
            <Text>
              Analyzing {candidates.length} candidate{candidates.length !== 1 ? 's' : ''} for this position.
            </Text>
            <Button onClick={analyzeCandidate}>
              Analyze Candidates with AI
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
            <SectionTitle>🏆 Top Pick</SectionTitle>
            <TopPickBanner>
              ⭐ Best Match: {result.topPick?.name}
            </TopPickBanner>
            <Card style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
              <Text style={{ color: '#ffffff' }}>{result.topPick?.reasoning}</Text>
            </Card>

            <SectionTitle>📊 Ranked Candidates</SectionTitle>
            {result.rankedCandidates?.map((candidate: any, index: number) => (
              <CandidateCard key={index}>
                <div style={{ marginBottom: '1rem' }}>
                  <CandidateRank>#{index + 1}</CandidateRank>
                  <CandidateName style={{ display: 'inline' }}>{candidate.name}</CandidateName>
                </div>
                <Text style={{ color: '#ffffff' }}>{candidate.analysis}</Text>
              </CandidateCard>
            ))}

            <SectionTitle>📋 Detailed Analysis</SectionTitle>
            {result.analysis?.map((analysis: any, index: number) => (
              <Card key={index} style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
                <CandidateName>{analysis.candidate}</CandidateName>
                <Text style={{ color: '#ffffff' }}>{analysis.details}</Text>
              </Card>
            ))}

            <SectionTitle>❓ Interview Questions</SectionTitle>
            <List>
              {result.interviewQuestions?.map((question: string, index: number) => (
                <ListItem key={index}>{question}</ListItem>
              ))}
            </List>

            {result.redFlags && result.redFlags.length > 0 && (
              <>
                <SectionTitle>⚠️ Red Flags to Investigate</SectionTitle>
                <List>
                  {result.redFlags.map((flag: string, index: number) => (
                    <ListItem key={index} style={{ borderLeftColor: '#ff6b6b' }}>
                      {flag}
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            <SectionTitle>💡 Recommendations</SectionTitle>
            <Card style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
              <Text style={{ color: '#ffffff' }}>{result.recommendations}</Text>
            </Card>

            <Button onClick={() => setResult(null)} style={{ marginTop: '2rem' }}>
              Analyze Again
            </Button>
          </>
        )}
      </Card>
    </Container>
  );
}