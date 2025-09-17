/**
 * Coach Dashboard
 * Manage distance learning sessions as a coach/teacher
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { get, patch, del, post } from '../utils/http';
import SessionCard from '../components/SessionCard';
import VideoChat from '../components/VideoChat';
import LocationMap from '../components/LocationMap';

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

function DashboardCoach() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [activeVideoSession, setActiveVideoSession] = useState(null);
  const [localMarkers, setLocalMarkers] = useState([]);

  useEffect(() => {
    fetchSessions();
    fetchLocalMarkers();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await get('/sessions?role=coach');
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

  const fetchLocalMarkers = async () => {
    try {
      const data = await get('/guru/locations');
      setLocalMarkers(data.locations || []);
    } catch (error) {
      console.error('Failed to fetch local markers:', error);
    }
  };

  const handleLocationTag = async (locationData) => {
    try {
      await post('/guru/locations', locationData);
      fetchLocalMarkers(); // Refresh markers
    } catch (error) {
      console.error('Failed to tag location:', error);
    }
  };

  const startVideoSession = (sessionId) => {
    setActiveVideoSession(sessionId);
  };

  const endVideoSession = () => {
    setActiveVideoSession(null);
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
      case 'requests':
        return session.status === 'requested';
      case 'video':
        return session.mode === 'video' && (isToday || isUpcoming) && session.status !== 'canceled';
      case 'local':
        return false; // This tab shows map, not sessions
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

  if (loading) {
    return (
      <Container>
        <LoadingMessage>Loading your coaching sessions...</LoadingMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Coach Dashboard</Title>
        <Subtitle>Manage your distance learning sessions</Subtitle>
      </Header>

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
          <StatLabel>Pending Requests</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.completedSessions}</StatNumber>
          <StatLabel>Completed</StatLabel>
        </StatCard>
      </StatsContainer>

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
          active={activeTab === 'requests'} 
          onClick={() => setActiveTab('requests')}
        >
          Requests ({stats.pendingRequests})
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
        <Tab 
          active={activeTab === 'video'} 
          onClick={() => setActiveTab('video')}
        >
          🎥 Video Sessions
        </Tab>
        <Tab 
          active={activeTab === 'local'} 
          onClick={() => setActiveTab('local')}
        >
          📍 Local Map
        </Tab>
      </TabContainer>

      {/* Content based on active tab */}
      {activeTab === 'local' ? (
        <div>
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>Local Session Locations</h2>
          <LocationMap 
            markers={localMarkers}
            onTagLocation={handleLocationTag}
            allowTagging={true}
            category="guru"
          />
        </div>
      ) : activeTab === 'video' && activeVideoSession ? (
        <div>
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>Video Session</h2>
          <VideoChat 
            sessionId={activeVideoSession}
            onEnd={endVideoSession}
          />
        </div>
      ) : (
        <SessionsList role="list" aria-label={`${activeTab} sessions`}>
          {activeTab === 'video' && !activeVideoSession && (
            <div style={{ 
              background: '#2a2a2a', 
              padding: '2rem', 
              borderRadius: '12px', 
              textAlign: 'center', 
              marginBottom: '2rem',
              color: '#ccc' 
            }}>
              <h3>Video Sessions</h3>
              <p>Select a video session below to start the video chat interface</p>
            </div>
          )}
          
          {filteredSessions.length > 0 ? (
            filteredSessions.map(session => (
              <SessionCard
                key={session.id}
                session={session}
                onJoin={activeTab === 'video' ? startVideoSession : handleJoinSession}
                onCancel={handleCancelSession}
                onStatusChange={handleStatusChange}
              />
            ))
          ) : (
            <EmptyState>
              <EmptyStateIcon>
                {activeTab === 'requests' ? '📋' : 
                 activeTab === 'today' ? '📅' :
                 activeTab === 'past' ? '📚' :
                 activeTab === 'video' ? '🎥' : '🎯'}
              </EmptyStateIcon>
              <h3>No {activeTab} sessions</h3>
              <p>
                {activeTab === 'requests' && 'New session requests will appear here'}
                {activeTab === 'upcoming' && 'Your confirmed upcoming sessions will appear here'}
                {activeTab === 'today' && 'Sessions happening today will appear here'}
                {activeTab === 'past' && 'Completed and past sessions will appear here'}
                {activeTab === 'video' && 'Video sessions will appear here when available'}
              </p>
            </EmptyState>
          )}
        </SessionsList>
      )}
    </Container>
  );
}

export default DashboardCoach;