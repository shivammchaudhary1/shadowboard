import { setupServer } from './src/config/setup/setup.js';
import chalk from 'chalk';

// Start the server
console.log(chalk.bold.blue('🎯 Starting Shadow Board Server...'));
console.log(chalk.gray('=' * 50));

setupServer().catch((error) => {
  console.error(chalk.red(`❌ Failed to initialize server: ${error.message}`));
  process.exit(1);
});
