# COMMIT RULES & REQUIREMENTS

## CORE COMMIT PRINCIPLES

### Cannot Commit Without Human Confirmation
- **ABSOLUTE RULE**: No commits without explicit human approval
- Must follow the 4-step process in CRITICAL-WORKFLOW.md
- Human must verify both visual and code changes

### Commit Frequency Guidelines
- **Primary Trigger**: When 10+ files changed AND website works → commit immediately
- **Project Transition Trigger**: When switching projects AND changes work → commit regardless of file count
- **Purpose**: Keep changes manageable and reviewable
- **Avoid**: Accumulating massive changesets or losing working changes during project switches

### Mass Commit Prevention
- **Never commit 60+ files** in a single commit
- **Break down large changes** into logical, related chunks
- **Each commit should represent** a coherent set of changes

---

## COMMIT MESSAGE STANDARDS

### Required Format
```
Brief Descriptive Title (50 chars max)

Detailed Explanation:
- What was changed and why
- Key features or fixes implemented  
- Reference to approval process completed
- Any breaking changes or migration notes
- Testing/verification completed

Technical Implementation:
- Build/deploy status (if applicable)
- Performance impact (if any)
- Browser compatibility notes (if relevant)
```

### Good Commit Message Example
```
Enhanced About Page Interactive Values Section

Core Changes:
- Restructured About page with services-style interactive Values Explorer
- Added mobile-responsive values cards with expandable details
- Enhanced component architecture with proper CSS separation

Technical Implementation:
- Successfully built and deployed per Rule 1 requirements
- Human approval received after visual/code review
- All changes tested and verified working
- Maintained backwards compatibility

This commit delivers enhanced user experience with better mobile responsiveness.
```

---

## PRE-COMMIT VERIFICATION

### Technical Checks
- [ ] Code builds without errors (`npm run build`)
- [ ] Website functions correctly after changes
- [ ] No broken links or missing assets
- [ ] Mobile responsiveness maintained

### Process Checks  
- [ ] Human has seen visual changes
- [ ] Human has reviewed code changes
- [ ] Explicit approval received
- [ ] Commit message is detailed and clear

### Quality Checks
- [ ] Changes align with user story requirements
- [ ] Code follows established patterns
- [ ] No unnecessary files included
- [ ] Proper file organization maintained

---

## DEPLOYMENT SEQUENCE RULES

### CRITICAL DEPLOYMENT PROCESS
**MANDATORY SEQUENCE**: Commit → Build → Deploy

#### Required Steps:
1. **COMMIT FIRST**: `git add . && git commit -m "message"`
2. **BUILD EXPLICITLY**: `npm run build` (verify build success)
3. **DEPLOY LAST**: `npm run deploy`

#### Why This Sequence Matters:
- Ensures latest code changes are in the build
- Prevents deployment of stale/cached versions
- Guarantees production matches committed code
- Provides clear failure points for debugging

#### Common Mistake:
- ❌ **WRONG**: Direct `npm run deploy` without explicit build
- ✅ **CORRECT**: Commit → `npm run build` → `npm run deploy`

#### Exception Handling:
- If build fails → fix issues → commit → build → deploy
- If deploy fails → investigate → rebuild → deploy
- Never skip the build step even if predeploy scripts exist

---

## SPECIAL CIRCUMSTANCES

### Emergency Fixes
- Still require human approval
- Can be fast-tracked with clear explanation
- Must include "EMERGENCY FIX" in commit title

### Hotfixes
- Follow same 4-step process
- Prioritize human communication
- Document the urgency and impact

### Experimental Changes
- Create feature branches when possible
- Clear communication about experimental nature
- Easy rollback plan documented

### Project Transition Protocol
- **Rule**: When switching to another project AND there are changes → COMMIT if they work
- **Quality Check**: Verify all changes function properly before committing
- **Failure Protocol**: If changes don't work → revert to last working commit
- **Purpose**: Prevent losing functional work during project context switching
- **Applies to**: Any file count under 10 when transitioning between work areas

---

## COMMON COMMIT MISTAKES TO AVOID

1. **Committing without showing changes** → Always show visual + code
2. **Assuming implied approval** → Wait for explicit "yes"
3. **Vague commit messages** → Be specific and detailed
4. **Skipping build/deploy** → Check core files first
5. **Massive uncommitted changes** → Commit at 10+ files
6. **Including unrelated changes** → Keep commits focused

---

**Remember: Good commit practices protect the project and build trust with your human collaborator**
