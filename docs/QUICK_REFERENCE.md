# Quick Reference Guide

Fast reference for MyExam Framework development and usage.

## Installation

```bash
# Global install
npm install -g create-my-exam

# Development install
git clone <repo>
cd create-my-exam
npm install
```

## Usage

### Create New Project
```bash
npx create-my-exam@latest
# or
npx create-my-exam@latest my-project
```

### With Options
```bash
# Specify template
npx create-my-exam@latest --template rwanda-exam

# Specify database
npx create-my-exam@latest --database mongodb

# Skip npm install
npx create-my-exam@latest --skip-install

# Force overwrite
npx create-my-exam@latest my-project --force
```

### Import Into Existing Project
```bash
npx create-my-exam@latest
# Select "Import Framework Into Existing Project"
```

## Development Commands

```bash
# Run locally
npm run dev
# or
node bin/create-my-exam.js

# Lint code
npm run lint

# Format code
npm run format

# Run tests
npm test
```

## Project Structure

```
create-my-exam/
├── bin/               # CLI executable
├── commands/          # Command implementations
├── prompts/           # User prompts
├── services/          # Business logic services
├── engines/           # Processing engines
├── generators/        # Template generation
├── marketplace/       # Template registry
├── utils/             # Utilities and helpers
└── docs/              # Documentation
```

## File Locations Quick Reference

| Component | Location | File |
|-----------|----------|------|
| CLI Entry | bin/ | create-my-exam.js |
| Main Commands | commands/ | initialize.js, create.js, import.js |
| Prompts | prompts/ | index.js |
| Templates | marketplace/ | registry.js |
| DB Config | services/ | database-service.js |
| Install Logic | engines/ | installer-engine.js |
| Utils | utils/ | helpers.js, validators.js, logger.js |

## Common Tasks

### Adding a New Template

1. Add to `marketplace/registry.js`:
```javascript
{
  id: 'new-template',
  name: 'New Template Name',
  github: 'org/repo',
  features: ['Feature1', 'Feature2']
}
```

2. Create template repository on GitHub
3. Update registry and redeploy

### Modifying a Prompt

Edit `prompts/index.js`:
```javascript
async function promptCustom() {
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'option',
      message: 'Your question:',
      choices: ['Option1', 'Option2']
    }
  ]);
  return answer.option;
}
```

### Adding New Dependency

```bash
npm install package-name
# Update package.json
```

### Testing Locally

```bash
# Install globally from local
npm install -g .

# Test command
create-my-exam --help

# Uninstall
npm uninstall -g create-my-exam
```

## Environment Variables

### For Development
```
NODE_ENV=development
DEBUG=myexam:*
```

### For Users (.env in backend)
```
NODE_ENV=development
APP_PORT=5000
DB_TYPE=mongodb
MONGO_URI=mongodb://localhost:27017/my-exam
JWT_SECRET=your-secret-key
```

## Error Handling

### Common Errors
| Error | Cause | Fix |
|-------|-------|-----|
| Port in use | Another app on port | Kill process or change port |
| DB connection failed | DB not running | Start database service |
| npm install fails | Network issue | npm cache clean --force |
| Permission denied | File permissions | sudo or chmod |

### Debug Mode
```bash
DEBUG=* npm run dev
```

## Terminal Commands

### macOS/Linux
```bash
# Kill process on port
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# List processes
ps aux | grep node

# Check port usage
netstat -tlnp | grep 3000
```

### Windows
```bash
# Kill process on port
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# List processes
tasklist | findstr node
```

## File Operations

### Copy template
```bash
cp -r templates/old-template templates/new-template
```

### Remove directory
```bash
rm -rf directory-name
```

### Create directory
```bash
mkdir -p path/to/directory
```

## npm Registry

### Publish Package
```bash
npm publish
```

### Check Package
```bash
npm view create-my-exam
```

### Install from npm
```bash
npm install -g create-my-exam
```

## Git Commands

### Create commit
```bash
git add .
git commit -m "feat: Add new feature"
```

### Push changes
```bash
git push origin main
```

### Create tag
```bash
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin --tags
```

## Documentation Links

- Main: [README.md](./README.md)
- Deployment: [DEPLOYMENT.md](./docs/DEPLOYMENT.md)
- Publishing: [NPM_PUBLISHING.md](./docs/NPM_PUBLISHING.md)
- Contributing: [CONTRIBUTING.md](./docs/CONTRIBUTING.md)
- Troubleshooting: [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)
- Roadmap: [ROADMAP.md](./docs/ROADMAP.md)

## Keyboard Shortcuts

### Inquirer Prompts
- ↑/↓: Navigate options
- ← →: Navigate left/right
- Enter: Select option
- Ctrl+C: Cancel

### vim/nano
- vim: `:q` (quit), `:wq` (save & quit)
- nano: Ctrl+X (quit), Ctrl+O (save)

## Key Files to Know

- `package.json` - Dependencies and scripts
- `bin/create-my-exam.js` - Entry point
- `commands/initialize.js` - Main logic
- `marketplace/registry.js` - Templates
- `services/*.js` - Business logic
- `README.md` - Main documentation

## Code Standards

### Naming
- Files: `kebab-case.js`
- Functions: `camelCase()`
- Constants: `UPPER_CASE`
- Classes: `PascalCase`

### Comments
```javascript
// Good: explains WHY
// Cache result to avoid repeated calculations
const cached = cache.get(key)

// Bad: just repeats code
// Get cache
const cached = cache.get(key)
```

### Error Handling
```javascript
try {
  // operation
} catch (error) {
  throw new Error(`Context: ${error.message}`)
}
```

## Testing Workflow

1. Make changes
2. Test locally: `node bin/create-my-exam.js`
3. Check for errors
4. Lint: `npm run lint`
5. Format: `npm run format`
6. Commit changes
7. Push to repository

## Performance Tips

- Cache template information
- Lazy load large files
- Optimize database queries
- Monitor memory usage
- Profile slow operations

## Security Checklist

- ✓ Never expose secrets
- ✓ Validate user input
- ✓ Sanitize file paths
- ✓ Check file permissions
- ✓ Use HTTPS for external calls
- ✓ Implement rate limiting

## Useful npm Packages

| Package | Use |
|---------|-----|
| inquirer | Interactive prompts |
| ora | Loading spinners |
| chalk | Colored output |
| fs-extra | File operations |
| axios | HTTP requests |
| commander | CLI framework |
| degit | Download templates |
| dotenv | Environment variables |

## Resources

- [Node.js Docs](https://nodejs.org/docs/)
- [npm Docs](https://docs.npmjs.com/)
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)
- [Chalk](https://github.com/chalk/chalk)
- [Commander.js](https://github.com/tj/commander.js)

## Support

### Need Help?
1. Check TROUBLESHOOTING.md
2. Review example code
3. Check GitHub issues
4. Create new issue

### Report Bug
1. Reproduce issue
2. Document steps
3. Include error message
4. Submit issue on GitHub

---

**Last Updated**: 2024  
**For version**: 1.0.0+
