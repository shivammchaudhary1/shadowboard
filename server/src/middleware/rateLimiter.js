import { rateLimit } from "express-rate-limit";

/**
 * Rate limiter for login attempts
 * Allows 5 login attempts per IP address within 15 minutes
 */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // Limit each IP to 5 requests per windowMs
  message: {
    message:
      "Too many login attempts from this IP address. Please try again after 15 minutes.",
    success: false,
    remainingTime: "15 minutes",
  },
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: true, // Don't count successful requests
  skipFailedRequests: false, // Count failed requests
  handler: (req, res) => {
    const resetTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
    console.log(
      `🚫 Rate limit exceeded for IP: ${req.ip} at ${new Date().toISOString()}`,
    );

    res.status(429).json({
      message:
        "Too many login attempts from this IP address. Please try again after 15 minutes.",
      success: false,
      retryAfter: resetTime.toISOString(),
      remainingTime: "15 minutes",
    });
  },
});

/**
 * Rate limiter for password reset attempts
 * Allows 3 password reset attempts per IP address within 1 hour
 */
export const passwordResetRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 3, // Limit each IP to 3 password reset requests per hour
  message: {
    message:
      "Too many password reset attempts from this IP address. Please try again after 1 hour.",
    success: false,
    remainingTime: "1 hour",
  },
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  skipFailedRequests: false,
  handler: (req, res) => {
    const resetTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    console.log(
      `🚫 Password reset rate limit exceeded for IP: ${req.ip} at ${new Date().toISOString()}`,
    );

    res.status(429).json({
      message:
        "Too many password reset attempts from this IP address. Please try again after 1 hour.",
      success: false,
      retryAfter: resetTime.toISOString(),
      remainingTime: "1 hour",
    });
  },
});

/**
 * General rate limiter for registration
 * Allows 3 registration attempts per IP address within 1 hour
 */
export const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 3, // Limit each IP to 3 registration requests per hour
  message: {
    message:
      "Too many registration attempts from this IP address. Please try again after 1 hour.",
    success: false,
    remainingTime: "1 hour",
  },
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  skipFailedRequests: false,
  handler: (req, res) => {
    const resetTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    console.log(
      `🚫 Registration rate limit exceeded for IP: ${req.ip} at ${new Date().toISOString()}`,
    );

    res.status(429).json({
      message:
        "Too many registration attempts from this IP address. Please try again after 1 hour.",
      success: false,
      retryAfter: resetTime.toISOString(),
      remainingTime: "1 hour",
    });
  },
});
