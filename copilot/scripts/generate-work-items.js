#!/usr/bin/env node

/**
 * ADO-Compatible Work Item Generator
 * 
 * This script processes issues from the /copilot/issues directory and generates
 * hierarchical work items following Azure DevOps best practices.
 * 
 * Features:
 * - Interactive issue processing with clarifying questions
 * - ADO-compatible work item hierarchy (Epic -> Feature -> User Story -> Task)
 * - Fibonacci estimation enforcement
 * - Dependency validation and orphan prevention
 * - SDLC/SOW integration
 */

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

class WorkItemGenerator {
    constructor() {
        this.basePath = path.resolve(__dirname, '..');
        this.issuesPath = path.join(this.basePath, 'issues');
        this.workItemsPath = path.join(this.basePath, 'work-items');
        this.templatesPath = path.join(this.workItemsPath, 'templates');
        
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // ADO-compatible configuration
        this.fibonacciSequence = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
        this.workItemTypes = ['Epic', 'Feature', 'User Story', 'Task', 'Bug'];
        this.states = ['New', 'Active', 'Resolved', 'Closed', 'Removed'];
        this.priorities = ['1-Critical', '2-High', '3-Medium', '4-Low'];
        
        // Backlog tracking
        this.backlog = {
            epics: [],
            features: [],
            userStories: [],
            tasks: [],
            bugs: []
        };
    }

    async initialize() {
        console.log('🚀 ADO-Compatible Work Item Generator');
        console.log('=====================================\\n');
        
        await this.loadExistingBacklog();
        await this.processIssues();
    }

    async loadExistingBacklog() {
        try {
            const backlogPath = path.join(this.workItemsPath, 'backlog.json');
            const backlogData = await fs.readFile(backlogPath, 'utf8');
            this.backlog = JSON.parse(backlogData);
            console.log('✅ Loaded existing backlog');
        } catch (error) {
            console.log('📝 Creating new backlog');
        }
    }

    async saveBacklog() {
        const backlogPath = path.join(this.workItemsPath, 'backlog.json');
        await fs.writeFile(backlogPath, JSON.stringify(this.backlog, null, 2));
        console.log('✅ Backlog saved');
    }

    async processIssues() {
        try {
            const issueFiles = await fs.readdir(this.issuesPath);
            const markdownFiles = issueFiles.filter(file => file.endsWith('.md') || file.endsWith('.txt'));
            
            if (markdownFiles.length === 0) {
                console.log('📁 No issues found. Place issue files in /copilot/issues/ to begin.');
                return;
            }

            console.log(`📋 Found ${markdownFiles.length} issue(s) to process\\n`);

            for (const file of markdownFiles) {
                await this.processIssueFile(file);
            }

            await this.saveBacklog();
            await this.generateSummaryReport();
            
        } catch (error) {
            console.error('❌ Error processing issues:', error.message);
        }
    }

    async processIssueFile(filename) {
        const filePath = path.join(this.issuesPath, filename);
        const content = await fs.readFile(filePath, 'utf8');
        
        console.log(`\\n🔍 Processing: ${filename}`);
        console.log('================================');
        console.log(`Content Preview:\\n${content.substring(0, 300)}...\\n`);

        // Interactive analysis
        const analysis = await this.analyzeIssue(content, filename);
        const workItems = await this.generateWorkItems(analysis);
        
        console.log(`\\n✅ Generated ${workItems.length} work item(s) from ${filename}\\n`);
    }

    async analyzeIssue(content, filename) {
        console.log('🤔 Analyzing issue complexity and scope...\\n');

        // Ask clarifying questions
        const complexity = await this.ask('What is the complexity level?\\n1) Simple (1-2 tasks)\\n2) Medium (feature-sized)\\n3) Large (epic-sized)\\n4) Let me analyze\\nChoice: ');
        
        let workItemType;
        if (complexity === '1') {
            workItemType = 'User Story';
        } else if (complexity === '2') {
            workItemType = 'Feature';
        } else if (complexity === '3') {
            workItemType = 'Epic';
        } else {
            workItemType = await this.intelligentAnalysis(content);
        }

        // Check for existing related work
        const hasRelated = await this.ask('Is this related to existing work items? (y/n): ');
        let parentId = null;
        if (hasRelated.toLowerCase() === 'y') {
            parentId = await this.selectParentWorkItem(workItemType);
        }

        // Effort estimation
        const effort = await this.getEffortEstimate(workItemType);

        return {
            filename,
            content,
            workItemType,
            parentId,
            effort,
            priority: await this.ask(`Priority (1-Critical, 2-High, 3-Medium, 4-Low): `) || '3-Medium'
        };
    }

