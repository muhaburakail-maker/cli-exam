# Troubleshooting Guide

Common issues and solutions for MyExam Framework.

## Installation Issues

### npm: command not found

**Symptom**: `npm: command not found`

**Solution**:
1. Ensure Node.js is installed: `node --version`
2. Install Node.js from https://nodejs.org/
3. Verify npm installation: `npm --version`
4. On Mac/Linux: May need to restart terminal

### create-my-exam: command not found

**Symptom**: `create-my-exam: command not found` after global install

**Solution**:
```bash
# Reinstall globally
npm install -g create-my-exam

# Verify installation
npm list -g create-my-exam

# Check npm bin directory is in PATH
echo $PATH | grep -i npm
```

### Permission denied errors

**Symptom**: `EACCES: permission denied` during install

**Solution on Mac/Linux**:
```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Add to ~/.bash_profile or ~/.zshrc
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bash_profile
```

## Project Creation Issues

### Directory already exists

**Symptom**: `Directory already exists and is not empty`

**Solution**:
```bash
# Option 1: Use different directory name
npx create-my-exam@latest my-new-project

# Option 2: Force overwrite (backup first!)
npx create-my-exam@latest my-project --force

# Option 3: Remove existing directory
rm -rf my-project
npx create-my-exam@latest my-project
```

### Template download fails

**Symptom**: `Failed to download template`

**Possible causes**:
- No internet connection
- GitHub API rate limit exceeded
- GitHub is down
- Invalid template ID

**Solutions**:
```bash
# Check internet connection
ping github.com

# Wait for rate limit to reset (60 min for unauthenticated)
# Or authenticate with GitHub token
export GITHUB_TOKEN=your-token

# Try again
npx create-my-exam@latest
```

### Out of memory during npm install

**Symptom**: `JavaScript heap out of memory`

**Solution**:
```bash
# Increase Node.js memory limit
export NODE_OPTIONS=--max-old-space-size=4096
npm install

# Or reinstall with more memory
node --max-old-space-size=4096 $(npm bin)/npm install
```

## Configuration Issues

### Port already in use

**Symptom**: `EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# On Mac/Linux: Find and kill process
lsof -i :3000
kill -9 <PID>

# On Windows: 
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in .env or package.json
```

### Environment variables not loading

**Symptom**: `Cannot read property 'X' of undefined`

**Solution**:
```bash
# Check .env file exists
ls -la backend/.env

# Verify content
cat backend/.env

# Ensure dotenv is required at start of file
# Add at top of backend/src/index.js
import dotenv from 'dotenv'
dotenv.config()

# Restart development server
npm run dev
```

### Invalid environment variable

**Symptom**: Connection fails with wrong credentials

**Solution**:
1. Check `.env.example` for correct format
2. Verify all required variables are set
3. Don't use quotes unless needed
4. Check for typos in variable names

```bash
# Good .env format
DB_HOST=localhost
DB_PORT=27017
JWT_SECRET=my-secret-key

# Bad .env format
DB_HOST="localhost"  # quotes not needed
db_host=localhost    # wrong case
```

## Database Issues

### MongoDB connection refused

**Symptom**: `MongoServerError: connect ECONNREFUSED`

**Solution**:
```bash
# Ensure MongoDB is running
# On Mac with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# Verify connection
mongosh "mongodb://localhost:27017"

# Check connection string in .env
MONGO_URI=mongodb://localhost:27017/my-exam
```

### MySQL connection error

**Symptom**: `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solution**:
```bash
# Ensure MySQL is running
# On Mac
brew services start mysql

# On Linux
sudo systemctl start mysql

# On Windows
net start MySQL80

# Verify connection
mysql -h localhost -u root -p

# Check credentials in .env
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=
```

### Database not found

**Symptom**: `Error: Unknown database 'my-exam'`

**Solution**:
```bash
# For MongoDB
mongosh
use my-exam
db.createCollection("test")

# For MySQL
mysql -u root -p
CREATE DATABASE my_exam;
use my_exam;

# Update .env with correct database name
```

### Authentication failed

**Symptom**: `Error: authentication failed`

**Solution**:
1. Verify username and password
2. Check if user has required permissions
3. For MongoDB Atlas: Whitelist IP address
4. For MySQL: Create user with proper permissions

```bash
# MySQL: Create user
mysql -u root -p
CREATE USER 'myexam'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON my_exam.* TO 'myexam'@'localhost';
FLUSH PRIVILEGES;
```

## Development Server Issues

### Vite dev server won't start

**Symptom**: `Port 3000 is already in use`

**Solution**:
```bash
# Check what's using port 3000
lsof -i :3000

