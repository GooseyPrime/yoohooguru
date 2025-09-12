/**
 * Understudy Dashboard
 * Manage distance learning sessions as a learner/understudy
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { get, patch, del } from '../utils/http';
import SessionCard from '../components/SessionCard';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.text || '#ffffff'};
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary || '#cccccc'};
  font-size: 1.1rem;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.surface || '#2a2a2a'};
  border: 1px solid ${props => props.theme.colors.border || '#444444'};
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary || '#6c5ce7'};
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textSecondary || '#cccccc'};
  font-size: 0.9rem;
`;

const QuickActionsContainer = styled.div`
  background: ${props => props.theme.colors.surface || '#2a2a2a'};
  border: 1px solid ${props => props.theme.colors.border || '#444444'};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const QuickActionsTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: ${props => props.theme.colors.text || '#ffffff'};
  font-size: 1.1rem;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${props => props.theme.colors.primary || '#6c5ce7'};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  text-decoration: none;
  
  &:hover {
    background: ${props => props.theme.colors.primaryHover || '#5a4fcf'};
  }
  
  &:focus {
    outline: 3px solid ${props => props.theme.colors.accent || '#ff6b6b'};
    outline-offset: 2px;
  }
`;

const SessionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.textSecondary || '#cccccc'};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.error || '#ff6b6b'};
  background: ${props => props.theme.colors.surface || '#2a2a2a'};
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: ${props => props.theme.colors.textSecondary || '#cccccc'};
  background: ${props => props.theme.colors.surface || '#2a2a2a'};
  border-radius: 12px;
  border: 2px dashed ${props => props.theme.colors.border || '#444444'};
`;

const EmptyStateIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.border || '#444444'};
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  color: ${props => props.active ? 
    props.theme.colors.primary || '#6c5ce7' : 
    props.theme.colors.textSecondary || '#cccccc'};
  border-bottom: 2px solid ${props => props.active ? 
    props.theme.colors.primary || '#6c5ce7' : 
    'transparent'};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${props => props.theme.colors.text || '#ffffff'};
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.primary || '#6c5ce7'};
    outline-offset: 2px;
  }
`;

const TipContainer = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.colors.primary || '#6c5ce7'} 0%, ${props => props.theme.colors.primaryHover || '#5a4fcf'} 100%);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  color: white;
`;

const TipTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

const TipText = styled.p`
  margin: 0;
  opacity: 0.9;
`;

function DashboardUnderstudy() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await get('/sessions?role=learner');
      setSessions(data.sessions || []);
      setError(null);
    } catch (error) {
      setError(error.message);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (sessionId, newStatus) => {
    try {
      await patch(`/sessions/${sessionId}/status`, { status: newStatus });
      
      // Update local state
      setSessions(prev => prev.map(session => 
        session.id === sessionId 
          ? { ...session, status: newStatus }
          : session
      ));
    } catch (error) {
      console.error('Failed to update session status:', error);
      alert('Failed to update session status: ' + error.message);
    }
  };

  const handleCancelSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to cancel this session?')) {
      return;
    }

    try {
      await del(`/sessions/${sessionId}`);
      
      // Remove from local state
      setSessions(prev => prev.filter(session => session.id !== sessionId));
    } catch (error) {
      console.error('Failed to cancel session:', error);
      alert('Failed to cancel session: ' + error.message);
    }
  };

  const handleJoinSession = (session) => {
    console.log('Joining session:', session.id);
    // Additional analytics or logging can be added here
  };

  const navigateToModified = () => {
    window.location.href = '/modified';
  };

  // Filter sessions based on active tab
  const filteredSessions = sessions.filter(session => {
    const now = Date.now();
    const isUpcoming = session.startTime > now;
    const isPast = session.endTime < now;
    const isToday = session.startTime <= now && session.endTime >= now;

    switch (activeTab) {
      case 'upcoming':
        return isUpcoming && session.status !== 'canceled';
      case 'today':
        return isToday && session.status !== 'canceled';
      case 'past':
        return isPast || session.status === 'completed';
      case 'pending':
        return session.status === 'requested';
      default:
        return true;
    }
  });

  // Calculate stats
  const stats = {
    totalSessions: sessions.length,
    upcomingSessions: sessions.filter(s => s.startTime > Date.now() && s.status !== 'canceled').length,
    pendingRequests: sessions.filter(s => s.status === 'requested').length,
    completedSessions: sessions.filter(s => s.status === 'completed').length
  };

  // Get next upcoming session
  const nextSession = sessions
    .filter(s => s.startTime > Date.now() && s.status === 'confirmed')
    .sort((a, b) => a.startTime - b.startTime)[0];

  if (loading) {
    return (
      <Container>
        <LoadingMessage>Loading your learning sessions...</LoadingMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Understudy Dashboard</Title>
        <Subtitle>Track your learning journey and upcoming sessions</Subtitle>
      </Header>

      {nextSession && (
        <TipContainer>
          <TipTitle>📅 Next Session</TipTitle>
          <TipText>
            Your next learning session is on{' '}
            {new Intl.DateTimeFormat(undefined, {
              weekday: 'long',
              month: 'long', 
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            }).format(new Date(nextSession.startTime))}
          </TipText>
        </TipContainer>
      )}

      <StatsContainer>
        <StatCard>
          <StatNumber>{stats.totalSessions}</StatNumber>
          <StatLabel>Total Sessions</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.upcomingSessions}</StatNumber>
          <StatLabel>Upcoming</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.pendingRequests}</StatNumber>
          <StatLabel>Pending</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.completedSessions}</StatNumber>
          <StatLabel>Completed</StatLabel>
        </StatCard>
      </StatsContainer>

      <QuickActionsContainer>
        <QuickActionsTitle>Quick Actions</QuickActionsTitle>
        <ActionButton onClick={navigateToModified}>
          🎯 Find New Skills
        </ActionButton>
        <ActionButton as="a" href="/skills">
          📚 Browse All Skills
        </ActionButton>
        <ActionButton as="a" href="/profile">
          ⚙️ Update Profile
        </ActionButton>
      </QuickActionsContainer>

      {error && (
        <ErrorMessage>
          Error loading sessions: {error}
        </ErrorMessage>
      )}

      <TabContainer>
        <Tab 
          active={activeTab === 'upcoming'} 
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming ({stats.upcomingSessions})
        </Tab>
        <Tab 
          active={activeTab === 'pending'} 
          onClick={() => setActiveTab('pending')}
        >
          Pending ({stats.pendingRequests})
        </Tab>
        <Tab 
          active={activeTab === 'today'} 
          onClick={() => setActiveTab('today')}
        >
          Today
        </Tab>
        <Tab 
          active={activeTab === 'past'} 
          onClick={() => setActiveTab('past')}
        >
          Past
        </Tab>
      </TabContainer>

      <SessionsList role="list" aria-label={`${activeTab} sessions`}>
        {filteredSessions.length > 0 ? (
          filteredSessions.map(session => (
            <SessionCard
              key={session.id}
              session={session}
              onJoin={handleJoinSession}
              onCancel={handleCancelSession}
              onStatusChange={handleStatusChange}
            />
          ))
        ) : (
          <EmptyState>
            <EmptyStateIcon>
              {activeTab === 'pending' ? '⏳' : 
               activeTab === 'today' ? '📅' :
               activeTab === 'past' ? '📚' : '🌱'}
            </EmptyStateIcon>
            <h3>No {activeTab} sessions</h3>
            <p>
              {activeTab === 'pending' && 'Your session requests are being reviewed by coaches'}
              {activeTab === 'upcoming' && 'Book new learning sessions to get started'}
              {activeTab === 'today' && 'No sessions scheduled for today'}
              {activeTab === 'past' && 'Completed learning sessions will appear here'}
            </p>
            {(activeTab === 'upcoming' || activeTab === 'pending') && (
              <ActionButton onClick={navigateToModified} style={{ marginTop: '1rem' }}>
                Find Skills to Learn
              </ActionButton>
            )}
          </EmptyState>
        )}
      </SessionsList>
    </Container>
  );
}

export default DashboardUnderstudy;