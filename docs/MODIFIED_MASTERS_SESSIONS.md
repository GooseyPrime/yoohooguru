# Modified Masters Distance Sessions Documentation

This document explains how distance learning sessions work within the Modified Masters platform, including session lifecycle, accessibility accommodations, and technical integration.

## Overview

Modified Masters distance sessions enable accessible, remote learning between coaches and understudies. Sessions support various communication modes and provide comprehensive accessibility accommodations.

## Session Types and Modes

### Communication Modes
- **Video**: Real-time video conferencing (default)
- **Phone**: Audio-only sessions for hearing-focused learning
- **Chat**: Text-based communication for written interaction
- **Async**: Asynchronous message exchange over time

### Session Categories
- **One-time Sessions**: Single learning sessions
- **Series Sessions**: Related sessions over multiple meetings
- **Assessment Sessions**: Skill evaluation and feedback
- **Resource Sharing**: Document and material exchange

## Session Lifecycle

### 1. Session Request
**Triggered by**: Learner clicks "Request Distance Session" on skill card

**Required Information**:
- Session mode (video/phone/chat/async)
- Start time (datetime)
- End time (datetime)
- Join URL (optional, can be provided by coach)
- Accessibility requirements

**Accessibility Options**:
- Captions required
- ASL interpreter requested
- Recording policy preference

### 2. Session Review
**Status**: `requested`

**Coach Actions**:
- Review session details
- Confirm or decline request
- Suggest alternative times
- Add join URL if not provided

**System Behavior**:
- Email notification to coach
- Dashboard notification
- Optional SMS reminder (future feature)

### 3. Session Confirmation
**Status**: `confirmed`

**Automatic Actions**:
- Calendar invitations sent to both parties
- Join URL validated or generated
- Accessibility accommodations arranged
- Reminder notifications scheduled

### 4. Session Execution
**Status**: `in-progress` (when within time window)

**Available Actions**:
- Join session via provided URL
- Access session resources
- Request technical support
- Report issues

### 5. Session Completion
**Status**: `completed`

**Post-Session**:
- Optional feedback collection
- Session summary generation
- Calendar event updated
- Next session scheduling (if series)

## Accessibility Accommodations

### Caption Support
When `captionsRequired: true`:
- Platform suggests caption-enabled meeting tools
- Coaches receive notification about caption requirement
- Session join URLs include caption parameters when possible
- Alternative arrangements made if primary tool lacks captions

### ASL Interpretation
When `aslRequested: true`:
- System flags session for interpretation needs
- Coaches notified of ASL requirement
- Platform may facilitate interpreter booking (future feature)
- Session timing adjusted for interpretation setup

### Recording Policies
Three recording options:
- **Prohibited**: No recording allowed
- **Allowed**: Recording permitted without explicit consent
- **Allow with Consent**: Recording requires verbal/written consent

## Technical Implementation

### Database Schema

```javascript
// Distance Session Object
{
  id: "session-uuid",
  skillId: "skill-reference-id",
  coachId: "coach-user-id", 
  learnerId: "learner-user-id",
  mode: "video|phone|chat|async",
  startTime: 1234567890000, // epoch ms UTC
  endTime: 1234567890000,   // epoch ms UTC
  joinUrl: "https://meet.jit.si/Room-abc123",
  captionsRequired: true,
  aslRequested: false,
  recordPolicy: "allow-with-consent",
  createdAt: 1234567890000,
  status: "requested|confirmed|completed|canceled"
}
```

### API Endpoints

#### Create Session
```http
POST /api/sessions
Content-Type: application/json
Authorization: Bearer {token}

{
  "skillId": "skill-123",
  "learnerId": "__SELF__", // resolves to current user
  "mode": "video",
  "startTime": 1234567890000,
  "endTime": 1234567890000,
  "joinUrl": "https://meet.jit.si/Room-abc123",
  "captionsRequired": true,
  "aslRequested": false,
  "recordPolicy": "allow-with-consent"
}
```

#### Update Session Status
```http
PATCH /api/sessions/{sessionId}/status
Content-Type: application/json
Authorization: Bearer {token}

{
  "status": "confirmed"
}
```

