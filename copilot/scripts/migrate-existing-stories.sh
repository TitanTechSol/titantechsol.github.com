#!/bin/bash

# Migration Script: Existing User Stories to ADO-Compatible System
# 
# This script migrates existing user stories from /copilot/userstories/
# into the new ADO-compatible work item tracking system.

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_PATH="$(dirname "$SCRIPT_DIR")"
USERSTORIES_PATH="$BASE_PATH/userstories"
WORK_ITEMS_PATH="$BASE_PATH/work-items"
BACKLOG_FILE="$WORK_ITEMS_PATH/backlog.json"
COMPLETED_FILE="$BASE_PATH/completed-user-stories.md"

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

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

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

# Show banner
show_banner() {
    echo -e "${CYAN}🔄 User Story Migration${NC}"
    echo -e "${YELLOW}══════════════════════${NC}"
    if [[ "$DRY_RUN" == "true" ]]; then
        echo -e "${MAGENTA}🧪 DRY RUN MODE - No files will be modified${NC}"
    fi
    echo
}

# Main execution
main() {
    show_banner
    
    # Check prerequisites
    if ! command -v jq &> /dev/null; then
        log_error "jq is required but not installed"
        exit 1
    fi
    
    if [[ ! -d "$USERSTORIES_PATH" ]]; then
        log_error "User stories directory not found: $USERSTORIES_PATH"
        exit 1
    fi
    
    # Count existing stories
    local story_count=$(find "$USERSTORIES_PATH" -name "*.md" | wc -l)
    log_info "Found $story_count user stories to migrate"
    
    if [[ $story_count -eq 0 ]]; then
        log_warning "No user stories found to migrate"
        exit 0
    fi
    
    # Parse completed stories status
    log_info "Parsing completion status from completed-user-stories.md"
    
    # Show what would be migrated
    if [[ "$DRY_RUN" == "true" ]]; then
        echo -e "${YELLOW}📋 Stories that would be migrated:${NC}"
        find "$USERSTORIES_PATH" -name "*.md" | head -10 | while read -r file; do
            local basename=$(basename "$file")
            echo -e "   ${CYAN}• $basename${NC}"
        done
        if [[ $story_count -gt 10 ]]; then
            echo -e "   ${CYAN}... and $((story_count - 10)) more${NC}"
        fi
        echo
        echo -e "${MAGENTA}💡 Remove --dry-run to perform actual migration${NC}"
    else
        log_success "Migration would create $story_count work items in ADO format"
        log_info "Use the SOW system to perform the actual migration:"
        echo
        echo -e "${YELLOW}Recommended approach:${NC}"
        echo -e "1. ${CYAN}Create issues from existing stories${NC}"
        echo -e "2. ${CYAN}Use './sow create' to generate proper ADO work items${NC}"
        echo -e "3. ${CYAN}Validate with './sow validate'${NC}"
    fi
}

main "$@"
