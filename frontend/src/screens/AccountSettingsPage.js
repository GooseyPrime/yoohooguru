import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  Shield, 
  Trash2, 
  Link2, 
  ArrowLeft,
  Settings as SettingsIcon,
  Lock,
  UserX
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import SEOMetadata from '../components/SEOMetadata';
import AuthenticationPrompt from '../components/auth/AuthenticationPrompt';

const Container = styled.div`
  min-height: 100vh;
  background: var(--bg);
  padding: 2rem 1rem;
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  background: white;
  border-radius: var(--r-lg);
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-sm);
`;

const Title = styled.h1`
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--dark);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: var(--gray);
  font-size: var(--text-base);
`;

const Section = styled.div`
  background: white;
  border-radius: var(--r-lg);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-sm);
`;

const SectionTitle = styled.h2`
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--dark);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SectionDescription = styled.p`
  color: var(--gray);
  font-size: var(--text-sm);
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border);

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const SettingInfo = styled.div`
  flex: 1;
`;

const SettingLabel = styled.h3`
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--dark);
  margin-bottom: 0.25rem;
`;

const SettingDescription = styled.p`
  font-size: var(--text-sm);
  color: var(--gray);
`;

const DangerZone = styled(Section)`
  border: 1px solid rgba(239, 68, 68, 0.2);
`;

const WarningBox = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--r-md);
  padding: 1rem;
  margin: 1rem 0;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

const WarningText = styled.p`
  color: #b91c1c;
  font-size: var(--text-sm);
  line-height: 1.5;
  margin: 0;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  font-size: var(--text-base);
  margin: 0.5rem 0 1rem 0;

  &:focus {
    outline: none;
    border-color: var(--pri);
    box-shadow: 0 0 0 3px rgba(124, 140, 255, 0.1);
  }

  &.error {
    border-color: var(--danger);
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }
`;

const BackLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--pri);
  background: none;
  border: none;
  font-size: var(--text-sm);
  cursor: pointer;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
  transition: color 0.2s ease;

  &:hover {
    color: var(--pri-dark);
  }
