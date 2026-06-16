# Propose Change - Example Session

## Scenario: Proposing a "add-patient-timeline" change

### Step 1: User Provides Input

```
User: I want to add a patient timeline feature that shows all events chronologically
```

Derived name: `add-patient-timeline`

### Step 2: Create the Change

```bash
openspec new change "add-patient-timeline"
```

Output:
```
Created change at openspec/changes/add-patient-timeline/
```

### Step 3: Get Artifact Build Order

```bash
openspec status --change "add-patient-timeline" --json
```

Output:
```json
{
  "schemaName": "spec-driven",
  "applyRequires": ["tasks"],
  "artifacts": [
    { "id": "proposal", "status": "ready", "dependencies": [] },
    { "id": "specs", "status": "blocked", "dependencies": ["proposal"] },
    { "id": "design", "status": "blocked", "dependencies": ["proposal", "specs"] },
    { "id": "tasks", "status": "blocked", "dependencies": ["proposal", "specs", "design"] }
  ]
}
```

### Step 4: Create Artifacts in Sequence

#### Artifact 1: Proposal

```bash
openspec instructions proposal --change "add-patient-timeline" --json
```

Output:
```json
{
  "context": "Medical follow-up platform with patient management...",
  "rules": "Proposal should be concise, focus on what and why...",
  "template": "<proposal template structure>",
  "instruction": "Create a proposal describing the patient timeline feature...",
  "outputPath": "openspec/changes/add-patient-timeline/proposal.md",
  "dependencies": []
}
```

Create `proposal.md`:
```markdown
# Patient Timeline

## Summary
Add a chronological timeline view that displays all patient events (visits, follow-ups,
test results, medication changes) in a single unified view.

## Motivation
Doctors currently need to navigate multiple screens to understand a patient's history.
A unified timeline reduces cognitive load and helps identify patterns in patient care.

## Scope

### In Scope
- Timeline view component
- Event aggregation from multiple data sources
- Filtering by event type and date range

### Out of Scope
- Real-time timeline updates
- Timeline export functionality

## Success Criteria
- Doctors can view 90%+ of patient events in a single timeline
- Timeline loads in under 2 seconds for patients with 500+ events
- Filter response time under 200ms
```

Progress: "Created proposal"

#### Artifact 2: Specs

```bash
openspec instructions specs --change "add-patient-timeline" --json
```

Read `proposal.md` for context, then create specs.

Progress: "Created specs"

#### Artifact 3: Design

```bash
openspec instructions design --change "add-patient-timeline" --json
```

Read `proposal.md` and specs for context, then create design.

Progress: "Created design"

#### Artifact 4: Tasks

```bash
openspec instructions tasks --change "add-patient-timeline" --json
```

Read `proposal.md`, specs, and design for context, then create tasks.

Progress: "Created tasks"

### Step 5: Verify All Artifacts

```bash
openspec status --change "add-patient-timeline"
```

Output:
```
Change: add-patient-timeline
Schema: spec-driven

Artifacts:
  ✓ proposal  (done)
  ✓ specs     (done)
  ✓ design    (done)
  ✓ tasks     (done)

All artifacts complete. Ready for implementation.
```

### Step 6: Final Summary

```
## Change Created: add-patient-timeline

**Location:** openspec/changes/add-patient-timeline/

### Artifacts Created
- **proposal.md** — What and why: unified patient event timeline
- **specs/** — Detailed requirements for timeline capability
- **design.md** — Architecture and component design
- **tasks.md** — Implementation task breakdown

All artifacts created! Ready for implementation.
Run `/opsx:apply` or ask me to implement to start working on the tasks.
```