# Kill the process or use different port
# Edit frontend/vite.config.js
export default {
  server: {
    port: 3001
  }
}
```

### Express server crashes on startup

**Symptom**: `Process exited with code 1`

**Solution**:
```bash
# Check logs for errors
npm run dev

# Or run with verbose
NODE_DEBUG=* npm run dev

# Check for port conflicts
lsof -i :5000

# Verify all environment variables are set
cat backend/.env
```

### Proxy not working

**Symptom**: `404: Cannot find /api/...`

**Solution**:
Ensure vite.config.js has correct proxy:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    }
  }
}
```

## Dependency Issues

### npm install hangs

**Symptom**: Installation seems stuck forever

**Solution**:
```bash
# Cancel and clear cache
npm cache clean --force

# Try installing again with verbose output
npm install --verbose

# Or use specific registry
npm install --registry https://registry.npmjs.org/
```

### Conflicting dependency versions

**Symptom**: `npm ERR! code ERESOLVE`

**Solution**:
```bash
# Try legacy peer deps
npm install --legacy-peer-deps

# Or remove node_modules and try again
rm -rf node_modules package-lock.json
npm install
```

### Package not found

**Symptom**: `npm ERR! 404 Not Found`

**Solution**:
```bash
# Check package name spelling
# Try from different network
# Clear npm cache
npm cache clean --force

# Verify online
npm search package-name
```

## Build Issues

### Build fails

**Symptom**: `npm run build` exits with error

**Solution**:
```bash
# Check for TypeScript/ESLint errors
npm run lint

# Fix common issues
npm run format

# Try rebuilding
npm run build -- --verbose

# Check for specific errors
npm run build 2>&1 | head -50
```

### Production build too large

**Symptom**: Build files are huge (> 1MB)

**Solution**:
```bash
# Analyze bundle size
npm install --save-dev vite-plugin-visualizer

# Add to vite.config.js
import { visualizer } from 'vite-plugin-visualizer';

plugins: [visualizer()]

# Build and analyze
npm run build
# Open dist/stats.html

# Optimize by:
# - Code splitting
# - Lazy loading routes
# - Removing unused dependencies
```

## Testing Issues

### Tests not running

**Symptom**: `npm test` fails to start

**Solution**:
```bash
# Ensure Jest is configured
cat jest.config.js

# Run with verbose output
npm test -- --verbose

# Check for test files
find . -name "*.test.js" -o -name "*.spec.js"
```

## Security Issues

### Security vulnerability warnings

**Symptom**: `npm audit` shows vulnerabilities

**Solution**:
```bash
# View vulnerabilities
npm audit

# Auto-fix if possible
npm audit fix

# Force fix (may break things)
npm audit fix --force

# Accept risk (not recommended for production)
npm install --no-audit
```

## Performance Issues

### Application running slowly

**Symptom**: Slow page load, sluggish interactions

**Causes & Solutions**:
1. **Large bundle size**: Implement code splitting
2. **Slow database queries**: Add indexes, optimize queries
3. **Too many API calls**: Implement caching
4. **Memory leaks**: Check browser console, profile heap

```javascript
// Example optimization
import { lazy, Suspense } from 'react'

const Page = lazy(() => import('./pages/Page'))

<Suspense fallback={<Loading />}>
  <Page />
</Suspense>
```

## Browser Issues

### Blank white screen

**Symptom**: Page loads but shows nothing

**Solutions**:
1. Check browser console for errors (F12)
2. Check Network tab for failed requests
3. Clear browser cache: Ctrl+Shift+Delete
4. Check if JavaScript is enabled

### CORS errors

**Symptom**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution**:
Ensure backend has CORS enabled:
```javascript
import cors from 'cors'

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))
```

## Getting Help

If you can't find a solution:

1. **Check existing issues**: GitHub Issues
2. **Search documentation**: docs/ folder
3. **Review templates**: examples/ folder
4. **Create new issue**: Include:
   - OS and Node.js version
   - Full error message
   - Steps to reproduce
   - Your environment variables (.env)

## Debug Mode

Enable detailed logging:

```bash
# Linux/Mac
DEBUG=* npm run dev

# Windows
set DEBUG=*
npm run dev

# Or in code
import debug from 'debug'
const log = debug('myexam:*')
log('Debug message')
```

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `EADDRINUSE` | Port in use | Kill process using port |
| `ECONNREFUSED` | DB not running | Start database service |
| `ENOENT` | File not found | Check file path |
| `EACCES` | Permission denied | Fix permissions |
| `ERESOLVE` | Dependency conflict | Use --legacy-peer-deps |

---

Still stuck? Create an issue with all details! 🚀
