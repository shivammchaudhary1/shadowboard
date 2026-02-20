import express from "express";
import {
  registerUser,
  loginUser,
  verifyEmail,
  forgetPassword,
  forgetPasswordResetViaToken,
} from "../controllers/auth.controller.js";
import {
  loginRateLimiter,
  registerRateLimiter,
  passwordResetRateLimiter,
} from "../middleware/rateLimiter.js";

const authRouter = express.Router();

// Authentication routes with rate limiting
authRouter.post("/register", registerRateLimiter, registerUser);
authRouter.post("/login", loginRateLimiter, loginUser);
authRouter.get("/verify-email", verifyEmail);
authRouter.post("/forgot-password", passwordResetRateLimiter, forgetPassword);
authRouter.patch(
  "/reset-password",
  passwordResetRateLimiter,
  forgetPasswordResetViaToken,
);

export default authRouter;
