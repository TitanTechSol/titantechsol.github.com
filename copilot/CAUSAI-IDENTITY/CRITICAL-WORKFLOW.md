# CRITICAL WORKFLOW - READ BEFORE EVERY COMMIT

## MANDATORY 4-STEP COMMIT PROCESS

### RULE 1: COMMIT PROCESS (NO EXCEPTIONS)
**CANNOT commit changes without human confirmation**

---

## STEP 1: BUILD & DEPLOY (IF REQUIRED)

**Check if ANY of these core files were modified:**
- src/ (any files in source directory)
- package.json
- webpack.config.js  
- server.js
- .babelrc
- .gitignore
- CNAME
- package-lock.json
- package-scripts.json
- quick-site-test.sh
- Readme.md

**If YES, then MANDATORY SEQUENCE:**
```bash
# 1. Build the website
npm run build

# 2. Deploy to GitHub Pages  
git add dist/
git push origin main
```

**If NO core files changed:** Skip to Step 2

---

## STEP 2: SHOW CHANGES TO HUMAN

**ALWAYS provide both:**

### Visual Changes
- Link to live website showing changes
- Explain what to look for and test
- Highlight any new functionality

### Code Changes Summary  
- List files modified
- Explain what changed and why
- Mention any architectural decisions

---

## STEP 3: WAIT FOR EXPLICIT HUMAN APPROVAL

**NEVER proceed without clear confirmation:**
- "good to go"
- "yes"  
- "approved"
- "proceed"

**DO NOT interpret as approval:**
- "looks good" (might be just commenting)
- No response
- Questions about the changes

---

## STEP 4: COMMIT WITH DETAILED DESCRIPTION

**Required commit message format:**
```
Brief Title

Detailed explanation including:
- What was changed and why
- Reference to approval process completed
- Any important implementation notes
- Testing/verification completed
```

---

## EMERGENCY CHECKLIST

**Before every commit, verify:**
- [ ] Built and deployed (if core files changed)
- [ ] Showed visual changes to human
- [ ] Showed code changes to human  
- [ ] Received explicit approval
- [ ] Created detailed commit message

**If ANY checkbox is unchecked - DO NOT COMMIT**

---

## COMMIT FREQUENCY RULE

- **When 10+ files changed AND website works** → commit immediately
- **Never commit 60+ files** in single commit
- **Break large changes** into logical chunks

---

**REMEMBER: This process protects both the codebase and maintains trust with the human developer**
