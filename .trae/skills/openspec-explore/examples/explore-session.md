# Explore - Example Session

## Scenario: Exploring a Real-Time Notification Feature

### Entry Point

```
User: I'm thinking about adding real-time notifications to the follow-up platform
```

### Initial Exploration

```
Real-time notifications is a broad space. Let me map it out...

      NOTIFICATION SPECTRUM
      ════════════════════════════════════════════

      Pull-based          Push-based         Real-time
          │                   │                 │
          ▼                   ▼                 ▼
      ┌────────┐         ┌────────┐        ┌────────┐
      │Polling │         │ Server │        │WebSocket│
      │Interval│         │  Push  │        │  Stream │
      └────────┘         └────────┘        └────────┘
          │                   │                 │
       trivial            moderate           complex

      Where on this spectrum are you thinking?
```

### User Narrows Focus

```
User: Push-based seems right. Doctors need to know immediately when a patient's condition changes.
```

### Codebase Investigation

```
Let me check what notification infrastructure already exists...

[searches codebase for notification-related code]

     ┌─────────────────────────────────────────────┐
     │          CURRENT NOTIFICATION FLOW          │
     └─────────────────────────────────────────────┘
                        │
                        ▼
                  ┌───────────┐
                  │  Follow-up │
                  │  Scheduler │
                  └─────┬─────┘
                        │
            ┌───────────┼───────────┐
            ▼           ▼           ▼
       ┌─────────┐ ┌─────────┐ ┌─────────┐
       │   SMS   │ │  Email  │ │  WeChat │
       │ Service │ │ Service │ │  Push   │
       └─────────┘ └─────────┘ └─────────┘

     Currently all channels are fire-and-forget.
     No delivery confirmation. No real-time status.

     Key observations:
     • WeChat Push is already integrated — could leverage for real-time
     • No WebSocket infrastructure exists
     • SMS and Email are async (third-party queues)
```

### Option Comparison

```
Given the existing infrastructure, here are the options:

                  WeChat Push    WebSocket     SSE
     Real-time     ✓ yes         ✓ yes        ✓ yes
     Existing infra ✓ yes        ✗ no         ✗ no
     Bidirectional  ✗ no         ✓ yes        ✗ no
     Mobile support ✓ native     ~ hybrid     ✗ limited
     Complexity     low          high         medium

     Recommendation: Start with WeChat Push enhancement
     — You already have the infrastructure
     — Doctors are on WeChat (primary channel)
     — Can add WebSocket later for web dashboard
```

### Risk Surfacing

```
     ┌──────────────────────────────────────────┐
     │            RISK ASSESSMENT               │
     ├──────────────┬──────────┬────────────────┤
     │ Risk         │ Impact   │ Mitigation     │
     ├──────────────┼──────────┼────────────────┤
     │ WeChat rate  │ High     │ Queue + batch  │
     │ limits       │          │ fallback       │
     ├──────────────┼──────────┼────────────────┤
     │ Delivery     │ Medium   │ Add webhook    │
     │ confirmation │          │ for status     │
     ├──────────────┼──────────┼────────────────┤
     │ Offline      │ Low      │ Pull-based     │
     │ doctors      │          │ fallback       │
     └──────────────┴──────────┴────────────────┘
```

### Crystallizing

```
## What We Figured Out

**The problem**: Doctors need immediate awareness of patient condition changes

**The approach**: Enhance existing WeChat Push with delivery confirmation,
                 add pull-based fallback for offline scenarios

**Open questions**:
- What patient events trigger notifications?
- Should there be an escalation path if a doctor doesn't respond?
- How does this interact with the existing follow-up scheduler?

**Next steps** (if ready):
- Create a change proposal: "add-realtime-notifications"
- Keep exploring: dig into the event trigger system
```

### User Decides to Create a Proposal

```
User: Let's create a proposal for this

Great! I'll create a change proposal. Switching to propose mode...
[invokes openspec-propose skill]
```
