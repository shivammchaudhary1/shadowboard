import requestIp from "request-ip";

/**
 * Extract the client's IP address from the request object
 * @param {Object} req - Express request object
 * @returns {string} - Client IP address
 */
export const extractIpAddress = (req) => {
  try {
    // requestIp.getClientIp() handles all the common IP headers and fallbacks
    const clientIp = requestIp.getClientIp(req);

    // Handle IPv6 mapped IPv4 addresses (::ffff:192.168.1.1 -> 192.168.1.1)
    if (clientIp && clientIp.includes("::ffff:")) {
      return clientIp.replace("::ffff:", "");
    }

    // Return the IP or fallback to 'unknown' if null/undefined
    return clientIp || "unknown";
  } catch (error) {
    console.error("Error extracting IP address:", error);
    return "unknown";
  }
};

/**
 * Extract user agent from the request headers
 * @param {Object} req - Express request object
 * @returns {string} - User agent string
 */
export const extractUserAgent = (req) => {
  try {
    return req.headers["user-agent"] || "unknown";
  } catch (error) {
    console.error("Error extracting user agent:", error);
    return "unknown";
  }
};

/**
 * Create a log entry object with IP and user agent
 * @param {Object} req - Express request object
 * @returns {Object} - Log entry object with timestamp, ipAddress, and userAgent
 */
export const createLogEntry = (req) => {
  return {
    timestamp: new Date(),
    ipAddress: extractIpAddress(req),
    userAgent: extractUserAgent(req),
  };
};
