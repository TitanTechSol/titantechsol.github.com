#!/bin/bash

# CAUSAI Master Automation Controller
# Central hub for all CAUSAI automation scripts and work item management
# Created: July 31, 2025
# Version: 1.0

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# ASCII Art Header
show_header() {
    clear
    echo -e "${CYAN}"
    echo "╔═══════════════════════════════════════════════════════════════════════════════════════╗"
    echo "║                                                                                       ║"
    echo "║   ██████╗ █████╗ ██╗   ██╗███████╗ █████╗ ██╗    ███╗   ███╗ █████╗ ███████╗████████╗║"
    echo "║  ██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗██║    ████╗ ████║██╔══██╗██╔════╝╚══██╔══╝║"
    echo "║  ██║     ███████║██║   ██║███████╗███████║██║    ██╔████╔██║███████║███████╗   ██║   ║"
    echo "║  ██║     ██╔══██║██║   ██║╚════██║██╔══██║██║    ██║╚██╔╝██║██╔══██║╚════██║   ██║   ║"
    echo "║  ╚██████╗██║  ██║╚██████╔╝███████║██║  ██║██║    ██║ ╚═╝ ██║██║  ██║███████║   ██║   ║"
    echo "║   ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝    ╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝   ║"
    echo "║                                                                                       ║"
    echo "║                        Complete Automated User Story AI                              ║"
    echo "║                             Master Control Center                                    ║"
    echo "║                                                                                       ║"
    echo "╚═══════════════════════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    echo -e "${WHITE}🏢 TitanTech Solutions Website Development Platform${NC}"
    echo -e "${BLUE}🤖 AI-Powered Work Item Management & Automation${NC}"
    echo ""
}

# Function to display main menu
show_main_menu() {
    echo -e "${YELLOW}📋 CAUSAI Master Control Center${NC}"
    echo "==============================="
    echo ""
    echo -e "${CYAN}🚀 WORKFLOW AUTOMATION:${NC}"
    echo "  1. 📊 Priority Management      - ADO-style priority dashboard and planning"
    echo "  2. 💬 Discussion System        - Work item discussions and history"
    echo "  3. 🤖 CAUSAI Workflow         - Automated user story implementation"
    echo ""
    echo -e "${CYAN}🔧 QUALITY ASSURANCE:${NC}"
    echo "  4. 🧪 QA Automation           - Performance, accessibility, visual testing"
    echo "  5. 🚀 Deployment Pipeline     - CI/CD automation and release management"
    echo "  6. 📊 Analytics & Monitoring  - Real-time metrics and reporting"
    echo ""
    echo -e "${CYAN}🎯 QUICK ACTIONS:${NC}"
    echo "  7. ⚡ Quick Start            - Get next priority item and start work"
    echo "  8. 📈 System Health          - Overall system status and health check"
    echo "  9. 📋 Generate Report        - Comprehensive project status report"
    echo ""
    echo -e "${CYAN}🛠️  UTILITIES:${NC}"
    echo "  10. 🔍 Project Overview       - Current project status and metrics"
    echo "  11. ⚙️  Configuration         - Setup and configuration options"
    echo "  12. 📚 Documentation         - Help and documentation"
    echo ""
    echo -e "${RED}  0. 🚪 Exit${NC}"
    echo ""
    echo -n "Select an option: "
}

