# Firestore API Endpoints

This document describes the new Firestore-based API endpoints available after the migration.

## Skills API

### List Skills
```
GET /api/skills
```

**Query Parameters:**
- `search` - Text search in title and summary
- `category` - Filter by skill category
- `isModifiedMasters` - Filter Modified Masters skills (true/false)
- `tag` - Filter by accessibility tag
- `style` - Filter by coaching style
- `status` - Filter by status (published/pending)
- `popular` - Filter popular skills (true/false)

**Example:**
```bash
curl "http://localhost:3001/api/skills?isModifiedMasters=true&tag=screen_reader_friendly"
```

### Create Skill
```
POST /api/skills
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "Web Development for Screen Readers",
  "summary": "Learn accessible web development practices",
  "isModifiedMasters": false,
  "accessibilityTags": ["screen_reader_friendly", "low_vision"],
  "coachingStyles": ["patient", "hands_on"]
}
```

### Get Skill by ID
```
GET /api/skills/:id
```

### Update Skill
```
PUT /api/skills/:id
Authorization: Bearer <token>
```

### Add Resource to Skill
```
POST /api/skills/:id/resources
Authorization: Bearer <token>
```

**Body:**
```json
{
  "title": "WCAG Guidelines",
  "url": "https://www.w3.org/WAI/WCAG21/quickref/",
  "type": "reference"
}
```

### Get Skills by Creator
```
GET /api/skills/user/:userId
```

## User/Auth API

### Get User Profile
```
GET /api/auth/profile
Authorization: Bearer <token>
```

### Update User Profile
```
PUT /api/auth/profile
Authorization: Bearer <token>
```

**Body (supports accessibility and Modified Masters):**
```json
{
  "displayName": "Jane Doe",
  "location": "Seattle, WA",
  "accessibility": {
    "vision": ["low_vision"],
    "communicationPrefs": ["text_only"],
    "assistiveTech": ["screen_reader"]
  },
  "modifiedMasters": {
    "wantsToTeach": true,
    "wantsToLearn": false,
    "tags": ["adaptive_sports", "accessible_tech"],
    "visible": true,
    "coachingStyles": ["patient", "encouraging"]
  }
}
```

## Sessions API (Available via DB helpers)

The session management system is built but routes are not yet exposed. The following operations are available via the `sessionsDB` helper:

- `create(sessionData)` - Create new session
- `byUser(userId, role)` - Get sessions for user as coach/learner  
- `updateStatus(id, status)` - Update session status
- `get(id)` - Get session by ID
- `getBySkill(skillId)` - Get sessions for a skill
- `getUpcoming(timeRange)` - Get upcoming sessions

## Data Models

### Skill Document
```json
{
  "id": "auto-generated",
  "title": "string",
  "summary": "string", 
  "createdBy": "userId",
  "isModifiedMasters": false,
  "accessibilityTags": ["tag1", "tag2"],
  "coachingStyles": ["style1", "style2"],
  "resources": [
    {
      "id": "uuid",
      "title": "string",
      "url": "string", 
      "type": "link|video|document",
      "addedBy": "userId",
      "addedAt": 1640995200000
    }
  ],
  "status": "published|pending",
  "createdAt": 1640995200000,
  "updatedAt": 1640995200000
}
```

### User Document
```json
{
  "id": "userId",
  "displayName": "string",
  "email": "string",
  "avatarUrl": "string",
  "location": "string",
  "accessibility": {
    "mobility": ["wheelchair", "limited_mobility"],
    "vision": ["low_vision", "blind"],  
    "hearing": ["deaf", "hard_of_hearing"],
    "neurodiversity": ["adhd", "autism", "dyslexia"],
    "communicationPrefs": ["asl", "text_only", "voice_only"],
    "assistiveTech": ["screen_reader", "voice_control"]
  },
  "modifiedMasters": {
    "wantsToTeach": true,
    "wantsToLearn": true,
    "tags": ["adaptive_sports", "accessible_tech"],
    "visible": true,
    "coachingStyles": ["patient", "visual_learner"]  
  },
  "createdAt": 1640995200000,
  "updatedAt": 1640995200000
}
```

### Session Document  
```json
{
  "id": "auto-generated",
  "skillId": "string",
  "coachId": "string",
  "learnerId": "string", 
  "mode": "video|phone|chat|async",
  "startTime": 1640995200000,
  "endTime": 1640998800000,
  "joinUrl": "string",
  "captionsRequired": false,
  "aslRequested": false, 
  "recordPolicy": "prohibited|allowed|allow-with-consent",
  "status": "requested|confirmed|completed|canceled",
  "createdAt": 1640995200000
}
```

## Authentication

All protected endpoints require a Firebase ID token in the Authorization header:

```
Authorization: Bearer <firebase_id_token>
```

Get the token from Firebase Auth in your frontend application and pass it with each request.

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "message": "Error description"
  }
}
```

## Success Responses

All endpoints return consistent success responses:

```json
{
  "success": true,
  "data": {
    // Response data here
  }
}
```