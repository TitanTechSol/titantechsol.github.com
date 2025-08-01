# SOW Dry-Run Workflow Guide

This document demonstrates the complete `--dry-run` workflow for TitanTech Solutions' AI-assisted SDLC management system.

## Overview

The `--dry-run` parameter provides safe preview functionality across all SOW commands, enabling:

- **Risk-Free Testing**: Preview all changes before execution
- **Workflow Validation**: Test issue analysis and work item generation logic
- **SOW Planning**: Preview complete work breakdown for client presentation
- **Continuous Development**: Maintain development flow without breaking existing backlog
- **Training & Onboarding**: Learn the system safely

## Dry-Run Commands

### 1. AI Guidance with Context
```bash
./sow ai
```
**What it shows**: Current state analysis and recommended next steps based on existing issues and backlog.

### 2. Issue Analysis Preview
```bash
./sow plan --dry-run
```
**What it shows**: Lists all issues that would be analyzed without processing them.

### 3. Work Item Generation Preview
```bash
./sow create --dry-run
```
**What it shows**: 
- Interactive issue processing (can be stopped with Ctrl+C)
- Preview of work items that would be created
- Hierarchy validation
- Effort estimation preview
- No files are modified

### 4. Backlog Validation Preview  
```bash
./sow validate --dry-run
```
**What it shows**: ADO compliance checks without generating validation reports.

### 5. Azure DevOps Export Preview
```bash
./sow export --dry-run
```
**What it shows**: CSV export structure and field mapping without creating files.

## Complete Workflow Example

### Step 1: System Health Check
```bash
./sow health
```
Ensures all dependencies and directory structure are ready.

### Step 2: Check for Issues
```bash
./sow check-issues
```
Scans for pending issues and provides overview.

### Step 3: Get AI Guidance
```bash
./sow ai
```
Shows current state and recommended actions.

### Step 4: Preview Issue Planning
```bash
./sow plan --dry-run
```
Lists issues that would be processed.

### Step 5: Preview Work Item Creation
```bash
./sow create --dry-run
```
**Interactive Preview**: Shows how issues would be processed:
- Issue complexity analysis
- Work item type determination
- Effort estimation
- Priority assignment
- Hierarchy validation

### Step 6: Execute Work Item Creation
```bash
./sow create
```
Actually creates the work items after dry-run validation.

### Step 7: Validate Results
```bash
./sow validate
```
Checks ADO compliance of generated work items.

### Step 8: Preview Export
```bash
./sow export --dry-run
```
Shows what would be exported to Azure DevOps.

### Step 9: Generate Reports
```bash
./sow status
./sow report
./sow metrics
```

## Benefits for Context Engineering

### 1. **Iterative Refinement**
- Test issue analysis logic
- Validate work item hierarchy decisions
- Adjust estimation approaches
- Preview SOW structure before client presentation

### 2. **Continuous Workflow**
- Developers can preview changes without interrupting existing work
- Safe experimentation with new issues
- Training new team members without risk

### 3. **SOW Quality Assurance**
- Validate business logic before execution
- Ensure ADO compliance before export
- Preview complete work breakdown structure

### 4. **Risk Mitigation**
- Prevent orphaned work items
- Validate parent-child relationships
- Test estimation strategies
- Ensure proper state transitions

## Advanced Dry-Run Usage

### Verbose Mode
```bash
./sow create --dry-run --verbose
```
Shows detailed JSON preview of work items that would be created.

### Combined with Status Checks
```bash
./sow status
./sow create --dry-run
./sow status  # Compare before/after state
```

### Integration with Git Workflow
```bash
./sow create --dry-run           # Preview changes
./sow create                     # Execute if satisfied
./sow commit <work-item-id> "Implemented feature"
```

## Best Practices

1. **Always Start with Dry-Run**: Use `--dry-run` for any new or complex operations
2. **Validate Before Execute**: Run dry-run, review output, then execute
3. **Use for Training**: New team members should use dry-run extensively
4. **SOW Presentation**: Use dry-run output for client SOW presentations
5. **Continuous Integration**: Include dry-run checks in CI/CD pipelines

## Troubleshooting

### Interactive Mode Issues
If interactive prompts become unresponsive:
- Press Ctrl+C to exit
- Review issue content and simplify if needed
- Use non-interactive options when available

### Missing Templates
If template errors occur:
```bash
./sow health  # Check system status
```

### Validation Failures
```bash
./sow validate --dry-run  # Preview validation issues
./sow validate --verbose  # Get detailed compliance report
```

This dry-run workflow ensures safe, predictable SOW management while maintaining the flexibility needed for complex software development lifecycle processes.
