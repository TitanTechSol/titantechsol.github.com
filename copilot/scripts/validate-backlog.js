#!/usr/bin/env node

/**
 * Backlog Validator
 * 
 * Validates the work item backlog against ADO compliance rules and best practices.
 */

const fs = require('fs').promises;
const path = require('path');

class BacklogValidator {
    constructor() {
        this.basePath = path.resolve(__dirname, '..');
        this.workItemsPath = path.join(this.basePath, 'work-items');
        this.fibonacciSequence = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];
        this.validStates = ['New', 'Active', 'Resolved', 'Closed', 'Removed'];
        this.validPriorities = ['1-Critical', '2-High', '3-Medium', '4-Low'];
        
        this.validationResults = {
            passed: [],
            warnings: [],
            errors: []
        };
    }

    async validate() {
        console.log('🔍 ADO Backlog Validation');
        console.log('=========================\\n');

        try {
            const backlog = await this.loadBacklog();
            
            await this.validateHierarchy(backlog);
            await this.validateEstimations(backlog);
            await this.validateStates(backlog);
            await this.validateOrphans(backlog);
            await this.validateDependencies(backlog);
            
            this.generateReport();
            
        } catch (error) {
            console.error('❌ Validation failed:', error.message);
        }
    }

    async loadBacklog() {
        const backlogPath = path.join(this.workItemsPath, 'backlog.json');
        const content = await fs.readFile(backlogPath, 'utf8');
        return JSON.parse(content);
    }

    async validateHierarchy(backlog) {
        console.log('📋 Validating work item hierarchy...');
        
        const allWorkItems = this.getAllWorkItems(backlog);
        const workItemMap = new Map();
        
        // Build work item map
        allWorkItems.forEach(item => {
            workItemMap.set(item.id, item);
        });

        // Validate parent-child relationships
        allWorkItems.forEach(item => {
            if (item.parentId) {
                const parent = workItemMap.get(item.parentId);
                if (!parent) {
                    this.validationResults.errors.push({
                        type: 'Missing Parent',
                        workItem: item.id,
                        message: `Parent ${item.parentId} not found`
                    });
                } else {
                    // Validate hierarchy rules
                    if (!this.isValidParentChild(parent.type, item.type)) {
                        this.validationResults.errors.push({
                            type: 'Invalid Hierarchy',
                            workItem: item.id,
                            message: `${item.type} cannot be child of ${parent.type}`
                        });
                    }
                }
            }
        });

        this.validationResults.passed.push('Hierarchy validation completed');
    }

    async validateEstimations(backlog) {
        console.log('📏 Validating estimations...');

        const allWorkItems = this.getAllWorkItems(backlog);
        
        allWorkItems.forEach(item => {
            if (item.type !== 'Task' && item.effort) {
                const effort = parseInt(item.effort);
                if (!this.fibonacciSequence.includes(effort)) {
                    this.validationResults.warnings.push({
                        type: 'Non-Fibonacci Estimation',
                        workItem: item.id,
                        message: `Effort ${item.effort} not in Fibonacci sequence`
                    });
                }
            }
            
            // Check for missing estimations
            if (!item.effort && item.state !== 'New') {
                this.validationResults.errors.push({
                    type: 'Missing Estimation',
                    workItem: item.id,
                    message: `Work item missing effort estimation`
                });
            }
        });

        this.validationResults.passed.push('Estimation validation completed');
    }

    async validateStates(backlog) {
        console.log('🔄 Validating states...');

        const allWorkItems = this.getAllWorkItems(backlog);
        
        allWorkItems.forEach(item => {
            if (!this.validStates.includes(item.state)) {
                this.validationResults.errors.push({
                    type: 'Invalid State',
                    workItem: item.id,
                    message: `Invalid state: ${item.state}`
                });
            }
        });

        this.validationResults.passed.push('State validation completed');
    }

    async validateOrphans(backlog) {
        console.log('👶 Checking for orphaned work items...');

        const requiresParent = ['Feature', 'User Story', 'Task', 'Bug'];
        let orphanCount = 0;

        Object.keys(backlog).forEach(key => {
            if (key === 'metadata') return;
            
            backlog[key].forEach(item => {
                if (requiresParent.includes(item.type) && !item.parentId) {
                    this.validationResults.errors.push({
                        type: 'Orphaned Work Item',
                        workItem: item.id,
                        message: `${item.type} has no parent (violates no-orphan policy)`
                    });
                    orphanCount++;
                }
            });
        });

        if (orphanCount === 0) {
            this.validationResults.passed.push('No orphaned work items found (ADO compliance maintained)');
        }
    }

    async validateDependencies(backlog) {
        console.log('🔗 Validating dependencies...');

        const allWorkItems = this.getAllWorkItems(backlog);
        const workItemMap = new Map();
        
        allWorkItems.forEach(item => {
            workItemMap.set(item.id, item);
        });

        // Check for circular dependencies
        allWorkItems.forEach(item => {
            if (item.parentId && this.hasCircularDependency(item, workItemMap)) {
                this.validationResults.errors.push({
                    type: 'Circular Dependency',
                    workItem: item.id,
                    message: 'Circular parent-child relationship detected'
                });
            }
        });

        this.validationResults.passed.push('Dependency validation completed');
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

    isValidParentChild(parentType, childType) {
        const validRelationships = {
            'Epic': ['Feature'],
            'Feature': ['User Story'],
            'User Story': ['Task', 'Bug'],
            'Task': [],
            'Bug': []
        };
        
        return validRelationships[parentType]?.includes(childType) || false;
    }

    hasCircularDependency(item, workItemMap, visited = new Set()) {
        if (visited.has(item.id)) {
            return true;
        }
        
        if (!item.parentId) {
            return false;
        }
        
        visited.add(item.id);
        const parent = workItemMap.get(item.parentId);
        
        if (!parent) {
            return false;
        }
        
        return this.hasCircularDependency(parent, workItemMap, visited);
    }

    generateReport() {
        console.log('\\n📊 Validation Report');
        console.log('==================');
        
        console.log(`\\n✅ Passed Checks (${this.validationResults.passed.length}):`);
        this.validationResults.passed.forEach(item => {
            console.log(`  - ${item}`);
        });

        if (this.validationResults.warnings.length > 0) {
            console.log(`\\n⚠️  Warnings (${this.validationResults.warnings.length}):`);
            this.validationResults.warnings.forEach(warning => {
                console.log(`  - [${warning.workItem}] ${warning.type}: ${warning.message}`);
            });
        }

        if (this.validationResults.errors.length > 0) {
            console.log(`\\n❌ Errors (${this.validationResults.errors.length}):`);
            this.validationResults.errors.forEach(error => {
                console.log(`  - [${error.workItem}] ${error.type}: ${error.message}`);
            });
        }

        const isCompliant = this.validationResults.errors.length === 0;
        console.log(`\\n🎯 ADO Compliance: ${isCompliant ? '✅ COMPLIANT' : '❌ NON-COMPLIANT'}`);
        
        if (!isCompliant) {
            console.log('\\nPlease fix the errors above before proceeding with ADO migration.');
        }
    }
}

// Main execution
async function main() {
    const validator = new BacklogValidator();
    await validator.validate();
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = BacklogValidator;
