/**
 * AI-Powered Skill Matching Component
 * Shows personalized guru-understudy matches with AI insights
 */

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Star, MapPin, Zap, Brain, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';
import { getGuruMatches, getUnderstudyRecommendations, formatMatchForDisplay } from '../lib/matchmakingApi';

const Container = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.radius.lg}px;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  margin-bottom: 2rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;

  h3 {
    color: ${props => props.theme.colors.text};
    font-size: var(--text-xl);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const AIBadge = styled.span`
  background: linear-gradient(135deg, ${props => props.theme.colors.pri} 0%, ${props => props.theme.colors.succ} 100%);
  color: ${props => props.theme.colors.bg};
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.radius.full}px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const MatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
`;

const MatchCard = styled.div`
  background: ${props => props.theme.colors.bg};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.md}px;
  padding: 1rem;
  transition: all 0.2s;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadow.lg};
    border-color: ${props => props.theme.colors.pri};
  }
`;

const MatchScore = styled.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: ${props => props.scoreColor === 'green' ? props.theme.colors.succ : 
              props.scoreColor === 'blue' ? props.theme.colors.pri : props.theme.colors.warn};
  color: ${props => props.theme.colors.bg};
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.radius.sm}px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${props => props.theme.colors.border};
`;

const UserDetails = styled.div`
  flex: 1;

  h4 {
    color: ${props => props.theme.colors.text};
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
    font-weight: 600;
  }

  .location {
    color: ${props => props.theme.colors.muted};
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin-bottom: 0.5rem;
  }

  .rating {
    color: ${props => props.theme.colors.warn};
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
`;

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.75rem 0;
`;

const SkillTag = styled.span`
  background: rgba(124, 140, 255, 0.1);
  color: ${props => props.theme.colors.pri};
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.radius.sm}px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const MatchReason = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.sm}px;
  padding: 0.75rem;
  margin: 0.75rem 0;
  
  .title {
    color: ${props => props.theme.colors.text};
    font-weight: 600;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .content {
    color: ${props => props.theme.colors.muted};
    font-size: 0.875rem;
    line-height: 1.4;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  color: ${props => props.theme.colors.muted};

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid ${props => props.theme.colors.border};
    border-top: 3px solid ${props => props.theme.colors.pri};
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.muted};

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  h4 {
    color: ${props => props.theme.colors.text};
    margin-bottom: 0.5rem;
  }
`;

function SkillMatchingComponent() {
  const { currentUser } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiProvider, setAiProvider] = useState(null);

  useEffect(() => {
    loadMatches();
  }, [currentUser, loadMatches]);

  const loadMatches = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      let response;
      
      // Determine if user is guru or understudy based on profile
      // For demo purposes, assume users with rating are gurus
      const isGuru = currentUser.rating || currentUser.role === 'guru';
      
      if (isGuru) {
        response = await getGuruMatches(currentUser.uid, { limit: 4 });
        setAiProvider(response.aiProvider);
      } else {
        response = await getUnderstudyRecommendations(currentUser.uid, { limit: 4 });
      }

      if (response.success) {
        const matchesData = response.matches || response.recommendations || [];
        const formattedMatches = matchesData.map(formatMatchForDisplay);
        setMatches(formattedMatches);
      } else {
        setError(response.error || 'Failed to load matches');
      }
    } catch (err) {
      console.error('Error loading matches:', err);
      setError('Failed to load matches. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const handleConnect = (match) => {
    // In production, this would open a message composer or booking flow
    console.log('Connecting with:', match);
    alert(`Feature coming soon! You'll be able to connect with ${match.guru?.displayName || match.displayName} directly.`);
  };

  const handleViewProfile = (match) => {
    // In production, this would navigate to the user's full profile
    console.log('Viewing profile:', match);
    alert(`Profile view coming soon! You'll be able to see the full profile of ${match.guru?.displayName || match.displayName}.`);
  };

  if (!currentUser) return null;

  const isGuru = currentUser.rating || currentUser.role === 'guru';
  const title = isGuru ? '🎯 Perfect Understudy Matches' : '🌟 Recommended Gurus';
  const subtitle = isGuru ? 'AI-powered matches for your skills' : 'Personalized learning recommendations';

  return (
    <Container>
      <Header>
        <h3>
          <Brain size={24} />
          {title}
        </h3>
        {aiProvider && (
          <AIBadge>
            <Zap size={12} />
            AI-Powered
          </AIBadge>
        )}
      </Header>

      {loading && (
        <LoadingState>
          <div className="spinner"></div>
          <p>Finding your perfect matches...</p>
        </LoadingState>
      )}

      {error && (
        <EmptyState>
          <div className="icon">⚠️</div>
          <h4>Matching Unavailable</h4>
          <p>{error}</p>
          <Button variant="outline" size="sm" onClick={loadMatches}>
            Try Again
          </Button>
        </EmptyState>
      )}

      {!loading && !error && matches.length === 0 && (
        <EmptyState>
          <div className="icon">🔍</div>
          <h4>No Matches Found</h4>
          <p>{isGuru ? 'Complete your profile to find understudies' : 'Complete your profile to find gurus'}</p>
          <Button variant="primary" size="sm" onClick={() => window.location.href = '/profile'}>
            Complete Profile
          </Button>
        </EmptyState>
      )}

      {!loading && !error && matches.length > 0 && (
        <>
          <p style={{color: 'var(--muted)', marginBottom: '1.5rem', fontSize: '0.9rem'}}>
            {subtitle} • Found {matches.length} excellent matches
          </p>
          
          <MatchGrid>
            {matches.map((match, index) => {
              const user = match.guru || match; // Handle both guru recommendations and direct matches
              return (
                <MatchCard key={match.understudyId || user.id || index}>
                  <MatchScore scoreColor={match.scoreColor}>
                    {match.scoreText}
                  </MatchScore>

                  <UserInfo>
                    <Avatar 
                      src={user.photoURL || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'} 
                      alt={user.displayName}
                    />
                    <UserDetails>
                      <h4>{user.displayName}</h4>
                      {user.location && (
                        <div className="location">
                          <MapPin size={14} />
                          {user.location}
                        </div>
                      )}
                      {user.rating && (
                        <div className="rating">
                          <Star size={14} fill="currentColor" />
                          {user.rating} ({user.totalSessions || 0} sessions)
                        </div>
                      )}
                    </UserDetails>
                  </UserInfo>

                  <SkillTags>
                    {(user.skillsOffered || []).slice(0, 3).map((skill, idx) => (
                      <SkillTag key={idx}>{skill}</SkillTag>
                    ))}
                  </SkillTags>

                  {match.reasoning && (
                    <MatchReason>
                      <div className="title">
                        <TrendingUp size={14} />
                        Why this match
                      </div>
                      <div className="content">{match.reasoning}</div>
                    </MatchReason>
                  )}

                  <ActionButtons>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => handleConnect(match)}
                    >
                      Connect
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewProfile(match)}
                    >
                      View Profile
                    </Button>
                  </ActionButtons>
                </MatchCard>
              );
            })}
          </MatchGrid>

          <div style={{textAlign: 'center', marginTop: '1.5rem'}}>
            <Button variant="outline" onClick={() => window.location.href = '/skills'}>
              View All {isGuru ? 'Understudies' : 'Gurus'}
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}

export default SkillMatchingComponent;