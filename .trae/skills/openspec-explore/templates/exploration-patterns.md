# Exploration Patterns

## Pattern 1: Problem Space Exploration

Use when the user brings a vague idea or problem statement.

```
User: "I'm thinking about adding real-time collaboration"

Flow:
1. Identify the breadth of the problem
2. Map the spectrum of possible solutions
3. Surface key tradeoffs
4. Let the user narrow the focus

Output structure:
      SPECTRUM
      ════════════════════════════════════════════

      Simple              Moderate           Complex
        │                   │                 │
        ▼                   ▼                 ▼
    ┌────────┐         ┌────────┐        ┌────────┐
    │Option A│         │Option B│        │Option C│
    └────────┘         └────────┘        └────────┘
        │                   │                 │
     trivial            moderate           complex

      Where's your head at?
```

## Pattern 2: Codebase Investigation

Use when the user wants to understand existing architecture.

```
User: "How does the auth system work?"

Flow:
1. Search for relevant code
2. Map the architecture
3. Identify patterns and anti-patterns
4. Surface hidden complexity

Output structure:
     ┌─────────────────────────────────────────────┐
     │              CURRENT AUTH FLOW              │
     └─────────────────────────────────────────────┘
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
     ┌─────────┐  ┌─────────┐  ┌─────────┐
     │Provider │  │Provider │  │Provider │
     └────┬────┘  └────┬────┘  └────┬────┘
          └─────────────┼─────────────┘
                        ▼
                  ┌───────────┐
                  │  Session  │
                  └───────────┘
```

## Pattern 3: Option Comparison

Use when the user is deciding between approaches.

```
User: "Should we use Postgres or SQLite?"

Flow:
1. Clarify the specific context
2. List relevant constraints
3. Build comparison table
4. Make a recommendation (if asked)

Output structure:
                  Option A          Option B
     Constraint1   ✓ yes             ✗ no
     Constraint2   ✓ yes             ~ partial
     Constraint3   ✗ no              ✓ yes

     Recommendation: <option> because <reason>
```

## Pattern 4: Risk Surfacing

Use when the user needs to understand what could go wrong.

```
User: "What are the risks of this approach?"

Flow:
1. Identify potential failure modes
2. Assess likelihood and impact
3. Suggest mitigations
4. Highlight unknowns

Output structure:
     ┌──────────────────────────────────────────┐
     │            RISK ASSESSMENT               │
     ├──────────┬──────────┬────────────────────┤
     │ Risk     │ Impact   │ Mitigation         │
     ├──────────┼──────────┼────────────────────┤
     │ Risk 1   │ High     │ Mitigation 1       │
     │ Risk 2   │ Medium   │ Mitigation 2       │
     │ Risk 3   │ Low      │ Accept             │
     └──────────┴──────────┴────────────────────┘
```

## Pattern 5: Mid-Implementation Debug

Use when the user is stuck during implementation.

```
User: "The OAuth integration is more complex than expected"

Flow:
1. Read the change artifacts
2. Understand current task context
3. Trace the complexity
4. Suggest paths forward

Output structure:
     Current task: "Implement OAuth flow"
     Complexity source: <diagram of the tangle>

     Options:
     1. Simplify: <approach>
     2. Split: <approach>
     3. Spike: <approach>
```

## Diagram Quick Reference

### System Architecture
```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│  Server  │────▶│ Database │
└──────────┘     └──────────┘     └──────────┘
```

### Data Flow
```
Input ──▶ Process ──▶ Output
  │                     │
  ▼                     ▼
Validate            Transform
```

### State Machine
```
┌─────┐  event1  ┌─────┐  event2  ┌─────┐
│  A  │─────────▶│  B  │─────────▶│  C  │
└─────┘          └─────┘          └─────┘
   │                                 ▲
   └──────────── event3 ─────────────┘
```

### Comparison Table
```
          Option A     Option B     Option C
Crit 1      ✓            ✗            ~
Crit 2      ~            ✓            ✓
Crit 3      ✓            ✓            ✗
```
