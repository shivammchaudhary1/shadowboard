# 1. Full Folder Structure (MERN)

## Root Structure

- personality-vote-game/
  - client/ (Frontend - React)
  - server/ (Backend - Node + Express + Socket.io)

---

# 2. Frontend Folder Structure (React)

client/
│
├── public/
│ └── index.html
│
├── src/
│ ├── assets/ # images, sounds, icons
│ ├── components/ # reusable UI components
│ │ ├── Game/
│ │ │ ├── FlashWord.jsx
│ │ │ ├── VotingPanel.jsx
│ │ │ ├── Timer.jsx
│ │ │ └── Leaderboard.jsx
│ │ │
│ │ ├── Lobby/
│ │ │ ├── PlayerList.jsx
│ │ │ └── RoomInfo.jsx
│ │ │
│ │ └── Common/
│ │ ├── Button.jsx
│ │ ├── Modal.jsx
│ │ └── Loader.jsx
│ │
│ ├── pages/
│ │ ├── Home.jsx # Create / Join Room
│ │ ├── Lobby.jsx # Waiting room
│ │ ├── Game.jsx # Main game screen
│ │ ├── Result.jsx # Round result screen
│ │ └── NotFound.jsx
│ │
│ ├── socket/
│ │ └── socket.js # socket.io client config
│ │
│ ├── context/
│ │ ├── GameContext.jsx # global game state
│ │ └── SocketContext.jsx
│ │
│ ├── services/
│ │ ├── api.js # axios config
│ │ └── roomService.js
│ │
│ ├── utils/
│ │ ├── constants.js
│ │ └── helpers.js
│ │
│ ├── App.js
│ └── index.js

---

# 3. Backend Folder Structure (Node + Express + Socket.io)

server/
│
├── src/
│ ├── config/
│ │ └── db.js # MongoDB connection
│ │
│ ├── models/ # MongoDB Schemas
│ │ ├── Room.model.js
│ │ ├── Player.model.js
│ │ ├── Vote.model.js
│ │ ├── Word.model.js
│ │ └── Round.model.js
│ │
│ ├── controllers/
│ │ ├── room.controller.js
│ │ └── game.controller.js
│ │
│ ├── routes/
│ │ ├── room.routes.js
│ │ └── game.routes.js
│ │
│ ├── sockets/
│ │ ├── index.js # socket initializer
│ │ ├── room.socket.js
│ │ └── game.socket.js
│ │
│ ├── services/
│ │ ├── room.service.js
│ │ ├── vote.service.js
│ │ └── round.service.js
│ │
│ ├── utils/
│ │ ├── generateRoomId.js
│ │ └── randomWord.js
│ │
│ └── server.js
│
├── .env
├── package.json
└── README.md

---

# 4. MongoDB Schemas (With Relationships)

## 4.1 Room Schema (Main Entity)

Purpose: Stores game room + settings (anonymous play / normal play)

Room.model.js

- \_id: ObjectId
- roomId: String (unique invite code)
- hostId: ObjectId (ref: Player)
- status: String (waiting | playing | ended)
- playMode: String (anonymous | normal) # IMPORTANT (play foul / anonymous)
- maxPlayers: Number
- currentRoundId: ObjectId (ref: Round)
- players: [ObjectId] (ref: Player)
- createdAt: Date
- updatedAt: Date

Relationship:

- One Room → Many Players
- One Room → Many Rounds

---

## 4.2 Player Schema

Purpose: Stores each player inside a room

Player.model.js

- \_id: ObjectId
- name: String
- socketId: String
- roomId: ObjectId (ref: Room)
- score: Number (default: 0)
- isHost: Boolean
- isAnonymous: Boolean (true if anonymous play mode)
- avatar: String (optional)
- joinedAt: Date

Relationship:

- Many Players → One Room

---

## 4.3 Round Schema (Game Round Logic)

Purpose: Each word round tracking

Round.model.js

- \_id: ObjectId
- roomId: ObjectId (ref: Room)
- wordId: ObjectId (ref: Word)
- roundNumber: Number
- status: String (active | completed)
- startTime: Date
- endTime: Date
- winnerPlayerId: ObjectId (ref: Player)
- createdAt: Date

Relationship:

- One Room → Many Rounds
- One Round → One Word
- One Round → Many Votes

---

## 4.4 Vote Schema (Core Game Logic)

Purpose: Stores votes per round

Vote.model.js

- \_id: ObjectId
- roomId: ObjectId (ref: Room)
- roundId: ObjectId (ref: Round)
- votedBy: ObjectId (ref: Player)
- votedFor: ObjectId (ref: Player)
- isAnonymousVote: Boolean (true in anonymous mode)
- createdAt: Date

Relationship:

- Many Votes → One Round
- Many Votes → One Player (votedFor)
- Many Votes → One Player (votedBy)

Validation Rules:

- One vote per player per round
- Cannot vote twice in same round

---

## 4.5 Word Schema (Flashing Personality Words)

Purpose: Word bank for game rounds

Word.model.js

- \_id: ObjectId
- text: String (e.g., Funny, Leader, Smart)
- category: String (optional)
- isActive: Boolean (default: true)
- createdAt: Date

Relationship:

- One Word → Used in Many Rounds

---

# 5. Anonymous (Play Foul) vs Normal Play Logic (DB Level)

## Play Modes Stored in Room:

- playMode: "anonymous"
- playMode: "normal"

### If Normal Mode:

- Show real player names during voting
- Votes visible with identity

### If Anonymous Mode (Play Foul Mode):

- Hide player identity during voting
- Show random labels:
  - Player A
  - Player B
  - Player C
- isAnonymousVote = true in Vote schema
- isAnonymous = true in Player schema (UI masking only)

---

# 6. Relationship Diagram (Simple)

Room
├── Players (1:N)
├── Rounds (1:N)
│ ├── Word (1:1)
│ └── Votes (1:N)
│ ├── votedBy → Player
│ └── votedFor → Player

Flow:
Room → Round → Votes → Player (Score Update)
