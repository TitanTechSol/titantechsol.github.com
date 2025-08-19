#!/bin/bash

# =============================================================================
# CAUSAI INTELLIGENT WORKSPACE CLEANUP SCRIPT
# =============================================================================
# Purpose: Dynamically find and remove redundant/duplicate content
# Author: CAUSAI (Complete Automated User Story AI)
# Created: August 19, 2025
# Usage: ./cleanup-workspace.sh [--dry-run] [--force]
# =============================================================================

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
COPILOT_DIR="$PROJECT_ROOT/copilot"

# Flags
DRY_RUN=false
FORCE=false

# Arrays to store found items
declare -a DUPLICATES=()
declare -a EMPTY_FILES=()
declare -a DOCKER_FILES=()
declare -a LEGACY_FILES=()
declare -a LOW_PRIORITY_STORIES=()
declare -a REDUNDANT_DIRS=()

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --force)
            FORCE=true
            shift
            ;;
        -h|--help)
            echo "CAUSAI Intelligent Workspace Cleanup"
            echo "Usage: $0 [--dry-run] [--force]"
            echo ""
            echo "This script dynamically finds and removes:"
            echo "  - Duplicate files (identical content)"
            echo "  - Empty files (0 bytes)"  
            echo "  - Docker artifacts"
            echo "  - Legacy context files"
            echo "  - Low-priority user stories (P03+)"
            echo "  - Redundant directories"
            echo ""
            echo "Options:"
            echo "  --dry-run    Show what would be deleted without actually deleting"
            echo "  --force      Skip confirmation prompt"
            echo "  --help       Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Function to log actions
log_action() {
    local level=$1
    local message=$2
    case $level in
        "INFO")
            echo -e "${BLUE}[INFO]${NC} $message"
            ;;
        "SUCCESS")
            echo -e "${GREEN}[SUCCESS]${NC} $message"
            ;;
        "WARNING")
            echo -e "${YELLOW}[WARNING]${NC} $message"
            ;;
        "ERROR")
            echo -e "${RED}[ERROR]${NC} $message"
            ;;
        "FOUND")
            echo -e "${YELLOW}[FOUND]${NC} $message"
            ;;
    esac
}

