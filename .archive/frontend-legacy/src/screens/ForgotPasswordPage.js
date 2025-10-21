import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import Logo from '../components/Logo';
import SEOMetadata from '../components/SEOMetadata';

const ForgotPasswordContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--bg) 0%, rgba(124, 140, 255, 0.05) 100%);
  padding: 1rem;
`;

const ForgotPasswordCard = styled.div`
  background: white;
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-xl);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  border: 1px solid rgba(0,0,0,0.05);
`;

const LogoWrapper = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--dark);
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: var(--gray);
  font-size: var(--text-sm);
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.5;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: var(--font-medium);
  color: var(--dark);
  font-size: var(--text-sm);
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  font-size: var(--text-base);
  transition: all 0.2s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: var(--pri);
    box-shadow: 0 0 0 3px rgba(124, 140, 255, 0.1);
  }

  &.error {
    border-color: var(--danger);
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  &::placeholder {
    color: var(--muted);
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  color: var(--gray);
  z-index: 1;
  pointer-events: none;
`;

const ErrorMessage = styled.span`
  color: var(--danger);
  font-size: var(--text-sm);
  margin-top: 0.25rem;
  display: block;
`;

const SuccessMessage = styled.div`
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: var(--r-md);
  padding: 1rem;
  color: #059669;
  font-size: var(--text-sm);
  margin-bottom: 1rem;
  text-align: center;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--pri);
  text-decoration: none;
  font-size: var(--text-sm);
  margin-top: 1.5rem;
  padding: 0.5rem 0;
  transition: color 0.2s ease;

  &:hover {
    color: var(--pri-dark);
  }
`;

const HelpText = styled.p`
  font-size: var(--text-xs);
  color: var(--gray);
  text-align: center;
  margin-top: 1rem;
  line-height: 1.4;
`;

function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const seoData = {
    title: 'Reset Your Password - yoohoo.guru',
    description: 'Reset your yoohoo.guru account password. Enter your email address to receive password reset instructions.',
    keywords: 'password reset, forgot password, account recovery, yoohoo.guru',
    canonicalUrl: window.location.href
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await resetPassword(data.email);
      setSubmittedEmail(data.email);
      setIsSuccess(true);
    } catch (error) {
      // Error handling is done in AuthContext via toast
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <ForgotPasswordContainer>
        <SEOMetadata {...seoData} />
        <ForgotPasswordCard>
          <LogoWrapper>
            <Logo showImage={true} size="small" />
          </LogoWrapper>
          <Title>Check Your Email</Title>
          <Subtitle>
            We&apos;ve sent password reset instructions to <strong>{submittedEmail}</strong>
          </Subtitle>
          
          <SuccessMessage>
            <Mail size={20} style={{ marginRight: '0.5rem' }} />
            Password reset email sent successfully!
          </SuccessMessage>

          <HelpText>
            Didn&apos;t receive the email? Check your spam folder or wait a few minutes. 
            You can also try submitting the form again.
          </HelpText>

          <BackLink to="/login">
            <ArrowLeft size={16} />
            Back to Login
          </BackLink>
        </ForgotPasswordCard>
      </ForgotPasswordContainer>
    );
  }

  return (
    <ForgotPasswordContainer>
      <SEOMetadata {...seoData} />
      <ForgotPasswordCard>
        <LogoWrapper>
          <Logo showImage={true} size="small" />
        </LogoWrapper>
        <Title>Reset Your Password</Title>
        <Subtitle>
          Enter your email address and we&apos;ll send you instructions to reset your password.
        </Subtitle>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputGroup>
            <Label htmlFor="email">Email Address</Label>
            <InputWrapper>
              <InputIcon>
                <Mail size={16} />
              </InputIcon>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                autoComplete="email"
                className={errors.email ? 'error' : ''}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
            </InputWrapper>
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </InputGroup>

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            loading={isLoading}
          >
            Send Reset Instructions
          </Button>
        </Form>

        <HelpText>
          Remember your password?{' '}
          <Link to="/login" style={{ color: 'var(--pri)' }}>Sign in instead</Link>
        </HelpText>

        <BackLink to="/login">
          <ArrowLeft size={16} />
          Back to Login
        </BackLink>
      </ForgotPasswordCard>
    </ForgotPasswordContainer>
  );
}

export default ForgotPasswordPage;