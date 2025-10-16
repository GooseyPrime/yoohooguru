import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Users, Briefcase, CheckCircle2 } from 'lucide-react';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import SEOMetadata from '../components/SEOMetadata';

const Container = styled.div`
  min-height: calc(100vh - 140px);
  padding: 2rem 1rem;
  background: ${props => props.theme.colors.bg};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  max-width: 500px;
  width: 100%;
  padding: 2rem;
  background: ${props => props.theme.colors.surface};
  border-radius: var(--r-lg);
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadow.card};
`;

const Title = styled.h1`
  font-size: var(--text-2xl);
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text};
  text-align: center;
`;

const Description = styled.p`
  font-size: var(--text-base);
  color: ${props => props.theme.colors.muted};
  margin-bottom: 2rem;
  text-align: center;
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
  font-size: var(--text-sm);
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input.withConfig({
  shouldForwardProp: (prop) => prop !== 'hasToggle'
})`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: var(--r-md);
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: var(--text-base);
  transition: all var(--t-fast);
  padding-right: ${props => props.hasToggle ? '2.5rem' : '0.75rem'};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.pri};
    box-shadow: 0 0 0 2px rgba(124, 140, 255, 0.1);
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.muted};
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: ${props => props.theme.colors.muted};
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--t-fast);
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
  
  &:focus {
    outline: none;
    color: ${props => props.theme.colors.pri};
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.err};
  font-size: var(--text-sm);
  margin-top: 0.25rem;
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: ${props => props.theme.colors.muted};
  
  a {
    color: ${props => props.theme.colors.pri};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const UserTypeSection = styled.div`
  margin-bottom: 1.5rem;

  h3 {
    font-size: var(--text-md);
    color: ${props => props.theme.colors.text};
    margin-bottom: 1rem;
    font-weight: 500;
  }
`;

const UserTypeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const UserTypeCard = styled.div`
  border: 2px solid ${props => props.selected ? props.theme.colors.pri : props.theme.colors.border};
  border-radius: var(--r-md);
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.selected ? 'rgba(124, 140, 255, 0.05)' : props.theme.colors.surface};
  position: relative;
  
  &:hover {
    border-color: ${props => props.theme.colors.pri};
    background: ${props => props.selected ? 'rgba(124, 140, 255, 0.05)' : 'rgba(124, 140, 255, 0.02)'};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .icon {
    width: 40px;
    height: 40px;
    border-radius: var(--r-md);
    background: ${props => props.selected ? props.theme.colors.pri : 'rgba(124, 140, 255, 0.1)'};
    color: ${props => props.selected ? 'white' : props.theme.colors.pri};
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.75rem;
  }

  .checkmark {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    color: ${props => props.theme.colors.pri};
    background: white;
    border-radius: 50%;
    padding: 0.125rem;
  }

  h4 {
    font-size: var(--text-sm);
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    margin-bottom: 0.25rem;
  }

  p {
    font-size: var(--text-xs);
    color: ${props => props.theme.colors.muted};
    line-height: 1.4;
    margin: 0;
  }
`;

const TermsSection = styled.div`
  margin: 1.5rem 0;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
  
  input[type="checkbox"] {
    display: none;
  }
`;

const CustomCheckbox = styled.label`
  width: 20px;
  height: 20px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: var(--r-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-top: 0.125rem;
  
  ${props => props.checked && `
    background: ${props.theme.colors.pri};
    border-color: ${props.theme.colors.pri};
    color: white;
  `}
  
  &:hover {
    border-color: ${props => props.theme.colors.pri};
  }
`;

const CheckboxText = styled.label`
  font-size: var(--text-sm);
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  line-height: 1.5;
  
  a {
    color: ${props => props.theme.colors.pri};
    text-decoration: underline;
    
    &:hover {
      text-decoration: none;
    }
  }
`;

const StepIndicator = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  .steps {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .step {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.theme.colors.muted};
    
    &.active {
      background: ${props => props.theme.colors.pri};
    }
  }
  
  .step-text {
    font-size: var(--text-sm);
    color: ${props => props.theme.colors.muted};
  }
`;

function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    wantsToTeach: false,
    wantsToLearn: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });
  const { signup, loginWithGoogle, isFirebaseConfigured } = useAuth();
  const navigate = useNavigate();

  // Password strength calculator
  const calculatePasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character variety
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;
    
    // Map score to label and color
    if (score <= 2) return { score, label: 'Weak', color: '#ef4444' };
    if (score <= 4) return { score, label: 'Fair', color: '#f59e0b' };
    if (score <= 5) return { score, label: 'Good', color: '#10b981' };
    return { score, label: 'Strong', color: '#059669' };
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    // Update password strength when password changes
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (passwordStrength.score <= 2) {
      newErrors.password = 'Please use a stronger password (mix letters, numbers, and symbols)';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.wantsToTeach && !formData.wantsToLearn) {
      newErrors.userInterests = 'Please select at least one option for how you plan to use yoohoo.guru';
    }

    if (!acceptedTerms) {
      newErrors.terms = 'You must accept the Terms and Conditions to create an account';
    }

    if (!acceptedPrivacy) {
      newErrors.privacy = 'You must accept the Privacy Policy to create an account';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await signup(formData.email, formData.password, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        displayName: `${formData.firstName} ${formData.lastName}`,
        wantsToTeach: formData.wantsToTeach,
        wantsToLearn: formData.wantsToLearn,
        acceptedTerms: true,
        acceptedPrivacy: true,
        termsAcceptedAt: new Date().toISOString(),
        privacyAcceptedAt: new Date().toISOString()
      });
      
      toast.success('Account created successfully! Please check your email to verify your account.');
      
      // Guide user to onboarding based on their interests
      if (formData.wantsToTeach) {
        navigate('/onboarding/profile');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to create account');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (!acceptedTerms || !acceptedPrivacy) {
      toast.error('Please accept the Terms and Privacy Policy to continue');
      return;
    }

    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      // For Google signup, redirect to onboarding to select user type
      navigate('/onboarding?type=select');
    } catch (error) {
      // Error handling is done in AuthContext
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({ 
      ...prev, 
      [interest]: !prev[interest] 
    }));
    if (errors.userInterests) {
      setErrors(prev => ({ ...prev, userInterests: '' }));
    }
  };

  const seoData = {
    title: 'Join yoohoo.guru - Create Your Account',
    description: 'Join our skill-sharing community. Create an account to offer your skills or find local services and expertise.',
    keywords: 'join, signup, create account, skill sharing, community',
    ogTitle: 'Join the yoohoo.guru Community',
    ogDescription: 'Start sharing skills and connecting with your neighbors today.',
    canonicalUrl: window.location.href
  };

  return (
    <Container>
      <SEOMetadata {...seoData} />
      <Content>
        <StepIndicator>
          <div className="steps">
            <div className="step active"></div>
            <div className="step"></div>
            <div className="step"></div>
          </div>
          <div className="step-text">Step 1 of 3: Create Account</div>
        </StepIndicator>

        <Title>Join {process.env.REACT_APP_BRAND_NAME || 'yoohoo.guru'}</Title>
        <Description>
          Create your account to start sharing skills and building meaningful connections. 
          <strong style={{ display: 'block', marginTop: '0.5rem', color: 'var(--pri)' }}>
            You can be both a teacher and a learner!
          </strong>
        </Description>

        {/* Social Proof */}
        <div style={{
          background: 'rgba(124, 140, 255, 0.05)',
          border: '1px solid rgba(124, 140, 255, 0.2)',
          borderRadius: 'var(--r-md)',
          padding: '0.75rem 1rem',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ 
            fontSize: 'var(--text-sm)', 
            color: 'var(--text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            <span>✨ Join thousands of community members</span>
            <span style={{ 
              background: 'var(--pri)', 
              color: 'white', 
              padding: '0.125rem 0.5rem', 
              borderRadius: '12px',
              fontSize: 'var(--text-xs)',
              fontWeight: '600'
            }}>
              FREE
            </span>
          </div>
        </div>
        
        <Form onSubmit={handleSubmit}>
          {/* User Interests Selection */}
          <UserTypeSection>
            <h3>What would you like to do? (Select all that apply)</h3>
            <UserTypeGrid>
              <UserTypeCard 
                selected={formData.wantsToTeach}
                onClick={() => handleInterestToggle('wantsToTeach')}
              >
                <div className="icon">
                  <Users size={20} />
                </div>
                <h4>Teach & Share Skills</h4>
                <p>Become a guru, offer services, earn money teaching others</p>
                {formData.wantsToTeach && (
                  <div className="checkmark">
                    <CheckCircle2 size={16} />
                  </div>
                )}
              </UserTypeCard>
              
              <UserTypeCard 
                selected={formData.wantsToLearn}
                onClick={() => handleInterestToggle('wantsToLearn')}
              >
                <div className="icon">
                  <Briefcase size={20} />
                </div>
                <h4>Learn & Find Services</h4>
                <p>Discover local experts, learn new skills, hire professionals</p>
                {formData.wantsToLearn && (
                  <div className="checkmark">
                    <CheckCircle2 size={16} />
                  </div>
                )}
              </UserTypeCard>
            </UserTypeGrid>
            {errors.userInterests && <ErrorMessage>{errors.userInterests}</ErrorMessage>}
            <div style={{ 
              fontSize: 'var(--text-xs)', 
              color: 'var(--muted)', 
              marginTop: '0.75rem',
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              💡 Tip: Most users select both! You can always update your preferences later.
            </div>
          </UserTypeSection>

          <InputGroup>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              autoComplete="given-name"
              required
            />
            {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              autoComplete="family-name"
              required
            />
            {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <InputWrapper>
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password (at least 6 characters)"
                autoComplete="new-password"
                hasToggle={true}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </PasswordToggle>
            </InputWrapper>
            {formData.password && (
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  fontSize: 'var(--text-xs)',
                  marginBottom: '0.25rem'
                }}>
                  <span>Password Strength:</span>
                  <span style={{ 
                    color: passwordStrength.color,
                    fontWeight: '600'
                  }}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '4px', 
                  background: '#e5e7eb', 
                  borderRadius: '2px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${(passwordStrength.score / 6) * 100}%`, 
                    height: '100%', 
                    background: passwordStrength.color,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            )}
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </InputGroup>

          <InputGroup>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <InputWrapper>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                autoComplete="new-password"
                hasToggle={true}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </PasswordToggle>
            </InputWrapper>
            {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
          </InputGroup>

          {/* Terms and Privacy Acceptance */}
          <TermsSection>
            <CheckboxWrapper>
              <input
                type="checkbox"
                id="acceptTerms"
                checked={acceptedTerms}
                onChange={(e) => {
                  setAcceptedTerms(e.target.checked);
                  if (errors.terms) {
                    setErrors(prev => ({ ...prev, terms: '' }));
                  }
                }}
              />
              <CustomCheckbox 
                htmlFor="acceptTerms" 
                checked={acceptedTerms}
              >
                {acceptedTerms && <CheckCircle2 size={12} />}
              </CustomCheckbox>
              <CheckboxText htmlFor="acceptTerms">
                I agree to the{' '}
                <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer">
                  Terms and Conditions
                </a>
              </CheckboxText>
            </CheckboxWrapper>
            {errors.terms && <ErrorMessage>{errors.terms}</ErrorMessage>}

            <CheckboxWrapper>
              <input
                type="checkbox"
                id="acceptPrivacy"
                checked={acceptedPrivacy}
                onChange={(e) => {
                  setAcceptedPrivacy(e.target.checked);
                  if (errors.privacy) {
                    setErrors(prev => ({ ...prev, privacy: '' }));
                  }
                }}
              />
              <CustomCheckbox 
                htmlFor="acceptPrivacy" 
                checked={acceptedPrivacy}
              >
                {acceptedPrivacy && <CheckCircle2 size={12} />}
              </CustomCheckbox>
              <CheckboxText htmlFor="acceptPrivacy">
                I agree to the{' '}
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
              </CheckboxText>
            </CheckboxWrapper>
            {errors.privacy && <ErrorMessage>{errors.privacy}</ErrorMessage>}
          </TermsSection>

          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            disabled={loading}
            style={{ marginTop: '1rem' }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
          
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: 'var(--r-md)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text)'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '0.25rem', color: '#059669' }}>
              ✓ What you get:
            </div>
            <div style={{ display: 'grid', gap: '0.25rem', paddingLeft: '0.5rem' }}>
              <div>• Unlimited access to all community features</div>
              <div>• Connect with local experts and learners</div>
              <div>• Start earning as a teacher or find services</div>
              <div>• Secure payments through Stripe</div>
            </div>
          </div>
        </Form>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          margin: '1.5rem 0',
          color: '#666',
          fontSize: '0.9rem'
        }}>
          <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
          <span style={{ padding: '0 1rem' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
        </div>

        <Button 
          variant="outline" 
          size="lg"
          disabled={!isFirebaseConfigured || !acceptedTerms || !acceptedPrivacy}
          loading={isGoogleLoading}
          onClick={handleGoogleSignup}
          title={!isFirebaseConfigured ? "Google Sign-up requires Firebase configuration" : 
                 (!acceptedTerms || !acceptedPrivacy) ? "Please accept Terms and Privacy Policy first" : 
                 "Sign up with Google"}
          style={{ width: '100%' }}
        >
          Continue with Google
          {!isFirebaseConfigured && <span style={{ fontSize: '0.8em', marginLeft: '0.5rem' }}>⚠️</span>}
        </Button>

        <LoginLink>
          Already have an account? <Link to="/login">Sign in</Link>
        </LoginLink>
      </Content>
    </Container>
  );
}

export default SignupPage;