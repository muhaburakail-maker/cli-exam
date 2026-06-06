const ora = require('ora');
const degit = require('degit');
const fs = require('fs-extra');

async function downloadTemplate(templateGithubUrl, destinationPath) {
  const spinner = ora('Downloading template...').start();
  try {
    const urlParts = templateGithubUrl.replace('https://github.com/', '').split('/');
    if (urlParts.length < 2) {
      throw new Error('Invalid GitHub URL format');
    }
    const repo = `${urlParts[0]}/${urlParts[1]}`;
    const deGit = degit(repo, { force: true });
    await deGit.clone(destinationPath);
    spinner.succeed(`Template downloaded to ${destinationPath}`);
    return true;
  } catch (err) {
    spinner.fail('Failed to download template');
    throw new Error(`Template download failed: ${err.message}`);
  }
}

async function copyTemplateToProject(templatePath, projectPath, options = {}) {
  const spinner = ora('Setting up template...').start();
  try {
    await fs.ensureDir(projectPath);
    await fs.copy(templatePath, projectPath, {
      overwrite: options.overwrite || false,
      filter: (src) => !src.includes('node_modules') && !src.includes('.git'),
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
  copyTemplateToProject,
};
