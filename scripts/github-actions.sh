#!/bin/bash

# GitHub Actions Management Script for Buy Sell Cars Monorepo
# This script helps you interact with GitHub Actions workflows

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_OWNER="your-username"  # Replace with your GitHub username
REPO_NAME="buy-sell-cars"   # Replace with your repository name
GITHUB_TOKEN="${GITHUB_TOKEN:-}"

# Helper functions
print_header() {
    echo -e "${BLUE}===================================${NC}"
    echo -e "${BLUE}  GitHub Actions Management Tool${NC}"
    echo -e "${BLUE}===================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️ $1${NC}"
}

check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check if gh CLI is installed
    if ! command -v gh &> /dev/null; then
        print_error "GitHub CLI (gh) is not installed. Please install it first:"
        echo "  brew install gh  # macOS"
        echo "  # or visit https://cli.github.com/"
        exit 1
    fi
    
    # Check if logged in to GitHub
    if ! gh auth status &> /dev/null; then
        print_warning "Not logged in to GitHub. Running authentication..."
        gh auth login
    fi
    
    # Check if in a git repository
    if ! git rev-parse --git-dir &> /dev/null; then
        print_error "Not in a git repository"
        exit 1
    fi
    
    print_success "Prerequisites checked"
}

show_workflows() {
    print_info "Available GitHub Actions workflows:"
    echo ""
    echo "1. 🔄 CI/CD Pipeline (ci.yml)"
    echo "   - Runs on: push to main/develop, pull requests"
    echo "   - Actions: lint, test, type-check, build, security audit"
    echo ""
    echo "2. 📦 Dependency Updates (dependency-updates.yml)"
    echo "   - Runs on: weekly schedule, manual trigger"
    echo "   - Actions: update dependencies, create PR"
    echo ""
    echo "3. 🔍 Code Quality (code-quality.yml)"
    echo "   - Runs on: pull requests, push to main"
    echo "   - Actions: complexity analysis, dead code detection, bundle analysis"
    echo ""
    echo "4. ⚡ Performance Monitoring (performance.yml)"
    echo "   - Runs on: pull requests, daily schedule"
    echo "   - Actions: Lighthouse tests, bundle size analysis"
    echo ""
}

trigger_workflow() {
    local workflow_file="$1"
    local workflow_name="$2"
    
    print_info "Triggering $workflow_name workflow..."
    
    if gh workflow run "$workflow_file"; then
        print_success "$workflow_name workflow triggered successfully!"
        print_info "View the workflow run at: https://github.com/$REPO_OWNER/$REPO_NAME/actions"
    else
        print_error "Failed to trigger $workflow_name workflow"
        return 1
    fi
}

view_workflow_runs() {
    print_info "Recent workflow runs:"
    gh run list --limit 10
}

view_workflow_status() {
    local workflow_file="$1"
    print_info "Status for $workflow_file:"
    gh run list --workflow="$workflow_file" --limit 5
}

run_local_checks() {
    print_info "Running local checks before pushing..."
    
    # Run linting
    print_info "Running linting..."
    if pnpm run -r lint; then
        print_success "Linting passed"
    else
        print_error "Linting failed"
        return 1
    fi
    
    # Run type checking
    print_info "Running type checking..."
    if pnpm run -r type-check; then
        print_success "Type checking passed"
    else
        print_error "Type checking failed"
        return 1
    fi
    
    # Run tests
    print_info "Running tests..."
    if pnpm run -r test; then
        print_success "Tests passed"
    else
        print_error "Tests failed"
        return 1
    fi
    
    # Run builds
    print_info "Running builds..."
    if pnpm run -r build; then
        print_success "Builds passed"
    else
        print_error "Builds failed"
        return 1
    fi
    
    print_success "All local checks passed! Ready to push."
}

show_help() {
    print_header
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  workflows           Show all available workflows"
    echo "  runs               Show recent workflow runs"
    echo "  status <workflow>  Show status for specific workflow"
    echo "  trigger <workflow> Trigger a workflow manually"
    echo "  check              Run local checks before pushing"
    echo "  deps               Trigger dependency update workflow"
    echo "  quality            Trigger code quality workflow"
    echo "  performance        Trigger performance workflow"
    echo "  help               Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 workflows                    # List all workflows"
    echo "  $0 runs                        # Show recent runs"
    echo "  $0 trigger ci.yml              # Trigger CI workflow"
    echo "  $0 status ci.yml               # Show CI workflow status"
    echo "  $0 check                       # Run local checks"
    echo ""
}

main() {
    case "${1:-help}" in
        "workflows")
            print_header
            check_prerequisites
            show_workflows
            ;;
        "runs")
            print_header
            check_prerequisites
            view_workflow_runs
            ;;
        "status")
            if [[ -z "$2" ]]; then
                print_error "Please specify a workflow file (e.g., ci.yml)"
                exit 1
            fi
            print_header
            check_prerequisites
            view_workflow_status "$2"
            ;;
        "trigger")
            if [[ -z "$2" ]]; then
                print_error "Please specify a workflow file (e.g., ci.yml)"
                exit 1
            fi
            print_header
            check_prerequisites
            trigger_workflow "$2" "$(basename "$2" .yml)"
            ;;
        "check")
            print_header
            run_local_checks
            ;;
        "deps")
            print_header
            check_prerequisites
            trigger_workflow "dependency-updates.yml" "Dependency Updates"
            ;;
        "quality")
            print_header
            check_prerequisites
            trigger_workflow "code-quality.yml" "Code Quality"
            ;;
        "performance")
            print_header
            check_prerequisites
            trigger_workflow "performance.yml" "Performance Monitoring"
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Run main function with all arguments
main "$@"
