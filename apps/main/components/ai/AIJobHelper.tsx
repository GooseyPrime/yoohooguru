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
  color: #3b82f6;
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
  border-left: 3px solid #3b82f6;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border-radius: 1rem;
  font-size: 0.875rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
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
    border-color: #3b82f6;
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
    border-color: #3b82f6;
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
    border-color: #3b82f6;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
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
  border-top: 3px solid #3b82f6;
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

export default function AIJobHelper() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    jobTitle: '',
    category: 'coding',
    requirements: ''
  });

  const getHelp = async () => {
    if (!formData.jobTitle) {
      setError('Please enter a job title');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/job-helper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to get job posting help');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to generate job posting assistance. Please try again.');
      console.error('Job helper error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>🚀 AI Job Posting Helper</Title>
        <Text>
          Create compelling job postings that attract the right candidates with AI-powered recommendations.
        </Text>

        {!result && (
          <>
            <Input
              type="text"
              placeholder="Job Title (e.g., React Developer, Graphic Designer)"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
            />

            <Select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="coding">Programming & Development</option>
              <option value="design">Design & Creative</option>
              <option value="writing">Writing & Content</option>
              <option value="marketing">Marketing & Sales</option>
              <option value="business">Business & Consulting</option>
              <option value="data">Data & Analytics</option>
              <option value="other">Other</option>
            </Select>

            <TextArea
              placeholder="Basic requirements or description (optional - AI will enhance this)"
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            />

            <Button onClick={getHelp} disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Get AI Recommendations'}
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
            <SectionTitle>✨ Improved Job Title</SectionTitle>
            <Card style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <Text style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: 'bold' }}>
                {result.improvedTitle}
              </Text>
            </Card>

            <SectionTitle>📝 Compelling Description</SectionTitle>
            <Card style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <Text style={{ color: '#ffffff' }}>{result.description}</Text>
            </Card>

            <SectionTitle>🎯 Required Skills</SectionTitle>
            <div>
              {result.requiredSkills?.map((skill: string, index: number) => (
                <Badge key={index}>{skill}</Badge>
              ))}
            </div>

            <SectionTitle>⭐ Nice-to-Have Skills</SectionTitle>
            <div>
              {result.niceToHaveSkills?.map((skill: string, index: number) => (
                <Badge key={index} style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                  {skill}
                </Badge>
              ))}
            </div>

            <SectionTitle>📋 Key Responsibilities</SectionTitle>
            <List>
              {result.responsibilities?.map((responsibility: string, index: number) => (
                <ListItem key={index}>{responsibility}</ListItem>
              ))}
            </List>

            <SectionTitle>🎓 Qualifications</SectionTitle>
            <List>
              {result.qualifications?.map((qualification: string, index: number) => (
                <ListItem key={index}>{qualification}</ListItem>
              ))}
            </List>

            <SectionTitle>💰 Budget Guidance</SectionTitle>
            <Card style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <Text style={{ color: '#ffffff' }}>{result.budgetGuidance}</Text>
            </Card>

            <SectionTitle>🔑 SEO Keywords</SectionTitle>
            <div>
              {result.keywords?.map((keyword: string, index: number) => (
                <Badge key={index}>{keyword}</Badge>
              ))}
            </div>

            <Button onClick={() => setResult(null)} style={{ marginTop: '2rem' }}>
              Create Another Job Posting
            </Button>
          </>
        )}
      </Card>
    </Container>
  );
}