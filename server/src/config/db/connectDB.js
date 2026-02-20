import mongoose from 'mongoose';
import chalk from 'chalk';
import config from '../envs/default.js';

export const connectDB = async () => {
  try {
    // Check if MongoDB URI is configured
    if (!config.mongoUri) {
      throw new Error('MongoDB URI is not configured in environment variables');
    }

    // Connect to MongoDB using config object
    const connect = await mongoose.connect(config.mongoUri);

    console.log(
      chalk.bold.green(`MongoDB Connected: ${connect.connection.host}`)
    );
    console.log(
      chalk.bold.blue(`Environment: ${config.environment.toUpperCase()}`)
    );
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
};
