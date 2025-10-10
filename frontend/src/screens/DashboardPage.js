import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, BookOpen, Calendar, Users, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import SkillMatching from '../components/SkillMatching';
import ResourcesSection from '../components/ResourcesSection';

const Container = styled.div`
  min-height: calc(100vh - 140px);
  padding: 2rem 1rem;
  background: ${props => props.theme.colors.bg};
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: var(--text-3xl);
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
`;

const Description = styled.p`
  font-size: var(--text-lg);
  color: ${props => props.theme.colors.muted};
  margin-bottom: 2rem;
`;

const WelcomeCard = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.pri} 0%, ${props => props.theme.colors.succ} 100%);
  color: ${props => props.theme.colors.bg};
  padding: 2rem;
  border-radius: ${props => props.theme.radius.lg}px;
  margin-bottom: 2rem;
  text-align: center;

  h2 {
    font-size: var(--text-2xl);
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.bg};
  }

  p {
    color: ${props => props.theme.colors.bg};
    opacity: 0.9;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
`;

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const ActionCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.lg}px;
  padding: 1.5rem;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadow.lg};
    border-color: ${props => props.theme.colors.pri};
  }

  .icon {
    background: rgba(124, 140, 255, 0.1);
    border-radius: ${props => props.theme.radius.md}px;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.pri};
  }

  h3 {
    color: ${props => props.theme.colors.text};
    margin-bottom: 0.5rem;
    font-size: var(--text-lg);
  }

  p {
    color: ${props => props.theme.colors.muted};
    line-height: 1.5;
    margin-bottom: 1rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.md}px;
  padding: 1.5rem;
  text-align: center;

  .stat-number {
    font-size: var(--text-2xl);
    font-weight: 600;
    color: ${props => props.theme.colors.pri};
    margin-bottom: 0.5rem;
  }

  .stat-label {
    color: ${props => props.theme.colors.muted};
    font-size: var(--text-sm);
  }
`;

const ComingSoonFeatures = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.lg}px;
  padding: 2rem;
  text-align: center;

  h3 {
    color: ${props => props.theme.colors.text};
    margin-bottom: 1rem;
  }

  p {
    color: ${props => props.theme.colors.muted};
    line-height: 1.6;
  }
`;

const BookingAlert = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.pri};
  border-radius: ${props => props.theme.radius.lg}px;
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;

  .icon {
    color: ${props => props.theme.colors.pri};
    flex-shrink: 0;
  }

  .content {
    flex: 1;
  }

  h3 {
    color: ${props => props.theme.colors.text};
    margin: 0 0 0.5rem 0;
    font-size: var(--text-lg);
  }

  p {
    color: ${props => props.theme.colors.muted};
    margin: 0 0 1rem 0;
    line-height: 1.5;
  }

  .actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1rem;
  }
`;

