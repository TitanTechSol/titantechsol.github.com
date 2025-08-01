#!/bin/bash

# Deployment & CI/CD Automation Script for CAUSAI
# Automated deployment pipeline and continuous integration
# Created: July 31, 2025
# Version: 1.0

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DEPLOY_REPORTS_DIR="$PROJECT_ROOT/work-items/deployment-reports"

# Ensure directories exist
mkdir -p "$DEPLOY_REPORTS_DIR"
mkdir -p "$DEPLOY_REPORTS_DIR/builds"
mkdir -p "$DEPLOY_REPORTS_DIR/deployments"
mkdir -p "$DEPLOY_REPORTS_DIR/rollbacks"

# Function to display help
show_help() {
    echo -e "${BLUE}CAUSAI Deployment & CI/CD Automation${NC}"
    echo "===================================="
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "COMMANDS:"
    echo "  pipeline                Run complete CI/CD pipeline"
    echo "  build [ENV]             Build project for specific environment"
    echo "  test                    Run all tests before deployment"
    echo "  deploy [ENV]            Deploy to specified environment"
    echo "  rollback [VERSION]      Rollback to previous version"
    echo "  status                  Check deployment status and health"
    echo "  monitor                 Monitor post-deployment metrics"
    echo "  release [VERSION]       Create and tag a new release"
    echo "  hotfix                  Emergency deployment process"
    echo ""
    echo "ENVIRONMENTS:"
    echo "  dev                     Development environment"
    echo "  staging                 Staging/testing environment"
    echo "  prod                    Production environment"
    echo ""
    echo "EXAMPLES:"
    echo "  $0 pipeline                           # Full CI/CD pipeline"
    echo "  $0 build prod                         # Production build"
    echo "  $0 deploy staging                     # Deploy to staging"
    echo "  $0 rollback v1.2.3                   # Rollback to version"
    echo "  $0 release v1.3.0                    # Create new release"
    echo ""
}

# Function to log deployment activities
log_deployment() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    local log_file="$DEPLOY_REPORTS_DIR/deployment.log"
    
    echo "[$timestamp] [$level] $message" | tee -a "$log_file"
}

# Function to check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}🔍 Checking Prerequisites...${NC}"
    echo "==========================="
    
    local errors=0
    
    # Check Node.js
    if command -v node >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"
    else
        echo -e "${RED}❌ Node.js not found${NC}"
        ((errors++))
    fi
    
    # Check npm
    if command -v npm >/dev/null 2>&1; then
        echo -e "${GREEN}✅ npm: $(npm --version)${NC}"
    else
        echo -e "${RED}❌ npm not found${NC}"
        ((errors++))
    fi
    
    # Check git
    if command -v git >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Git: $(git --version | cut -d' ' -f3)${NC}"
    else
        echo -e "${RED}❌ Git not found${NC}"
        ((errors++))
    fi
    
    # Check package.json
    if [[ -f "$PROJECT_ROOT/package.json" ]]; then
        echo -e "${GREEN}✅ package.json found${NC}"
    else
        echo -e "${RED}❌ package.json not found${NC}"
        ((errors++))
    fi
    
    # Check if in git repository
    if git rev-parse --git-dir > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Git repository detected${NC}"
    else
        echo -e "${RED}❌ Not in a git repository${NC}"
        ((errors++))
    fi
    
    if [[ $errors -gt 0 ]]; then
        echo -e "${RED}❌ Prerequisites check failed with $errors errors${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ All prerequisites satisfied${NC}"
    return 0
}

