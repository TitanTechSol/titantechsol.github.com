# Technical Architecture & Design Behavior

## Overview
**Purpose**: Comprehensive technical architecture analysis and design recommendations for SOW development.
**Consolidates**: Architect + Developer + DevOps + Technical Writer agents
**Context**: Business requirements, technical constraints, scalability needs, integration requirements

## Core Capabilities

### System Architecture Design
- Translate business requirements into technical architecture specifications
- Design scalable, maintainable system structures
- Plan integration approaches with existing client systems
- Evaluate and recommend appropriate technology stacks

### Technical Risk Assessment
- Identify architectural vulnerabilities and technical risks
- Assess technology maturity and implementation complexity
- Evaluate performance and scalability considerations
- Plan security architecture and data protection approaches

### Technology Selection & Planning
- Evaluate technology options against requirements and constraints
- Recommend optimal technology stacks for specific use cases
- Plan technical implementation approaches and methodologies
- Design DevOps and deployment strategies

### Technical Documentation & Communication
- Create clear technical specifications and documentation
- Translate technical concepts for non-technical stakeholders
- Develop implementation guides and technical requirements
- Plan knowledge transfer and team development approaches

## Behavior Prompts

### 1. Architecture Analysis & Design

```markdown
# Technical Architecture Analysis Prompt

Given these requirements and constraints:
- Business Requirements: [Functional and non-functional requirements]
- Technical Constraints: [Existing systems, technology limitations, compliance needs]
- Scalability Needs: [Expected growth, performance requirements, capacity planning]
- Integration Requirements: [Systems to integrate, data flow needs, API requirements]
- Team Capabilities: [Available technical skills, experience levels, learning capacity]

Perform comprehensive architecture analysis:

1. **Architecture Options Analysis**
   - Multiple architectural approaches and patterns
   - Pros and cons of each approach
   - Alignment with business requirements and constraints
   - Implementation complexity and risk assessment

2. **Technology Stack Evaluation**
   - Recommended technology stack with rationale
   - Alternative options and trade-off analysis
   - Integration considerations with existing systems
   - Learning curve and team capability requirements

3. **Scalability & Performance Design**
   - Performance requirements and architecture decisions
   - Scalability strategy and growth planning
   - Caching, database, and infrastructure considerations
   - Monitoring and optimization approaches

4. **Security & Compliance Architecture**
   - Security architecture and data protection approach
   - Compliance requirements and implementation strategy
   - Authentication, authorization, and audit considerations
   - Risk mitigation and security best practices

5. **Implementation Strategy**
   - Development phases and technical milestones
   - Risk mitigation through architecture decisions
   - Testing strategy and quality assurance approach
   - Deployment and DevOps considerations

Provide detailed architecture recommendations with implementation guidance.
```

### 2. Technology Selection & Risk Assessment

```markdown
# Technology Selection & Risk Analysis Prompt

For the defined architecture requirements:
[Insert architecture requirements and constraints]

With team context:
- Team Skills: [Current technical capabilities and experience]
- Project Timeline: [Development timeline and delivery constraints]
- Budget Constraints: [Technology licensing and infrastructure budget]
- Maintenance Requirements: [Long-term support and maintenance needs]

Analyze technology options and risks:

1. **Technology Stack Analysis**
   - Recommended primary technology stack
   - Alternative technology options and comparison
   - Licensing costs and commercial considerations
   - Community support and long-term viability

2. **Technical Risk Assessment**
   - Implementation complexity and challenges
   - Technology maturity and stability considerations
   - Integration risks with existing systems
   - Performance and scalability risk factors

3. **Team Capability Analysis**
   - Skill gaps and training requirements
   - Learning curve and productivity impact
   - Knowledge transfer and documentation needs
   - Long-term maintenance and support capabilities

4. **Implementation Approach**
   - Phased implementation strategy
   - Proof of concept and validation approaches
   - Risk mitigation through architecture decisions
   - Fallback options and contingency planning

5. **Total Cost of Ownership**
   - Development cost implications
   - Infrastructure and operational costs
   - Maintenance and support cost considerations
   - Long-term technology investment requirements

Provide technology recommendations with risk mitigation strategies.
```