function DashboardPage() {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingState, setBookingState] = useState(null);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userStats, setUserStats] = useState({
    skillsLearning: 0,
    skillsTeaching: 0,
    sessionsBooked: 0,
    profileComplete: 0
  });

  // Handle incoming booking/action state from navigation
  useEffect(() => {
    try {
      if (location.state) {
        const { action, category, message } = location.state;
        
        if (action === 'book-service' || action === 'book-skill-session' || action === 'find-teachers') {
          setBookingState({
            action,
            category,
            message,
            type: action === 'book-service' ? 'service' : action === 'find-teachers' ? 'teachers' : 'skill'
          });
          
          // Clear the navigation state to prevent browser back issues
          window.history.replaceState({}, document.title, location.pathname);
        }
      }
    } catch (err) {
      console.error('Error handling navigation state:', err);
      setError('There was an issue loading your dashboard. Please refresh the page.');
    }
  }, [location]);

  // Fetch user profile and calculate stats
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;
      
      try {
        // Fetch user profile data
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${currentUser.uid}/profile`, {
          headers: {
            'Authorization': `Bearer ${await currentUser.getIdToken()}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserProfile(data);
          
          // Calculate profile completion percentage
          const profileFields = ['displayName', 'city', 'zip', 'bio'];
          const completedFields = profileFields.filter(field => data[field]).length;
          const profileComplete = Math.round((completedFields / profileFields.length) * 100);
          
          setUserStats({
            skillsLearning: data.skillsLearning || 0,
            skillsTeaching: data.skillsTeaching || 0,
            sessionsBooked: data.sessionsBooked || 0,
            profileComplete
          });
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        // Use defaults on error
      }
    };
    
    fetchUserData();
  }, [currentUser]);

  const handleBookingAction = (actionType) => {
    if (actionType === 'continue' && bookingState) {
      // Navigate to appropriate page based on type
      if (bookingState.type === 'service') {
        navigate('/angels-list', { state: { category: bookingState.category } });
      } else if (bookingState.type === 'teachers') {
        // For now, redirect to skills page with teacher filter - this could be enhanced later
        navigate('/skills', { state: { category: bookingState.category, showTeachers: true } });
      } else {
        navigate('/skills', { state: { category: bookingState.category } });
      }
    } else if (actionType === 'dismiss') {
      setBookingState(null);
    }
  };

  // Smart quick actions based on user state
  const getSmartQuickActions = () => {
    const actions = [];
    
    // If profile is incomplete, prioritize that
    if (userStats.profileComplete < 100) {
      actions.push({
        icon: User,
        title: 'Complete Profile',
        description: `Your profile is ${userStats.profileComplete}% complete. Finish setting it up to connect with others.`,
        action: () => navigate('/profile')
      });
    }
    
    // If no skills yet, encourage browsing
    if (userStats.skillsLearning === 0 && userStats.skillsTeaching === 0) {
      actions.push({
        icon: BookOpen,
        title: 'Browse Skills',
        description: 'Find skills to learn or discover teaching opportunities',
        action: () => navigate('/skills')
      });
      
      actions.push({
        icon: Users,
        title: 'Angel\'s List',
        description: 'Browse professional services or offer your expertise',
        action: () => navigate('/angels-list')
      });
    }
    
    // If they have skills, encourage booking or onboarding
    if (userStats.skillsTeaching === 0 && userProfile?.userType === 'skill_sharer') {
      actions.push({
        icon: Calendar,
        title: 'Become a Teacher',
        description: 'Share your expertise and start earning',
        action: () => navigate('/onboarding')
      });
    }
    
    // Always show browse options
    if (actions.length < 3) {
      actions.push({
        icon: BookOpen,
        title: 'Explore Skills',
        description: 'Discover new learning opportunities',
        action: () => navigate('/skills')
      });
    }
    
    if (actions.length < 4) {
      actions.push({
        icon: Users,
        title: 'Find Services',
        description: 'Connect with service providers in your area',
        action: () => navigate('/angels-list')
      });
    }
    
    return actions;
  };

  const quickActions = userProfile ? getSmartQuickActions() : [
    {
      icon: BookOpen,
      title: 'Browse Skills',
      description: 'Find skills to learn or discover teaching opportunities',
      action: () => navigate('/skills')
    },
    {
      icon: Users,
      title: 'Angel\'s List',
      description: 'Browse professional services or offer your expertise',
      action: () => navigate('/angels-list')
    },
    {
      icon: User,
      title: 'Complete Profile',
      description: 'Finish setting up your profile to connect with others',
      action: () => navigate('/profile')
    },
    {
      icon: Calendar,
      title: 'Start Onboarding',
      description: 'Begin your journey as a skill provider or guru',
      action: () => navigate('/onboarding')
    }
  ];

  // Show loading state while auth is loading
  if (loading) {
    return (
      <Container>
        <Content>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '200px',
            color: 'var(--text-muted)'
          }}>
            Loading dashboard...
          </div>
        </Content>
      </Container>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <Container>
        <Content>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            padding: '2rem',
            textAlign: 'center'
          }}>
            <AlertCircle size={48} style={{ color: 'var(--danger)', marginBottom: '1rem' }} />
            <h3 style={{ color: 'var(--text)', marginBottom: '0.5rem' }}>Dashboard Error</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
            <Button 
              variant="primary" 
              onClick={() => {
                setError(null);
                window.location.reload();
              }}
            >
              Retry
            </Button>
          </div>
        </Content>
      </Container>
    );
  }

  // Ensure user is available before rendering main content
  if (!currentUser) {
    return (
      <Container>
        <Content>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '200px',
            color: 'var(--text-muted)'
          }}>
            Please sign in to access your dashboard.
          </div>
        </Content>
      </Container>
    );
  }

  return (
    <Container>
      <Content>
        <Header>
          <Title>Welcome back{currentUser?.displayName ? `, ${currentUser.displayName}` : ''}!</Title>
          <Description>
            Your skill-sharing dashboard. Connect, learn, and teach in your community.
          </Description>
        </Header>
        
        {/* Show booking alert if user came from a booking action */}
        {bookingState && (
          <BookingAlert>
            <div className="icon">
              <CheckCircle size={24} />
            </div>
            <div className="content">
              <h3>
                {bookingState.type === 'teachers' 
                  ? `Find ${bookingState.category} Teachers!` 
                  : `Ready to Book ${bookingState.category}!`}
              </h3>
              <p>{bookingState.message}</p>
              <div className="actions">
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => handleBookingAction('continue')}
                >
                  {bookingState.type === 'teachers' ? 'Find Teachers' : 'Continue Booking'}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleBookingAction('dismiss')}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </BookingAlert>
        )}
        
        <WelcomeCard>
          <h2>🎯 Ready to Make an Impact?</h2>
          <p>
            Join thousands of community members sharing skills and creating positive change. 
            Start by exploring skills to learn or share your expertise with others.
          </p>
          <Button 
            variant="secondary" 
            onClick={() => navigate('/skills')}
            style={{background: 'rgba(255,255,255,0.2)', color: 'inherit', border: '1px solid rgba(255,255,255,0.3)'}}
          >
            Get Started
          </Button>
        </WelcomeCard>

        {/* Wrap SkillMatching in error boundary to prevent crashes */}
        <div style={{ marginBottom: '2rem' }}>
          <SkillMatching />
        </div>

        <StatsGrid>
          <StatCard>
            <div className="stat-number">{userStats.profileComplete}%</div>
            <div className="stat-label">Profile Complete</div>
          </StatCard>
          <StatCard>
            <div className="stat-number">{userStats.skillsLearning}</div>
            <div className="stat-label">Skills Learning</div>
          </StatCard>
          <StatCard>
            <div className="stat-number">{userStats.skillsTeaching}</div>
            <div className="stat-label">Skills Teaching</div>
          </StatCard>
          <StatCard>
            <div className="stat-number">{userStats.sessionsBooked}</div>
            <div className="stat-label">Sessions Booked</div>
          </StatCard>
        </StatsGrid>

        <QuickActions>
          {quickActions.map((action, index) => (
            <ActionCard key={index} onClick={action.action}>
              <div className="icon">
                <action.icon size={24} />
              </div>
              <h3>{action.title}</h3>
              <p>{action.description}</p>
              <Button variant="outline" size="sm">
                {action.title.includes('Browse') || action.title.includes('Angel') ? 'Explore' : 'Continue'}
              </Button>
            </ActionCard>
          ))}
        </QuickActions>

        {/* Learning Resources Section */}
        <div style={{ margin: '3rem 0' }}>
          <ResourcesSection />
        </div>

        <ComingSoonFeatures>
          <h3>🚧 Advanced Features Coming Soon!</h3>
          <p>
            We&apos;re building advanced skill matching, real-time progress tracking, 
            AI-powered recommendations, certification pathways, and community insights. 
            Stay tuned for updates!
          </p>
        </ComingSoonFeatures>
      </Content>
    </Container>
  );
}

export default DashboardPage;