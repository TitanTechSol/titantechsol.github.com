#!/usr/bin/env node

/**
 * ADO Migration Utility
 * 
 * Prepares work items for Azure DevOps import by generating CSV files
 * and maintaining proper relationships for bulk import.
 */

const fs = require('fs').promises;
const path = require('path');

class AdoMigrator {
    constructor() {
        this.basePath = path.resolve(__dirname, '..');
        this.workItemsPath = path.join(this.basePath, 'work-items');
        this.outputPath = path.join(this.basePath, 'ado-export');
        
        // ADO CSV field mappings
        this.adoFields = {
            'Work Item Type': 'type',
            'Title': 'title',
            'State': 'state',
            'Assigned To': 'assignedTo',
            'Description': 'description',
            'Acceptance Criteria': 'acceptanceCriteria',
            'Story Points': 'storyPoints',
            'Original Estimate': 'originalEstimate',
            'Priority': 'priority',
            'Value Area': 'valueArea',
            'Business Value': 'businessValue',
            'Tags': 'tags',
            'Parent': 'parentId',
            'Link Type': 'linkType'
        };
    }

    async migrate() {
        console.log('🚀 ADO Migration Utility');
        console.log('========================\\n');

        try {
            await this.createOutputDirectory();
            const backlog = await this.loadBacklog();
            
            await this.generateWorkItemCsv(backlog);
            await this.generateLinksCsv(backlog);
            await this.generateImportInstructions();
            
            console.log('\\n✅ ADO migration files generated successfully!');
            console.log(`📁 Export location: ${this.outputPath}`);
            
        } catch (error) {
            console.error('❌ Migration failed:', error.message);
        }
    }

    async createOutputDirectory() {
        try {
            await fs.mkdir(this.outputPath, { recursive: true });
        } catch (error) {
            // Directory already exists
        }
    }

    async loadBacklog() {
        const backlogPath = path.join(this.workItemsPath, 'backlog.json');
        const content = await fs.readFile(backlogPath, 'utf8');
        return JSON.parse(content);
    }

    async generateWorkItemCsv(backlog) {
        console.log('📋 Generating work items CSV...');

        const allWorkItems = this.getAllWorkItems(backlog);
        const csvData = [];
        
        // CSV Header
        const headers = Object.keys(this.adoFields);
        csvData.push(headers.join(','));

        // Process work items in dependency order (parents first)
        const sortedWorkItems = this.sortByDependency(allWorkItems);
        
        for (const item of sortedWorkItems) {
            const workItemDetails = await this.loadWorkItemDetails(item);
            const csvRow = this.mapToAdoFields(workItemDetails);
            csvData.push(this.formatCsvRow(csvRow));
        }

        const csvContent = csvData.join('\\n');
        const outputFile = path.join(this.outputPath, 'work-items.csv');
        await fs.writeFile(outputFile, csvContent);
        
        console.log(`✅ Work items CSV exported: ${sortedWorkItems.length} items`);
    }

    async generateLinksCsv(backlog) {
        console.log('🔗 Generating links CSV...');

        const allWorkItems = this.getAllWorkItems(backlog);
        const linksData = [];
        
        // CSV Header for links
        linksData.push('Source ID,Target ID,Link Type');

        allWorkItems.forEach(item => {
            if (item.parentId) {
                // Child -> Parent relationship
                linksData.push(`${item.id},${item.parentId},Child`);
            }
        });

        const csvContent = linksData.join('\\n');
        const outputFile = path.join(this.outputPath, 'work-item-links.csv');
        await fs.writeFile(outputFile, csvContent);
        
        console.log(`✅ Links CSV exported: ${linksData.length - 1} relationships`);
    }

    async loadWorkItemDetails(item) {
        try {
            const workItemDir = this.getWorkItemDirectory(item.type);
            const filePath = path.join(this.workItemsPath, workItemDir, item.filename);
            const content = await fs.readFile(filePath, 'utf8');
            
            return {
                ...item,
                fullContent: content,
                description: this.extractDescription(content),
                acceptanceCriteria: this.extractAcceptanceCriteria(content)
            };
        } catch (error) {
            console.warn(`⚠️  Could not load details for ${item.id}: ${error.message}`);
            return item;
        }
    }

    mapToAdoFields(workItem) {
        return {
            'Work Item Type': this.mapWorkItemType(workItem.type),
            'Title': workItem.title,
            'State': workItem.state,
            'Assigned To': workItem.assignedTo || '',
            'Description': workItem.description || '',
            'Acceptance Criteria': workItem.acceptanceCriteria || '',
            'Story Points': workItem.type === 'Task' ? '' : workItem.effort,
            'Original Estimate': workItem.type === 'Task' ? workItem.effort : '',
            'Priority': workItem.priority || '3-Medium',
            'Value Area': 'Business',
            'Business Value': workItem.businessValue || '',
            'Tags': this.generateTags(workItem),
            'Parent': '', // Will be handled via links
            'Link Type': ''
        };
    }

    mapWorkItemType(type) {
        // ADO work item type mapping
        const mapping = {
            'Epic': 'Epic',
            'Feature': 'Feature',
            'User Story': 'User Story',
            'Task': 'Task',
            'Bug': 'Bug'
        };
        return mapping[type] || type;
    }

    generateTags(workItem) {
        const tags = [];
        
        if (workItem.type) {
            tags.push(`Type:${workItem.type.replace(' ', '')}`);
        }
        
        if (workItem.created) {
            tags.push(`Created:${workItem.created}`);
        }
        
        tags.push('TitanTech');
        tags.push('SOW-Generated');
        
        return tags.join(';');
    }

