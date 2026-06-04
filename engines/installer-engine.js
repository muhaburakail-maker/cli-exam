/**
 * Installer Engine
 * 
 * Orchestrates the installation and setup of projects
 */

const { exec } = require('child_process');
const ora = require('ora');
const path = require('path');
const fs = require('fs-extra');
const { success, info, error, warn } = require('../utils/helpers');

/**
 * Run npm install in directory
 */
async function runNpmInstall(workingDir, verbose = false) {
  return new Promise((resolve, reject) => {
    const spinner = ora('Running npm install...').start();
    
    const command = 'npm install';
    const options = {
      cwd: workingDir,
      stdio: verbose ? 'inherit' : 'pipe',
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    };

    const child = exec(command, options, (err, stdout, stderr) => {
      if (err) {
        spinner.fail('npm install failed');
        reject(new Error(`npm install error: ${err.message}`));
        return;
      }

      spinner.succeed('Dependencies installed');
      resolve(true);
    });

    // Handle timeout
    const timeout = setTimeout(() => {
      child.kill();
      spinner.fail('npm install timed out');
      reject(new Error('npm install took too long'));
    }, 5 * 60 * 1000); // 5 minute timeout

    child.on('exit', () => clearTimeout(timeout));
  });
}

/**
 * Run development server
 */
async function runDevServer(workingDir, command = 'npm run dev', port = null) {
  return new Promise((resolve, reject) => {
    const spinner = ora(`Starting development server...`).start();

    const finalCommand = port ? command.replace('dev', `dev -- --port ${port}`) : command;

    const child = exec(finalCommand, { cwd: workingDir, stdio: 'inherit' }, (err) => {
      if (err) {
        spinner.fail('Failed to start dev server');
        reject(err);
      }
    });

    // Give the server a moment to start
    setTimeout(() => {
      spinner.succeed('Development server started');
      resolve(child);
    }, 2000);
  });
}

/**
 * Install and setup frontend
 */
async function installFrontend(projectPath, verbose = false) {
  const frontendPath = path.join(projectPath, 'frontend');

  if (!(await fs.pathExists(path.join(frontendPath, 'package.json')))) {
    warn('Frontend package.json not found, skipping frontend installation');
    return false;
  }

  try {
    info('Installing frontend dependencies...');
    await runNpmInstall(frontendPath, verbose);
    success('Frontend installed');
    return true;
  } catch (err) {
    error(`Frontend installation failed: ${err.message}`);
    throw err;
  }
}

/**
 * Install and setup backend
 */
async function installBackend(projectPath, verbose = false) {
  const backendPath = path.join(projectPath, 'backend');

  if (!(await fs.pathExists(path.join(backendPath, 'package.json')))) {
    warn('Backend package.json not found, skipping backend installation');
    return false;
  }

  try {
    info('Installing backend dependencies...');
    await runNpmInstall(backendPath, verbose);
    success('Backend installed');
    return true;
  } catch (err) {
    error(`Backend installation failed: ${err.message}`);
    throw err;
  }
}

/**
 * Install all project dependencies
 */
async function installAll(projectPath, options = {}) {
  const verbose = options.verbose || false;

  try {
    const results = {
      frontend: false,
      backend: false,
    };

    // Check if root package.json exists
    const rootPackageJsonPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(rootPackageJsonPath)) {
      info('Installing root dependencies...');
      try {
        await runNpmInstall(projectPath, verbose);
        success('Root dependencies installed');
      } catch (err) {
        warn(`Root installation warning: ${err.message}`);
      }
    }

    // Install frontend
    try {
      results.frontend = await installFrontend(projectPath, verbose);
    } catch (err) {
      if (!options.continueOnError) throw err;
      warn(`Frontend installation failed, continuing: ${err.message}`);
    }

    // Install backend
    try {
      results.backend = await installBackend(projectPath, verbose);
    } catch (err) {
      if (!options.continueOnError) throw err;
      warn(`Backend installation failed, continuing: ${err.message}`);
    }

    return results;
  } catch (err) {
    throw new Error(`Installation failed: ${err.message}`);
  }
}

