/**
 * Coaching Session Page
 * Demonstrates Agora video conferencing integration
 */

import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styled from 'styled-components';
import { Header, Footer } from '@yoohooguru/shared';
import VideoChat from '../../../../components/VideoChat';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0a0a0a;
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
`;

const SessionHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;

  h1 {
    font-size: 2rem;
    color: #ffffff;
    margin-bottom: 0.5rem;
  }

  p {
    color: #b0b0b0;
    font-size: 1rem;
  }
`;

const VideoSection = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const SessionInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const InfoCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;

  h3 {
    font-size: 1rem;
    color: #888;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  p {
    font-size: 1.25rem;
    color: #ffffff;
    margin: 0;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &.primary {
    background: #4CAF50;
    color: white;

    &:hover {
      background: #45a049;
    }
  }

  &.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Notes = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;

  h2 {
    font-size: 1.25rem;
    color: #ffffff;
    margin-bottom: 1rem;
  }

  textarea {
    width: 100%;
    min-height: 150px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 1rem;
    color: #ffffff;
    font-family: inherit;
    font-size: 1rem;
    resize: vertical;

    &:focus {
      outline: none;
      border-color: #4CAF50;
    }

    &::placeholder {
      color: #666;
    }
  }
`;

export default function SessionPage() {
  const router = useRouter();
  const { id } = router.query;
  const [sessionEnded, setSessionEnded] = useState(false);
  const [notes, setNotes] = useState('');

  // In a real application, you would fetch session details from your backend
  // For demo purposes, we're using mock data
  const sessionId = id as string || 'demo-session';
  const currentUserId = 'user-' + Math.floor(Math.random() * 10000);

  const handleEndCall = () => {
    setSessionEnded(true);
    console.log('Session ended');
    // In a real app, you would save session data, update status, etc.
  };

  const handleSaveNotes = () => {
    console.log('Saving notes:', notes);
    // In a real app, you would save notes to your backend
    alert('Notes saved!');
  };

  const handleBackToDashboard = () => {
    router.push('/_apps/coach');
  };

  return (
    <Container>
      <Head>
        <title>Coaching Session {sessionId} | YooHoo.Guru</title>
        <meta name="description" content="Live coaching session with video conferencing" />
      </Head>

      <Header />

      <Main>
        <SessionHeader>
          <h1>🎓 Coaching Session</h1>
          <p>Session ID: {sessionId}</p>
        </SessionHeader>

        {!sessionEnded ? (
          <>
            <VideoSection>
              <VideoChat
                sessionId={sessionId}
                userId={currentUserId}
                onEnd={handleEndCall}
                apiUrl={process.env.NEXT_PUBLIC_API_URL || '/api/v1'}
              />
            </VideoSection>

            <SessionInfo>
              <InfoCard>
                <h3>Session Type</h3>
                <p>1-on-1 Coaching</p>
              </InfoCard>
              <InfoCard>
                <h3>Duration</h3>
                <p>60 minutes</p>
              </InfoCard>
              <InfoCard>
                <h3>Status</h3>
                <p style={{ color: '#4CAF50' }}>● Live</p>
              </InfoCard>
            </SessionInfo>

            <Notes>
              <h2>Session Notes</h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Take notes during your session..."
              />
              <ActionButtons>
                <Button className="secondary" onClick={handleSaveNotes}>
                  Save Notes
                </Button>
              </ActionButtons>
            </Notes>
          </>
        ) : (
          <VideoSection>
            <SessionHeader>
              <h1>Session Ended</h1>
              <p>Thank you for using YooHoo.Guru!</p>
            </SessionHeader>

            <SessionInfo>
              <InfoCard>
                <h3>Session Duration</h3>
                <p>45 minutes</p>
              </InfoCard>
              <InfoCard>
                <h3>Session ID</h3>
                <p>{sessionId}</p>
              </InfoCard>
            </SessionInfo>

            <ActionButtons>
              <Button className="primary" onClick={handleBackToDashboard}>
                Back to Dashboard
              </Button>
              <Button className="secondary" onClick={handleSaveNotes}>
                Save Session Notes
              </Button>
            </ActionButtons>
          </VideoSection>
        )}
      </Main>

      <Footer />
    </Container>
  );
}
