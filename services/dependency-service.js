/**
 * Dependency Service
 * 
 * Handles installation and management of project dependencies
 */

const { exec } = require('child_process');
const ora = require('ora');
const path = require('path');
const fs = require('fs-extra');
const { success } = require('../utils/helpers');

/**
 * Check if npm or yarn is installed
 */
async function checkPackageManager() {
  return new Promise((resolve) => {
    exec('npm --version', (err) => {
      resolve(!err ? 'npm' : null);
    });
  });
}

/**
 * Install dependencies in a directory
 */
function installDependencies(workingDir, packageManager = 'npm', verbose = false) {
  return new Promise((resolve, reject) => {
    const spinner = ora(`Installing dependencies with ${packageManager}...`).start();

    const command = packageManager === 'yarn' ? 'yarn install' : 'npm install';
    const options = {
      cwd: workingDir,
      stdio: verbose ? 'inherit' : 'pipe',
    };

    exec(command, options, (err, _stdout, _stderr) => {
      if (err) {
        spinner.fail('Failed to install dependencies');
        reject(new Error(`npm install failed: ${err.message}`));
        return;
      }

      spinner.succeed('Dependencies installed successfully');
      resolve(true);
    });
  });
}

/**
 * Install specific package
 */
function installPackage(workingDir, packageName, isDev = false, packageManager = 'npm') {
  return new Promise((resolve, reject) => {
    const spinner = ora(`Installing ${packageName}...`).start();

    const command =
      packageManager === 'yarn'
        ? `yarn add ${isDev ? '--dev ' : ''}${packageName}`
        : `npm install ${isDev ? '--save-dev' : '--save'} ${packageName}`;

    const options = { cwd: workingDir };

    exec(command, options, (err) => {
      if (err) {
        spinner.fail(`Failed to install ${packageName}`);
        reject(new Error(`Package installation failed: ${err.message}`));
        return;
      }

      spinner.succeed(`${packageName} installed`);
      resolve(true);
    });
  });
}

/**
 * Uninstall package
 */
function uninstallPackage(workingDir, packageName, packageManager = 'npm') {
  return new Promise((resolve, reject) => {
    const spinner = ora(`Uninstalling ${packageName}...`).start();

    const command = packageManager === 'yarn' ? `yarn remove ${packageName}` : `npm uninstall ${packageName}`;

    exec(command, { cwd: workingDir }, (err) => {
      if (err) {
        spinner.fail(`Failed to uninstall ${packageName}`);
        reject(err);
        return;
      }

      spinner.succeed(`${packageName} uninstalled`);
      resolve(true);
    });
  });
}

/**
 * Get frontend dependencies for template
 */
function getFrontendDependencies() {
  return {
    react: '^18.2.0',
    'react-dom': '^18.2.0',
    'react-router-dom': '^6.11.0',
    axios: '^1.4.0',
    'tailwindcss': '^3.3.0',
    'vite': '^4.3.0',
  };
}

/**
 * Get backend dependencies for template
 */
function getBackendDependencies() {
  return {
    express: '^4.18.2',
    'express-cors': '^1.0.6',
    'jsonwebtoken': '^9.0.0',
    'bcryptjs': '^2.4.3',
    'dotenv': '^16.0.3',
    'mongoose': '^7.1.0',
    'mysql2': '^3.3.0',
    'joi': '^17.9.2',
  };
}

/**
 * Get development dependencies
 */
function getDevDependencies() {
  return {
    'nodemon': '^2.0.22',
    'eslint': '^8.40.0',
    'prettier': '^2.8.8',
    'jest': '^29.5.0',
  };
}

/**
 * Verify package.json exists
 */
async function verifyPackageJson(workingDir) {
  const packageJsonPath = path.join(workingDir, 'package.json');
  return await fs.pathExists(packageJsonPath);
}

/**
 * Get installed packages
 */
async function getInstalledPackages(workingDir) {
  return new Promise((resolve, reject) => {
    const command = 'npm list --depth=0 --json';
    exec(command, { cwd: workingDir }, (err, stdout) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const data = JSON.parse(stdout);
        resolve(data.dependencies || {});
      } catch (parseErr) {
        reject(parseErr);
      }
    });
  });
}

/**
 * Check if specific package is installed
 */
async function isPackageInstalled(workingDir, packageName) {
  try {
    const packages = await getInstalledPackages(workingDir);
    return packageName in packages;
  } catch {
    return false;
  }
}

/**
 * Install all project dependencies (frontend and backend)
 */
async function installAllDependencies(projectPath, packageManager = 'npm', verbose = false) {
  const frontendPath = path.join(projectPath, 'frontend');
  const backendPath = path.join(projectPath, 'backend');

  if (await fs.pathExists(path.join(frontendPath, 'package.json'))) {
    await installDependencies(frontendPath, packageManager, verbose);
  }

  if (await fs.pathExists(path.join(backendPath, 'package.json'))) {
    await installDependencies(backendPath, packageManager, verbose);
  }

  success('All dependencies installed successfully');
  return true;
}

/**
 * Update package.json with custom dependencies
 */
async function updatePackageJsonDependencies(packageJsonPath, dependencies, isDev = false) {
  try {
    const pkgJson = await fs.readJSON(packageJsonPath);

    const key = isDev ? 'devDependencies' : 'dependencies';
    if (!pkgJson[key]) {
      pkgJson[key] = {};
    }

    Object.assign(pkgJson[key], dependencies);

    await fs.writeJSON(packageJsonPath, pkgJson, { spaces: 2 });
    success(`Updated ${key} in package.json`);
  } catch (err) {
    throw new Error(`Failed to update package.json: ${err.message}`);
  }
}

/**
 * Generate package.json for project
 */
async function generatePackageJson(projectPath, projectName, template, database) {
  try {
    const packageJson = {
      name: projectName.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      description: `MyExam project using ${template} template with ${database} database`,
      main: 'backend/index.js',
      scripts: {
        'dev': 'concurrently "npm run dev:frontend" "npm run dev:backend"',
        'dev:frontend': 'cd frontend && npm run dev',
        'dev:backend': 'cd backend && npm run dev',
        'build': 'concurrently "npm run build:frontend" "npm run build:backend"',
        'build:frontend': 'cd frontend && npm run build',
        'build:backend': 'echo "Backend is ready for production"',
        'start': 'node backend/dist/index.js',
        'test': 'jest',
        'test:frontend': 'cd frontend && npm run test',
        'test:backend': 'cd backend && npm run test',
        'lint': 'eslint .',
        'format': 'prettier --write "**/*.{js,jsx,ts,tsx,json,md}"',
      },
      keywords: ['exam', 'education', 'myexam', template, database],
      author: 'MyExam',
      license: 'MIT',
      devDependencies: {
        'concurrently': '^8.0.1',
      },
    };

    const packageJsonPath = path.join(projectPath, 'package.json');
    await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });
    success('Generated root package.json');
  } catch (err) {
    throw new Error(`Failed to generate package.json: ${err.message}`);
  }
}

module.exports = {
  checkPackageManager,
  installDependencies,
  installPackage,
  uninstallPackage,
  getFrontendDependencies,
  getBackendDependencies,
  getDevDependencies,
  verifyPackageJson,
  getInstalledPackages,
  isPackageInstalled,
  installAllDependencies,
  updatePackageJsonDependencies,
  generatePackageJson,
};
