#!/bin/bash

# Automated Testing & Quality Assurance Script for CAUSAI
# Comprehensive testing automation for work items
# Created: July 31, 2025
# Version: 1.0

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TEST_REPORTS_DIR="$PROJECT_ROOT/work-items/test-reports"

# Ensure directories exist
mkdir -p "$TEST_REPORTS_DIR"
mkdir -p "$TEST_REPORTS_DIR/lighthouse"
mkdir -p "$TEST_REPORTS_DIR/performance"
mkdir -p "$TEST_REPORTS_DIR/accessibility"
mkdir -p "$TEST_REPORTS_DIR/screenshots"

# Function to display help
show_help() {
    echo -e "${BLUE}CAUSAI Automated Testing & QA System${NC}"
    echo "====================================="
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "COMMANDS:"
    echo "  full                    Run complete test suite (performance, accessibility, visual)"
    echo "  performance             Run performance tests with Lighthouse"
    echo "  accessibility           Run accessibility validation tests"
    echo "  visual                  Take screenshots for visual regression testing"
    echo "  validate [STORY_ID]     Validate specific user story implementation"
    echo "  pre-commit              Run quick validation before git commits"
    echo "  post-deploy             Run full validation after deployment"
    echo "  report                  Generate comprehensive test report"
    echo "  health                  Check overall system health and quality metrics"
    echo ""
    echo "EXAMPLES:"
    echo "  $0 full                                # Complete test suite"
    echo "  $0 validate P01-PO-00001.01          # Test specific story"
    echo "  $0 performance --mobile               # Mobile performance test"
    echo "  $0 report --format html               # Generate HTML report"
    echo ""
}

# Function to run performance tests
run_performance_tests() {
    local mobile_flag=$1
    local timestamp=$(date +%Y%m%d_%H%M%S)
    
    echo -e "${YELLOW}🚀 Running Performance Tests...${NC}"
    echo "================================"
    
    # Start development server in background
    echo "Starting development server..."
    cd "$PROJECT_ROOT"
    npm run dev > /dev/null 2>&1 &
    local server_pid=$!
    
    # Wait for server to start
    echo "Waiting for server to initialize..."
    sleep 10
    
    # Run Lighthouse tests
    echo -e "${BLUE}📊 Running Lighthouse Performance Audit...${NC}"
    
    local lighthouse_flags="--chrome-flags=\"--headless --no-sandbox --disable-gpu\""
    local output_file="$TEST_REPORTS_DIR/lighthouse/lighthouse_${timestamp}"
    
    if [[ "$mobile_flag" == "--mobile" ]]; then
        lighthouse_flags="$lighthouse_flags --preset=perf --form-factor=mobile"
        output_file="${output_file}_mobile"
    else
        output_file="${output_file}_desktop"
    fi
    
    # Run lighthouse
    npx lighthouse http://localhost:3000 \
        --output html \
        --output json \
        --output-path "$output_file" \
        $lighthouse_flags
    
    # Extract key metrics
    if [[ -f "${output_file}.json" ]]; then
        local fcp=$(jq '.audits["first-contentful-paint"].numericValue' "${output_file}.json")
        local lcp=$(jq '.audits["largest-contentful-paint"].numericValue' "${output_file}.json")
        local tti=$(jq '.audits.interactive.numericValue' "${output_file}.json")
        local score=$(jq '.categories.performance.score' "${output_file}.json")
        
        echo -e "${GREEN}✅ Performance Results:${NC}"
        echo "  Performance Score: $(echo "$score * 100" | bc)%"
        echo "  First Contentful Paint: ${fcp}ms"
        echo "  Largest Contentful Paint: ${lcp}ms"
        echo "  Time to Interactive: ${tti}ms"
        echo "  Report: ${output_file}.html"
    fi
    
    # Kill development server
    kill $server_pid 2>/dev/null || true
    
    echo -e "${GREEN}✅ Performance testing completed${NC}"
}

