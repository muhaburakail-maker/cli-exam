/**
 * Template Generator
 * 
 * Generates basic template structure programmatically
 */

const fs = require('fs-extra');
const path = require('path');

/**
 * Generate a basic project template structure
 */
async function generateTemplateStructure(outputPath, template, database) {
  try {
    // Frontend structure
    const frontendPath = path.join(outputPath, 'frontend');
    await generateFrontendStructure(frontendPath);

    // Backend structure
    const backendPath = path.join(outputPath, 'backend');
    await generateBackendStructure(backendPath, database);

    // Docs
    const docsPath = path.join(outputPath, 'docs');
    await generateDocumentation(docsPath, template, database);

    return true;
  } catch (err) {
    throw new Error(`Failed to generate template: ${err.message}`);
  }
}

/**
 * Generate frontend directory structure
 */
async function generateFrontendStructure(frontendPath) {
  const dirs = [
    'src/components',
    'src/pages',
    'src/services',
    'src/hooks',
    'src/context',
    'src/styles',
    'src/utils',
    'public',
  ];

  for (const dir of dirs) {
    await fs.ensureDir(path.join(frontendPath, dir));
  }

  // Create basic files
  const files = {
    'package.json': generateFrontendPackageJson(),
    'index.html': generateIndexHtml(),
    'vite.config.js': generateViteConfig(),
    'tailwind.config.js': generateTailwindConfig(),
    'src/main.jsx': generateMainJs(),
    'src/App.jsx': generateAppComponent(),
    'src/App.css': generateAppCSS(),
    '.env.example': generateFrontendEnv(),
    '.gitignore': generateGitignore(),
  };

  for (const [file, content] of Object.entries(files)) {
    await fs.writeFile(path.join(frontendPath, file), content);
  }
}

/**
 * Generate backend directory structure
 */
async function generateBackendStructure(backendPath, database) {
  const dirs = [
    'src/models',
    'src/routes',
    'src/controllers',
    'src/middleware',
    'src/utils',
    'src/config',
    'docs',
    'logs',
  ];

  for (const dir of dirs) {
    await fs.ensureDir(path.join(backendPath, dir));
  }

  // Create basic files
  const files = {
    'package.json': generateBackendPackageJson(),
    'src/index.js': generateBackendEntry(),
    'src/config/database.js': generateDatabaseConfig(database),
    'src/middleware/errorHandler.js': generateErrorHandler(),
    '.env.example': generateBackendEnv(),
    '.gitignore': generateGitignore(),
    'README.md': generateBackendReadme(),
  };

  for (const [file, content] of Object.entries(files)) {
    await fs.writeFile(path.join(backendPath, file), content);
  }
}

/**
 * Generate documentation
 */
async function generateDocumentation(docsPath, template, database) {
  await fs.ensureDir(docsPath);

  const files = {
    'README.md': generateDocsReadme(template),
    'API.md': generateApiDocumentation(),
    'SETUP.md': generateSetupGuide(database),
    'ARCHITECTURE.md': generateArchitecture(),
  };

  for (const [file, content] of Object.entries(files)) {
    await fs.writeFile(path.join(docsPath, file), content);
  }
}

// ============ Template Content Generators ============

function generateFrontendPackageJson() {
  return JSON.stringify(
    {
      name: 'myexam-frontend',
      version: '1.0.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
        lint: 'eslint src',
        format: 'prettier --write src',
      },
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        'react-router-dom': '^6.11.0',
        axios: '^1.4.0',
      },
      devDependencies: {
        '@vitejs/plugin-react': '^4.0.0',
        vite: '^4.3.0',
        tailwindcss: '^3.3.0',
        autoprefixer: '^10.4.14',
        'postcss': '^8.4.24',
      },
    },
    null,
    2
  );
}

