import { useEffect, useMemo, useState } from 'react';
import { GetServerSideProps } from 'next';
import { getSession, useSession } from 'next-auth/react';
import Head from 'next/head';
import { Header, Footer } from '@yoohooguru/shared';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08), transparent 30%),
    radial-gradient(circle at 80% 10%, rgba(236, 72, 153, 0.08), transparent 25%),
    #050510;
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem 1.5rem 3rem;
`;

const PageHeader = styled.div`
  max-width: 960px;
  margin: 0 auto 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Title = styled.h1`
  color: #ffffff;
  font-size: 2.5rem;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #b0b0b0;
  margin: 0;
  line-height: 1.6;
`;

const Tabs = styled.div`
  display: inline-flex;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
`;

const TabButton = styled.button<{ $active?: boolean }>`
  padding: 0.75rem 1.5rem;
  border: none;
  background: ${(props) => (props.$active ? 'linear-gradient(90deg, #2563eb, #7c3aed)' : 'transparent')};
  color: ${(props) => (props.$active ? '#ffffff' : '#b0b0b0')};
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
`;

const Grid = styled.div`
  max-width: 960px;
  margin: 0 auto;
  display: grid;
  gap: 1.25rem;
`;

const AudienceTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(236, 72, 153, 0.15);
  color: #f9a8d4;
  font-weight: 700;
  font-size: 0.9rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  display: block;
  color: #e5e7eb;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #60a5fa;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  font-size: 1rem;
  min-height: 150px;

  &:focus {
    outline: none;
    border-color: #60a5fa;
  }
`;

const FormRow = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.button`
  background: linear-gradient(90deg, #2563eb, #7c3aed);
  color: #fff;
  border: none;
  padding: 0.9rem 1.4rem;
  border-radius: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 30px rgba(37, 99, 235, 0.35);
  }
`;

const GhostButton = styled.button`
  background: rgba(255, 255, 255, 0.04);
  color: #e5e7eb;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.9rem 1.4rem;
  border-radius: 0.9rem;
  font-weight: 700;
  cursor: pointer;
`;

const StatusBadge = styled.span<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: ${(props) => (props.$active ? '#34d399' : '#f87171')};
  background: ${(props) => (props.$active ? 'rgba(52, 211, 153, 0.15)' : 'rgba(248, 113, 113, 0.15)')};
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-weight: 700;
`;

const HelperText = styled.p`
  color: #9ca3af;
  margin: 0;
`;

const PreviewCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed rgba(255, 255, 255, 0.15);
  border-radius: 0.75rem;
  padding: 1rem;
  color: #d1d5db;
`;

const Message = styled.div<{ $type: 'success' | 'error' }>`
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid ${(props) => (props.$type === 'success' ? '#34d399' : '#f87171')};
  background: ${(props) => (props.$type === 'success' ? 'rgba(52, 211, 153, 0.08)' : 'rgba(248, 113, 113, 0.08)')};
  color: ${(props) => (props.$type === 'success' ? '#d1fae5' : '#fee2e2')};
