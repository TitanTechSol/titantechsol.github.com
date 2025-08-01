#!/bin/bash

# Backlog Validator
# 
# Validates the work item backlog against ADO compliance rules and best practices.
# Supports dry-run mode to preview validation results without generating reports.

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
            echo "  --dry-run    Preview validation without generating reports"
            echo "  --verbose    Show detailed validation information"
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
WORK_ITEMS_PATH="$BASE_PATH/work-items"
BACKLOG_FILE="$WORK_ITEMS_PATH/backlog.json"

# ADO configuration
FIBONACCI_SEQUENCE=(1 2 3 5 8 13 21 34 55 89)
VALID_STATES=("New" "Active" "Resolved" "Closed" "Removed")
VALID_PRIORITIES=("1-Critical" "2-High" "3-Medium" "4-Low")

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Counters
PASSED_COUNT=0
WARNING_COUNT=0
ERROR_COUNT=0

log_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASSED_COUNT++))
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNING_COUNT++))
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
    ((ERROR_COUNT++))
}

# Check if number is in Fibonacci sequence
is_fibonacci() {
    local num="$1"
    for fib in "${FIBONACCI_SEQUENCE[@]}"; do
        if [[ "$num" == "$fib" ]]; then
            return 0
        fi
    done
    return 1
}

# Check if state is valid
is_valid_state() {
    local state="$1"
    for valid_state in "${VALID_STATES[@]}"; do
        if [[ "$state" == "$valid_state" ]]; then
            return 0
        fi
    done
    return 1
}

# Check if priority is valid
is_valid_priority() {
    local priority="$1"
    for valid_priority in "${VALID_PRIORITIES[@]}"; do
        if [[ "$priority" == "$valid_priority" ]]; then
            return 0
        fi
    done
    return 1
}

# Validate hierarchy relationships
validate_hierarchy() {
    log_info "Validating work item hierarchy..."
    
    local all_work_items=$(jq -r '
        [.epics[], .features[], .userStories[], .tasks[], .bugs[]] | 
        .[] | 
        "\(.id)|\(.type)|\(.parentId // "null")"
    ' "$BACKLOG_FILE")
    
    # Create associative arrays for work item lookup
    declare -A work_item_types
    declare -A work_item_exists
    
    while IFS='|' read -r id type parent_id; do
        work_item_types["$id"]="$type"
        work_item_exists["$id"]=1
    done <<< "$all_work_items"
    
    # Validate parent-child relationships
    while IFS='|' read -r id type parent_id; do
        if [[ "$parent_id" != "null" ]]; then
            # Check if parent exists
            if [[ ! "${work_item_exists[$parent_id]}" ]]; then
                log_error "[$id] Parent '$parent_id' not found"
                continue
            fi
            
            # Check if relationship is valid
            local parent_type="${work_item_types[$parent_id]}"
            case "$parent_type" in
                "Epic")
                    if [[ "$type" != "Feature" ]]; then
                        log_error "[$id] $type cannot be child of $parent_type"
                    fi
                    ;;
                "Feature")
                    if [[ "$type" != "User Story" ]]; then
                        log_error "[$id] $type cannot be child of $parent_type"
                    fi
                    ;;
                "User Story")
                    if [[ "$type" != "Task" && "$type" != "Bug" ]]; then
                        log_error "[$id] $type cannot be child of $parent_type"
                    fi
                    ;;
                *)
                    log_error "[$id] Invalid parent type: $parent_type"
                    ;;
            esac
        fi
    done <<< "$all_work_items"
    
    log_success "Hierarchy validation completed"
}

