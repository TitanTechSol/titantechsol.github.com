# How to Use the Work Item Tracking System

## Quick Start Guide

### 1. Create an Issue
Place your issue in the `/copilot/issues/` directory as a markdown or text file:

```markdown
# Website Performance Optimization

Our website is loading slowly and users are experiencing delays...

## Current Issues:
- Home page takes 6-8 seconds to load
- Images are not optimized

## Business Impact:
- User bounce rate increased by 25%
- Conversion rate dropped by 15%
```

### 2. Generate Work Items
Run the work item generator:

```bash
cd copilot/scripts

# Preview mode - test your workflow without creating files
./generate-work-items.sh --dry-run

# Detailed preview with verbose output
./generate-work-items.sh --dry-run --verbose

# Normal mode - actually create work items
./generate-work-items.sh
```

The system will:
- Analyze your issue
- Ask clarifying questions about complexity and relationships
- Generate ADO-compatible work items with proper hierarchy
- Enforce no-orphan policy and business rules

**💡 Tip**: Always start with `--dry-run` to preview the workflow and validate your approach before creating actual work items.

### 3. Validate Your Backlog
Check for ADO compliance:

```bash
# Preview validation results
./validate-backlog.sh --dry-run

# Normal validation with report generation
./validate-backlog.sh
```

### 4. Export for ADO
Generate CSV files for Azure DevOps import:

```bash
# Preview export structure and statistics
./migrate-to-ado.sh --dry-run

# Generate actual CSV files for import
./migrate-to-ado.sh
```

## Dry-Run Best Practices

**🧪 Always Start with Dry-Run**

1. **Preview Workflow**: Test your issue processing without creating files
   ```bash
   ./generate-work-items.sh --dry-run --verbose
   ```

2. **Validate Approach**: Review work item structure before committing
   ```bash
   ./validate-backlog.sh --dry-run
   ```

3. **Preview Export**: Check ADO mapping before generating CSV files
   ```bash
   ./migrate-to-ado.sh --dry-run --verbose
   ```

**Benefits:**
- 🔍 See what will be created before making changes
- ✅ Test and refine your SOW approach iteratively  
- 🛡️ Prevent orphaned or malformed work items
- 📋 Preview complete work breakdown for client presentations
- 🎯 Maintain continuous development flow

## Interactive Process

When you run the generator, it will ask questions like:

```
🔍 Processing: website-performance-optimization.md
================================
Content Preview:
# Website Performance Optimization

Our website is loading slowly and users are experiencing delays...

🤔 Analyzing issue complexity and scope...

What is the complexity level?
1) Simple (1-2 tasks)
2) Medium (feature-sized)  
3) Large (epic-sized)
4) Let me analyze
Choice: 3

Is this related to existing work items? (y/n): n

Fibonacci sequence: 1, 2, 3, 5, 8, 13, 21, 34, 55, 89
Story points (Fibonacci): 21

Priority (1-Critical, 2-High, 3-Medium, 4-Low): 2
```

## ADO Hierarchy Enforcement

The system automatically enforces proper ADO hierarchy:

```
Epic (21+ story points, strategic initiatives)
├── Feature (8-21 story points, major deliverables)
    ├── User Story (1-8 story points, sprint-sized value)
        ├── Task (hour-based estimates, technical work)
        └── Bug (defects linked to stories)
```

## No-Orphan Policy

Every work item (except Epics) MUST have a parent:
- If you create a User Story without a Feature parent, the system will prompt you to create one
- This ensures ADO compliance and proper project organization

## Fibonacci Estimation

The system enforces Fibonacci estimation for story points:
- **1**: Trivial change (< 1 hour)
- **2**: Simple change (2-4 hours)
- **3**: Small feature (1/2 day)
- **5**: Medium feature (1 day)
- **8**: Large feature (2-3 days)
- **13**: Very large feature (1 week)
- **21+**: Epic/Feature needing breakdown

## Generated Work Items

Each work item includes:
- **Unique ID** following ADO patterns (E-2025-001, F-2025-001, US-2025-001)
- **Complete template** with all ADO-required fields
- **Proper parent-child relationships**
- **ADO-compatible states and transitions**
- **Business value and estimation data**

## File Structure After Generation

```
work-items/
├── epics/
│   └── E-2025-001.md          # Performance Optimization Epic
├── features/
│   ├── F-2025-001.md          # Frontend Optimization Feature
│   └── F-2025-002.md          # Backend Performance Feature
├── user-stories/
│   ├── US-2025-001.md         # Image Optimization Story
│   └── US-2025-002.md         # Bundle Size Reduction Story
├── tasks/
│   ├── T-2025-001.md          # Implement lazy loading
│   └── T-2025-002.md          # Configure webpack optimization
├── backlog.json               # Updated with new work items
└── templates/                 # ADO-compatible templates
```

## Integration with SOW Development

Generated work items integrate with your SOW behaviors:
- **SOW Planning Strategy**: Creates strategic Epics aligned with business goals
- **Technical Architecture Design**: Generates Features and Stories with technical considerations
- **Quality Assurance Testing**: Creates testing Tasks and Bug work items
- **Client Communication**: Produces stakeholder-ready work item documentation

## ADO Migration Ready

When ready for production:
1. Run validation to ensure compliance
2. Export to CSV format
3. Import directly into Azure DevOps
4. Maintain all relationships and hierarchy

The system ensures seamless transition from local SOW development to enterprise-grade Azure DevOps project management.
