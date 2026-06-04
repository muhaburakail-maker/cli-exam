/**
 * Validators
 * 
 * Input validation functions for CLI parameters
 */

const path = require('path');
const fs = require('fs-extra');

/**
 * Validate project name
 */
function validateProjectName(name) {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Project name must be a string' };
  }

  if (name.length > 50) {
    return { valid: false, error: 'Project name must be 50 characters or less' };
  }

  if (!/^[a-z0-9-]+$/.test(name.toLowerCase().replace(/\s+/g, '-'))) {
    return {
      valid: false,
      error: 'Project name can only contain letters, numbers, and hyphens',
    };
  }

  return { valid: true };
}

/**
 * Validate directory path
 */
async function validateDirectoryPath(dirPath) {
  try {
    const absolutePath = path.resolve(dirPath);
    const exists = await fs.pathExists(absolutePath);
    
    if (exists) {
      const stat = await fs.stat(absolutePath);
      if (!stat.isDirectory()) {
        return { valid: false, error: 'Path exists but is not a directory' };
      }
    }

    return { valid: true, path: absolutePath };
  } catch (error) {
    return { valid: false, error: `Invalid path: ${error.message}` };
  }
}

/**
 * Validate database selection
 */
function validateDatabase(database) {
  const validDatabases = ['mongodb', 'mysql'];
  
  if (!validDatabases.includes(database.toLowerCase())) {
    return {
      valid: false,
      error: `Database must be one of: ${validDatabases.join(', ')}`,
    };
  }

  return { valid: true, database: database.toLowerCase() };
}

/**
 * Validate template ID
 */
async function validateTemplate(templateId) {
  const validTemplates = [
    'rwanda-exam',
    'cbt-system',
    'school-management',
    'ecommerce',
    'investment',
    'order-grabbing',
    'hotel-management',
    'hospital-management',
  ];

  if (!validTemplates.includes(templateId.toLowerCase())) {
    return {
      valid: false,
      error: `Template must be one of: ${validTemplates.join(', ')}`,
    };
  }

  return { valid: true, template: templateId.toLowerCase() };
}

/**
 * Validate merge mode
 */
function validateMergeMode(mode) {
  const validModes = ['merge', 'replace'];
  
  if (!validModes.includes(mode.toLowerCase())) {
    return {
      valid: false,
      error: `Merge mode must be one of: ${validModes.join(', ')}`,
    };
  }

  return { valid: true, mode: mode.toLowerCase() };
}

/**
 * Validate package.json
 */
async function validatePackageJson(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    JSON.parse(content);
    return { valid: true };
  } catch (error) {
    return { valid: false, error: `Invalid package.json: ${error.message}` };
  }
}

/**
 * Validate port number
 */
function validatePort(port) {
  const portNum = parseInt(port, 10);
  
  if (isNaN(portNum) || portNum < 1000 || portNum > 65535) {
    return {
      valid: false,
      error: 'Port must be a number between 1000 and 65535',
    };
  }

  return { valid: true, port: portNum };
}

module.exports = {
  validateProjectName,
  validateDirectoryPath,
  validateDatabase,
  validateTemplate,
  validateMergeMode,
  validatePackageJson,
  validatePort,
};
