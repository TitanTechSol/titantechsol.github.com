#!/bin/bash

# CAUSAI Work Item Discussion Manager
# Manages discussion files and change history for work items

DISCUSSION_DIR="c:/source/github/TitanTechSol/titantechsol.github.com/copilot/work-items/discussions"
TEMPLATE_FILE="c:/source/github/TitanTechSol/titantechsol.github.com/copilot/work-items/templates/work-item-discussion-template.md"

# Function to create new discussion file
create_discussion() {
    local work_item_id=$1
    local title=$2
    local author=${3:-"CAUSAI"}
    
    if [ -z "$work_item_id" ] || [ -z "$title" ]; then
        echo "❌ Usage: create_discussion <work_item_id> <title> [author]"
        return 1
    fi
    
    local discussion_file="${DISCUSSION_DIR}/${work_item_id}-discussion.md"
    local today=$(date +%Y-%m-%d)
    
    if [ -f "$discussion_file" ]; then
        echo "⚠️  Discussion file already exists: $discussion_file"
        return 1
    fi
    
    # Create discussion file from template
    cp "$TEMPLATE_FILE" "$discussion_file"
    
    # Replace template placeholders
    sed -i "s/\[Work Item ID\]/$work_item_id/g" "$discussion_file"
    sed -i "s/\[Work Item Title\]/$title/g" "$discussion_file"
    sed -i "s/\[Date\]/$today/g" "$discussion_file"
    sed -i "s/\[Author\]/$author/g" "$discussion_file"
    
    echo "✅ Created discussion file: $discussion_file"
}

# Function to add comment to existing discussion
add_comment() {
    local work_item_id=$1
    local author=$2
    local comment_type=$3
    local status=$4
    local comment_text=$5
    
    if [ -z "$work_item_id" ] || [ -z "$author" ] || [ -z "$comment_text" ]; then
        echo "❌ Usage: add_comment <work_item_id> <author> <comment_type> <status> <comment_text>"
        return 1
    fi
    
    local discussion_file="${DISCUSSION_DIR}/${work_item_id}-discussion.md"
    local today=$(date +%Y-%m-%d)
    
    if [ ! -f "$discussion_file" ]; then
        echo "❌ Discussion file not found: $discussion_file"
        return 1
    fi
    
    # Find the line with "## 💬 Discussion & Comments" and add after it
    local comment_entry="### $today - $author - $comment_type\n**Status**: $status\n**Comment**: $comment_text\n"
    
    # Insert comment after the Discussion header (line after "## 💬 Discussion & Comments")
    awk -v comment="$comment_entry" '
        /^## 💬 Discussion & Comments/ { 
            print $0; 
            print ""; 
            print comment; 
            next 
        } 
        { print }
    ' "$discussion_file" > "${discussion_file}.tmp" && mv "${discussion_file}.tmp" "$discussion_file"
    
    echo "✅ Added comment to $work_item_id discussion"
}

# Function to log status change
log_status_change() {
    local work_item_id=$1
    local author=$2
    local from_status=$3
    local to_status=$4
    local notes=${5:-"Status updated"}
    
    local discussion_file="${DISCUSSION_DIR}/${work_item_id}-discussion.md"
    local today=$(date +%Y-%m-%d)
    
    if [ ! -f "$discussion_file" ]; then
        echo "❌ Discussion file not found: $discussion_file"
        return 1
    fi
    
    # Add to change history table
    local change_entry="| $today | $author | Status | $from_status | $to_status | $notes |"
    
    # Find the change history table and add entry
    awk -v entry="$change_entry" '
        /^\| Date \| Author \| Field Changed \| Old Value \| New Value \| Reason \|/ { 
            print $0; 
            getline; print $0;  # Print the separator line
            print entry;
            next 
        }
        { print }
    ' "$discussion_file" > "${discussion_file}.tmp" && mv "${discussion_file}.tmp" "$discussion_file"
    
    # Also add to status transitions
    local transition_entry="| $today | $author | $from_status | $to_status | 0 days | $notes |"
    
    awk -v entry="$transition_entry" '
        /^\| Date \| Author \| From \| To \| Duration \| Notes \|/ { 
            print $0; 
            getline; print $0;  # Print the separator line
            print entry;
            next 
        }
        { print }
    ' "$discussion_file" > "${discussion_file}.tmp" && mv "${discussion_file}.tmp" "$discussion_file"
    
    echo "✅ Logged status change for $work_item_id: $from_status → $to_status"
}

# Function to list all discussions
list_discussions() {
    echo "📋 Available Work Item Discussions:"
    echo ""
    
    if [ ! -d "$DISCUSSION_DIR" ]; then
        echo "❌ Discussion directory not found: $DISCUSSION_DIR"
        return 1
    fi
    
    for file in "$DISCUSSION_DIR"/*-discussion.md; do
        if [ -f "$file" ]; then
            local basename=$(basename "$file" -discussion.md)
            local title=$(grep "^\*\*Title\*\*:" "$file" | sed 's/\*\*Title\*\*: //')
            local last_updated=$(grep "^\*\*Last Updated\*\*:" "$file" | sed 's/\*\*Last Updated\*\*: //')
            echo "  • $basename - $title (Updated: $last_updated)"
        fi
    done
}

# Function to show discussion summary
show_discussion() {
    local work_item_id=$1
    local discussion_file="${DISCUSSION_DIR}/${work_item_id}-discussion.md"
    
    if [ ! -f "$discussion_file" ]; then
        echo "❌ Discussion file not found: $discussion_file"
        return 1
    fi
    
    echo "📖 Discussion Summary for $work_item_id:"
    echo ""
    
    # Show header info
    head -5 "$discussion_file"
    echo ""
    
    # Show recent comments (last 3)
    echo "📝 Recent Comments:"
    awk '/^## 💬 Discussion & Comments/,/^## 📊 Change History/' "$discussion_file" | head -15
}

# Main command dispatcher
case "${1:-help}" in
    "create")
        create_discussion "$2" "$3" "$4"
        ;;
    "comment")
        add_comment "$2" "$3" "$4" "$5" "$6"
        ;;
    "status")
        log_status_change "$2" "$3" "$4" "$5" "$6"
        ;;
    "list")
        list_discussions
        ;;
    "show")
        show_discussion "$2"
        ;;
    "help"|"")
        echo "🛠️  CAUSAI Work Item Discussion Manager"
        echo "====================================="
        echo ""
        echo "Commands:"
        echo "  create <work_item_id> <title> [author]     - Create new discussion file"
        echo "  comment <work_item_id> <author> <type> <status> <comment> - Add comment"
        echo "  status <work_item_id> <author> <from> <to> [notes] - Log status change"
        echo "  list                                       - List all discussions"
        echo "  show <work_item_id>                        - Show discussion summary"
        echo ""
        echo "Examples:"
        echo "  ./discussion-manager.sh create P01-CE-00001.04 \"Portfolio Case Studies\" CAUSAI"
        echo "  ./discussion-manager.sh comment P01-CE-00001.04 Aiden Decision \"Ready\" \"Approved to proceed\""
        echo "  ./discussion-manager.sh status P01-CE-00001.04 CAUSAI \"New\" \"In Progress\""
        echo "  ./discussion-manager.sh list"
        echo "  ./discussion-manager.sh show P01-CE-00001.04"
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo "Use './discussion-manager.sh help' for available commands"
        ;;
esac
