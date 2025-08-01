#!/bin/bash

# CAUSAI Automation Script for TitanTech Solutions Website Development
# Complete Automated User Story AI Workflow Tools

echo "🤖 CAUSAI - Complete Automated User Story AI"
echo "=============================================="
echo ""

# Function to display available user stories
show_available_stories() {
    echo "📋 Available User Stories:"
    echo ""
    echo "🔥 HIGH PRIORITY (P01) - Ready to Start:"
    echo "  • P01-CE-00001.04  - Portfolio case studies (5 pts)"
    echo "  • P01-PO-00001.01  - Image optimization (3 pts, partially done)"
    echo "  • P01-PO-00001.02  - Code splitting & lazy loading (5 pts)"
    echo "  • P01-IN-00001.01  - Google Analytics setup (2 pts)"
    echo "  • P01-CO-00001.02  - Contact form optimization (3 pts)"
    echo ""
    echo "✅ RECENTLY COMPLETED:"
    echo "  • P01-CE-00001.01  - Team profiles (COMPLETE)"
    echo "  • P01-VD-00001     - Design system enhancement (COMPLETE)"
    echo ""
    echo "🚀 MEDIUM PRIORITY (P02) - Next Sprint:"
    echo "  • P01-CM-00001.01  - Team profile management CMS (3 pts, moved from P01)"
    echo "  • P02-AF-00002     - Project estimator tool (8 pts)"
    echo "  • P02-IN-00002     - CRM integration (5 pts)"
    echo "  • P02-CE-00002     - Blog platform (8 pts)"
    echo ""
}

# Function to start working on a user story with discussion tracking
start_story_work() {
    local story_id=$1
    
    echo "🚀 Starting work on user story: $story_id"
    
    # Priority check integration
    echo "🎯 Checking priority status..."
    if [[ -f "$SCRIPT_DIR/priority-manager.sh" ]]; then
        "$SCRIPT_DIR/priority-manager.sh" dashboard
        echo ""
    fi
    
    validate_story "$story_id"
    if [ $? -eq 0 ]; then
        echo ""
        echo "✨ CAUSAI is ready to implement this user story!"
        
        # Create or update discussion file
        echo "📝 Initializing discussion tracking..."
        local story_title=$(grep "^# " "./user-stories/${story_id}.md" | sed 's/^# //')
        
        # Check if discussion file exists, create if not
        local discussion_file="../work-items/discussions/${story_id}-discussion.md"
        if [ ! -f "$discussion_file" ]; then
            ../scripts/discussion-manager.sh create "$story_id" "$story_title" "CAUSAI"
        fi
        
        # Log start of work
        ../scripts/discussion-manager.sh comment "$story_id" "CAUSAI" "Work Started" "In Progress" "CAUSAI initiated implementation of user story"
        ../scripts/discussion-manager.sh status "$story_id" "CAUSAI" "Ready" "In Progress" "Started implementation"
        
        echo "🔄 Next steps:"
        echo "  1. Analyzing requirements and acceptance criteria"
        echo "  2. Planning implementation approach"
        echo "  3. Making code changes"
        echo "  4. Testing with development server"
        echo "  5. Showing visual and code changes"
        echo "  6. Waiting for human confirmation"
        echo ""
        echo "📍 Current working directory: $(pwd)"
        echo "🌐 Use './causai-workflow.sh dev' to start visual testing"
        echo "💬 Use './discussion-manager.sh show $story_id' to view discussion history"
    fi
}

# Function to run build analysis
analyze_build() {
    echo "📊 Running build analysis..."
    cd "../../"
    npm run build:analyze
}

# Function to optimize images
optimize_images() {
    echo "🖼️ Running image optimization..."
    cd "../../"
    npm run optimize:images
}

# Function to validate user story format
validate_story() {
    local story_id=$1
    local story_file="./user-stories/${story_id}.md"
    
    if [ -f "$story_file" ]; then
        echo "✅ Found user story: $story_id"
        echo "📖 Reading story details..."
        head -20 "$story_file"
        return 0
    else
        echo "❌ User story not found: $story_id"
        echo "💡 Available stories in user-stories directory:"
        ls -1 ./user-stories/ | grep -E "^P[0-9]+-" | head -10
        return 1
    fi
}

# Function to update backlog status
update_backlog() {
    local story_id=$1
    local status=$2
    echo "📝 Updating backlog status for $story_id to $status"
    # This would update the active-backlog.md file
    # Implementation depends on specific requirements
}

# Function to show git status and changes
show_changes() {
    echo "📋 Current git status:"
    cd "../../"
    git status --porcelain
    echo ""
    echo "🔍 Recent changes:"
    git diff --name-only HEAD~1
}

# Main menu
case "${1:-menu}" in
    "menu"|"")
        echo "Available commands:"
        echo "  stories    - Show available user stories"
        echo "  priority   - Show priority dashboard and next recommended item"
        echo "  dev        - Start development server"
        echo "  analyze    - Run build analysis"
        echo "  images     - Optimize images"
        echo "  validate   - Validate specific user story (requires story ID)"
        echo "  changes    - Show current changes and git status"
        echo "  start      - Start working on a user story (requires story ID)"
        echo "  discussion - Show discussion for a story or list all discussions"
        echo "  comment    - Add comment to a story discussion"
        echo ""
        echo "Usage examples:"
        echo "  ./causai-workflow.sh stories"
        echo "  ./causai-workflow.sh priority"
        echo "  ./causai-workflow.sh validate P01-CE-00001.01"
        echo "  ./causai-workflow.sh start P01-CE-00001.01"
        echo "  ./causai-workflow.sh discussion P01-CE-00001.01"
        echo "  ./causai-workflow.sh comment P01-CE-00001.01 'Update' 'Progress made on implementation'"
        ;;
    "stories")
        show_available_stories
        ;;
    "priority")
        if [[ -f "./priority-manager.sh" ]]; then
            echo "🎯 CAUSAI Priority Management Dashboard"
            echo "======================================"
            echo ""
            ./priority-manager.sh dashboard
        else
            echo "❌ Priority manager not found. Please check script installation."
        fi
        ;;
    "dev")
        start_dev_server
        ;;
    "analyze")
        analyze_build
        ;;
    "images")
        optimize_images
        ;;
    "validate")
        if [ -z "$2" ]; then
            echo "❌ Please provide a story ID"
            echo "Usage: ./causai-workflow.sh validate P01-CE-00001.01"
        else
            validate_story "$2"
        fi
        ;;
    "changes")
        show_changes
        ;;
    "start")
        if [ -z "$2" ]; then
            echo "❌ Please provide a story ID to start working on"
            echo "Usage: ./causai-workflow.sh start P01-CE-00001.01"
            echo ""
            show_available_stories
        else
            start_story_work "$2"
        fi
        ;;
    "discussion")
        if [ -z "$2" ]; then
            echo "📋 Available discussions:"
            ./discussion-manager.sh list
        else
            ./discussion-manager.sh show "$2"
        fi
        ;;
    "comment")
        if [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ]; then
            echo "❌ Usage: ./causai-workflow.sh comment <story_id> <comment_type> <comment_text>"
            echo "Example: ./causai-workflow.sh comment P01-CE-00001.01 'Blocker' 'Waiting for client assets'"
        else
            ./discussion-manager.sh comment "$2" "CAUSAI" "$3" "Current" "$4"
        fi
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo "Use './causai-workflow.sh menu' to see available commands"
        ;;
esac
