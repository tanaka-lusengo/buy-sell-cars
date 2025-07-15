# GitHub Actions CI/CD Pipeline

This repository includes a lean and effective CI/CD pipeline built with GitHub Actions to ensure code quality, security, and reliable deployments.

## 🚀 Workflows Overview

### 1. **CI** (`ci.yml`)

**Triggers:** Push to `main`/`develop`, Pull Requests

**What it does:**

- 🔍 **Setup & Dependencies**: Installs dependencies with pnpm
- 🧹 **Linting**: ESLint and Prettier checks
- 🔍 **Type Checking**: TypeScript validation
- 🧪 **Testing**: Complete test suite
- 🏗️ **Building**: Builds both apps (South Africa & Zimbabwe)
- 🔒 **Security Audit**: Vulnerability checks (main branch only)

### 2. **Dependency Updates** (`dependency-updates.yml`)

**Triggers:** Weekly (Mondays 9 AM UTC), Manual

**What it does:**

- 📦 Checks for outdated dependencies
- 🔄 Updates to latest compatible versions
- 🧪 Runs tests to ensure compatibility
- 📝 Creates automated PR with changes

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

# Get help
./scripts/github-actions.sh help
```

## 📊 Workflow Status Badges

Add this badge to your main README to show workflow status:

```markdown
![CI](https://github.com/tanaka-lusengo/buy-sell-cars/workflows/CI/badge.svg)
```

## 🔧 Configuration

### Environment Variables

Some workflows may require environment variables. Add these to your repository secrets:

- `GITHUB_TOKEN`: Automatically provided by GitHub Actions
- Add any deployment-specific secrets as needed

## 🚦 Branch Protection Rules

For maximum effectiveness, configure these branch protection rules on your `main` branch:

1. **Require status checks to pass**:

    - `CI` (includes lint, type-check, test, build)

2. **Require pull request reviews**: 1 reviewer minimum

3. **Dismiss stale reviews**: When new commits are pushed

4. **Require up-to-date branches**: Before merging

## 📈 Monitoring & Reports

### Artifacts Generated

- **Build Artifacts**: Available for 1 day

### Notifications

- **Failed workflows**: GitHub will notify via email/web
- **Dependency updates**: Weekly PR created automatically

## Troubleshooting

### Common Issues

**1. Workflow fails with dependency issues**

- Solution: Check the dependency update PR and resolve conflicts manually.

**2. Tests fail in CI but pass locally**

- Check: Environment differences, timezone issues, or missing environment variables.

**3. Build fails in CI**

- Check: Build logs for specific errors and ensure all dependencies are properly installed.

### Getting Help

1. Check workflow logs in the Actions tab
2. Review the management script output
3. Check this documentation
4. Create an issue in the repository

## 🔐 Security

### Best Practices Implemented

- ✅ Dependency vulnerability scanning
- ✅ Automated security updates
- ✅ Essential code quality checks (via CI workflow)
- ✅ No secrets in code (use GitHub secrets)
- ✅ Limited permissions for workflows

### Security Scanning

- **npm audit**: Checks for known vulnerabilities (main branch)
- **Dependency updates**: Automated weekly updates
- **Build verification**: Ensures builds complete successfully

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turbo Monorepo Guide](https://turbo.build/repo/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

**Happy coding! 🚀**
