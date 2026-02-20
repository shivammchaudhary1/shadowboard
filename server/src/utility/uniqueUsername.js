import { nanoid } from "nanoid";

// Helper function to generate unique username
export const generateUniqueUsername = async (baseUsername, UserModel) => {
  const username = baseUsername.toLowerCase();

  // First check if the original username is available
  const existingUser = await UserModel.findOne({ username });

  if (!existingUser) {
    // Username is available, return as is
    return username;
  }

  // Username exists, create one with 4-digit suffix
  let uniqueUsername;
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    // Generate 4-digit number using nanoid (only digits)
    const randomSuffix = nanoid(4)
      .replace(/[^0-9]/g, "")
      .padStart(4, "0");
    uniqueUsername = `${username}${randomSuffix}`;

    // Check if this combination is unique
    const duplicateCheck = await UserModel.findOne({
      username: uniqueUsername,
    });

    if (!duplicateCheck) {
      return uniqueUsername;
    }

    attempts++;
  }

  // Fallback: use timestamp if still conflicts after max attempts
  const timestamp = Date.now().toString().slice(-4);
  return `${username}${timestamp}`;
};
