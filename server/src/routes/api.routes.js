import express from "express";
import authRouter from "./auth.routes.js";
import roomRouter from "./room.routes.js";
import questionRouter from "./question.routes.js";
import voteRouter from "./vote.routes.js";
import inviteRouter from "./invite.routes.js";

// Create main API router
const apiRouter = express.Router();

// Mount route modules
apiRouter.use("/auth", authRouter);
apiRouter.use("/rooms", roomRouter);
apiRouter.use("/questions", questionRouter);
apiRouter.use("/votes", voteRouter);
apiRouter.use("/invites", inviteRouter);

// Health check for API
apiRouter.get("/", (req, res) => {
  res.json({
    message: "Shadow Board API v1.0.0 - Voting System",
    status: "running",
    timestamp: new Date().toISOString(),
    features: [
      "Authentication & User Management",
      "Room-based Voting System",
      "Real-time Question & Voting",
      "Email Invitations",
      "Vote Results & Analytics",
    ],
  });
});

export default apiRouter;
