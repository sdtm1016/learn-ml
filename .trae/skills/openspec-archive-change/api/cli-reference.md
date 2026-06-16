# OpenSpec Archive CLI Reference

## Core Commands

### `openspec list`

List all changes (used to select which change to archive).

```bash
openspec list --json
```

**Output fields:**

| Field | Type | Description |
|-------|------|-------------|
| `changes` | array | List of changes |
| `changes[].name` | string | Change name |
| `changes[].schema` | string | Schema name |
| `changes[].status` | string | Change status (active/archived) |

### `openspec status`

Check artifact completion status for a change.

```bash
openspec status --change "<name>" --json
```

**Output fields:**

| Field | Type | Description |
|-------|------|-------------|
| `schemaName` | string | The workflow schema being used |
| `artifacts` | array | List of artifacts with status |
| `artifacts[].id` | string | Artifact identifier |
| `artifacts[].status` | string | One of: `ready`, `blocked`, `done` |

## Directory Structure

### Active Changes

```
openspec/changes/<name>/
├── .openspec.yaml
├── proposal.md
├── design.md
├── tasks.md
└── specs/
    └── <capability>/
        └── spec.md
```

### Archived Changes

```
openspec/changes/archive/
└── YYYY-MM-DD-<name>/
    ├── .openspec.yaml
    ├── proposal.md
    ├── design.md
    ├── tasks.md
    └── specs/
        └── <capability>/
            └── spec.md
```

## Delta Spec Paths

| Path | Description |
|------|-------------|
| `openspec/changes/<name>/specs/` | Delta specs for the change |
| `openspec/specs/<capability>/spec.md` | Main (target) specs |

## Archive Naming Convention

Format: `YYYY-MM-DD-<change-name>`

- Date is the archive date (today)
- Change name is preserved as-is
- If a name collision occurs, the archive fails with a suggestion to rename

## File Operations

### Create Archive Directory

```bash
mkdir -p openspec/changes/archive
```

### Move Change to Archive

```bash
mv openspec/changes/<name> openspec/changes/archive/YYYY-MM-DD-<name>
```

The `.openspec.yaml` file moves with the directory automatically.
