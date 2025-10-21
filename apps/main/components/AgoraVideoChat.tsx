/**
 * Agora Video Chat Component
 * Provides secure video conferencing using Agora RTC SDK
 * Replaces the bare-bones WebRTC implementation with proper signaling
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import AgoraRTC, {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
  IAgoraRTCRemoteUser,
  UID
} from 'agora-rtc-sdk-ng';

const VideoChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 400px;
  background: #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #333;
`;

const VideoArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 200px;
  height: 100%;
  gap: 8px;
  padding: 8px;
`;

const MainVideoContainer = styled.div`
  width: 100%;
  height: 100%;
  background: #000;
  border-radius: 8px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SelfVideoContainer = styled.div`
  width: 100%;
  height: 150px;
  background: #000;
  border-radius: 8px;
  border: 2px solid #333;
  position: relative;
`;

const ControlsBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.8);
`;

interface ControlButtonProps {
  active?: boolean;
}

const ControlButton = styled.button<ControlButtonProps>`
  padding: 10px;
  border: none;
  border-radius: 50%;
  background: ${props => props.active ? '#4CAF50' : '#666'};
  color: white;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? '#45a049' : '#777'};
  }

  &.danger {
    background: #f44336;

    &:hover {
      background: #da190b;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ConnectionStatus = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  z-index: 10;
`;

const AccessibilityOptions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-left: auto;
`;

const WaitingMessage = styled.div`
  color: #ccc;
  font-size: 1rem;
  text-align: center;
`;

interface AgoraVideoChatProps {
  sessionId: string;
  userId?: string | number;
  onEnd?: () => void;
  apiUrl?: string;
}

interface LocalTracks {
  audio: IMicrophoneAudioTrack | null;
  video: ICameraVideoTrack | null;
}

function AgoraVideoChat({
  sessionId,
  userId,
  onEnd,
  apiUrl = '/api/v1'
}: AgoraVideoChatProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Initializing...');
  const [isJoining, setIsJoining] = useState(false);
  const [hasRemoteUser, setHasRemoteUser] = useState(false);

  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localTracksRef = useRef<LocalTracks>({ audio: null, video: null });

  useEffect(() => {
    // Generate a unique numeric UID if userId is not provided
    // Use timestamp for uniqueness (not for security)
    // Note: The actual security comes from the backend-generated token,
    // not from the UID. The UID is just an identifier within the channel.
    // Agora accepts both string and numeric UIDs
    const uid = userId || Date.now();
    initializeAgoraChat(uid);

    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, userId]);

  const initializeAgoraChat = async (uid: string | number) => {
    try {
      setConnectionStatus('Connecting...');
      setIsJoining(true);

      // Get Agora App ID from environment
      const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;

      if (!appId) {
        throw new Error('Agora App ID not configured');
      }

      // Fetch token from backend
      const response = await fetch(`${apiUrl}/agora/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') || '' : ''}`
        },
        body: JSON.stringify({
          channel: sessionId,
          uid: uid,
          role: 'publisher'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to get video token');
      }

      const { data } = await response.json();
      const { token, uid: returnedUid } = data;

      // Create Agora client
      const client = AgoraRTC.createClient({
        mode: 'rtc',
        codec: 'vp8'
      });
      clientRef.current = client;

      // Set up event handlers before joining
      client.on('user-published', handleUserPublished);
      client.on('user-unpublished', handleUserUnpublished);
      client.on('user-joined', handleUserJoined);
      client.on('user-left', handleUserLeft);
      client.on('connection-state-change', handleConnectionStateChange);

      // Join the channel using the returned UID from backend
      await client.join(appId, sessionId, token, returnedUid);

      setConnectionStatus('Joined channel');
      console.log('Joined Agora channel', { sessionId, uid: returnedUid });

      // Create and publish local tracks
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(
        { AEC: true, ANS: true }, // Audio settings: echo cancellation, noise suppression
        { encoderConfig: '480p_1' } // Video settings: 640x480
      );

      localTracksRef.current = { audio: audioTrack, video: videoTrack };

      // Play local video
      if (localVideoRef.current) {
        videoTrack.play(localVideoRef.current);
      }

      // Publish tracks to channel
      await client.publish([audioTrack, videoTrack]);

      setConnectionStatus('Connected');
      setIsConnected(true);
      setIsJoining(false);

      console.log('Published local tracks', { sessionId });

    } catch (error) {
      console.error('Error initializing Agora chat:', error);
      setConnectionStatus(`Error: ${(error as Error).message}`);
      setIsJoining(false);
    }
  };

  const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
    try {
      const client = clientRef.current;
      if (!client) return;

      await client.subscribe(user, mediaType);

      console.log('Subscribed to remote user', { uid: user.uid, mediaType });

      if (mediaType === 'video') {
        setHasRemoteUser(true);
        // Wait for next render cycle to ensure ref is available
        setTimeout(() => {
          if (remoteVideoRef.current && user.videoTrack) {
            user.videoTrack.play(remoteVideoRef.current);
          }
        }, 100);
      }

      if (mediaType === 'audio' && user.audioTrack) {
        user.audioTrack.play();
      }
    } catch (error) {
      console.error('Error subscribing to remote user:', error);
    }
  };

  const handleUserUnpublished = (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
    console.log('User unpublished', { uid: user.uid, mediaType });
    if (mediaType === 'video') {
      setHasRemoteUser(false);
    }
  };

  const handleUserJoined = (user: IAgoraRTCRemoteUser) => {
    console.log('User joined channel', { uid: user.uid });
    setConnectionStatus('Peer connected');
  };

  const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
    console.log('User left channel', { uid: user.uid });
    setHasRemoteUser(false);
    setConnectionStatus('Peer disconnected');
  };

  const handleConnectionStateChange = (curState: string, prevState: string) => {
    console.log('Connection state changed', { from: prevState, to: curState });

    const stateMessages: Record<string, string> = {
      DISCONNECTED: 'Disconnected',
      CONNECTING: 'Connecting...',
      CONNECTED: 'Connected',
      RECONNECTING: 'Reconnecting...',
      DISCONNECTING: 'Disconnecting...'
    };

    setConnectionStatus(stateMessages[curState] || curState);
    setIsConnected(curState === 'CONNECTED');
  };

  const cleanup = async () => {
    try {
      const { audio, video } = localTracksRef.current;

      // Stop and close local tracks
      if (audio) {
        audio.stop();
        audio.close();
      }
      if (video) {
        video.stop();
        video.close();
      }

      // Leave channel and clean up client
      if (clientRef.current) {
        await clientRef.current.leave();
        clientRef.current.removeAllListeners();
      }

      console.log('Cleaned up Agora resources');
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  };

  const toggleMute = () => {
    const audioTrack = localTracksRef.current.audio;
    if (audioTrack) {
      audioTrack.setEnabled(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    const videoTrack = localTracksRef.current.video;
    if (videoTrack) {
      videoTrack.setEnabled(!isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  };

  const endCall = async () => {
    await cleanup();
    if (onEnd) onEnd();
  };

  const toggleCaptions = () => {
    setCaptionsEnabled(!captionsEnabled);
    // TODO: Implement live captions using Agora RTT or third-party service
    console.log('Captions toggled', { enabled: !captionsEnabled });
  };

  return (
    <VideoChatContainer>
      <ConnectionStatus>
        <span style={{ color: isConnected ? '#4CAF50' : '#ffa500' }}>
          ● {connectionStatus}
        </span>
      </ConnectionStatus>

      <VideoArea>
        <MainVideoContainer>
          <div
            ref={remoteVideoRef}
            style={{ width: '100%', height: '100%' }}
          />
          {!hasRemoteUser && (
            <WaitingMessage>Waiting for peer to join...</WaitingMessage>
          )}
        </MainVideoContainer>

        <SelfVideoContainer>
          <div
            ref={localVideoRef}
            style={{ width: '100%', height: '100%' }}
          />
        </SelfVideoContainer>
      </VideoArea>

      <ControlsBar>
        <ControlButton
          active={!isMuted}
          onClick={toggleMute}
          disabled={isJoining}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? '🔇' : '🎤'}
        </ControlButton>

        <ControlButton
          active={!isVideoOff}
          onClick={toggleVideo}
          disabled={isJoining}
          title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
        >
          {isVideoOff ? '📷' : '📹'}
        </ControlButton>

        <ControlButton
          className="danger"
          onClick={endCall}
          disabled={isJoining}
          title="End call"
        >
          📞
        </ControlButton>

        <AccessibilityOptions>
          <ControlButton
            active={captionsEnabled}
            onClick={toggleCaptions}
            disabled={isJoining}
            title="Toggle captions"
          >
            CC
          </ControlButton>
        </AccessibilityOptions>
      </ControlsBar>
    </VideoChatContainer>
  );
}

export default AgoraVideoChat;
