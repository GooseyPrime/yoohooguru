import { useState } from 'react';
import styled from 'styled-components';
import StripePayment from '../payments/StripePayment';

const BookingContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const BookingHeader = styled.h2`
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const GuruInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 1rem;
`;

const GuruAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #667eea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
`;

const GuruDetails = styled.div`
  flex: 1;
`;

const GuruName = styled.h3`
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
`;

const GuruSkill = styled.p`
  color: #b0b0b0;
  margin-bottom: 0.5rem;
`;

const GuruRating = styled.div`
  color: #FFD700;
  font-weight: 600;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #b0b0b0;
  font-weight: 600;
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.2);
  color: #ffffff;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.2);
  color: #ffffff;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.2);
  color: #ffffff;
  font-size: 1rem;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SessionType = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const TypeOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${props => props.color || 'rgba(255, 255, 255, 0.2)'};
  background: ${props => props.selected ? props.color + '20' : 'rgba(0, 0, 0, 0.2)'};
  cursor: pointer;
  flex: 1;
  text-align: center;
  
  &:hover {
    background: ${props => props.color + '30'};
  }
`;

const SessionSummary = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #b0b0b0;
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-weight: 600;
  color: #ffffff;
  font-size: 1.2rem;
`;

const Button = styled.button`
  padding: 1rem;
  border-radius: 0.5rem;
  border: none;
  background: #667eea;
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  align-self: flex-start;
  
  &:hover {
    background: #5a6fd8;
  }
  
  &:disabled {
    background: #555;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  padding: 1rem;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 0.5rem;
  border: 1px solid #ff6b6b;
`;

const SuccessMessage = styled.div`
  color: #51cf66;
  padding: 1rem;
  background: rgba(81, 207, 102, 0.1);
  border-radius: 0.5rem;
  border: 1px solid #51cf66;
`;

interface SessionData {
  guruId: string;
  guruName: string;
  skill: string;
  rating: number;
  date: string;
  time: string;
  duration: number;
  sessionType: 'video' | 'in-person';
  price: number;
  message: string;
}

interface SessionBookingProps {
  guruId: string;
  guruName: string;
  skill: string;
  rating: number;
  price: number;
  onBookingSuccess: () => void;
}

export default function SessionBooking({ 
  guruId, 
  guruName, 
  skill, 
  rating, 
  price,
  onBookingSuccess
}: SessionBookingProps) {
  const [sessionData, setSessionData] = useState<SessionData>({
    guruId,
    guruName,
    skill,
    rating,
    date: '',
    time: '',
    duration: 60,
    sessionType: 'video',
    price,
    message: ''
  });
  const [step, setStep] = useState<'booking' | 'payment' | 'success'>('booking');
  const [message, setMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSessionData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSessionTypeChange = (type: 'video' | 'in-person') => {
    setSessionData(prev => ({
      ...prev,
      sessionType: type
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!sessionData.date || !sessionData.time) {
      setMessage({
        type: 'error',
        text: 'Please select a date and time for your session.'
      });
      return;
    }
    
    // In a real implementation, this would be an API call to create the session
    // For now, we'll just simulate the process
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep('payment');
      setMessage(null);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to book session. Please try again.'
      });
    }
  };
  
  const handlePaymentSuccess = () => {
    setStep('success');
    onBookingSuccess();
  };
  
  if (step === 'success') {
    return (
      <BookingContainer>
        <SuccessMessage>
          Session booked successfully! You'll receive a confirmation email with session details.
        </SuccessMessage>
      </BookingContainer>
    );
  }
  
  if (step === 'payment') {
    return (
      <BookingContainer>
        <BookingHeader>Complete Payment</BookingHeader>
        <StripePayment 
          amount={sessionData.price}
          description={`Session with ${sessionData.guruName} - ${sessionData.skill}`}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </BookingContainer>
    );
  }
  
  return (
    <BookingContainer>
      <BookingHeader>Book a Session</BookingHeader>
      
      <GuruInfo>
        <GuruAvatar>
          {guruName.charAt(0)}
        </GuruAvatar>
        <GuruDetails>
          <GuruName>{guruName}</GuruName>
          <GuruSkill>{skill} Guru</GuruSkill>
          <GuruRating>★ {rating.toFixed(1)} ({Math.floor(Math.random() * 50)} reviews)</GuruRating>
        </GuruDetails>
      </GuruInfo>
      
      {message && (
        message.type === 'error' 
          ? <ErrorMessage>{message.text}</ErrorMessage>
          : <SuccessMessage>{message.text}</SuccessMessage>
      )}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="date">Session Date *</Label>
          <Input
            id="date"
            name="date"
            type="date"
            value={sessionData.date}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="time">Session Time *</Label>
          <Input
            id="time"
            name="time"
            type="time"
            value={sessionData.time}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Select
            id="duration"
            name="duration"
            value={sessionData.duration}
            onChange={handleChange}
          >
            <option value={30}>30 minutes</option>
            <option value={60}>60 minutes</option>
            <option value={90}>90 minutes</option>
            <option value={120}>120 minutes</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label>Session Type</Label>
          <SessionType>
            <TypeOption 
              color="#667eea"
              selected={sessionData.sessionType === 'video'}
              onClick={() => handleSessionTypeChange('video')}
            >
              <input
                type="radio"
                name="sessionType"
                checked={sessionData.sessionType === 'video'}
                onChange={() => handleSessionTypeChange('video')}
                style={{marginRight: '0.5rem'}}
              />
              Video Session
            </TypeOption>
            <TypeOption 
              color="#51cf66"
              selected={sessionData.sessionType === 'in-person'}
              onClick={() => handleSessionTypeChange('in-person')}
            >
              <input
                type="radio"
                name="sessionType"
                checked={sessionData.sessionType === 'in-person'}
                onChange={() => handleSessionTypeChange('in-person')}
                style={{marginRight: '0.5rem'}}
              />
              In-Person Session
            </TypeOption>
          </SessionType>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="message">Message for Guru (Optional)</Label>
          <TextArea
            id="message"
            name="message"
            value={sessionData.message}
            onChange={handleChange}
            placeholder="Let your Guru know about any specific topics or goals for this session..."
          />
        </FormGroup>
        
        <SessionSummary>
          <SummaryRow>
            <span>Session Type:</span>
            <span>{sessionData.sessionType === 'video' ? 'Video Conference' : 'In-Person'}</span>
          </SummaryRow>
          <SummaryRow>
            <span>Duration:</span>
            <span>{sessionData.duration} minutes</span>
          </SummaryRow>
          <SummaryRow>
            <span>Base Price:</span>
            <span>${sessionData.price}</span>
          </SummaryRow>
          <SummaryRow>
            <span>Platform Fee (15%):</span>
            <span>${(sessionData.price * 0.15).toFixed(2)}</span>
          </SummaryRow>
          <SummaryTotal>
            <span>Total:</span>
            <span>${(sessionData.price * 1.15).toFixed(2)}</span>
          </SummaryTotal>
        </SessionSummary>
        
        <Button type="submit">
          Proceed to Payment
        </Button>
      </Form>
    </BookingContainer>
  );
}