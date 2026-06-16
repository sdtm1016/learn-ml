# Apply Change - Example Session

## Scenario: Applying a "add-user-auth" Change

### Step 1: Select the Change

```bash
openspec list --json
```

Output:
```json
{
  "changes": [
    { "name": "add-user-auth", "schema": "spec-driven", "status": "active" }
  ]
}
```

Announce: "Using change: add-user-auth"

### Step 2: Check Status

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

### Step 3: Get Apply Instructions

```bash
openspec instructions apply --change "add-user-auth" --json
```

Output:
```json
{
  "contextFiles": {
    "proposal": ["openspec/changes/add-user-auth/proposal.md"],
    "specs": ["openspec/changes/add-user-auth/specs/auth/spec.md"],
    "design": ["openspec/changes/add-user-auth/design.md"],
    "tasks": ["openspec/changes/add-user-auth/tasks.md"]
  },
  "progress": { "total": 5, "complete": 0, "remaining": 5 },
  "state": "in_progress",
  "tasks": [
    { "id": 1, "description": "Create User model with auth fields", "status": "pending" },
    { "id": 2, "description": "Implement JWT token generation", "status": "pending" },
    { "id": 3, "description": "Create login endpoint", "status": "pending" },
    { "id": 4, "description": "Add auth middleware", "status": "pending" },
    { "id": 5, "description": "Write integration tests", "status": "pending" }
  ]
}
```

### Step 4: Read Context Files

Read all files listed in `contextFiles`:
- `openspec/changes/add-user-auth/proposal.md`
- `openspec/changes/add-user-auth/specs/auth/spec.md`
- `openspec/changes/add-user-auth/design.md`
- `openspec/changes/add-user-auth/tasks.md`

### Step 5: Show Progress

```
## Implementing: add-user-auth (schema: spec-driven)

Progress: 0/5 tasks complete

Remaining tasks:
1. Create User model with auth fields
2. Implement JWT token generation
3. Create login endpoint
4. Add auth middleware
5. Write integration tests
```

### Step 6: Implement Tasks

```
Working on task 1/5: Create User model with auth fields
[Create model file, add fields...]
✓ Task complete

Working on task 2/5: Implement JWT token generation
[Create token utility, add signing logic...]
✓ Task complete

Working on task 3/5: Create login endpoint
[Create route handler, validate credentials...]
✓ Task complete

Working on task 4/5: Add auth middleware
[Create middleware, verify tokens...]
✓ Task complete

Working on task 5/5: Write integration tests
[Create test file, write test cases...]
✓ Task complete
```

### Step 7: Show Final Status

```
## Implementation Complete

**Change:** add-user-auth
**Schema:** spec-driven
**Progress:** 5/5 tasks complete ✓

### Completed This Session
- [x] Create User model with auth fields
- [x] Implement JWT token generation
- [x] Create login endpoint
- [x] Add auth middleware
- [x] Write integration tests

All tasks complete! Ready to archive this change.
```
