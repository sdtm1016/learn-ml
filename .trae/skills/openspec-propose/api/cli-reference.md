# OpenSpec Propose CLI Reference

## Core Commands

### `openspec new change`

Create a new change directory with scaffolding.

```bash
openspec new change "<name>"
```

**Behavior:**
- Creates directory at `openspec/changes/<name>/`
- Generates `.openspec.yaml` configuration file
- Name must be kebab-case (e.g., `add-user-auth`)

**Output:** Path to the created change directory.

### `openspec status`

Get artifact build order and dependencies.

```bash
openspec status --change "<name>" --json
```

**Output fields:**

| Field | Type | Description |
|-------|------|-------------|
| `schemaName` | string | The workflow schema (e.g., "spec-driven") |
| `applyRequires` | array | Artifact IDs required before implementation |
| `artifacts` | array | All artifacts with status and dependencies |
| `artifacts[].id` | string | Artifact identifier |
| `artifacts[].status` | string | One of: `ready`, `blocked`, `done` |
| `artifacts[].dependencies` | array | Artifact IDs this artifact depends on |

### `openspec instructions`

Get artifact-specific creation instructions.

```bash
openspec instructions <artifact-id> --change "<name>" --json
```

**Output fields:**

| Field | Type | Description |
|-------|------|-------------|
| `context` | string | Project background (constraint, NOT for output) |
| `rules` | string | Artifact-specific rules (constraint, NOT for output) |
| `template` | string | Structure to use for the output file |
| `instruction` | string | Schema-specific guidance for this artifact type |
| `outputPath` | string | Where to write the artifact |
| `dependencies` | array | Completed artifacts to read for context |

### `openspec list`

List existing changes (to check for name collisions).

```bash
openspec list --json
```

## Artifact Dependency Graph (spec-driven Schema)

```
proposal ──────┐
               │
specs ─────────┤
               ├──▶ tasks (applyRequires)
design ────────┘
```

- `proposal`: No dependencies (create first)
- `specs`: Depends on proposal
- `design`: Depends on proposal and specs
- `tasks`: Depends on proposal, specs, and design

## Artifact Creation Order

1. `proposal` — What and why
2. `specs` — Detailed requirements (depends on proposal)
3. `design` — How to implement (depends on proposal + specs)
4. `tasks` — Implementation steps (depends on proposal + specs + design)

## Key Rules

- `context` and `rules` from `openspec instructions` are **constraints for the agent**, not content for the artifact file
- Never copy `<context>`, `<rules>`, or `<project_context>` blocks into artifact files
- Always read dependency artifacts before creating a new one
- Verify each artifact file exists after writing before proceeding