# Function to check if required scripts exist
check_scripts() {
    local missing_scripts=()
    
    local required_scripts=(
        "priority-manager.sh"
        "discussion-manager.sh"
        "causai-workflow.sh"
        "qa-automation.sh"
        "deployment-automation.sh"
        "analytics-automation.sh"
    )
    
    for script in "${required_scripts[@]}"; do
        if [[ ! -f "$SCRIPT_DIR/$script" ]]; then
            missing_scripts+=("$script")
        fi
    done
    
    if [[ ${#missing_scripts[@]} -gt 0 ]]; then
        echo -e "${RED}❌ Missing required scripts:${NC}"
        for script in "${missing_scripts[@]}"; do
            echo "   - $script"
        done
        echo ""
        echo "Please ensure all CAUSAI automation scripts are installed."
        return 1
    fi
    
    return 0
}

# Function to run priority management
run_priority_management() {
    echo -e "${YELLOW}🎯 Priority Management System${NC}"
    echo "============================="
    echo ""
    echo "1. 📊 Show Priority Dashboard"
    echo "2. 📋 List Items by Priority"
    echo "3. ⬆️  Escalate Item Priority"
    echo "4. 📅 Sprint Planning"
    echo "5. 📈 Priority Health Status"
    echo "6. ⏰ Aging Items Report"
    echo "0. ↩️  Back to Main Menu"
    echo ""
    echo -n "Select option: "
    read -r priority_choice
    
    case $priority_choice in
        1) ./priority-manager.sh dashboard ;;
        2) 
            echo -n "Enter priority level (P01, P02, P03, P04): "
            read -r priority_level
            ./priority-manager.sh list "$priority_level"
            ;;
        3)
            echo -n "Enter item name: "
            read -r item_name
            echo -n "From priority: "
            read -r from_priority
            echo -n "To priority: "
            read -r to_priority
            ./priority-manager.sh escalate "$item_name" "$from_priority" "$to_priority"
            ;;
        4) 
            echo -n "Enter sprint capacity (story points): "
            read -r capacity
            ./priority-manager.sh sprint-plan "${capacity:-25}"
            ;;
        5) ./priority-manager.sh health ;;
        6) ./priority-manager.sh aging ;;
        0) return ;;
        *) echo "Invalid option" ;;
    esac
    
    echo ""
    echo "Press Enter to continue..."
    read -r
}

# Function to run QA automation
run_qa_automation() {
    echo -e "${YELLOW}🧪 Quality Assurance Automation${NC}"
    echo "==============================="
    echo ""
    echo "1. 🚀 Full Test Suite"
    echo "2. ⚡ Performance Tests"
    echo "3. ♿ Accessibility Tests"
    echo "4. 📸 Visual Screenshots"
    echo "5. ✅ Pre-commit Validation"
    echo "6. 📊 Generate QA Report"
    echo "7. 🔍 Validate Specific Story"
    echo "0. ↩️  Back to Main Menu"
    echo ""
    echo -n "Select option: "
    read -r qa_choice
    
    case $qa_choice in
        1) ./qa-automation.sh full ;;
        2) 
            echo -n "Include mobile tests? (y/n): "
            read -r mobile_test
            if [[ "$mobile_test" =~ ^[Yy]$ ]]; then
                ./qa-automation.sh performance --mobile
            else
                ./qa-automation.sh performance
            fi
            ;;
        3) ./qa-automation.sh accessibility ;;
        4) ./qa-automation.sh visual ;;
        5) ./qa-automation.sh pre-commit ;;
        6) ./qa-automation.sh report ;;
        7)
            echo -n "Enter story ID: "
            read -r story_id
            ./qa-automation.sh validate "$story_id"
            ;;
        0) return ;;
        *) echo "Invalid option" ;;
    esac
    
    echo ""
    echo "Press Enter to continue..."
    read -r
}

# Function to run deployment automation
run_deployment_automation() {
    echo -e "${YELLOW}🚀 Deployment & CI/CD Automation${NC}"
    echo "================================"
    echo ""
    echo "1. 🔄 Full CI/CD Pipeline"
    echo "2. 🏗️  Build Project"
    echo "3. 🧪 Run Tests"
    echo "4. 🚀 Deploy to Environment"
    echo "5. 📊 Deployment Status"
    echo "6. 🏷️  Create Release"
    echo "7. 🚨 Emergency Hotfix"
    echo "0. ↩️  Back to Main Menu"
    echo ""
    echo -n "Select option: "
    read -r deploy_choice
    
    case $deploy_choice in
        1) ./deployment-automation.sh pipeline ;;
        2)
            echo -n "Enter environment (dev/staging/prod): "
            read -r env
            ./deployment-automation.sh build "${env:-dev}"
            ;;
        3) ./deployment-automation.sh test ;;
        4)
            echo -n "Enter environment (dev/staging/prod): "
            read -r env
            ./deployment-automation.sh deploy "${env:-dev}"
            ;;
        5) ./deployment-automation.sh status ;;
        6)
            echo -n "Enter version (e.g., v1.3.0): "
            read -r version
            ./deployment-automation.sh release "$version"
            ;;
        7) ./deployment-automation.sh hotfix ;;
        0) return ;;
        *) echo "Invalid option" ;;
    esac
    
    echo ""
    echo "Press Enter to continue..."
    read -r
}

