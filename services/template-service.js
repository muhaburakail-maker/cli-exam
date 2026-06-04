/**
 * Template Service
 * 
 * Handles template downloading, extraction, and management
 */

const ora = require('ora');
const axios = require('axios');
const degit = require('degit');
const fs = require('fs-extra');
const path = require('path');
const { info, success, error, warn } = require('../utils/helpers');

/**
 * Download template from GitHub using degit
 */
async function downloadTemplate(templateGithubUrl, destinationPath) {
  const spinner = ora('Downloading template...').start();

  try {
    // Parse GitHub URL to get owner/repo
    const urlParts = templateGithubUrl.replace('https://github.com/', '').split('/');
    if (urlParts.length < 2) {
      throw new Error('Invalid GitHub URL format');
    }

    const repo = `${urlParts[0]}/${urlParts[1]}`;

    // Use degit to download without git history
    const deGit = degit(repo, { force: true });

    await deGit.clone(destinationPath);

    spinner.succeed(`Template downloaded to ${destinationPath}`);
    return true;
  } catch (err) {
    spinner.fail('Failed to download template');
    throw new Error(`Template download failed: ${err.message}`);
  }
}

/**
 * Extract template files to destination
 */
async function extractTemplate(sourcePath, destinationPath) {
  const spinner = ora('Extracting template files...').start();

  try {
    await fs.copy(sourcePath, destinationPath, {
      overwrite: false,
    });

    spinner.succeed('Template files extracted');
    return true;
  } catch (err) {
    spinner.fail('Failed to extract template');
    throw new Error(`Template extraction failed: ${err.message}`);
  }
}

/**
 * Validate template structure
 */
async function validateTemplate(templatePath) {
  const requiredDirs = ['frontend', 'backend'];
  const requiredFiles = ['package.json', 'README.md'];

  try {
    for (const dir of requiredDirs) {
      const dirPath = path.join(templatePath, dir);
      if (!(await fs.pathExists(dirPath))) {
        warn(`Missing directory: ${dir}`);
      }
    }

    for (const file of requiredFiles) {
      const filePath = path.join(templatePath, file);
      if (!(await fs.pathExists(filePath))) {
        warn(`Missing file: ${file}`);
      }
    }

    success('Template validation completed');
    return true;
  } catch (err) {
    throw new Error(`Template validation failed: ${err.message}`);
  }
}

/**
 * Get template metadata
 */
async function getTemplateMetadata(templatePath) {
  try {
    const packageJsonPath = path.join(templatePath, 'package.json');
    const readmePath = path.join(templatePath, 'README.md');

    const packageJson = await fs.readJSON(packageJsonPath).catch(() => ({}));
    const readme = await fs
      .readFile(readmePath, 'utf-8')
      .catch(() => 'No README provided');

    return {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
      readme,
      packageJson,
    };
  } catch (err) {
    throw new Error(`Failed to read template metadata: ${err.message}`);
  }
}

/**
 * Get template dependencies
 */
async function getTemplateDependencies(templatePath) {
  try {
    const frontendPackageJson = path.join(templatePath, 'frontend', 'package.json');
    const backendPackageJson = path.join(templatePath, 'backend', 'package.json');

    const frontend = await fs
      .readJSON(frontendPackageJson)
      .catch(() => ({ dependencies: {}, devDependencies: {} }));

    const backend = await fs
      .readJSON(backendPackageJson)
      .catch(() => ({ dependencies: {}, devDependencies: {} }));

    return {
      frontend: {
        dependencies: frontend.dependencies || {},
        devDependencies: frontend.devDependencies || {},
      },
      backend: {
        dependencies: backend.dependencies || {},
        devDependencies: backend.devDependencies || {},
      },
    };
  } catch (err) {
    throw new Error(`Failed to read template dependencies: ${err.message}`);
  }
}

/**
 * Update template dependencies
 */
async function updateTemplateDependencies(templatePath, updates) {
  try {
    const frontendPackageJson = path.join(templatePath, 'frontend', 'package.json');
    const backendPackageJson = path.join(templatePath, 'backend', 'package.json');

    if (updates.frontend && (await fs.pathExists(frontendPackageJson))) {
      const current = await fs.readJSON(frontendPackageJson);
      Object.assign(current.dependencies, updates.frontend.dependencies || {});
      Object.assign(
        current.devDependencies,
        updates.frontend.devDependencies || {}
      );
      await fs.writeJSON(frontendPackageJson, current, { spaces: 2 });
    }

    if (updates.backend && (await fs.pathExists(backendPackageJson))) {
      const current = await fs.readJSON(backendPackageJson);
      Object.assign(current.dependencies, updates.backend.dependencies || {});
      Object.assign(
        current.devDependencies,
        updates.backend.devDependencies || {}
      );
      await fs.writeJSON(backendPackageJson, current, { spaces: 2 });
    }

    success('Template dependencies updated');
  } catch (err) {
    throw new Error(`Failed to update dependencies: ${err.message}`);
  }
}

/**
 * List all template files
 */
async function listTemplateFiles(templatePath) {
  try {
    const files = [];

    const walk = async (dir, relative = '') => {
      const entries = await fs.readdir(dir);

      for (const entry of entries) {
        if (entry.startsWith('.')) continue;
        if (entry === 'node_modules') continue;

        const fullPath = path.join(dir, entry);
        const relativePath = path.join(relative, entry);
        const stat = await fs.stat(fullPath);

        if (stat.isDirectory()) {
          await walk(fullPath, relativePath);
        } else {
          files.push(relativePath);
        }
      }
    };

    await walk(templatePath);
    return files;
  } catch (err) {
    throw new Error(`Failed to list template files: ${err.message}`);
  }
}

/**
 * Copy template to project directory
 */
async function copyTemplateToProject(templatePath, projectPath, options = {}) {
  const spinner = ora('Setting up template...').start();

  try {
    // Create project directory if it doesn't exist
    await fs.ensureDir(projectPath);

    // Copy template files
    await fs.copy(templatePath, projectPath, {
      overwrite: options.overwrite || false,
      filter: (src) => {
        // Skip node_modules and .git
        if (src.includes('node_modules') || src.includes('.git')) {
          return false;
        }
        return true;
      },
    });

    spinner.succeed('Template setup completed');
    return true;
  } catch (err) {
    spinner.fail('Failed to setup template');
    throw new Error(`Template setup failed: ${err.message}`);
  }
}

module.exports = {
  downloadTemplate,
  extractTemplate,
  validateTemplate,
  getTemplateMetadata,
  getTemplateDependencies,
  updateTemplateDependencies,
  listTemplateFiles,
  copyTemplateToProject,
};
