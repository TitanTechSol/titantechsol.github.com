# SOW-Focused Behavior: Scope Definition & Estimation

## Behavior Overview

**Purpose**: Comprehensive SOW scope definition with accurate effort estimation and risk assessment
**Context Sources**: Business objectives, technical requirements, team capabilities, market constraints
**Output**: Detailed scope document with timeline, effort estimates, and risk mitigation plans

*This behavior consolidates expertise from: Project Manager Agent, Architect Agent, Sales & Business Development Agent, and Analytics & ROI Agent*

## Core Capabilities

### Scope Definition
- Comprehensive requirement analysis and gap identification
- Clear deliverable definition with acceptance criteria
- Scope boundary establishment (inclusions/exclusions)
- Stakeholder alignment and expectation management
- Integration planning with existing systems

### Effort Estimation
- Multi-factor estimation using historical data and complexity analysis
- Resource allocation and skill requirement mapping
- Timeline development with critical path identification
- Buffer calculation for uncertainty and risk factors
- Cost modeling with investment breakdown

### Risk Assessment
- Technical risk identification and impact analysis
- Business risk evaluation (market, competition, regulatory)
- Resource and timeline risk assessment
- Mitigation strategy development and contingency planning
- Early warning indicator establishment

## Behavior Prompts

### 1. Initial Scope Discovery

```markdown
# Comprehensive Scope Discovery Prompt

Given the following business context:
- Client: [Company name and industry]
- Business Objectives: [Primary goals and success metrics]
- Current State: [Existing systems and processes]
- Desired Outcomes: [Target future state]
- Constraints: [Budget, timeline, technical, regulatory]
- Success Metrics: [How success will be measured]

And technical context:
- Technology Environment: [Current tech stack and infrastructure]
- Integration Requirements: [Systems that need to connect]
- Performance Needs: [Speed, capacity, availability requirements]
- Security/Compliance: [Data protection and regulatory needs]
- Team Capabilities: [Available skills and expertise]

Perform comprehensive scope analysis:

1. **Scope Breakdown Structure**
   - Major deliverables and work packages
   - Sub-components with clear boundaries
   - Integration touchpoints and dependencies
   - Quality gates and validation points

2. **Gap Analysis**
   - Missing requirements or unstated assumptions
   - Potential scope expansion areas
   - Integration challenges and considerations
   - Compliance and regulatory requirements

3. **Boundary Definition**
   - Explicitly included deliverables and features
   - Explicitly excluded items and future phases
   - Client vs. vendor responsibilities
   - Third-party dependencies and assumptions

4. **Risk Identification**
   - Technical risks and complexity factors
   - Business risks and market considerations
   - Resource risks and skill requirements
   - Timeline risks and external dependencies

Format as structured scope document with clear sections and actionable recommendations.
```

### 2. Effort Estimation Analysis

```markdown
# Multi-Factor Estimation Prompt

For the defined scope:
[Insert scope breakdown structure]

With team context:
- Team Size: [Number and roles]
- Skill Levels: [Experience with relevant technologies]
- Availability: [Percentage allocation and timeline]
- Historical Velocity: [Previous project performance data]

Perform comprehensive effort estimation:

1. **Work Package Estimation**
   - Break down each deliverable into estimable tasks
   - Apply appropriate estimation techniques (story points, hours, t-shirt sizing)
   - Consider complexity factors and technical debt
   - Include testing, documentation, and deployment effort

2. **Resource Analysis**
   - Map required skills to available team members
   - Identify skill gaps and training needs
   - Plan for knowledge transfer and ramp-up time
   - Consider team productivity factors and collaboration overhead

3. **Timeline Development**
   - Create realistic project schedule with dependencies
   - Identify critical path and potential bottlenecks
   - Plan for iterative delivery and feedback cycles
   - Include buffer time for uncertainty and risk factors

4. **Confidence Assessment**
   - Provide confidence levels for each estimate (high/medium/low)
   - Identify areas of highest uncertainty
   - Recommend additional discovery or prototyping
   - Suggest phased delivery to reduce risk

5. **Cost Modeling**
   - Calculate resource costs by role and timeline
   - Include infrastructure and tool costs
   - Factor in overhead and project management costs
   - Provide cost breakdown by phase and deliverable

Provide estimates in multiple formats: optimistic, realistic, pessimistic scenarios.
```

### 3. Risk Assessment & Mitigation

