import { connectDB } from "../db/connectDB.js";
import { configureExpress } from "./express.js";
import config from "../envs/default.js";
import chalk from "chalk";

export const setupServer = async () => {
  try {
    // Initialize database connection
    console.log(chalk.yellow("🔄 Connecting to database..."));
    await connectDB();

    // Configure Express app
    console.log(chalk.yellow("🔄 Setting up Express application..."));
    const app = configureExpress();

    // Start server
    const server = app.listen(config.port, () => {
      console.log(
        chalk.bold.green(
          `🚀 Server running in ${config.environment.toUpperCase()} mode on port ${config.port}`
        )
      );
      console.log(chalk.bold.cyan(`🌐 Backend URL: ${config.backendUrl}`));
      console.log(chalk.bold.cyan(`🎨 Frontend URL: ${config.frontendUrl}`));
      console.log(chalk.bold.magenta("✅ Shadow Board API is ready!"));
    });

    // Handle server errors
    server.on("error", (error) => {
      console.error(chalk.red(`❌ Server error: ${error.message}`));
      process.exit(1);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log(
        chalk.yellow("🔄 Received SIGTERM, shutting down gracefully...")
      );
      server.close(() => {
        console.log(chalk.green("✅ Process terminated"));
        process.exit(0);
      });
    });

    return server;
  } catch (error) {
    console.error(chalk.red(`❌ Failed to start server: ${error.message}`));
    process.exit(1);
  }
};