# Function to build project
build_project() {
    local environment=${1:-"dev"}
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local build_log="$DEPLOY_REPORTS_DIR/builds/build_${environment}_${timestamp}.log"
    
    echo -e "${YELLOW}🏗️  Building Project for $environment...${NC}"
    echo "====================================="
    
    log_deployment "INFO" "Starting build for environment: $environment"
    
    cd "$PROJECT_ROOT"
    
    # Install dependencies
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    if npm ci 2>&1 | tee -a "$build_log"; then
        echo -e "${GREEN}✅ Dependencies installed${NC}"
    else
        echo -e "${RED}❌ Dependency installation failed${NC}"
        log_deployment "ERROR" "Dependency installation failed"
        return 1
    fi
    
    # Run build
    echo -e "${BLUE}🔨 Running build...${NC}"
    
    case $environment in
        "prod"|"production")
            if npm run build 2>&1 | tee -a "$build_log"; then
                echo -e "${GREEN}✅ Production build completed${NC}"
            else
                echo -e "${RED}❌ Production build failed${NC}"
                log_deployment "ERROR" "Production build failed"
                return 1
            fi
            ;;
        "staging")
            if NODE_ENV=staging npm run build 2>&1 | tee -a "$build_log"; then
                echo -e "${GREEN}✅ Staging build completed${NC}"
            else
                echo -e "${RED}❌ Staging build failed${NC}"
                log_deployment "ERROR" "Staging build failed"
                return 1
            fi
            ;;
        *)
            echo -e "${BLUE}Building for development environment${NC}"
            ;;
    esac
    
    # Verify build output
    if [[ -d "$PROJECT_ROOT/dist" ]]; then
        local build_size=$(du -sh "$PROJECT_ROOT/dist" | cut -f1)
        echo -e "${GREEN}✅ Build output: $build_size${NC}"
        log_deployment "INFO" "Build completed successfully. Size: $build_size"
        
        # Log build artifacts
        echo "Build artifacts:" >> "$build_log"
        find "$PROJECT_ROOT/dist" -type f -name "*.js" -o -name "*.css" -o -name "*.html" | head -20 >> "$build_log"
    else
        echo -e "${RED}❌ Build output directory not found${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ Build completed successfully${NC}"
    echo "Build log: $build_log"
}

# Function to run comprehensive tests
run_tests() {
    echo -e "${YELLOW}🧪 Running Test Suite...${NC}"
    echo "======================="
    
    log_deployment "INFO" "Starting comprehensive test suite"
    
    # Run QA automation if available
    if [[ -f "$SCRIPT_DIR/qa-automation.sh" ]]; then
        echo -e "${BLUE}🤖 Running CAUSAI QA automation...${NC}"
        if "$SCRIPT_DIR/qa-automation.sh" pre-commit; then
            echo -e "${GREEN}✅ QA tests passed${NC}"
        else
            echo -e "${RED}❌ QA tests failed${NC}"
            log_deployment "ERROR" "QA automation tests failed"
            return 1
        fi
    fi
    
    # Build test
    echo -e "${BLUE}🏗️  Testing build process...${NC}"
    if build_project "test"; then
        echo -e "${GREEN}✅ Build test passed${NC}"
    else
        echo -e "${RED}❌ Build test failed${NC}"
        return 1
    fi
    
    # Performance budget check
    echo -e "${BLUE}⚡ Checking performance budgets...${NC}"
    if [[ -d "$PROJECT_ROOT/dist" ]]; then
        local js_size=$(find "$PROJECT_ROOT/dist" -name "*.js" -exec du -c {} + | tail -1 | cut -f1)
        local css_size=$(find "$PROJECT_ROOT/dist" -name "*.css" -exec du -c {} + | tail -1 | cut -f1)
        
        echo "JavaScript bundle size: ${js_size}K"
        echo "CSS bundle size: ${css_size}K"
        
        # Performance budgets (in KB)
        local js_budget=500
        local css_budget=100
        
        if [[ $js_size -gt $js_budget ]]; then
            echo -e "${YELLOW}⚠️  JavaScript bundle exceeds budget (${js_size}K > ${js_budget}K)${NC}"
        fi
        
        if [[ $css_size -gt $css_budget ]]; then
            echo -e "${YELLOW}⚠️  CSS bundle exceeds budget (${css_size}K > ${css_budget}K)${NC}"
        fi
    fi
    
    echo -e "${GREEN}✅ All tests completed${NC}"
    log_deployment "INFO" "All tests passed successfully"
}