```markdown
# Comprehensive Risk Assessment Prompt

For the project scope and estimates:
[Insert scope and estimation details]

Analyze project risks across all dimensions:

1. **Technical Risks**
   - Technology complexity and maturity
   - Integration challenges and dependencies
   - Performance and scalability concerns
   - Security and compliance requirements
   - Architecture and design risks

2. **Business Risks**
   - Market conditions and competitive factors
   - Regulatory changes and compliance issues
   - Client organizational changes
   - Budget and funding stability
   - Business value realization risks

3. **Execution Risks**
   - Team capability and availability
   - Timeline and scheduling conflicts
   - Resource allocation and competition
   - Communication and coordination challenges
   - Quality and delivery risks

4. **External Risks**
   - Third-party dependencies and reliability
   - Vendor and supplier risks
   - Infrastructure and platform changes
   - Economic and market conditions
   - Force majeure and unexpected events

For each identified risk, provide:
- Probability assessment (High/Medium/Low)
- Impact assessment (High/Medium/Low)
- Risk score (Probability × Impact)
- Mitigation strategies and preventive measures
- Contingency plans for risk materialization
- Early warning indicators and monitoring approaches
- Risk owner and management responsibility

Prioritize risks by score and provide integrated risk management plan.
```

### 4. SOW Document Generation

```markdown
# SOW Document Generation Prompt

Based on the comprehensive analysis:
- Scope Definition: [Detailed scope breakdown]
- Effort Estimates: [Timeline and resource estimates]
- Risk Assessment: [Risk analysis and mitigation plans]

Generate a professional SOW document with:

1. **Executive Summary**
   - Project overview and business objectives
   - Key deliverables and success metrics
   - Investment summary and expected ROI
   - Timeline overview and major milestones

2. **Detailed Scope**
   - Work breakdown structure with deliverable descriptions
   - Acceptance criteria and quality standards
   - Integration requirements and dependencies
   - Assumptions and constraints

3. **Project Approach**
   - Methodology and development approach
   - Team structure and role definitions
   - Communication and collaboration processes
   - Quality assurance and validation approach

4. **Timeline & Milestones**
   - Detailed project schedule with phases
   - Critical milestones and decision points
   - Dependency management and sequencing
   - Buffer allocation and contingency time

5. **Investment & Terms**
   - Cost breakdown by phase and deliverable
   - Payment schedule and milestone-based billing
   - Change order procedures and pricing
   - Warranty and support provisions

6. **Risk Management**
   - Risk register with mitigation strategies
   - Contingency planning and escalation procedures
   - Success factors and critical dependencies
   - Performance monitoring and reporting

Format as professional document suitable for client presentation and contract execution.
```

## Quality Validation Framework

### Scope Validation Checklist
- [ ] **Business Alignment**: Scope supports stated business objectives
- [ ] **Completeness**: All necessary deliverables identified
- [ ] **Clarity**: Unambiguous descriptions and acceptance criteria
- [ ] **Boundaries**: Clear inclusions, exclusions, and assumptions
- [ ] **Feasibility**: Realistic given constraints and capabilities
- [ ] **Value**: Each deliverable provides measurable business value

### Estimation Validation Checklist
- [ ] **Methodology**: Appropriate estimation techniques applied
- [ ] **Historical Data**: Past project performance considered
- [ ] **Complexity**: Technical and business complexity factored
- [ ] **Resources**: Team capabilities and availability realistic
- [ ] **Dependencies**: External dependencies identified and planned
- [ ] **Confidence**: Uncertainty levels clearly communicated

### Risk Validation Checklist
- [ ] **Comprehensive**: All risk categories covered
- [ ] **Prioritized**: Risks ranked by probability and impact
- [ ] **Actionable**: Clear mitigation strategies defined
- [ ] **Monitored**: Early warning indicators established
- [ ] **Owned**: Risk management responsibilities assigned
- [ ] **Contingent**: Backup plans for critical risks

## Success Metrics

### Process Efficiency
- **SOW Development Time**: Time from initial request to approved SOW
- **Revision Cycles**: Number of iterations to reach approval
- **Stakeholder Satisfaction**: Client approval ratings for SOW quality
- **Accuracy**: Actual vs. estimated effort and timeline performance

### Business Outcomes
- **Win Rate**: Percentage of SOWs that result in signed contracts
- **Project Success**: On-time, on-budget delivery performance
- **Client Satisfaction**: Post-project client satisfaction scores
- **Profitability**: Project margin performance vs. estimates

### Quality Indicators
- **Scope Stability**: Percentage of projects delivered within original scope
- **Change Frequency**: Number of scope changes per project
- **Risk Realization**: Percentage of identified risks that materialized
- **Estimation Accuracy**: Variance between estimated and actual effort

## Integration with Existing Processes

### CRM Integration
- Link SOW development to opportunity management
- Track SOW status and client feedback
- Measure conversion rates and sales performance
- Integrate with proposal and contract management

### Project Management Integration
- Transfer approved SOW to project planning tools
- Create project templates from SOW structure
- Track actual vs. planned performance
- Feed lessons learned back into estimation models

### Client Collaboration
- Provide client access to SOW development progress
- Enable collaborative review and feedback
- Facilitate stakeholder approval processes
- Support change request management

---

*This behavior-based approach provides comprehensive SOW development capability while maintaining the valuable expertise from multiple agent roles.*
