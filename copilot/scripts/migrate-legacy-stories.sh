#!/bin/bash

# Legacy User Story Migration Script
# 
# Migrates existing user stories from /copilot/userstories/ into the new 
# ADO-compatible work item tracking system.

set -e

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
            echo "  --dry-run    Preview migration without modifying files"
            echo "  --verbose    Show detailed migration information"
            echo "  --help       Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_PATH="$(dirname "$SCRIPT_DIR")"
WORK_ITEMS_PATH="$BASE_PATH/work-items"
USERSTORIES_PATH="$BASE_PATH/userstories"
BACKLOG_FILE="$WORK_ITEMS_PATH/backlog.json"
COMPLETED_FILE="$BASE_PATH/completed-user-stories.md"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Counters for migration summary
MIGRATED_EPICS=0
MIGRATED_FEATURES=0
MIGRATED_STORIES=0
MIGRATED_TASKS=0
MIGRATED_BUGS=0

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

# Parse completion status from completed-user-stories.md
get_completion_status() {
    local story_id="$1"
    
    if [[ ! -f "$COMPLETED_FILE" ]]; then
        echo "New"
        return
    fi
    
    if grep -q "$story_id.*Complete ✓" "$COMPLETED_FILE"; then
        echo "Closed"
    elif grep -q "$story_id.*Partially Complete ⚠️" "$COMPLETED_FILE"; then
        echo "Active"
    else
        echo "New"
    fi
}

# Extract story information from markdown file
parse_user_story() {
    local file_path="$1"
    local filename=$(basename "$file_path" .md)
    
    # Extract fields using grep and sed, with fallbacks
    local title=$(grep "^#[^#]" "$file_path" | head -n1 | sed 's/^#[[:space:]]*//' || echo "Untitled Story")
    local story_id=$(grep "Story Identifier:" "$file_path" | sed 's/.*Story Identifier:[[:space:]]*//' | head -n1 || echo "$filename")
    local priority=$(grep "Priority:" "$file_path" | sed 's/.*Priority:[[:space:]]*//' | head -n1 || echo "Medium")
    local story_points=$(grep "Story Points:" "$file_path" | sed 's/.*Story Points:[[:space:]]*//' | head -n1 || echo "3")
    
    # Clean up extracted values
    title=$(echo "$title" | tr -d '"' | sed 's/[|]/-/g')
    story_id=$(echo "$story_id" | tr -d '"' | sed 's/[|]/-/g')
    priority=$(echo "$priority" | tr -d '"')
    story_points=$(echo "$story_points" | tr -d '"' | grep -o '[0-9]*' | head -n1)
    
    # Default story points if not found or invalid
    if [[ -z "$story_points" ]] || ! [[ "$story_points" =~ ^[0-9]+$ ]]; then
        story_points="3"
    fi
    
    # Map priority to ADO format
    local ado_priority="3-Medium"
    if [[ "$priority" =~ "High" ]] || [[ "$priority" =~ "P01" ]]; then
        ado_priority="2-High"
    elif [[ "$priority" =~ "Critical" ]]; then
        ado_priority="1-Critical"
    elif [[ "$priority" =~ "Low" ]]; then
        ado_priority="4-Low"
    fi
    
    # Determine work item type based on story ID pattern and filename
    local work_item_type="User Story"
    if [[ "$filename" =~ P[0-9]+-[A-Z]+-00001$ ]] || [[ "$story_id" =~ -00001$ ]]; then
        work_item_type="Epic"
    elif [[ "$filename" =~ P[0-9]+-[A-Z]+-00001\.[0-9]+$ ]] || [[ "$story_id" =~ -00001\.[0-9]+$ ]]; then
        work_item_type="Feature"
    elif [[ "$filename" =~ \.[0-9]+\.[0-9]+$ ]] || [[ "$story_id" =~ \.[0-9]+\.[0-9]+$ ]]; then
        work_item_type="Task"
    fi
    
    # Get parent ID for hierarchy
    local parent_id=""
    if [[ "$work_item_type" == "Feature" ]]; then
        # Extract parent epic ID from filename pattern
        parent_id=$(echo "$filename" | sed 's/\.[0-9]*$//')
    elif [[ "$work_item_type" == "Task" ]]; then
        # Extract parent feature ID from filename pattern
        parent_id=$(echo "$filename" | sed 's/\.[0-9]*$//')
    fi
    
    # Get completion status
    local state=$(get_completion_status "$filename")
    
    # Generate new ADO-compatible ID
    local year=$(date +%Y)
    local prefix="US"
    case "$work_item_type" in
        "Epic") prefix="E" ;;
        "Feature") prefix="F" ;;
        "Task") prefix="T" ;;
    esac
    
    # Create unique sequence number based on filename
    local sequence=$(echo "$filename" | sed 's/[^0-9]//g' | tail -c 4)
    if [[ ${#sequence} -lt 3 ]]; then
        sequence=$(printf "%03d" $(($(echo "$filename" | cksum | cut -f1 -d ' ') % 999 + 1)))
    fi
    local ado_id="${prefix}-${year}-${sequence}"
    
    # Output parsed data (use | separator but escape any | in the data)
    echo "$ado_id|$title|$work_item_type|$state|$story_points|$ado_priority|$parent_id|$filename"
}

# Generate work item JSON
generate_work_item_json() {
    local ado_id="$1"
    local title="$2"
    local work_item_type="$3"
    local state="$4"
    local effort="$5"
    local priority="$6"
    local parent_id="$7"
    local filename="$8"
    local timestamp=$(date -I)
    
    # Handle parent ID - set to null if empty
    local parent_field="null"
    if [[ -n "$parent_id" ]]; then
        parent_field="\"$parent_id\""
    fi
    
    cat << EOF
{
  "id": "$ado_id",
  "title": "$title",
  "type": "$work_item_type",
  "state": "$state",
  "effort": "$effort",
  "priority": "$priority",
  "parentId": $parent_field,
  "originalStoryId": "$filename",
  "filename": "$filename.md",
  "created": "$timestamp",
  "migrated": true
}
EOF
}

# Add work item to backlog arrays
add_to_backlog() {
    local work_item_json="$1"
    local work_item_type="$2"
    
    case "$work_item_type" in
        "Epic")
            EPIC_ITEMS+=("$work_item_json")
            ((MIGRATED_EPICS++))
            ;;
        "Feature")
            FEATURE_ITEMS+=("$work_item_json")
            ((MIGRATED_FEATURES++))
            ;;
        "User Story")
            STORY_ITEMS+=("$work_item_json")
            ((MIGRATED_STORIES++))
            ;;
        "Task")
            TASK_ITEMS+=("$work_item_json")
            ((MIGRATED_TASKS++))
            ;;
        "Bug")
            BUG_ITEMS+=("$work_item_json")
            ((MIGRATED_BUGS++))
            ;;
    esac
}

