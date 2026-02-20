import UserModel from "../models/user.model.js";
import LoginHistoryModel from "../models/loginHistory.model.js";
import { hashPassword, comparePassword } from "../config/libraries/bcrypt.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
} from "../config/libraries/jwt.js";
import { sendMail } from "../config/libraries/nodeMailer.js";
import { verifyEmailTemplate } from "../config/emails/verifyMail.js";
import { forgotPasswordTemplate } from "../config/emails/forgotPassword.js";
import config from "../config/envs/default.js";
import { generateUniqueUsername } from "../utility/uniqueUsername.js";
import { createLogEntry } from "../config/libraries/ipAddress.js";

const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email, please login",
        success: false,
      });
    }

    const baseUsername = email.split("@")[0];
    const username = await generateUniqueUsername(baseUsername, UserModel);

    // Create new user
    const newUser = new UserModel({
      username,
      email,
      password: await hashPassword(password),
      isVerified: false, // Add email verification status
      verificationToken: null, // Will be set when generating tokens
    });

    // Save user to database first to get the _id
    const savedUser = await newUser.save();

    // Create login history record for registration
    const loginHistory = new LoginHistoryModel({
      userId: savedUser._id,
      registerLog: createLogEntry(req),
      loginLogs: [], // Initialize empty login logs array
    });
    const savedLoginHistory = await loginHistory.save();

    // Link login history to user
    savedUser.userLogs = savedLoginHistory._id;

    // Generate access and refresh tokens using the saved user's _id
    const passwordVerificationToken = generateAccessToken({
      id: savedUser._id,
    });

    // Update user with verification token (using access token for simplicity)
    savedUser.verificationToken = passwordVerificationToken;
    savedUser.verificationTokenExpires = new Date(Date.now());
    await savedUser.save();

    // Send verification email
    const verificationLink = `${config.frontendUrl}/verify-email?token=${passwordVerificationToken}`;

    const emailResult = await sendMail(
      email,
      "Verify Your Email Address - Shadow Board",
      verifyEmailTemplate(verificationLink, username),
    );

    // Log email send result
    if (emailResult.success) {
      console.log(`✅ Verification email sent to: ${email}`);
    } else {
      console.error(
        `❌ Failed to send verification email: ${emailResult.error}`,
      );
    }

    // Return success response (don't include sensitive data)
    res.status(201).json({
      message:
        "User registered successfully! Please check your email to verify your account.",
      success: true,
      emailSent: emailResult.success,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        message: "Please provide an email",
        success: false,
      });
    } else if (!password) {
      return res.status(400).json({
        message: "Please provide a password",
        success: false,
      });
    }
    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "email doesn't exist, please register first",
        success: false,
      });
    }

    // Check if password is correct
    const isPasswordCorrect = await comparePassword(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Incorrect password provided, please try again",
        success: false,
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      // Resend verification email

      if (
        !user.verificationToken ||
        user.verificationTokenExpires < new Date()
      ) {
        // Generate new verification token if it doesn't exist or has expired
        const newVerificationToken = generateAccessToken({
          id: user._id,
        });
        user.verificationToken = newVerificationToken;
        user.verificationTokenExpires = new Date(Date.now());
        await user.save();
      }

      const verificationLink = `${config.frontendUrl}/verify-email?token=${user.verificationToken}`;
      await sendMail(
        email,
        "Verify Your Email Address - Shadow Board",
        verifyEmailTemplate(verificationLink, user.username),
      );

      return res.status(403).json({
        message:
          "Please verify your email before logging in. Check your inbox for verification email.",
        success: false,
        needsEmailVerification: true,
      });
    }

    const refreshToken = generateRefreshToken({ id: user._id });
    const accessToken = generateAccessToken({ id: user._id, role: user.role });

    // Update user's last login
    user.lastLogin = new Date();
    await user.save();

    // Update login history with new login entry
    try {
      let loginHistory = await LoginHistoryModel.findOne({ userId: user._id });

      if (!loginHistory) {
        // Create new login history if it doesn't exist (for existing users who don't have history)
        loginHistory = new LoginHistoryModel({
          userId: user._id,
          registerLog: {
            timestamp: user.createdAt || new Date(),
            ipAddress: "unknown",
            userAgent: "unknown",
          },
          loginLogs: [createLogEntry(req)],
        });
        const savedLoginHistory = await loginHistory.save();

        // Link to user if not already linked
        if (!user.userLogs) {
          user.userLogs = savedLoginHistory._id;
          await user.save();
        }
      } else {
        // Add new login entry to existing history
        loginHistory.loginLogs.push(createLogEntry(req));
        await loginHistory.save();
      }
    } catch (loginHistoryError) {
      // Log the error but don't fail the login process
      console.error("Error updating login history:", loginHistoryError);
    }

    console.log(`✅ User logged in: ${email}`);

    // Return success response
    res.status(200).json({
      message: "Login successful",
      success: true,
      user: {
        id: user._id,
        username: user.username,
        isVerified: user.isVerified,
      },
      tokens: {
        refreshToken,
        accessToken,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      message: "Server error during login",
      success: false,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({
        message: "Verification token is required",
        success: false,
      });
    }

    const user = await UserModel.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({
        message: "Invalid verification token",
        success: false,
      });
    }

    const isVerificationTokenValid = verifyAccessToken(token);
    if (!isVerificationTokenValid) {
      return res.status(400).json({
        message: "Verification token has expired or is invalid",
        success: false,
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({
      message: "Email verified successfully, you can now log in",
      success: true,
    });
  } catch (error) {
    console.error("Error during email verification:", error);
    res.status(500).json({
      message: "Server error during email verification",
      success: false,
    });
  }
};

// Forget Password
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        message: "Email is mandatory to reset password",
        success: false,
      });
    }

    // Check if user exists
    const user = await UserModel.findOne({ email });

    if (!user) {
      // For security reasons, don't reveal if email exists or not
      return res.status(200).json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
        success: true,
      });
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = generateAccessToken({ id: user._id, type: "reset" });

    // Save reset token and expiry time
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now()); // 1 hour from now
    await user.save();

    // Create reset link
    const resetLink = `${config.frontendUrl}/reset-password?token=${resetToken}`;

    // Send reset email
    const emailResult = await sendMail(
      email,
      "Reset Your Password - Shadow Board",
      forgotPasswordTemplate(resetLink, user.username),
    );

    // Log email result
    if (emailResult.success) {
      console.log(`✅ Password reset email sent to: ${email}`);
    } else {
      console.error(`❌ Failed to send reset email: ${emailResult.error}`);
    }

    res.status(200).json({
      message:
        "If an account with that email exists, a password reset link has been sent. Please check your email.",
      success: true,
      emailSent: emailResult.success,
    });
  } catch (error) {
    console.error("Error during forget password:", error);
    res.status(500).json({
      message: "Server error during password reset request",
      success: false,
    });
  }
};

const forgetPasswordResetViaToken = async (req, res) => {
  try {
    const { token } = req.query;
    const { newPassword } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Reset token is required for password reset",
        success: false,
      });
    }

    const user = await UserModel.findOne({ resetPasswordToken: token });
    if (!user) {
      return res.status(400).json({
        message: "Invalid reset token",
        success: false,
      });
    }

    const isResetTokenValid = verifyAccessToken(token);
    if (!isResetTokenValid) {
      return res.status(400).json({
        message: "Reset token has expired or is invalid",
        success: false,
      });
    }

    user.password = await hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      message:
        "Password reset successful, you can now log in with your new password",
      success: true,
    });
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({
      message: "Server error during password reset",
      success: false,
    });
  }
};

export {
  registerUser,
  loginUser,
  verifyEmail,
  forgetPassword,
  forgetPasswordResetViaToken,
};
