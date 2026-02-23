import express from "express";
import {
  sendRoomInvite,
  joinRoomViaInvite,
  getRoomInvites,
} from "../controllers/invite.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const inviteRouter = express.Router();

// All invite routes require authentication
inviteRouter.use(authenticateUser);

// Invitation routes
inviteRouter.post("/rooms/:roomId/invite", sendRoomInvite); // POST /invites/rooms/:roomId/invite - Send room invitation
inviteRouter.get("/rooms/:roomId/invites", getRoomInvites); // GET /invites/rooms/:roomId/invites - Get room invitations
inviteRouter.post("/join", joinRoomViaInvite); // POST /invites/join - Join room via invitation token

export default inviteRouter;
