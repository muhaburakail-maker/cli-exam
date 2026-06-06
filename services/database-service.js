/**
 * Database Service
 * 
 * Handles database configuration, schema setup, and migrations
 */

const fs = require('fs-extra');
const path = require('path');
const { success, warn } = require('../utils/helpers');

/**
 * Get database configuration template
 */
function getDatabaseConfig(database, credentials = {}) {
  if (database === 'mongodb') {
    return {
      type: 'mongodb',
      host: credentials.host || 'localhost',
      port: credentials.port || 27017,
      username: credentials.username || '',
      password: credentials.password || '',
      database: credentials.database || 'my-exam',
      uri: buildMongoDBUri(credentials),
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    };
  } else if (database === 'mysql') {
    return {
      type: 'mysql',
      host: credentials.host || 'localhost',
      port: credentials.port || 3306,
      username: credentials.username || 'root',
      password: credentials.password || '',
      database: credentials.database || 'my_exam',
      options: {
        dialect: 'mysql',
        logging: false,
      },
    };
  }

  throw new Error(`Unknown database type: ${database}`);
}

/**
 * Build MongoDB connection URI
 */
function buildMongoDBUri(credentials) {
  const { host = 'localhost', port = 27017, username = '', password = '', database = 'my-exam' } =
    credentials;

  if (username && password) {
    return `mongodb://${username}:${password}@${host}:${port}/${database}`;
  }

  return `mongodb://${host}:${port}/${database}`;
}

/**
 * Build MySQL connection string
 */
function buildMySQLConnectionString(credentials) {
  const { host = 'localhost', port = 3306, username = 'root', password = '', database = 'my_exam' } =
    credentials;

  const auth = password ? `${username}:${password}` : username;
  return `mysql://${auth}@${host}:${port}/${database}`;
}

/**
 * Generate environment file content
 */
function generateEnvContent(database, credentials, env = {}) {
  const dbConfig = getDatabaseConfig(database, credentials);

  const envContent = {
    // App Configuration
    NODE_ENV: env.nodeEnv || 'development',
    APP_PORT: env.port || 5000,
    APP_URL: env.appUrl || 'http://localhost:5000',
    CLIENT_URL: env.clientUrl || 'http://localhost:3000',

    // Database Configuration
    DB_TYPE: database,
    DB_HOST: credentials.host || (database === 'mongodb' ? 'localhost' : 'localhost'),
    DB_PORT: credentials.port || (database === 'mongodb' ? 27017 : 3306),
    DB_NAME: credentials.database || (database === 'mongodb' ? 'my-exam' : 'my_exam'),
    DB_USERNAME: credentials.username || (database === 'mongodb' ? '' : 'root'),
    DB_PASSWORD: credentials.password || '',

    // Connection Strings
    ...(database === 'mongodb' && {
      MONGO_URI: dbConfig.uri,
    }),
    ...(database === 'mysql' && {
      DATABASE_URL: buildMySQLConnectionString(credentials),
    }),

    // Authentication
    JWT_SECRET: env.jwtSecret || 'your-secret-key-change-in-production',
    JWT_EXPIRE: env.jwtExpire || '7d',

    // Email (Optional)
    SMTP_HOST: env.smtpHost || 'smtp.gmail.com',
    SMTP_PORT: env.smtpPort || 587,
    SMTP_USER: env.smtpUser || 'your-email@gmail.com',
    SMTP_PASS: env.smtpPass || 'your-password',

    // Logging
    LOG_LEVEL: env.logLevel || 'info',
    LOG_FILE: env.logFile || 'logs/app.log',

    // API
    API_VERSION: env.apiVersion || 'v1',
    API_TIMEOUT: env.apiTimeout || 30000,
  };

  return formatEnvFile(envContent);
}

/**
 * Format environment variables as .env file content
 */
function formatEnvFile(envObj) {
  return Object.entries(envObj)
    .map(([key, value]) => {
      // Quote values if they contain spaces
      const quotedValue = value.toString().includes(' ') ? `"${value}"` : value;
      return `${key}=${quotedValue}`;
    })
    .join('\n');
}

/**
 * Generate example environment file
 */
async function generateEnvExample(projectPath, database, credentials, env = {}) {
  try {
    const envContent = generateEnvContent(database, credentials, env);
    const backendPath = path.join(projectPath, 'backend');
    const envFile = path.join(backendPath, '.env.example');

    await fs.ensureDir(backendPath);
    await fs.writeFile(envFile, envContent);

    success('Created .env.example file');
  } catch (err) {
    throw new Error(`Failed to generate .env.example: ${err.message}`);
  }
}

