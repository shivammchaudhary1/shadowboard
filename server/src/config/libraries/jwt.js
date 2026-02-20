import jwt from "jsonwebtoken";
import config from "../envs/default.js";

export const generateAccessToken = (payload, option = {}) => {
  try {
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtAccessTokenExpiresIn,
      ...option,
    });
    return token;
  } catch (error) {
    console.error("Error creating JWT:", error);
  }
};

export const generateRefreshToken = (payload, option = {}) => {
  try {
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtRefreshTokenExpiresIn,
      ...option,
    });
    return token;
  } catch (error) {
    console.error("Error creating JWT:", error);
  }
};

export const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    return decoded;
  } catch (error) {
    console.error("Error verifying JWT:", error);
  }
};

export const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    return decoded;
  } catch (error) {
    console.error("Error verifying JWT:", error);
  }
};