function generateBackendPackageJson() {
  return JSON.stringify(
    {
      name: 'myexam-backend',
      version: '1.0.0',
      type: 'module',
      main: 'src/index.js',
      scripts: {
        dev: 'nodemon src/index.js',
        start: 'node src/index.js',
        test: 'jest',
        lint: 'eslint src',
        format: 'prettier --write src',
      },
      dependencies: {
        express: '^4.18.2',
        'cors': '^2.8.5',
        'jsonwebtoken': '^9.0.0',
        'bcryptjs': '^2.4.3',
        'dotenv': '^16.0.3',
        'mongoose': '^7.1.0',
        'mysql2': '^3.3.0',
      },
      devDependencies: {
        nodemon: '^2.0.22',
        eslint: '^8.40.0',
        prettier: '^2.8.8',
        jest: '^29.5.0',
      },
    },
    null,
    2
  );
}

function generateIndexHtml() {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MyExam - Educational Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;
}

function generateViteConfig() {
  return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
})
`;
}

function generateTailwindConfig() {
  return `export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
}

function generateMainJs() {
  return `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;
}

function generateAppComponent() {
  return `import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              MyExam - Educational Platform
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  )
}

function HomePage() {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Welcome to MyExam</h2>
      <p className="text-gray-600">Your educational platform for success</p>
    </div>
  )
}

export default App
`;
}

function generateAppCSS() {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
`;
}

function generateBackendEntry() {
  return `import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.APP_PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' })
})

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: err.message })
})

// Start server
app.listen(PORT, () => {
  console.log(\`Backend server running on port \${PORT}\`)
})
`;
}

function generateDatabaseConfig(database) {
  if (database === 'mongodb') {
    return `import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/my-exam'
    await mongoose.connect(mongoUri)
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

export default connectDB
`;
  } else {
    return `import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'my_exam',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export const connection = await pool.getConnection()
export default pool
`;
  }
}

function generateErrorHandler() {
  return `export const errorHandler = (err, req, res, next) => {
  console.error(err)
  
  const status = err.status || 500
  const message = err.message || 'Internal Server Error'
  
  res.status(status).json({
    error: {
      status,
      message,
    }
  })
}

export default errorHandler
`;
}

function generateFrontendEnv() {
  return `VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=MyExam
`;
}

function generateBackendEnv() {
  return `NODE_ENV=development
APP_PORT=5000
CLIENT_URL=http://localhost:3000

DB_TYPE=mongodb
DB_HOST=localhost
DB_PORT=27017
DB_NAME=my-exam
MONGO_URI=mongodb://localhost:27017/my-exam

JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d

LOG_LEVEL=info
`;
}

function generateGitignore() {
  return `node_modules/
dist/
build/
.env
.env.local
.env.*.local
*.log
.DS_Store
.vscode/
.idea/
*.swp
*.swo
coverage/
`;
}

function generateDocsReadme(template) {
  return `# Documentation

This is the documentation directory for your MyExam project using the ${template} template.

## Contents

- **API.md** - API documentation and endpoints
- **SETUP.md** - Setup and installation guide
- **ARCHITECTURE.md** - Project architecture overview

## Quick Links

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Docs: http://localhost:5000/api/docs

## Template: ${template}

This project was created using the ${template} template, which includes:
- Pre-configured structure
- Database setup
- Authentication system
- Common components

## Getting Help

1. Check the specific documentation files above
2. Review the README files in frontend/ and backend/
3. See the .env.example files for configuration
`;
}

function generateApiDocumentation() {
  return `# API Documentation

## Base URL

\`http://localhost:5000/api\`

## Endpoints

### Health Check

\`\`\`
GET /health
\`\`\`

Response:
\`\`\`json
{
  "status": "ok",
  "message": "Backend is running"
}
\`\`\`

### Authentication

#### Login

\`\`\`
POST /auth/login
\`\`\`

Request:
\`\`\`json
{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`

Response:
\`\`\`json
{
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com"
  }
}
\`\`\`

## Error Responses

All errors follow this format:

\`\`\`json
{
  "error": {
    "status": 400,
    "message": "Error message"
  }
}
\`\`\`

## Authentication

Include JWT token in Authorization header:

\`\`\`
Authorization: Bearer <token>
\`\`\`
`;
}