# Function to run analytics and monitoring
run_analytics_monitoring() {
    echo -e "${YELLOW}📊 Analytics & Monitoring${NC}"
    echo "========================="
    echo ""
    echo "1. 🖥️  Real-time Monitoring Dashboard"
    echo "2. 📊 Collect Current Metrics"
    echo "3. ⚡ Performance Analysis"
    echo "4. 👥 User Behavior Analysis"
    echo "5. 🎯 Conversion Tracking"
    echo "6. 🚨 Check Alerts"
    echo "7. 📋 Generate Report"
    echo "8. 💚 System Health Check"
    echo "0. ↩️  Back to Main Menu"
    echo ""
    echo -n "Select option: "
    read -r analytics_choice
    
    case $analytics_choice in
        1) ./analytics-automation.sh monitor ;;
        2) ./analytics-automation.sh metrics ;;
        3) ./analytics-automation.sh performance ;;
        4) ./analytics-automation.sh user-behavior ;;
        5) ./analytics-automation.sh conversion ;;
        6) ./analytics-automation.sh alerts ;;
        7)
            echo -n "Enter period (daily/weekly/monthly): "
            read -r period
            ./analytics-automation.sh report "${period:-weekly}"
            ;;
        8) ./analytics-automation.sh health ;;
        0) return ;;
        *) echo "Invalid option" ;;
    esac
    
    echo ""
    echo "Press Enter to continue..."
    read -r
}

# Function to run quick start
run_quick_start() {
    echo -e "${YELLOW}⚡ CAUSAI Quick Start${NC}"
    echo "==================="
    echo ""
    echo -e "${BLUE}🎯 Getting next priority item...${NC}"
    
    if [[ -f "$SCRIPT_DIR/priority-manager.sh" ]]; then
        ./priority-manager.sh next
        echo ""
        
        echo -n "Would you like to start work on the recommended item? (y/n): "
        read -r start_work
        
        if [[ "$start_work" =~ ^[Yy]$ ]]; then
            echo -n "Enter the story ID to start: "
            read -r story_id
            
            if [[ -n "$story_id" ]]; then
                echo -e "${GREEN}🚀 Starting work on $story_id...${NC}"
                ./causai-workflow.sh start "$story_id"
            fi
        fi
    else
        echo -e "${RED}❌ Priority manager not available${NC}"
    fi
    
    echo ""
    echo "Press Enter to continue..."
    read -r
}

# Function to show system health
show_system_health() {
    echo -e "${YELLOW}💚 CAUSAI System Health${NC}"
    echo "======================="
    echo ""
    
    # Check scripts
    echo -e "${BLUE}🔧 Script Status:${NC}"
    check_scripts
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}✅ All required scripts are available${NC}"
    fi
    echo ""
    
    # Check website
    echo -e "${BLUE}🌐 Website Status:${NC}"
    if curl -s -f "https://titantech.g2ad.com" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Website is accessible${NC}"
    else
        echo -e "${RED}❌ Website is not accessible${NC}"
    fi
    echo ""
    
    # Check git repository
    echo -e "${BLUE}📝 Repository Status:${NC}"
    if git rev-parse --git-dir > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Git repository detected${NC}"
        echo "Branch: $(git branch --show-current)"
        echo "Uncommitted changes: $(git status --porcelain | wc -l) files"
    else
        echo -e "${RED}❌ Not in a git repository${NC}"
    fi
    echo ""
    
    # Check build status
    echo -e "${BLUE}🏗️  Build Status:${NC}"
    if [[ -d "$PROJECT_ROOT/dist" ]]; then
        echo -e "${GREEN}✅ Build exists${NC}"
        echo "Size: $(du -sh "$PROJECT_ROOT/dist" | cut -f1)"
    else
        echo -e "${YELLOW}⚠️  No build found${NC}"
    fi
    echo ""
    
    # Run analytics health check if available
    if [[ -f "$SCRIPT_DIR/analytics-automation.sh" ]]; then
        echo -e "${BLUE}📊 Running Analytics Health Check...${NC}"
        ./analytics-automation.sh health
    fi
    
    echo ""
    echo "Press Enter to continue..."
    read -r
}

