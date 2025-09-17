import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import AdminGuard from '../components/AdminGuard';
import ComingSoon from '../components/ComingSoon';
import Button from '../components/Button';

const Container = styled.div`
  min-height: 100vh;
  background: var(--background);
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
`;

const Title = styled.h1`
  color: var(--text);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  margin: 0;
`;

const LogoutButton = styled(Button)`
  background: var(--error);
  border-color: var(--error);
  
  &:hover {
    background: #c82333;
    border-color: #c82333;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border);
`;

const Tab = styled.button`
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 0.75rem 1rem;
  font-size: var(--text-base);
  color: ${props => props.active ? 'var(--primary)' : 'var(--text-secondary)'};
  border-bottom-color: ${props => props.active ? 'var(--primary)' : 'transparent'};
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    color: var(--primary);
  }
`;

const Content = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 2rem;
  min-height: 400px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--text);
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: var(--text-sm);
  color: var(--text-secondary);
`;

const FeatureFlagList = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const FeatureFlagItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 6px;
`;

const FlagName = styled.span`
  color: var(--text);
  font-weight: var(--font-medium);
  text-transform: capitalize;
`;

const FlagStatus = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  background: ${props => props.enabled ? 'var(--success)' : 'var(--gray-600)'};
  color: white;
`;

const PlaceholderText = styled.p`
  color: var(--text-secondary);
  text-align: center;
  font-style: italic;
  margin: 2rem 0;
`;

const DocumentCard = styled.div`
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1rem;
  background: var(--surface);
  margin-bottom: 0.5rem;
