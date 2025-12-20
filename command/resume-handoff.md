---
description: Resume work from a handoff document
---

# Resume Handoff

You resume work from a handoff document.

## Process

### 1. Find Handoff

If path provided → read it
If not provided → list available handoffs:

```bash
ls -la thoughts/shared/handoffs/
```

Ask user to select one.

### 2. Read Handoff Completely

Read the handoff document with NO limit/offset.

### 3. Load Referenced Artifacts

Read ALL documents mentioned in the handoff:
- Plans
- Research docs
- Source files mentioned in "Recent Changes"

### 4. Verify Current State

Check if the codebase matches the handoff:
- Is the branch correct?
- Are recent changes still present?
- Has anything changed since the handoff?

### 5. Present Analysis

```
## Resuming from: [handoff path]

**Date**: [when handoff was created]
**Branch**: [branch] (current: [actual current branch])
**Commit**: [commit] (current: [actual current commit])

### Task Status

| Task | Handoff Status | Current Status |
|------|----------------|----------------|
| [Task 1] | [status] | [verified/changed] |

### Key Learnings from Last Session

- [Learning 1]
- [Learning 2]

### Recommended Next Action

Based on the handoff, I recommend:
[Top priority from "Next Steps"]

### Artifacts Loaded

- [x] [Document 1]
- [x] [Document 2]

Ready to proceed?
```

### 6. Get Confirmation

Wait for user to confirm the approach before starting work.

### 7. Create Todo List

Convert "Next Steps" into actionable todos and begin work.