/**
 * Create .env file for development
 */
async function createEnvFile(projectPath, database, credentials, env = {}) {
  try {
    const envContent = generateEnvContent(database, credentials, env);
    const backendPath = path.join(projectPath, 'backend');
    const envFile = path.join(backendPath, '.env');

    await fs.ensureDir(backendPath);
    await fs.writeFile(envFile, envContent);

    success('Created .env file');
  } catch (err) {
    throw new Error(`Failed to create .env file: ${err.message}`);
  }
}

/**
 * Get MongoDB schema examples
 */
function getMongoDBSchemas() {
  return {
    User: {
      _id: 'ObjectId',
      name: 'String (required)',
      email: 'String (required, unique)',
      password: 'String (required)',
      role: 'String (admin, student, teacher)',
      createdAt: 'Date (default: now)',
      updatedAt: 'Date (default: now)',
    },
    Exam: {
      _id: 'ObjectId',
      title: 'String (required)',
      description: 'String',
      questions: '[ObjectId]',
      duration: 'Number (minutes)',
      passingScore: 'Number',
      createdBy: 'ObjectId (User)',
      createdAt: 'Date',
      updatedAt: 'Date',
    },
    Question: {
      _id: 'ObjectId',
      examId: 'ObjectId',
      text: 'String (required)',
      type: 'String (multiple-choice, essay, etc)',
      options: '[String]',
      correctAnswer: 'String/Number',
      points: 'Number',
      order: 'Number',
    },
    Result: {
      _id: 'ObjectId',
      userId: 'ObjectId',
      examId: 'ObjectId',
      score: 'Number',
      answers: 'Object',
      startedAt: 'Date',
      completedAt: 'Date',
      status: 'String (completed, pending)',
    },
  };
}

/**
 * Get MySQL schema examples
 */
function getMySQLSchemas() {
  return {
    users: `
      CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'student', 'teacher') DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `,
    exams: `
      CREATE TABLE exams (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        duration INT NOT NULL COMMENT 'Duration in minutes',
        passing_score INT NOT NULL,
        created_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `,
    questions: `
      CREATE TABLE questions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        exam_id INT NOT NULL,
        text TEXT NOT NULL,
        type VARCHAR(50) NOT NULL DEFAULT 'multiple-choice',
        options JSON NOT NULL,
        correct_answer VARCHAR(255) NOT NULL,
        points INT NOT NULL DEFAULT 1,
        \`order\` INT NOT NULL,
        FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
      )
    `,
    results: `
      CREATE TABLE results (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        exam_id INT NOT NULL,
        score INT NOT NULL,
        answers JSON NOT NULL,
        started_at TIMESTAMP,
        completed_at TIMESTAMP,
        status VARCHAR(50) DEFAULT 'pending',
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (exam_id) REFERENCES exams(id)
      )
    `,
  };
}

/**
 * Write schema documentation
 */
async function writeSchemaDocumentation(projectPath, database) {
  try {
    let schemaDoc = '# Database Schema Documentation\n\n';
    schemaDoc += `## Database: ${database}\n\n`;

    if (database === 'mongodb') {
      const schemas = getMongoDBSchemas();
      schemaDoc += '## Collections\n\n';

      for (const [collection, schema] of Object.entries(schemas)) {
        schemaDoc += `### ${collection}\n\n`;
        schemaDoc += '```json\n';
        schemaDoc += JSON.stringify(schema, null, 2);
        schemaDoc += '\n```\n\n';
      }
    } else if (database === 'mysql') {
      const schemas = getMySQLSchemas();
      schemaDoc += '## Tables\n\n';

      for (const [table, sql] of Object.entries(schemas)) {
        schemaDoc += `### ${table}\n\n`;
        schemaDoc += '```sql\n';
        schemaDoc += sql.trim();
        schemaDoc += '\n```\n\n';
      }
    }

    const backendPath = path.join(projectPath, 'backend');
    const docsPath = path.join(backendPath, 'docs', 'schema.md');

    await fs.ensureDir(path.dirname(docsPath));
    await fs.writeFile(docsPath, schemaDoc);

    success('Created schema documentation');
  } catch (err) {
    warn(`Failed to create schema documentation: ${err.message}`);
  }
}

module.exports = {
  getDatabaseConfig,
  buildMongoDBUri,
  buildMySQLConnectionString,
  generateEnvContent,
  formatEnvFile,
  generateEnvExample,
  createEnvFile,
  getMongoDBSchemas,
  getMySQLSchemas,
  writeSchemaDocumentation,
};
