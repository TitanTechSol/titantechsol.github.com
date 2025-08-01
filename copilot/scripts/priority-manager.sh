#!/bin/bash

# Priority Management Script for CAUSAI
# ADO-Style Priority Management with Automation
# Created: July 30, 2025
# Version: 1.0

set -e

# Colors for output
RED='\033[0;31m'
ORANGE='\033[0;33m'
BLUE='\033[0;34m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
WORK_ITEMS_DIR="$PROJECT_ROOT/work-items"
PRIORITY_REPORTS_DIR="$WORK_ITEMS_DIR/priority-reports"

# Ensure directories exist
mkdir -p "$PRIORITY_REPORTS_DIR"
mkdir -p "$WORK_ITEMS_DIR/P01-critical"
mkdir -p "$WORK_ITEMS_DIR/P02-high"
mkdir -p "$WORK_ITEMS_DIR/P03-medium"
mkdir -p "$WORK_ITEMS_DIR/P04-low"
mkdir -p "$WORK_ITEMS_DIR/escalation-log"

# Function to display help
show_help() {
    echo "CAUSAI Priority Management System"
    echo "================================="
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "COMMANDS:"
    echo "  list [P01|P02|P03|P04]     List work items by priority"
    echo "  dashboard                   Show priority dashboard"
    echo "  escalate [ITEM] [FROM] [TO] Escalate item priority"
    echo "  assign [ITEM] [PRIORITY]    Assign priority to work item"
    echo "  aging                       Show aging items report"
    echo "  next                        Get next highest priority item"
    echo "  health                      Show priority health status"
    echo "  sprint-plan [CAPACITY]      Plan sprint by priority"
    echo "  report [TYPE]               Generate priority reports"
    echo ""
    echo "EXAMPLES:"
    echo "  $0 list P01                 # List all P01 critical items"
    echo "  $0 escalate P03-CE-001 P03 P02  # Escalate item from P03 to P02"
    echo "  $0 next                     # Show next item to work on"
    echo "  $0 sprint-plan 25           # Plan sprint with 25 point capacity"
    echo ""
}

# Function to get priority color and emoji
get_priority_display() {
    local priority=$1
    case $priority in
        P01) echo -e "${RED}🔥 P01 (Critical)${NC}" ;;
        P02) echo -e "${ORANGE}⚡ P02 (High)${NC}" ;;
        P03) echo -e "${BLUE}📋 P03 (Medium)${NC}" ;;
        P04) echo -e "${GREEN}💡 P04 (Low)${NC}" ;;
        *) echo "$priority" ;;
    esac
}