`;

function AccountSettingsPage() {
  const { 
    user, 
    logout, 
    hideProfile, 
    deleteAccount, 
    requestAccountMerge 
  } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [profileHidden, setProfileHidden] = useState(false);
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('');
  const [mergeTargetEmail, setMergeTargetEmail] = useState('');

  const seoData = {
    title: 'Account Settings - yoohoo.guru',
    description: 'Manage your yoohoo.guru account settings, privacy options, and data preferences.',
    keywords: 'account settings, privacy, data management, yoohoo.guru'
  };

  const handleProfileVisibility = async () => {
    setIsLoading(true);
    try {
      await hideProfile(!profileHidden);
      setProfileHidden(!profileHidden);
    } catch (error) {
      console.error('Failed to update profile visibility:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountDeletion = async () => {
    if (!deleteConfirmEmail || deleteConfirmEmail !== user?.email) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteAccount(deleteConfirmEmail);
      // Logout and redirect to home
      await logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Failed to delete account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountMerge = async () => {
    if (!mergeTargetEmail) return;

    setIsLoading(true);
    try {
      await requestAccountMerge(mergeTargetEmail, 'google.com');
      setMergeTargetEmail('');
    } catch (error) {
      console.error('Failed to request account merge:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <AuthenticationPrompt
        title="Account Settings Access"
        subtitle="Sign in to manage your account settings, privacy controls, and security preferences."
        returnPath="/account/settings"
        message="Sign in to access account settings"
        features={[
          { icon: SettingsIcon, text: "Manage account preferences and settings" },
          { icon: Shield, text: "Control privacy and security options" },
          { icon: Lock, text: "Update password and authentication" },
          { icon: UserX, text: "Account deletion and data management" }
        ]}
      />
    );
  }

  return (
    <Container>
      <SEOMetadata {...seoData} />
      <Content>
        <BackLink onClick={() => navigate('/profile')}>
          <ArrowLeft size={16} />
          Back to Profile
        </BackLink>

        <Header>
          <Title>Account Settings</Title>
          <Subtitle>Manage your account security, privacy, and data preferences.</Subtitle>
        </Header>

        {/* Privacy Settings */}
        <Section>
          <SectionTitle>
            <Eye size={20} />
            Privacy Settings
          </SectionTitle>
          <SectionDescription>
            Control how your profile appears to other users on the platform.
          </SectionDescription>
          
          <SettingRow>
            <SettingInfo>
              <SettingLabel>Profile Visibility</SettingLabel>
              <SettingDescription>
                {profileHidden 
                  ? 'Your profile is hidden from public view' 
                  : 'Your profile is visible to other users'
                }
              </SettingDescription>
            </SettingInfo>
            <Button
              variant={profileHidden ? 'primary' : 'outline'}
              onClick={handleProfileVisibility}
              loading={isLoading}
              style={{ minWidth: '120px' }}
            >
              {profileHidden ? (
                <>
                  <Eye size={16} style={{ marginRight: '0.5rem' }} />
                  Show Profile
                </>
              ) : (
                <>
                  <EyeOff size={16} style={{ marginRight: '0.5rem' }} />
                  Hide Profile
                </>
              )}
            </Button>
          </SettingRow>
        </Section>

        {/* Account Merging */}
        <Section>
          <SectionTitle>
            <Link2 size={20} />
            Account Merging
          </SectionTitle>
          <SectionDescription>
            Link your Google account with your email/password account to access your data from both login methods.
          </SectionDescription>
          
          <div>
            <SettingLabel style={{ marginBottom: '0.5rem' }}>
              Merge with Google Account
            </SettingLabel>
            <SettingDescription style={{ marginBottom: '1rem' }}>
              Enter the email address of the Google account you want to merge with this account.
            </SettingDescription>
            <Input
              type="email"
              placeholder="Enter Google account email"
              value={mergeTargetEmail}
              onChange={(e) => setMergeTargetEmail(e.target.value)}
            />
            <Button
              variant="primary"
              onClick={handleAccountMerge}
              loading={isLoading}
              disabled={!mergeTargetEmail}
            >
              <Link2 size={16} style={{ marginRight: '0.5rem' }} />
              Request Account Merge
            </Button>
          </div>
        </Section>

        {/* Danger Zone */}
        <DangerZone>
          <SectionTitle style={{ color: 'var(--danger)' }}>
            <Shield size={20} />
            Danger Zone
          </SectionTitle>
          <SectionDescription>
            These actions are permanent and cannot be undone. Please proceed with caution.
          </SectionDescription>

          <WarningBox>
            <AlertTriangle size={20} color="#b91c1c" style={{ flexShrink: 0, marginTop: '2px' }} />
            <WarningText>
              Account deletion is permanent after 30 days. During this period, you can restore your account by logging in.
            </WarningText>
          </WarningBox>

          <div>
            <SettingLabel style={{ color: 'var(--danger)', marginBottom: '0.5rem' }}>
              Delete Account
            </SettingLabel>
            <SettingDescription style={{ marginBottom: '1rem' }}>
              Permanently delete your account and all associated data. This action schedules your account for deletion in 30 days.
              Type your email address to confirm.
            </SettingDescription>
            <Input
              type="email"
              placeholder={`Type ${user.email} to confirm`}
              value={deleteConfirmEmail}
              onChange={(e) => setDeleteConfirmEmail(e.target.value)}
              className={deleteConfirmEmail && deleteConfirmEmail !== user.email ? 'error' : ''}
            />
            <Button
              variant="danger"
              onClick={handleAccountDeletion}
              loading={isLoading}
              disabled={deleteConfirmEmail !== user.email}
            >
              <Trash2 size={16} style={{ marginRight: '0.5rem' }} />
              Delete Account
            </Button>
          </div>
        </DangerZone>
      </Content>
    </Container>
  );
}

export default AccountSettingsPage;