    async intelligentAnalysis(content) {
        // Simple heuristics for work item type detection
        const contentLower = content.toLowerCase();
        
        if (contentLower.includes('epic') || contentLower.includes('strategic') || contentLower.includes('initiative')) {
            return 'Epic';
        } else if (contentLower.includes('feature') || contentLower.includes('capability') || content.length > 1000) {
            return 'Feature';
        } else if (contentLower.includes('bug') || contentLower.includes('defect') || contentLower.includes('error')) {
            return 'Bug';
        } else {
            return 'User Story';
        }
    }

    async selectParentWorkItem(childType) {
        const parentTypes = this.getValidParentTypes(childType);
        
        console.log('\\nAvailable parent work items:');
        let options = [];
        
        for (const parentType of parentTypes) {
            const items = this.backlog[this.getBacklogKey(parentType)];
            items.forEach((item, index) => {
                options.push({ type: parentType, item, index });
                console.log(`${options.length}) [${parentType}] ${item.title} (${item.id})`);
            });
        }

        if (options.length === 0) {
            console.log('No suitable parent work items found.');
            return null;
        }

        const choice = await this.ask('Select parent (number) or 0 for none: ');
        const choiceNum = parseInt(choice);
        
        if (choiceNum > 0 && choiceNum <= options.length) {
            return options[choiceNum - 1].item.id;
        }
        
        return null;
    }

    getValidParentTypes(childType) {
        const hierarchy = {
            'Task': ['User Story'],
            'Bug': ['User Story'],
            'User Story': ['Feature'],
            'Feature': ['Epic'],
            'Epic': []
        };
        return hierarchy[childType] || [];
    }

    getBacklogKey(workItemType) {
        const mapping = {
            'Epic': 'epics',
            'Feature': 'features',
            'User Story': 'userStories',
            'Task': 'tasks',
            'Bug': 'bugs'
        };
        return mapping[workItemType];
    }

    async getEffortEstimate(workItemType) {
        if (workItemType === 'Task') {
            return await this.ask('Effort in hours: ');
        } else {
            console.log(`\\nFibonacci sequence: ${this.fibonacciSequence.join(', ')}`);
            const effort = await this.ask('Story points (Fibonacci): ');
            
            if (this.fibonacciSequence.includes(parseInt(effort))) {
                return effort;
            } else {
                console.log('⚠️  Please use Fibonacci sequence values');
                return await this.getEffortEstimate(workItemType);
            }
        }
    }

