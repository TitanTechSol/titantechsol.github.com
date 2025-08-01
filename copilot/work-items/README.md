# Work Items Data Architecture & Scalability

## Current Problem
The `backlog.json` file will become massive and hard to maintain as we add the 89+ existing user stories.

## Recommended Data Sources

### Option 1: Individual JSON Files (Recommended)
```
work-items/
├── epics/
│   ├── 1001.json          # ADO metadata
│   └── P01-CE-00001.md    # Detailed description
├── features/
│   ├── 2001.json
│   └── P01-CE-00001.01.md
└── user-stories/
    ├── 3001.json
    └── P01-CE-00001.01.01.md
```

**Benefits:**
- Scalable to hundreds of work items
- Easy to find and edit individual items
- Git-friendly (smaller diffs)
- Parallel development possible

### Option 2: YAML Front Matter
```markdown
---
id: 3001
type: "User Story"
state: "Closed"
title: "P01-CE-00001.01.01: Team Member Profile Enhancement"
storyPoints: 3
priority: 2
parentId: 2001
tags: ["Team", "Profiles", "Trust"]
---

# User Story: Team Member Profile Enhancement

**As a** potential client...
```

**Benefits:**
- Single file per work item
- Human-readable metadata
- Easy to edit and maintain
- Natural for documentation

### Option 3: Database Approach
- SQLite for local development
- PostgreSQL for production
- Tables: work_items, relationships, tags

### Option 4: Directory-Based with Index
Keep detailed markdown files, generate summary indices:
```
work-items/
├── index.json           # Lightweight summary
├── relationships.json   # Parent-child mapping
└── detailed/           # Full markdown files
```

## Recommendation

**Use Option 1 (Individual JSON Files)** because:
1. Maintains ADO compatibility
2. Scales to enterprise-level backlogs
3. Git-friendly workflow
4. Easy automation and tooling
5. Clear separation of concerns

## Migration Strategy

1. Split `backlog.json` into individual files
2. Update SOW scripts to read directory structure
3. Create index generation for summary views
4. Maintain ADO import compatibility

---

# ADO-Compatible Work Item Tracking System

This system implements Azure DevOps-compatible work item hierarchy and management following ADO best practices for SDLC/SOW development.

## Work Item Hierarchy (ADO Standard)

Following Azure DevOps Agile process hierarchy:

```
Epic (Strategic initiatives spanning multiple releases)
├── Feature (Major deliverables spanning multiple sprints)
    ├── User Story (Sprint-sized customer value delivery)
        ├── Task (Technical work items, hours-based)
        └── Bug (Defects linked to stories)
```

## Directory Structure

```
work-items/
├── epics/           # Epic work items (.md files)
├── features/        # Feature work items (.md files)  
├── user-stories/    # User Story work items (.md files)
├── tasks/           # Task work items (.md files)
├── bugs/            # Bug work items (.md files)
├── backlog.json     # Active backlog with priority ordering
└── templates/       # Work item templates
```

## Work Item States (ADO Standard)

- **New**: Just created, not yet triaged
- **Active**: Approved and in progress
- **Resolved**: Work completed, pending verification
- **Closed**: Verified and accepted
- **Removed**: Cancelled or invalid

## Estimation Standards

### Story Points (Fibonacci Sequence)
- **1**: Trivial change (< 1 hour)
- **2**: Simple change (2-4 hours) 
- **3**: Small feature (1/2 day)
- **5**: Medium feature (1 day)
- **8**: Large feature (2-3 days)
- **13**: Very large feature (1 week)
- **21+**: Epic/Feature needing breakdown

### Effort Hours (Tasks)
- Detailed time estimates in hours
- Used for sprint capacity planning
- Rolling up to story point validation

## Dependency Management

### Parent-Child Relationships
- **Epic → Features**: Strategic grouping
- **Feature → User Stories**: Functional decomposition  
- **User Story → Tasks**: Technical breakdown
- **User Story → Bugs**: Defect tracking

### Link Types (ADO Standard)
- **Child**: Direct parent-child relationship
- **Related**: Loose association
- **Predecessor/Successor**: Sequencing dependencies
- **Blocks/Blocked By**: Hard dependencies
- **Duplicate**: Similar work items

## Business Rules

### No Orphan Policy
- Every User Story MUST have a Feature parent
- Every Feature MUST have an Epic parent  
- Every Task MUST have a User Story parent
- Only Epics can be root-level work items

### State Transition Rules
- New → Active (requires assignment and effort estimation)
- Active → Resolved (requires completion of acceptance criteria)
- Resolved → Closed (requires verification/acceptance)
- Any state → Removed (requires justification)

## Integration with SOW Development

This work item system integrates with the SOW development behaviors:
- **SOW Planning Strategy**: Creates Epics and Features
- **Technical Architecture Design**: Creates User Stories and Tasks  
- **Quality Assurance Testing**: Creates test Tasks and Bugs
- **Client Communication**: Reviews and approves work items

## Next Steps

1. Review and approve this structure
2. Set up automation scripts for work item generation
3. Migrate existing user stories to new format
4. Integrate with ADO for final deployment
