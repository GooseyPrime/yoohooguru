/**
 * Video Chat Component
 * Provides secure peer-to-peer video chat interface for remote sessions
 * Now uses Agora RTC SDK for proper video conferencing with signaling
 */

'use client';

import React from 'react';
import AgoraVideoChat from './AgoraVideoChat';
import LegacyVideoChat from './LegacyVideoChat';

interface VideoChatProps {
  sessionId: string;
  userId?: string | number;
  onEnd?: () => void;
  apiUrl?: string;
}

/**
 * VideoChat - Smart wrapper that uses Agora if configured, falls back to legacy WebRTC
 * @param {string} sessionId - Unique session identifier
 * @param {string|number} userId - User ID for Agora token generation
 * @param {Function} onEnd - Callback when call ends
 * @param {string} apiUrl - API base URL (default: /api/v1)
 */
function VideoChat({ sessionId, userId, onEnd, apiUrl = '/api/v1' }: VideoChatProps) {
  // Check if Agora is configured
  const agoraAppId = process.env.NEXT_PUBLIC_AGORA_APP_ID;

  if (agoraAppId) {
    console.log('Using Agora video chat', { sessionId });
    return (
      <AgoraVideoChat
        sessionId={sessionId}
        userId={userId}
        onEnd={onEnd}
        apiUrl={apiUrl}
      />
    );
  } else {
    console.warn('Agora not configured, using legacy WebRTC', { sessionId });
    return (
      <LegacyVideoChat
        sessionId={sessionId}
        onEnd={onEnd}
      />
    );
  }
}

export default VideoChat;
