#!/usr/bin/env node

/**
 * AUTOMATED ADO-Compatible Work Item Generator
 * 
 * This script automatically processes issues and generates work items
 * with AI-powered content analysis for estimation and categorization.
 * 
 * Features:
 * - Fully automated processing (no user prompts)
 * - Intelligent story point estimation based on content
 * - Automatic work item type detection
 * - Priority assignment based on business impact keywords
 * - ADO-compatible hierarchy generation
 */

const fs = require('fs').promises;
const path = require('path');

class AutomatedWorkItemGenerator {
    constructor() {
        this.basePath = path.resolve(__dirname, '..');
        this.issuesPath = path.join(this.basePath, 'issues');
        this.workItemsPath = path.join(this.basePath, 'work-items');
        
        // Automated analysis patterns
        this.complexityPatterns = {
            epic: [
                /strategic/i, /roadmap/i, /transformation/i, /initiative/i, 
                /platform/i, /architecture/i, /migration/i, /overhaul/i
            ],
            feature: [
                /system/i, /integration/i, /optimization/i, /enhancement/i,
                /implementation/i, /dashboard/i, /workflow/i, /management/i
            ],
            story: [
                /user/i, /interface/i, /form/i, /page/i, /component/i,
                /display/i, /profile/i, /listing/i, /search/i
            ],
            task: [
                /fix/i, /update/i, /configure/i, /install/i, /setup/i,
                /refactor/i, /cleanup/i, /test/i, /document/i
            ]
        };

        this.priorityPatterns = {
            'critical': [
                /critical/i, /urgent/i, /security/i, /performance/i, /bug/i,
                /error/i, /crash/i, /down/i, /broken/i, /failure/i
            ],
            'high': [
                /important/i, /client/i, /revenue/i, /conversion/i, /seo/i,
                /optimization/i, /user experience/i, /ux/i, /business/i
            ],
            'medium': [
                /enhancement/i, /improvement/i, /feature/i, /nice to have/i,
                /could/i, /should/i, /consider/i
            ],
            'low': [
                /minor/i, /cosmetic/i, /polish/i, /future/i, /maybe/i,
                /documentation/i, /comment/i
            ]
        };

        this.effortPatterns = {
            1: [/trivial/i, /simple/i, /quick/i, /minor/i, /small/i],
            2: [/easy/i, /straightforward/i, /basic/i],
            3: [/moderate/i, /standard/i, /normal/i],
            5: [/complex/i, /significant/i, /substantial/i],
            8: [/large/i, /major/i, /comprehensive/i],
            13: [/extensive/i, /substantial/i, /week/i],
            21: [/epic/i, /platform/i, /strategic/i, /transformation/i],
            34: [/massive/i, /overhaul/i, /migration/i, /architecture/i]
        };
    }

    async processIssues(dryRun = false) {
        console.log('🤖 Starting automated work item generation...');
        
        try {
            const issueFiles = await this.findIssueFiles();
            
            if (issueFiles.length === 0) {
                console.log('ℹ️  No issues found to process');
                return;
            }

            console.log(`📋 Found ${issueFiles.length} issue(s) to process`);

            const workItems = [];
            
            for (const issueFile of issueFiles) {
                console.log(`\\n🔍 Processing: ${path.basename(issueFile)}`);
                const workItem = await this.analyzeAndCreateWorkItem(issueFile);
                workItems.push(workItem);
                
                if (dryRun) {
                    console.log('  📊 Analysis Result:');
                    console.log(`    Type: ${workItem.type}`);
                    console.log(`    Priority: ${workItem.priority}`);
                    console.log(`    Effort: ${workItem.effort} story points`);
                    console.log(`    Title: ${workItem.title}`);
                } else {
                    await this.createWorkItemFiles(workItem);
                    console.log(`  ✅ Created ${workItem.type}: ${workItem.id}`);
                }
            }

            if (!dryRun) {
                await this.updateBacklog(workItems);
                console.log('\\n🎉 Work items generated successfully!');
            } else {
                console.log('\\n🧪 Dry run complete - no files created');
            }

        } catch (error) {
            console.error('❌ Error processing issues:', error.message);
            process.exit(1);
        }
    }

