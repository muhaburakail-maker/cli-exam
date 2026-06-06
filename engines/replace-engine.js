/**
 * Replace Engine
 * 
 * Handles replacing project structure with template while creating backups
 */

const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');
const { success, warn } = require('../utils/helpers');

/**
 * Create backup of existing project
 */
async function backupProject(projectPath) {
  const spinner = ora('Creating backup...').start();

  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const backupDir = path.join(
      path.dirname(projectPath),
      `${path.basename(projectPath)}-backup-${timestamp}`
    );

    await fs.copy(projectPath, backupDir);

    spinner.succeed(`Backup created at ${backupDir}`);
    return backupDir;
  } catch (err) {
    spinner.fail('Backup creation failed');
    throw new Error(`Failed to create backup: ${err.message}`);
  }
}

/**
 * Replace project with template
 */
async function replaceProject(projectPath, templatePath, options = {}) {
  const spinner = ora('Replacing project structure...').start();

  try {
    // Create backup first
    let backupPath = null;
    if (!options.skipBackup) {
      backupPath = await backupProject(projectPath);
    }

    // Clean project directory (keep only specific files)
    await cleanProjectDirectory(projectPath, options);

    // Copy template files
    await fs.copy(templatePath, projectPath, {
      overwrite: true,
      filter: (src) => {
        // Don't copy node_modules or .git
        if (src.includes('node_modules') || src.includes('.git')) {
          return false;
        }
        return true;
      },
    });

    spinner.succeed('Project replaced with template');

    return {
      success: true,
      backupPath,
      replacedAt: new Date().toISOString(),
    };
  } catch (err) {
    spinner.fail('Project replacement failed');
    throw new Error(`Project replacement failed: ${err.message}`);
  }
}

/**
 * Clean project directory for replacement
 */
async function cleanProjectDirectory(projectPath, options = {}) {
  // Files/directories to keep during replacement
  const keepItems = [
    '.git',
    '.gitignore',
    'node_modules',
    '.env',
    '.env.local',
    '.env.*.local',
    'MERGE_REPORT.md',
    'docs/custom',
    ...(options.keep || []),
  ];

  try {
    const entries = await fs.readdir(projectPath);

    for (const entry of entries) {
      if (keepItems.some((item) => entry.startsWith(item.split('/')[0]))) {
        continue; // Skip this entry
      }

      const fullPath = path.join(projectPath, entry);
      await fs.remove(fullPath);
    }

    success('Project directory cleaned');
  } catch (err) {
    warn(`Failed to clean directory: ${err.message}`);
  }
}

/**
 * Replace specific directories
 */
async function replaceDirectories(
  projectPath,
  templatePath,
  directories = ['frontend', 'backend']
) {
  const spinner = ora('Replacing directories...').start();

  try {
    for (const dir of directories) {
      const projectDirPath = path.join(projectPath, dir);
      const templateDirPath = path.join(templatePath, dir);

      if (await fs.pathExists(templateDirPath)) {
        // Remove existing directory
        if (await fs.pathExists(projectDirPath)) {
          await fs.remove(projectDirPath);
        }

        // Copy template directory
        await fs.copy(templateDirPath, projectDirPath, {
          filter: (src) => !src.includes('node_modules'),
        });

        success(`Replaced ${dir}`);
      }
    }

    spinner.succeed('Directories replaced');
    return true;
  } catch (err) {
    spinner.fail('Directory replacement failed');
    throw new Error(`Failed to replace directories: ${err.message}`);
  }
}

/**
 * Preserve important files during replacement
 */
async function preserveFiles(projectPath, filesToPreserve = []) {
  try {
    const preservedFiles = [];

    for (const file of filesToPreserve) {
      const filePath = path.join(projectPath, file);

      if (await fs.pathExists(filePath)) {
        // Create a temporary backup
        const tempPath = path.join(projectPath, `.preserve_${Date.now()}_${file}`);
        await fs.copy(filePath, tempPath);
        preservedFiles.push({ original: filePath, temp: tempPath });
      }
    }

    return preservedFiles;
  } catch (err) {
    throw new Error(`Failed to preserve files: ${err.message}`);
  }
}

/**
 * Restore preserved files
 */
async function restorePreservedFiles(preservedFiles) {
  try {
    for (const { original, temp } of preservedFiles) {
      if (await fs.pathExists(temp)) {
        await fs.copy(temp, original, { overwrite: true });
        await fs.remove(temp);
      }
    }

    success('Preserved files restored');
  } catch (err) {
    warn(`Failed to restore preserved files: ${err.message}`);
  }
}

/**
 * Generate replacement report
 */
async function generateReplacementReport(projectPath, result) {
  const report = `
# Project Replacement Report

Date: ${result.replacedAt}
Backup Location: ${result.backupPath}

## What Was Done
1. Created backup of your existing project
2. Replaced project structure with template
3. Kept important files (.git, .env, node_modules)

## Next Steps
1. Review the changes
2. Run \`npm install\` to update dependencies
3. Update your .env file with configuration
4. Test the application thoroughly
5. If needed, restore from backup: cp -r ${result.backupPath} <project-dir>

## Original Backup
Your original project has been backed up at:
${result.backupPath}

## Important
- Keep your backup until you're confident with the changes
- Review the code changes before committing
- Test the application in development before production

See docs/REPLACEMENT_REPORT.md for details.
`;

  const reportPath = path.join(projectPath, 'REPLACEMENT_REPORT.md');
  await fs.writeFile(reportPath, report);
  success('Replacement report generated');
}

module.exports = {
  backupProject,
  replaceProject,
  cleanProjectDirectory,
  replaceDirectories,
  preserveFiles,
  restorePreservedFiles,
  generateReplacementReport,
};
