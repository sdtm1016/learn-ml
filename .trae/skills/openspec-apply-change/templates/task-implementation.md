# Task Implementation Template

## Progress Report Format

```
## Implementing: <change-name> (schema: <schema-name>)

Working on task N/M: <task description>
[...implementation details...]
✓ Task complete
```

## Completion Report Format

```
## Implementation Complete

**Change:** <change-name>
**Schema:** <schema-name>
**Progress:** M/M tasks complete ✓

### Completed This Session
- [x] Task 1
- [x] Task 2
...

All tasks complete! Ready to archive this change.
```

## Paused Report Format

```
## Implementation Paused

**Change:** <change-name>
**Schema:** <schema-name>
**Progress:** N/M tasks complete

### Issue Encountered
<description of the issue>

**Options:**
1. <option 1>
2. <option 2>
3. Other approach

What would you like to do?
```

## Task Checklist Format

Tasks should follow this structure in the tasks artifact:

```markdown
## Tasks

- [ ] Task 1: <description>
  - Details or sub-steps
- [ ] Task 2: <description>
  - Details or sub-steps
- [x] Task 3: <description> (completed)
```

## Implementation Checklist

For each task being implemented:

1. Read the task description carefully
2. Read relevant context files (proposal, design, specs)
3. Identify files to create or modify
4. Make minimal, focused changes
5. Verify the change addresses the task
6. Mark the task checkbox: `- [ ]` → `- [x]`
7. Proceed to next task

## Blocked State Handling

When `state: "blocked"` appears in apply instructions:

```
## Implementation Blocked

**Change:** <change-name>
**Schema:** <schema-name>

### Missing Artifacts
- <artifact-id>: <reason>

**Suggestion:** Use openspec-continue-change or create the missing artifacts first.
```