    async generateWorkItems(analysis) {
        const workItems = [];
        const timestamp = new Date().toISOString().split('T')[0];
        const workItemId = this.generateWorkItemId(analysis.workItemType);

        // Load appropriate template
        const template = await this.loadTemplate(analysis.workItemType);
        
        // Fill template with analysis data
        const workItemContent = template
            .replace(/\\{YYYY-MM-DD\\}/g, timestamp)
            .replace(/\\{YYYY\\}/g, new Date().getFullYear())
            .replace(/\\{###\\}/g, String(this.getNextSequenceNumber(analysis.workItemType)).padStart(3, '0'))
            .replace(/\\[.*?Title.*?\\]/g, this.extractTitle(analysis.content))
            .replace(/\\[.*?Description.*?\\]/g, this.sanitizeContent(analysis.content));

        // Save work item file
        const filename = `${workItemId}.md`;
        const workItemPath = path.join(this.workItemsPath, this.getWorkItemDirectory(analysis.workItemType), filename);
        await fs.writeFile(workItemPath, workItemContent);

        // Add to backlog
        const workItem = {
            id: workItemId,
            title: this.extractTitle(analysis.content),
            type: analysis.workItemType,
            state: 'New',
            effort: analysis.effort,
            priority: analysis.priority,
            parentId: analysis.parentId,
            filename: filename,
            created: timestamp
        };

        this.backlog[this.getBacklogKey(analysis.workItemType)].push(workItem);
        workItems.push(workItem);

        // Enforce no-orphan policy
        if (analysis.parentId === null && this.requiresParent(analysis.workItemType)) {
            console.log(`\\n⚠️  Work item ${workItemId} violates no-orphan policy!`);
            const createParent = await this.ask('Create parent work item? (y/n): ');
            
            if (createParent.toLowerCase() === 'y') {
                const parentAnalysis = await this.createParentWorkItem(analysis);
                const parentWorkItems = await this.generateWorkItems(parentAnalysis);
                workItems.push(...parentWorkItems);
                
                // Update child's parent reference
                workItem.parentId = parentWorkItems[0].id;
            }
        }

        return workItems;
    }

    requiresParent(workItemType) {
        return ['User Story', 'Feature', 'Task', 'Bug'].includes(workItemType);
    }

    async createParentWorkItem(childAnalysis) {
        const parentType = this.getValidParentTypes(childAnalysis.workItemType)[0];
        
        console.log(`\\n📝 Creating parent ${parentType} for ${childAnalysis.workItemType}`);
        
        const title = await this.ask(`Parent ${parentType} title: `);
        const description = await this.ask(`Parent ${parentType} description: `);
        
        return {
            filename: `generated-parent-${Date.now()}.md`,
            content: `${title}\\n\\n${description}`,
            workItemType: parentType,
            parentId: null,
            effort: await this.getEffortEstimate(parentType),
            priority: childAnalysis.priority
        };
    }

    async loadTemplate(workItemType) {
        const templateMap = {
            'Epic': 'epic-template.md',
            'Feature': 'feature-template.md',
            'User Story': 'user-story-template.md',
            'Task': 'task-template.md',
            'Bug': 'bug-template.md'
        };
        
        const templatePath = path.join(this.templatesPath, templateMap[workItemType]);
        return await fs.readFile(templatePath, 'utf8');
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

    generateWorkItemId(workItemType) {
        const prefixMap = {
            'Epic': 'E',
            'Feature': 'F',
            'User Story': 'US',
            'Task': 'T',
            'Bug': 'B'
        };
        
        const year = new Date().getFullYear();
        const sequence = this.getNextSequenceNumber(workItemType);
        
        return `${prefixMap[workItemType]}-${year}-${String(sequence).padStart(3, '0')}`;
    }

    getNextSequenceNumber(workItemType) {
        const existing = this.backlog[this.getBacklogKey(workItemType)];
        return existing.length + 1;
    }

    extractTitle(content) {
        const lines = content.split('\\n');
        const firstLine = lines[0].trim();
        
        // Remove markdown headers
        return firstLine.replace(/^#+\\s*/, '').substring(0, 100);
    }

    sanitizeContent(content) {
        return content.substring(0, 500).replace(/\\[/g, '\\\\[').replace(/\\]/g, '\\\\]');
    }

    async generateSummaryReport() {
        console.log('\\n📊 Work Item Generation Summary');
        console.log('================================');
        
        Object.keys(this.backlog).forEach(key => {
            const count = this.backlog[key].length;
            const type = key.charAt(0).toUpperCase() + key.slice(1);
            console.log(`${type}: ${count}`);
        });

        // Check for orphans
        const orphans = this.findOrphans();
        if (orphans.length > 0) {
            console.log('\\n⚠️  Orphaned Work Items Found:');
            orphans.forEach(orphan => {
                console.log(`- ${orphan.id}: ${orphan.title}`);
            });
        } else {
            console.log('\\n✅ No orphaned work items (ADO compliance maintained)');
        }
    }

    findOrphans() {
        const orphans = [];
        
        ['userStories', 'features', 'tasks', 'bugs'].forEach(key => {
            this.backlog[key].forEach(item => {
                if (!item.parentId && this.requiresParent(item.type)) {
                    orphans.push(item);
                }
            });
        });
        
        return orphans;
    }

    async ask(question) {
        return new Promise((resolve) => {
            this.rl.question(question, (answer) => {
                resolve(answer.trim());
            });
        });
    }

    close() {
        this.rl.close();
    }
}

// Main execution
async function main() {
    const generator = new WorkItemGenerator();
    
    try {
        await generator.initialize();
    } catch (error) {
        console.error('❌ Fatal error:', error.message);
    } finally {
        generator.close();
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = WorkItemGenerator;
