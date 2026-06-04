# Contributing Guide

We love your input! We want to make contributing to MyExam as easy and transparent as possible.

## Ways to Contribute

### 1. Report Bugs
- Check if issue already exists
- Include reproduction steps
- Provide system information
- Attach relevant logs

### 2. Suggest Enhancements
- Describe the use case
- Explain expected behavior
- Provide examples
- Link to similar tools

### 3. Add New Templates
- Create in templates/ directory
- Follow existing structure
- Include documentation
- Add tests

### 4. Improve Documentation
- Fix typos
- Clarify instructions
- Add examples
- Update README

### 5. Submit Code Changes

## Development Setup

### Clone Repository
```bash
git clone https://github.com/francoisxaviernzaba/exam-template.git
cd create-my-exam
npm install
```

### Create Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### Development Commands
```bash
# Test locally
npm run dev

# Run CLI
node bin/create-my-exam.js

# Run linter
npm run lint

# Format code
npm run format

# Run tests
npm test
```

## Code Style

### JavaScript Style Guide
- Use ESLint configuration
- 2-space indentation
- Semicolons required
- Meaningful variable names
- Comments for complex logic

### Example
```javascript
/**
 * Descriptive function comment
 * 
 * @param {string} projectName - The project name
 * @returns {Promise<boolean>} Success status
 */
async function createProject(projectName) {
  try {
    // Implementation
  } catch (err) {
    throw new Error(`Error message: ${err.message}`);
  }
}
```

## Commit Messages

### Format
```
[type]: Brief description

Longer explanation if needed. Keep it concise.
- Feature: New functionality
- Fix: Bug fix
- Docs: Documentation only
- Style: Code style changes
- Test: Test additions
- Refactor: Code restructuring
```

### Examples
```
feat: Add GitHub template downloader
fix: Resolve environment variable parsing issue
docs: Update installation instructions
```

## Pull Request Process

1. **Fork repository**
2. **Create feature branch**
3. **Make changes**
4. **Write/update tests**
5. **Update documentation**
6. **Ensure linting passes**
7. **Commit with clear messages**
8. **Push to fork**
9. **Create Pull Request**

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Performance improvement

## Testing Done
Describe testing performed

## Related Issues
Closes #123

## Checklist
- [ ] Code follows style guide
- [ ] Tests updated/added
- [ ] Documentation updated
- [ ] No breaking changes
```

## Testing

### Running Tests
```bash
npm test
```

### Writing Tests
```javascript
describe('Feature Name', () => {
  test('should do something', () => {
    // Arrange
    const input = 'test';
    
    // Act
    const result = someFunction(input);
    
    // Assert
    expect(result).toBe('expected');
  });
});
```

## Adding New Templates

### Structure
```
templates/your-template/
├── frontend/
│   ├── src/
│   └── package.json
├── backend/
│   ├── src/
│   └── package.json
├── docs/
├── .env.example
└── README.md
```

### Steps
1. Create template directory
2. Add frontend and backend folders
3. Include documentation
4. Register in marketplace/registry.js
5. Test template creation
6. Submit PR

## Documentation

### Code Comments
```javascript
// Good: Explains why, not what
// Use async/await to handle errors more gracefully
async function fetchData() { }

// Bad: Just restates code
// Fetch the data
async function fetchData() { }
```

### Markdown Files
- Use clear headings
- Include code examples
- Add links to related docs
- Keep lines under 100 characters

## Code Review

### What We Look For
- ✓ Code quality and style
- ✓ Test coverage
- ✓ Documentation
- ✓ Performance impact
- ✓ Security concerns
- ✓ Breaking changes

### Providing Feedback
- Be constructive
- Ask questions
- Suggest improvements
- Link to examples

## Legal

### License
All contributions must be compatible with MIT License

### Contributor Agreement
By contributing, you agree that your contributions will be licensed under the same MIT License.

## Recognition

- All contributors listed in CONTRIBUTORS.md
- Acknowledged in release notes
- Featured in documentation

## Getting Help

- Open an issue with "question" label
- Check existing documentation
- Ask in discussions
- Email: support@myexam.dev

## Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inspiring community for all.

### Our Standards
- Be respectful
- Be inclusive
- Be collaborative
- Be professional

### Enforcement
Violations may result in removal from project.

## FAQ

**Q: Where do I start?**
A: Look for issues labeled "good first issue"

**Q: How long does PR review take?**
A: Usually within 2-3 days

**Q: Can I add a new template?**
A: Yes! Follow the template guidelines

**Q: How do I run tests?**
A: `npm test`

**Q: Where's the issue tracker?**
A: GitHub Issues tab

## Resources

- [GitHub Help](https://help.github.com/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

## Project Maintainers

- Project Lead: [Your Name]
- Core Contributors: [List]
- Community Manager: [Name]

## Roadmap

See ROADMAP.md for planned features and improvements.

---

Thank you for contributing! 🎉
