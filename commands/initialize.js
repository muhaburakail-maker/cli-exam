/**
 * Initialize Command
 * 
 * Main command that orchestrates the entire project creation/import wizard
 */

const {
  promptMainAction,
} = require('../prompts');
const createCommand = require('./create');
const importCommand = require('./import');

async function initializeWizard(projectDir, options) {
  const action = await promptMainAction();
  if (action === 'create') {
    await createCommand(projectDir, options);
  } else if (action === 'import') {
    await importCommand(projectDir, options);
  }
}

module.exports = initializeWizard;