# Generate final backlog JSON
generate_backlog() {
    local timestamp=$(date -I)
    local total_migrated=$((MIGRATED_EPICS + MIGRATED_FEATURES + MIGRATED_STORIES + MIGRATED_TASKS + MIGRATED_BUGS))
    
    # Start JSON structure
    echo "{"
    echo "  \"epics\": ["
    if [[ ${#EPIC_ITEMS[@]} -gt 0 ]]; then
        printf '%s' "${EPIC_ITEMS[0]}"
        for ((i=1; i<${#EPIC_ITEMS[@]}; i++)); do
            printf ',%s' "${EPIC_ITEMS[$i]}"
        done
    fi
    echo
    echo "  ],"
    
    echo "  \"features\": ["
    if [[ ${#FEATURE_ITEMS[@]} -gt 0 ]]; then
        printf '%s' "${FEATURE_ITEMS[0]}"
        for ((i=1; i<${#FEATURE_ITEMS[@]}; i++)); do
            printf ',%s' "${FEATURE_ITEMS[$i]}"
        done
    fi
    echo
    echo "  ],"
    
    echo "  \"userStories\": ["
    if [[ ${#STORY_ITEMS[@]} -gt 0 ]]; then
        printf '%s' "${STORY_ITEMS[0]}"
        for ((i=1; i<${#STORY_ITEMS[@]}; i++)); do
            printf ',%s' "${STORY_ITEMS[$i]}"
        done
    fi
    echo
    echo "  ],"
    
    echo "  \"tasks\": ["
    if [[ ${#TASK_ITEMS[@]} -gt 0 ]]; then
        printf '%s' "${TASK_ITEMS[0]}"
        for ((i=1; i<${#TASK_ITEMS[@]}; i++)); do
            printf ',%s' "${TASK_ITEMS[$i]}"
        done
    fi
    echo
    echo "  ],"
    
    echo "  \"bugs\": ["
    if [[ ${#BUG_ITEMS[@]} -gt 0 ]]; then
        printf '%s' "${BUG_ITEMS[0]}"
        for ((i=1; i<${#BUG_ITEMS[@]}; i++)); do
            printf ',%s' "${BUG_ITEMS[$i]}"
        done
    fi
    echo
    echo "  ],"
    
    cat << EOF
  "metadata": {
    "lastUpdated": "$timestamp",
    "version": "1.0",
    "adoCompliant": true,
    "migrationInfo": {
      "migratedOn": "$timestamp",
      "sourceDirectory": "./userstories/",
      "completedStoriesReference": "./completed-user-stories.md",
      "totalMigrated": $total_migrated
    },
    "configurationNotes": {
      "estimationStandards": {
        "storyPoints": "Fibonacci sequence (1,2,3,5,8,13,21,34,55,89)",
        "taskHours": "Granular time estimates for development work",
        "epicSizing": "Large Fibonacci values (21+) for strategic initiatives"
      },
      "priorityLevels": {
        "1-Critical": "Blocking issues, production down",
        "2-High": "Important features, significant bugs", 
        "3-Medium": "Standard features, minor bugs",
        "4-Low": "Nice-to-have, technical debt"
      },
      "stateTransitions": {
        "New": "Just created, needs triage",
        "Active": "Assigned and in progress",
        "Resolved": "Work completed, needs verification",
        "Closed": "Verified and accepted",
        "Removed": "Cancelled or invalid"
      },
      "businessRules": [
        "No orphan work items (all must have proper parent except Epics)",
        "Fibonacci estimation required for User Stories and above",
        "Parent-child relationships must follow ADO hierarchy",
        "All work items must have effort estimates before activation"
      ]
    }
  }
}
EOF
}

# Main migration function
main() {
    echo -e "${CYAN}🔄 Legacy User Story Migration${NC}"
    echo -e "${YELLOW}══════════════════════════════${NC}"
    if [[ "$DRY_RUN" == "true" ]]; then
        echo -e "${MAGENTA}🧪 DRY RUN MODE - No files will be modified${NC}"
    fi
    echo
    
    # Check prerequisites
    if ! command -v jq &> /dev/null; then
        log_error "jq is required but not installed"
        exit 1
    fi
    
    if [[ ! -d "$USERSTORIES_PATH" ]]; then
        log_error "User stories directory not found: $USERSTORIES_PATH"
        exit 1
    fi
    
    # Initialize arrays for work items
    EPIC_ITEMS=()
    FEATURE_ITEMS=()
    STORY_ITEMS=()
    TASK_ITEMS=()
    BUG_ITEMS=()
    
    # Find all user story files
    local story_files=($(find "$USERSTORIES_PATH" -name "*.md" | grep -v README.md | sort))
    
    if [[ ${#story_files[@]} -eq 0 ]]; then
        log_warning "No user story files found"
        exit 0
    fi
    
    log_info "Found ${#story_files[@]} user story files to migrate"
    echo
    
    # Process each user story
    for story_file in "${story_files[@]}"; do
        local filename=$(basename "$story_file" .md)
        
        if [[ "$VERBOSE" == "true" ]] || [[ "$DRY_RUN" == "true" ]]; then
            log_info "Processing: $filename"
        fi
        
        # Parse the story
        local story_data=$(parse_user_story "$story_file")
        IFS='|' read -r ado_id title work_item_type state effort priority parent_id orig_filename <<< "$story_data"
        
        # Generate work item JSON
        local work_item_json=$(generate_work_item_json "$ado_id" "$title" "$work_item_type" "$state" "$effort" "$priority" "$parent_id" "$orig_filename")
        
        # Add to appropriate array
        add_to_backlog "$work_item_json" "$work_item_type"
        
        if [[ "$VERBOSE" == "true" ]]; then
            echo -e "   ${GREEN}→ $ado_id: $title ($work_item_type, $state)${NC}"
        fi
    done
    
    echo
    log_info "Migration Summary:"
    echo -e "   📈 Epics: $MIGRATED_EPICS"
    echo -e "   🎯 Features: $MIGRATED_FEATURES"
    echo -e "   📝 User Stories: $MIGRATED_STORIES"
    echo -e "   ⚙️  Tasks: $MIGRATED_TASKS"
    echo -e "   🐛 Bugs: $MIGRATED_BUGS"
    echo -e "   📊 Total: $((MIGRATED_EPICS + MIGRATED_FEATURES + MIGRATED_STORIES + MIGRATED_TASKS + MIGRATED_BUGS))"
    echo
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "Dry run completed - no files were modified"
        log_info "Generated backlog structure preview:"
        echo
        generate_backlog | jq '.metadata.migrationInfo'
        echo
        log_info "Remove --dry-run to perform actual migration"
    else
        # Create work-items directory if it doesn't exist
        mkdir -p "$WORK_ITEMS_PATH"
        
        # Backup existing backlog if it exists
        if [[ -f "$BACKLOG_FILE" ]]; then
            local backup_file="${BACKLOG_FILE}.backup.$(date +%Y%m%d-%H%M%S)"
            cp "$BACKLOG_FILE" "$backup_file"
            log_info "Backed up existing backlog to: $(basename "$backup_file")"
        fi
        
        # Generate and write new backlog
        generate_backlog > "$BACKLOG_FILE"
        
        log_success "Migration completed successfully!"
        log_info "New backlog created: $BACKLOG_FILE"
        echo
        log_info "Next steps:"
        echo -e "   1. Review migrated work items: ${CYAN}./sow status${NC}"
        echo -e "   2. Validate ADO compliance: ${CYAN}./sow validate${NC}"
        echo -e "   3. Export for Azure DevOps: ${CYAN}./sow export --dry-run${NC}"
    fi
}

# Run main function
main "$@"
