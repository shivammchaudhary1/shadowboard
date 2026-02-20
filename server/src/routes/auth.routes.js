import express from 'express';
import {
  registerUser,
  loginUser,
  forgetPassword
} from '../controllers/auth.controller.js';

const authRouter = express.Router();

// Authentication routes
authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/forgot-password', forgetPassword);

export default authRouter;
