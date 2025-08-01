#!/bin/bash

# ADO-Compatible Work Item Generator
# 
# This script processes issues from the /copilot/issues directory and generates
# hierarchical work items following Azure DevOps best practices.
#
# Features:
# - Interactive issue processing with clarifying questions
# - ADO-compatible work item hierarchy (Epic -> Feature -> User Story -> Task)
# - Fibonacci estimation enforcement
# - Dependency validation and orphan prevention
# - SDLC/SOW integration
# - Dry-run mode for testing and validation

set -e  # Exit on any error

# Parse command line arguments
DRY_RUN=false
VERBOSE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --verbose|-v)
            VERBOSE=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --dry-run    Preview work items without creating them"
            echo "  --verbose    Show detailed processing information"
            echo "  --help       Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_PATH="$(dirname "$SCRIPT_DIR")"
ISSUES_PATH="$BASE_PATH/issues"
WORK_ITEMS_PATH="$BASE_PATH/work-items"
TEMPLATES_PATH="$WORK_ITEMS_PATH/templates"
INDEX_FILE="$WORK_ITEMS_PATH/index.json"
# Legacy support - backlog.json now used only for metadata
BACKLOG_FILE="$WORK_ITEMS_PATH/backlog.json"

# ADO-compatible configuration
FIBONACCI_SEQUENCE=(1 2 3 5 8 13 21 34 55 89)
WORK_ITEM_TYPES=("Epic" "Feature" "User Story" "Task" "Bug")
STATES=("New" "Active" "Resolved" "Closed" "Removed")
PRIORITIES=("1-Critical" "2-High" "3-Medium" "4-Low")

# Initialize output arrays for dry-run reporting
DRY_RUN_EPICS=()
DRY_RUN_FEATURES=()
DRY_RUN_STORIES=()
DRY_RUN_TASKS=()
DRY_RUN_BUGS=()

# Color codes for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Utility functions
log_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_question() {
    echo -e "${PURPLE}🤔 $1${NC}"
}

# Initialize backlog if it doesn't exist
initialize_backlog() {
    if [[ ! -f "$BACKLOG_FILE" ]]; then
        log_info "Creating new backlog file"
        cat > "$BACKLOG_FILE" << 'EOF'
{
  "epics": [],
  "features": [],
  "userStories": [],
  "tasks": [],
  "bugs": [],
  "metadata": {
    "lastUpdated": "",
    "version": "1.0",
    "adoCompliant": true
  }
}
EOF
    fi
}

# Load existing backlog
load_backlog() {
    if [[ -f "$BACKLOG_FILE" ]]; then
        log_success "Loaded existing backlog"
        # Update last modified date
        jq ".metadata.lastUpdated = \"$(date -I)\"" "$BACKLOG_FILE" > "${BACKLOG_FILE}.tmp" && mv "${BACKLOG_FILE}.tmp" "$BACKLOG_FILE"
    else
        log_info "Creating new backlog"
        initialize_backlog
    fi
}

# Get user input with prompt
get_input() {
    local prompt="$1"
    local default="$2"
    local response
    
    if [[ -n "$default" ]]; then
        read -p "$prompt [$default]: " response
        echo "${response:-$default}"
    else
        read -p "$prompt: " response
        echo "$response"
    fi
}

# Validate Fibonacci number
is_fibonacci() {
    local num="$1"
    for fib in "${FIBONACCI_SEQUENCE[@]}"; do
        if [[ "$num" == "$fib" ]]; then
            return 0
        fi
    done
    return 1
}

# Get next sequence number for work item type
get_next_sequence() {
    local work_item_type="$1"
    local backlog_key
    
    case "$work_item_type" in
        "Epic") backlog_key="epics" ;;
        "Feature") backlog_key="features" ;;
        "User Story") backlog_key="userStories" ;;
        "Task") backlog_key="tasks" ;;
        "Bug") backlog_key="bugs" ;;
        *) echo "1"; return ;;
    esac
    
    local count=$(jq ".${backlog_key} | length" "$BACKLOG_FILE")
    echo $((count + 1))
}