function generateSetupGuide(database) {
  return `# Setup Guide

## Prerequisites

- Node.js 14+
- npm or yarn
- ${database === 'mongodb' ? 'MongoDB' : 'MySQL'} Server

## Installation

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment

Create \`.env\` file in backend directory:

\`\`\`
NODE_ENV=development
APP_PORT=5000
CLIENT_URL=http://localhost:3000

${database === 'mongodb' 
  ? `DB_TYPE=mongodb
DB_HOST=localhost
DB_PORT=27017
MONGO_URI=mongodb://localhost:27017/my-exam` 
  : `DB_TYPE=mysql
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=my_exam`}

JWT_SECRET=your-secret-key
\`\`\`

### 3. Start Database

${database === 'mongodb'
  ? `\`\`\`bash
mongod
\`\`\``
  : `\`\`\`bash
# Start MySQL server
mysql -u root -p
# Create database
CREATE DATABASE my_exam;
\`\`\``}

### 4. Start Development Servers

Frontend:
\`\`\`bash
cd frontend
npm run dev
\`\`\`

Backend (in another terminal):
\`\`\`bash
cd backend
npm run dev
\`\`\`

### 5. Access Application

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Troubleshooting

### Port Already in Use

Change PORT in .env and vite.config.js

### Database Connection Error

1. Ensure database is running
2. Check connection credentials in .env
3. Verify firewall allows connections

### Dependencies Installation Error

\`\`\`bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
\`\`\`
`;
}

function generateArchitecture() {
  return `# Project Architecture

## Overview

MyExam is a full-stack educational platform built with:
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Express.js + Node.js
- **Database**: MongoDB or MySQL

## Directory Structure

\`\`\`
project/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── hooks/        # Custom hooks
│   │   └── App.jsx
│   └── package.json
├── backend/               # Express server
│   ├── src/
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Business logic
│   │   ├── middleware/   # Express middleware
│   │   └── index.js
│   └── package.json
├── docs/                  # Documentation
├── .env                   # Environment variables
└── package.json           # Root package
\`\`\`

## Technology Stack

### Frontend
- React 18+
- Vite (bundler)
- TailwindCSS (styling)
- React Router (routing)
- Axios (HTTP client)

### Backend
- Express.js
- Node.js
- JWT (authentication)
- bcrypt (password hashing)

### Database
- MongoDB (NoSQL) or MySQL (SQL)

## API Architecture

RESTful API with:
- Authentication using JWT
- Error handling middleware
- CORS support
- Structured response format

## Development Workflow

1. **Frontend Development**
   - Hot module replacement with Vite
   - Component reusability
   - State management

2. **Backend Development**
   - API route development
   - Database operations
   - Authentication & authorization

3. **Database**
   - Schema design
   - Migrations
   - Relationships

## Best Practices

1. Keep components small and reusable
2. Use environment variables for configuration
3. Implement proper error handling
4. Follow REST API conventions
5. Document API endpoints
6. Write meaningful commit messages

## Performance Optimization

- Code splitting in frontend
- Image optimization
- Database indexing
- API response caching
- Lazy loading of components

## Security

- JWT token-based auth
- Password hashing with bcrypt
- CORS configuration
- Environment variable protection
- Input validation
`;
}

function generateBackendReadme() {
  return `# Backend - MyExam

Express.js backend for MyExam platform.

## Getting Started

### Installation

\`\`\`bash
cd backend
npm install
\`\`\`

### Configuration

Create \`.env\` file:

\`\`\`
NODE_ENV=development
APP_PORT=5000
JWT_SECRET=your-secret
\`\`\`

### Running

Development:
\`\`\`bash
npm run dev
\`\`\`

Production:
\`\`\`bash
npm start
\`\`\`

### Testing

\`\`\`bash
npm test
\`\`\`

## API Endpoints

See \`docs/API.md\` for complete API documentation.

## File Structure

- \`src/models/\` - Database models
- \`src/routes/\` - API routes
- \`src/controllers/\` - Business logic
- \`src/middleware/\` - Express middleware
- \`src/config/\` - Configuration
- \`src/utils/\` - Utility functions
`;
}

module.exports = {
  generateTemplateStructure,
  generateFrontendStructure,
  generateBackendStructure,
  generateDocumentation,
};
