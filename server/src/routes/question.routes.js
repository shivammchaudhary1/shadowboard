import express from "express";
import {
  createQuestion,
  startQuestion,
  getRoomQuestions,
  getActiveQuestion,
  endQuestion,
} from "../controllers/question.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const questionRouter = express.Router();

// All question routes require authentication
questionRouter.use(authenticateUser);

// Question management routes
questionRouter.post("/rooms/:roomId/questions", createQuestion); // POST /questions/rooms/:roomId/questions - Create question
questionRouter.get("/rooms/:roomId/questions", getRoomQuestions); // GET /questions/rooms/:roomId/questions - Get room questions
questionRouter.get("/rooms/:roomId/questions/active", getActiveQuestion); // GET /questions/rooms/:roomId/questions/active - Get active question
questionRouter.patch("/questions/:questionId/start", startQuestion); // PATCH /questions/questions/:questionId/start - Start question
questionRouter.patch("/questions/:questionId/end", endQuestion); // PATCH /questions/questions/:questionId/end - End question

export default questionRouter;
