/**
 * Prompt System
 * 
 * Interactive CLI prompts for the MyExam wizard
 */

const inquirer = require('inquirer');
const chalk = require('chalk');
const { getTemplateDisplayName } = require('../utils/helpers');

/**
 * Main wizard prompt - Choose action
 */
async function promptMainAction() {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: chalk.cyan('What would you like to do?'),
      choices: [
        {
          name: chalk.green('Create New Project'),
          value: 'create',
        },
        {
          name: chalk.blue('Import Framework Into Existing Project'),
          value: 'import',
        },
      ],
      pageSize: 10,
    },
  ]);

  return answer.action;
}

/**
 * Prompt for project name
 */
async function promptProjectName(defaultName = 'my-exam-project') {
  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: chalk.cyan('Project name:'),
      default: defaultName,
      validate: (input) => {
        if (!input) return 'Project name cannot be empty';
        if (input.length > 50) return 'Project name must be 50 characters or less';
        return true;
      },
    },
  ]);

  return answer.projectName;
}

/**
 * Prompt for project directory
 */
async function promptProjectDirectory() {
  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'directory',
      message: chalk.cyan('Project directory:'),
      default: process.cwd(),
      validate: (input) => {
        if (!input) return 'Directory cannot be empty';
        return true;
      },
    },
  ]);

  return answer.directory;
}

/**
 * Prompt for template selection
 */
async function promptTemplateSelection() {
  const templates = [
    { name: 'Rwanda National Exam Practice', value: 'rwanda-exam' },
    { name: 'CBT Examination System', value: 'cbt-system' },
    { name: 'School Management System', value: 'school-management' },
    { name: 'E-commerce Platform', value: 'ecommerce' },
    { name: 'Investment Platform', value: 'investment' },
    { name: 'Order Grabbing Platform', value: 'order-grabbing' },
    { name: 'Hotel Management System', value: 'hotel-management' },
    { name: 'Hospital Management System', value: 'hospital-management' },
  ];

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: chalk.cyan('Which template would you like to use?'),
      choices: templates,
      pageSize: 10,
    },
  ]);

  return answer.template;
}

/**
 * Prompt for database selection
 */
async function promptDatabaseSelection() {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'database',
      message: chalk.cyan('Which database would you like to use?'),
      choices: [
        {
          name: 'MongoDB (NoSQL - Recommended)',
          value: 'mongodb',
        },
        {
          name: 'MySQL (SQL)',
          value: 'mysql',
        },
      ],
      pageSize: 10,
    },
  ]);

  return answer.database;
}

/**
 * Prompt for database credentials
 */
async function promptDatabaseCredentials(database) {
  const prompts = [
    {
      type: 'input',
      name: 'host',
      message: chalk.cyan(`Database host (${database}):`),
      default: database === 'mongodb' ? 'localhost' : 'localhost',
    },
    {
      type: 'input',
      name: 'port',
      message: chalk.cyan('Database port:'),
      default: database === 'mongodb' ? '27017' : '3306',
      validate: (input) => {
        if (!/^\d+$/.test(input)) return 'Port must be a number';
        const port = parseInt(input);
        if (port < 1000 || port > 65535) return 'Port must be between 1000 and 65535';
        return true;
      },
    },
    {
      type: 'input',
      name: 'username',
      message: chalk.cyan('Database username (optional):'),
      default: database === 'mongodb' ? '' : 'root',
    },
  ];

  if (database === 'mongodb') {
    prompts.push({
      type: 'input',
      name: 'database',
      message: chalk.cyan('Database name:'),
      default: 'my-exam',
    });
  } else {
    prompts.push({
      type: 'password',
      name: 'password',
      message: chalk.cyan('Database password (optional):'),
    });
    prompts.push({
      type: 'input',
      name: 'database',
      message: chalk.cyan('Database name:'),
      default: 'my_exam',
    });
  }

  const answers = await inquirer.prompt(prompts);
  return answers;
}

/**
 * Prompt for import mode
 */
async function promptImportMode() {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'mode',
      message: chalk.cyan('Choose import mode:'),
      choices: [
        {
          name: chalk.green('Merge Mode - Keep existing files and add framework'),
          value: 'merge',
        },
        {
          name: chalk.yellow('Replace Mode - Backup and replace with framework'),
          value: 'replace',
        },
      ],
      pageSize: 10,
    },
  ]);

  return answer.mode;
}

/**
 * Prompt for existing project path (import mode)
 */
async function promptExistingProjectPath() {
  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'path',
      message: chalk.cyan('Path to existing project:'),
      default: process.cwd(),
      validate: (input) => {
        if (!input) return 'Project path cannot be empty';
        return true;
      },
    },
  ]);

  return answer.path;
}

/**
 * Prompt to run npm install
 */
async function promptRunInstall() {
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'install',
      message: chalk.cyan('Run npm install now?'),
      default: true,
    },
  ]);

  return answer.install;
}

/**
 * Prompt to start development server
 */
async function promptStartDevServer() {
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'start',
      message: chalk.cyan('Start development server now?'),
      default: false,
    },
  ]);

  return answer.start;
}

/**
 * Prompt to confirm project creation
 */
async function promptConfirmCreation(config) {
  console.log(chalk.gray('\n───── Project Configuration ─────'));
  console.log(`  Template:  ${chalk.yellow(getTemplateDisplayName(config.template))}`);
  console.log(`  Database:  ${chalk.yellow(config.database)}`);
  console.log(`  Directory: ${chalk.yellow(config.projectPath)}`);
  console.log(chalk.gray('──────────────────────────────\n'));

  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'proceed',
      message: chalk.cyan('Proceed with project creation?'),
      default: true,
    },
  ]);

  return answer.proceed;
}

/**
 * Prompt for environment variables
 */
async function promptEnvironmentVariables(_template) {
  const defaults = {
    port: '5000',
    clientPort: '3000',
    jwtSecret: 'your-secret-key-change-in-production',
    nodeEnv: 'development',
  };

  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'port',
      message: chalk.cyan('Backend port:'),
      default: defaults.port,
      validate: (input) => {
        if (!/^\d+$/.test(input)) return 'Port must be a number';
        return true;
      },
    },
    {
      type: 'input',
      name: 'clientPort',
      message: chalk.cyan('Frontend port:'),
      default: defaults.clientPort,
      validate: (input) => {
        if (!/^\d+$/.test(input)) return 'Port must be a number';
        return true;
      },
    },
    {
      type: 'input',
      name: 'jwtSecret',
      message: chalk.cyan('JWT secret (for authentication):'),
      default: defaults.jwtSecret,
    },
  ]);

  return answer;
}

/**
 * Prompt to continue with more options
 */
async function promptContinueSetup() {
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'continue',
      message: chalk.cyan('Continue with additional configuration?'),
      default: false,
    },
  ]);

  return answer.continue;
}

module.exports = {
  promptMainAction,
  promptProjectName,
  promptProjectDirectory,
  promptTemplateSelection,
  promptDatabaseSelection,
  promptDatabaseCredentials,
  promptImportMode,
  promptExistingProjectPath,
  promptRunInstall,
  promptStartDevServer,
  promptConfirmCreation,
  promptEnvironmentVariables,
  promptContinueSetup,
};
