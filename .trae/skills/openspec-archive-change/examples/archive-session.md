# Archive Change - Example Session

## Scenario: Archiving a completed "add-user-auth" change

### Step 1: List Available Changes

```bash
openspec list --json
```

Output:
```json
{
  "changes": [
    { "name": "add-user-auth", "schema": "spec-driven", "status": "active" },
    { "name": "add-notifications", "schema": "spec-driven", "status": "active" }
  ]
}
```

User selects: "add-user-auth"

### Step 2: Check Artifact Completion

```bash
openspec status --change "add-user-auth" --json
```

Output:
```json
{
  "schemaName": "spec-driven",
  "artifacts": [
    { "id": "proposal", "status": "done" },
    { "id": "specs", "status": "done" },
    { "id": "design", "status": "done" },
    { "id": "tasks", "status": "done" }
  ]
}
```

All artifacts are done. Proceed.

### Step 3: Check Task Completion

Read `openspec/changes/add-user-auth/tasks.md`:

```markdown
## Tasks
- [x] Create User model with auth fields
- [x] Implement JWT token generation
- [x] Create login endpoint
- [x] Add auth middleware
- [x] Write integration tests
```

All 5 tasks complete. Proceed.

### Step 4: Assess Delta Spec Sync

Check `openspec/changes/add-user-auth/specs/`:

```
openspec/changes/add-user-auth/specs/
└── auth/
    └── spec.md
```

Delta spec exists. Compare with main spec at `openspec/specs/auth/spec.md`:

```
### Delta Spec Sync Assessment

| Capability | Changes | Status |
|------------|---------|--------|
| auth | +3 endpoints, +2 models | Needs sync |

**Options:**
1. Sync now (recommended)
2. Archive without syncing
```

User selects: "Sync now"

### Step 5: Perform Archive

```bash
mkdir -p openspec/changes/archive
mv openspec/changes/add-user-auth openspec/changes/archive/2026-05-06-add-user-auth
```

### Step 6: Display Summary

```
## Archive Complete

**Change:** add-user-auth
**Schema:** spec-driven
**Archived to:** openspec/changes/archive/2026-05-06-add-user-auth/
**Specs:** ✓ Synced to main specs

All artifacts complete. All tasks complete.
```

---

## Scenario: Archiving with Incomplete Tasks

### Step 2: Task Check Reveals Incomplete Tasks

Read `openspec/changes/add-notifications/tasks.md`:

```markdown
## Tasks
- [x] Create Notification model
- [x] Implement notification service
- [ ] Add email notification channel
- [ ] Write integration tests
```

2 incomplete tasks found.

```
### Warning: Incomplete Tasks

**Change:** add-notifications
**Incomplete tasks:** 2 remaining
- Add email notification channel
- Write integration tests

Proceed with archive?
```

User confirms: Yes

### Archive Proceeds

```
## Archive Complete (with warnings)

**Change:** add-notifications
**Schema:** spec-driven
**Archived to:** openspec/changes/archive/2026-05-06-add-notifications/
**Specs:** No delta specs

### Warnings
- Incomplete tasks: 2 remaining

Archived with user confirmation despite warnings.
```
