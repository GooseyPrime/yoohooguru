import { getSession } from 'next-auth/react'
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
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`

const WelcomeSection = styled.section`
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`

const WelcomeTitle = styled.h1`
  color: #ffffff;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`

const WelcomeSubtitle = styled.p`
  color: #b0b0b0;
  font-size: 1.2rem;
  line-height: 1.6;
`

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`

const DashboardCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(102, 126, 234, 0.3);
  }
`

const CardIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`

const CardTitle = styled.h3`
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`

const CardDescription = styled.p`
  color: #b0b0b0;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`

const CardButton = styled.button`
  background: #667eea;
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #5a6fd8;
  }
`

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  
  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

const UserInfo = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`

const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid rgba(102, 126, 234, 0.3);
`

const UserDetails = styled.div`
  flex: 1;
`

const UserName = styled.h2`
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
`

const UserEmail = styled.p`
  color: #b0b0b0;
  font-size: 0.9rem;
`

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Session {
  user?: User;
}

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        router.push('/login')
      } else {
        setSession(session)
      }
      setIsLoading(false)
    })
  }, [router])

  const handleNavigate = (path: string) => {
    router.push(path)
  }

  if (isLoading) {
    return (
      <Container>
        <Head>
          <title>Loading Dashboard... | YooHoo.Guru</title>
        </Head>
        <Header />
        <Main>
          <LoadingSpinner />
        </Main>
        <Footer />
      </Container>
    )
  }

  if (!session) {
    return null; // Will redirect to login
  }

  return (
    <Container>
      <Head>
        <title>Dashboard | YooHoo.Guru</title>
        <meta name="description" content="Your YooHoo.Guru dashboard - manage your skills, connections, and learning journey." />
      </Head>

      <Header />

      <Main>
        {session.user && (
          <UserInfo>
            {session.user.image && (
              <Avatar src={session.user.image} alt={session.user.name || 'User'} />
            )}
            <UserDetails>
              <UserName>{session.user.name || 'Welcome!'}</UserName>
              <UserEmail>{session.user.email}</UserEmail>
            </UserDetails>
          </UserInfo>
        )}

        <WelcomeSection>
          <WelcomeTitle>Welcome to Your Dashboard</WelcomeTitle>
          <WelcomeSubtitle>
            Start your journey of skill sharing and continuous learning. Explore our features below to get started.
          </WelcomeSubtitle>
        </WelcomeSection>

        <DashboardGrid>
          <DashboardCard>
            <CardIcon>🎯</CardIcon>
            <CardTitle>Skill Marketplace</CardTitle>
            <CardDescription>
              Browse and offer skills in our community marketplace. Find experts to learn from or share your expertise with others.
            </CardDescription>
            <CardButton onClick={() => handleNavigate('/skills')}>
              Explore Skills
            </CardButton>
          </DashboardCard>

          <DashboardCard>
            <CardIcon>👨‍🏫</CardIcon>
            <CardTitle>Become a Guru</CardTitle>
            <CardDescription>
              Share your knowledge and help others learn. Create courses, offer coaching sessions, and build your teaching profile.
            </CardDescription>
            <CardButton onClick={() => handleNavigate('/guru')}>
              Start Teaching
            </CardButton>
          </DashboardCard>

          <DashboardCard>
            <CardIcon>👼</CardIcon>
            <CardTitle>Angel's List</CardTitle>
            <CardDescription>
              Offer or find services in our community marketplace. Connect with professionals for various service needs.
            </CardDescription>
            <CardButton onClick={() => handleNavigate('/angels')}>
              Browse Services
            </CardButton>
          </DashboardCard>

          <DashboardCard>
            <CardIcon>🏆</CardIcon>
            <CardTitle>Heroes Hub</CardTitle>
            <CardDescription>
              Discover inspiring stories and connect with community heroes who are making a positive impact.
            </CardDescription>
            <CardButton onClick={() => handleNavigate('/heroes')}>
              Meet Heroes
            </CardButton>
          </DashboardCard>

          <DashboardCard>
            <CardIcon>📚</CardIcon>
            <CardTitle>Learning Path</CardTitle>
            <CardDescription>
              Track your learning progress, manage your courses, and set goals for your personal development journey.
            </CardDescription>
            <CardButton onClick={() => handleNavigate('/learning')}>
              View Progress
            </CardButton>
          </DashboardCard>

          <DashboardCard>
            <CardIcon>🤝</CardIcon>
            <CardTitle>Community</CardTitle>
            <CardDescription>
              Connect with like-minded learners and teachers. Join discussions and build meaningful relationships.
            </CardDescription>
            <CardButton onClick={() => handleNavigate('/community')}>
              Join Community
            </CardButton>
          </DashboardCard>
        </DashboardGrid>
      </Main>

      <Footer />
    </Container>
  )
}