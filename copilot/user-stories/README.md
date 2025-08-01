# TitanTech Solutions Website Improvement - User Stories

This folder contains user stories for the TitanTech Solutions website improvement project. Each file corresponds to a specific area of enhancement with prioritized and sized stories.

## Naming Convention
Files follow the format: `P[priority]-[category]-[sequential ID]-[description].md`
- **P01, P02, etc.**: Priority level (lower number = higher priority)
- **Category Code**: Two-letter code representing the feature category
- **Sequential ID**: A unique identifier following these rules:
  - For parent stories: 5-digit number (e.g., "00001")
  - For child stories: Parent's 5-digit ID followed by a period and a 2-digit number (e.g., "00001.01", "00001.02")
- **Description**: Brief hyphenated description of the user story

### Examples:
- Parent story: `P01-AF-00001-blog-platform.md`
- Child stories: 
  - `P01-AF-00001.01-blog-infrastructure.md`
  - `P01-AF-00001.02-blog-enhancement.md`

## Category Codes
- **CE**: Content Enhancement
- **VD**: Visual Design
- **PO**: Performance Optimization
- **CM**: Content Management
- **CO**: Conversion Optimization
- **AF**: Additional Features
- **IN**: Integration Requirements
- **NP**: Next Phase Planning

## Story Point Scale
We use a modified Fibonacci sequence for estimation:
- **1**: Very small task (few hours)
- **2**: Small task (about a day)
- **3**: Medium task (2-3 days)
- **5**: Large task (about a week)
- **8**: Very large task (more than a week - consider breaking down)
- **13**: Too large, needs decomposition

## Sprint Planning Guidelines
- Maximum 20-25 points per two-week sprint
- Prioritize high-value, lower-effort stories first
- Ensure each sprint delivers tangible value
- Include at least one story from high-priority categories