# Function to generate comprehensive report
generate_comprehensive_report() {
    echo -e "${YELLOW}📋 Generating Comprehensive Report${NC}"
    echo "=================================="
    echo ""
    
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local report_dir="$PROJECT_ROOT/work-items/master-reports"
    mkdir -p "$report_dir"
    
    echo -e "${BLUE}🔄 Collecting data from all systems...${NC}"
    
    # Priority status
    echo "📊 Priority Management Status:"
    ./priority-manager.sh dashboard 2>/dev/null || echo "Priority manager not available"
    echo ""
    
    # QA Status
    echo "🧪 Quality Assurance Status:"
    ./qa-automation.sh health 2>/dev/null || echo "QA automation not available"
    echo ""
    
    # Analytics
    echo "📈 Analytics Summary:"
    ./analytics-automation.sh metrics 2>/dev/null || echo "Analytics not available"
    echo ""
    
    # Generate master report
    if [[ -f "$SCRIPT_DIR/analytics-automation.sh" ]]; then
        ./analytics-automation.sh report comprehensive
    fi
    
    echo -e "${GREEN}✅ Comprehensive report generated${NC}"
    echo ""
    echo "Press Enter to continue..."
    read -r
}

# Function to show project overview
show_project_overview() {
    echo -e "${YELLOW}🔍 TitanTech Solutions Project Overview${NC}"
    echo "======================================"
    echo ""
    
    echo -e "${BLUE}📊 Project Statistics:${NC}"
    echo "• User Stories: $(find "$PROJECT_ROOT/user-stories" -name "*.md" 2>/dev/null | wc -l) total"
    echo "• P01 (Critical): $(find "$PROJECT_ROOT/user-stories" -name "P01-*.md" 2>/dev/null | wc -l) items"
    echo "• P02 (High): $(find "$PROJECT_ROOT/user-stories" -name "P02-*.md" 2>/dev/null | wc -l) items"
    echo "• P03 (Medium): $(find "$PROJECT_ROOT/user-stories" -name "P03-*.md" 2>/dev/null | wc -l) items"
    echo "• P04 (Low): $(find "$PROJECT_ROOT/user-stories" -name "P04-*.md" 2>/dev/null | wc -l) items"
    echo ""
    
    echo -e "${BLUE}🚀 Development Activity:${NC}"
    if git rev-parse --git-dir > /dev/null 2>&1; then
        echo "• Current Branch: $(git branch --show-current)"
        echo "• Total Commits: $(git rev-list --all --count)"
        echo "• Contributors: $(git shortlog -sn | wc -l)"
        echo "• Files Tracked: $(git ls-files | wc -l)"
        echo "• Last Commit: $(git log -1 --format='%h - %s')"
    else
        echo "• Git repository not initialized"
    fi
    echo ""
    
    echo -e "${BLUE}🛠️  Automation Tools:${NC}"
    echo "• Priority Management: $(if [[ -f "$SCRIPT_DIR/priority-manager.sh" ]]; then echo "✅ Available"; else echo "❌ Missing"; fi)"
    echo "• Discussion System: $(if [[ -f "$SCRIPT_DIR/discussion-manager.sh" ]]; then echo "✅ Available"; else echo "❌ Missing"; fi)"
    echo "• QA Automation: $(if [[ -f "$SCRIPT_DIR/qa-automation.sh" ]]; then echo "✅ Available"; else echo "❌ Missing"; fi)"
    echo "• Deployment Pipeline: $(if [[ -f "$SCRIPT_DIR/deployment-automation.sh" ]]; then echo "✅ Available"; else echo "❌ Missing"; fi)"
    echo "• Analytics & Monitoring: $(if [[ -f "$SCRIPT_DIR/analytics-automation.sh" ]]; then echo "✅ Available"; else echo "❌ Missing"; fi)"
    echo ""
    
    echo -e "${BLUE}📈 Recent Activity:${NC}"
    if [[ -d "$PROJECT_ROOT/work-items" ]]; then
        echo "• Work Item Discussions: $(find "$PROJECT_ROOT/work-items/discussions" -name "*.md" 2>/dev/null | wc -l || echo "0")"
        echo "• Analytics Reports: $(find "$PROJECT_ROOT/work-items/analytics/reports" -name "*.json" 2>/dev/null | wc -l || echo "0")"
        echo "• Deployment Reports: $(find "$PROJECT_ROOT/work-items/deployment-reports" -name "*.log" 2>/dev/null | wc -l || echo "0")"
    fi
    
    echo ""
    echo "Press Enter to continue..."
    read -r
}

