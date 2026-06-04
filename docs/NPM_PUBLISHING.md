# NPM Publishing Guide

Complete guide to publish create-my-exam to npm registry.

## Prerequisites

- npm account (https://www.npmjs.com)
- npm CLI installed
- Repository on GitHub

## Publishing Steps

### 1. Prepare Your Package

Ensure package.json is properly configured:

```json
{
  "name": "create-my-exam",
  "version": "1.0.0",
  "description": "Create production-ready applications instantly",
  "main": "index.js",
  "bin": {
    "create-my-exam": "bin/create-my-exam.js"
  },
  "keywords": ["cli", "scaffold", "generator"],
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/francoisxaviernzaba/exam-template"
  },
  "bugs": {
    "url": "https://github.com/francoisxaviernzaba/exam-template/issues"
  },
  "homepage": "https://github.com/francoisxaviernzaba/exam-template#readme"
}
```

### 2. Create README.md

Ensure comprehensive README.md exists with:
- Project description
- Installation instructions
- Usage examples
- Contributing guidelines
- License information

### 3. Create .npmignore

```
# Don't include these in npm package
.git
.gitignore
.env
.env.example
node_modules
docs/
tests/
examples/
*.log
.DS_Store
DEPLOYMENT.md
NPM_PUBLISHING.md
```

### 4. Setup Git Tags

```bash
# Create initial tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push tags to GitHub
git push origin --tags
```

### 5. Login to npm

```bash
npm login
# Enter username, password, email
```

### 6. Test Before Publishing

```bash
# Test locally
npm install -g .
create-my-exam --help

# Simulate publish
npm publish --dry-run
```

### 7. Publish to npm

```bash
# First time publish
npm publish

# With public scope
npm publish --access public
```

### 8. Verify Publication

```bash
# Check npm registry
npm view create-my-exam

# Test installation
npm install -g create-my-exam
create-my-exam --version
```

## Publishing Updates

### For Minor Updates (1.0.x)

```bash
# Update version
npm version patch

# Publish
npm publish

# Push to GitHub
git push origin main --tags
```

### For Feature Releases (1.x.0)

```bash
# Update version
npm version minor

# Publish
npm publish

# Push to GitHub
git push origin main --tags
```

### For Major Releases (x.0.0)

```bash
# Update version
npm version major

# Update CHANGELOG
# Update README if needed

# Publish
npm publish

# Push to GitHub
git push origin main --tags
```

## Version Numbering (Semantic Versioning)

- **MAJOR** (1.0.0) - Breaking changes
- **MINOR** (1.1.0) - New features, backward compatible
- **PATCH** (1.0.1) - Bug fixes

## Unpublishing (If Needed)

⚠️ **Warning: npm only allows unpublishing within 72 hours**

```bash
# Unpublish version
npm unpublish create-my-exam@1.0.0

# Unpublish entire package (nuclear option)
npm unpublish create-my-exam -f
```

## Deprecating Versions

```bash
# Deprecate specific version
npm deprecate create-my-exam@1.0.0 "Use version 1.1.0 instead"

# Deprecate all versions
npm deprecate create-my-exam "Project moved to new location"
```

## Publishing with Scoped Package

If you want a scoped package (@yourscope/create-my-exam):

```json
{
  "name": "@yourscope/create-my-exam",
  "publishConfig": {
    "access": "public"
  }
}
```

Then publish:
```bash
npm publish --access public
```

## CI/CD Automation (GitHub Actions)

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - run: npm ci
      
      - run: npm test
      
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Creating npm Token

1. Go to https://www.npmjs.com/settings/tokens
2. Create new token (Automation)
3. Add to GitHub Secrets as NPM_TOKEN

## Marketing

After publishing:

1. **Announce on social media**
   - Twitter
   - Dev.to
   - Hashnode
   - LinkedIn

2. **Submit to awesome lists**
   - awesome-nodejs
   - awesome-cli-tools
   - awesome-generators

3. **Create documentation**
   - Blog post about features
   - Tutorial video
   - Example projects

4. **Engage community**
   - Star on GitHub
   - Share feedback
   - Respond to issues

## Best Practices

### Code Quality
- Run tests before publishing
- Use linter
- Check for security vulnerabilities
- Document all features

### Version Management
- Use semantic versioning
- Update CHANGELOG
- Tag releases in Git
- Document breaking changes

### Maintenance
- Respond to issues quickly
- Fix security vulnerabilities
- Keep dependencies updated
- Plan feature roadmap

### Documentation
- Keep README updated
- Document all options
- Provide examples
- Include troubleshooting

## Troubleshooting

### "You must be logged in"
```bash
npm login
npm whoami
```

### "Package name not available"
```bash
# Check if available
npm view package-name
# Use different name or scope
```

### "Failed to create tarball"
```bash
# Check .npmignore
# Verify file permissions
# Try verbose mode
npm publish --verbose
```

### "No files found"
```bash
# Check that files aren't ignored
npm pack --dry-run
```

## Post-Publication Checklist

- [ ] Verified on npm registry
- [ ] Installation works globally
- [ ] bin/create-my-exam.js is executable
- [ ] Help command works
- [ ] Announced on social media
- [ ] Added to awesome lists
- [ ] GitHub releases created
- [ ] Documentation is updated
- [ ] License file is present
- [ ] Contributing guidelines are clear

## Maintenance Schedule

- **Weekly**: Review issues and PRs
- **Monthly**: Update dependencies
- **Quarterly**: Release new features
- **Annually**: Major version planning

## Support Channels

- GitHub Issues
- Email support
- Twitter/X for announcements
- Discord community (optional)

## Future Versions Roadmap

Example roadmap:

- **v1.1.0** - Template marketplace
- **v1.2.0** - Visual setup wizard
- **v2.0.0** - Plugin system
- **v2.1.0** - Cloud deployment integration

## Resources

- [npm Official Guide](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/)
- [Publish Best Practices](https://docs.npmjs.com/cli/publish)
- [Security in npm](https://docs.npmjs.com/policies/security)

---

Ready to publish? Let's go! 🚀