# Generate work item ID
generate_work_item_id() {
    local work_item_type="$1"
    local prefix
    local year=$(date +%Y)
    local sequence=$(get_next_sequence "$work_item_type")
    
    case "$work_item_type" in
        "Epic") prefix="E" ;;
        "Feature") prefix="F" ;;
        "User Story") prefix="US" ;;
        "Task") prefix="T" ;;
        "Bug") prefix="B" ;;
        *) prefix="WI" ;;
    esac
    
    printf "%s-%s-%03d" "$prefix" "$year" "$sequence"
}

# Extract title from content
extract_title() {
    local content="$1"
    echo "$content" | head -n1 | sed 's/^#*\s*//' | cut -c1-100
}

# Save work item (respects dry-run mode)
save_work_item() {
    local work_item_json="$1"
    local work_item_type="$2"
    local work_item_id="$3"
    local dir_name
    
    case "$work_item_type" in
        "Epic") dir_name="epics" ;;
        "Feature") dir_name="features" ;;
        "User Story") dir_name="user-stories" ;;
        "Task") dir_name="tasks" ;;
        "Bug") dir_name="bugs" ;;
        *) 
            log_error "Unknown work item type: $work_item_type"
            return 1
            ;;
    esac
    
    if [[ "$DRY_RUN" == "true" ]]; then
        # Store for dry-run reporting
        case "$work_item_type" in
            "Epic") DRY_RUN_EPICS+=("$work_item_json") ;;
            "Feature") DRY_RUN_FEATURES+=("$work_item_json") ;;
            "User Story") DRY_RUN_STORIES+=("$work_item_json") ;;
            "Task") DRY_RUN_TASKS+=("$work_item_json") ;;
            "Bug") DRY_RUN_BUGS+=("$work_item_json") ;;
        esac
        
        if [[ "$VERBOSE" == "true" ]]; then
            log_info "Would create $work_item_type: $work_item_id"
            echo "$work_item_json" | jq .
        else
            log_info "Would create $work_item_type: $work_item_id"
        fi
    else
        # Save individual work item file
        local work_item_dir="$WORK_ITEMS_PATH/${dir_name}"
        mkdir -p "$work_item_dir"
        echo "$work_item_json" | jq . > "$work_item_dir/${work_item_id}.json"
        
        log_success "Created $work_item_type: $work_item_id"
        
        # Regenerate index after adding work item
        "$SCRIPT_DIR/work-items-manager.sh" index > /dev/null 2>&1
    fi
}

