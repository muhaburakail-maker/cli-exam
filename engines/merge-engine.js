/**
 * Merge Engine
 * 
 * Handles merging framework into existing projects while preserving user code
 */

const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');
const { success, warn, info, deepMerge } = require('../utils/helpers');

/**
 * Merge template into existing project
 */
async function mergeTemplate(projectPath, templatePath, options = {}) {
  const spinner = ora('Merging template into project...').start();

  try {
    // Get list of template files
    const templateFiles = await listFiles(templatePath);

    let mergedFiles = 0;
    let preservedFiles = 0;
    let conflictFiles = [];

    for (const file of templateFiles) {
      const templateFilePath = path.join(templatePath, file);
      const projectFilePath = path.join(projectPath, file);

      const relative = path.relative(templatePath, templateFilePath);
      if (relative.startsWith('..')) continue; // Skip files outside template

      // Skip node_modules and .git
      if (file.includes('node_modules') || file.includes('.git')) continue;

      const fileDir = path.dirname(projectFilePath);
      await fs.ensureDir(fileDir);

      if (await fs.pathExists(projectFilePath)) {
        // File exists in project
        if (shouldMergeFile(file)) {
          // Try to merge
          const merged = await tryMergeFile(projectFilePath, templateFilePath);
          if (merged) {
            mergedFiles++;
          } else {
            conflictFiles.push(file);
          }
        } else {
          // Keep existing file
          preservedFiles++;
        }
      } else {
        // File doesn't exist, copy it
        await fs.copy(templateFilePath, projectFilePath);
        mergedFiles++;
      }
    }

    spinner.succeed(
      `Merged: ${mergedFiles}, Preserved: ${preservedFiles}, Conflicts: ${conflictFiles.length}`
    );

    if (conflictFiles.length > 0) {
      warn('The following files had conflicts and were not merged:');
      conflictFiles.forEach((f) => console.log(`  - ${f}`));
    }

    return {
      success: true,
      mergedFiles,
      preservedFiles,
      conflictFiles,
    };
  } catch (err) {
    spinner.fail('Merge failed');
    throw new Error(`Template merge failed: ${err.message}`);
  }
}

/**
 * Merge dependencies from template package.json
 */
async function mergeDependencies(projectPath, templatePath) {
  const spinner = ora('Merging dependencies...').start();

  try {
    const projectPackageJsonPath = path.join(projectPath, 'package.json');
    const templatePackageJsonPath = path.join(templatePath, 'package.json');

    let projectPackageJson = {};
    let templatePackageJson = {};

    if (await fs.pathExists(projectPackageJsonPath)) {
      projectPackageJson = await fs.readJSON(projectPackageJsonPath);
    }

    if (await fs.pathExists(templatePackageJsonPath)) {
      templatePackageJson = await fs.readJSON(templatePackageJsonPath);
    }

    // Deep merge dependencies
    const mergedPackageJson = deepMerge(projectPackageJson, templatePackageJson);

    await fs.writeJSON(projectPackageJsonPath, mergedPackageJson, { spaces: 2 });

    spinner.succeed('Dependencies merged');
    return true;
  } catch (err) {
    spinner.fail('Dependency merge failed');
    throw new Error(`Dependency merge failed: ${err.message}`);
  }
}

/**
 * Check if file should be merged
 */
function shouldMergeFile(filePath) {
  const mergeableExtensions = ['.json', '.md', '.env', '.env.example'];
  return mergeableExtensions.some((ext) => filePath.endsWith(ext));
}

/**
 * Try to merge file content
 */
async function tryMergeFile(existingPath, newPath) {
  try {
    const ext = path.extname(existingPath);

    if (ext === '.json') {
      const existing = await fs.readJSON(existingPath).catch(() => ({}));
      const newFile = await fs.readJSON(newPath).catch(() => ({}));
      const merged = deepMerge(existing, newFile);
      await fs.writeJSON(existingPath, merged, { spaces: 2 });
      return true;
    } else if (ext === '.md') {
      // For markdown files, append template content
      const existing = await fs.readFile(existingPath, 'utf-8');
      const newContent = await fs.readFile(newPath, 'utf-8');

      // Add template content as a new section
      const merged = existing + '\n\n## Added by Template\n\n' + newContent;
      await fs.writeFile(existingPath, merged);
      return true;
    }

    return false;
  } catch (err) {
    return false;
  }
}

/**
 * List all files in directory
 */
async function listFiles(dirPath) {
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

  await walk(dirPath);
  return files;
}

/**
 * Generate merge report
 */
async function generateMergeReport(projectPath, mergeResult) {
  const report = `
# Merge Report

Date: ${new Date().toISOString()}

## Summary
- Merged Files: ${mergeResult.mergedFiles}
- Preserved Files: ${mergeResult.preservedFiles}
- Conflicts: ${mergeResult.conflictFiles.length}

## Conflict Files
${mergeResult.conflictFiles.map((f) => `- ${f}`).join('\n') || 'None'}

## Next Steps
1. Review all changes
2. Run npm install to update dependencies
3. Test the application
4. Commit changes to git

See docs/MERGE_REPORT.md for details.
`;

  const reportPath = path.join(projectPath, 'MERGE_REPORT.md');
  await fs.writeFile(reportPath, report);
  success('Merge report generated');
}

module.exports = {
  mergeTemplate,
  mergeDependencies,
  shouldMergeFile,
  tryMergeFile,
  listFiles,
  generateMergeReport,
};
