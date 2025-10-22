/**
 * Video Chat Component
 * Provides secure peer-to-peer video chat interface for remote sessions
 * Now uses Agora RTC SDK for proper video conferencing with signaling
 */

import React from 'react';
import AgoraVideoChat from './AgoraVideoChat';
import LegacyVideoChat from './LegacyVideoChat';
import logger from '../utils/logger';

/**
 * VideoChat - Smart wrapper that uses Agora if configured, falls back to legacy WebRTC
 * @param {Object} props
 * @param {string} props.sessionId - Unique session identifier
 * @param {string} props.userId - User ID for Agora token generation
 * @param {Function} props.onEnd - Callback when call ends
 * @param {string} props.apiUrl - API base URL (default: /api/v1)
 */
function VideoChat({ sessionId, userId, onEnd, apiUrl = '/api/v1' }) {
  // Check if Agora is configured
  const agoraAppId = process.env.REACT_APP_AGORA_APP_ID || process.env.NEXT_PUBLIC_AGORA_APP_ID;
  
  if (agoraAppId) {
    logger.info('Using Agora video chat', { sessionId });
    return (
      <AgoraVideoChat 
        sessionId={sessionId}
        userId={userId}
        onEnd={onEnd}
        apiUrl={apiUrl}
      />
    );
  } else {
    logger.warn('Agora not configured, using legacy WebRTC', { sessionId });
    return (
      <LegacyVideoChat 
        sessionId={sessionId}
        onEnd={onEnd}
      />
    );
  }
}

export default VideoChat;

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

const ControlButton = styled.button`
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

export default VideoChat;