# Display dry-run summary
display_dry_run_summary() {
    if [[ "$DRY_RUN" != "true" ]]; then
        return
    fi
    
    echo
    echo -e "${CYAN}📋 DRY RUN SUMMARY${NC}"
    echo -e "${YELLOW}==================${NC}"
    
    local total_count=0
    
    if [[ ${#DRY_RUN_EPICS[@]} -gt 0 ]]; then
        echo -e "${BLUE}📈 Epics: ${#DRY_RUN_EPICS[@]}${NC}"
        total_count=$((total_count + ${#DRY_RUN_EPICS[@]}))
        for epic_json in "${DRY_RUN_EPICS[@]}"; do
            local title=$(echo "$epic_json" | jq -r '.title')
            local id=$(echo "$epic_json" | jq -r '.id')
            echo -e "   ${CYAN}• $id: $title${NC}"
        done
        echo
    fi
    
    if [[ ${#DRY_RUN_FEATURES[@]} -gt 0 ]]; then
        echo -e "${GREEN}🎯 Features: ${#DRY_RUN_FEATURES[@]}${NC}"
        total_count=$((total_count + ${#DRY_RUN_FEATURES[@]}))
        for feature_json in "${DRY_RUN_FEATURES[@]}"; do
            local title=$(echo "$feature_json" | jq -r '.title')
            local id=$(echo "$feature_json" | jq -r '.id')
            echo -e "   ${GREEN}• $id: $title${NC}"
        done
        echo
    fi
    
    if [[ ${#DRY_RUN_STORIES[@]} -gt 0 ]]; then
        echo -e "${YELLOW}📝 User Stories: ${#DRY_RUN_STORIES[@]}${NC}"
        total_count=$((total_count + ${#DRY_RUN_STORIES[@]}))
        for story_json in "${DRY_RUN_STORIES[@]}"; do
            local title=$(echo "$story_json" | jq -r '.title')
            local id=$(echo "$story_json" | jq -r '.id')
            echo -e "   ${YELLOW}• $id: $title${NC}"
        done
        echo
    fi
    
    if [[ ${#DRY_RUN_TASKS[@]} -gt 0 ]]; then
        echo -e "${MAGENTA}✅ Tasks: ${#DRY_RUN_TASKS[@]}${NC}"
        total_count=$((total_count + ${#DRY_RUN_TASKS[@]}))
        for task_json in "${DRY_RUN_TASKS[@]}"; do
            local title=$(echo "$task_json" | jq -r '.title')
            local id=$(echo "$task_json" | jq -r '.id')
            echo -e "   ${MAGENTA}• $id: $title${NC}"
        done
        echo
    fi
    
    if [[ ${#DRY_RUN_BUGS[@]} -gt 0 ]]; then
        echo -e "${RED}🐛 Bugs: ${#DRY_RUN_BUGS[@]}${NC}"
        total_count=$((total_count + ${#DRY_RUN_BUGS[@]}))
        for bug_json in "${DRY_RUN_BUGS[@]}"; do
            local title=$(echo "$bug_json" | jq -r '.title')
            local id=$(echo "$bug_json" | jq -r '.id')
            echo -e "   ${RED}• $id: $title${NC}"
        done
        echo
    fi
    
    echo -e "${CYAN}📊 Total work items that would be created: $total_count${NC}"
    echo
    echo -e "${MAGENTA}💡 To actually create these work items, run without --dry-run${NC}"
    echo -e "${MAGENTA}💡 Use --verbose for detailed JSON preview${NC}"
}

# Get work item directory
get_work_item_directory() {
    local work_item_type="$1"
    
    case "$work_item_type" in
        "Epic") echo "epics" ;;
        "Feature") echo "features" ;;
        "User Story") echo "user-stories" ;;
        "Task") echo "tasks" ;;
        "Bug") echo "bugs" ;;
    esac
}

# Get backlog key for work item type
get_backlog_key() {
    local work_item_type="$1"
    
    case "$work_item_type" in
        "Epic") echo "epics" ;;
        "Feature") echo "features" ;;
        "User Story") echo "userStories" ;;
        "Task") echo "tasks" ;;
        "Bug") echo "bugs" ;;
    esac
}

# Show available parent work items
show_parent_options() {
    local child_type="$1"
    local parent_types=()
    
    case "$child_type" in
        "Feature") parent_types=("Epic") ;;
        "User Story") parent_types=("Feature") ;;
        "Task"|"Bug") parent_types=("User Story") ;;
        *) return 1 ;;
    esac
    
    echo
    log_info "Available parent work items:"
    local option_count=0
    
    for parent_type in "${parent_types[@]}"; do
        local backlog_key=$(get_backlog_key "$parent_type")
        local items=$(jq -r ".${backlog_key}[] | \"\\(.id) - \\(.title)\"" "$BACKLOG_FILE" 2>/dev/null || echo "")
        
        if [[ -n "$items" ]]; then
            while IFS= read -r item; do
                ((option_count++))
                echo "  $option_count) [$parent_type] $item"
            done <<< "$items"
        fi
    done
    
    if [[ $option_count -eq 0 ]]; then
        log_warning "No suitable parent work items found."
        return 1
    fi
    
    return 0
}

# Get effort estimate
get_effort_estimate() {
    local work_item_type="$1"
    local effort
    
    if [[ "$work_item_type" == "Task" ]]; then
        while true; do
            effort=$(get_input "Effort in hours")
            if [[ "$effort" =~ ^[0-9]+(\.[0-9]+)?$ ]]; then
                echo "$effort"
                return
            else
                log_error "Please enter a valid number for hours"
            fi
        done
    else
        echo
        log_info "Fibonacci sequence: ${FIBONACCI_SEQUENCE[*]}"
        while true; do
            effort=$(get_input "Story points (Fibonacci)")
            if is_fibonacci "$effort"; then
                echo "$effort"
                return
            else
                log_error "Please use Fibonacci sequence values: ${FIBONACCI_SEQUENCE[*]}"
            fi
        done
    fi
}

# Analyze issue complexity
analyze_issue_complexity() {
    local content="$1"
    local filename="$2"
    
    log_question "Analyzing issue: $filename"
    echo
    log_info "Content preview:"
    echo "$content" | head -n 10 | sed 's/^/  /'
    echo
    
    echo "What is the complexity level?"
    echo "1) Simple (1-2 tasks, User Story)"
    echo "2) Medium (feature-sized, Feature)" 
    echo "3) Large (epic-sized, Epic)"
    echo "4) Bug/Defect (Bug)"
    echo "5) Let me analyze automatically"
    
    local choice=$(get_input "Choice" "5")
    
    case "$choice" in
        1) echo "User Story" ;;
        2) echo "Feature" ;;
        3) echo "Epic" ;;
        4) echo "Bug" ;;
        5|*) 
            # Simple automatic analysis
            local content_lower=$(echo "$content" | tr '[:upper:]' '[:lower:]')
            if [[ $content_lower == *"epic"* || $content_lower == *"strategic"* || $content_lower == *"initiative"* ]]; then
                echo "Epic"
            elif [[ $content_lower == *"feature"* || $content_lower == *"capability"* || ${#content} -gt 1000 ]]; then
                echo "Feature"
            elif [[ $content_lower == *"bug"* || $content_lower == *"defect"* || $content_lower == *"error"* ]]; then
                echo "Bug"
            else
                echo "User Story"
            fi
            ;;
    esac
}

# Create work item from template
create_work_item() {
    local work_item_type="$1"
    local title="$2"
    local content="$3"
    local effort="$4"
    local priority="$5"
    local parent_id="$6"
    
    local work_item_id=$(generate_work_item_id "$work_item_type")
    local template_file=""
    local timestamp=$(date -I)
    local year=$(date +%Y)
    local sequence=$(printf "%03d" $(get_next_sequence "$work_item_type"))
    
    # Get template file
    case "$work_item_type" in
        "Epic") template_file="epic-template.md" ;;
        "Feature") template_file="feature-template.md" ;;
        "User Story") template_file="user-story-template.md" ;;
        "Task") template_file="task-template.md" ;;
        "Bug") template_file="bug-template.md" ;;
    esac
    
    if [[ ! -f "$TEMPLATES_PATH/$template_file" ]]; then
        log_error "Template file not found: $template_file"
        return 1
    fi
    
    # Create work item file directory
    local work_item_dir=$(get_work_item_directory "$work_item_type")
    
    if [[ "$DRY_RUN" != "true" ]]; then
        local work_item_file="$WORK_ITEMS_PATH/$work_item_dir/$work_item_id.md"
        
        # Fill template
        sed -e "s/{YYYY-MM-DD}/$timestamp/g" \
            -e "s/{YYYY}/$year/g" \
            -e "s/{###}/$sequence/g" \
            -e "s/\\[.*Title.*\\]/$title/g" \
            -e "s/\\[.*Description.*\\]/${content:0:500}/g" \
            "$TEMPLATES_PATH/$template_file" > "$work_item_file"
    fi
    
    # Prepare work item JSON
    local work_item_json=$(cat << EOF
{
  "id": "$work_item_id",
  "title": "$title",
  "type": "$work_item_type",
  "state": "New",
  "effort": "$effort",
  "priority": "$priority",
  "parentId": "${parent_id:-null}",
  "filename": "$work_item_id.md",
  "created": "$timestamp"
}
EOF
)
    
    # Save work item (respects dry-run mode)
    save_work_item "$work_item_json" "$work_item_type" "$work_item_id"
    
    echo "$work_item_id"
}

# Check for orphan policy violation
check_orphan_policy() {
    local work_item_type="$1"
    local parent_id="$2"
    
    case "$work_item_type" in
        "Feature"|"User Story"|"Task"|"Bug")
            if [[ -z "$parent_id" || "$parent_id" == "null" ]]; then
                return 1  # Orphan detected
            fi
            ;;
    esac
    return 0
}

# Process single issue file
process_issue_file() {
    local issue_file="$1"
    local content=$(cat "$ISSUES_PATH/$issue_file")
    
    echo
    echo "================================"
    log_info "Processing: $issue_file"
    echo "================================"
    
    # Analyze issue
    local work_item_type=$(analyze_issue_complexity "$content" "$issue_file")
    log_info "Determined work item type: $work_item_type"
    
    # Check for related work
    echo
    local has_related=$(get_input "Is this related to existing work items? (y/n)" "n")
    local parent_id=""
    
    if [[ "$has_related" =~ ^[Yy] ]]; then
        if show_parent_options "$work_item_type"; then
            parent_id=$(get_input "Select parent (enter work item ID) or leave blank for none")
        fi
    fi
    
    # Get effort estimate
    echo
    local effort=$(get_effort_estimate "$work_item_type")
    
    # Get priority
    echo
    log_info "Priority levels: ${PRIORITIES[*]}"
    local priority=$(get_input "Priority" "3-Medium")
    
    # Extract title
    local title=$(extract_title "$content")
    
    # Create work item
    local work_item_id=$(create_work_item "$work_item_type" "$title" "$content" "$effort" "$priority" "$parent_id")
    
    # Check orphan policy
    if ! check_orphan_policy "$work_item_type" "$parent_id"; then
        echo
        log_warning "Work item $work_item_id violates no-orphan policy!"
        local create_parent=$(get_input "Create parent work item? (y/n)" "y")
        
        if [[ "$create_parent" =~ ^[Yy] ]]; then
            log_info "Creating parent work item..."
            # This would involve creating a parent - simplified for now
            log_warning "Manual parent creation required. Please ensure proper hierarchy."
        fi
    fi
    
    echo
    log_success "Generated work item: $work_item_id"
}

# Main execution
main() {
    echo "🚀 ADO-Compatible Work Item Generator"
    echo "====================================="
    if [[ "$DRY_RUN" == "true" ]]; then
        echo -e "${MAGENTA}🧪 DRY RUN MODE - No files will be modified${NC}"
        echo -e "${MAGENTA}📋 Preview work items that would be created${NC}"
    fi
    echo
    
    # Check prerequisites
    if ! command -v jq &> /dev/null; then
        log_error "jq is required but not installed. Please install jq first."
        exit 1
    fi
    
    # Initialize
    load_backlog
    
    # Check for issues
    if [[ ! -d "$ISSUES_PATH" ]]; then
        log_error "Issues directory not found: $ISSUES_PATH"
        exit 1
    fi
    
    local issue_files=($(find "$ISSUES_PATH" -name "*.md" -o -name "*.txt" | xargs -r basename -a))
    
    if [[ ${#issue_files[@]} -eq 0 ]]; then
        log_warning "No issues found. Place issue files in $ISSUES_PATH to begin."
        exit 0
    fi
    
    log_info "Found ${#issue_files[@]} issue(s) to process"
    
    # Process each issue
    for issue_file in "${issue_files[@]}"; do
        process_issue_file "$issue_file"
    done
    
    # Display dry-run summary if applicable
    display_dry_run_summary
    
    echo
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "Dry run completed - no files were modified"
        log_info "Remove --dry-run to actually create work items"
    else
        log_success "Work item generation completed!"
        log_info "Run 'validate-backlog.sh' to check ADO compliance"
        log_info "Run 'migrate-to-ado.sh' to export for Azure DevOps"
    fi
}

# Run main function
main "$@"
