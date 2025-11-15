import { useState } from 'react';
import styled from 'styled-components';

interface TypeOptionProps {
  color?: string;
  selected?: boolean;
}

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

const FreeSessionBanner = styled.div`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 1rem;
  border-radius: 0.75rem;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
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
  background: #10b981;
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

const HeroGuroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid rgba(16, 185, 129, 0.3);
`;

const GuruRating = styled.div`
  color: #FFD700;
  font-weight: 600;
  margin-top: 0.5rem;
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
    border-color: #10b981;
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
    border-color: #10b981;
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
    border-color: #10b981;
  }
`;

const SessionType = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const TypeOption = styled.label<TypeOptionProps>`
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

const AccommodationsSection = styled.div`
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-top: 1rem;
`;

const AccommodationsTitle = styled.h4`
  color: #10b981;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AccommodationsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const AccommodationItem = styled.li`
  color: #b0b0b0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:before {
    content: '✓';
    color: #10b981;
    font-weight: bold;
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
  color: #10b981;
  font-size: 1.5rem;
`;

const Button = styled.button`
  padding: 1rem;
  border-radius: 0.5rem;
  border: none;
  background: #10b981;
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  align-self: flex-start;
  
  &:hover {
    background: #059669;
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
  message: string;
  accommodations: string[];
}

interface HeroGuruSessionBookingProps {
  guruId: string;
  guruName: string;
  skill: string;
  rating: number;
  accommodations?: string[];
  onBookingSuccess: () => void;
}

export default function HeroGuruSessionBooking({ 
  guruId, 
  guruName, 
  skill, 
  rating,
  accommodations = [],
  onBookingSuccess
}: HeroGuruSessionBookingProps) {
  const [sessionData, setSessionData] = useState<SessionData>({
    guruId,
    guruName,
    skill,
    rating,
    date: '',
    time: '',
    duration: 60,
    sessionType: 'video',
    message: '',
    accommodations: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    
    setIsSubmitting(true);
    
    try {
      // Create session via API (no payment required for Hero Gurus)
      const response = await fetch('/api/backend/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coachId: sessionData.guruId,
          learnerId: '__SELF__',
          skillId: sessionData.skill,
          mode: sessionData.sessionType,
          startTime: new Date(`${sessionData.date}T${sessionData.time}`).getTime(),
          endTime: new Date(`${sessionData.date}T${sessionData.time}`).getTime() + (sessionData.duration * 60 * 1000),
          isHeroGuruSession: true, // Flag to indicate this is a free Hero Guru session
          message: sessionData.message
        }),
      });
      
      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Session booked successfully! You\'ll receive a confirmation email with session details.'
        });
        setTimeout(() => {
          onBookingSuccess();
        }, 2000);
      } else {
        const errorData = await response.json();
        setMessage({
          type: 'error',
          text: errorData.error?.message || 'Failed to book session. Please try again.'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'An error occurred while booking the session. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (message?.type === 'success') {
    return (
      <BookingContainer>
        <SuccessMessage>
          {message.text}
        </SuccessMessage>
      </BookingContainer>
    );
  }
  
  return (
    <BookingContainer>
      <BookingHeader>Book a Free Hero Guru Session</BookingHeader>
      
      <FreeSessionBanner>
        <span>❤️</span>
        <span>This is a FREE session provided by a Hero Guru volunteer</span>
        <span>❤️</span>
      </FreeSessionBanner>
      
      <GuruInfo>
        <GuruAvatar>
          {guruName.charAt(0)}
        </GuruAvatar>
        <GuruDetails>
          <GuruName>{guruName}</GuruName>
          <GuruSkill>{skill} Guru</GuruSkill>
          <HeroGuroBadge>
            <span>♿</span>
            <span>Hero Guru</span>
          </HeroGuroBadge>
          <GuruRating>★ {rating.toFixed(1)} ({Math.floor(Math.random() * 50)} reviews)</GuruRating>
        </GuruDetails>
      </GuruInfo>
      
      {accommodations.length > 0 && (
        <AccommodationsSection>
          <AccommodationsTitle>
            <span>♿</span>
            <span>Available Accommodations</span>
          </AccommodationsTitle>
          <AccommodationsList>
            {accommodations.map((accommodation, index) => (
              <AccommodationItem key={index}>{accommodation}</AccommodationItem>
            ))}
          </AccommodationsList>
        </AccommodationsSection>
      )}
      
      {message && message.type === 'error' && (
        <ErrorMessage>{message.text}</ErrorMessage>
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
            min={new Date().toISOString().split('T')[0]}
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
              color="#10b981"
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
              color="#10b981"
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
          <Label htmlFor="message">Message for Hero Guru (Optional)</Label>
          <TextArea
            id="message"
            name="message"
            value={sessionData.message}
            onChange={handleChange}
            placeholder="Let your Hero Guru know about any specific topics, goals, or accommodation needs for this session..."
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
            <span>Hero Guru:</span>
            <span>{sessionData.guruName}</span>
          </SummaryRow>
          <SummaryTotal>
            <span>Total Cost:</span>
            <span>FREE</span>
          </SummaryTotal>
        </SessionSummary>
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Booking Session...' : 'Confirm Free Session Booking'}
        </Button>
      </Form>
    </BookingContainer>
  );
}