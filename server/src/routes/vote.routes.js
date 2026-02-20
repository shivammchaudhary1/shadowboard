import express from "express";
import {
  submitVote,
  getQuestionResults,
  getUserVote,
} from "../controllers/vote.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const voteRouter = express.Router();

// All vote routes require authentication
voteRouter.use(authenticateUser);

// Voting routes
voteRouter.post("/questions/:questionId/vote", submitVote); // POST /votes/questions/:questionId/vote - Submit vote
voteRouter.get("/questions/:questionId/results", getQuestionResults); // GET /votes/questions/:questionId/results - Get question results
voteRouter.get("/questions/:questionId/my-vote", getUserVote); // GET /votes/questions/:questionId/my-vote - Get user's vote

export default voteRouter;
