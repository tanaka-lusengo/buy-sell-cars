# GitHub Actions CI/CD Pipeline

This repository includes a comprehensive CI/CD pipeline built with GitHub Actions to ensure code quality, security, and reliable deployments.

## 🚀 Workflows Overview

### 1. **CI/CD Pipeline** (`ci.yml`)

**Triggers:** Push to `main`/`develop`, Pull Requests

**What it does:**

- 🔍 **Setup & Dependencies**: Caches dependencies for faster builds
- 🧹 **Linting**: Runs ESLint and Prettier checks
- 🔍 **Type Checking**: Validates TypeScript types
- 🧪 **Testing**: Runs all test suites with coverage
- 🏗️ **Building**: Builds both apps (South Africa & Zimbabwe)
- 🔒 **Security Audit**: Checks for vulnerabilities
- 📊 **Bundle Analysis**: Analyzes bundle sizes (main branch only)

### 2. **Dependency Updates** (`dependency-updates.yml`)

**Triggers:** Weekly (Mondays 9 AM UTC), Manual

**What it does:**

- 📦 Checks for outdated dependencies
- 🔄 Updates to latest compatible versions
- 🧪 Runs tests to ensure compatibility
- 📝 Creates automated PR with changes

### 3. **Code Quality** (`code-quality.yml`)

**Triggers:** Pull Requests, Push to `main`

**What it does:**

- 📊 Complexity analysis
- 🔍 Dead code detection
- 📝 TODO/FIXME comment tracking
- 📦 Package.json consistency checks
- ⚡ Performance budget validation
- 📈 Quality summary reports

### 4. **Performance Monitoring** (`performance.yml`)

**Triggers:** Pull Requests, Daily (6 AM UTC)

**What it does:**

- 🏎️ Lighthouse performance testing
- 📊 Bundle size analysis
- 🧠 Memory usage monitoring
- 📈 Performance score tracking
- 💬 PR comments with results

## 🛠️ Quick Start

### Prerequisites

1. Install GitHub CLI: `brew install gh` (macOS) or visit [cli.github.com](https://cli.github.com/)
2. Authenticate: `gh auth login`

### Using the Management Script

We've included a helpful script to manage GitHub Actions:

```bash
# Make the script executable (first time only)
chmod +x scripts/github-actions.sh

# Show all available workflows
./scripts/github-actions.sh workflows

# Run local checks before pushing
./scripts/github-actions.sh check

# View recent workflow runs
./scripts/github-actions.sh runs

# Trigger specific workflows manually
./scripts/github-actions.sh deps        # Dependency updates
./scripts/github-actions.sh quality     # Code quality analysis
./scripts/github-actions.sh performance # Performance testing

# Get help
./scripts/github-actions.sh help
```

## 📊 Workflow Status Badges

Add these badges to your main README to show workflow status:

```markdown
![CI/CD](https://github.com/tanaka-lusengo/buy-sell-cars/workflows/CI%2FCD%20Pipeline/badge.svg)
![Code Quality](https://github.com/tanaka-lusengo/buy-sell-cars/workflows/Code%20Quality/badge.svg)
![Performance](https://github.com/tanaka-lusengo/buy-sell-cars/workflows/Performance%20Monitoring/badge.svg)
```

## 🔧 Configuration

### Environment Variables

Some workflows may require environment variables. Add these to your repository secrets:

- `GITHUB_TOKEN`: Automatically provided by GitHub Actions
- Add any deployment-specific secrets as needed

### Performance Budgets

The code quality workflow includes performance budgets:

- **JavaScript bundles**: 500KB max
- **CSS bundles**: 100KB max

Adjust these in `.github/workflows/code-quality.yml` if needed.

### Lighthouse Thresholds

Performance monitoring uses these thresholds:

- **Performance score**: 80% minimum
- **Accessibility score**: Tracked and reported
- **Best Practices score**: Tracked and reported
- **SEO score**: Tracked and reported

## 🚦 Branch Protection Rules

For maximum effectiveness, configure these branch protection rules on your `main` branch:

1. **Require status checks to pass**:

    - `lint`
    - `type-check`
    - `test`
    - `build`

2. **Require pull request reviews**: 1 reviewer minimum

3. **Dismiss stale reviews**: When new commits are pushed

4. **Require up-to-date branches**: Before merging

## 📈 Monitoring & Reports

### Artifacts Generated

- **Test Coverage Reports**: Available for 7 days
- **Performance Reports**: Available for 30 days
- **Code Quality Reports**: Available for 7 days
- **Build Artifacts**: Available for 1 day

### Notifications

- **Failed workflows**: GitHub will notify via email/web
- **PR comments**: Performance results posted automatically
- **Dependency updates**: Weekly PR created automatically

## Troubleshooting

### Common Issues

**1. Workflow fails with "No space left on device"**

- Solution: Workflows use caching to prevent this. If it persists, clear caches in Actions settings.

**2. Tests fail in CI but pass locally**

- Check: Environment differences, timezone issues, or missing environment variables.

**3. Build artifacts are too large**

- Check: Bundle analysis reports for optimization opportunities.

**4. Dependency updates break tests**

- The workflow will automatically fail and not create a PR if tests don't pass.

### Getting Help

1. Check workflow logs in the Actions tab
2. Review the management script output
3. Check this documentation
4. Create an issue in the repository

## 🔐 Security

### Best Practices Implemented

- ✅ Dependency vulnerability scanning
- ✅ Automated security updates
- ✅ Code quality checks
- ✅ No secrets in code (use GitHub secrets)
- ✅ Limited permissions for workflows

### Security Scanning

- **npm audit**: Checks for known vulnerabilities
- **Dependency updates**: Automated weekly updates
- **Bundle analysis**: Checks for suspicious large files

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turbo Monorepo Guide](https://turbo.build/repo/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

**Happy coding! 🚀**