#### Get Calendar Export
```http
GET /api/sessions/{sessionId}/calendar?format=ics
Authorization: Bearer {token}
```

### Calendar Integration

Sessions automatically generate calendar events:

#### ICS Format
```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//yoohoo.guru//Modified Masters//EN
BEGIN:VEVENT
UID:session-{sessionId}@yoohoo.guru
DTSTART:20240301T150000Z
DTEND:20240301T160000Z
SUMMARY:Distance Learning Session
DESCRIPTION:VIDEO session (Captions required) (ASL requested)
URL:https://meet.jit.si/Room-abc123
LOCATION:https://meet.jit.si/Room-abc123
STATUS:TENTATIVE
END:VEVENT
END:VCALENDAR
```

#### Google Calendar Links
Auto-generated links include:
- Session title and description
- Correct time zone conversion
- Join URL in location field
- Accessibility notes in description

## Join URL Conventions

### Recommended Platforms
1. **Jitsi Meet**: `https://meet.jit.si/Room-{unique-id}`
   - Free, open source
   - Built-in captions support
   - No account required

2. **Google Meet**: `https://meet.google.com/{meeting-id}`
   - Good accessibility features
   - Automatic captions
   - Requires Google account

3. **Zoom**: `https://zoom.us/j/{meeting-id}`
   - Excellent accessibility support
   - Professional captioning options
   - ASL interpretation support

### URL Validation
- URLs must be https://
- Common meeting platforms recognized
- Custom URLs allowed with coach approval
- Security warnings for unknown domains

## Notification System

### Email Templates
- **Session Request**: Sent to coach when learner requests session
- **Session Confirmed**: Sent to both parties when confirmed
- **Session Reminder**: 24 hours and 1 hour before session
- **Session Updated**: When times or details change

### Dashboard Notifications
- Real-time notifications for session status changes
- Badge counts for pending requests
- Quick actions for common responses

## Error Handling and Support

### Common Issues
1. **Invalid Join URLs**: Validation and correction suggestions
2. **Time Zone Conflicts**: Automatic conversion with confirmation
3. **Accessibility Tool Failures**: Backup accommodation options
4. **Technical Difficulties**: Support contact integration

### Support Escalation
- In-session support button
- Direct coach-to-learner messaging
- Platform technical support contact
- Emergency session rescheduling

## Analytics and Reporting

### Session Metrics
- Completion rates by mode
- Accessibility accommodation usage
- Platform preference statistics
- User satisfaction scores

### Accessibility Insights
- Caption usage patterns
- ASL request frequency
- Recording policy preferences
- Accommodation effectiveness

## Future Enhancements

### Planned Features
- **Real-time captioning integration**
- **Automated ASL interpreter booking**
- **AI-powered session transcription**
- **Multi-language session support**
- **Session recording with automatic transcription**
- **Virtual whiteboards with accessibility features**

### Integration Roadmap
- Learning Management System (LMS) integration
- Third-party calendar sync improvements
- Advanced accessibility tool partnerships
- AI-powered session matching based on accommodation needs

## Security and Privacy

### Data Protection
- Session details encrypted at rest and in transit
- Join URLs expire after session completion
- Recording permissions strictly enforced
- GDPR and accessibility law compliance

### Privacy Controls
- Granular sharing controls for session details
- Option to hide accessibility accommodations from other users
- Secure deletion of session data upon request
- Audit logs for accommodation access

## Testing and Quality Assurance

### Session Testing Checklist
- [ ] All communication modes functional
- [ ] Calendar integration working
- [ ] Accessibility accommodations properly flagged
- [ ] Email notifications delivered
- [ ] Dashboard updates in real-time
- [ ] Mobile compatibility verified

### Accessibility Testing
- [ ] Screen reader compatibility
- [ ] Keyboard navigation functional
- [ ] High contrast mode support
- [ ] Caption display testing
- [ ] ASL interpretation workflow validated

For technical support or questions about distance sessions, contact: support@yoohoo.guru