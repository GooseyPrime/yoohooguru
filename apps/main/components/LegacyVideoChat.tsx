/**
 * Legacy Video Chat Component
 * Bare-bones WebRTC implementation without proper signaling
 * Used as fallback when Agora is not configured
 *
 * NOTE: This implementation has known limitations:
 * - No proper signaling server (cannot establish peer connections)
 * - Manual connection setup required
 * - Limited to direct peer-to-peer (no multi-party support)
 *
 * For production use, configure Agora credentials to use AgoraVideoChat instead.
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

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

const MainVideo = styled.video`
  width: 100%;
  height: 100%;
  background: #000;
  border-radius: 8px;
  object-fit: cover;
`;

const SelfVideo = styled.video`
  width: 100%;
  height: 150px;
  background: #000;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid #333;
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
`;

const AccessibilityOptions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-left: auto;
`;

const WarningBanner = styled.div`
  background: #ff9800;
  color: #000;
  padding: 8px;
  text-align: center;
  font-size: 0.85rem;
  font-weight: 500;
`;

interface LegacyVideoChatProps {
  sessionId: string;
  onEnd?: () => void;
}

function LegacyVideoChat({ sessionId, onEnd }: LegacyVideoChatProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    initializeVideoChat();
    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const initializeVideoChat = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize WebRTC peer connection
      const configuration: RTCConfiguration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      };

      const peerConnection = new RTCPeerConnection(configuration);
      peerConnectionRef.current = peerConnection;

      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        if (peerConnectionRef.current && localStreamRef.current) {
          peerConnectionRef.current.addTrack(track, localStreamRef.current);
        }
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        const state = peerConnection.connectionState;
        setConnectionStatus(state);
        setIsConnected(state === 'connected');
      };

      setConnectionStatus('Ready (requires manual setup)');

      // In a real implementation, you would handle signaling through WebSocket
      // or your backend service here
      console.warn('Legacy WebRTC mode: No signaling server available', { sessionId });

    } catch (error) {
      console.error('Error initializing video chat:', error);
      setConnectionStatus('Connection failed');
    }
  };

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const endCall = () => {
    cleanup();
    if (onEnd) onEnd();
  };

  const toggleCaptions = () => {
    setCaptionsEnabled(!captionsEnabled);
    // In a real implementation, this would enable/disable live captions
  };

  return (
    <VideoChatContainer>
      <WarningBanner>
        ⚠️ Legacy mode: Configure Agora credentials for full video conferencing support
      </WarningBanner>

      <ConnectionStatus>
        <span style={{ color: isConnected ? '#4CAF50' : '#ffa500' }}>
          ● {connectionStatus}
        </span>
      </ConnectionStatus>

      <VideoArea>
        <MainVideo
          ref={remoteVideoRef}
          autoPlay
          playsInline
          poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2NjYyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zNWVtIj5XYWl0aW5nIGZvciBwZWVyLi4uPC90ZXh0Pjwvc3ZnPg=="
        />

        <SelfVideo
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
        />
      </VideoArea>

      <ControlsBar>
        <ControlButton
          active={!isMuted}
          onClick={toggleMute}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? '🔇' : '🎤'}
        </ControlButton>

        <ControlButton
          active={!isVideoOff}
          onClick={toggleVideo}
          title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
        >
          {isVideoOff ? '📷' : '📹'}
        </ControlButton>

        <ControlButton
          className="danger"
          onClick={endCall}
          title="End call"
        >
          📞
        </ControlButton>

        <AccessibilityOptions>
          <ControlButton
            active={captionsEnabled}
            onClick={toggleCaptions}
            title="Toggle captions"
          >
            CC
          </ControlButton>
        </AccessibilityOptions>
      </ControlsBar>
    </VideoChatContainer>
  );
}

export default LegacyVideoChat;