# Function to find duplicate files by content
find_duplicates() {
    log_action "INFO" "Scanning for duplicate files..."
    
    cd "$COPILOT_DIR"
    
    # Find files with identical content using MD5
    local temp_file="/tmp/duplicates_$$"
    find . -type f -name "*.md" -exec md5sum {} \; 2>/dev/null | sort > "$temp_file"
    
    # Find duplicate checksums
    local duplicate_checksums=$(awk '{print $1}' "$temp_file" | uniq -d)
    
    for checksum in $duplicate_checksums; do
        local duplicate_files=$(grep "^$checksum" "$temp_file" | awk '{print $2}')
        local file_array=($duplicate_files)
        
        # Keep the first file, mark others as duplicates
        for (( i=1; i<${#file_array[@]}; i++ )); do
            DUPLICATES+=("${file_array[i]}")
            log_action "FOUND" "Duplicate: ${file_array[i]} (same content as ${file_array[0]})"
        done
    done
    
    rm -f "$temp_file"
}

# Function to find empty files
find_empty_files() {
    log_action "INFO" "Scanning for empty files..."
    
    cd "$COPILOT_DIR"
    while IFS= read -r -d '' file; do
        EMPTY_FILES+=("$file")
        log_action "FOUND" "Empty file: $file"
    done < <(find . -type f -size 0 -print0 2>/dev/null)
}

# Function to find Docker files
find_docker_files() {
    log_action "INFO" "Scanning for Docker artifacts..."
    
    cd "$PROJECT_ROOT"
    local docker_patterns=("Dockerfile" "docker-compose.yml" ".dockerignore" "package-scripts.json")
    
    for pattern in "${docker_patterns[@]}"; do
        if [ -f "$pattern" ]; then
            DOCKER_FILES+=("$pattern")
            log_action "FOUND" "Docker file: $pattern"
        fi
    done
}

# Function to find legacy context files
find_legacy_files() {
    log_action "INFO" "Scanning for legacy context files..."
    
    cd "$COPILOT_DIR"
    local legacy_patterns=("Agentic_Context.md" "Prompt.md" "*-modernization-analysis.md" "*DRY-RUN*.md" "*AUTOMATION_SUITE*.md")
    
    for pattern in "${legacy_patterns[@]}"; do
        for file in $pattern; do
            if [ -f "$file" ] && [ "$file" != "CAUSAI-IDENTITY.md" ]; then
                LEGACY_FILES+=("$file")
                log_action "FOUND" "Legacy file: $file"
            fi
        done
    done
}

# Function to find low-priority user stories  
find_low_priority_stories() {
    log_action "INFO" "Scanning for low-priority user stories (P03+)..."
    
    cd "$COPILOT_DIR"
    if [ -d "user-stories" ]; then
        for story in user-stories/P0[3-9]-*.md user-stories/P[1-9][0-9]-*.md; do
            if [ -f "$story" ]; then
                LOW_PRIORITY_STORIES+=("$story")
                log_action "FOUND" "Low-priority story: $story"
            fi
        done
    fi
}

# Function to find redundant directories
find_redundant_dirs() {
    log_action "INFO" "Scanning for redundant directories..."
    
    cd "$COPILOT_DIR"
    
    # Check for common redundant patterns
    local redundant_patterns=("issues" "workflows" "docs/best-practices" "archive/documents")
    
    for dir in "${redundant_patterns[@]}"; do
        if [ -d "$dir" ]; then
            REDUNDANT_DIRS+=("$dir")
            log_action "FOUND" "Redundant directory: $dir"
        fi
    done
    
    # Check for duplicate directory trees (e.g., crew vs archive/legacy/crew)
    if [ -d "crew" ] && [ -d "archive/legacy/crew" ]; then
        if diff -r crew archive/legacy/crew >/dev/null 2>&1; then
            REDUNDANT_DIRS+=("crew")
            log_action "FOUND" "Duplicate directory: crew (identical to archive/legacy/crew)"
        fi
    fi
}

# Function to show what was found
show_findings() {
    echo ""
    echo "==================================="  
    echo "CLEANUP ANALYSIS RESULTS"
    echo "==================================="
    echo ""
    
    local total_items=0
    
    if [ ${#DUPLICATES[@]} -gt 0 ]; then
        echo "DUPLICATE FILES (${#DUPLICATES[@]}):"
        for item in "${DUPLICATES[@]}"; do
            echo "  - $item"
        done
        echo ""
        total_items=$((total_items + ${#DUPLICATES[@]}))
    fi
    
    if [ ${#EMPTY_FILES[@]} -gt 0 ]; then
        echo "EMPTY FILES (${#EMPTY_FILES[@]}):"
        for item in "${EMPTY_FILES[@]}"; do
            echo "  - $item"
        done
        echo ""
        total_items=$((total_items + ${#EMPTY_FILES[@]}))
    fi
    
    if [ ${#DOCKER_FILES[@]} -gt 0 ]; then
        echo "DOCKER FILES (${#DOCKER_FILES[@]}):"
        for item in "${DOCKER_FILES[@]}"; do
            echo "  - $item"
        done
        echo ""
        total_items=$((total_items + ${#DOCKER_FILES[@]}))
    fi
    
    if [ ${#LEGACY_FILES[@]} -gt 0 ]; then
        echo "LEGACY CONTEXT FILES (${#LEGACY_FILES[@]}):"
        for item in "${LEGACY_FILES[@]}"; do
            echo "  - $item"
        done
        echo ""
        total_items=$((total_items + ${#LEGACY_FILES[@]}))
    fi
    
    if [ ${#LOW_PRIORITY_STORIES[@]} -gt 0 ]; then
        echo "LOW-PRIORITY STORIES (${#LOW_PRIORITY_STORIES[@]}) -> archive/future-features/:"
        for item in "${LOW_PRIORITY_STORIES[@]}"; do
            echo "  - $item"
        done
        echo ""
        total_items=$((total_items + ${#LOW_PRIORITY_STORIES[@]}))
    fi
    
    if [ ${#REDUNDANT_DIRS[@]} -gt 0 ]; then
        echo "REDUNDANT DIRECTORIES (${#REDUNDANT_DIRS[@]}):"
        for item in "${REDUNDANT_DIRS[@]}"; do
            echo "  - $item"
        done
        echo ""
        total_items=$((total_items + ${#REDUNDANT_DIRS[@]}))
    fi
    
    if [ $total_items -eq 0 ]; then
        echo "No redundant or duplicate content found!"
        echo "Your workspace is already clean and optimized."
        return 1
    fi
    
    echo "TOTAL ITEMS TO CLEAN: $total_items"
    echo ""
    return 0
}

# Function to safely remove an item
safe_remove() {
    local path="$1"
    local description="$2"
    
    if [ ! -e "$path" ]; then
        log_action "WARNING" "Path does not exist: $path"
        return 0
    fi
    
    if [ "$DRY_RUN" = true ]; then
        log_action "INFO" "[DRY-RUN] Would remove: $path ($description)"
        return 0
    fi
    
    if [ -d "$path" ]; then
        rm -rf "$path"
        log_action "SUCCESS" "Removed directory: $path"
    elif [ -f "$path" ]; then
        rm -f "$path"
        log_action "SUCCESS" "Removed file: $path"
    fi
}

# Function to safely move an item
safe_move() {
    local source="$1"
    local dest="$2"
    local description="$3"
    
    if [ ! -e "$source" ]; then
        log_action "WARNING" "Source does not exist: $source"
        return 0
    fi
    
    if [ "$DRY_RUN" = true ]; then
        log_action "INFO" "[DRY-RUN] Would move: $source -> $dest ($description)"
        return 0
    fi
    
    # Create destination directory if it doesn't exist
    mkdir -p "$(dirname "$dest")"
    mv "$source" "$dest"
    log_action "SUCCESS" "Moved: $source -> $dest"
}

# Main cleanup function
perform_cleanup() {
    log_action "INFO" "Starting intelligent cleanup..."
    
    # Create archive directory if needed and we have low-priority stories
    if [ ${#LOW_PRIORITY_STORIES[@]} -gt 0 ]; then
        if [ "$DRY_RUN" = false ]; then
            mkdir -p "$COPILOT_DIR/archive/future-features"
        fi
    fi
    
    # Process duplicates
    cd "$COPILOT_DIR"
    for item in "${DUPLICATES[@]}"; do
        safe_remove "$item" "Duplicate file"
    done
    
    # Process empty files
    for item in "${EMPTY_FILES[@]}"; do
        safe_remove "$item" "Empty file"
    done
    
    # Process Docker files
    cd "$PROJECT_ROOT"
    for item in "${DOCKER_FILES[@]}"; do
        safe_remove "$item" "Docker artifact"
    done
    
    # Process legacy files
    cd "$COPILOT_DIR"
    for item in "${LEGACY_FILES[@]}"; do
        safe_remove "$item" "Legacy context file"
    done
    
    # Process low-priority stories
    for item in "${LOW_PRIORITY_STORIES[@]}"; do
        local dest="archive/future-features/$(basename "$item")"
        safe_move "$item" "$dest" "Low-priority story"
    done
    
    # Process redundant directories
    for item in "${REDUNDANT_DIRS[@]}"; do
        safe_remove "$item" "Redundant directory"
    done
    
    log_action "SUCCESS" "Intelligent cleanup completed!"
}

# Function to show results
show_results() {
    echo ""
    echo "==================================="
    echo "CLEANUP RESULTS"
    echo "==================================="
    echo ""
    
    cd "$COPILOT_DIR"
    local final_files=$(find . -type f -name "*.md" 2>/dev/null | wc -l)
    local final_dirs=$(find . -type d 2>/dev/null | wc -l)
    
    echo "Final workspace: $final_files markdown files in $final_dirs directories"
    echo ""
    echo "OPTIMIZED STRUCTURE:"
    echo "copilot/"
    echo "├── CAUSAI-IDENTITY.md           # Core AI rules"
    echo "├── active-backlog.md           # Current priorities"  
    echo "├── README.md                   # Framework overview"
    echo "├── user-stories/               # P01-P02 stories only"
    echo "├── completed/summaries/        # Completion docs"
    echo "├── docs/deployment/            # Deployment guides"
    echo "├── docs/planning/              # Project analysis"
    echo "├── behaviors/                  # Development behaviors"
    echo "├── work-items/                 # ADO-compatible tracking"
    echo "├── scripts/                    # Active automation"
    echo "└── archive/                    # Historical content only"
    echo ""
    echo "Workspace is now 100% focused on active development!"
}

# Main execution
main() {
    echo ""
    echo "CAUSAI INTELLIGENT CLEANUP TOOL"
    echo "===================================="
    echo ""
    
    # Verify we're in the right location
    if [ ! -d "$COPILOT_DIR" ]; then
        log_action "ERROR" "Copilot directory not found: $COPILOT_DIR"
        log_action "ERROR" "Please run this script from the TitanTech project root or scripts directory"
        exit 1
    fi
    
    # Perform intelligent analysis
    log_action "INFO" "Analyzing workspace for redundancy and duplicates..."
    echo ""
    
    find_duplicates
    find_empty_files
    find_docker_files  
    find_legacy_files
    find_low_priority_stories
    find_redundant_dirs
    
    # Show findings
    if ! show_findings; then
        exit 0  # Nothing to clean
    fi
    
    # Confirmation (unless --force is used)
    if [ "$FORCE" = false ] && [ "$DRY_RUN" = false ]; then
        echo ""
        echo -e "${YELLOW}WARNING: This will permanently delete/move the items listed above!${NC}"
        echo ""
        read -p "Continue with cleanup? [y/N]: " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_action "INFO" "Cleanup cancelled by user"
            exit 0
        fi
        echo ""
    fi
    
    # Perform the cleanup
    perform_cleanup
    
    # Show results (unless it's a dry run)
    if [ "$DRY_RUN" = false ]; then
        show_results
    else
        echo ""
        log_action "INFO" "Dry run completed. Use without --dry-run to perform actual cleanup."
        echo ""
        log_action "INFO" "This script dynamically finds duplicates, so it will work every time!"
    fi
}

# Run main function
main "$@"
