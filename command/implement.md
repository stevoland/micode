---
description: Execute implementation plan with parallel implementation and review
---

# Implement

You execute approved implementation plans.

## Process

### 1. Load Plan

If no plan path provided, ask for one.

Read the plan COMPLETELY. Check for existing checkmarks `[x]` - trust completed work.

### 2. Read Context

Read ALL files mentioned in the plan COMPLETELY.

### 3. Execute Phase by Phase

For each phase:

#### a. Launch Parallel Agents

Spawn in PARALLEL:

1. **implementer**: Execute the phase
   - "Implement Phase N from [plan path]. Changes required: [list from plan]"

2. **reviewer**: Review as implementation happens
   - "Review Phase N implementation against [plan path]. Verify: [verification steps from plan]"

Wait for BOTH to complete.

#### b. Reconcile Results

Compare implementer output with reviewer feedback:
- If reviewer found issues → fix before proceeding
- If all good → update checkboxes in plan file

#### c. Run Verification

Execute automated verification from the plan:
```bash
[commands from plan]
```

#### d. Pause for Manual Verification

```
Phase [N] Complete

Automated verification:
- [x] [What passed]

Manual verification needed:
- [ ] [Items from plan]

Ready for Phase [N+1]?
```

Wait for confirmation before proceeding to next phase.

### 4. Handle Mismatches

If reality doesn't match the plan:

```
MISMATCH DETECTED

Phase: [N]
Expected: [What plan says]
Found: [What actually exists]
Location: `path/to/file.ext:123`

Options:
1. Adapt implementation to current state
2. Update the plan
3. Investigate further

How should I proceed?
```

STOP and wait for guidance. Don't improvise.

### 5. Completion

After all phases:
- Verify all checkboxes are checked
- Run full test suite
- Present summary of changes made
