#!/usr/bin/env node

/**
 * MyExam CLI Entry Point
 * 
 * This is the main entry point for the create-my-exam CLI tool.
 * It initializes the CLI and routes to the appropriate commands.
 */

const { program } = require('commander');
const chalk = require('chalk');
const path = require('path');
const { version } = require('../package.json');
const { showBanner, handleError } = require('../utils/helpers');
const initializeWizard = require('../commands/initialize');

// Display banner
showBanner();

// Create CLI program
program
  .name('create-my-exam')
  .description(chalk.cyan('Production-ready framework for creating complete applications'))
  .version(version, '-v, --version', 'Display version number')
  .usage('[options] [project-directory]');

// Main create command
program
  .command('[project-directory]', { isDefault: true })
  .description(chalk.green('Create a new project or import into existing one'))
  .option('-t, --template <template>', 'Specify template directly')
  .option('-d, --database <database>', 'Specify database (mongodb or mysql)')
  .option('-f, --force', 'Overwrite existing directory')
  .option('--skip-install', 'Skip npm install')
  .option('--skip-git', 'Skip git initialization')
  .action((projectDir, options, command) => {
    if (projectDir && typeof projectDir === 'object' && !Array.isArray(projectDir)) {
      options = projectDir;
      projectDir = undefined;
    }

    (async () => {
      try {
        await initializeWizard(projectDir, options);
      } catch (error) {
        handleError(error);
        process.exit(1);
      }
    })();
  });

// Show help by default
if (process.argv.length < 3) {
  program.outputHelp();
}

// Parse command line arguments
program.parse(process.argv);

// Handle unrecognized commands
process.on('unhandledRejection', (error) => {
  handleError(error);
  process.exit(1);
});
