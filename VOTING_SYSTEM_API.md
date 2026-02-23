# Voting System API Documentation

## Overview

This document outlines the complete real-time room-based voting system implementation for Shadow Board. The system allows authenticated users to create voting rooms, invite members, create questions, and conduct anonymous or public voting sessions.

## Architecture

### MongoDB Schema Design

#### 1. Room Model (`room.model.js`)

```javascript
{
  roomId: String (6-char nanoid, unique, indexed),
  hostId: ObjectId (ref: User),
  name: String (max 100 chars),
  description: String (max 500 chars),
  settings: {
    allowSelfVoting: Boolean (default: false),
    hostCanParticipate: Boolean (default: true),
    maxMembers: Number (default: 50, max: 100),
    isAnonymousVoting: Boolean (default: false)
  },
  status: String (waiting|active|paused|completed|closed),
  timestamps: true
}
```

#### 2. Room Member Model (`roomMember.model.js`)

```javascript
{
  roomId: String (indexed),
  userId: ObjectId (ref: User),
  role: String (host|member),
  status: String (active|left|kicked),
  joinedAt: Date,
  leftAt: Date,
  socketId: String (for real-time integration),
  timestamps: true
}
```

#### 3. Question Model (`question.model.js`)

```javascript
{
  roomId: String (indexed),
  questionText: String (max 500 chars),
  createdBy: ObjectId (ref: User),
  questionType: String (member_voting|custom_options),
  customOptions: [{
    optionText: String,
    optionId: String (nanoid)
  }],
  status: String (draft|active|completed|cancelled),
  settings: {
    allowMultipleVotes: Boolean,
    allowSelfVoting: Boolean,
    isAnonymous: Boolean,
    timeLimit: Number (minutes, 0 = unlimited)
  },
  startTime: Date,
  endTime: Date,
  totalVotes: Number,
  timestamps: true
}
```

#### 4. Vote Model (`vote.model.js`)

```javascript
{
  questionId: ObjectId (ref: Question),
  roomId: String (indexed),
  votedBy: ObjectId (ref: User),
  votedForUser: ObjectId (ref: User), // For member voting
  votedForOption: String, // For custom option voting
  isAnonymous: Boolean,
  voteWeight: Number (default: 1),
  submittedAt: Date,
  timestamps: true
}
```

#### 5. Invite Model (`invite.model.js`)

```javascript
{
  roomId: String (indexed),
  invitedBy: ObjectId (ref: User),
  email: String (indexed),
  inviteToken: String (nanoid, unique),
  status: String (sent|accepted|declined|expired),
  expiresAt: Date (TTL index for auto cleanup),
  acceptedAt: Date,
  acceptedBy: ObjectId (ref: User),
  timestamps: true
}
```

## API Endpoints

### Authentication

All endpoints require Bearer token authentication via `Authorization: Bearer <token>` header.

### Room Management

#### Create Room

```
POST /api/rooms
Content-Type: application/json
Authorization: Bearer <token>

Body:
{
  "name": "Friday Fun Voting",
  "description": "Weekly team voting session",
  "settings": {
    "allowSelfVoting": false,
    "hostCanParticipate": true,
    "maxMembers": 20,
    "isAnonymousVoting": true
  }
}

Response:
{
  "message": "Room created successfully",
  "success": true,
  "data": {
    "roomId": "A1B2C3",
    "name": "Friday Fun Voting",
    "description": "Weekly team voting session",
    "settings": {...},
    "status": "waiting",
    "createdAt": "2026-02-21T..."
  }
}
```

#### Join Room by ID

```
POST /api/rooms/{roomId}/join
Authorization: Bearer <token>

Response:
{
  "message": "Joined room successfully",
  "success": true,
  "data": {
    "roomId": "A1B2C3",
    "roomName": "Friday Fun Voting",
    "role": "member",
    "joinedAt": "2026-02-21T...",
    "user": {
      "username": "john_doe",
      "email": "john@example.com"
    }
  }
}
```

#### Get Room Details

```
GET /api/rooms/{roomId}
Authorization: Bearer <token>

Response:
{
  "message": "Room details retrieved successfully",
  "success": true,
  "data": {
    "room": {
      "roomId": "A1B2C3",
      "name": "Friday Fun Voting",
      "settings": {...},
      "status": "active",
      "host": {
        "userId": "...",
        "username": "jane_host",
        "email": "jane@example.com"
      }
    },
    "members": [{
      "userId": "...",
      "username": "john_doe",
      "role": "member",
      "joinedAt": "2026-02-21T..."
    }],
    "memberCount": 5,
    "userRole": "member"
  }
}
```

#### Get User's Rooms

```
GET /api/rooms/user
Authorization: Bearer <token>

Response:
{
  "message": "User rooms retrieved successfully",
  "success": true,
  "data": {
    "rooms": [{
      "roomId": "A1B2C3",
      "name": "Friday Fun Voting",
      "status": "active",
      "userRole": "host",
      "joinedAt": "2026-02-21T...",
      "host": {
        "username": "jane_host"
      }
    }],
    "count": 3
  }
}
```

### Question Management

#### Create Question

```
POST /api/questions/rooms/{roomId}/questions
Authorization: Bearer <token>
Content-Type: application/json

Body (Member Voting):
{
  "questionText": "Who looks most professional today?",
  "questionType": "member_voting",
  "settings": {
    "allowSelfVoting": false,
    "isAnonymous": true,
    "timeLimit": 5
  }
}

Body (Custom Options):
{
  "questionText": "What's your favorite programming language?",
  "questionType": "custom_options",
  "customOptions": [
    { "optionText": "JavaScript" },
    { "optionText": "Python" },
    { "optionText": "TypeScript" },
    { "optionText": "Go" }
  ],
  "settings": {
    "isAnonymous": false,
    "timeLimit": 0
  }
}

Response:
{
  "message": "Question created successfully",
  "success": true,
  "data": {
    "questionId": "...",
    "questionText": "Who looks most professional today?",
    "questionType": "member_voting",
    "settings": {...},
    "status": "draft",
    "createdAt": "2026-02-21T..."
  }
}
```