    extractDescription(content) {
        // Extract description from markdown content
        const lines = content.split('\\n');
        let description = '';
        let capturing = false;
        
        for (const line of lines) {
            if (line.includes('Description') || line.includes('Overview')) {
                capturing = true;
                continue;
            }
            
            if (capturing && line.startsWith('#')) {
                break;
            }
            
            if (capturing && line.trim()) {
                description += line + ' ';
            }
        }
        
        return description.trim().substring(0, 1000); // ADO description limit
    }

    extractAcceptanceCriteria(content) {
        // Extract acceptance criteria from markdown
        const criteriaSection = content.match(/## Acceptance Criteria[\\s\\S]*?(?=##|$)/);
        if (criteriaSection) {
            return criteriaSection[0]
                .replace(/##.*\\n/, '')
                .replace(/- \\[ \\]/g, '□')
                .replace(/- \\[x\\]/g, '☑')
                .trim()
                .substring(0, 1000);
        }
        return '';
    }

    formatCsvRow(row) {
        return Object.values(row).map(value => {
            // Escape CSV values
            const escaped = String(value || '').replace(/"/g, '""');
            return `"${escaped}"`;
        }).join(',');
    }

    sortByDependency(workItems) {
        // Sort work items so parents appear before children
        const sorted = [];
        const processed = new Set();
        const workItemMap = new Map();
        
        workItems.forEach(item => {
            workItemMap.set(item.id, item);
        });

        const addItem = (item) => {
            if (processed.has(item.id)) return;
            
            // Add parent first if it exists
            if (item.parentId && workItemMap.has(item.parentId)) {
                addItem(workItemMap.get(item.parentId));
            }
            
            sorted.push(item);
            processed.add(item.id);
        };

        workItems.forEach(addItem);
        return sorted;
    }

    getAllWorkItems(backlog) {
        const allItems = [];
        Object.keys(backlog).forEach(key => {
            if (key !== 'metadata') {
                allItems.push(...backlog[key]);
            }
        });
        return allItems;
    }

    getWorkItemDirectory(workItemType) {
        const dirMap = {
            'Epic': 'epics',
            'Feature': 'features',
            'User Story': 'user-stories',
            'Task': 'tasks',
            'Bug': 'bugs'
        };
        return dirMap[workItemType];
    }

    async generateImportInstructions() {
        console.log('📖 Generating import instructions...');

        const instructions = `# Azure DevOps Import Instructions

## Files Generated

1. **work-items.csv** - Contains all work items with ADO-compatible fields
2. **work-item-links.csv** - Contains parent-child relationships
3. **import-instructions.md** - This file

## Import Process

### Step 1: Prepare Azure DevOps Project
1. Create a new Azure DevOps project or select existing one
2. Ensure you have project administrator permissions
3. Verify the project uses Agile, Scrum, or CMMI process template

### Step 2: Import Work Items
1. Navigate to Boards > Work Items in your ADO project
2. Click "Import" from the toolbar
3. Upload **work-items.csv**
4. Map fields if prompted (most should auto-map)
5. Review and confirm import

### Step 3: Import Relationships
1. After work items are imported, note the new ADO work item IDs
2. Update **work-item-links.csv** with actual ADO IDs
3. Use ADO REST API or third-party tools to import relationships

### Step 4: Validation
1. Verify all work items imported correctly
2. Check parent-child relationships are established
3. Validate effort estimates and priorities
4. Review and update any missing fields

## Field Mappings

| TitanTech Field | ADO Field | Notes |
|----------------|-----------|-------|
| title | Title | Direct mapping |
| type | Work Item Type | Epic, Feature, User Story, Task, Bug |
| state | State | New, Active, Resolved, Closed, Removed |
| effort | Story Points / Original Estimate | Story Points for stories, hours for tasks |
| priority | Priority | 1-Critical, 2-High, 3-Medium, 4-Low |
| description | Description | Extracted from markdown content |
| acceptanceCriteria | Acceptance Criteria | Extracted from markdown |

## Process Template Compatibility

This export is compatible with:
- **Agile**: Epic → Feature → User Story → Task
- **Scrum**: Epic → Feature → Product Backlog Item → Task  
- **CMMI**: Epic → Feature → Requirement → Task

## Post-Import Configuration

1. Configure team iterations (sprints)
2. Set up area paths for different components
3. Configure board columns and states
4. Set up automated rules and notifications
5. Create dashboards and reports

## Troubleshooting

### Common Issues:
- **Field mapping errors**: Check field names match ADO schema
- **Work item type conflicts**: Ensure process template supports all types
- **Relationship import failures**: Verify parent work items exist before importing children
- **Permission errors**: Ensure sufficient ADO project permissions

### Support:
For issues with the migration process, refer to:
- Azure DevOps REST API documentation
- TitanTech SOW development behaviors
- Work item templates in /copilot/work-items/templates/

Generated: ${new Date().toISOString()}
Tool: TitanTech ADO Migration Utility
Version: 1.0
`;

        const outputFile = path.join(this.outputPath, 'import-instructions.md');
        await fs.writeFile(outputFile, instructions);
        
        console.log('✅ Import instructions generated');
    }
}

// Main execution
async function main() {
    const migrator = new AdoMigrator();
    await migrator.migrate();
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = AdoMigrator;