# Function to show documentation
show_documentation() {
    echo -e "${YELLOW}📚 CAUSAI Documentation${NC}"
    echo "======================"
    echo ""
    
    echo -e "${BLUE}🤖 CAUSAI Identity & Rules:${NC}"
    if [[ -f "$PROJECT_ROOT/CAUSAI-IDENTITY.md" ]]; then
        echo "✅ CAUSAI Identity file available"
        echo "📄 Location: $PROJECT_ROOT/CAUSAI-IDENTITY.md"
    else
        echo "❌ CAUSAI Identity file not found"
    fi
    echo ""
    
    echo -e "${BLUE}📋 Available Documentation:${NC}"
    echo "• Priority Management System: ./docs/priority-management-system.md"
    echo "• Discussion System: ./work-items/README-DISCUSSIONS.md"
    echo "• Active Backlog: ./active-backlog.md"
    echo "• User Stories: ./user-stories/README.md"
    echo ""
    
    echo -e "${BLUE}🔧 Script Documentation:${NC}"
    echo "• Run any script with --help for detailed usage"
    echo "• Example: ./priority-manager.sh --help"
    echo ""
    
    echo -e "${BLUE}🚀 Quick Start Guide:${NC}"
    echo "1. Check system health: Run option 8 from main menu"
    echo "2. Review priorities: Run option 1 > 1 (Priority Dashboard)"
    echo "3. Start work: Run option 7 (Quick Start)"
    echo "4. Monitor progress: Run option 6 > 1 (Real-time Monitoring)"
    echo "5. Deploy changes: Run option 5 > 1 (CI/CD Pipeline)"
    echo ""
    
    echo "Press Enter to continue..."
    read -r
}

# Main script execution
main() {
    # Check if scripts are available
    if ! check_scripts; then
        echo ""
        echo "Please install missing scripts and try again."
        exit 1
    fi
    
    while true; do
        show_header
        show_main_menu
        
        read -r choice
        echo ""
        
        case $choice in
            1) run_priority_management ;;
            2) 
                echo -e "${BLUE}💬 Discussion System${NC}"
                ./discussion-manager.sh list
                echo ""
                echo "Press Enter to continue..."
                read -r
                ;;
            3)
                echo -e "${BLUE}🤖 CAUSAI Workflow${NC}"
                ./causai-workflow.sh
                echo ""
                echo "Press Enter to continue..."
                read -r
                ;;
            4) run_qa_automation ;;
            5) run_deployment_automation ;;
            6) run_analytics_monitoring ;;
            7) run_quick_start ;;
            8) show_system_health ;;
            9) generate_comprehensive_report ;;
            10) show_project_overview ;;
            11)
                echo -e "${YELLOW}⚙️  Configuration${NC}"
                echo "Configuration options coming soon..."
                echo ""
                echo "Press Enter to continue..."
                read -r
                ;;
            12) show_documentation ;;
            0) 
                echo -e "${GREEN}👋 Thank you for using CAUSAI!${NC}"
                echo "Have a great day developing with TitanTech Solutions!"
                exit 0
                ;;
            *)
                echo -e "${RED}❌ Invalid option. Please try again.${NC}"
                echo ""
                echo "Press Enter to continue..."
                read -r
                ;;
        esac
    done
}

# Run main function
main "$@"
