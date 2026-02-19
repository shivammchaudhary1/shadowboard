# Interactive Personality Voting Game (MERN) – Requirements & Initial Brainstorm

## Step 1: Define Core Concept

- A real-time multiplayer game
- One word flashes on board each round
- Players vote for the person whose personality matches the word
- Live results + leaderboard

---

## Step 2: Identify User Roles

### 1. Host (Room Creator)

- Create game room
- Start/stop rounds
- Invite players via link/code
- Control timer & word rounds

### 2. Players (Invited Members)

- Join room using link/code
- See flashing word
- Vote for a player (not themselves optionally)
- View live results and scores

---

## Step 3: Core Functional Requirements (MVP)

### 3.1 Room System

- Anyone can create a room
- Generate unique Room ID / Invite Link
- Join room via code or link
- Show list of joined players (lobby screen)

### 3.2 Game Round System

- Host starts a round
- Backend selects random word from database
- Word flashes on screen (animation)
- Countdown timer (e.g., 10–15 seconds)

### 3.3 Voting System

- Players vote for 1 player per round
- Prevent duplicate voting
- Optional: anonymous voting
- Store votes in real-time

### 3.4 Result System

- Show live vote counts
- Highlight most voted player
- Update leaderboard after each round

### 3.5 Leaderboard

- Track points per player
- Display ranking after each round
- Final winner after multiple rounds

---

## Step 4: Non-Functional Requirements

- Real-time performance (low latency)
- Mobile responsive UI
- Scalable room handling (multiple rooms)
- Secure room access (unique room IDs)
- Fast socket communication

---

## Step 5: Tech Stack (MERN)

- Frontend: React (UI + animations)
- Backend: Node.js + Express (API + game logic)
- Database: MongoDB (rooms, players, votes, words)
- Real-time: Socket.io (live word + voting updates)

---

## Step 6: Database Design (Initial Collections)

### 6.1 Rooms Collection

- roomId
- hostId
- status (waiting / playing / ended)
- currentWord
- createdAt

### 6.2 Players Collection

- playerId
- name
- roomId
- score
- isHost (boolean)

### 6.3 Votes Collection

- voteId
- roomId
- roundId
- votedBy (playerId)
- votedFor (playerId)

### 6.4 Words Collection

- wordId
- wordText (e.g., Funny, Leader, Smart)

---

## Step 7: Real-Time Socket Events (Important)

### Server → Client Events

- room-created
- player-joined
- word-flash
- timer-start
- vote-updated
- round-result
- leaderboard-update

### Client → Server Events

- create-room
- join-room
- start-round
- submit-vote
- end-round

---

## Step 8: UI Screens Required

1. Home Page (Create / Join Room)
2. Lobby Screen (Players List + Waiting)
3. Game Screen (Flashing Word + Timer + Voting Panel)
4. Result Screen (Votes + Winner)
5. Leaderboard Screen

---

## Step 9: Game Flow Logic (End-to-End)

1. User creates room
2. Room link shared to teammates
3. Players join lobby
4. Host starts game
5. Word flashes on board
6. Timer starts
7. Players vote
8. Votes counted in backend
9. Results displayed
10. Next round begins

---

## Step 10: Extra Interactive Features (Brainstorm)

- Flash animation for word reveal
- Sound effects on round start
- Emoji reactions during voting
- Anonymous mode toggle
- Kick inactive players (host control)
- Custom word list upload
- Dark/party mode UI

---

## Step 11: Initial Folder Structure (MERN)

### Frontend (React)

- /pages
- /components
- /socket
- /game
- /lobby
- /leaderboard

### Backend (Node + Express)

- /controllers
- /routes
- /models
- /sockets
- /services
- /utils

---

## Step 12: First Development Milestones (Start Order)

1. Setup MERN project boilerplate
2. Implement room creation API
3. Setup Socket.io connection
4. Build lobby (join room UI)
5. Implement word flashing system
6. Add voting logic (real-time)
7. Show live results & leaderboard
