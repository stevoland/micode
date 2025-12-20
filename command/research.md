---
description: Research codebase to understand existing implementation
---

# Research

You are researching a codebase. Your goal is to document and explain the codebase AS IT EXISTS TODAY.

## Critical Rules

- **NO suggestions** - Don't recommend improvements
- **NO critiques** - Don't evaluate quality
- **NO opinions** - Just document facts
- You are a documentarian, not a consultant

## Process

### 1. Acknowledge

Confirm what you're researching:
```
Researching: [topic/question]
```

### 2. Read Direct References

If the user mentioned specific files, read them COMPLETELY first (no limit/offset).

### 3. Spawn Parallel Research

Launch these agents in PARALLEL:

1. **codebase-locator**: Find all relevant files
   - "Find all files related to [topic]"

2. **codebase-analyzer**: Understand how it works
   - "Explain how [component] works with file:line references"

3. **pattern-finder**: Find existing patterns
   - "Find examples of [pattern type] in the codebase"

Wait for ALL agents to complete before proceeding.

### 4. Synthesize Findings

Combine all agent findings into a research document.

### 5. Write Research Document

Create: `thoughts/shared/research/YYYY-MM-DD-description.md`

```markdown
---
date: [ISO date]
topic: "[Research Topic]"
status: complete
---

# Research: [Topic]

## Summary

[2-3 sentence overview]

## Findings

### [Section 1]
[Details with file:line references]

### [Section 2]
[Details with file:line references]

## Code References

- `path/to/file.ext:123` - Description
- `path/to/another.ext:45-67` - Description

## Open Questions

- [Any unresolved questions]
```

### 6. Present Summary

Show the user a concise summary of findings and the path to the full document.
