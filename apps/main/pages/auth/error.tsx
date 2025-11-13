import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
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

const ErrorCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 3rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
`

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #ff6b6b;
`

const Title = styled.h1`
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 1rem;
`

const Description = styled.p`
  color: #b0b0b0;
  margin-bottom: 2rem;
  line-height: 1.6;
`

const ErrorDetails = styled.div`
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.2);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 2rem;
  text-align: left;
`

const ErrorCode = styled.div`
  color: #ff6b6b;
  font-weight: 600;
  margin-bottom: 0.5rem;
`

const ErrorMessage = styled.div`
  color: #ffb3b3;
  font-size: 0.875rem;
`

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
`

const PrimaryButton = styled(Button)`
  background: #667eea;
  color: #ffffff;

  &:hover {
    background: #5a6fd8;
    transform: translateY(-1px);
  }
`

const SecondaryButton = styled(Button)`
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
  }
`

const errorMessages: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: 'Configuration Error',
    description: 'There was an issue with the authentication configuration. Please try again later or contact support if the problem persists.',
  },
  AccessDenied: {
    title: 'Access Denied',
    description: 'You do not have permission to sign in with this account. Please check with your administrator or try a different account.',
  },
  Verification: {
    title: 'Verification Error',
    description: 'The verification link was invalid or has expired. Please request a new verification email.',
  },
  Default: {
    title: 'Authentication Error',
    description: 'Something went wrong during authentication. Please try signing in again.',
  },
}

export default function AuthError() {
  const router = useRouter()
  const [errorType, setErrorType] = useState<string>('Default')
  const { error } = router.query

  useEffect(() => {
    if (error && typeof error === 'string') {
      setErrorType(error in errorMessages ? error : 'Default')
    }
  }, [error])

  const handleRetry = () => {
    router.push('/login')
  }

  const handleGoHome = () => {
    router.push('/')
  }

  const errorInfo = errorMessages[errorType] || errorMessages.Default

  return (
    <Container>
      <Head>
        <title>Authentication Error | YooHoo.Guru</title>
        <meta name="description" content="An error occurred during authentication. Please try again." />
      </Head>

      <Header />

      <Main>
        <ErrorCard>
          <ErrorIcon>⚠️</ErrorIcon>
          <Title>{errorInfo.title}</Title>
          <Description>{errorInfo.description}</Description>

          {error && (
            <ErrorDetails>
              <ErrorCode>Error Code: {error}</ErrorCode>
              <ErrorMessage>
                If this error persists, please contact our support team with this error code.
              </ErrorMessage>
            </ErrorDetails>
          )}

          <Actions>
            <PrimaryButton onClick={handleRetry}>
              Try Again
            </PrimaryButton>
            <SecondaryButton onClick={handleGoHome}>
              Go Home
            </SecondaryButton>
          </Actions>
        </ErrorCard>
      </Main>

      <Footer />
    </Container>
  )
}