---
description: Create handoff document for session continuity
---

# Create Handoff

You create a handoff document to transfer context to a future session.

## When to Use

- Hitting context limits
- Ending work session
- Handing off to another person/agent

## Process

### 1. Gather Context

Review:
- What tasks were you working on?
- What did you learn?
- What changed?
- What's next?

### 2. Write Handoff

Create: `thoughts/shared/handoffs/YYYY-MM-DD_HH-MM-SS_description.md`

```markdown
---
date: [ISO datetime with timezone]
branch: [current branch]
commit: [current commit hash]
status: complete
---

# Handoff: [Brief Description]

## Tasks

| Task | Status |
|------|--------|
| [Task 1] | completed / in-progress / planned |
| [Task 2] | completed / in-progress / planned |

## Current Phase

If working from a plan: `thoughts/shared/plans/YYYY-MM-DD-name.md`
Current phase: [N] - [Name]
Checkboxes completed through: [description]

## Recent Changes

- `path/to/file.ext:45` - What changed
- `path/to/another.ext:67-89` - What changed

## Learnings

Key things discovered during this session:
- [Pattern found]
- [Gotcha encountered]
- [Decision made and why]

## Artifacts

Documents created or updated:
- `thoughts/shared/research/...`
- `thoughts/shared/plans/...`

## Next Steps

1. [Most important next action]
2. [Second priority]
3. [Third priority]

## Notes

[Anything else relevant for the next session]
```

### 3. Confirm

Show the handoff path and a brief summary:

```
Handoff created: thoughts/shared/handoffs/YYYY-MM-DD_HH-MM-SS_description.md

Summary:
- Tasks: [X completed, Y in-progress]
- Next: [Top priority action]

To resume: /resume-handoff [path]
```
