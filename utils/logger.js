/**
 * Logger
 * 
 * Centralized logging system with different log levels
 */

const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

class Logger {
  constructor(options = {}) {
    this.level = options.level || 'info';
    this.logFile = options.logFile || null;
    this.enableColors = options.enableColors !== false;
    this.timestamps = options.timestamps || false;
  }

  /**
   * Get timestamp string
   */
  getTimestamp() {
    if (!this.timestamps) return '';
    const now = new Date();
    return `[${now.toISOString()}] `;
  }

  /**
   * Write to file if logging is enabled
   */
  async writeToFile(level, message) {
    if (!this.logFile) return;

    try {
      const dir = path.dirname(this.logFile);
      await fs.ensureDir(dir);
      const timestamp = new Date().toISOString();
      await fs.appendFile(
        this.logFile,
        `${timestamp} [${level.toUpperCase()}] ${message}\n`
      );
    } catch (error) {
      // Silently fail to avoid breaking the app if logging fails
      console.error('Failed to write to log file:', error.message);
    }
  }

  /**
   * Log debug message
   */
  debug(message) {
    if (['debug'].includes(this.level)) {
      const timestamp = this.getTimestamp();
      console.log(chalk.gray(`${timestamp}DEBUG: ${message}`));
      this.writeToFile('debug', message);
    }
  }

  /**
   * Log info message
   */
  info(message) {
    if (['debug', 'info'].includes(this.level)) {
      const timestamp = this.getTimestamp();
      console.log(chalk.blue(`${timestamp}ℹ ${message}`));
      this.writeToFile('info', message);
    }
  }

  /**
   * Log success message
   */
  success(message) {
    const timestamp = this.getTimestamp();
    console.log(chalk.green(`${timestamp}✓ ${message}`));
    this.writeToFile('success', message);
  }

  /**
   * Log warning message
   */
  warn(message) {
    const timestamp = this.getTimestamp();
    console.log(chalk.yellow(`${timestamp}⚠ ${message}`));
    this.writeToFile('warn', message);
  }

  /**
   * Log error message
   */
  error(message, error = null) {
    const timestamp = this.getTimestamp();
    console.log(chalk.red(`${timestamp}✗ ${message}`));
    if (error && process.env.DEBUG) {
      console.error(chalk.red(error.stack));
    }
    this.writeToFile('error', message);
  }

  /**
   * Log raw message (no prefix)
   */
  log(message) {
    console.log(message);
    this.writeToFile('log', message);
  }

  /**
   * Create section header
   */
  section(title) {
    const width = 60;
    const padding = Math.max(0, (width - title.length - 4) / 2);
    const line = '='.repeat(width);
    
    console.log('');
    console.log(chalk.cyan(line));
    console.log(chalk.cyan(' '.repeat(Math.floor(padding)) + '► ' + title));
    console.log(chalk.cyan(line));
    console.log('');
  }

  /**
   * Create separator line
   */
  separator() {
    console.log(chalk.gray('-'.repeat(60)));
  }

  /**
   * Log progress
   */
  progress(current, total, message = '') {
    const percentage = ((current / total) * 100).toFixed(0);
    const barLength = 30;
    const filled = Math.floor((current / total) * barLength);
    const empty = barLength - filled;

    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    let output = `[${bar}] ${percentage}%`;

    if (message) {
      output += ` - ${message}`;
    }

    console.log(chalk.cyan(output));
  }

  /**
   * Log table
   */
  table(headers, rows) {
    if (rows.length === 0) {
      this.info('No data to display');
      return;
    }

    // Calculate column widths
    const colWidths = headers.map((header, idx) => {
      return Math.max(
        header.length,
        ...rows.map((row) => String(row[idx] || '').length)
      );
    });

    // Print header
    const headerRow = headers
      .map((header, idx) => header.padEnd(colWidths[idx]))
      .join(' | ');
    console.log(chalk.cyan(headerRow));
    console.log(chalk.cyan('-'.repeat(headerRow.length)));

    // Print rows
    rows.forEach((row) => {
      const dataRow = row
        .map((cell, idx) => String(cell || '').padEnd(colWidths[idx]))
        .join(' | ');
      console.log(dataRow);
    });
  }
}

// Create default logger instance
const defaultLogger = new Logger();

module.exports = Logger;
module.exports.default = defaultLogger;
