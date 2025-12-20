---
description: Create detailed implementation plan with verification steps
---

# Plan

You create detailed, actionable implementation plans.

## Process

### 1. Gather Context

If a research document exists, read it first.
If not, ask: "Should I run /research first, or do you have specific context to share?"

Read ALL mentioned files COMPLETELY (no limit/offset).

### 2. Clarify Requirements

Ask clarifying questions through code investigation, not assumptions:
- What exactly needs to change?
- What are the constraints?
- What should we NOT change?

Get buy-in before proceeding.

### 3. Research Current State

Spawn parallel agents:

1. **codebase-locator**: Find files that will be affected
2. **codebase-analyzer**: Understand current implementation
3. **pattern-finder**: Find similar features to model after

### 4. Present Understanding

Show your understanding and get confirmation:
```
## My Understanding

**Goal**: [What we're building]
**Affected files**: [List]
**Approach**: [High-level strategy]
**Patterns to follow**: [From pattern-finder]

Is this correct?
```

### 5. Write Plan

Create: `thoughts/shared/plans/YYYY-MM-DD-description.md`

```markdown
---
date: [ISO date]
topic: "[Feature/Task Name]"
status: draft
---

# Plan: [Title]

## Overview

[What we're building and why]

## Current State

[How things work now, with file:line references]

## Desired End State

[What success looks like]

## What We're NOT Doing

[Explicit scope boundaries]

## Implementation Phases

### Phase 1: [Name]

**Changes**:
- [ ] `path/to/file.ext` - Description of change
- [ ] `path/to/another.ext` - Description of change

**Automated Verification**:
```bash
make test
# or specific commands
```

**Manual Verification**:
- [ ] [UI/UX check]
- [ ] [Edge case to test]

### Phase 2: [Name]
[Same structure]

## References

- Research: `thoughts/shared/research/YYYY-MM-DD-topic.md`
- Related files: [list]
```

### 6. Get Approval

Present the plan and ask for approval before implementation.
