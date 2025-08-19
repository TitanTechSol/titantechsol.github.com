# Workspace Cleanup Script Usage

## Quick Commands

```bash
# Preview what will be cleaned (safe to run)
./copilot/scripts/cleanup-workspace.sh --dry-run

# Run cleanup with confirmation prompt  
./copilot/scripts/cleanup-workspace.sh

# Run cleanup without confirmation (auto-yes)
./copilot/scripts/cleanup-workspace.sh --force

# Show help
./copilot/scripts/cleanup-workspace.sh --help
```

## What It Does

The script performs intelligent workspace cleanup by dynamically finding redundant content:

### Intelligently Removes:
- **Duplicate files** (finds files with identical content using checksums)
- **Empty files** (0 byte files that serve no purpose)  
- **Redundant directories** (directories with identical content in multiple locations)
- **Legacy context files** (outdated prompt/context files superseded by CAUSAI-IDENTITY.md)
- **Docker artifacts** (any Docker files if they exist in project root)
- **Low-priority user stories** (P03+ stories moved to archive for future consideration)

### Preserves Important Files:
- **CAUSAI-IDENTITY.md** - Core AI operational rules
- **active-backlog.md** - Current development priorities
- **P01-P02 user stories** - High and medium priority development tasks
- **completed/ directory** - Documentation of completed work
- **docs/deployment/** - Deployment and setup guides
- **behaviors/** - AI development behavior patterns
- **work-items/** - Azure DevOps compatible tracking
- **archive/legacy/** - Important historical context

## Safety Features

### Dry-Run Mode
```bash
./copilot/scripts/cleanup-workspace.sh --dry-run
```
- Shows exactly what would be deleted/moved
- Makes NO changes to your workspace
- Safe to run anytime to see current cleanup opportunities

### Confirmation Prompts
- Script asks for confirmation before making changes
- Shows complete list of items to be affected
- Use `--force` to skip prompts for automation

### Intelligent Detection
- Uses MD5 checksums to identify duplicate content
- Pattern-based detection for legacy files
- Content comparison for redundant directories
- Priority-based user story categorization

## Output Examples

### Clean Workspace
```
CAUSAI INTELLIGENT CLEANUP TOOL
====================================

[INFO] Analyzing workspace for redundancy and duplicates...

===================================
CLEANUP ANALYSIS RESULTS
===================================

No redundant or duplicate content found!
Your workspace is already clean and optimized.
```

### Items Found for Cleanup
```
===================================
CLEANUP ANALYSIS RESULTS
===================================

DUPLICATE FILES (2):
  - ./docs/old-analysis.md
  - ./archive/duplicate-readme.md

EMPTY FILES (1):
  - ./scripts/empty-script.sh

LOW-PRIORITY STORIES (3) -> archive/future-features/:
  - user-stories/P03-future-feature.md
  - user-stories/P04-enhancement.md
  - user-stories/P05-optimization.md

TOTAL ITEMS TO CLEAN: 6

WARNING: This will permanently delete/move the items listed above!

Continue with cleanup? [y/N]:
```

## When to Use

### After Major Development Sessions
- When you've created many experimental files
- After completing user stories with generated documentation
- When workspace feels cluttered or hard to navigate

### Before Important Milestones
- Before major commits to keep history clean
- Before sharing workspace with team members
- Before archiving completed project phases

### Regular Maintenance
- Weekly workspace hygiene
- After bulk file operations
- When storage space is a concern

## Technical Details

### How Duplicate Detection Works
1. Calculates MD5 checksum for each markdown file
2. Groups files with identical checksums
3. Keeps the first occurrence, marks others for removal
4. Shows clear mapping of what's duplicate of what

### Priority-Based Story Management
- P01-P02: Kept in active user-stories/ directory
- P03+: Moved to archive/future-features/ for future consideration
- Maintains all content while organizing by current relevance

### Directory Intelligence
- Compares directory trees using diff
- Identifies directories with identical content in multiple locations
- Preserves the primary location, removes redundant copies

## Best Practices

1. **Always run --dry-run first** to see what will change
2. **Review the list carefully** before confirming cleanup
3. **Use after completing user stories** to clean up generated files
4. **Run regularly** to maintain workspace cleanliness
5. **Keep backups** of important work before major cleanups

This script ensures your workspace stays focused on active development while preserving all important content in organized locations.