# Validate estimations
validate_estimations() {
    log_info "Validating estimations..."
    
    # Check story points (non-Task items)
    local non_task_items=$(jq -r '
        [.epics[], .features[], .userStories[], .bugs[]] | 
        .[] | 
        select(.effort) |
        "\(.id)|\(.type)|\(.effort)|\(.state)"
    ' "$BACKLOG_FILE")
    
    while IFS='|' read -r id type effort state; do
        if [[ -n "$effort" ]]; then
            if ! is_fibonacci "$effort"; then
                log_warning "[$id] Effort '$effort' not in Fibonacci sequence"
            fi
        fi
        
        # Check for missing estimations on active items
        if [[ "$state" != "New" && -z "$effort" ]]; then
            log_error "[$id] Missing effort estimation for active work item"
        fi
    done <<< "$non_task_items"
    
    # Check task hours
    local task_items=$(jq -r '
        .tasks[] | 
        "\(.id)|\(.effort)|\(.state)"
    ' "$BACKLOG_FILE")
    
    while IFS='|' read -r id effort state; do
        if [[ "$state" != "New" && -z "$effort" ]]; then
            log_error "[$id] Missing effort estimation for active task"
        fi
        
        if [[ -n "$effort" && ! "$effort" =~ ^[0-9]+(\.[0-9]+)?$ ]]; then
            log_error "[$id] Invalid task effort format: '$effort' (should be hours)"
        fi
    done <<< "$task_items"
    
    log_success "Estimation validation completed"
}

# Validate states
validate_states() {
    log_info "Validating states..."
    
    local all_work_items=$(jq -r '
        [.epics[], .features[], .userStories[], .tasks[], .bugs[]] | 
        .[] | 
        "\(.id)|\(.state)"
    ' "$BACKLOG_FILE")
    
    while IFS='|' read -r id state; do
        if ! is_valid_state "$state"; then
            log_error "[$id] Invalid state: '$state'"
        fi
    done <<< "$all_work_items"
    
    log_success "State validation completed"
}

# Validate priorities
validate_priorities() {
    log_info "Validating priorities..."
    
    local all_work_items=$(jq -r '
        [.epics[], .features[], .userStories[], .tasks[], .bugs[]] | 
        .[] | 
        "\(.id)|\(.priority // \"missing\")"
    ' "$BACKLOG_FILE")
    
    while IFS='|' read -r id priority; do
        if [[ "$priority" == "missing" ]]; then
            log_warning "[$id] Missing priority"
        elif ! is_valid_priority "$priority"; then
            log_error "[$id] Invalid priority: '$priority'"
        fi
    done <<< "$all_work_items"
    
    log_success "Priority validation completed"
}

# Check for orphaned work items
validate_orphans() {
    log_info "Checking for orphaned work items..."
    
    local orphan_count=0
    
    # Check Features
    local features=$(jq -r '.features[] | select(.parentId == null or .parentId == "") | "\(.id)|\(.title)"' "$BACKLOG_FILE")
    while IFS='|' read -r id title; do
        if [[ -n "$id" ]]; then
            log_error "[$id] Orphaned Feature: $title (violates no-orphan policy)"
            ((orphan_count++))
        fi
    done <<< "$features"
    
    # Check User Stories
    local user_stories=$(jq -r '.userStories[] | select(.parentId == null or .parentId == "") | "\(.id)|\(.title)"' "$BACKLOG_FILE")
    while IFS='|' read -r id title; do
        if [[ -n "$id" ]]; then
            log_error "[$id] Orphaned User Story: $title (violates no-orphan policy)"
            ((orphan_count++))
        fi
    done <<< "$user_stories"
    
    # Check Tasks
    local tasks=$(jq -r '.tasks[] | select(.parentId == null or .parentId == "") | "\(.id)|\(.title)"' "$BACKLOG_FILE")
    while IFS='|' read -r id title; do
        if [[ -n "$id" ]]; then
            log_error "[$id] Orphaned Task: $title (violates no-orphan policy)"
            ((orphan_count++))
        fi
    done <<< "$tasks"
    
    # Check Bugs
    local bugs=$(jq -r '.bugs[] | select(.parentId == null or .parentId == "") | "\(.id)|\(.title)"' "$BACKLOG_FILE")
    while IFS='|' read -r id title; do
        if [[ -n "$id" ]]; then
            log_error "[$id] Orphaned Bug: $title (violates no-orphan policy)"
            ((orphan_count++))
        fi
    done <<< "$bugs"
    
    if [[ $orphan_count -eq 0 ]]; then
        log_success "No orphaned work items found (ADO compliance maintained)"
    else
        log_error "Found $orphan_count orphaned work items"
    fi
}

# Check for circular dependencies
validate_dependencies() {
    log_info "Validating dependencies..."
    
    # This is a simplified check - could be enhanced with more sophisticated cycle detection
    local all_work_items=$(jq -r '
        [.epics[], .features[], .userStories[], .tasks[], .bugs[]] | 
        .[] | 
        "\(.id)|\(.parentId // \"null\")"
    ' "$BACKLOG_FILE")
    
    # For now, just check that no work item references itself as parent
    while IFS='|' read -r id parent_id; do
        if [[ "$id" == "$parent_id" ]]; then
            log_error "[$id] Self-referential dependency detected"
        fi
    done <<< "$all_work_items"
    
    log_success "Dependency validation completed"
}

# Generate summary report
generate_report() {
    echo
    echo "📊 Validation Report"
    echo "=================="
    echo
    
    # Count work items
    local epic_count=$(jq '.epics | length' "$BACKLOG_FILE")
    local feature_count=$(jq '.features | length' "$BACKLOG_FILE")
    local story_count=$(jq '.userStories | length' "$BACKLOG_FILE")
    local task_count=$(jq '.tasks | length' "$BACKLOG_FILE")
    local bug_count=$(jq '.bugs | length' "$BACKLOG_FILE")
    local total_count=$((epic_count + feature_count + story_count + task_count + bug_count))
    
    log_info "Work Item Summary:"
    echo "  📋 Epics: $epic_count"
    echo "  🎯 Features: $feature_count"
    echo "  📝 User Stories: $story_count"
    echo "  ⚙️  Tasks: $task_count"
    echo "  🐛 Bugs: $bug_count"
    echo "  📊 Total: $total_count"
    echo
    
    log_info "Validation Results:"
    echo -e "  ${GREEN}✅ Passed: $PASSED_COUNT${NC}"
    if [[ $WARNING_COUNT -gt 0 ]]; then
        echo -e "  ${YELLOW}⚠️  Warnings: $WARNING_COUNT${NC}"
    fi
    if [[ $ERROR_COUNT -gt 0 ]]; then
        echo -e "  ${RED}❌ Errors: $ERROR_COUNT${NC}"
    fi
    echo
    
    # ADO Compliance status
    if [[ $ERROR_COUNT -eq 0 ]]; then
        echo -e "🎯 ADO Compliance: ${GREEN}✅ COMPLIANT${NC}"
        echo
        if [[ "$DRY_RUN" == "true" ]]; then
            log_info "Dry run: Backlog validation passed - ready for ADO migration"
        else
            log_success "Backlog is ready for Azure DevOps migration!"
        fi
    else
        echo -e "🎯 ADO Compliance: ${RED}❌ NON-COMPLIANT${NC}"
        echo
        if [[ "$DRY_RUN" == "true" ]]; then
            log_info "Dry run: Found validation errors - fix before ADO migration"
        else
            log_error "Please fix the errors above before proceeding with ADO migration."
            echo "Run 'generate-work-items.sh' to create missing parent work items."
        fi
    fi
    
    if [[ "$DRY_RUN" == "true" ]]; then
        echo
        log_info "No report files generated in dry-run mode"
        log_info "Remove --dry-run to generate validation reports"
    fi
}

# Main execution
main() {
    echo "🔍 ADO Backlog Validation"
    echo "========================="
    if [[ "$DRY_RUN" == "true" ]]; then
        echo -e "${CYAN}🧪 DRY RUN MODE - No reports will be generated${NC}"
        echo -e "${CYAN}📋 Preview validation results only${NC}"
    fi
    echo
    
    # Check prerequisites
    if ! command -v jq &> /dev/null; then
        log_error "jq is required but not installed. Please install jq first."
        exit 1
    fi
    
    if [[ ! -f "$BACKLOG_FILE" ]]; then
        log_error "Backlog file not found: $BACKLOG_FILE"
        log_info "Run 'generate-work-items.sh' first to create work items."
        exit 1
    fi
    
    # Run validations
    validate_hierarchy
    validate_estimations
    validate_states
    validate_priorities
    validate_orphans
    validate_dependencies
    
    # Generate report (respects dry-run mode)
    generate_report
    
    # Exit with error code if there are errors
    if [[ $ERROR_COUNT -gt 0 ]]; then
        exit 1
    fi
}

# Run main function
main "$@"