`;

type PublicProfileType = 'guru' | 'angel';

interface PublicProfileData {
  displayName: string;
  headline: string;
  location: string;
  photoUrl: string;
  bio: string;
  pricing: string;
  calendarUrl: string;
  active: boolean;
}

const defaultProfile: PublicProfileData = {
  displayName: '',
  headline: '',
  location: '',
  photoUrl: '',
  bio: '',
  pricing: '',
  calendarUrl: '',
  active: true,
};

export default function PublicProfilesPage() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<PublicProfileType>('guru');
  const [profiles, setProfiles] = useState<Record<PublicProfileType, PublicProfileData>>({
    guru: { ...defaultProfile },
    angel: { ...defaultProfile },
  });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (session?.user?.name) {
      setProfiles((prev) => ({
        guru: { ...prev.guru, displayName: prev.guru.displayName || session.user!.name || '' },
        angel: { ...prev.angel, displayName: prev.angel.displayName || session.user!.name || '' },
      }));
    }
  }, [session?.user?.name]);

  const activeProfile = useMemo(() => profiles[tab], [profiles, tab]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    profileType: PublicProfileType,
  ) => {
    const { name, value } = e.target;
    setProfiles((prev) => ({
      ...prev,
      [profileType]: {
        ...prev[profileType],
        [name]: value,
      },
    }));
  };

  const toggleActive = (profileType: PublicProfileType) => {
    setProfiles((prev) => ({
      ...prev,
      [profileType]: {
        ...prev[profileType],
        active: !prev[profileType].active,
      },
    }));
    setMessage({ text: `${profileType === 'guru' ? 'Guru' : 'Angel'} profile visibility updated`, type: 'success' });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, profileType: PublicProfileType) => {
    e.preventDefault();
    setMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setMessage({ text: `${profileType === 'guru' ? 'Guru' : 'Angel'} public profile saved`, type: 'success' });
    } catch {
      setMessage({ text: 'Unable to save profile. Please try again.', type: 'error' });
    }
  };

  return (
    <Container>
      <Head>
        <title>Public Profiles | YooHoo.Guru</title>
        <meta
          name="description"
          content="Manage the public Guru and Angel profiles that learners and clients will see."
        />
      </Head>

      <Header />

      <Main>
        <PageHeader>
          <AudienceTag>
            <span aria-hidden>🌐</span>
            Visible to learners &amp; clients
          </AudienceTag>
          <Title>Public Profiles</Title>
          <Subtitle>
            Publish and control the pages that represent you. Use these forms to share only what you want people to see—while
            your system profile stays private.
          </Subtitle>
          <Tabs>
            <TabButton type="button" $active={tab === 'guru'} onClick={() => setTab('guru')}>Guru Profile</TabButton>
            <TabButton type="button" $active={tab === 'angel'} onClick={() => setTab('angel')}>Angel Profile</TabButton>
          </Tabs>
        </PageHeader>

        <Grid>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ color: '#fff', margin: 0 }}>{tab === 'guru' ? 'Guru advertising page' : 'Angel services page'}</h2>
              <StatusBadge $active={activeProfile.active}>
                {activeProfile.active ? 'Active' : 'Inactive'}
              </StatusBadge>
            </div>

            <HelperText style={{ marginBottom: '1rem' }}>
              This information is public. Avoid sharing specific addresses; use a general city or region instead.
            </HelperText>

            <Form onSubmit={(e) => handleSubmit(e, tab)}>
              <FormRow>
                <div>
                  <Label htmlFor="displayName">Display name</Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    value={activeProfile.displayName}
                    onChange={(e) => handleChange(e, tab)}
                    placeholder="What people will call you"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location">City / Region</Label>
                  <Input
                    id="location"
                    name="location"
                    value={activeProfile.location}
                    onChange={(e) => handleChange(e, tab)}
                    placeholder="Ex: Denver, CO"
                  />
                </div>
              </FormRow>

              <FormRow>
                <div>
                  <Label htmlFor="photoUrl">Profile photo URL (optional)</Label>
                  <Input
                    id="photoUrl"
                    name="photoUrl"
                    value={activeProfile.photoUrl}
                    onChange={(e) => handleChange(e, tab)}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="pricing">Pricing</Label>
                  <Input
                    id="pricing"
                    name="pricing"
                    value={activeProfile.pricing}
                    onChange={(e) => handleChange(e, tab)}
                    placeholder="Ex: $80/hr or $200 per project"
                  />
                </div>
              </FormRow>

              <FormRow>
                <div>
                  <Label htmlFor="headline">Short headline</Label>
                  <Input
                    id="headline"
                    name="headline"
                    value={activeProfile.headline}
                    onChange={(e) => handleChange(e, tab)}
                    placeholder="Yoga guru for beginners, compassionate home repairs, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="calendarUrl">Scheduling link</Label>
                  <Input
                    id="calendarUrl"
                    name="calendarUrl"
                    value={activeProfile.calendarUrl}
                    onChange={(e) => handleChange(e, tab)}
                    placeholder="Calendly or booking link"
                    type="url"
                  />
                </div>
              </FormRow>

              <div>
                <Label htmlFor="bio">Biography / services description</Label>
                <TextArea
                  id="bio"
                  name="bio"
                  value={activeProfile.bio}
                  onChange={(e) => handleChange(e, tab)}
                  placeholder="Tell learners and clients about your experience, approach, and what to expect."
                />
              </div>

              <ButtonRow>
                <PrimaryButton type="submit">Save public profile</PrimaryButton>
                <GhostButton type="button" onClick={() => toggleActive(tab)}>
                  {activeProfile.active ? 'Mark as inactive' : 'Make profile active'}
                </GhostButton>
              </ButtonRow>
            </Form>
          </Card>

          <Card>
            <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Preview</h3>
            <HelperText style={{ marginBottom: '0.75rem' }}>
              This is a quick preview of what visitors see on your public page.
            </HelperText>
            <PreviewCard>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff' }}>{activeProfile.displayName || 'Your name'}</div>
                  <div style={{ color: '#9ca3af' }}>{activeProfile.headline || 'Short headline or service promise'}</div>
                </div>
                <StatusBadge $active={activeProfile.active}>
                  {activeProfile.active ? 'Active' : 'Inactive'}
                </StatusBadge>
              </div>
              <div style={{ color: '#cbd5e1', marginBottom: '0.35rem' }}>
                {activeProfile.location || 'General city / region'}
              </div>
              <div style={{ color: '#a5b4fc', marginBottom: '0.35rem' }}>
                {activeProfile.pricing || 'Add pricing to set expectations'}
              </div>
              <div style={{ color: '#d1d5db', lineHeight: 1.6 }}>
                {activeProfile.bio || 'Share your story, offerings, and how to book you.'}
              </div>
              {activeProfile.calendarUrl && (
                <div style={{ marginTop: '0.5rem', color: '#60a5fa' }}>
                  Booking: {activeProfile.calendarUrl}
                </div>
              )}
            </PreviewCard>
          </Card>

          {message && <Message $type={message.type}>{message.text}</Message>}

          <Card>
            <h3 style={{ color: '#fff', marginBottom: '0.5rem' }}>Which profile should I edit?</h3>
            <HelperText>
              The system profile keeps your legal name, contact email, and private details safe. Public profiles are the
              advertising pages you intentionally publish for learners (Guru) or clients (Angel). Switch between the tabs above
              to tailor each audience and toggle visibility as needed.
            </HelperText>
          </Card>
        </Grid>
      </Main>

      <Footer />
    </Container>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
