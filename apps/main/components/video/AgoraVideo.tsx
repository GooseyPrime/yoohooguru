import { useState, useEffect, useRef } from 'react';
import AgoraRTC, { ICameraVideoTrack, IMicrophoneAudioTrack, IAgoraRTCClient } from 'agora-rtc-sdk-ng';
import styled from 'styled-components';

const VideoContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const VideoHeader = styled.h2`
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const VideoControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ControlButton = styled.button<{ active?: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  background: ${props => props.active ? '#ff6b6b' : '#667eea'};
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: ${props => props.active ? '#ff5252' : '#5a6fd8'};
  }
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
`;

const VideoCard = styled.div`
  background: rgba(0, 0, 0, 0.8);
  border-radius: 0.5rem;
  overflow: hidden;
  aspect-ratio: 16/9;
  position: relative;
`;

const VideoElement = styled.div`
  width: 100%;
  height: 100%;
  background: #000;
`;

const UserName = styled.div`
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  background: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.9rem;
`;

const StatusMessage = styled.div`
  text-align: center;
  color: #b0b0b0;
  padding: 1rem;
  margin: 1rem 0;
`;

interface AgoraVideoProps {
  channel: string;
  token: string;
  uid: number;
  isHost: boolean;
  onLeave: () => void;
}

export default function AgoraVideo({ channel, token, uid, isHost, onLeave }: AgoraVideoProps) {
  const [joined, setJoined] = useState(false);
  const [videoTrack, setVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [audioTrack, setAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<any[]>([]);
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  
  useEffect(() => {
    // Initialize Agora client
    clientRef.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    
    // Handle user published events
    clientRef.current.on('user-published', async (user, mediaType) => {
      await clientRef.current!.subscribe(user, mediaType);
      
      if (mediaType === 'video') {
        const remoteVideoRef = remoteVideoRefs.current[user.uid];
        if (remoteVideoRef) {
          user.videoTrack!.play(remoteVideoRef);
        }
      }
      
      if (mediaType === 'audio') {
        user.audioTrack!.play();
      }
      
      setRemoteUsers(prev => [...prev, user]);
    });
    
    // Handle user unpublished events
    clientRef.current.on('user-unpublished', (user) => {
      const remoteVideoRef = remoteVideoRefs.current[user.uid];
      if (remoteVideoRef) {
        user.videoTrack?.stop();
      }
      user.audioTrack?.stop();
      
      setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
    });
    
    return () => {
      if (clientRef.current) {
        clientRef.current.leave();
      }
      videoTrack?.close();
      audioTrack?.close();
    };
  }, []);
  
  const joinChannel = async () => {
    if (!clientRef.current) return;
    
    try {
      // Create local tracks
      const [microphoneTrack, cameraTrack] = await Promise.all([
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack()
      ]);
      
      setAudioTrack(microphoneTrack);
      setVideoTrack(cameraTrack);
      
      // Play local video
      if (localVideoRef.current) {
        cameraTrack.play(localVideoRef.current);
      }
      
      // Join channel
      await clientRef.current.join(
        process.env.NEXT_PUBLIC_AGORA_APP_ID || '',
        channel,
        token,
        uid
      );
      
      // Publish local tracks
      await clientRef.current.publish([microphoneTrack, cameraTrack]);
      
      setJoined(true);
    } catch (error) {
      console.error('Failed to join channel:', error);
    }
  };
  
  const leaveChannel = async () => {
    if (!clientRef.current) return;
    
    try {
      // Stop all tracks
      videoTrack?.close();
      audioTrack?.close();
      
      // Leave channel
      await clientRef.current.leave();
      
      setJoined(false);
      onLeave();
    } catch (error) {
      console.error('Failed to leave channel:', error);
    }
  };
  
  const toggleAudio = () => {
    if (audioTrack) {
      audioTrack.setEnabled(!audioTrack.enabled);
    }
  };
  
  const toggleVideo = () => {
    if (videoTrack) {
      videoTrack.setEnabled(!videoTrack.enabled);
    }
  };
  
  return (
    <VideoContainer>
      <VideoHeader>Video Session</VideoHeader>
      
      {!joined ? (
        <div style={{textAlign: 'center'}}>
          <StatusMessage>Ready to join session: {channel}</StatusMessage>
          <ControlButton onClick={joinChannel}>Join Session</ControlButton>
        </div>
      ) : (
        <>
          <VideoControls>
            <ControlButton onClick={toggleAudio} active={!audioTrack?.enabled}>
              {audioTrack?.enabled ? 'Mute Audio' : 'Unmute Audio'}
            </ControlButton>
            <ControlButton onClick={toggleVideo} active={!videoTrack?.enabled}>
              {videoTrack?.enabled ? 'Stop Video' : 'Start Video'}
            </ControlButton>
            <ControlButton onClick={leaveChannel}>Leave Session</ControlButton>
          </VideoControls>
          
          <VideoGrid>
            {/* Local video */}
            <VideoCard>
              <VideoElement ref={localVideoRef} />
              <UserName>You (Local)</UserName>
            </VideoCard>
            
            {/* Remote users */}
            {remoteUsers.map(user => (
              <VideoCard key={user.uid}>
                <VideoElement 
                  ref={(el) => {
                    remoteVideoRefs.current[user.uid] = el;
                  }}
                />
                <UserName>User {user.uid}</UserName>
              </VideoCard>
            ))}
          </VideoGrid>
        </>
      )}
    </VideoContainer>
  );
}