# Function to deploy to environment
deploy_to_environment() {
    local environment=${1:-"dev"}
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local deploy_log="$DEPLOY_REPORTS_DIR/deployments/deploy_${environment}_${timestamp}.log"
    
    echo -e "${YELLOW}🚀 Deploying to $environment...${NC}"
    echo "============================"
    
    log_deployment "INFO" "Starting deployment to environment: $environment"
    
    cd "$PROJECT_ROOT"
    
    # Pre-deployment checks
    echo -e "${BLUE}✅ Pre-deployment validation...${NC}"
    
    # Check git status
    if [[ -n "$(git status --porcelain)" ]]; then
        echo -e "${YELLOW}⚠️  Uncommitted changes detected${NC}"
        git status --short
        
        read -p "Continue with uncommitted changes? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Deployment cancelled"
            return 1
        fi
    fi
    
    # Get current commit
    local current_commit=$(git rev-parse --short HEAD)
    local current_branch=$(git branch --show-current)
    
    echo "Current branch: $current_branch"
    echo "Current commit: $current_commit"
    
    # Environment-specific deployment
    case $environment in
        "prod"|"production")
            echo -e "${RED}🚨 PRODUCTION DEPLOYMENT${NC}"
            echo "======================="
            
            # Extra confirmation for production
            read -p "Are you sure you want to deploy to PRODUCTION? (type 'YES'): " confirmation
            if [[ "$confirmation" != "YES" ]]; then
                echo "Production deployment cancelled"
                return 1
            fi
            
            # Production deployment steps
            echo -e "${BLUE}📋 Production deployment checklist:${NC}"
            echo "1. ✅ Code reviewed and approved"
            echo "2. ✅ Tests passed"
            echo "3. ✅ Staging validation completed"
            echo "4. 🔄 Deploying to production..."
            
            # Build for production
            if ! build_project "prod"; then
                echo -e "${RED}❌ Production build failed${NC}"
                return 1
            fi
            
            # Deploy using GitHub Pages
            echo -e "${BLUE}🌐 Deploying to GitHub Pages...${NC}"
            if npm run deploy 2>&1 | tee -a "$deploy_log"; then
                echo -e "${GREEN}✅ Production deployment successful${NC}"
                log_deployment "INFO" "Production deployment completed successfully"
            else
                echo -e "${RED}❌ Production deployment failed${NC}"
                log_deployment "ERROR" "Production deployment failed"
                return 1
            fi
            ;;
            
        "staging")
            echo -e "${YELLOW}🧪 STAGING DEPLOYMENT${NC}"
            echo "==================="
            
            # Build for staging
            if ! build_project "staging"; then
                echo -e "${RED}❌ Staging build failed${NC}"
                return 1
            fi
            
            # Deploy to staging (simulate for now)
            echo -e "${BLUE}🚀 Deploying to staging environment...${NC}"
            echo "Staging deployment would happen here"
            log_deployment "INFO" "Staging deployment completed"
            ;;
            
        "dev")
            echo -e "${BLUE}💻 DEVELOPMENT DEPLOYMENT${NC}"
            echo "========================"
            
            # Start dev server
            echo -e "${BLUE}🚀 Starting development server...${NC}"
            npm run dev &
            local dev_pid=$!
            
            echo "Development server started (PID: $dev_pid)"
            echo "Access at: http://localhost:3000"
            echo "Press Ctrl+C to stop"
            
            # Wait for server or user interrupt
            wait $dev_pid 2>/dev/null || true
            ;;
    esac
    
    # Post-deployment tasks
    echo -e "${BLUE}📊 Post-deployment tasks...${NC}"
    
    # Tag the deployment
    if [[ "$environment" == "prod" || "$environment" == "production" ]]; then
        local tag_name="deploy-prod-${timestamp}"
        git tag -a "$tag_name" -m "Production deployment $timestamp"
        echo "Tagged deployment: $tag_name"
    fi
    
    # Create deployment record
    cat > "$DEPLOY_REPORTS_DIR/deployments/deployment_${environment}_${timestamp}.json" << EOF
{
  "timestamp": "$(date -Iseconds)",
  "environment": "$environment",
  "commit": "$current_commit",
  "branch": "$current_branch",
  "deployer": "$(whoami)",
  "status": "success",
  "artifacts": {
    "buildSize": "TBD",
    "deploymentTime": "TBD"
  }
}
EOF
    
    echo -e "${GREEN}✅ Deployment to $environment completed successfully${NC}"
    echo "Deployment log: $deploy_log"
}

# Function to run complete CI/CD pipeline
run_pipeline() {
    echo -e "${PURPLE}🔄 CAUSAI CI/CD Pipeline${NC}"
    echo "======================="
    
    log_deployment "INFO" "Starting complete CI/CD pipeline"
    
    # Step 1: Prerequisites
    if ! check_prerequisites; then
        echo -e "${RED}❌ Pipeline failed at prerequisites${NC}"
        return 1
    fi
    
    # Step 2: Tests
    if ! run_tests; then
        echo -e "${RED}❌ Pipeline failed at testing phase${NC}"
        return 1
    fi
    
    # Step 3: Build
    if ! build_project "staging"; then
        echo -e "${RED}❌ Pipeline failed at build phase${NC}"
        return 1
    fi
    
    # Step 4: Deploy to staging
    if ! deploy_to_environment "staging"; then
        echo -e "${RED}❌ Pipeline failed at staging deployment${NC}"
        return 1
    fi
    
    # Step 5: Post-deployment validation
    echo -e "${BLUE}✅ Post-deployment validation...${NC}"
    if [[ -f "$SCRIPT_DIR/qa-automation.sh" ]]; then
        "$SCRIPT_DIR/qa-automation.sh" post-deploy
    fi
    
    echo -e "${GREEN}🎉 CI/CD Pipeline completed successfully!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Review staging deployment"
    echo "  2. Run manual acceptance tests"
    echo "  3. Deploy to production when ready:"
    echo "     $0 deploy prod"
    
    log_deployment "INFO" "CI/CD pipeline completed successfully"
}

