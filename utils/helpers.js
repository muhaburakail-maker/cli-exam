/**
 * Helper Utilities
 * 
 * Common utility functions for logging, error handling, and formatting
 */

const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

/**
 * Display CLI banner
 */
function showBanner() {
  console.clear();
  console.log(chalk.cyan('\n╔════════════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan('║                                                            ║'));
  console.log(chalk.cyan('║') + chalk.bold.yellow('        🚀 Welcome to MyExam Framework Creator 🚀         ') + chalk.cyan('║'));
  console.log(chalk.cyan('║') + chalk.cyan('    Build production-ready applications in seconds    ') + chalk.cyan('║'));
  console.log(chalk.cyan('║                                                            ║'));
  console.log(chalk.cyan('╚════════════════════════════════════════════════════════════╝\n'));
}

/**
 * Display success message
 */
function success(message) {
  console.log(chalk.green(`✓ ${message}`));
}

/**
 * Display info message
 */
function info(message) {
  console.log(chalk.blue(`ℹ ${message}`));
}

/**
 * Display warning message
 */
function warn(message) {
  console.log(chalk.yellow(`⚠ ${message}`));
}

/**
 * Display error message
 */
function error(message) {
  console.log(chalk.red(`✗ ${message}`));
}

/**
 * Handle errors gracefully
 */
function handleError(err) {
  console.error('');
  error(err.message || 'An unexpected error occurred');
  
  if (process.env.DEBUG) {
    console.error(err.stack);
  } else {
    info('Run with DEBUG=1 environment variable for more details');
  }
}

/**
 * Format file size for display
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get template display name
 */
function getTemplateDisplayName(templateId) {
  const templateNames = {
    'rwanda-exam': 'Rwanda National Exam Practice',
    'cbt-system': 'CBT Examination System',
    'school-management': 'School Management System',
    'ecommerce': 'E-commerce Platform',
    'investment': 'Investment Platform',
    'order-grabbing': 'Order Grabbing Platform',
    'hotel-management': 'Hotel Management System',
    'hospital-management': 'Hospital Management System',
  };

  return templateNames[templateId] || templateId;
}

/**
 * Convert project name to directory-safe name
 */
function sanitizeProjectName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/^-+|-+$/g, '');
}

/**
 * Check if a directory is empty
 */
async function isDirectoryEmpty(dirPath) {
  const files = await fs.readdir(dirPath);
  return files.length === 0;
}

/**
 * Ensure directory exists
 */
async function ensureDir(dirPath) {
  await fs.ensureDir(dirPath);
}

/**
 * Copy directory recursively
 */
async function copyDirectory(source, destination) {
  await fs.copy(source, destination);
}

/**
 * Remove directory
 */
async function removeDirectory(dirPath) {
  await fs.remove(dirPath);
}

/**
 * Read JSON file
 */
async function readJSON(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to read JSON from ${filePath}: ${error.message}`);
  }
}

/**
 * Write JSON file
 */
async function writeJSON(filePath, data, pretty = true) {
  try {
    const content = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
    await fs.writeFile(filePath, content, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to write JSON to ${filePath}: ${error.message}`);
  }
}

/**
 * Merge objects deeply
 */
function deepMerge(target, source) {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (
        typeof source[key] === 'object' &&
        source[key] !== null &&
        !Array.isArray(source[key])
      ) {
        if (!(key in target)) {
          target[key] = {};
        }
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}

/**
 * Delay execution (for UI purposes)
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  showBanner,
  success,
  info,
  warn,
  error,
  handleError,
  formatFileSize,
  getTemplateDisplayName,
  sanitizeProjectName,
  isDirectoryEmpty,
  ensureDir,
  copyDirectory,
  removeDirectory,
  readJSON,
  writeJSON,
  deepMerge,
  delay,
};