`;

function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState(null);
  const [featureFlags, setFeatureFlags] = useState({});
  const [loading, setLoading] = useState(true);
  const [pendingDocuments, setPendingDocuments] = useState([]);
  const [actionHistory, setActionHistory] = useState([]);
  const [liveStats, setLiveStats] = useState(null);
  const [credentials, setCredentials] = useState({ username: '', password: '', email: '' });
  const navigate = useNavigate();

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'listings', label: 'Listings' },
    { id: 'sessions', label: 'Sessions' },
    { id: 'reports', label: 'Reports' },
    { id: 'flags', label: 'Feature Flags' },
    { id: 'documents', label: 'Documents' },
    { id: 'actions', label: 'Action History' },
    { id: 'stats', label: 'Live Stats' },
    { id: 'credentials', label: 'Admin Setup' }
  ];

  useEffect(() => {
    loadDashboardData();
    loadFeatureFlags();
    loadActionHistory();
    loadLiveStats();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data.data);
      } else {
        console.error('Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const loadFeatureFlags = async () => {
    try {
      const response = await fetch('/api/feature-flags/admin', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setFeatureFlags(data.flags);
      }
    } catch (error) {
      console.error('Error loading feature flags:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPendingDocuments = async () => {
    try {
      const response = await fetch('/api/documents/pending', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setPendingDocuments(data.data.pending || []);
      }
    } catch (error) {
      console.error('Error loading pending documents:', error);
    }
  };

  const handleDocumentAction = async (uid, docId, status, reason = '') => {
    try {
      const response = await fetch(`/api/documents/${uid}/${docId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status, reason })
      });
      
      if (response.ok) {
        // Reload pending documents after action
        loadPendingDocuments();
      } else {
        alert('Failed to update document status');
      }
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Error updating document status');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      navigate('/', { replace: true });
    }
  };

  const loadActionHistory = async () => {
    try {
      const response = await fetch('/api/admin/action-history', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setActionHistory(data.data.recentActions || []);
      }
    } catch (error) {
      console.error('Error loading action history:', error);
    }
  };

  const loadLiveStats = async () => {
    try {
      const response = await fetch('/api/admin/live-stats', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setLiveStats(data.data);
      }
    } catch (error) {
      console.error('Error loading live stats:', error);
    }
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password || !credentials.email) {
      alert('All fields are required');
      return;
    }

    try {
      const response = await fetch('/api/admin/update-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(credentials)
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(`Credentials updated successfully! Email notification sent to ${data.data.email}`);
        setCredentials({ username: '', password: '', email: '' });
      } else {
        const error = await response.json();
        alert(`Failed to update credentials: ${error.error.message}`);
      }
    } catch (error) {
      console.error('Error updating credentials:', error);
      alert('Error updating credentials');
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getActionIcon = (type) => {
    switch (type) {
      case 'deployment': return '🚀';
      case 'upload': return '📄';
      case 'git_push': return '💻';
      case 'system': return '⚙️';
      default: return '📋';
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return <PlaceholderText>Loading...</PlaceholderText>;
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <h2 style={{ color: 'var(--text)', marginBottom: '1rem' }}>
              System Overview
            </h2>
            <StatsGrid>
              <StatCard>
                <StatValue>{dashboardData?.users?.total || 0}</StatValue>
                <StatLabel>Total Users</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{dashboardData?.listings?.total || 0}</StatValue>
                <StatLabel>Skill Listings</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{dashboardData?.sessions?.total || 0}</StatValue>
                <StatLabel>Exchange Sessions</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{dashboardData?.reports?.total || 0}</StatValue>
                <StatLabel>Reports</StatLabel>
              </StatCard>
            </StatsGrid>
          </div>
        );
      
      case 'users':
        return (
          <div>
            <h2 style={{ color: 'var(--text)', marginBottom: '1rem' }}>
              User Management <ComingSoon />
            </h2>
            <PlaceholderText>
              User management features will be available in a future release.
            </PlaceholderText>
          </div>
        );
      
      case 'listings':
        return (
          <div>
            <h2 style={{ color: 'var(--text)', marginBottom: '1rem' }}>
              Skill Listings <ComingSoon />
            </h2>
            <PlaceholderText>
              Listing management features will be available in a future release.
            </PlaceholderText>
          </div>
        );
      
      case 'sessions':
        return (
          <div>
            <h2 style={{ color: 'var(--text)', marginBottom: '1rem' }}>
              Exchange Sessions <ComingSoon />
            </h2>
            <PlaceholderText>
              Session management features will be available in a future release.
            </PlaceholderText>
          </div>
        );
      
      case 'reports':
        return (
          <div>
            <h2 style={{ color: 'var(--text)', marginBottom: '1rem' }}>
              Reports & Analytics <ComingSoon />
            </h2>
            <PlaceholderText>
              Reporting features will be available in a future release.
            </PlaceholderText>
          </div>
        );
      
      case 'flags':
        return (
          <div>
            <h2 style={{ color: 'var(--text)', marginBottom: '1rem' }}>
              Feature Flags
            </h2>
            <FeatureFlagList>
              {Object.entries(featureFlags).map(([key, value]) => (
                <FeatureFlagItem key={key}>
                  <FlagName>{key.replace(/([A-Z])/g, ' $1').trim()}</FlagName>
                  <FlagStatus enabled={value}>
                    {value ? 'Enabled' : 'Disabled'}
                  </FlagStatus>
                </FeatureFlagItem>
              ))}
            </FeatureFlagList>
          </div>
        );
      
      case 'documents':
        return (
          <div>
            <h2 style={{ color: 'var(--text)', marginBottom: '1rem' }}>
              Document Review
            </h2>
            <div style={{ marginBottom: '1rem' }}>
              <button 
                onClick={loadPendingDocuments}
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Refresh Pending Documents
              </button>
            </div>
            {pendingDocuments.length === 0 ? (
              <PlaceholderText>No pending documents for review</PlaceholderText>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {pendingDocuments.map((doc) => (
                  <DocumentCard key={`${doc.uid}-${doc.id}`}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Type:</strong> {doc.type}
                      {doc.category && <span> ({doc.category})</span>}
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Provider:</strong> {doc.provider || 'Not specified'}
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Number:</strong> {doc.number || 'Not specified'}
                    </div>
                    {doc.file_url && (
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong>File:</strong> <a href={doc.file_url} target="_blank" rel="noopener noreferrer">View Document</a>
                      </div>
                    )}
                    <div style={{ marginBottom: '1rem' }}>
                      <strong>User ID:</strong> {doc.uid}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleDocumentAction(doc.uid, doc.id, 'approved')}
                        style={{
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Reason for rejection (optional):');
                          handleDocumentAction(doc.uid, doc.id, 'rejected', reason);
                        }}
                        style={{
                          background: '#dc2626',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </DocumentCard>
                ))}
              </div>
            )}
          </div>
        );
      
      case 'actions':
        return (
          <div>
            <h2 style={{ color: 'var(--text)', marginBottom: '1rem' }}>
              Action History
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--text)' }}>Time</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--text)' }}>Type</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--text)' }}>Action</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--text)' }}>User</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--text)' }}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {actionHistory.map(action => (
                    <tr key={action.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>
                        {formatTimestamp(action.timestamp)}
                      </td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{ marginRight: '0.5rem' }}>{getActionIcon(action.type)}</span>
                        <span style={{ color: 'var(--text)' }}>{action.type}</span>
                      </td>
                      <td style={{ padding: '0.75rem', color: 'var(--text)' }}>{action.action}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>{action.user}</td>
                      <td style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>
                        {action.branch && <span>Branch: {action.branch} </span>}
                        {action.commit && <span>({action.commit}) </span>}
                        <span>{action.details}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'stats':
        return (
          <div>
            <h2 style={{ color: 'var(--text)', marginBottom: '1rem' }}>
              Live Statistics
            </h2>
            {liveStats && (
              <div>
                <StatsGrid>
                  <StatCard>
                    <StatValue style={{ color: '#4CAF50' }}>{liveStats.realTimeVisitors}</StatValue>
                    <StatLabel>Live Visitors</StatLabel>
                  </StatCard>
                  <StatCard>
                    <StatValue>{liveStats.todayVisitors}</StatValue>
                    <StatLabel>Today&apos;s Visitors</StatLabel>
                  </StatCard>
                </StatsGrid>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                  <div>
                    <h3 style={{ color: 'var(--text)', marginBottom: '1rem' }}>Page Statistics</h3>
                    <div>
                      {Object.entries(liveStats.pageStats || {}).map(([page, stats]) => (
                        <div key={page} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          padding: '0.5rem',
                          borderBottom: '1px solid var(--border)',
                          color: 'var(--text)'
                        }}>
                          <span>{page}</span>
                          <span>{stats.visits} visits</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 style={{ color: 'var(--text)', marginBottom: '1rem' }}>Subdomain Traffic</h3>
                    <div>
                      {Object.entries(liveStats.subdomainStats || {}).map(([subdomain, stats]) => (
                        <div key={subdomain} style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          padding: '0.5rem',
                          borderBottom: '1px solid var(--border)',
                          color: 'var(--text)'
                        }}>
                          <span>{subdomain}</span>
                          <span>{stats.visits} visits ({stats.visitors} visitors)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '2rem' }}>
                  <h3 style={{ color: 'var(--text)', marginBottom: '1rem' }}>Top Locations</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    {liveStats.topLocations?.map((location, index) => (
                      <div key={index} style={{
                        background: 'var(--surface)',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{location.flag}</div>
                        <div style={{ color: 'var(--text)', fontWeight: 'bold' }}>{location.country}</div>
                        <div style={{ color: 'var(--text-secondary)' }}>{location.visitors}% of visitors</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'credentials':
        return (
          <div>
            <h2 style={{ color: 'var(--text)', marginBottom: '1rem' }}>
              Admin Credentials Setup
            </h2>
            <form onSubmit={handleCredentialsSubmit} style={{ maxWidth: '500px' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: 'var(--text)', marginBottom: '0.5rem' }}>
                  Username:
                </label>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    background: 'var(--surface)',
                    color: 'var(--text)'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: 'var(--text)', marginBottom: '0.5rem' }}>
                  Password:
                </label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    background: 'var(--surface)',
                    color: 'var(--text)'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', color: 'var(--text)', marginBottom: '0.5rem' }}>
                  Email (for notifications):
                </label>
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    background: 'var(--surface)',
                    color: 'var(--text)'
                  }}
                  placeholder="brandonlane1977@gmail.com"
                  required
                />
              </div>

              <button
                type="submit"
                style={{
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Update Credentials & Send Email
              </button>
            </form>

            <div style={{
              marginTop: '2rem',
              padding: '1rem',
              background: 'rgba(76, 175, 80, 0.1)',
              border: '1px solid rgba(76, 175, 80, 0.3)',
              borderRadius: '8px',
              color: 'var(--text)'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>📧 Email Notification</h4>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                When you update credentials, an email with the access details will be sent to brandonlane1977@gmail.com
              </p>
            </div>
          </div>
        );
      
      default:
        return <PlaceholderText>Select a tab to view content</PlaceholderText>;
    }
  };

  return (
    <AdminGuard>
      <Container>
        <Header>
          <Title>🎯 yoohoo.guru Admin Dashboard</Title>
          <LogoutButton onClick={handleLogout}>
            Logout
          </LogoutButton>
        </Header>

        <TabContainer>
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Tab>
          ))}
        </TabContainer>

        <Content>
          {renderTabContent()}
        </Content>
      </Container>
    </AdminGuard>
  );
}

export default AdminDashboardPage;