import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Edit3, 
  Star, 
  DollarSign, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  Camera, 
  Settings, 
  Award,
  TrendingUp,
  MessageSquare,
  Shield
} from 'lucide-react';
import Button from '../components/Button';
import SEOMetadata from '../components/SEOMetadata';
import AuthenticationPrompt from '../components/auth/AuthenticationPrompt';
import toast from 'react-hot-toast';

const Container = styled.div`
  min-height: calc(100vh - 140px);
  padding: 2rem 1rem;
  background: ${props => props.theme.colors.bg};
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  background: linear-gradient(135deg, rgba(124, 140, 255, 0.1) 0%, rgba(46, 213, 115, 0.1) 100%);
  border-radius: var(--r-lg);
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  border: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ProfilePhoto = styled.div`
  position: relative;
  
  .photo {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: ${props => props.theme.colors.surface};
    border: 3px solid ${props => props.theme.colors.pri};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: ${props => props.theme.colors.pri};
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .photo-upload {
    position: absolute;
    bottom: 5px;
    right: 5px;
    background: ${props => props.theme.colors.pri};
    color: white;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: ${props => props.theme.colors.priDark};
      transform: scale(1.1);
    }
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
  
  h1 {
    font-size: var(--text-2xl);
    color: ${props => props.theme.colors.text};
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    
    @media (max-width: 768px) {
      justify-content: center;
    }
  }
  
  .user-type {
    background: ${props => props.theme.colors.pri};
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: var(--r-full);
    font-size: var(--text-xs);
    font-weight: 600;
  }
  
  .member-since {
    color: ${props => props.theme.colors.muted};
    font-size: var(--text-sm);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .stats {
    display: flex;
    gap: 2rem;
    margin-top: 1rem;
    
    @media (max-width: 768px) {
      justify-content: center;
    }
  }
  
  .stat {
    text-align: center;
    
    .value {
      font-size: var(--text-lg);
      font-weight: bold;
      color: ${props => props.theme.colors.text};
    }
    
    .label {
      font-size: var(--text-xs);
      color: ${props => props.theme.colors.muted};
      margin-top: 0.25rem;
    }
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const DashboardCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: var(--r-lg);
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  
  h2 {
    font-size: var(--text-lg);
    color: ${props => props.theme.colors.text};
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  h3 {
    font-size: var(--text-md);
    color: ${props => props.theme.colors.text};
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const SkillsList = styled.div`
  display: flex;
  flex-wrap: gap;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const SkillTag = styled.span`
  background: rgba(124, 140, 255, 0.1);
  color: ${props => props.theme.colors.pri};
  padding: 0.5rem 1rem;
  border-radius: var(--r-full);
  font-size: var(--text-sm);
  font-weight: 500;
  border: 1px solid rgba(124, 140, 255, 0.2);
`;

const EarningsChart = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`;

const EarningStat = styled.div`
  text-align: center;
  padding: 1rem;
  background: ${props => props.theme.colors.elev};
  border-radius: var(--r-md);
  
  .amount {
    font-size: var(--text-lg);
    font-weight: bold;
    color: ${props => props.theme.colors.suc};
  }
  
  .period {
    font-size: var(--text-xs);
    color: ${props => props.theme.colors.muted};
    margin-top: 0.25rem;
  }
`;

const QuickActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const ActionButton = styled(Button)`
  flex: 1;
  min-width: 140px;
`;

const ContactInfo = styled.div`
  .contact-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    
    &:last-child {
      border-bottom: none;
    }
    
    .icon {
      color: ${props => props.theme.colors.muted};
    }
    
    .info {
      flex: 1;
      
      .value {
        color: ${props => props.theme.colors.text};
        font-weight: 500;
      }
      
      .label {
        font-size: var(--text-xs);
        color: ${props => props.theme.colors.muted};
      }
    }
    
    .edit-btn {
      color: ${props => props.theme.colors.muted};
      cursor: pointer;
      transition: color 0.2s;
      
      &:hover {
        color: ${props => props.theme.colors.pri};
      }
    }
  }
`;

function ProfilePage() {
  const { currentUser: user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.displayName?.split(' ')[0] || 'John',
    lastName: user?.displayName?.split(' ')[1] || 'Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    userType: 'Skill Sharer',
    memberSince: new Date().toLocaleDateString(),
    bio: 'Passionate about sharing knowledge and helping my community grow.',
    skills: ['JavaScript', 'React', 'Node.js', 'Tutoring', 'Web Design'],
    ratings: {
      average: 4.8,
      total: 127
    },
    earnings: {
      thisMonth: 1250,
      lastMonth: 980,
      total: 15420
    },
    activeListings: 3,
    completedJobs: 45
  });

  useEffect(() => {
    // In a real app, this would fetch user profile data from the API
    if (user) {
      setProfileData(prev => ({
        ...prev,
        firstName: user.displayName?.split(' ')[0] || prev.firstName,
        lastName: user.displayName?.split(' ')[1] || prev.lastName,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const handlePhotoUpload = () => {
    // In a real app, this would handle file upload
    toast.success('Photo upload feature coming soon!');
  };

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Save profile when closing edit mode
      toast.success('Profile updated successfully!');
    }
  };

  const seoData = {
    title: `${profileData.firstName}'s Profile - yoohoo.guru`,
    description: 'Manage your yoohoo.guru profile, view earnings, and update your skills and availability.',
    keywords: 'profile, dashboard, earnings, skills, yoohoo.guru',
    canonicalUrl: window.location.href
  };

  if (!user) {
    return (
      <AuthenticationPrompt
        title="Sign In Required"
        subtitle="Access your personal profile, manage your skills, track earnings, and connect with your community."
        returnPath="/profile"
        message="Sign in to access your profile"
      />
    );
  }

  return (
    <Container>
      <SEOMetadata {...seoData} />
      <Content>
        <ProfileHeader>
          <ProfilePhoto>
            <div className="photo">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={profileData.firstName} />
              ) : (
                <User size={48} />
              )}
            </div>
            <button className="photo-upload" onClick={handlePhotoUpload}>
              <Camera size={16} />
            </button>
          </ProfilePhoto>
          
          <ProfileInfo>
            <h1>
              {profileData.firstName} {profileData.lastName}
              <span className="user-type">{profileData.userType}</span>
            </h1>
            
            <div className="member-since">
              <Calendar size={16} />
              Member since {profileData.memberSince}
            </div>
            
            <div className="stats">
              <div className="stat">
                <div className="value">{profileData.ratings.average}★</div>
                <div className="label">{profileData.ratings.total} Reviews</div>
              </div>
              <div className="stat">
                <div className="value">{profileData.activeListings}</div>
                <div className="label">Active Listings</div>
              </div>
              <div className="stat">
                <div className="value">{profileData.completedJobs}</div>
                <div className="label">Completed Jobs</div>
              </div>
            </div>
            
            <QuickActions style={{ marginTop: '1rem' }}>
              <ActionButton 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/account/settings')}
              >
                <Settings size={16} />
                Account Settings
              </ActionButton>
            </QuickActions>
          </ProfileInfo>
        </ProfileHeader>

        <DashboardGrid>
          <MainContent>
            {/* Earnings Dashboard */}
            <DashboardCard>
              <h2>
                <DollarSign size={20} />
                Earnings Overview
              </h2>
              <EarningsChart>
                <EarningStat>
                  <div className="amount">${profileData.earnings.thisMonth}</div>
                  <div className="period">This Month</div>
                </EarningStat>
                <EarningStat>
                  <div className="amount">${profileData.earnings.lastMonth}</div>
                  <div className="period">Last Month</div>
                </EarningStat>
                <EarningStat>
                  <div className="amount">${profileData.earnings.total}</div>
                  <div className="period">Total Earned</div>
                </EarningStat>
              </EarningsChart>
              <QuickActions>
                <ActionButton variant="primary" size="sm">
                  <TrendingUp size={16} />
                  View Analytics
                </ActionButton>
                <ActionButton variant="outline" size="sm">
                  <DollarSign size={16} />
                  Payout Settings
                </ActionButton>
              </QuickActions>
            </DashboardCard>

            {/* Skills Management */}
            <DashboardCard>
              <h2>
                <Award size={20} />
                Your Skills
              </h2>
              <SkillsList>
                {profileData.skills.map((skill, index) => (
                  <SkillTag key={index}>{skill}</SkillTag>
                ))}
              </SkillsList>
              <QuickActions>
                <ActionButton variant="outline" size="sm">
                  <Edit3 size={16} />
                  Edit Skills
                </ActionButton>
                <ActionButton variant="primary" size="sm">
                  Add New Skill
                </ActionButton>
              </QuickActions>
            </DashboardCard>

            {/* Recent Activity */}
            <DashboardCard>
              <h2>
                <MessageSquare size={20} />
                Recent Activity
              </h2>
              <div style={{ 
                padding: '2rem', 
                textAlign: 'center', 
                color: 'var(--muted)',
                background: 'var(--surface)',
                borderRadius: 'var(--r-md)',
                border: '1px dashed var(--border)'
              }}>
                <MessageSquare size={32} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>No recent messages or bookings.</p>
                <p style={{ fontSize: 'var(--text-sm)' }}>
                  Your activity will appear here once you start connecting with the community.
                </p>
              </div>
            </DashboardCard>
          </MainContent>

          <Sidebar>
            {/* Contact Information */}
            <DashboardCard>
              <h3>
                <User size={18} />
                Contact Information
              </h3>
              <ContactInfo>
                <div className="contact-item">
                  <Mail size={16} className="icon" />
                  <div className="info">
                    <div className="value">{profileData.email}</div>
                    <div className="label">Email</div>
                  </div>
                  <Edit3 size={14} className="edit-btn" />
                </div>
                
                <div className="contact-item">
                  <Phone size={16} className="icon" />
                  <div className="info">
                    <div className="value">{profileData.phone}</div>
                    <div className="label">Phone</div>
                  </div>
                  <Edit3 size={14} className="edit-btn" />
                </div>
                
                <div className="contact-item">
                  <MapPin size={16} className="icon" />
                  <div className="info">
                    <div className="value">{profileData.location}</div>
                    <div className="label">Location</div>
                  </div>
                  <Edit3 size={14} className="edit-btn" />
                </div>
              </ContactInfo>
            </DashboardCard>

            {/* Quick Actions */}
            <DashboardCard>
              <h3>
                <Settings size={18} />
                Quick Actions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Button variant="primary" size="sm" onClick={handleEditProfile}>
                  <Edit3 size={16} />
                  Edit Profile
                </Button>
                <Button variant="outline" size="sm">
                  <Star size={16} />
                  Post New Service
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar size={16} />
                  Manage Availability
                </Button>
                <Button variant="outline" size="sm">
                  <Shield size={16} />
                  Privacy Settings
                </Button>
              </div>
            </DashboardCard>

            {/* Subscription Status */}
            <DashboardCard>
              <h3>Subscription Status</h3>
              <div style={{ 
                textAlign: 'center',
                padding: '1rem',
                background: 'linear-gradient(135deg, rgba(124, 140, 255, 0.1) 0%, rgba(46, 213, 115, 0.1) 100%)',
                borderRadius: 'var(--r-md)',
                marginBottom: '1rem'
              }}>
                <div style={{ 
                  fontSize: 'var(--text-lg)', 
                  fontWeight: 'bold',
                  color: 'var(--pri)',
                  marginBottom: '0.25rem'
                }}>
                  Skill Sharer Plan
                </div>
                <div style={{ 
                  fontSize: 'var(--text-sm)',
                  color: 'var(--muted)'
                }}>
                  $9/month • Renews Dec 15, 2024
                </div>
              </div>
              <Button variant="outline" size="sm" style={{ width: '100%' }}>
                Manage Subscription
              </Button>
            </DashboardCard>
          </Sidebar>
        </DashboardGrid>
      </Content>
    </Container>
  );
}

export default ProfilePage;