# Artifact Templates

## Proposal Template (proposal.md)

```markdown
# <Change Name>

## Summary

<One paragraph describing what this change does and why>

## Motivation

<Why is this change needed? What problem does it solve?>

## Scope

### In Scope
- <item 1>
- <item 2>

### Out of Scope
- <item 1>
- <item 2>

## Success Criteria

- <measurable criterion 1>
- <measurable criterion 2>

## Dependencies

- <external dependency 1>
- <external dependency 2>

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| <risk> | <high/medium/low> | <mitigation> |
```

## Design Template (design.md)

```markdown
# Design: <Change Name>

## Overview

<High-level approach to solving the problem>

## Architecture

<Describe the architectural approach, include diagrams if helpful>

## Data Model

<Describe data model changes, new tables, schema modifications>

## API Changes

<Describe new or modified API endpoints>

### New Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/<resource> | <description> |

### Modified Endpoints

| Method | Path | Change |
|--------|------|--------|
| GET | /api/<resource> | <what changed> |

## Component Changes

<Describe frontend component changes>

## Error Handling

<How errors are handled in this design>

## Security Considerations

<Authentication, authorization, data protection>

## Performance Considerations

<Expected performance characteristics, caching strategy>

## Alternatives Considered

| Alternative | Pros | Cons | Why Rejected |
|-------------|------|------|--------------|
| <alt> | <pros> | <cons> | <reason> |
```

## Tasks Template (tasks.md)

```markdown
# Tasks: <Change Name>

## Phase 1: <Phase Name>

- [ ] Task 1: <description>
  - <sub-step or detail>
  - <sub-step or detail>
- [ ] Task 2: <description>
  - <sub-step or detail>

## Phase 2: <Phase Name>

- [ ] Task 3: <description>
- [ ] Task 4: <description>

## Phase 3: Verification

- [ ] Task 5: Write tests for <component>
- [ ] Task 6: Integration testing
- [ ] Task 7: Update documentation
```

## Spec Template (specs/<capability>/spec.md)

```markdown
# <Capability Name> Specification

## Overview

<What this capability provides>

## Requirements

### Functional Requirements

- FR-1: <requirement description>
- FR-2: <requirement description>

### Non-Functional Requirements

- NFR-1: <requirement description>
- NFR-2: <requirement description>

## Interface

### Input

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| <field> | <type> | yes/no | <description> |

### Output

| Field | Type | Description |
|-------|------|-------------|
| <field> | <type> | <description> |

## Behavior

### Happy Path

1. <step 1>
2. <step 2>
3. <step 3>

### Error Cases

| Condition | Response |
|-----------|----------|
| <condition> | <error response> |

## Constraints

- <constraint 1>
- <constraint 2>
```
