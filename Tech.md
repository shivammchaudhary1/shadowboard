# Step-by-Step Development Implementation Plan (MERN)

Interactive Personality Voting Game

---

## Phase 1: Project Setup (Foundation)

### Step 1: Create Project Structure

- Create two folders:
  - client (React)
  - server (Node + Express)

Command:

- mkdir personality-game
- cd personality-game
- npx create-react-app client
- mkdir server

---

### Step 2: Initialize Backend (Server)

- cd server
- npm init -y
- Install core dependencies:
  - express
  - cors
  - mongoose
  - socket.io
  - dotenv
  - uuid

Purpose:

- Express → APIs
- Socket.io → Real-time game
- MongoDB → Rooms, Players, Votes

---

### Step 3: Setup Basic Express Server

- Create:
  - server.js
  - config/db.js
- Connect MongoDB using Mongoose
- Enable CORS and JSON middleware

---

## Phase 2: Database Implementation

### Step 4: Create MongoDB Models

Create models folder:

- Room.js
- Player.js
- Vote.js
- Word.js

Basic Fields:

- Room: roomId, hostId, status, currentWord
- Player: name, roomId, score, socketId
- Vote: votedBy, votedFor, roundId
- Word: text (Funny, Leader, Smart, etc.)

---

### Step 5: Seed Word Database

- Create a script to insert default personality words
  Example:
- Funny
- Leader
- Smart
- Creative
- Introvert
- Confident

---

## Phase 3: Real-Time Socket Architecture (Core)

### Step 6: Setup Socket.io on Backend

- Integrate Socket.io with Express server
- Create /sockets folder
- File: game.socket.js

Responsibilities:

- Handle room join
- Broadcast word
- Handle votes
- Emit results

---

### Step 7: Define Socket Events (Implementation Order)

Client → Server:

- create-room
- join-room
- start-round
- submit-vote

Server → Client:

- room-created
- player-joined
- word-flash
- timer-start
- vote-update
- round-result
- leaderboard-update

---

## Phase 4: Room System Implementation

### Step 8: Create Room API (REST)

Endpoint:

- POST /api/rooms/create
  Logic:
- Generate unique roomId (UUID)
- Save host as first player
- Return invite link

---

### Step 9: Join Room Logic (Socket + DB)

Flow:

- User enters name + room code
- Backend:
  - Validate room exists
  - Add player to DB
  - Attach socketId
- Broadcast updated player list

---

## Phase 5: Frontend Core UI (React)

### Step 10: Setup Frontend Dependencies

Install:

- socket.io-client
- axios
- react-router-dom
- framer-motion (for animations)

---

### Step 11: Create Main Pages

- Home Page (Create / Join Room)
- Lobby Page (Waiting Room)
- Game Page (Word + Voting UI)
- Result Page (Round Results)
- Leaderboard Page

Folder Structure:

- /pages
- /components
- /socket
- /services
- /context

---

## Phase 6: Lobby System (Multiplayer Entry)

### Step 12: Implement Lobby Screen

Features:

- Show joined players list (real-time)
- Display room code
- “Start Game” button (host only)
- Live updates using socket listener

---

## Phase 7: Game Round Engine (Core Logic)

### Step 13: Random Word Flash System

Backend Logic:

- Fetch random word from Words collection
- Emit “word-flash” event to all players
  Frontend:
- Display large animated flashing word
- Add sound/animation

---

### Step 14: Countdown Timer Implementation

- Start timer (10–15 seconds) via server
- Emit timer-start event
- Sync timer for all players (important for fairness)

---

## Phase 8: Voting System (Main Feature)

### Step 15: Build Voting UI

Frontend:

- Show all player avatars/names
- Click to vote for one player
- Disable vote after submission

Backend:

- Prevent duplicate votes
- Store vote in database
- Emit live vote count (optional anonymous)

---

### Step 16: Real-Time Vote Handling (Socket)

Logic:

- On submit-vote event:
  - Validate player
  - Save vote
  - Broadcast vote-update to room

---

## Phase 9: Result & Scoring System

### Step 17: Calculate Round Result

Backend:

- Count votes per player
- Identify most voted player
- Update score in Players collection

Emit:

- round-result (winner + vote stats)

---

### Step 18: Leaderboard Implementation

- Sort players by score
- Emit leaderboard-update after each round
- Display ranking UI on frontend

---

## Phase 10: Game Flow Controller (Important)

### Step 19: Full Round Lifecycle Logic

Flow:

1. Host clicks Start Round
2. Server selects random word
3. Word flashes to all players
4. Timer starts
5. Players submit votes
6. Timer ends automatically
7. Server calculates results
8. Leaderboard updates
9. Next round trigger

---

## Phase 11: Security & Game Rules

### Step 20: Validation Rules

- One vote per player per round
- Prevent self-voting (optional)
- Prevent joining after game starts (optional)
- Handle player disconnects (socket cleanup)

---

## Phase 12: UX & Interactive Enhancements (Fun Layer)

### Step 21: Add Game Animations

- Flash word animation
- Confetti for winner
- Sound on round start
- Emoji reactions during voting

---

## Phase 13: Deployment Planning

### Step 22: Production Deployment

- Frontend: Vercel / Netlify
- Backend: AWS / Render / Railway
- Database: MongoDB Atlas
- Enable WebSocket support in hosting

---

## Final MVP Development Order (Most Efficient)

1. Backend setup + Socket.io
2. Room creation + Join system
3. Lobby real-time players
4. Word flash engine
5. Voting system (real-time)
6. Result calculation
7. Leaderboard
8. Animations + UI polish
