# Work Item Scripts

This directory contains automation scripts for the ADO-compatible work item tracking system.

## Available Scripts

### `generate-work-items.sh`
Primary automation script that processes issues and generates work items.

**Features:**
- Interactive issue processing with clarifying questions
- ADO-compatible hierarchy enforcement (Epic → Feature → User Story → Task)
- Fibonacci estimation validation (1,2,3,5,8,13,21,34,55,89)
- No-orphan policy enforcement
- Dependency validation
- Backlog management
- **Dry-run mode for testing workflow**

**Usage:**
```bash
cd copilot/scripts

# Normal mode - creates work items
./generate-work-items.sh

# Dry-run mode - preview without creating
./generate-work-items.sh --dry-run

# Verbose dry-run - detailed preview
./generate-work-items.sh --dry-run --verbose
```

### `validate-backlog.sh`
Validates existing work items against ADO compliance rules.

**Features:**
- Hierarchy validation
- Orphan detection
- Estimation compliance
- **Dry-run mode for validation preview**
- State transition validation

**Usage:**
```bash
# Normal mode - validates and generates reports
./validate-backlog.sh

# Dry-run mode - preview validation results only
./validate-backlog.sh --dry-run

# Verbose dry-run - detailed validation information
./validate-backlog.sh --dry-run --verbose
```

### `migrate-to-ado.sh`
Prepares work items for Azure DevOps import.

**Features:**
- CSV export generation
- Field mapping for ADO import
- Relationship preservation
- Batch processing
- **Dry-run mode for export preview**

**Usage:**
```bash
# Normal mode - generates CSV files
./migrate-to-ado.sh

# Dry-run mode - preview export without generating files
./migrate-to-ado.sh --dry-run

# Verbose dry-run - detailed export information
./migrate-to-ado.sh --dry-run --verbose
```

## Prerequisites

- Bash shell environment (Linux, macOS, WSL, or Git Bash on Windows)
- `jq` command-line JSON processor (`sudo apt install jq` or `brew install jq`)
- Issues placed in `/copilot/issues/` directory
- Templates available in `/copilot/work-items/templates/`

## Dry-Run Workflow

All scripts support `--dry-run` mode for safe testing and SOW continuity:

```bash
# 1. Preview work item generation from issues
./generate-work-items.sh --dry-run --verbose

# 2. Preview validation results
./validate-backlog.sh --dry-run

# 3. Preview ADO export structure
./migrate-to-ado.sh --dry-run --verbose
```

**Benefits of Dry-Run Mode:**
- 🔍 **Preview Changes**: See what would be created without modifications
- ✅ **Validate Logic**: Test issue analysis and hierarchy decisions
- 🔄 **Iterative Refinement**: Adjust approach based on preview results
- 🛡️ **Risk Mitigation**: Prevent orphaned or incorrectly structured work items
- 📋 **SOW Planning**: Preview complete work breakdown before client presentation
- 🎯 **Continuous Workflow**: Maintain development flow without breaking existing backlog

## Issue Format

Issues can be in markdown or plain text format. The system will:
1. Analyze content to determine appropriate work item type
2. Ask clarifying questions about complexity and relationships
3. Generate properly structured work items following ADO patterns
4. Maintain parent-child relationships
5. Enforce business rules (no orphans, estimation requirements)

## ADO Integration

The generated work items are designed for direct import into Azure DevOps:
- Compatible field structure
- Standard ADO work item types
- Proper parent-child relationships
- ADO-compliant states and transitions
- Fibonacci estimation following ADO best practices

## SDLC/SOW Integration

Generated work items integrate with the SOW development behaviors:
- **SOW Planning Strategy**: Creates strategic Epics
- **Technical Architecture Design**: Generates Features and Stories
- **Quality Assurance Testing**: Creates testing Tasks and Bugs
- **Client Communication**: Provides stakeholder-ready work items

## Bash vs JavaScript Decision

The system uses bash scripts instead of Node.js because:
- **Direct terminal visibility**: You can see script output directly
- **Better SDLC integration**: Native shell integration for development workflows  
- **Reduced dependencies**: No Node.js installation required
- **Cross-platform compatibility**: Works on Linux, macOS, WSL, and Git Bash
- **Easier CI/CD integration**: Native shell script support in most build systems