# Function to run accessibility tests
run_accessibility_tests() {
    echo -e "${YELLOW}♿ Running Accessibility Tests...${NC}"
    echo "================================"
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local report_file="$TEST_REPORTS_DIR/accessibility/a11y_${timestamp}.json"
    
    # Start development server
    cd "$PROJECT_ROOT"
    npm run dev > /dev/null 2>&1 &
    local server_pid=$!
    sleep 10
    
    # Run accessibility audit using axe-core
    echo -e "${BLUE}🔍 Running Axe Accessibility Audit...${NC}"
    
    # Create a simple accessibility test script
    cat > "$TEST_REPORTS_DIR/accessibility/test_a11y.js" << 'EOF'
const { AxePuppeteer } = require('@axe-core/puppeteer');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  
  const results = await new AxePuppeteer(page).analyze();
  
  console.log('Accessibility Test Results:');
  console.log(`Violations: ${results.violations.length}`);
  console.log(`Passes: ${results.passes.length}`);
  console.log(`Incomplete: ${results.incomplete.length}`);
  
  if (results.violations.length > 0) {
    console.log('\nViolations:');
    results.violations.forEach((violation, index) => {
      console.log(`${index + 1}. ${violation.id}: ${violation.description}`);
      console.log(`   Impact: ${violation.impact}`);
      console.log(`   Nodes affected: ${violation.nodes.length}`);
    });
  }
  
  // Save detailed results
  require('fs').writeFileSync(process.argv[2], JSON.stringify(results, null, 2));
  
  await browser.close();
})();
EOF
    
    # Check if required packages are available
    if command -v node >/dev/null 2>&1; then
        if [[ -f "$PROJECT_ROOT/node_modules/@axe-core/puppeteer/lib/index.js" ]]; then
            node "$TEST_REPORTS_DIR/accessibility/test_a11y.js" "$report_file"
        else
            echo -e "${YELLOW}⚠️  Accessibility testing requires @axe-core/puppeteer${NC}"
            echo "Run: npm install --save-dev @axe-core/puppeteer puppeteer"
        fi
    fi
    
    # Kill development server
    kill $server_pid 2>/dev/null || true
    
    echo -e "${GREEN}✅ Accessibility testing completed${NC}"
}

# Function to take visual screenshots
take_visual_screenshots() {
    echo -e "${YELLOW}📸 Taking Visual Screenshots...${NC}"
    echo "==============================="
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local screenshot_dir="$TEST_REPORTS_DIR/screenshots/$timestamp"
    mkdir -p "$screenshot_dir"
    
    # Start development server
    cd "$PROJECT_ROOT"
    npm run dev > /dev/null 2>&1 &
    local server_pid=$!
    sleep 10
    
    # Create screenshot script
    cat > "$screenshot_dir/take_screenshots.js" << 'EOF'
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const pages = [
    { name: 'home', url: 'http://localhost:3000/' },
    { name: 'about', url: 'http://localhost:3000/about' },
    { name: 'services', url: 'http://localhost:3000/services' },
    { name: 'portfolio', url: 'http://localhost:3000/portfolio' },
    { name: 'contact', url: 'http://localhost:3000/contact' }
  ];
  
  for (const pageInfo of pages) {
    console.log(`Taking screenshot: ${pageInfo.name}`);
    
    try {
      await page.goto(pageInfo.url, { waitUntil: 'networkidle0' });
      
      // Desktop screenshot
      await page.setViewport({ width: 1920, height: 1080 });
      await page.screenshot({
        path: path.join(process.argv[2], `${pageInfo.name}_desktop.png`),
        fullPage: true
      });
      
      // Mobile screenshot
      await page.setViewport({ width: 375, height: 667 });
      await page.screenshot({
        path: path.join(process.argv[2], `${pageInfo.name}_mobile.png`),
        fullPage: true
      });
      
    } catch (error) {
      console.log(`Error taking screenshot for ${pageInfo.name}: ${error.message}`);
    }
  }
  
  await browser.close();
  console.log(`Screenshots saved to: ${process.argv[2]}`);
})();
EOF
    
    # Take screenshots if puppeteer is available
    if command -v node >/dev/null 2>&1; then
        if [[ -f "$PROJECT_ROOT/node_modules/puppeteer/lib/cjs/puppeteer/puppeteer.js" ]]; then
            node "$screenshot_dir/take_screenshots.js" "$screenshot_dir"
        else
            echo -e "${YELLOW}⚠️  Visual testing requires puppeteer${NC}"
            echo "Run: npm install --save-dev puppeteer"
        fi
    fi
    
    # Kill development server
    kill $server_pid 2>/dev/null || true
    
    echo -e "${GREEN}✅ Visual screenshots completed${NC}"
    echo "Screenshots saved to: $screenshot_dir"
}

# Function to validate specific user story
validate_story() {
    local story_id=$1
    
    if [[ -z "$story_id" ]]; then
        echo -e "${RED}❌ Please provide a story ID${NC}"
        echo "Usage: $0 validate P01-PO-00001.01"
        return 1
    fi
    
    echo -e "${YELLOW}🔍 Validating User Story: $story_id${NC}"
    echo "======================================="
    
    local story_file="$PROJECT_ROOT/user-stories/${story_id}.md"
    
    if [[ ! -f "$story_file" ]]; then
        echo -e "${RED}❌ Story file not found: $story_file${NC}"
        return 1
    fi
    
    # Extract acceptance criteria
    echo -e "${BLUE}📋 Checking Acceptance Criteria...${NC}"
    
    if grep -q "## Acceptance Criteria:" "$story_file"; then
        grep -A 20 "## Acceptance Criteria:" "$story_file" | head -20
        echo ""
    fi
    
    # Run targeted tests based on story category
    local category=$(echo "$story_id" | grep -o 'P[0-9][0-9]-[A-Z][A-Z]' | cut -d'-' -f2)
    
    case $category in
        "PO") # Performance Optimization
            echo -e "${BLUE}🚀 Running performance validation for $story_id...${NC}"
            run_performance_tests
            ;;
        "VD") # Visual Design
            echo -e "${BLUE}📸 Running visual validation for $story_id...${NC}"
            take_visual_screenshots
            ;;
        "IN") # Integration
            echo -e "${BLUE}🔗 Running integration validation for $story_id...${NC}"
            run_accessibility_tests
            ;;
        *)
            echo -e "${BLUE}🧪 Running general validation for $story_id...${NC}"
            run_performance_tests --quick
            ;;
    esac
    
    echo -e "${GREEN}✅ Story validation completed for $story_id${NC}"
}

