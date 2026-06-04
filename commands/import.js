/**
 * Import Command
 * 
 * Handles importing framework into existing projects
 */

const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const {
  promptExistingProjectPath,
  promptImportMode,
  promptTemplateSelection,
  promptRunInstall,
} = require('../prompts');
const { sanitizeProjectName, success, info, warn, error } = require('../utils/helpers');
const { validateDirectoryPath } = require('../utils/validators');
const { getTemplate, getTemplateGitHubUrl } = require('../marketplace/registry');
const { downloadTemplate } = require('../services/template-service');
const { generateTemplateStructure } = require('../generators/template-generator');
const { mergeTemplate, mergeDependencies, generateMergeReport } = require('../engines/merge-engine');
const { replaceProject, generateReplacementReport } = require('../engines/replace-engine');
const { installAll } = require('../engines/installer-engine');

/**
 * Import command for existing projects
 */
async function importCommand(projectDir, options = {}) {
  try {
    console.log('');
    info('Import MyExam framework into existing project');
    console.log('');

    // Step 1: Get existing project path
    let projectPath = projectDir;
    if (!projectPath) {
      projectPath = await promptExistingProjectPath();
    }

    const pathValidation = await validateDirectoryPath(projectPath);
    if (!pathValidation.valid) {
      throw new Error(pathValidation.error);
    }

    projectPath = pathValidation.path;

    // Verify it's a valid project directory
    if (!(await fs.pathExists(path.join(projectPath, 'package.json')))) {
      throw new Error('No package.json found. Is this a valid project directory?');
    }

    // Step 2: Choose import mode
    let mode = options.mode;
    if (!mode) {
      mode = await promptImportMode();
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

    // Step 4: Download template
    console.log('');
    info('Preparing template...');

    const githubUrl = getTemplateGitHubUrl(templateObj);
    const tempDir = path.join(projectPath, '.temp-template-import');

    try {
      await downloadTemplate(githubUrl, tempDir);
    } catch (downloadErr) {
      warn(`Could not download template: ${downloadErr.message}`);
      info('Falling back to generated local template structure');
      await fs.remove(tempDir).catch(() => null);
      await generateTemplateStructure(tempDir, template, 'mongodb');
    }

    // Step 5: Execute import based on mode
    console.log('');
    info(`Starting import in ${mode} mode...`);
    console.log('');

    let result;
    if (mode === 'merge') {
      // Merge mode: keep existing files
      const mergeResult = await mergeTemplate(projectPath, tempDir);
      await mergeDependencies(projectPath, tempDir);
      await generateMergeReport(projectPath, mergeResult);

      result = {
        mode: 'merge',
        ...mergeResult,
      };

      success('Framework merged into project');
      console.log('');
      info(`Merged: ${mergeResult.mergedFiles}, Preserved: ${mergeResult.preservedFiles}`);

      if (mergeResult.conflictFiles.length > 0) {
        warn(`${mergeResult.conflictFiles.length} files had conflicts and were not merged`);
      }
    } else if (mode === 'replace') {
      // Replace mode: backup and replace
      const replaceResult = await replaceProject(projectPath, tempDir);
      await generateReplacementReport(projectPath, replaceResult);

      result = {
        mode: 'replace',
        ...replaceResult,
      };

      success('Project structure replaced with framework');
      console.log('');
      info(`Backup created: ${replaceResult.backupPath}`);
    }

    // Clean up temp directory
    await fs.remove(tempDir);

    // Step 6: Install dependencies
    console.log('');
    if (!options.skipInstall) {
      const installDeps = await promptRunInstall();

      if (installDeps) {
        try {
          await installAll(projectPath, { verbose: options.verbose });
          success('Dependencies installed');
        } catch (installErr) {
          error(`Failed to install dependencies: ${installErr.message}`);
          warn('You can run "npm install" manually later');
        }
      }
    }

    // Summary
    console.log('');
    console.log(chalk.green('╔════════════════════════════════════════════════════════════╗'));
    console.log(chalk.green('║                                                            ║'));
    console.log(chalk.green('║            ✓ Framework Imported Successfully! ✓            ║'));
    console.log(chalk.green('║                                                            ║'));
    console.log(chalk.green('╚════════════════════════════════════════════════════════════╝'));
    console.log('');
    console.log(chalk.cyan('Next steps:'));
    console.log(`  1. Review the import report: ${mode === 'merge' ? 'MERGE_REPORT.md' : 'REPLACEMENT_REPORT.md'}`);
    console.log(`  2. Check for any conflicts or issues`);
    console.log(`  3. Test your application: npm run dev`);
    if (mode === 'replace') {
      console.log(`  4. Your original project is backed up at: backup/`);
    }
    console.log('');
    console.log(chalk.yellow('Happy coding! 🚀'));
    console.log('');
  } catch (err) {
    throw err;
  }
}

module.exports = importCommand;