#### Start Question

```
PATCH /api/questions/questions/{questionId}/start
Authorization: Bearer <token>

Response:
{
  "message": "Question started successfully",
  "success": true,
  "data": {
    "questionId": "...",
    "status": "active",
    "startTime": "2026-02-21T...",
    "endTime": "2026-02-21T..." // null if no time limit
  }
}
```

#### Get Active Question

```
GET /api/questions/rooms/{roomId}/questions/active
Authorization: Bearer <token>

Response:
{
  "message": "Active question retrieved successfully",
  "success": true,
  "data": {
    "question": {
      "questionId": "...",
      "questionText": "Who looks most professional today?",
      "questionType": "member_voting",
      "status": "active",
      "settings": {...},
      "totalVotes": 0,
      "startTime": "2026-02-21T...",
      "endTime": null
    },
    "availableOptions": [
      {
        "type": "user",
        "userId": "...",
        "username": "john_doe",
        "email": "john@example.com"
      },
      {
        "type": "user",
        "userId": "...",
        "username": "jane_smith",
        "email": "jane@example.com"
      }
    ],
    "userRole": "member"
  }
}
```

### Voting

#### Submit Vote

```
POST /api/votes/questions/{questionId}/vote
Authorization: Bearer <token>
Content-Type: application/json

Body (Member Vote):
{
  "votedForUser": "user_object_id_here"
}

Body (Option Vote):
{
  "votedForOption": "option_id_here"
}

Response:
{
  "message": "Vote submitted successfully",
  "success": true,
  "data": {
    "voteId": "...",
    "questionId": "...",
    "submittedAt": "2026-02-21T...",
    "isAnonymous": true
  }
}
```

#### Get Question Results

```
GET /api/votes/questions/{questionId}/results?includeVoteDetails=false
Authorization: Bearer <token>

Response:
{
  "message": "Question results retrieved successfully",
  "success": true,
  "data": {
    "question": {
      "questionId": "...",
      "questionText": "Who looks most professional today?",
      "status": "completed",
      "totalVotes": 8
    },
    "results": [
      {
        "type": "user",
        "user": {
          "userId": "...",
          "username": "jane_smith",
          "email": "jane@example.com"
        },
        "voteCount": 5,
        "percentage": 63
      },
      {
        "type": "user",
        "user": {
          "userId": "...",
          "username": "john_doe",
          "email": "john@example.com"
        },
        "voteCount": 3,
        "percentage": 37
      }
    ],
    "totalVotes": 8,
    "userRole": "member"
  }
}
```

### Invitations

#### Send Email Invitation

```
POST /api/invites/rooms/{roomId}/invite
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "email": "friend@example.com",
  "message": "Join our fun voting session!"
}

Response:
{
  "message": "Invitation sent successfully",
  "success": true,
  "data": {
    "email": "friend@example.com",
    "inviteToken": "...",
    "expiresAt": "2026-02-28T...",
    "inviteLink": "https://shadowboard.com/join-room?token=..."
  }
}
```

#### Join via Invitation Token

```
POST /api/invites/join
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "token": "invite_token_here"
}

Response:
{
  "message": "Successfully joined room via invitation",
  "success": true,
  "data": {
    "roomId": "A1B2C3",
    "roomName": "Friday Fun Voting",
    "role": "member",
    "alreadyMember": false
  }
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "success": false,
  "error": "Additional error details (optional)"
}
```

Common HTTP status codes:

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## Security Features

1. **Authentication**: JWT Bearer token required for all endpoints
2. **Authorization**: Role-based access (host vs member permissions)
3. **Data Validation**: Input sanitization and validation
4. **Rate Limiting**: Built-in rate limiting middleware
5. **Unique Constraints**: Prevent duplicate votes and memberships
6. **Expiring Invitations**: TTL indexes for automatic cleanup

## Performance Optimizations

1. **Database Indexes**: Strategic indexing on frequently queried fields
2. **Compound Indexes**: Multi-field indexes for complex queries
3. **Aggregation Pipelines**: Efficient vote counting and result calculation
4. **Connection Pooling**: Mongoose connection optimization
5. **Selective Population**: Only fetch required user fields

## Future Enhancements

1. **Socket.io Integration**: Real-time updates for votes and questions
2. **Vote Analytics**: Advanced statistics and reporting
3. **Room Templates**: Pre-configured room types
4. **Scheduled Questions**: Time-based question activation
5. **Weighted Voting**: Different vote values based on user roles
6. **Question Categories**: Organize questions by topic
7. **Export Results**: CSV/PDF result exports

## Testing Recommendations

1. **Unit Tests**: Controller and service layer tests
2. **Integration Tests**: API endpoint testing
3. **Load Testing**: Concurrent voting scenarios
4. **Security Testing**: Authentication and authorization validation
5. **Database Testing**: Schema validation and constraint testing

## Deployment Notes

1. Ensure MongoDB indexes are created in production
2. Configure email service (SMTP) for invitations
3. Set up environment variables for JWT secrets and database URLs
4. Enable MongoDB TTL for automatic invite cleanup
5. Configure CORS for frontend domain access
6. Set up monitoring for vote submission rates and room activity