/**
 * Start development environment
 */
async function startDevelopment(projectPath, options = {}) {
  try {
    const frontendPath = path.join(projectPath, 'frontend');
    const backendPath = path.join(projectPath, 'backend');

    const servers = [];

    // Start backend if exists
    if (
      await fs.pathExists(backendPath) &&
      (await fs.pathExists(path.join(backendPath, 'package.json')))
    ) {
      info('Starting backend development server...');
      try {
        const backendServer = await runDevServer(backendPath, 'npm run dev', options.backendPort);
        servers.push({ name: 'backend', process: backendServer });
      } catch (err) {
        warn(`Failed to start backend: ${err.message}`);
      }
    }

    // Start frontend if exists
    if (
      await fs.pathExists(frontendPath) &&
      (await fs.pathExists(path.join(frontendPath, 'package.json')))
    ) {
      info('Starting frontend development server...');
      try {
        const frontendServer = await runDevServer(frontendPath, 'npm run dev', options.frontendPort);
        servers.push({ name: 'frontend', process: frontendServer });
      } catch (err) {
        warn(`Failed to start frontend: ${err.message}`);
      }
    }

    success('Development servers started');
    return servers;
  } catch (err) {
    throw new Error(`Failed to start development: ${err.message}`);
  }
}

/**
 * Stop development servers
 */
function stopServers(servers) {
  servers.forEach((server) => {
    if (server.process) {
      server.process.kill();
    }
  });
  success('Development servers stopped');
}

/**
 * Generate installation report
 */
async function generateInstallationReport(projectPath, config) {
  try {
    const report = `
# Installation Report

Date: ${new Date().toISOString()}
Project: ${config.projectName}
Template: ${config.template}
Database: ${config.database}

## Installation Status
- ✓ Project Created
- ✓ Dependencies Installed
- ✓ Configuration Generated

## Project Structure
\`\`\`
${config.projectPath}
├── frontend/          # React + Vite + TailwindCSS
├── backend/           # Express + Node.js
├── docs/              # Documentation
├── .env               # Environment Configuration
└── package.json       # Root Package Configuration
\`\`\`

## Quick Start

### Development Mode
\`\`\`bash
cd ${config.projectPath}
npm run dev
\`\`\`

### Build for Production
\`\`\`bash
npm run build
\`\`\`

### Run Tests
\`\`\`bash
npm run test
\`\`\`

## Environment Configuration
The following environment file has been created:
- \`.env\` - Development configuration

**Important:** Update the .env file with your actual database credentials and API keys before deployment.

## Database Setup
Database Type: ${config.database}

### For MongoDB:
\`\`\`bash
# Install MongoDB locally or use MongoDB Atlas
# Update DB_URI in .env file
\`\`\`

### For MySQL:
\`\`\`bash
# Create database:
# CREATE DATABASE ${config.database};
# Update DB_HOST, DB_USER, DB_PASS in .env file
\`\`\`

## Next Steps
1. Navigate to project: \`cd ${config.projectPath}\`
2. Review environment variables: \`cat .env\`
3. Update database credentials if needed
4. Start development: \`npm run dev\`
5. Open browser to http://localhost:3000

## Documentation
- See \`docs/README.md\` for architecture overview
- See \`docs/schema.md\` for database schema
- See \`backend/README.md\` for API documentation

## Support
For issues and questions:
1. Check the docs/ folder
2. Review template README.md
3. See troubleshooting guide

Happy coding! 🚀
`;

    const reportPath = path.join(projectPath, 'INSTALLATION_REPORT.md');
    await fs.writeFile(reportPath, report);
    success('Installation report generated');
  } catch (err) {
    warn(`Failed to generate report: ${err.message}`);
  }
}

module.exports = {
  runNpmInstall,
  runDevServer,
  installFrontend,
  installBackend,
  installAll,
  startDevelopment,
  stopServers,
  generateInstallationReport,
};
