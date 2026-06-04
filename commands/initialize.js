/**
 * Initialize Command
 * 
 * Main command that orchestrates the entire project creation/import wizard
 */

const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const {
  promptMainAction,
  promptProjectName,
  promptTemplateSelection,
  promptDatabaseSelection,
  promptDatabaseCredentials,
  promptImportMode,
  promptExistingProjectPath,
  promptRunInstall,
  promptStartDevServer,
  promptConfirmCreation,
  promptEnvironmentVariables,
} = require('../prompts');
const { sanitizeProjectName, success, info, warn, error } = require('../utils/helpers');
const { validateDirectoryPath, validateProjectName } = require('../utils/validators');
const createCommand = require('./create');
const importCommand = require('./import');

/**
 * Main initialization wizard
 */
async function initializeWizard(projectDir = null, options = {}) {
  try {
    // Step 1: Choose action
    const action = await promptMainAction();

    if (action === 'create') {
      await createCommand(projectDir, options);
    } else if (action === 'import') {
      await importCommand(projectDir, options);
    }
  } catch (err) {
    throw err;
  }
}

module.exports = initializeWizard;