    async analyzeAndCreateWorkItem(issueFile) {
        const content = await fs.readFile(issueFile, 'utf8');
        const filename = path.basename(issueFile, path.extname(issueFile));
        
        // Extract title from content or filename
        const titleMatch = content.match(/^#\\s*(.+)/m);
        const title = titleMatch ? titleMatch[1].trim() : this.formatTitle(filename);
        
        // Analyze content for automatic categorization
        const type = this.determineWorkItemType(content, title);
        const priority = this.determinePriority(content);
        const effort = this.estimateEffort(content, type);
        
        // Generate unique ID
        const id = await this.generateWorkItemId(type);
        
        return {
            id,
            title,
            type,
            priority,
            effort,
            content,
            state: 'New',
            created: new Date().toISOString().split('T')[0],
            description: this.extractDescription(content),
            acceptanceCriteria: this.extractAcceptanceCriteria(content),
            businessValue: this.extractBusinessValue(content)
        };
    }

    determineWorkItemType(content, title) {
        const text = (content + ' ' + title).toLowerCase();
        
        // Check patterns in order of complexity (Epic -> Feature -> Story -> Task)
        for (const [type, patterns] of Object.entries(this.complexityPatterns)) {
            if (patterns.some(pattern => pattern.test(text))) {
                return this.capitalizeType(type);
            }
        }
        
        // Default based on content length and keywords
        if (text.length > 2000 || /platform|system|architecture/i.test(text)) {
            return 'Epic';
        } else if (text.length > 800 || /feature|enhancement|optimization/i.test(text)) {
            return 'Feature';
        } else if (/user|interface|page|form/i.test(text)) {
            return 'User Story';
        } else {
            return 'Task';
        }
    }

    determinePriority(content) {
        const text = content.toLowerCase();
        
        for (const [priority, patterns] of Object.entries(this.priorityPatterns)) {
            if (patterns.some(pattern => pattern.test(text))) {
                switch(priority) {
                    case 'critical': return '1-Critical';
                    case 'high': return '2-High';
                    case 'medium': return '3-Medium';
                    case 'low': return '4-Low';
                }
            }
        }
        
        // Default based on content analysis
        if (/performance|security|bug|error/i.test(text)) return '1-Critical';
        if (/business|client|revenue|conversion/i.test(text)) return '2-High';
        return '3-Medium';
    }

    estimateEffort(content, type) {
        const text = content.toLowerCase();
        const wordCount = text.split(/\\s+/).length;
        
        // Check for explicit effort patterns
        for (const [points, patterns] of Object.entries(this.effortPatterns)) {
            if (patterns.some(pattern => pattern.test(text))) {
                return parseInt(points);
            }
        }
        
        // Automatic estimation based on type and content
        switch(type) {
            case 'Epic':
                return wordCount > 500 ? 34 : 21;
            case 'Feature':
                return wordCount > 300 ? 13 : 8;
            case 'User Story':
                return wordCount > 200 ? 5 : 3;
            case 'Task':
                return wordCount > 100 ? 3 : 1;
            default:
                return 3;
        }
    }

    async generateWorkItemId(type) {
        const prefix = this.getTypePrefix(type);
        const year = new Date().getFullYear();
        
        // Get next sequential number for this type
        const existingIds = await this.getExistingIds(type);
        const nextNumber = this.getNextSequentialNumber(existingIds, prefix, year);
        
        return `${prefix}-${year}-${String(nextNumber).padStart(3, '0')}`;
    }

    getTypePrefix(type) {
        const prefixes = {
            'Epic': 'E',
            'Feature': 'F', 
            'User Story': 'US',
            'Task': 'T',
            'Bug': 'B'
        };
        return prefixes[type] || 'WI';
    }

    async findIssueFiles() {
        try {
            const files = await fs.readdir(this.issuesPath);
            return files
                .filter(file => file.endsWith('.md') || file.endsWith('.txt'))
                .map(file => path.join(this.issuesPath, file));
        } catch (error) {
            console.log('ℹ️  Issues directory not found, creating...');
            await fs.mkdir(this.issuesPath, { recursive: true });
            return [];
        }
    }

    async getExistingIds(type) {
        const backlogPath = path.join(this.workItemsPath, 'backlog.json');
        try {
            const backlogData = await fs.readFile(backlogPath, 'utf8');
            const backlog = JSON.parse(backlogData);
            
            const typeKey = this.getBacklogKey(type);
            return backlog[typeKey]?.map(item => item.id) || [];
        } catch (error) {
            return [];
        }
    }

    getBacklogKey(type) {
        const keys = {
            'Epic': 'epics',
            'Feature': 'features',
            'User Story': 'userStories', 
            'Task': 'tasks',
            'Bug': 'bugs'
        };
        return keys[type] || 'tasks';
    }

    getNextSequentialNumber(existingIds, prefix, year) {
        const pattern = new RegExp(`^${prefix}-${year}-(\\d+)$`);
        const numbers = existingIds
            .map(id => {
                const match = id.match(pattern);
                return match ? parseInt(match[1]) : 0;
            })
            .filter(num => num > 0);
        
        return numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
    }

    capitalizeType(type) {
        const typeMap = {
            'epic': 'Epic',
            'feature': 'Feature',
            'story': 'User Story',
            'task': 'Task',
            'bug': 'Bug'
        };
        return typeMap[type] || type;
    }

    formatTitle(filename) {
        return filename
            .replace(/-/g, ' ')
            .replace(/_/g, ' ')
            .replace(/\\b\\w/g, l => l.toUpperCase());
    }

    extractDescription(content) {
        // Extract first paragraph or content before first heading
        const lines = content.split('\\n');
        const description = [];
        let inDescription = false;
        
        for (const line of lines) {
            if (line.startsWith('#')) {
                if (inDescription) break;
                inDescription = true;
                continue;
            }
            if (inDescription && line.trim()) {
                description.push(line.trim());
                if (description.length >= 3) break; // Limit to 3 lines
            }
        }
        
        return description.join(' ') || 'Automatically generated from issue content.';
    }

    extractAcceptanceCriteria(content) {
        // Look for acceptance criteria patterns
        const criteriaMatch = content.match(/(?:acceptance criteria|success criteria|requirements?)[:\\s]*([\\s\\S]*?)(?=\\n\\n|\\n#|$)/i);
        if (criteriaMatch) {
            return criteriaMatch[1].trim();
        }
        
        // Look for bullet points or numbered lists
        const listMatch = content.match(/(?:^\\s*[-*+]\\s+.+$|^\\s*\\d+\\.\\s+.+$)/gm);
        if (listMatch && listMatch.length > 0) {
            return listMatch.slice(0, 5).join('\\n'); // First 5 items
        }
        
        return 'To be defined during sprint planning.';
    }

    extractBusinessValue(content) {
        // Look for business value patterns
        const businessMatch = content.match(/(?:business.{0,20}(?:value|impact|benefit)|impact|benefit|roi)[:\\s]*([\\s\\S]*?)(?=\\n\\n|\\n#|$)/i);
        if (businessMatch) {
            return businessMatch[1].trim();
        }
        
        return 'Supports overall business objectives and technical excellence.';
    }

    async createWorkItemFiles(workItem) {
        // Create work item markdown file
        const typeDir = path.join(this.workItemsPath, this.getBacklogKey(workItem.type));
        await fs.mkdir(typeDir, { recursive: true });
        
        const template = this.generateWorkItemTemplate(workItem);
        const filePath = path.join(typeDir, `${workItem.id}.md`);
        await fs.writeFile(filePath, template, 'utf8');
    }

    generateWorkItemTemplate(workItem) {
        return `# ${workItem.type}: ${workItem.id} - ${workItem.title}

**Work Item ID**: ${workItem.id}  
**Type**: ${workItem.type}  
**Priority**: ${workItem.priority}  
**State**: ${workItem.state}  
**Effort**: ${workItem.effort} Story Points  
**Created**: ${workItem.created}  

## Description

${workItem.description}

## Business Value

${workItem.businessValue}

## Acceptance Criteria

${workItem.acceptanceCriteria}

## Generated Information

**Source**: Automatically generated from issue analysis  
**Analysis Date**: ${new Date().toISOString().split('T')[0]}  
**Content Analysis**: AI-powered categorization and estimation  

## Original Issue Content

\`\`\`markdown
${workItem.content}
\`\`\`
`;
    }

    async updateBacklog(workItems) {
        const backlogPath = path.join(this.workItemsPath, 'backlog.json');
        
        // Load existing backlog
        let backlog = {
            epics: [],
            features: [],
            userStories: [],
            tasks: [],
            bugs: [],
            metadata: {
                lastUpdated: new Date().toISOString(),
                version: "1.0",
                adoCompliant: true
            }
        };
        
        try {
            const existing = await fs.readFile(backlogPath, 'utf8');
            backlog = JSON.parse(existing);
        } catch (error) {
            // File doesn't exist, use default
        }
        
        // Add new work items to backlog
        for (const workItem of workItems) {
            const typeKey = this.getBacklogKey(workItem.type);
            const backlogItem = {
                id: workItem.id,
                title: workItem.title,
                type: workItem.type,
                state: workItem.state,
                priority: workItem.priority,
                effort: workItem.effort,
                created: workItem.created,
                description: workItem.description
            };
            
            backlog[typeKey].push(backlogItem);
        }
        
        backlog.metadata.lastUpdated = new Date().toISOString();
        
        await fs.mkdir(this.workItemsPath, { recursive: true });
        await fs.writeFile(backlogPath, JSON.stringify(backlog, null, 2), 'utf8');
    }
}

// CLI interface
async function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');
    const verbose = args.includes('--verbose') || args.includes('-v');
    
    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
🤖 Automated Work Item Generator

Usage: node generate-work-items-auto.js [OPTIONS]

Options:
  --dry-run    Preview work items without creating them
  --verbose    Show detailed processing information  
  --help       Show this help message

Features:
  ✅ Fully automated (no user prompts)
  ✅ AI-powered content analysis
  ✅ Automatic story point estimation
  ✅ Intelligent priority assignment
  ✅ ADO-compatible work item generation
        `);
        process.exit(0);
    }
    
    const generator = new AutomatedWorkItemGenerator();
    
    if (verbose) {
        console.log('🔧 Verbose mode enabled');
        console.log(`📁 Issues path: ${generator.issuesPath}`);
        console.log(`📁 Work items path: ${generator.workItemsPath}`);
    }
    
    await generator.processIssues(dryRun);
}

if (require.main === module) {
    main().catch(error => {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    });
}

module.exports = AutomatedWorkItemGenerator;
