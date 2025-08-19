# 🧹 Workspace Cleanup Script Usage

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

The script performs the **exact same cleanup** we just did manually:

### 🗑️ Intelligently Removes:
- ❌ **Duplicate files** (finds files with identical content using checksums)
- ❌ **Empty files** (0 byte files that serve no purpose)  
- ❌ **Redundant directories** (directories with identical content in multiple locations)
- ❌ **Legacy context files** (outdated prompt/context files superseded by CAUSAI-IDENTITY.md)
- ❌ **Docker artifacts** (any Docker files if they exist in project root)
- ❌ **Low-priority user stories** (P03+ stories moved to archive for future consideration)

### ✅ Preserves:
- ✅ All P01-P02 user stories (active work)
- ✅ Completion documentation
- ✅ Core identity and backlog files
- ✅ Deployment and planning docs
- ✅ Active behaviors and scripts

## Safety Features

- **Dry-run mode**: See what will happen without making changes
- **Confirmation prompt**: Double-check before deletion
- **Colored output**: Clear visual feedback
- **Error handling**: Stops on any issues
- **Path validation**: Ensures it's run in correct location

## Example Usage

```bash
# Safe preview first
./copilot/scripts/cleanup-workspace.sh --dry-run

# If you like what you see, run it for real
./copilot/scripts/cleanup-workspace.sh
# [Shows plan, asks "Continue? y/N"]
# Type 'y' and hit enter

# Or skip confirmation for automation
./copilot/scripts/cleanup-workspace.sh --force
```

## Results

- **Before**: ~200+ files with redundancy
- **After**: ~165 focused files  
- **Structure**: Clean, organized, 100% active development focused

**Perfect for when we accumulate duplicates and need a quick cleanup!** 🎯