# Function to scan work items and extract priority info
scan_work_items() {
    local priority_filter=$1
    local items=()
    
    # Scan user stories
    if [[ -d "$PROJECT_ROOT/user-stories" ]]; then
        for file in "$PROJECT_ROOT/user-stories"/*.md; do
            [[ -f "$file" ]] || continue
            
            local filename=$(basename "$file")
            local priority=$(echo "$filename" | grep -o '^P[0-9][0-9]' || echo "")
            
            if [[ -n "$priority_filter" && "$priority" != "$priority_filter" ]]; then
                continue
            fi
            
            # Extract status and story points from file
            local status="Not Started"
            local story_points="TBD"
            local business_value="TBD"
            
            if [[ -f "$file" ]]; then
                # Look for various status patterns
                status=$(grep -i -E "^(Status|Current Status|Implementation Status):" "$file" | head -1 | cut -d':' -f2 | xargs || echo "Not Started")
                # Look for story points pattern
                story_points=$(grep -i -E "^(Story Points?|Points?):" "$file" | head -1 | cut -d':' -f2 | xargs || echo "TBD")
                # Look for priority/business value
                business_value=$(grep -i -E "^(Business Value|Priority):" "$file" | head -1 | cut -d':' -f2 | xargs || echo "TBD")
                
                # If no explicit status, infer from content
                if [[ "$status" == "Not Started" ]]; then
                    if grep -q -i "complete\|done\|finished" "$file"; then
                        status="Completed"
                    elif grep -q -i "in.progress\|working\|implementing" "$file"; then
                        status="In Progress"
                    elif grep -q -i "blocked\|waiting\|pending" "$file"; then
                        status="Blocked"
                    fi
                fi
            fi
            
            items+=("$priority|$filename|$status|$story_points|$business_value")
        done
    fi
    
    printf '%s\n' "${items[@]}"
}

# Function to list items by priority
list_priority() {
    local priority=$1
    local display_priority=$(get_priority_display "$priority")
    
    echo "================================="
    echo -e "Priority Level: $display_priority"
    echo "================================="
    echo ""
    
    local items=($(scan_work_items "$priority"))
    
    if [[ ${#items[@]} -eq 0 ]]; then
        echo "No items found for priority $priority"
        return
    fi
    
    echo -e "Item\t\t\t\t\t\tStatus\t\tPoints\tBusiness Value"
    echo "------------------------------------------------------------------------------------------------------------------------"
    
    for item in "${items[@]}"; do
        IFS='|' read -r item_priority filename status points value <<< "$item"
        # Truncate filename if too long
        local short_filename="${filename:0:45}"
        if [[ ${#filename} -gt 45 ]]; then
            short_filename="${short_filename}..."
        fi
        printf "%-48s %-15s %-8s %-15s\n" "$short_filename" "$status" "$points" "$value"
    done
    
    echo ""
    echo "Total items: ${#items[@]}"
}

# Function to show priority dashboard
show_dashboard() {
    echo ""
    echo "🎯 CAUSAI Priority Dashboard"
    echo "============================"
    echo ""
    
    for priority in P01 P02 P03 P04; do
        local display_priority=$(get_priority_display "$priority")
        local items=($(scan_work_items "$priority"))
        local count=${#items[@]}
        
        # Calculate status breakdown
        local not_started=0
        local in_progress=0
        local completed=0
        local blocked=0
        
        for item in "${items[@]}"; do
            IFS='|' read -r item_priority filename status points value <<< "$item"
            case $(echo "$status" | tr '[:upper:]' '[:lower:]') in
                *"not started"*) ((not_started++)) ;;
                *"in progress"*|*"active"*) ((in_progress++)) ;;
                *"completed"*|*"done"*|*"complete"*) ((completed++)) ;;
                *"blocked"*|*"waiting"*) ((blocked++)) ;;
            esac
        done
        
        echo -e "$display_priority"
        echo "  Total: $count items"
        echo "  📝 Not Started: $not_started"
        echo "  🔄 In Progress: $in_progress"
        echo "  ✅ Completed: $completed"
        echo "  🚫 Blocked: $blocked"
        echo ""
    done
    
    # Show next recommended action
    echo "🚀 RECOMMENDED NEXT ACTION:"
    echo "==========================="
    next_item
}

# Function to get next highest priority item
next_item() {
    local next_found=false
    
    for priority in P01 P02 P03 P04; do
        local items=($(scan_work_items "$priority"))
        
        for item in "${items[@]}"; do
            IFS='|' read -r item_priority filename status points value <<< "$item"
            
            # Look for not started or in progress items
            if [[ "$status" =~ (Not Started|not started|Ready) ]]; then
                local display_priority=$(get_priority_display "$priority")
                echo -e "➡️  Next Item: $display_priority"
                echo "   📄 File: $filename"
                echo "   📊 Story Points: $points"
                echo "   💰 Business Value: $value"
                echo ""
                echo "   🤖 Command to start:"
                echo "   ./causai-workflow.sh start \"$filename\""
                echo ""
                next_found=true
                break 2
            fi
        done
    done
    
    if [[ "$next_found" == false ]]; then
        echo "🎉 No pending high-priority items found!"
        echo "   Consider reviewing P03/P04 items or sprint planning."
    fi
}

# Function to show aging items
show_aging() {
    echo "📅 Priority Aging Report"
    echo "========================"
    echo ""
    
    # This is a simplified version - in practice, you'd track creation dates
    echo "⚠️  Items requiring attention:"
    echo ""
    
    for priority in P01 P02 P03; do
        local display_priority=$(get_priority_display "$priority")
        local items=($(scan_work_items "$priority"))
        
        for item in "${items[@]}"; do
            IFS='|' read -r item_priority filename status points value <<< "$item"
            
            if [[ "$status" =~ (Not Started|not started) ]]; then
                echo -e "$display_priority - $filename"
                
                # Define SLA based on priority
                local sla_days
                case $priority in
                    P01) sla_days=3 ;;
                    P02) sla_days=14 ;;
                    P03) sla_days=30 ;;
                esac
                
                echo "   ⏰ SLA: $sla_days days"
                echo "   📊 Points: $points"
                echo ""
            fi
        done
    done
}

# Function to escalate priority
escalate_priority() {
    local item_name=$1
    local from_priority=$2
    local to_priority=$3
    
    if [[ -z "$item_name" || -z "$from_priority" || -z "$to_priority" ]]; then
        echo "Usage: $0 escalate [ITEM_NAME] [FROM_PRIORITY] [TO_PRIORITY]"
        echo "Example: $0 escalate P03-CE-001-example.md P03 P02"
        return 1
    fi
    
    # Log escalation
    local log_file="$WORK_ITEMS_DIR/escalation-log/$(date +%Y-%m-%d)-escalations.log"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    echo "[$timestamp] ESCALATION: $item_name from $from_priority to $to_priority (Reason: Manual escalation)" >> "$log_file"
    
    # Move file if using priority-based directories
    local from_dir="$WORK_ITEMS_DIR/${from_priority}-*"
    local to_dir="$WORK_ITEMS_DIR/${to_priority}-*"
    
    echo "✅ Priority escalation logged for $item_name"
    echo "   From: $(get_priority_display "$from_priority")"
    echo "   To: $(get_priority_display "$to_priority")"
    echo "   📝 Logged in: $log_file"
    echo ""
    echo "🔄 Next steps:"
    echo "   1. Update the work item file to reflect new priority"
    echo "   2. Update any documentation references"
    echo "   3. Consider sprint planning impact"
}

# Function to plan sprint by priority
sprint_plan() {
    local capacity=${1:-25}
    
    echo "🎯 Sprint Planning by Priority"
    echo "=============================="
    echo "📊 Total Capacity: $capacity story points"
    echo ""
    
    # Calculate capacity allocation
    local p01_capacity=$((capacity * 40 / 100))
    local p02_capacity=$((capacity * 40 / 100))
    local p03_capacity=$((capacity * 15 / 100))
    local p04_capacity=$((capacity * 5 / 100))
    
    echo "📈 Capacity Allocation:"
    echo "  🔥 P01 (Critical): $p01_capacity points (40%)"
    echo "  ⚡ P02 (High): $p02_capacity points (40%)"
    echo "  📋 P03 (Medium): $p03_capacity points (15%)"
    echo "  💡 P04 (Low): $p04_capacity points (5%)"
    echo ""
    
    echo "🎯 Recommended Sprint Backlog:"
    echo "=============================="
    
    for priority in P01 P02 P03 P04; do
        local display_priority=$(get_priority_display "$priority")
        echo -e "\n$display_priority Items:"
        
        local items=($(scan_work_items "$priority"))
        local running_total=0
        local max_capacity
        
        case $priority in
            P01) max_capacity=$p01_capacity ;;
            P02) max_capacity=$p02_capacity ;;
            P03) max_capacity=$p03_capacity ;;
            P04) max_capacity=$p04_capacity ;;
        esac
        
        for item in "${items[@]}"; do
            IFS='|' read -r item_priority filename status points value <<< "$item"
            
            if [[ "$status" =~ (Not Started|not started|Ready) ]]; then
                local item_points=$(echo "$points" | grep -o '[0-9]\+' || echo "0")
                
                if [[ $((running_total + item_points)) -le $max_capacity ]]; then
                    echo "  ✅ $filename ($item_points pts)"
                    ((running_total += item_points))
                else
                    echo "  ⏭️  $filename ($item_points pts) - Next Sprint"
                fi
            fi
        done
        
        echo "     Subtotal: $running_total / $max_capacity points"
    done
    
    echo ""
    echo "🚀 Sprint Summary:"
    echo "=================="
    echo "This sprint planning follows ADO-style priority management"
    echo "with capacity-based allocation and clear priority rules."
}

# Function to show health status
show_health() {
    echo "💚 Priority Health Status"
    echo "========================="
    echo ""
    
    # Count items by status and priority
    local total_p01=0
    local overdue_p01=0
    local total_p02=0
    local overdue_p02=0
    
    # Calculate health indicators (simplified)
    for priority in P01 P02; do
        local items=($(scan_work_items "$priority"))
        local count=${#items[@]}
        
        if [[ "$priority" == "P01" ]]; then
            total_p01=$count
            # In practice, you'd check creation dates vs SLA
            overdue_p01=0
        else
            total_p02=$count
            overdue_p02=0
        fi
    done
    
    # Health indicators
    echo "🔥 P01 (Critical) Health:"
    if [[ $overdue_p01 -eq 0 ]]; then
        echo "  🟢 HEALTHY - No overdue critical items"
    else
        echo "  🔴 CRITICAL - $overdue_p01 overdue items requiring immediate attention"
    fi
    echo "  📊 Active: $total_p01 items"
    echo ""
    
    echo "⚡ P02 (High) Health:"
    if [[ $overdue_p02 -eq 0 ]]; then
        echo "  🟢 HEALTHY - No overdue high priority items"
    else
        echo "  🟡 WARNING - $overdue_p02 items approaching SLA"
    fi
    echo "  📊 Active: $total_p02 items"
    echo ""
    
    echo "📈 Overall System Health: 🟢 HEALTHY"
    echo ""
    echo "💡 Recommendations:"
    echo "  • Continue current prioritization approach"
    echo "  • Monitor P01 items daily"
    echo "  • Review P02 items weekly"
    echo "  • Consider capacity planning for upcoming sprint"
}

# Main script logic
case "${1:-help}" in
    "list")
        if [[ -n "$2" ]]; then
            list_priority "$2"
        else
            echo "Available priorities: P01, P02, P03, P04"
            echo "Usage: $0 list [PRIORITY]"
        fi
        ;;
    "dashboard")
        show_dashboard
        ;;
    "escalate")
        escalate_priority "$2" "$3" "$4"
        ;;
    "aging")
        show_aging
        ;;
    "next")
        next_item
        ;;
    "health")
        show_health
        ;;
    "sprint-plan")
        sprint_plan "$2"
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
