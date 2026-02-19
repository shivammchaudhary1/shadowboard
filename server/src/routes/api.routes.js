import express from "express";
import authRouter from "./auth.routes.js";

// Create main API router
const apiRouter = express.Router();

// Mount auth routes
apiRouter.use("/auth", authRouter);

// Health check for API
apiRouter.get("/", (req, res) => {
  res.json({
    message: "Shadow Board API v1.0.0",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

export default apiRouter;