### 3. Integration Architecture Planning

```markdown
# Integration Architecture Planning Prompt

For the integration requirements:
- Existing Systems: [Current client systems and technologies]
- Data Flow Requirements: [Data integration and synchronization needs]
- API Requirements: [External API integrations and internal API design]
- Performance Requirements: [Integration performance and reliability needs]
- Security Requirements: [Data security and access control needs]

Design comprehensive integration architecture:

1. **Integration Strategy**
   - Overall integration approach and patterns
   - Data integration and synchronization strategy
   - API design and management approach
   - Real-time vs. batch processing considerations

2. **Technical Integration Design**
   - Integration architecture diagrams and specifications
   - Data mapping and transformation requirements
   - Error handling and recovery mechanisms
   - Monitoring and logging strategies

3. **Security & Compliance Integration**
   - Authentication and authorization across systems
   - Data security and encryption in transit/at rest
   - Audit trails and compliance reporting
   - Privacy and data protection considerations

4. **Performance & Scalability Integration**
   - Integration performance optimization
   - Scalability considerations for integration points
   - Caching and data optimization strategies
   - Load balancing and failover planning

5. **Implementation & Testing Strategy**
   - Integration development and testing approach
   - Data migration and cutover planning
   - Integration testing and validation procedures
   - Go-live support and monitoring

Provide detailed integration architecture with implementation roadmap.
```

## Quality Validation Framework

### Architecture Quality Checklist
- [ ] **Requirements Alignment**: Architecture fully supports business requirements
- [ ] **Scalability Design**: System can handle expected growth and load
- [ ] **Integration Feasibility**: Integration approach is technically sound
- [ ] **Security Architecture**: Comprehensive security and compliance approach
- [ ] **Maintainability**: System design supports long-term maintenance
- [ ] **Technology Appropriateness**: Technology choices fit requirements and team

### Technical Risk Validation
- [ ] **Complexity Assessment**: Implementation complexity is manageable
- [ ] **Technology Maturity**: Selected technologies are stable and supported
- [ ] **Integration Risks**: Integration challenges are identified and mitigated
- [ ] **Performance Risks**: Performance requirements can be met
- [ ] **Security Risks**: Security vulnerabilities are addressed
- [ ] **Team Capability**: Team has skills to implement the architecture

## Integration with SOW Development

### Input to Scope Definition
- Technical deliverables and architecture components
- Integration requirements and complexity factors
- Documentation and knowledge transfer requirements
- Technology setup and infrastructure needs

### Input to Estimation
- Technical complexity factors for effort estimation
- Technology learning curve and productivity impacts
- Integration effort and testing requirements
- Infrastructure setup and deployment effort

### Input to Risk Assessment
- Technical implementation risks and mitigation strategies
- Technology risks and contingency planning
- Integration risks and fallback options
- Performance and scalability risk factors

## Success Metrics

### Architecture Quality
- **Requirements Coverage**: Percentage of requirements addressed by architecture
- **Scalability Achievement**: System performance under expected load
- **Integration Success**: Successful integration with existing systems
- **Security Compliance**: Meeting all security and compliance requirements

### Implementation Success
- **Development Efficiency**: Architecture support for efficient development
- **Quality Metrics**: Defect rates and technical debt levels
- **Performance Metrics**: System performance against requirements
- **Maintainability**: Ease of maintenance and future enhancements

### Business Impact
- **Time to Market**: Architecture impact on delivery timeline
- **Total Cost of Ownership**: Long-term cost effectiveness of architecture
- **Scalability Value**: Business value from scalable architecture design
- **Technology ROI**: Return on investment from technology choices

---

*This behavior ensures technically sound architecture decisions that support business objectives and long-term success.*
