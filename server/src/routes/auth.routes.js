import express from "express";
import {
  registerUser,
  loginUser,
  verifyEmail,
  forgetPassword,
  forgetPasswordResetViaToken,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

// Authentication routes
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/verify-email", verifyEmail);
authRouter.post("/forgot-password", forgetPassword);
authRouter.patch("/reset-password", forgetPasswordResetViaToken);

export default authRouter;
