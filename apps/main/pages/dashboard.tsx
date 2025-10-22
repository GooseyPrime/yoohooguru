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

const UserRoleBadge = styled.span`
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: 1rem;
`

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
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
    return null // Will redirect to login
  }

  // Different dashboard cards based on user role
  const getDashboardCards = () => {
    const userRole = session.user?.role || 'gunu';
    
    switch (userRole) {
      case 'guru':
        return [
          {
            icon: '📚',
            title: 'My Teaching',
            description: 'Manage your teaching profile, sessions, and student interactions.',
            action: 'View Profile',
            path: '/guru/profile'
          },
          {
            icon: '📅',
            title: 'Upcoming Sessions',
            description: 'View and manage your scheduled teaching sessions.',
            action: 'View Sessions',
            path: '/guru/sessions'
          },
          {
            icon: '💰',
            title: 'Earnings',
            description: 'Track your income from teaching sessions and platform commissions.',
            action: 'View Earnings',
            path: '/guru/earnings'
          },
          {
            icon: '⭐',
            title: 'My Ratings',
            description: 'See feedback from students and your overall rating.',
            action: 'View Ratings',
            path: '/guru/ratings'
          }
        ];
      
      case 'hero-guru':
        return [
          {
            icon: '❤️',
            title: 'Hero Teaching',
            description: 'Manage your accessible teaching profile and sessions for learners with disabilities.',
            action: 'View Profile',
            path: '/heroes/profile'
          },
          {
            icon: '📅',
            title: 'Upcoming Sessions',
            description: 'View and manage your scheduled adaptive learning sessions.',
            action: 'View Sessions',
            path: '/heroes/sessions'
          },
          {
            icon: '🏆',
            title: 'Community Impact',
            description: 'Track your contributions to the Hero Gurus community.',
            action: 'View Impact',
            path: '/heroes/impact'
          },
          {
            icon: '⭐',
            title: 'My Ratings',
            description: 'See feedback from students and your overall rating.',
            action: 'View Ratings',
            path: '/heroes/ratings'
          }
        ];
      
      case 'angel':
        return [
          {
            icon: '🛠️',
            title: 'My Services',
            description: 'Manage your service listings and local service offerings.',
            action: 'View Listings',
            path: '/angel/listings'
          },
          {
            icon: '📅',
            title: 'Service Requests',
            description: 'View and respond to service requests from community members.',
            action: 'View Requests',
            path: '/angel/requests'
          },
          {
            icon: '💰',
            title: 'Earnings',
            description: 'Track your income from service completions and platform commissions.',
            action: 'View Earnings',
            path: '/angel/earnings'
          },
          {
            icon: '⭐',
            title: 'My Ratings',
            description: 'See feedback from clients and your overall service rating.',
            action: 'View Ratings',
            path: '/angel/ratings'
          }
        ];
      
      case 'admin':
        return [
          {
            icon: '📊',
            title: 'Platform Analytics',
            description: 'View platform performance metrics, user statistics, and revenue data.',
            action: 'View Analytics',
            path: '/admin/analytics'
          },
          {
            icon: '👥',
            title: 'User Management',
            description: 'Manage users, resolve disputes, and handle platform moderation.',
            action: 'Manage Users',
            path: '/admin/users'
          },
          {
            icon: '⚙️',
            title: 'Platform Settings',
            description: 'Configure platform parameters, policies, and system settings.',
            action: 'Configure',
            path: '/admin/settings'
          },
          {
            icon: '📋',
            title: 'Content Moderation',
            description: 'Review and moderate user-generated content and reports.',
            action: 'Moderate',
            path: '/admin/content'
          }
        ];
      
      default: // gunu (default learner role)
        return [
          {
            icon: '🎯',
            title: 'Find Skills',
            description: 'Browse and search for Gurus to learn from across all skill categories.',
            action: 'Explore Skills',
            path: '/skills'
          },
          {
            icon: '📅',
            title: 'My Learning',
            description: 'Manage your booked sessions, learning progress, and upcoming classes.',
            action: 'View Schedule',
            path: '/learning/schedule'
          },
          {
            icon: '⭐',
            title: 'My Ratings',
            description: 'See your ratings for Gurus you\'ve learned from and your learning progress.',
            action: 'View Progress',
            path: '/learning/progress'
          },
          {
            icon: '🔍',
            title: 'AI Learning Match',
            description: 'Use our AI-powered learning style assessment to find the perfect Gurus.',
            action: 'Get Matched',
            path: '/learning/ai-match'
          }
        ];
    }
  };

  const dashboardCards = getDashboardCards();

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
              <UserName>
                {session.user.name || 'Welcome!'}
                <UserRoleBadge>{session.user.role || 'Learner'}</UserRoleBadge>
              </UserName>
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
          {dashboardCards.map((card, index) => (
            <DashboardCard key={index}>
              <CardIcon>{card.icon}</CardIcon>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>
                {card.description}
              </CardDescription>
              <CardButton onClick={() => handleNavigate(card.path)}>
                {card.action}
              </CardButton>
            </DashboardCard>
          ))}
        </DashboardGrid>
      </Main>

      <Footer />
    </Container>
  )
}