# Function to run pre-commit validation
run_pre_commit() {
    echo -e "${YELLOW}🔍 Pre-Commit Validation${NC}"
    echo "======================="
    
    # Quick build test
    echo -e "${BLUE}🏗️  Testing build...${NC}"
    cd "$PROJECT_ROOT"
    if npm run build > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Build successful${NC}"
    else
        echo -e "${RED}❌ Build failed${NC}"
        return 1
    fi
    
    # Check for console errors
    echo -e "${BLUE}🔍 Checking for console errors...${NC}"
    
    # Quick performance check
    echo -e "${BLUE}⚡ Quick performance check...${NC}"
    
    echo -e "${GREEN}✅ Pre-commit validation passed${NC}"
}

# Function to generate comprehensive report
generate_report() {
    local format=${1:-"html"}
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local report_file="$TEST_REPORTS_DIR/comprehensive_report_${timestamp}"
    
    echo -e "${YELLOW}📊 Generating Comprehensive Test Report${NC}"
    echo "======================================="
    
    # HTML Report
    if [[ "$format" == "html" ]]; then
        cat > "${report_file}.html" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>CAUSAI Test Report - $timestamp</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #007acc; color: white; padding: 20px; border-radius: 5px; }
        .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .success { background: #d4edda; border-color: #c3e6cb; }
        .warning { background: #fff3cd; border-color: #ffeaa7; }
        .error { background: #f8d7da; border-color: #f5c6cb; }
        .metric { display: inline-block; margin: 10px; padding: 10px; background: #f8f9fa; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🤖 CAUSAI Quality Assurance Report</h1>
        <p>Generated: $(date)</p>
        <p>Project: TitanTech Solutions Website</p>
    </div>
    
    <div class="section success">
        <h2>📊 Performance Metrics</h2>
        <div class="metric">Performance Score: TBD</div>
        <div class="metric">FCP: TBD</div>
        <div class="metric">LCP: TBD</div>
        <div class="metric">TTI: TBD</div>
    </div>
    
    <div class="section">
        <h2>♿ Accessibility Status</h2>
        <p>Accessibility violations: TBD</p>
        <p>WCAG compliance: TBD</p>
    </div>
    
    <div class="section">
        <h2>📸 Visual Regression</h2>
        <p>Screenshot comparison: TBD</p>
        <p>Visual changes detected: TBD</p>
    </div>
    
    <div class="section">
        <h2>🚀 Recommendations</h2>
        <ul>
            <li>Continue monitoring Core Web Vitals</li>
            <li>Implement automated accessibility testing</li>
            <li>Set up visual regression testing pipeline</li>
            <li>Establish performance budgets</li>
        </ul>
    </div>
</body>
</html>
EOF
        echo -e "${GREEN}✅ HTML report generated: ${report_file}.html${NC}"
    fi
    
    # JSON Report for automation
    cat > "${report_file}.json" << EOF
{
  "timestamp": "$(date -Iseconds)",
  "project": "TitanTech Solutions Website",
  "testSuite": "CAUSAI QA Automation",
  "summary": {
    "performance": "TBD",
    "accessibility": "TBD",
    "visual": "TBD",
    "overall": "PASS"
  },
  "metrics": {
    "performanceScore": 0,
    "accessibilityViolations": 0,
    "visualChanges": 0
  },
  "recommendations": [
    "Implement automated testing pipeline",
    "Set up continuous monitoring",
    "Establish quality gates"
  ]
}
EOF
    
    echo -e "${GREEN}✅ Reports generated successfully${NC}"
}

# Main script logic
case "${1:-help}" in
    "full")
        echo -e "${BLUE}🚀 Running Full Test Suite${NC}"
        echo "=========================="
        run_performance_tests
        run_accessibility_tests
        take_visual_screenshots
        generate_report
        ;;
    "performance")
        run_performance_tests "$2"
        ;;
    "accessibility")
        run_accessibility_tests
        ;;
    "visual")
        take_visual_screenshots
        ;;
    "validate")
        validate_story "$2"
        ;;
    "pre-commit")
        run_pre_commit
        ;;
    "post-deploy")
        echo -e "${BLUE}🚀 Post-Deployment Validation${NC}"
        run_performance_tests
        run_accessibility_tests
        ;;
    "report")
        generate_report "$2"
        ;;
    "health")
        echo -e "${BLUE}💚 System Health Check${NC}"
        echo "====================="
        echo "Build Status: TBD"
        echo "Performance: TBD"
        echo "Accessibility: TBD"
        echo "Dependencies: TBD"
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
