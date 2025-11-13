import { useState } from 'react';
import styled from 'styled-components';
import type { AITeachingAssistanceResponse } from '@/lib/openai';

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
  color: #10b981;
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
  border-left: 3px solid #10b981;
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
    border-color: #10b981;
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
    border-color: #10b981;
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
    border-color: #10b981;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
  border-top: 3px solid #10b981;
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

const ExampleCard = styled.div`
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 0.75rem;
`;

export default function AITeachingAssistant() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AITeachingAssistanceResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    topic: '',
    studentLevel: 'beginner',
    learningStyle: 'visual',
    specificQuestion: ''
  });

  const getAssistance = async () => {
    if (!formData.topic) {
      setError('Please enter a topic');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/teaching-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to get teaching assistance');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to generate teaching assistance. Please try again.');
      console.error('Teaching assistant error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>🎓 AI Teaching Assistant</Title>
        <Text>
          Get AI-powered teaching recommendations tailored to your student's level and learning style.
        </Text>

        {!result && (
          <>
            <Input
              type="text"
              placeholder="Topic (e.g., React Hooks, Python Basics)"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            />

            <Select
              value={formData.studentLevel}
              onChange={(e) => setFormData({ ...formData, studentLevel: e.target.value })}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </Select>

            <Select
              value={formData.learningStyle}
              onChange={(e) => setFormData({ ...formData, learningStyle: e.target.value })}
            >
              <option value="visual">Visual Learner</option>
              <option value="auditory">Auditory Learner</option>
              <option value="kinesthetic">Kinesthetic Learner</option>
              <option value="reading">Reading/Writing Learner</option>
            </Select>

            <TextArea
              placeholder="Specific question or challenge (optional)"
              value={formData.specificQuestion}
              onChange={(e) => setFormData({ ...formData, specificQuestion: e.target.value })}
            />

            <Button onClick={getAssistance} disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Get Teaching Recommendations'}
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
            <SectionTitle>📚 Teaching Approach</SectionTitle>
            <Card style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
              <Text style={{ color: '#ffffff' }}>{result.teachingApproach}</Text>
            </Card>

            <SectionTitle>🎯 Key Points to Cover</SectionTitle>
            <List>
              {result.keyPoints?.map((point: string, index: number) => (
                <ListItem key={index}>{point}</ListItem>
              ))}
            </List>

            <SectionTitle>💡 Examples</SectionTitle>
            {result.examples?.map((example: string, index: number) => (
              <ExampleCard key={index}>
                <Text style={{ color: '#ffffff', marginBottom: 0 }}>{example}</Text>
              </ExampleCard>
            ))}

            <SectionTitle>✏️ Practice Exercises</SectionTitle>
            <List>
              {result.exercises?.map((exercise: string, index: number) => (
                <ListItem key={index}>{exercise}</ListItem>
              ))}
            </List>

            <SectionTitle>❓ Assessment Questions</SectionTitle>
            <List>
              {result.assessmentQuestions?.map((question: string, index: number) => (
                <ListItem key={index}>{question}</ListItem>
              ))}
            </List>

            <SectionTitle>📖 Recommended Resources</SectionTitle>
            <List>
              {result.resources?.map((resource: string, index: number) => (
                <ListItem key={index}>{resource}</ListItem>
              ))}
            </List>

            <SectionTitle>⚠️ Common Mistakes to Watch For</SectionTitle>
            <List>
              {result.commonMistakes?.map((mistake: string, index: number) => (
                <ListItem key={index}>{mistake}</ListItem>
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