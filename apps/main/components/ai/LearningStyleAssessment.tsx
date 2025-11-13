import { useState } from 'react';
import styled from 'styled-components';

const AssessmentContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const AssessmentHeader = styled.h2`
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const AssessmentDescription = styled.p`
  color: #b0b0b0;
  font-size: 1.1rem;
  line-height: 1.6;
  text-align: center;
  margin-bottom: 2rem;
`;

const QuestionContainer = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 1rem;
`;

const QuestionText = styled.h3`
  color: #ffffff;
  font-size: 1.3rem;
  margin-bottom: 1rem;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #b0b0b0;
  padding: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }
`;

const OptionInput = styled.input`
  margin: 0;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`;

const NavButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  background: #667eea;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #5a6fd8;
  }
  
  &:disabled {
    background: #555;
    cursor: not-allowed;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin-bottom: 2rem;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ percentage: number }>`
  height: 100%;
  background: #667eea;
  width: ${props => props.percentage}%;
  transition: width 0.3s;
`;

const ResultsContainer = styled.div`
  text-align: center;
  padding: 2rem;
`;

const ResultsTitle = styled.h2`
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const ResultsDescription = styled.p`
  color: #b0b0b0;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const LearningStyle = styled.div`
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  padding: 1rem;
  border-radius: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
`;

const Recommendation = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  text-align: left;
`;

const RecommendationTitle = styled.h3`
  color: #ffffff;
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
`;

const RecommendationDescription = styled.p`
  color: #b0b0b0;
  line-height: 1.6;
`;

const RecommendationButton = styled.button`
  background: #667eea;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 1rem;
  
  &:hover {
    background: #5a6fd8;
  }
`;

interface Question {
  id: number;
  text: string;
  options: { id: number; text: string }[];
}

interface AssessmentResults {
  learningStyle: string;
  description: string;
  recommendations: {
    title: string;
    description: string;
  }[];
}

export default function LearningStyleAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: number}>({});
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [results, setResults] = useState<AssessmentResults | null>(null);
  
  const questions: Question[] = [
    {
      id: 1,
      text: 'When learning something new, I prefer to:',
      options: [
        { id: 1, text: 'Watch videos or demonstrations' },
        { id: 2, text: 'Listen to explanations or discussions' },
        { id: 3, text: 'Read written materials or instructions' },
        { id: 4, text: 'Try it out myself with hands-on practice' }
      ]
    },
    {
      id: 2,
      text: 'I find it easiest to remember information when:',
      options: [
        { id: 1, text: 'I can visualize it or see diagrams' },
        { id: 2, text: 'I hear it explained aloud' },
        { id: 3, text: 'I write it down or read it' },
        { id: 4, text: 'I can physically interact with it' }
      ]
    },
    {
      id: 3,
      text: 'During a learning session, I prefer:',
      options: [
        { id: 1, text: 'Visual examples and illustrations' },
        { id: 2, text: 'Discussion and verbal explanations' },
        { id: 3, text: 'Written notes and materials' },
        { id: 4, text: 'Hands-on activities and practice' }
      ]
    },
    {
      id: 4,
      text: 'When solving problems, I typically:',
      options: [
        { id: 1, text: 'Draw diagrams or sketch ideas' },
        { id: 2, text: 'Talk through the problem out loud' },
        { id: 3, text: 'Write down steps and analyze text' },
        { id: 4, text: 'Experiment with different approaches' }
      ]
    },
    {
      id: 5,
      text: 'My ideal learning environment includes:',
      options: [
        { id: 1, text: 'Charts, images, and visual aids' },
        { id: 2, text: 'Group discussions and conversations' },
        { id: 3, text: 'Books, articles, and written resources' },
        { id: 4, text: 'Interactive tools and real-world practice' }
      ]
    }
  ];
  
  const handleAnswerSelect = (questionId: number, optionId: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };
  
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Complete assessment and generate results
      completeAssessment();
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };
  
  const completeAssessment = () => {
    // In a real implementation, this would call the OpenRouter API
    // to analyze the answers and generate personalized results
    
    // Mock results based on answers
    const mockResults: AssessmentResults = {
      learningStyle: 'Kinesthetic Learner',
      description: 'You learn best through hands-on experience and physical activities. You prefer to "learn by doing" and benefit from interactive sessions where you can practice skills directly.',
      recommendations: [
        {
          title: 'Find Interactive Gurus',
          description: 'Look for Gurus who offer hands-on learning experiences and practical exercises. These sessions will help you retain information better through active participation.'
        },
        {
          title: 'Schedule Regular Practice',
          description: 'Set aside time each week to practice new skills physically. This might include coding projects, cooking practice, or fitness routines depending on your interests.'
        },
        {
          title: 'Use Active Learning Techniques',
          description: 'Engage with learning materials through role-playing, simulations, or building projects. This approach will maximize your learning potential.'
        }
      ]
    };
    
    setResults(mockResults);
    setAssessmentComplete(true);
  };
  
  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;
  
  if (assessmentComplete && results) {
    return (
      <AssessmentContainer>
        <ResultsContainer>
          <ResultsTitle>Learning Style Assessment Complete</ResultsTitle>
          <ResultsDescription>
            Based on your responses, we've identified your preferred learning style and
            recommendations for maximizing your learning potential.
          </ResultsDescription>
          
          <LearningStyle>
            {results.learningStyle}
          </LearningStyle>
          
          <p style={{color: '#b0b0b0', lineHeight: '1.6', marginBottom: '2rem'}}>
            {results.description}
          </p>
          
          <h3 style={{color: '#ffffff', marginBottom: '1rem'}}>Personalized Recommendations</h3>
          
          {results.recommendations.map((rec, index) => (
            <Recommendation key={index}>
              <RecommendationTitle>{rec.title}</RecommendationTitle>
              <RecommendationDescription>{rec.description}</RecommendationDescription>
            </Recommendation>
          ))}
          
          <RecommendationButton onClick={() => window.location.href = '/skills'}>
            Find Gurus Matching Your Style
          </RecommendationButton>
        </ResultsContainer>
      </AssessmentContainer>
    );
  }
  
  const currentQ = questions[currentQuestion];
  
  return (
    <AssessmentContainer>
      <AssessmentHeader>AI Learning Style Assessment</AssessmentHeader>
      <AssessmentDescription>
        Answer a few questions to help us understand your preferred learning style.
        We&apos;ll use this information to match you with the most suitable Gurus.
      </AssessmentDescription>
      
      <ProgressBar>
        <ProgressFill percentage={progressPercentage} />
      </ProgressBar>
      
      <QuestionContainer>
        <QuestionText>
          Question {currentQuestion + 1} of {questions.length}: {currentQ.text}
        </QuestionText>
        
        <OptionsContainer>
          {currentQ.options.map(option => (
            <OptionLabel key={option.id}>
              <OptionInput
                type="radio"
                name={`question-${currentQ.id}`}
                checked={answers[currentQ.id] === option.id}
                onChange={() => handleAnswerSelect(currentQ.id, option.id)}
              />
              {option.text}
            </OptionLabel>
          ))}
        </OptionsContainer>
      </QuestionContainer>
      
      <NavigationButtons>
        <NavButton 
          onClick={handlePrevious} 
          disabled={currentQuestion === 0}
        >
          Previous
        </NavButton>
        
        <NavButton 
          onClick={handleNext} 
          disabled={answers[currentQ.id] === undefined}
        >
          {currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next'}
        </NavButton>
      </NavigationButtons>
    </AssessmentContainer>
  );
}