import { useState } from 'react';
import styled from 'styled-components';

const DisputeContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const DisputeHeader = styled.h2`
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 1rem;
  text-align: center;
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
  min-height: 200px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
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

const DisputeInfo = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const DisputeInfoRow = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
`;

const DisputeInfoLabel = styled.span`
  font-weight: 600;
  color: #b0b0b0;
  width: 150px;
`;

const DisputeInfoValue = styled.span`
  color: #ffffff;
`;

interface DisputeData {
  sessionId: string;
  disputeType: string;
  description: string;
  preferredResolution: string;
}

export default function DisputeResolution() {
  const [disputeData, setDisputeData] = useState<DisputeData>({
    sessionId: '',
    disputeType: '',
    description: '',
    preferredResolution: ''
  });
  const [message, setMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDisputeData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    
    // Validate required fields
    if (!disputeData.sessionId || !disputeData.disputeType || !disputeData.description) {
      setMessage({
        type: 'error',
        text: 'Please fill in all required fields.'
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // In a real implementation, this would be an API call to submit the dispute
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({
        type: 'success',
        text: 'Dispute submitted successfully! Our team will review your case within 48 hours.'
      });
      
      // Reset form
      setDisputeData({
        sessionId: '',
        disputeType: '',
        description: '',
        preferredResolution: ''
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to submit dispute. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <DisputeContainer>
      <DisputeHeader>Dispute Resolution</DisputeHeader>
      
      <DisputeInfo>
        <DisputeInfoRow>
          <DisputeInfoLabel>Platform:</DisputeInfoLabel>
          <DisputeInfoValue>Coach Guru</DisputeInfoValue>
        </DisputeInfoRow>
        <DisputeInfoRow>
          <DisputeInfoLabel>Resolution Time:</DisputeInfoLabel>
          <DisputeInfoValue>48 hours</DisputeInfoValue>
        </DisputeInfoRow>
        <DisputeInfoRow>
          <DisputeInfoLabel>Escrow Status:</DisputeInfoLabel>
          <DisputeInfoValue>Funds held until resolution</DisputeInfoValue>
        </DisputeInfoRow>
      </DisputeInfo>
      
      {message && (
        message.type === 'error' 
          ? <ErrorMessage>{message.text}</ErrorMessage>
          : <SuccessMessage>{message.text}</SuccessMessage>
      )}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="sessionId">Session ID *</Label>
          <Input
            id="sessionId"
            name="sessionId"
            type="text"
            value={disputeData.sessionId}
            onChange={handleChange}
            placeholder="Enter the session ID related to this dispute"
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="disputeType">Dispute Type *</Label>
          <Select
            id="disputeType"
            name="disputeType"
            value={disputeData.disputeType}
            onChange={handleChange}
            required
          >
            <option value="">Select a dispute type</option>
            <option value="quality">Quality of Service</option>
            <option value="attendance">Attendance Issues</option>
            <option value="payment">Payment Dispute</option>
            <option value="conduct">Inappropriate Conduct</option>
            <option value="technical">Technical Issues</option>
            <option value="other">Other</option>
          </Select>
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="description">Description *</Label>
          <TextArea
            id="description"
            name="description"
            value={disputeData.description}
            onChange={handleChange}
            placeholder="Please provide detailed information about the dispute..."
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="preferredResolution">Preferred Resolution</Label>
          <Select
            id="preferredResolution"
            name="preferredResolution"
            value={disputeData.preferredResolution}
            onChange={handleChange}
          >
            <option value="">Select your preferred resolution</option>
            <option value="refund">Full Refund</option>
            <option value="partial-refund">Partial Refund</option>
            <option value="reschedule">Free Reschedule</option>
            <option value="compensation">Platform Credit</option>
            <option value="other">Other</option>
          </Select>
        </FormGroup>
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Dispute'}
        </Button>
      </Form>
    </DisputeContainer>
  );
}