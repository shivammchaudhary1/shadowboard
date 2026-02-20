import dotenv from 'dotenv';
import path from 'path';
import chalk from 'chalk';

// Check which environment we're running in (production or stage)
const environment = process.env.NODE_ENV || 'stage';

// Choose the right .env file based on environment
const envFile = environment === 'production' ? '.env.prod' : '.env.stage';
const envPath = path.resolve(process.cwd(), envFile);

// Load environment variables from the selected file
dotenv.config({ path: envPath });

// Create a simple config object with all our environment variables
const config = {
  // Current environment (production or stage)
  environment: environment,

  // Server configuration
  port: parseInt(process.env.PORT) || 8080,

  // Database connection
  mongoUri: process.env.MONGO_URI,

  // JWT settings (handle different variable names between env files)
  jwtSecret: process.env.JWT_SECRET_KEY,
  jwtAccessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '30m',
  jwtRefreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d',
  // Password encryption rounds (handle different variable names)
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUND) || 1,

  // URLs for frontend and backend
  frontendUrl: process.env.FRONTEND_URL,
  backendUrl: process.env.BACKEND_URL,

  //   Nodemailer
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  emailHost: process.env.EMAIL_HOST,
  emailPort: parseInt(process.env.EMAIL_PORT) || 587,
  emailService: process.env.EMAIL_SERVICE || 'Gmail',
  emailSecure: process.env.EMAIL_SECURE === 'true' || false,
  emailFrom: process.env.EMAIL_FROM || 'noreply@shadowboard.com'
};

// Simple log to show which environment is loaded
console.log(chalk.bold.blue(`Loaded environment: ${environment}`));

export default config;
