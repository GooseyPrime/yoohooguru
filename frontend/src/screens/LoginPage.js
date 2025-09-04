import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';

const LoginContainer = styled.div`
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, rgba(0, 123, 255, 0.05) 0%, rgba(40, 167, 69, 0.05) 100%);
`;

const LoginCard = styled.div`
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  padding: 3rem;
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Logo = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const Title = styled.h1`
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  color: var(--gray-900);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: var(--gray-600);
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  font-weight: var(--font-medium);
  color: var(--gray-700);
  margin-bottom: 0.5rem;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  padding-left: 2.5rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  transition: border-color var(--transition-fast);

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  &.error {
    border-color: var(--error);
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  color: var(--gray-400);
  z-index: 1;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;

  &:hover {
    color: var(--gray-600);
  }
`;

const ErrorMessage = styled.span`
  color: var(--error);
  font-size: var(--text-sm);
  margin-top: 0.25rem;
  display: block;
`;

const ForgotPassword = styled(Link)`
  color: var(--primary);
  font-size: var(--text-sm);
  text-decoration: none;
  display: block;
  margin-top: 1rem;

  &:hover {
    text-decoration: underline;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--gray-300);
  }
  
  span {
    margin: 0 1rem;
    color: var(--gray-500);
    font-size: var(--text-sm);
  }
`;

const SignupLink = styled.p`
  margin-top: 2rem;
  color: var(--gray-600);
  
  a {
    color: var(--primary);
    text-decoration: none;
    font-weight: var(--font-medium);
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      // Error handling is done in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      // Error handling is done in AuthContext
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>🎯</Logo>
        <Title>Welcome Back</Title>
        <Subtitle>Sign in to your {process.env.REACT_APP_BRAND_NAME || 'yoohoo.guru'} account</Subtitle>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <InputWrapper>
              <InputIcon>
                <Mail size={16} />
              </InputIcon>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
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

          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <InputWrapper>
              <InputIcon>
                <Lock size={16} />
              </InputIcon>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className={errors.password ? 'error' : ''}
                {...register('password', {
                  required: 'Password is required'
                })}
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </PasswordToggle>
            </InputWrapper>
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </InputGroup>

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            loading={isLoading}
          >
            Sign In
          </Button>
        </Form>

        <ForgotPassword to="/forgot-password">
          Forgot your password?
        </ForgotPassword>

        <Divider>
          <span>OR</span>
        </Divider>

        <Button 
          variant="outline" 
          fullWidth
          loading={isGoogleLoading}
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </Button>

        <SignupLink>
          Don&apos;t have an account?{' '}
          <Link to="/signup">Sign up for free</Link>
        </SignupLink>
      </LoginCard>
    </LoginContainer>
  );
}

export default LoginPage;