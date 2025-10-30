import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Header, Footer } from '@yoohooguru/shared';
import Head from 'next/head';
import styled from 'styled-components';
import dynamic from 'next/dynamic';
import { isValidId } from '../../../lib/validators';

const AgoraVideo = dynamic(() => import('../../../components/video/AgoraVideo'), {
  ssr: false
});

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
`;

const SessionInfo = styled.div`
  max-width: 1200px;
  margin: 0 auto 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
`;

const SessionTitle = styled.h1`
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const SessionDetails = styled.div`
  color: #b0b0b0;
  font-size: 1.1rem;
`;

export default function VideoSession() {
  const router = useRouter();
  const { id } = router.query;
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Validate session ID to prevent SSRF/path traversal
    if (id && !isValidId(id)) {
      setError('Invalid session identifier');
    }
  }, [id]);
  
  // Mock session data - in a real implementation, this would come from your backend
  const sessionData = {
    id: id as string,
    title: 'Web Development Session',
    guru: 'Alex Johnson',
    gunu: 'Sarah Williams',
    startTime: '2024-02-15T14:00:00Z',
    duration: 60, // minutes
    channel: `session_${id}`,
    token: 'mock_token',
    uid: Math.floor(Math.random() * 1000000)
  };
  
  const handleLeave = () => {
    router.push('/dashboard');
  };
  
  if (error) {
    return (
      <Container>
        <Head>
          <title>Error | YooHoo.Guru</title>
        </Head>
        <Header />
        <Main style={{ textAlign: 'center', padding: '3rem' }}>
          <SessionInfo>
            <SessionTitle style={{ color: '#fff' }}>{error}</SessionTitle>
            <button onClick={() => router.push('/')}>Return Home</button>
          </SessionInfo>
        </Main>
        <Footer />
      </Container>
    );
  }
  
  return (
    <Container>
      <Head>
        <title>Video Session | {sessionData.title} | YooHoo.Guru</title>
        <meta name="description" content={`Join your video session with ${sessionData.guru}`} />
      </Head>
      
      <Header />
      
      <Main>
        <SessionInfo>
          <SessionTitle>{sessionData.title}</SessionTitle>
          <SessionDetails>
            with {sessionData.guru} • Duration: {sessionData.duration} minutes
          </SessionDetails>
        </SessionInfo>
        
        <AgoraVideo
          channel={sessionData.channel}
          token={sessionData.token}
          uid={sessionData.uid}
          isHost={false} // This would be determined by the user's role
          onLeave={handleLeave}
        />
      </Main>
      
      <Footer />
    </Container>
  );
}