import { signIn, getSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Header, Footer } from '@yoohooguru/shared'
import Head from 'next/head'
import styled from 'styled-components'

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

const Main = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`

const SignupCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 3rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
`

const Title = styled.h1`
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 0.5rem;
`

const Subtitle = styled.p`
  color: #b0b0b0;
  margin-bottom: 2rem;
  line-height: 1.6;
`

const SignupButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: #667eea;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 1rem;

  &:hover {
    background: #5a6fd8;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`

const GoogleIcon = styled.span`
  font-size: 1.25rem;
`

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const Divider = styled.div`
  margin: 1.5rem 0;
  text-align: center;
  color: #b0b0b0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
  }

  span {
    background: rgba(255, 255, 255, 0.05);
    padding: 0 1rem;
    position: relative;
  }
`

const Benefits = styled.div`
  text-align: left;
  margin: 1.5rem 0;
  color: #b0b0b0;
  font-size: 0.875rem;
`

const Benefit = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;

  &::before {
    content: '✓';
    color: #667eea;
    font-weight: bold;
  }
`

const Footer2 = styled.div`
  text-align: center;
  margin-top: 2rem;
  color: #b0b0b0;
  font-size: 0.875rem;
  
  a {
    color: #667eea;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const router = useRouter()
  const { callbackUrl } = router.query

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        // User is already logged in, redirect to callback URL or dashboard
        const redirect = (callbackUrl as string) || '/dashboard'
        router.push(redirect)
      } else {
        setIsCheckingSession(false)
      }
    })
  }, [router, callbackUrl])

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
    try {
      await signIn('google', {
        callbackUrl: (callbackUrl as string) || '/dashboard'
      })
    } catch (error) {
      console.error('Sign up error:', error)
      setIsLoading(false)
    }
  }

  if (isCheckingSession) {
    return (
      <Container>
        <Head>
          <title>Checking Session... | YooHoo.Guru</title>
        </Head>
        <Header />
        <Main>
          <SignupCard>
            <LoadingSpinner />
          </SignupCard>
        </Main>
        <Footer />
      </Container>
    )
  }

  return (
    <Container>
      <Head>
        <title>Join YooHoo.Guru | Start Your Learning Journey</title>
        <meta name="description" content="Join YooHoo.Guru to share skills, learn from experts, and build meaningful connections in your community." />
      </Head>

      <Header />

      <Main>
        <SignupCard>
          <Title>Join the Community</Title>
          <Subtitle>Start your journey of skill sharing and continuous learning with YooHoo.Guru.</Subtitle>

          <Benefits>
            <Benefit>Access to skill-sharing marketplace</Benefit>
            <Benefit>Connect with local experts and learners</Benefit>
            <Benefit>Discover your purpose through teaching</Benefit>
            <Benefit>Create positive community impact</Benefit>
          </Benefits>

          <SignupButton onClick={handleGoogleSignUp} disabled={isLoading}>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                <GoogleIcon>🔍</GoogleIcon>
                Get Started with Google
              </>
            )}
          </SignupButton>

          <Divider>
            <span>More options coming soon</span>
          </Divider>

          <Footer2>
            Already have an account?{' '}
            <a href="/login">Sign in</a>
            <br />
            <br />
            By signing up, you agree to our{' '}
            <a href="/terms">Terms of Service</a> and{' '}
            <a href="/privacy">Privacy Policy</a>
          </Footer2>
        </SignupCard>
      </Main>

      <Footer />
    </Container>
  )
}