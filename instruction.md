# Project: Room-Based Personality Voting Game (MERN)

## Master Implementation Checklist (Track: ✅ Done / ⬜ Pending)

---

# 1. Project Objective

Build a real-time room-based voting game where:

- A logged-in user becomes Host and creates a room (6-digit NanoID)
- Host invites members via Room ID or Email
- Host asks personality-based questions
- Members vote for any joined member (including host optional)
- Support Anonymous Mode (Play Foul) and Normal Mode
- Store voting history, results, and leaderboard

---

# 2. High-Level Milestones

- ⬜ Authentication Integration
- ⬜ Room System (Host + Members)
- ⬜ Question & Voting Engine
- ⬜ Anonymous Mode Logic
- ⬜ Email Invite System
- ⬜ Real-Time Support (Future Socket Integration)

---

# 3. Backend Tasks (Node.js + Express + MongoDB)

## 3.1 Initial Backend Setup

- ⬜ Setup environment variables (.env)
- ⬜ Configure MongoDB connection
- ⬜ Setup global error handler
- ⬜ Setup request-ip middleware utility
- ⬜ Create NanoID utility for Room ID (6 characters)

Subtasks:

- ⬜ Create `src/config/db.js`
- ⬜ Create `src/config/libraries/ipAddress.js`
- ⬜ Create `src/utils/generateRoomId.js`

---

## 3.2 Database Schema Implementation

### Core Schemas

- ⬜ User Schema (already exists - review & reuse)
- ⬜ LoginHistory Schema (IP tracking)
- ⬜ Room Schema
- ⬜ RoomMember Schema
- ⬜ Question Schema
- ⬜ Vote Schema
- ⬜ Invite Schema

Subtasks:

- ⬜ Define relationships (Room → Members → Questions → Votes)
- ⬜ Add playMode field (anonymous / normal)
- ⬜ Add host reference in Room schema
- ⬜ Add role field (host/member)

---

## 3.3 Authentication Integration (Existing System)

- ⬜ Review auth.controller.js structure
- ⬜ Attach userId to room creation (from JWT)
- ⬜ Save login IP in loginHistory
- ⬜ Protect all room routes with auth middleware

---

## 3.4 Room Management System (Core Feature)

### APIs

- ⬜ POST /rooms/create (Host creates room)
- ⬜ GET /rooms/:roomId (Fetch room details)
- ⬜ POST /rooms/join (Join via Room ID)
- ⬜ DELETE /rooms/:roomId (End room - host only)

Subtasks:

- ⬜ Generate 6-digit NanoID room code
- ⬜ Assign host role automatically
- ⬜ Prevent duplicate joining
- ⬜ Validate room existence & status

---

## 3.5 Invite System (Room Sharing)

- ⬜ Invite via Room ID (manual)
- ⬜ Invite via Email (Nodemailer)

Subtasks:

- ⬜ Create invite controller
- ⬜ Create invite email template
- ⬜ Store invite logs in DB
- ⬜ Generate secure invite link

---

## 3.6 Question Management (Host Control)

### APIs

- ⬜ POST /questions/create (Host only)
- ⬜ GET /questions/:roomId
- ⬜ PATCH /questions/:id/activate
- ⬜ PATCH /questions/:id/end

Subtasks:

- ⬜ Allow dynamic question text
- ⬜ Set active question per room
- ⬜ Store createdBy (hostId)
- ⬜ Add timer support (optional)

---

## 3.7 Voting System (Core Logic)

### APIs

- ⬜ POST /votes/submit
- ⬜ GET /votes/results/:questionId
- ⬜ GET /votes/history/:roomId

Subtasks:

- ⬜ One vote per user per question validation
- ⬜ Prevent vote duplication
- ⬜ Allow vote for any member (including host configurable)
- ⬜ Store anonymous vote flag
- ⬜ Auto-calculate most voted member

---

## 3.8 Anonymous Mode (Play Foul Feature)

- ⬜ Add playMode in Room schema
- ⬜ Mask player identity in responses
- ⬜ Store isAnonymousVote in Vote model
- ⬜ Toggle anonymous mode (host setting)

---

## 3.9 Controllers Structure

- ⬜ auth.controller.js (update if needed)
- ⬜ room.controller.js
- ⬜ member.controller.js
- ⬜ question.controller.js
- ⬜ vote.controller.js
- ⬜ invite.controller.js

---

## 3.10 Routes Structure (REST)

- ⬜ /api/auth
- ⬜ /api/rooms
- ⬜ /api/members
- ⬜ /api/questions
- ⬜ /api/votes
- ⬜ /api/invites

Subtasks:

- ⬜ Apply auth middleware
- ⬜ Role-based middleware (host/member)

---

# 4. Frontend Tasks (React)

## 4.1 Frontend Setup

- ⬜ Setup React project structure
- ⬜ Configure Axios API service
- ⬜ Setup global state (Context/Redux)
- ⬜ Setup Socket client (future ready)

---

## 4.2 Authentication UI (Reuse Existing)

- ⬜ Login Page
- ⬜ Signup Page
- ⬜ Store JWT in secure storage
- ⬜ Protect private routes

---

## 4.3 Home Dashboard (Entry Point)

- ⬜ Create Room Button
- ⬜ Join Room via Room ID input
- ⬜ Display recent rooms (optional)

---

## 4.4 Room Lobby Screen

Features:

- ⬜ Show Room ID (copy/share)
- ⬜ Show joined members list
- ⬜ Show host badge
- ⬜ Invite via Email button
- ⬜ Start Game button (host only)

Subtasks:

- ⬜ Real-time member list update (later socket)
- ⬜ Room settings (anonymous toggle)

---

## 4.5 Game Screen (Main Voting UI)

Components:

- ⬜ Flash Question Board
- ⬜ Members Voting Grid
- ⬜ Timer Countdown
- ⬜ Vote Submit Button

Subtasks:

- ⬜ Disable vote after submission
- ⬜ Show anonymous labels (Player A, B, C)
- ⬜ Handle active question state

---

## 4.6 Result & Leaderboard Screen

- ⬜ Show vote counts per member
- ⬜ Highlight most voted player
- ⬜ Display cumulative leaderboard
- ⬜ Next round button (host only)

---

## 4.7 Invite Flow (Frontend)

- ⬜ Share Room ID copy button
- ⬜ Email invite form
- ⬜ Join via invite link page

---

# 5. API Integration Tasks (Frontend ↔ Backend)

- ⬜ Integrate Create Room API
- ⬜ Integrate Join Room API
- ⬜ Integrate Create Question API
- ⬜ Integrate Submit Vote API
- ⬜ Integrate Results API
- ⬜ Integrate Invite Email API

---

# 6. Security & Validation Checklist

- ⬜ JWT authentication on all protected routes
- ⬜ Input validation (Joi/Zod)
- ⬜ Rate limiting (optional)
- ⬜ Prevent unauthorized room access
- ⬜ Sanitize question inputs

---

# 7. Future Enhancements (Optional but Recommended)

- ⬜ Socket.io real-time voting updates
- ⬜ Live timer sync
- ⬜ Emoji reactions
- ⬜ Sound effects for rounds
- ⬜ Game analytics dashboard

---

# 8. Definition of Done (Project Completion Criteria)

- ⬜ Host can create room with 6-digit ID
- ⬜ Members can join via ID or email invite
- ⬜ Host can ask questions dynamically
- ⬜ Members can vote for any member
- ⬜ Anonymous mode works correctly
- ⬜ Votes stored with history
- ⬜ Leaderboard updates correctly
- ⬜ Clean scalable MERN architecture maintained
