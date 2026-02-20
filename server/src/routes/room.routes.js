import express from "express";
import {
  createRoom,
  joinRoom,
  getRoomDetails,
  leaveRoom,
  getUserRooms,
} from "../controllers/room.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const roomRouter = express.Router();

// All room routes require authentication
roomRouter.use(authenticateUser);

// Room management routes
roomRouter.post("/", createRoom); // POST /rooms - Create new room
roomRouter.get("/user", getUserRooms); // GET /rooms/user - Get user's rooms
roomRouter.post("/:roomId/join", joinRoom); // POST /rooms/:roomId/join - Join room by ID
roomRouter.get("/:roomId", getRoomDetails); // GET /rooms/:roomId - Get room details
roomRouter.post("/:roomId/leave", leaveRoom); // POST /rooms/:roomId/leave - Leave room

export default roomRouter;
