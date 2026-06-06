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
const { success, info, warn, error } = require('../utils/helpers');
const { validateDirectoryPath } = require('../utils/validators');
const { getTemplate, getTemplateGitHubUrl } = require('../marketplace/registry');
const { downloadTemplate } = require('../services/template-service');
const { generateTemplateStructure } = require('../generators/template-generator');
const { mergeTemplate, mergeDependencies, generateMergeReport } = require('../engines/merge-engine');
const { replaceProject, generateReplacementReport } = require('../engines/replace-engine');
const { installAll } = require('../engines/installer-engine');

async function importCommand(projectDir, options = {}) {
  console.log('');
  info('Import MyExam framework into existing project');
  console.log('');

  let projectPath = projectDir;
  if (!projectPath) {
    projectPath = await promptExistingProjectPath();
  }

  const pathValidation = await validateDirectoryPath(projectPath);
  if (!pathValidation.valid) {
    throw new Error(pathValidation.error);
  }

  projectPath = pathValidation.path;

  if (!(await fs.pathExists(path.join(projectPath, 'package.json')))) {
    throw new Error('No package.json found. Is this a valid project directory?');
  }

  let mode = options.mode;
  if (!mode) {
    mode = await promptImportMode();
  }

  let template = options.template;
  if (!template) {
    template = await promptTemplateSelection();
  }

  const templateObj = getTemplate(template);
  if (!templateObj) {
    throw new Error(`Template ${template} not found`);
  }

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

  console.log('');
  info(`Starting import in ${mode} mode...`);
  console.log('');

  if (mode === 'merge') {
    const mergeResult = await mergeTemplate(projectPath, tempDir);
    await mergeDependencies(projectPath, tempDir);
    await generateMergeReport(projectPath, mergeResult);

    success('Framework merged into project');
    console.log('');
    info(`Merged: ${mergeResult.mergedFiles}, Preserved: ${mergeResult.preservedFiles}`);

    if (mergeResult.conflictFiles.length > 0) {
      warn(`${mergeResult.conflictFiles.length} files had conflicts and were not merged`);
    }
  } else if (mode === 'replace') {
    const replaceResult = await replaceProject(projectPath, tempDir);
    await generateReplacementReport(projectPath, replaceResult);

    success('Project structure replaced with framework');
    console.log('');
    info(`Backup created: ${replaceResult.backupPath}`);
  }

  await fs.remove(tempDir);

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

  console.log('');
  console.log(chalk.green('╔════════════════════════════════════════════════════════════╗'));
  console.log(chalk.green('║                                                            ║'));
  console.log(chalk.green('║            ✓ Framework Imported Successfully! ✓            ║'));
  console.log(chalk.green('║                                                            ║'));
  console.log(chalk.green('╚════════════════════════════════════════════════════════════╝'));
  console.log('');
  console.log(chalk.cyan('Next steps:'));
  console.log(`  1. Review the import report: ${mode === 'merge' ? 'MERGE_REPORT.md' : 'REPLACEMENT_REPORT.md'}`);
  console.log('  2. Check for any conflicts or issues');
  console.log('  3. Test your application: npm run dev');
  if (mode === 'replace') {
    console.log('  4. Your original project is backed up at: backup/');
  }
  console.log('');
  console.log(chalk.yellow('Happy coding! 🚀'));
  console.log('');
}

module.exports = importCommand;
