import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Header, Footer } from '@yoohooguru/shared'
import Head from 'next/head'
import { OrbitronContainer, OrbitronCard, OrbitronButton, OrbitronSection } from '../components/orbitron'

/**
 * Dashboard Page
 * 
 * SSR-Safe Implementation:
 * This component uses the `mounted` state pattern to ensure all router operations
 * (router.push, router.query access) only occur after client-side hydration.
 * This prevents "NextRouter was not mounted" errors during SSR/SSG.
 */

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
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Track when component mounts on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Only run session check on client side after mount to avoid SSR router issues
    if (!mounted) return

    getSession().then((session) => {
      if (!session) {
        // Client-side only navigation - safe after mount
        router.push('/login')
      } else {
        setSession(session)
      }
      setIsLoading(false)
    })
  }, [mounted, router])

  if (isLoading) {
    return (
      <OrbitronContainer gradient="primary">
        <Head>
          <title>Loading Dashboard... | YooHoo.Guru</title>
        </Head>
        <Header />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="w-10 h-10 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin"></div>
        </main>
        <Footer />
      </OrbitronContainer>
    )
  }

  if (!session) {
    return null // Will redirect to login
  }

  // Different dashboard cards based on user role
  const getDashboardCards = () => {
    const userRole = session.user.role || 'gunu';
    
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
    <OrbitronContainer gradient="primary">
      <Head>
        <title>Dashboard | YooHoo.Guru</title>
        <meta name="description" content="Your YooHoo.Guru dashboard - manage your skills, connections, and learning journey." />
      </Head>

      <Header />

      <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
        {session.user && (
          <OrbitronCard className="flex items-center gap-4 p-6 mb-8">
            {session.user.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt={session.user.name || 'User'}
                className="w-15 h-15 rounded-full border-2 border-blue-500/30"
              />
            )}
            <div className="flex-1">
              <h2 className="text-white text-xl mb-1 flex items-center gap-3">
                {session.user.name || 'Welcome!'}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                  {session.user.role || 'Learner'}
                </span>
              </h2>
              <p className="text-gray-400 text-sm">{session.user.email}</p>
            </div>
          </OrbitronCard>
        )}

        <OrbitronSection>
          <OrbitronCard variant="gradient" className="text-center p-8 mb-12">
            <h1 className="text-4xl font-bold text-white mb-2">Welcome to Your Dashboard</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Start your journey of skill sharing and continuous learning. Explore our features below to get started.
            </p>
          </OrbitronCard>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardCards.map((card, index) => (
              <OrbitronCard key={index} className="p-6 text-center group hover:-translate-y-1 transition-transform">
                <div className="text-5xl mb-4">{card.icon}</div>
                <h3 className="text-white text-xl font-bold mb-3">{card.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  {card.description}
                </p>
                <OrbitronButton 
                  href={card.path}
                  variant="gradient" 
                  size="md"
                  className="w-full"
                >
                  {card.action}
                </OrbitronButton>
              </OrbitronCard>
            ))}
          </div>
        </OrbitronSection>
      </main>

      <Footer />
    </OrbitronContainer>
  )
}