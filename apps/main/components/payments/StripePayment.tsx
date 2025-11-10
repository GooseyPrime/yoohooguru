import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import styled from 'styled-components';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const PaymentContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const PaymentHeader = styled.h2`
  color: #ffffff;
  font-size: 1.5rem;
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

const CardElementContainer = styled.div`
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.2);
  
  .StripeElement {
    color: #ffffff;
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

const PaymentSummary = styled.div`
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

interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  clientSecret: string;
}

interface CheckoutFormProps {
  paymentData: PaymentData;
  onSuccess: () => void;
}

const CheckoutForm = ({ paymentData, onSuccess }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [name, setName] = useState('');
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    const cardElement = elements.getElement(CardElement);
    
    if (!cardElement) {
      setError('Card element not found');
      return;
    }
    
    setProcessing(true);
    setError(null);
    
    try {
      // In a real implementation, this would call your backend to create a payment intent
      // and then confirm the payment with Stripe
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate payment success
      onSuccess();
    } catch (err) {
      setError('Payment failed. Please try again.');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="name">Cardholder Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full name as it appears on card"
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label>Card Details</Label>
        <CardElementContainer>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#ffffff',
                  '::placeholder': {
                    color: '#b0b0b0',
                  },
                },
                invalid: {
                  color: '#ff6b6b',
                },
              },
            }}
          />
        </CardElementContainer>
      </FormGroup>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Button type="submit" disabled={processing || !stripe}>
        {processing ? 'Processing...' : `Pay $${paymentData.amount}`}
      </Button>
    </Form>
  );
};

interface StripePaymentProps {
  amount: number;
  currency?: string;
  description?: string;
  onPaymentSuccess: () => void;
}

export default function StripePayment({ 
  amount, 
  currency = 'usd', 
  description = 'Skill Session Payment', 
  onPaymentSuccess 
}: StripePaymentProps) {
  const [clientSecret, setClientSecret] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Mock payment data - in a real implementation, this would come from your backend
  const paymentData = {
    amount,
    currency,
    description,
    clientSecret: 'mock_client_secret'
  };
  
  const handleSuccess = () => {
    setPaymentSuccess(true);
    onPaymentSuccess();
  };
  
  if (paymentSuccess) {
    return (
      <PaymentContainer>
        <SuccessMessage>
          Payment successful! Your session has been booked.
        </SuccessMessage>
      </PaymentContainer>
    );
  }
  
  return (
    <PaymentContainer>
      <PaymentHeader>Complete Your Payment</PaymentHeader>
      
      <PaymentSummary>
        <SummaryRow>
          <span>Session:</span>
          <span>{description}</span>
        </SummaryRow>
        <SummaryRow>
          <span>Platform Fee (15%):</span>
          <span>${(amount * 0.15).toFixed(2)}</span>
        </SummaryRow>
        <SummaryTotal>
          <span>Total:</span>
          <span>${(amount * 1.15).toFixed(2)}</span>
        </SummaryTotal>
      </PaymentSummary>
      
      <Elements stripe={stripePromise}>
        <CheckoutForm paymentData={paymentData} onSuccess={handleSuccess} />
      </Elements>
    </PaymentContainer>
  );
}