#!/bin/bash

# ADO Migration Utility
# 
# Prepares work items for Azure DevOps import by generating CSV files
# and maintaining proper relationships for bulk import.
# Supports dry-run mode to preview export without generating files.

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
            echo "  --dry-run    Preview export without generating CSV files"
            echo "  --verbose    Show detailed export information"
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
OUTPUT_PATH="$BASE_PATH/ado-export"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
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

# Create output directory
create_output_directory() {
    if [[ "$DRY_RUN" != "true" ]]; then
        mkdir -p "$OUTPUT_PATH"
        log_info "Created export directory: $OUTPUT_PATH"
    else
        log_info "Would create export directory: $OUTPUT_PATH"
    fi
}

# Map work item type to ADO format
map_work_item_type() {
    local type="$1"
    case "$type" in
        "Epic") echo "Epic" ;;
        "Feature") echo "Feature" ;;
        "User Story") echo "User Story" ;;
        "Task") echo "Task" ;;
        "Bug") echo "Bug" ;;
        *) echo "$type" ;;
    esac
}

# Generate tags for work item
generate_tags() {
    local type="$1"
    local created="$2"
    local tags="Type:${type// /};Created:$created;TitanTech;SOW-Generated"
    echo "$tags"
}

# Escape CSV field
escape_csv_field() {
    local field="$1"
    # Replace quotes with double quotes and wrap in quotes
    echo "\"${field//\"/\"\"}\""
}

# Extract description from work item file
extract_description() {
    local work_item_file="$1"
    if [[ -f "$work_item_file" ]]; then
        # Extract content between description headers (simplified)
        grep -A 10 -i "description\|overview" "$work_item_file" | head -n 5 | tail -n +2 | tr '\n' ' ' | cut -c1-1000
    else
        echo ""
    fi
}

