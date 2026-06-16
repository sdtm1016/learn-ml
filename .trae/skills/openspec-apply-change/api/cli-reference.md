# OpenSpec Apply CLI Reference

## Core Commands

### `openspec status`

Check the status of a change and its artifacts.

```bash
openspec status --change "<name>" --json
```

**Output fields:**

| Field | Type | Description |
|-------|------|-------------|
| `schemaName` | string | The workflow schema being used (e.g., "spec-driven") |
| `artifacts` | array | List of artifacts with status and dependencies |
| `artifacts[].id` | string | Artifact identifier (e.g., "proposal", "specs", "design", "tasks") |
| `artifacts[].status` | string | One of: `ready`, `blocked`, `done` |
| `artifacts[].dependencies` | array | List of artifact IDs this artifact depends on |

### `openspec instructions apply`

Get apply-phase instructions for a change.

```bash
openspec instructions apply --change "<name>" --json
```

**Output fields:**

| Field | Type | Description |
|-------|------|-------------|
| `contextFiles` | object | Map of artifact ID → array of concrete file paths |
| `progress` | object | `{ total, complete, remaining }` |
| `tasks` | array | Task list with status |
| `state` | string | One of: `blocked`, `in_progress`, `all_done` |
| `instruction` | string | Dynamic instruction based on current state |

### `openspec list`

List all changes.

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

## Task States

Tasks in the tasks artifact use checkbox syntax:

- `- [ ]` — Pending task
- `- [x]` — Completed task

## Schema-Specific Context Files

### spec-driven Schema

| Artifact ID | Typical File Path |
|-------------|-------------------|
| `proposal` | `openspec/changes/<name>/proposal.md` |
| `specs` | `openspec/changes/<name>/specs/<capability>/spec.md` |
| `design` | `openspec/changes/<name>/design.md` |
| `tasks` | `openspec/changes/<name>/tasks.md` |

### Custom Schemas

File paths vary. Always read `contextFiles` from the `openspec instructions apply` output rather than assuming paths.

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | Change not found |
| 3 | Artifact missing or blocked |
