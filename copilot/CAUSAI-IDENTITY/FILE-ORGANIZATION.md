# FILE ORGANIZATION & DIRECTORY STRUCTURE

## MANDATORY FILE PLACEMENT RULES

### Golden Rule
**NEVER create files in project root** (except Readme.md)

### Always Determine Proper Folder BEFORE Creating Any File
1. Identify the file type and purpose
2. Check the directory structure below
3. Place file in appropriate copilot subdirectory
4. Follow established naming conventions

---

## COPILOT DIRECTORY STRUCTURE

### Primary Organization
```
copilot/
├── CAUSAI-IDENTITY/             # Core AI operational rules (this folder)
├── README.md                    # Main documentation
├── active-backlog.md           # Current work prioritization
├── user-stories/               # P01-P02 active stories ONLY
├── work-items/                 # Azure DevOps compatible tracking
├── scripts/                    # Automation tools and utilities
├── docs/                       # Deployment guides and planning documents
├── behaviors/                  # Core development behavior patterns
├── completed/                  # Finished work documentation
└── archive/                    # Historical content and future features
```

### Detailed Subdirectory Rules

#### copilot/user-stories/
- **Purpose**: Active user stories (P01-P02 priorities only)
- **Naming**: P01-XX-00001-descriptive-name.md
- **Content**: P03+ stories automatically moved to archive/future-features/

#### copilot/work-items/  
- **Purpose**: Azure DevOps compatible work item tracking
- **Naming**: WI-YYYYMMDD-brief-description.md
- **Content**: Structured work items with status tracking

#### copilot/scripts/
- **Purpose**: Automation tools and utilities
- **Subfolders**: 
  - testing/ (test scripts)
  - automation/ (workflow tools)
  - deployment/ (deployment utilities)

#### copilot/docs/
- **Purpose**: Project documentation and guides
- **Subfolders**:
  - planning/ (project analysis and planning docs)
  - deployment/ (deployment and setup guides)
- **Naming**: descriptive-name-guide.md or analysis-name.md

#### copilot/completed/
- **Purpose**: Documentation of finished work
- **Subfolders**:
  - summaries/ (completion summaries)
  - evidence/ (screenshots, visual proof)

#### copilot/archive/
- **Purpose**: Historical content and future features
- **Subfolders**:
  - legacy/ (old structures and outdated content)
  - future-features/ (P03+ user stories for future consideration)

---

## FILE NAMING CONVENTIONS

### User Stories
```
Format: P[Priority Level]-[Category]-[Number]-[Description].md

Examples:
- P01-CE-00001-content-strategy.md
- P02-VD-00002-responsive-design.md
- P01-PO-00003-performance-optimization.md
```

### Work Items
```
Format: WI-YYYYMMDD-[brief-description].md

Examples:
- WI-20250819-about-page-enhancement.md
- WI-20250820-lazy-loading-implementation.md
```

### Documentation Files
```
Format: [descriptive-name]-[type].md

Examples:
- deployment-setup-guide.md
- performance-analysis-summary.md
- cleanup-script-guide.md
```

### Script Files
```
Format: [purpose]-[description].[extension]

Examples:
- optimize-images.js
- cleanup-workspace.sh
- validate-backlog.js
```

---

## WORKSPACE FOCUS RULES

### Active vs Archived Content

#### Keep in Active Directories:
- **P01-P02 user stories** (immediate and high priority)
- **Current work items** and active tracking
- **Essential documentation** for ongoing work
- **Active automation scripts** in regular use

#### Move to Archive:
- **P03+ user stories** → archive/future-features/
- **Completed work summaries** → archive/legacy/ or completed/
- **Outdated documentation** → archive/legacy/
- **Unused scripts or tools** → archive/legacy/

---

## FILE ORGANIZATION CHECKLIST

Before creating any new file:

- [ ] Identified correct copilot subdirectory
- [ ] Followed proper naming convention
- [ ] Verified file doesn't belong in project root
- [ ] Checked if similar file already exists
- [ ] Determined appropriate content organization

### Common Organization Mistakes
1. **Creating files in project root** → Always use copilot subdirectories
2. **Poor naming conventions** → Follow established patterns
3. **Mixed priority stories** → Separate P01-P02 from P03+
4. **Duplicated content** → Check existing files first
5. **Wrong directory choice** → Match purpose to directory function

---

## AUTOMATED CLEANUP INTEGRATION

### Intelligent Cleanup Scripts
- **Purpose**: Maintain organized workspace automatically
- **Location**: copilot/scripts/cleanup-workspace.sh
- **Function**: Finds and relocates misplaced files

### Cleanup Triggers
- **P03+ user stories** → Automatically moved to archive/future-features/
- **Duplicate content** → Identified and consolidated
- **Empty files** → Removed to reduce clutter
- **Legacy artifacts** → Archived appropriately

---

## DIRECTORY MAINTENANCE PRINCIPLES

### Regular Organization
- **Weekly review** of file placement
- **Quarterly archive** of completed work
- **Continuous cleanup** of redundant content
- **Proactive organization** before accumulation

### Quality Standards
- **Consistent structure** across all directories
- **Clear naming** that indicates content and purpose
- **Logical grouping** of related files
- **Easy navigation** for both humans and AI

### Growth Management
- **Prevent directory bloat** through regular cleanup
- **Maintain focus** on active work
- **Archive historical content** systematically
- **Plan for scalability** as project grows

---

**Remember: Good organization is the foundation of efficient development - invest time in proper file placement to save time later**
