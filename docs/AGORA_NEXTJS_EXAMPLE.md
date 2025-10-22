# Agora Video Chat - Next.js Integration Example

This example shows how to use the Agora VideoChat component in a Next.js application (e.g., apps/coach, apps/angel, etc.).

## Installation

The Agora SDK is already installed in the root frontend workspace. Next.js apps can import it directly.

## Basic Usage

```tsx
// pages/session/[id].tsx or pages/video-call.tsx
import { useState } from 'react';
import { useSession } from 'next-auth/react';

// Import from the shared frontend workspace
// Note: You may need to configure your Next.js to allow imports from workspace
import VideoChat from '@yoohooguru/frontend/src/components/VideoChat';

export default function VideoSessionPage() {
  const { data: session } = useSession();
  const [sessionId] = useState('session-123'); // Or get from router params
  const [isCallActive, setIsCallActive] = useState(false);

  const handleEndCall = () => {
    setIsCallActive(false);
    // Redirect or show end screen
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Video Session</h1>
      
      {!isCallActive ? (
        <button onClick={() => setIsCallActive(true)}>
          Start Video Call
        </button>
      ) : (
        <VideoChat
          sessionId={sessionId}
          userId={session?.user?.id}
          onEnd={handleEndCall}
          apiUrl={process.env.NEXT_PUBLIC_API_URL || '/api/v1'}
        />
      )}
    </div>
  );
}
```

## Alternative: Copy Components to Next.js App

If importing from the workspace is complex, you can copy the components:

1. Copy these files to your Next.js app:
   ```
   frontend/src/components/VideoChat.js
   frontend/src/components/AgoraVideoChat.js
   frontend/src/components/LegacyVideoChat.js
   ```

2. Place them in your app's component directory:
   ```
   apps/coach/components/video/
   ```

3. Update imports in the copied files to reference your app's utilities.

## Environment Setup for Next.js Apps

Add to `apps/coach/.env.local` (or whichever app):

```env
# Inherited from .env.shared
NEXT_PUBLIC_AGORA_APP_ID=your_app_id_here
NEXT_PUBLIC_AGORA_REGION=us

# App-specific API URL
NEXT_PUBLIC_API_URL=https://api.yoohoo.guru
```

## With TypeScript

If using TypeScript, create a types file:

```typescript
// apps/coach/types/video.d.ts
export interface VideoChatProps {
  sessionId: string;
  userId?: string;
  onEnd?: () => void;
  apiUrl?: string;
}
```

## Full Example with Session Management

```tsx
// pages/coaching-session/[sessionId].tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import VideoChat from '../../../components/video/VideoChat';

interface Session {
  id: string;
  title: string;
  coachId: string;
  studentId: string;
  scheduledAt: string;
}

export default function CoachingSessionPage() {
  const router = useRouter();
  const { sessionId } = router.query;
  const { data: authSession } = useSession();
  
  const [session, setSession] = useState<Session | null>(null);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) return;

    // Fetch session details
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions/${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${authSession?.accessToken}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setSession(data.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load session:', error);
        setLoading(false);
      });
  }, [sessionId, authSession]);

  const handleStartVideo = () => {
    setIsVideoActive(true);
    
    // Optional: Mark session as started in backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions/${sessionId}/start`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authSession?.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  };

  const handleEndVideo = () => {
    setIsVideoActive(false);
    
    // Optional: Mark session as completed in backend
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions/${sessionId}/complete`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authSession?.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    // Redirect to session summary
    router.push(`/coaching-session/${sessionId}/summary`);
  };

  if (loading) {
    return <div>Loading session...</div>;
  }

  if (!session) {
    return <div>Session not found</div>;
  }

  return (
    <div className="coaching-session">
      <header>
        <h1>{session.title}</h1>
        <p>Session ID: {sessionId}</p>
      </header>

      <main>
        {!isVideoActive ? (
          <div className="pre-call">
            <h2>Ready to start?</h2>
            <p>Session scheduled for: {new Date(session.scheduledAt).toLocaleString()}</p>
            
            <button 
              onClick={handleStartVideo}
              className="btn-primary"
            >
              Start Video Call
            </button>
          </div>
        ) : (
          <div className="video-container">
            <VideoChat
              sessionId={session.id}
              userId={authSession?.user?.id}
              onEnd={handleEndVideo}
              apiUrl={process.env.NEXT_PUBLIC_API_URL}
            />
          </div>
        )}
      </main>

      <style jsx>{`
        .coaching-session {
          min-height: 100vh;
          padding: 2rem;
        }

        .video-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .pre-call {
          max-width: 600px;
          margin: 4rem auto;
          text-align: center;
        }

        .btn-primary {
          padding: 1rem 2rem;
          font-size: 1.2rem;
          background: #6c5ce7;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 2rem;
        }

        .btn-primary:hover {
          background: #5f4dd4;
        }
      `}</style>
    </div>
  );
}

// Protect the page with authentication
export { default as getServerSideProps } from '../../../lib/requireAuth';
```

## Testing

1. Ensure Agora credentials are set in `.env.shared`
2. Start your Next.js app: `npm run dev`
3. Navigate to the video session page
4. Open in two browser windows with different users
5. Verify video/audio works between peers

## Troubleshooting

### "Agora App ID not configured"

Check that `NEXT_PUBLIC_AGORA_APP_ID` is set in `.env.shared` and the Next.js dev server was restarted after adding it.

### "Failed to get video token"

1. Ensure backend is running and accessible
2. Check `NEXT_PUBLIC_API_URL` points to correct backend
3. Verify user authentication token is valid
4. Check backend logs for token generation errors

### Video doesn't load

1. Check browser console for errors
2. Ensure camera/microphone permissions are granted
3. Verify Agora services are not blocked by firewall
4. Try in incognito mode to rule out extensions

## Additional Resources

- [Full Documentation](../../docs/AGORA_VIDEO_CONFERENCING.md)
- [Agora React SDK Docs](https://docs.agora.io/en/video-calling/get-started/get-started-sdk?platform=react-js)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