# Extract acceptance criteria from work item file
extract_acceptance_criteria() {
    local work_item_file="$1"
    if [[ -f "$work_item_file" ]]; then
        # Extract acceptance criteria section (simplified)
        sed -n '/## Acceptance Criteria/,/##/p' "$work_item_file" | head -n -1 | tail -n +2 | tr '\n' ' ' | cut -c1-1000
    else
        echo ""
    fi
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

# Sort work items by dependency (parents first)
sort_by_dependency() {
    local temp_file=$(mktemp)
    
    # First, extract all work items with their parent relationships
    jq -r '
        [.epics[], .features[], .userStories[], .tasks[], .bugs[]] | 
        sort_by(.created) |
        .[] | 
        "\(.id)|\(.type)|\(.parentId // \"null\")"
    ' "$BACKLOG_FILE" > "$temp_file"
    
    # Simple topological sort: process items with no parents first
    declare -a sorted_ids
    declare -A processed
    
    # First pass: items with no parents (Epics and orphans)
    while IFS='|' read -r id type parent_id; do
        if [[ "$parent_id" == "null" ]]; then
            sorted_ids+=("$id")
            processed["$id"]=1
        fi
    done < "$temp_file"
    
    # Additional passes: items whose parents have been processed
    local changed=1
    while [[ $changed -eq 1 ]]; do
        changed=0
        while IFS='|' read -r id type parent_id; do
            if [[ ! "${processed[$id]}" && "$parent_id" != "null" && "${processed[$parent_id]}" ]]; then
                sorted_ids+=("$id")
                processed["$id"]=1
                changed=1
            fi
        done < "$temp_file"
    done
    
    # Remaining items (shouldn't happen in a valid hierarchy)
    while IFS='|' read -r id type parent_id; do
        if [[ ! "${processed[$id]}" ]]; then
            sorted_ids+=("$id")
            processed["$id"]=1
        fi
    done < "$temp_file"
    
    rm "$temp_file"
    
    # Output sorted IDs
    printf '%s\n' "${sorted_ids[@]}"
}

# Generate work items CSV
generate_work_items_csv() {
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "Would generate work items CSV..."
    else
        log_info "Generating work items CSV..."
    fi
    
    local csv_file="$OUTPUT_PATH/work-items.csv"
    
    if [[ "$DRY_RUN" != "true" ]]; then
        # CSV Header
        cat > "$csv_file" << 'EOF'
"Work Item Type","Title","State","Assigned To","Description","Acceptance Criteria","Story Points","Original Estimate","Priority","Value Area","Business Value","Tags"
EOF
    fi
    
    # Get sorted work item IDs
    local sorted_ids
    readarray -t sorted_ids < <(sort_by_dependency)
    
    local count=0
    for id in "${sorted_ids[@]}"; do
        # Get work item details from backlog
        local work_item_data=$(jq -r "
            [.epics[], .features[], .userStories[], .tasks[], .bugs[]] | 
            .[] | 
            select(.id == \"$id\") |
            \"\(.id)|\(.title)|\(.type)|\(.state)|\(.effort)|\(.priority // \"3-Medium\")|\(.created)|\(.filename)\"
        " "$BACKLOG_FILE")
        
        if [[ -n "$work_item_data" ]]; then
            IFS='|' read -r wi_id title type state effort priority created filename <<< "$work_item_data"
            
            # Load work item file for detailed content
            local work_item_dir=$(get_work_item_directory "$type")
            local work_item_file="$WORK_ITEMS_PATH/$work_item_dir/$filename"
            local description=$(extract_description "$work_item_file")
            local acceptance_criteria=$(extract_acceptance_criteria "$work_item_file")
            
            # Map fields for ADO
            local ado_type=$(map_work_item_type "$type")
            local story_points=""
            local original_estimate=""
            
            if [[ "$type" == "Task" ]]; then
                original_estimate="$effort"
            else
                story_points="$effort"
            fi
            
            local tags=$(generate_tags "$type" "$created")
            
            if [[ "$DRY_RUN" == "true" ]]; then
                if [[ "$VERBOSE" == "true" ]]; then
                    log_info "Would export: $ado_type - $title (ID: $wi_id)"
                fi
            else
                # Write CSV row
                echo "$(escape_csv_field "$ado_type"),$(escape_csv_field "$title"),$(escape_csv_field "$state"),,$(escape_csv_field "$description"),$(escape_csv_field "$acceptance_criteria"),$(escape_csv_field "$story_points"),$(escape_csv_field "$original_estimate"),$(escape_csv_field "$priority"),$(escape_csv_field "Business"),,$(escape_csv_field "$tags")" >> "$csv_file"
            fi
            
            ((count++))
        fi
    done
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "Would export $count work items to CSV"
    else
        log_success "Work items CSV exported: $count items"
    fi
}

# Generate links CSV
generate_links_csv() {
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "Would generate links CSV..."
    else
        log_info "Generating links CSV..."
    fi
    
    local csv_file="$OUTPUT_PATH/work-item-links.csv"
    
    if [[ "$DRY_RUN" != "true" ]]; then
        # CSV Header
        echo '"Source ID","Target ID","Link Type"' > "$csv_file"
    fi
    
    # Extract parent-child relationships
    local links=$(jq -r '
        [.epics[], .features[], .userStories[], .tasks[], .bugs[]] | 
        .[] | 
        select(.parentId != null and .parentId != "") |
        "\(.id),\(.parentId),Child"
    ' "$BACKLOG_FILE")
    
    local count=0
    while IFS= read -r link; do
        if [[ -n "$link" ]]; then
            if [[ "$DRY_RUN" == "true" ]]; then
                if [[ "$VERBOSE" == "true" ]]; then
                    log_info "Would create link: $link"
                fi
            else
                echo "\"${link//,/\",\"}\"" >> "$csv_file"
            fi
            ((count++))
        fi
    done <<< "$links"
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "Would export $count work item links"
    else
        log_success "Links CSV exported: $count relationships"
    fi
}

# Generate import instructions
generate_import_instructions() {
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "Would generate import instructions..."
        return
    fi
    
    log_info "Generating import instructions..."
    
    local instructions_file="$OUTPUT_PATH/import-instructions.md"
    
    cat > "$instructions_file" << EOF
# Azure DevOps Import Instructions

## Files Generated

1. **work-items.csv** - Contains all work items with ADO-compatible fields
2. **work-item-links.csv** - Contains parent-child relationships  
3. **import-instructions.md** - This file

## Import Process

### Step 1: Prepare Azure DevOps Project
1. Create a new Azure DevOps project or select existing one
2. Ensure you have project administrator permissions
3. Verify the project uses Agile, Scrum, or CMMI process template

### Step 2: Import Work Items
1. Navigate to Boards > Work Items in your ADO project
2. Click "Import" from the toolbar
3. Upload **work-items.csv**
4. Map fields if prompted (most should auto-map)
5. Review and confirm import

### Step 3: Import Relationships
1. After work items are imported, note the new ADO work item IDs
2. Update **work-item-links.csv** with actual ADO IDs (replace TitanTech IDs)
3. Use ADO REST API or third-party tools to import relationships

### Step 4: Validation
1. Verify all work items imported correctly
2. Check parent-child relationships are established
3. Validate effort estimates and priorities
4. Review and update any missing fields

## Field Mappings

| TitanTech Field | ADO Field | Notes |
|----------------|-----------|-------|
| title | Title | Direct mapping |
| type | Work Item Type | Epic, Feature, User Story, Task, Bug |
| state | State | New, Active, Resolved, Closed, Removed |
| effort | Story Points / Original Estimate | Story Points for stories, hours for tasks |
| priority | Priority | 1-Critical, 2-High, 3-Medium, 4-Low |
| description | Description | Extracted from markdown content |
| acceptanceCriteria | Acceptance Criteria | Extracted from markdown |

## Process Template Compatibility

This export is compatible with:
- **Agile**: Epic → Feature → User Story → Task
- **Scrum**: Epic → Feature → Product Backlog Item → Task  
- **CMMI**: Epic → Feature → Requirement → Task

## Post-Import Configuration

1. Configure team iterations (sprints)
2. Set up area paths for different components
3. Configure board columns and states
4. Set up automated rules and notifications
5. Create dashboards and reports

## Troubleshooting

### Common Issues:
- **Field mapping errors**: Check field names match ADO schema
- **Work item type conflicts**: Ensure process template supports all types
- **Relationship import failures**: Verify parent work items exist before importing children
- **Permission errors**: Ensure sufficient ADO project permissions

### Support:
For issues with the migration process, refer to:
- Azure DevOps REST API documentation
- TitanTech SOW development behaviors
- Work item templates in /copilot/work-items/templates/

---
**Generated**: $(date -I)  
**Tool**: TitanTech ADO Migration Utility  
**Version**: 1.0  
**Total Work Items**: $(jq '[.epics[], .features[], .userStories[], .tasks[], .bugs[]] | length' "$BACKLOG_FILE")
EOF
    
    log_success "Import instructions generated"
}

# Main execution
main() {
    echo "🚀 ADO Migration Utility"
    echo "========================"
    if [[ "$DRY_RUN" == "true" ]]; then
        echo -e "${CYAN}🧪 DRY RUN MODE - No CSV files will be generated${NC}"
        echo -e "${CYAN}📋 Preview export structure and statistics${NC}"
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
    
    # Check if backlog has work items
    local total_items=$(jq '[.epics[], .features[], .userStories[], .tasks[], .bugs[]] | length' "$BACKLOG_FILE")
    if [[ "$total_items" -eq 0 ]]; then
        log_warning "No work items found in backlog. Nothing to export."
        exit 0
    fi
    
    log_info "Found $total_items work items to export"
    
    # Create output directory
    create_output_directory
    
    # Generate export files
    generate_work_items_csv
    generate_links_csv
    generate_import_instructions
    
    echo
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "Dry run completed - no files were generated"
        log_info "Export would be located at: $OUTPUT_PATH"
        echo
        log_info "Remove --dry-run to generate actual CSV files for ADO import"
    else
        log_success "ADO migration files generated successfully!"
        log_info "Export location: $OUTPUT_PATH"
        echo
        log_info "Next steps:"
        echo "  1. Review generated CSV files"
        echo "  2. Follow import-instructions.md"
        echo "  3. Import into Azure DevOps"
        echo "  4. Validate relationships and hierarchy"
    fi
}

# Run main function
main "$@"
