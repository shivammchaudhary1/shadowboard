import { verifyAccessToken } from "../config/libraries/jwt.js";

const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
};

export const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    try {
      const decoded = verifyAccessToken(token);
      req.userId = decoded.id;
      req.role = decoded.role; // Attach user role to request for authorization checks

      next();
    } catch (error) {
      if (error.message === "Token has expired") {
        return res.status(401).json({
          success: false,
          message: "Token has expired. Please login again.",
          isExpired: true,
        });
      }

      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const requireAdmin = (req, res, next) => {
  // Check if user role exists (should be set by authenticateUser middleware)
  if (!req.role) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please login first.",
      errorCode: "AUTHENTICATION_REQUIRED",
    });
  }

  // Check if user has admin role
  if (req.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
      errorCode: "INSUFFICIENT_PRIVILEGES",
    });
  }

  next();
};
