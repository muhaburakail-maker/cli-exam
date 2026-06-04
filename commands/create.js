/**
 * Create Command
 * 
 * Handles creating new projects from templates
 */

const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const ora = require('ora');
const {
  promptProjectName,
  promptTemplateSelection,
  promptDatabaseSelection,
  promptDatabaseCredentials,
  promptRunInstall,
  promptStartDevServer,
  promptConfirmCreation,
  promptEnvironmentVariables,
} = require('../prompts');
const { sanitizeProjectName, success, info, warn, error } = require('../utils/helpers');
const { validateDirectoryPath, validateProjectName } = require('../utils/validators');
const { getTemplate, getTemplateGitHubUrl } = require('../marketplace/registry');
const { downloadTemplate, copyTemplateToProject, validateTemplate } = require('../services/template-service');
const { generateTemplateStructure } = require('../generators/template-generator');
const { createEnvFile, writeSchemaDocumentation } = require('../services/database-service');
const { installAll, generateInstallationReport } = require('../engines/installer-engine');
const { generatePackageJson } = require('../services/dependency-service');

/**
 * Create new project command
 */
async function createCommand(projectDir, options = {}) {
  try {
    console.log('');
    info('Let\'s create your new MyExam project!');
    console.log('');

    // Step 1: Get project name
    let projectName = options.projectName;
    if (!projectName) {
      projectName = await promptProjectName('my-exam-project');
    }

    const projectNameValidation = validateProjectName(projectName);
    if (!projectNameValidation.valid) {
      throw new Error(projectNameValidation.error);
    }

    const sanitized = sanitizeProjectName(projectName);

    // Step 2: Determine project path
    let projectPath = projectDir;
    if (!projectPath) {
      projectPath = path.join(process.cwd(), sanitized);
    } else {
      projectPath = path.join(projectPath, sanitized);
    }

    const pathValidation = await validateDirectoryPath(projectPath);
    if (!pathValidation.valid) {
      throw new Error(pathValidation.error);
    }

    projectPath = pathValidation.path;

    // Check if directory exists and is not empty
    if (await fs.pathExists(projectPath)) {
      const files = await fs.readdir(projectPath);
      if (files.length > 0 && !options.force) {
        throw new Error(
          `Directory ${projectPath} already exists and is not empty. Use --force to overwrite.`
        );
      }
    }

    // Step 3: Select template
    let template = options.template;
    if (!template) {
      template = await promptTemplateSelection();
    }

    const templateObj = getTemplate(template);
    if (!templateObj) {
      throw new Error(`Template ${template} not found`);
    }

    // Step 4: Select database
    let database = options.database;
    if (!database) {
      database = await promptDatabaseSelection();
    }

    // Step 5: Database credentials
    let credentials = {};
    if (!options.skipDbConfig) {
      credentials = await promptDatabaseCredentials(database);
    }

    // Step 6: Environment variables
    let envVars = {};
    if (!options.skipEnvConfig) {
      envVars = await promptEnvironmentVariables(template);
    }

    // Step 7: Confirmation
    const config = {
      projectName,
      projectPath,
      template,
      database,
      credentials,
      envVars,
    };

    const proceed = await promptConfirmCreation(config);
    if (!proceed) {
      warn('Project creation cancelled');
      return;
    }

    // Step 8: Download and setup template
    console.log('');
    info('Setting up project...');
    console.log('');

    // Create project directory
    await fs.ensureDir(projectPath);
    success(`Created project directory at ${projectPath}`);

    // Download template from GitHub
    const githubUrl = getTemplateGitHubUrl(templateObj);
    const tempDir = path.join(projectPath, '.temp-template');

    try {
      await downloadTemplate(githubUrl, tempDir);
      await copyTemplateToProject(tempDir, projectPath);
      await fs.remove(tempDir);
    } catch (downloadErr) {
      warn(`Could not download template from GitHub: ${downloadErr.message}`);
      info('Using local template structure instead');
      await fs.remove(tempDir).catch(() => null);
      await generateTemplateStructure(projectPath, template, database);
    }

    // Create root package.json
    await generatePackageJson(projectPath, sanitized, template, database);

    // Create environment files
    await createEnvFile(projectPath, database, credentials, {
      port: envVars.port,
      clientPort: envVars.clientPort,
      jwtSecret: envVars.jwtSecret,
    });

    // Generate schema documentation
    await writeSchemaDocumentation(projectPath, database);

    success('Project setup completed');

    // Step 9: Install dependencies
    console.log('');
    if (!options.skipInstall) {
      const installDeps = await promptRunInstall();

      if (installDeps) {
        try {
          await installAll(projectPath, { verbose: options.verbose });
          success('All dependencies installed');
        } catch (installErr) {
          error(`Failed to install dependencies: ${installErr.message}`);
          warn('You can run "npm install" manually later');
        }
      }
    }

    // Generate installation report
    await generateInstallationReport(projectPath, config);

    // Step 10: Start dev server
    console.log('');
    let startServer = false;
    if (!options.skipAuto) {
      startServer = await promptStartDevServer();
    }

    if (startServer && !options.skipDevServer) {
      try {
        // Note: In production, you might want to handle this differently
        info('Open two terminal windows and run:');
        console.log(chalk.cyan(`  cd ${projectPath}/frontend && npm run dev`));
        console.log(chalk.cyan(`  cd ${projectPath}/backend && npm run dev`));
      } catch (err) {
        warn(`Could not start dev server: ${err.message}`);
      }
    }

    // Summary
    console.log('');
    console.log(chalk.green('╔════════════════════════════════════════════════════════════╗'));
    console.log(chalk.green('║                                                            ║'));
    console.log(chalk.green('║             ✓ Project Created Successfully! ✓              ║'));
    console.log(chalk.green('║                                                            ║'));
    console.log(chalk.green('╚════════════════════════════════════════════════════════════╝'));
    console.log('');
    console.log(chalk.cyan('Next steps:'));
    console.log(`  1. cd ${sanitized}`);
    console.log(`  2. Read INSTALLATION_REPORT.md for details`);
    console.log(`  3. Update .env with your configuration`);
    console.log(`  4. npm run dev (in separate terminals for frontend and backend)`);
    console.log('');
    console.log(chalk.yellow('Happy coding! 🚀'));
    console.log('');
  } catch (err) {
    throw err;
  }
}

module.exports = createCommand;
