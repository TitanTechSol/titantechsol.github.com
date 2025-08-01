#!/bin/bash

# Work Items Data Management Script
# Demonstrates scalable work item architecture

WORK_ITEMS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/work-items"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Generate lightweight index from individual JSON files
generate_index() {
    print_header "Generating Work Items Index"
    
    local index_file="$WORK_ITEMS_DIR/index.json"
    
    echo '{' > "$index_file"
    echo '  "summary": {' >> "$index_file"
    
    # Count work items by type
    local epic_count=$(find "$WORK_ITEMS_DIR/epics" -name "*.json" 2>/dev/null | wc -l)
    local feature_count=$(find "$WORK_ITEMS_DIR/features" -name "*.json" 2>/dev/null | wc -l)
    local story_count=$(find "$WORK_ITEMS_DIR/user-stories" -name "*.json" 2>/dev/null | wc -l)
    local task_count=$(find "$WORK_ITEMS_DIR/tasks" -name "*.json" 2>/dev/null | wc -l)
    
    echo "    \"epics\": $epic_count," >> "$index_file"
    echo "    \"features\": $feature_count," >> "$index_file"
    echo "    \"userStories\": $story_count," >> "$index_file"
    echo "    \"tasks\": $task_count," >> "$index_file"
    echo "    \"lastUpdated\": \"$(date -u +%Y-%m-%dT%H:%M:%S.000Z)\"" >> "$index_file"
    echo '  },' >> "$index_file"
    echo '  "activeItems": [' >> "$index_file"
    
    # Find active work items
    local first=true
    for json_file in $(find "$WORK_ITEMS_DIR" -name "*.json" -not -path "*/index.json" 2>/dev/null); do
        local state=$(jq -r '.fields."System.State"' "$json_file" 2>/dev/null)
        if [[ "$state" == "Active" ]]; then
            if [[ "$first" == "true" ]]; then
                first=false
            else
                echo '    ,' >> "$index_file"
            fi
            local id=$(jq -r '.id' "$json_file")
            local title=$(jq -r '.fields."System.Title"' "$json_file")
            echo "    {" >> "$index_file"
            echo "      \"id\": $id," >> "$index_file"
            echo "      \"title\": \"$title\"," >> "$index_file"
            echo "      \"file\": \"$(basename "$json_file")\"" >> "$index_file"
            echo -n "    }" >> "$index_file"
        fi
    done
    
    echo '' >> "$index_file"
    echo '  ]' >> "$index_file"
    echo '}' >> "$index_file"
    
    print_success "Index generated: $index_file"
}

# Split monolithic backlog.json into individual files
split_backlog() {
    print_header "Splitting Monolithic Backlog"
    
    local backlog_file="$WORK_ITEMS_DIR/backlog.json"
    
    if [[ ! -f "$backlog_file" ]]; then
        print_error "backlog.json not found"
        return 1
    fi
    
    # Process each work item type
    for item_type in "epics" "features" "userStories" "tasks"; do
        print_warning "Processing $item_type..."
        
        # Create directory if it doesn't exist
        local dir_name="$item_type"
        if [[ "$item_type" == "userStories" ]]; then
            dir_name="user-stories"
        fi
        mkdir -p "$WORK_ITEMS_DIR/$dir_name"
        
        # Extract items and create individual files
        local items=$(jq -r ".$item_type | length" "$backlog_file")
        for ((i=0; i<items; i++)); do
            local item=$(jq ".$item_type[$i]" "$backlog_file")
            local id=$(echo "$item" | jq -r '.id')
            local output_file="$WORK_ITEMS_DIR/$dir_name/$id.json"
            echo "$item" | jq '.' > "$output_file"
            print_success "Created $output_file"
        done
    done
    
    # Backup original backlog.json
    mv "$backlog_file" "$backlog_file.backup"
    print_warning "Original backlog.json backed up as backlog.json.backup"
}

# Validate work item relationships
validate_relationships() {
    print_header "Validating Work Item Relationships"
    
    local errors=0
    
    # Check that all parent references exist
    for json_file in $(find "$WORK_ITEMS_DIR" -name "*.json" -not -path "*/index.json" 2>/dev/null); do
        local relations=$(jq -r '.relations[]? | select(.rel == "System.LinkTypes.Hierarchy-Reverse") | .targetId' "$json_file" 2>/dev/null)
        if [[ -n "$relations" ]]; then
            for parent_id in $relations; do
                local parent_found=false
                for parent_file in $(find "$WORK_ITEMS_DIR" -name "*.json" -not -path "*/index.json" 2>/dev/null); do
                    local id=$(jq -r '.id' "$parent_file" 2>/dev/null)
                    if [[ "$id" == "$parent_id" ]]; then
                        parent_found=true
                        break
                    fi
                done
                if [[ "$parent_found" == "false" ]]; then
                    print_error "Orphaned work item: $(basename "$json_file") references missing parent $parent_id"
                    ((errors++))
                fi
            done
        fi
    done
    
    if [[ $errors -eq 0 ]]; then
        print_success "All work item relationships are valid"
    else
        print_error "Found $errors relationship errors"
    fi
    
    return $errors
}

# Show usage
show_usage() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  split      - Split monolithic backlog.json into individual files"
    echo "  index      - Generate lightweight index from individual files"
    echo "  validate   - Validate work item relationships"
    echo "  status     - Show work items status"
    echo ""
    echo "This script demonstrates scalable work item data architecture."
}

# Show status
show_status() {
    print_header "Work Items Status"
    
    if [[ -f "$WORK_ITEMS_DIR/index.json" ]]; then
        echo "Summary from index:"
        jq -r '.summary | to_entries[] | "  \(.key): \(.value)"' "$WORK_ITEMS_DIR/index.json"
        echo ""
        echo "Active Items:"
        jq -r '.activeItems[]? | "  \(.id): \(.title)"' "$WORK_ITEMS_DIR/index.json"
    else
        print_warning "No index found. Run 'index' command to generate."
    fi
}

# Main command handling
case "${1:-status}" in
    "split")
        split_backlog
        ;;
    "index")
        generate_index
        ;;
    "validate")
        validate_relationships
        ;;
    "status")
        show_status
        ;;
    *)
        show_usage
        ;;
esac
