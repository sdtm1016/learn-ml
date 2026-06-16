# OpenSpec Explore CLI Reference

## Core Commands

### `openspec list`

Check what changes exist at the start of an exploration session.

```bash
openspec list --json
```

**Output fields:**

| Field | Type | Description |
|-------|------|-------------|
| `changes` | array | List of changes |
| `changes[].name` | string | Change name |
| `changes[].schema` | string | Schema name |
| `changes[].status` | string | Change status |

### `openspec status`

Get detailed status of a specific change (when relevant to exploration).

```bash
openspec status --change "<name>" --json
```

## Read-Only Operations

Explore mode is strictly read-only. Permitted operations:

| Operation | Allowed | Example |
|-----------|---------|---------|
| Read files | ✓ | Read existing code, specs, designs |
| Search codebase | ✓ | Grep, glob, code search |
| Run read-only CLI commands | ✓ | `openspec list`, `openspec status` |
| Create OpenSpec artifacts | ✓ | If user asks to capture insights |
| Write application code | ✗ | Never implement features |
| Modify source files | ✗ | Never change production code |

## Change Artifact Paths

When referencing an existing change during exploration:

| Artifact | Path |
|----------|------|
| Proposal | `openspec/changes/<name>/proposal.md` |
| Design | `openspec/changes/<name>/design.md` |
| Tasks | `openspec/changes/<name>/tasks.md` |
| Delta Specs | `openspec/changes/<name>/specs/<capability>/spec.md` |
| Main Specs | `openspec/specs/<capability>/spec.md` |

## Capture Decision Points

When exploration leads to decisions, offer to capture them:

| Insight Type | Where to Capture |
|--------------|-----------------|
| New requirement discovered | `specs/<capability>/spec.md` |
| Requirement changed | `specs/<capability>/spec.md` |
| Design decision made | `design.md` |
| Scope changed | `proposal.md` |
| New work identified | `tasks.md` |
| Assumption invalidated | Relevant artifact |
