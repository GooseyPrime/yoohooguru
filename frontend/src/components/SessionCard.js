/**
 * Session Card Component
 * Displays distance learning session information with accessibility features
 */

import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background: ${props => props.theme.colors.surface || '#2a2a2a'};
  border: 1px solid ${props => props.theme.colors.border || '#444444'};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.backgroundHover || '#3a3a3a'};
    border-color: ${props => props.theme.colors.primary || '#6c5ce7'};
  }
  
  &:focus-within {
    outline: 2px solid ${props => props.theme.colors.primary || '#6c5ce7'};
    outline-offset: 2px;
  }
`;

const SessionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const SessionTitle = styled.h3`
  margin: 0;
  color: ${props => props.theme.colors.text || '#ffffff'};
  font-size: 1.1rem;
  font-weight: 600;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: capitalize;
  
  ${props => {
    switch (props.status) {
      case 'requested':
        return `
          background: #ff9f43;
          color: #000;
        `;
      case 'confirmed':
        return `
          background: #1dd1a1;
          color: #000;
        `;
      case 'completed':
        return `
          background: #576574;
          color: #fff;
        `;
      case 'canceled':
        return `
          background: #ff6b6b;
          color: #fff;
        `;
      default:
        return `
          background: #8395a7;
          color: #fff;
        `;
    }
  }}
`;

const SessionDetails = styled.div`
  margin-bottom: 1rem;
`;

const DetailRow = styled.p`
  margin: 0.5rem 0;
  color: ${props => props.theme.colors.textSecondary || '#cccccc'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Icon = styled.span`
  font-size: 1.1rem;
  min-width: 20px;
`;

const AccessibilityFlags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0.75rem 0;
`;

const AccessibilityFlag = styled.span`
  background: ${props => props.theme.colors.primary || '#6c5ce7'};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.accent || '#ff6b6b'};
    outline-offset: 2px;
  }
  
  ${props => props.variant === 'primary' ? `
    background: ${props.theme.colors.primary || '#6c5ce7'};
    color: white;
    
    &:hover {
      background: ${props.theme.colors.primaryHover || '#5a4fcf'};
    }
  ` : `
    background: transparent;
    color: ${props.theme.colors.textSecondary || '#cccccc'};
    border: 1px solid ${props.theme.colors.border || '#444444'};
    
    &:hover {
      background: ${props.theme.colors.backgroundHover || '#3a3a3a'};
      color: ${props.theme.colors.text || '#ffffff'};
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/**
 * Format timestamp to local date and time
 * @param {number} timestamp - Epoch timestamp in ms
 * @returns {string} Formatted date and time
 */
export function fmtLocal(timestamp) {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

/**
 * Get the appropriate icon for session mode
 * @param {string} mode - Session mode
 * @returns {string} Icon character
 */
function getSessionModeIcon(mode) {
  switch (mode) {
    case 'video': return '📹';
    case 'phone': return '📞';
    case 'chat': return '💬';
    case 'async': return '📧';
    default: return '🎓';
  }
}

function SessionCard({ session, onJoin, onCancel, onStatusChange }) {
  const handleJoin = () => {
    if (session.joinUrl) {
      window.open(session.joinUrl, '_blank', 'noopener,noreferrer');
    }
    if (onJoin) {
      onJoin(session);
    }
  };

  const canJoin = session.status === 'confirmed' && session.joinUrl && 
                  session.startTime <= Date.now() && session.endTime >= Date.now();

  const isUpcoming = session.startTime > Date.now();
  const isPast = session.endTime < Date.now();

  return (
    <CardContainer 
      role="listitem" 
      aria-labelledby={`session-${session.id}-title`}
    >
      <SessionHeader>
        <SessionTitle id={`session-${session.id}-title`}>
          {getSessionModeIcon(session.mode)} {session.mode.toUpperCase()} Session
        </SessionTitle>
        <StatusBadge status={session.status}>
          {session.status}
        </StatusBadge>
      </SessionHeader>

      <SessionDetails>
        <DetailRow>
          <Icon>🕒</Icon>
          When: {fmtLocal(session.startTime)} – {fmtLocal(session.endTime)}
        </DetailRow>
        
        {session.joinUrl && (
          <DetailRow>
            <Icon>🔗</Icon>
            Join Link: Available
          </DetailRow>
        )}
      </SessionDetails>

      {(session.captionsRequired || session.aslRequested || session.recordPolicy !== 'allow-with-consent') && (
        <AccessibilityFlags aria-label="Accessibility options">
          {session.captionsRequired && (
            <AccessibilityFlag>Captions Required</AccessibilityFlag>
          )}
          {session.aslRequested && (
            <AccessibilityFlag>ASL Requested</AccessibilityFlag>
          )}
          {session.recordPolicy && (
            <AccessibilityFlag>
              Recording: {session.recordPolicy.replace('-', ' ')}
            </AccessibilityFlag>
          )}
        </AccessibilityFlags>
      )}

      <ButtonGroup>
        {canJoin && (
          <ActionButton 
            variant="primary" 
            onClick={handleJoin}
            aria-label="Join session now"
          >
            Join Now
          </ActionButton>
        )}
        
        {isUpcoming && session.status === 'requested' && onStatusChange && (
          <>
            <ActionButton 
              variant="primary"
              onClick={() => onStatusChange(session.id, 'confirmed')}
              aria-label="Confirm session"
            >
              Confirm
            </ActionButton>
            <ActionButton 
              onClick={() => onStatusChange(session.id, 'canceled')}
              aria-label="Cancel session"
            >
              Cancel
            </ActionButton>
          </>
        )}
        
        {!isPast && session.status !== 'canceled' && onCancel && (
          <ActionButton 
            onClick={() => onCancel(session.id)}
            aria-label="Cancel session"
          >
            Cancel
          </ActionButton>
        )}
      </ButtonGroup>
    </CardContainer>
  );
}

export default SessionCard;