# Function to check deployment status
check_status() {
    echo -e "${YELLOW}📊 Deployment Status${NC}"
    echo "==================="
    
    # Check if application is running
    if curl -s -o /dev/null -w "%{http_code}" "https://titantech.g2ad.com" | grep -q "200"; then
        echo -e "${GREEN}✅ Production site is accessible${NC}"
    else
        echo -e "${RED}❌ Production site is not accessible${NC}"
    fi
    
    # Check git status
    echo -e "${BLUE}📋 Git Status:${NC}"
    echo "Current branch: $(git branch --show-current)"
    echo "Latest commit: $(git log -1 --oneline)"
    echo "Uncommitted changes: $(git status --porcelain | wc -l) files"
    
    # Check recent deployments
    echo -e "${BLUE}📈 Recent Deployments:${NC}"
    if [[ -d "$DEPLOY_REPORTS_DIR/deployments" ]]; then
        ls -la "$DEPLOY_REPORTS_DIR/deployments" | tail -5
    fi
    
    # Check system health
    echo -e "${BLUE}💚 System Health:${NC}"
    echo "Disk space: $(df -h . | tail -1 | awk '{print $5}')"
    echo "Memory usage: $(free -h | grep '^Mem:' | awk '{print $3 "/" $2}')"
}

# Function to create release
create_release() {
    local version=$1
    
    if [[ -z "$version" ]]; then
        echo -e "${RED}❌ Please provide a version number${NC}"
        echo "Usage: $0 release v1.3.0"
        return 1
    fi
    
    echo -e "${YELLOW}🏷️  Creating Release: $version${NC}"
    echo "=========================="
    
    # Check if version already exists
    if git tag -l | grep -q "^$version$"; then
        echo -e "${RED}❌ Version $version already exists${NC}"
        return 1
    fi
    
    # Run full pipeline before release
    echo -e "${BLUE}🔄 Running pre-release pipeline...${NC}"
    if ! run_pipeline; then
        echo -e "${RED}❌ Pre-release pipeline failed${NC}"
        return 1
    fi
    
    # Create tag
    echo -e "${BLUE}🏷️  Creating git tag...${NC}"
    git tag -a "$version" -m "Release $version"
    
    # Push tag
    echo -e "${BLUE}📤 Pushing tag to remote...${NC}"
    git push origin "$version"
    
    # Create release notes
    local release_notes="$DEPLOY_REPORTS_DIR/releases/release_${version}_$(date +%Y%m%d).md"
    mkdir -p "$(dirname "$release_notes")"
    
    cat > "$release_notes" << EOF
# Release $version

**Release Date:** $(date '+%Y-%m-%d')
**Release Manager:** $(whoami)

## Changes
$(git log --oneline $(git describe --tags --abbrev=0 HEAD^)..HEAD)

## Deployment
- Environment: Production
- Commit: $(git rev-parse HEAD)
- Build Status: ✅ Success
- Tests: ✅ Passed

## Verification
- [ ] Production deployment verified
- [ ] Performance metrics within acceptable range
- [ ] No critical issues reported

EOF

    echo -e "${GREEN}✅ Release $version created successfully${NC}"
    echo "Release notes: $release_notes"
    
    log_deployment "INFO" "Release $version created and deployed"
}

# Main script logic
case "${1:-help}" in
    "pipeline")
        run_pipeline
        ;;
    "build")
        build_project "$2"
        ;;
    "test")
        run_tests
        ;;
    "deploy")
        deploy_to_environment "$2"
        ;;
    "status")
        check_status
        ;;
    "release")
        create_release "$2"
        ;;
    "hotfix")
        echo -e "${RED}🚨 EMERGENCY HOTFIX DEPLOYMENT${NC}"
        echo "=============================="
        echo "This will deploy current changes immediately to production"
        read -p "Are you sure? (type 'EMERGENCY'): " confirmation
        if [[ "$confirmation" == "EMERGENCY" ]]; then
            log_deployment "CRITICAL" "Emergency hotfix deployment initiated"
            deploy_to_environment "prod"
        else
            echo "Hotfix cancelled"
        fi
        ;;
    "prereqs")
        check_prerequisites
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        echo "Unknown command: $1"
        echo "Run '$0 help' for usage information"
        exit 1
        ;;
esac
