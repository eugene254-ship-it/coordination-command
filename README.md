# Atlas Sanctum — Institutional Coordination Dashboard

> **Make cross-institution work visible, measurable, and governable.**
>
> The Institutional Coordination Dashboard turns Atlas Sanctum from a passive intelligence system into an active coordination infrastructure.

**Product:** Atlas Sanctum Institutional Coordination Dashboard  
**Status:** Product / Frontend Design Specification  
**Primary question:** **Who is responsible for what, with whom, by when, and where are the coordination gaps?**

---

## 1. Product Purpose

The Institutional Coordination Dashboard exists to make shared responsibility legible across complex programs, interventions, and regional response systems.

It is designed to prevent four recurring failure modes:

- **Diffusion of responsibility** — everyone assumes another institution owns the problem.
- **Coordination theater** — meetings happen, memos circulate, but execution remains invisible.
- **Fragmented timelines** — one actor is planning, another is funding, another is implementing, and none are synchronized.
- **Accountability collapse** — when execution fails, the system cannot trace which handoff broke.

The product should therefore feel less like a reporting screen and more like a **mission-control room for institutions**.

---

## 2. Product Framing

At the highest level, the dashboard tracks:

- institutions involved
- institutional roles
- projects and interventions
- commitment status
- dependencies between actors
- funding relationships
- execution progress
- response delays
- accountability gaps
- regional coverage
- coordination-failure risk

Conceptually, it combines:

> **CRM + supply-chain visibility + public-systems intelligence**

into one coherent operational interface.

---

# 3. Main Dashboard Layout

The primary experience is organized into six major zones.

```text
┌────────────────────────────────────────────────────────────────────┐
│ ATLAS SANCTUM                                                     │
│ Institutional Coordination Dashboard              Live / Filters  │
├───────────────────────────────┬───────────────────┬────────────────┤
│                               │                   │                │
│ GLOBAL SUMMARY                │ COLLABORATION     │ ACCOUNTABILITY │
│ & SIGNALS                     │ NETWORK           │ & ESCALATION   │
│                               │                   │                │
├───────────────────────────────┴───────────────────┴────────────────┤
│                                                                    │
│                   PROJECT RESPONSIBILITY MATRIX                    │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│               INITIATIVE TIMELINE / COORDINATION GANTT            │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│                   REGIONAL COORDINATION MAP                        │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

The interface should establish a command-center rhythm without collapsing into visual noise.

---

# 4. Zone A — Global Coordination Summary Bar

The summary bar sits at the top of the dashboard and communicates the current state of the coordination system at a glance.

### Key metrics

| Metric | Meaning |
|---|---|
| **Total active institutions** | Organizations currently participating in active work |
| **Active cross-sector projects** | Current interventions spanning institutions or sectors |
| **Projects on track** | Projects currently meeting execution expectations |
| **Projects delayed** | Projects whose timelines have slipped |
| **Unowned critical tasks** | Critical work with no accountable institution |
| **Coordination risk score** | Composite signal for coordination failure risk |
| **Average inter-institution response latency** | Average time between requests, handoffs, or required responses |
| **Accountability coverage** | Percentage of relevant responsibilities with a clear accountable owner |

This is the **"how healthy or broken is the machine today?"** strip.

---

# 5. Zone B — Institutional Collaboration Network Graph

The collaboration network is the signature visual centerpiece of the product.

### Graph semantics

- **Nodes** = institutions
- **Edges** = active collaborations, dependencies, or resource flows
- **Node size** = influence, responsibility load, or budget share
- **Edge thickness** = collaboration intensity
- **Edge color** = healthy, delayed, blocked, or inactive relationship state

### Interaction model

Users can:

- click a node to open the institution detail panel
- hover an edge to inspect its relationship type
- filter by geography
- filter by sector
- filter by project
- filter by funding stream
- filter by timeframe

### Relationship types

```text
Funding
Operational Delivery
Data Sharing
Policy Oversight
Research Support
Community Engagement
Infrastructure Provision
```

### Graph modes

The graph should not become an unreadable decorative network.

Support multiple representations:

1. **Force-directed mode** for exploration
2. **Hierarchical / layered mode** for structured analysis
3. **Sector or region clustering** for high-level orientation
4. **Edge bundling** to reduce network noise

The visual system should always preserve a clear relationship between an edge and the operational meaning behind it.

---

# 6. Zone C — Project Responsibility Matrix

The responsibility matrix is the core mechanism for eliminating ambiguity.

### Structure

- **Rows** = projects / interventions
- **Columns** = institutions
- **Cells** = role and execution status

### Base role model

Use a RACI-style model:

| Code | Role |
|---|---|
| **R** | Responsible |
| **A** | Accountable |
| **C** | Consulted |
| **I** | Informed |

### Extended roles

| Code | Role |
|---|---|
| **F** | Funding |
| **D** | Data provider |
| **V** | Verification / audit |

### What the matrix should expose

- missing owners
- too many owners
- overloaded institutions
- dormant collaborators
- actors present in meetings but absent from delivery

### Example

**Project:** Flood mitigation in Nairobi basin

| Intervention | Ministry of Environment | County Government | Investor | Contractor | Community Group |
|---|---|---|---|---|---|
| Drainage upgrade | A | R | F | R | C |
| Wetland restoration | A | R | F | C | R |
| Early warning system | C | A | F | D | I |

The exact role configuration should remain data-driven rather than hard-coded into the UI.

---

# 7. Zone D — Initiative Timeline / Coordination Gantt

Coordination is temporal, so the dashboard needs a first-class timeline layer.

The Gantt/timeline view should expose:

- project phases
- institutional handoffs
- milestone deadlines
- delayed dependencies
- overlapping responsibilities
- blockers
- critical paths

### Lane modes

The user should be able to organize lanes by:

- **project**, with institutions nested inside
- **institution**, with projects nested inside

### Timeline overlays

Support:

- planned vs. actual timelines
- blocked tasks
- dependencies waiting on another institution
- critical-path highlighting

Example insight:

> **Your flood response plan is delayed not because of engineering, but because procurement approval has been idle for 19 days.**

The timeline should make this kind of causal coordination problem visible without requiring manual reconstruction from separate status reports.

---

# 8. Zone E — Geographic Coordination Map

Atlas is spatial, and coordination has geography.

The regional map shows how institutional activity is distributed across territory.

### Map signals

Display:

- institutions active in each region
- project density
- overlapping intervention zones
- neglected areas
- conflicts or coordination friction between actors
- service gaps

### Map overlays

```text
Projects by type
Institutional coverage
Funding concentration
Population vulnerability
Risk exposure
Implementation status
```

### Example insight

> Three NGOs and one county agency are active in one ward, while the adjacent high-risk ward has no lead actor.

The map therefore serves as a coordination-gap detector, not merely a geographic directory.

---

# 9. Zone F — Accountability & Escalation Panel

This is the operational edge of the dashboard.

It should surface:

- overdue commitments
- missing owners
- stalled approvals
- unresolved inter-agency blockers
- institutions with repeated delivery slippage
- projects with no reporting updates
- dependency-chain failures

### Example alerts

```text
4 critical flood mitigation tasks have no accountable institution.

County water authority has missed 3 consecutive reporting cycles.

Research partner delivered data, but policy action remains unassigned.

Contractor mobilization is blocked by permit approval delay.
```

The purpose is to turn coordination into **operational truth**, not polite fiction.

---

# 10. Core Frontend Components

A production-oriented component system should separate domain modules from shared interaction primitives.

```text
CoordinationDashboardShell
├── CoordinationSummaryBar
├── FilterToolbar
├── LegendPanel
│
├── InstitutionNetworkGraph
│   ├── NetworkControls
│   ├── InstitutionNode
│   ├── CollaborationEdge
│   └── RelationshipInspector
│
├── ProjectResponsibilityMatrix
│   ├── MatrixHeader
│   ├── ResponsibilityCell
│   └── RoleLegend
│
├── CoordinationTimeline
│   ├── TimelineHeader
│   ├── ProjectLane
│   ├── Milestone
│   ├── Dependency
│   └── CriticalPath
│
├── RegionalCoordinationMap
│   ├── MapLayers
│   ├── InstitutionMarker
│   ├── ProjectOverlay
│   └── CoverageLayer
│
├── AccountabilityAlertsPanel
│   ├── AlertCard
│   ├── EscalationStatus
│   └── ResolutionAction
│
├── InstitutionDetailDrawer
├── ProjectDetailDrawer
└── DependencyInspector
```

These map directly to the product's core interaction surfaces.

---

# 11. Filtering System

Filtering is a first-class capability. Without serious filtering, the dashboard becomes a giant digital jungle vine.

### Required filters

```text
Geography
Institution type
Sector
Project type
Time range
Status
Funding source
Coordination health
Risk level
Intervention stage
```

### Institution types

```text
Government
NGO
Private sector
Research
Community / citizen-led
Donor / investor
Multilateral / development agency
```

### Status values

```text
Active
Delayed
Blocked
Completed
Under review
Unassigned
```

Filters should be composable and persistent across compatible views.

---

# 12. Dashboard Views

Instead of forcing every capability into one overloaded screen, the product should offer multiple operational modes.

## View 1 — Overview

For executives and city leaders.

Shows:

- top metrics
- major active collaborations
- biggest risks
- geographic imbalance
- top delayed projects

## View 2 — Network

Deep institutional graph exploration.

## View 3 — Projects

Combined table, responsibility matrix, and timeline experience.

## View 4 — Accountability

Escalations, overdue commitments, and missing owners.

## View 5 — Regional

Map-centric coordination analysis.

## View 6 — Institutions

Detailed profiles for individual organizations.

---

# 13. Institution Detail Drawer

Clicking an institution node or table row opens a contextual detail drawer.

### Core information

```text
Institution name
Type
Mandate / role
Active projects
Current commitments
Budget / linked funding
Delivery score
Coordination score
Average response time
Dependency load
Connected partners
Recent updates
Unresolved blockers
```

### Supporting micro-visuals

- mini collaboration graph
- project count by sector
- on-time vs. delayed milestone chart
- accountability heat score

The drawer should make it possible to inspect whether an institution is functioning as a reliable anchor, an overloaded actor, or a coordination bottleneck without leaving the current workflow.

---

# 14. Project Detail Drawer

Each project or intervention should expose a complete coordination context.

### Core fields

```text
Project objective
Region
Risk level
Lead institutions
Supporting actors
Funding entities
Timeline
Current status
Milestones
Dependencies
Blockers
Recent activity log
Measurable outcomes
Accountability chain
```

### Plain-language project summary

A critical feature is a concise narrative generated from structured project state.

Example:

> **Wetland restoration is 62% complete. County government and community groups are on track. Contractor procurement is delayed. Investor disbursement phase 2 is pending environmental compliance approval.**

This summary should reduce the amount of interpretation required from leaders before a briefing or escalation decision.

---

# 15. Visualization Strategy

Use visualization types according to the coordination problem they solve.

| Visualization | Primary use |
|---|---|
| **Network graph** | Collaboration and dependency visibility |
| **Responsibility matrix / heatmap** | Role clarity across actors |
| **Timeline / Gantt** | Coordination sequencing |
| **Geographic choropleth / point overlays** | Regional distribution |
| **Sankey diagram** | Fund or resource flow |
| **Stacked status bars** | Project health summaries |
| **Alert stream / event feed** | Real-time coordination breakdowns |
| **Dependency tree** | Tracing execution blockers |

Every chart should answer an operational question. Decorative visualization adds noise without increasing coordination clarity.

---

# 16. UX Principles

## Rule 1 — Clarity over ornament

This is not a showcase surface. It is an operational coordination tool.

## Rule 2 — Layered complexity

Show high-level state first. Allow drill-down for detail.

## Rule 3 — Explain relationships

Every edge, color, symbol, and status should have a human-readable meaning.

## Rule 4 — Surface failure first

Leaders need to see what is drifting, blocked, or unowned before admiring success metrics.

## Rule 5 — Preserve trust

Data freshness, provenance, and update timestamps must remain visible.

---

# 17. Information Architecture

A practical hierarchy is:

```text
Header
├── Title
├── Date range
├── Global filters
├── Export / Share / Compare
└── Live status badge

Primary content
├── Summary metrics
├── Network graph
├── Accountability alerts
├── Project matrix
└── Coordination timeline

Secondary context
└── Regional map

Right-side contextual panel
├── Selected institution
├── Selected project
├── Dependency analysis
└── Recent events
```

This creates a command-center rhythm while keeping drill-down context close to the selected entity.

---

# 18. Frontend Data Model

The frontend should consume structured domain entities rather than presentation-specific blobs.

## Institution

```ts
interface Institution {
  id: string;
  name: string;
  type: string;
  jurisdiction: string;
  sector: string;
  contactOrLiaison?: string;
  mandate?: string;
  coordinationScore?: number;
  responseLatency?: number;
  activeProjects: number;
}
```

## Project

```ts
interface Project {
  id: string;
  name: string;
  type: string;
  region: string;
  status: string;
  riskScore?: number;
  progress?: number;
  startDate?: string;
  endDate?: string;
  leadInstitutionId?: string;
  supportingInstitutionIds: string[];
}
```

## Collaboration Edge

```ts
interface CollaborationEdge {
  sourceInstitutionId: string;
  targetInstitutionId: string;
  relationshipType: string;
  intensity?: number;
  status: string;
  lastInteraction?: string;
  dependencyWeight?: number;
}
```

## Commitment / Task

```ts
interface CommitmentTask {
  id: string;
  projectId: string;
  ownerInstitutionId?: string;
  deadline?: string;
  status: string;
  blocker?: string;
  dependencyIds: string[];
}
```

## Event / Update

```ts
interface CoordinationEvent {
  id: string;
  timestamp: string;
  institutionId?: string;
  projectId?: string;
  eventType: string;
  severity: string;
  description: string;
}
```

These models give the frontend enough structure to deliver real coordination intelligence rather than decorative reporting.

---

# 19. AI-Enhanced Coordination Features

Atlas should extend beyond passive visualization.

## A. Coordination Gap Detection

Identify patterns such as:

- missing owners
- duplicated efforts
- isolated institutions
- overstretched actors
- under-coordinated high-risk regions

## B. Recommended Next Actor

Example:

> **Permit approval delay is now the main blocker. Escalation recommended to County Infrastructure Office.**

The recommendation should include the underlying evidence and the reason the actor was selected.

## C. Failure Forecasting

Predict which project may stall because of:

- weak handoffs
- unresponsive actors
- dependency overload
- low reporting frequency

## D. Institutional Trust Signals

Potential model inputs include:

- responsiveness
- follow-through
- update frequency
- successful collaborations
- audit history

Trust signals must be transparent, explainable, and handled carefully because they can materially affect institutional relationships.

## E. Coordination Simulation

Support questions such as:

```text
What happens if Institution X fails to deliver?
What projects become exposed if funder Y delays?
What regions lose coverage if NGO Z withdraws?
```

This is where Atlas begins to function as a **systems-foresight engine** rather than only a dashboard.

---

# 20. AI & Accountability Guardrails

AI outputs should support coordination decisions, not conceal them.

Every model-generated insight should expose:

- what the system detected
- what evidence contributed
- confidence / uncertainty
- relevant time window
- source freshness
- model or rule version, where applicable
- suggested next step

Recommendations should remain distinct from confirmed actions.

For example:

```text
AI Recommendation

Permit approval delay is the current critical blocker.

Evidence
- 19 days without approval update
- 2 dependent tasks delayed
- 1 project critical path affected

Suggested next actor
County Infrastructure Office
```

A human operator remains responsible for whether and how the action is taken.

---

# 21. Empty States

The UI must distinguish legitimate absence of data from system failures.

Examples:

```text
No active projects in the selected region.

No institutions match the current filters.

No accountability gaps detected.

No live coordination data is available yet.
```

Empty states should explain what the user can do next without implying that missing data means missing activity.

---

# 22. Failure States

The system must surface operational degradation explicitly.

Supported failure states include:

- stale data warning
- partial synchronization failure
- degraded network graph
- missing institution metadata
- conflicting ownership records

Avoid generic messages such as:

> "Something went wrong."

Prefer messages that identify the operational problem and its scope.

Example:

> **Ownership records conflict for 3 commitments in Nairobi Basin. Review required before accountability metrics are recalculated.**

---

# 23. Responsive Strategy

The dashboard is desktop-first, with deliberate responsive degradation.

## Desktop

Full command-center layout with:

- network graph
- matrix
- timeline
- map
- persistent contextual drawer

## Tablet

- stronger tab navigation
- stacked analytical zones
- right-side drawer becomes a modal or overlay

## Mobile

Focus on:

- summary metrics
- accountability alerts
- institution cards
- project status lists
- mini map
- drill-down details

Do not attempt to squeeze the full institutional network graph into a phone viewport. Mobile should optimize for **triage and action**, not graph density.

---

# 24. Color & Semantic System

Maintain semantic consistency across Atlas dashboards.

| Color | Meaning |
|---|---|
| **Red** | Critical coordination failure / blocked |
| **Yellow** | At risk / delayed |
| **Blue** | Stable / active |
| **Green** | Completed / healthy collaboration |
| **Gray** | Inactive / unknown / stale |

Color must never be the sole carrier of meaning.

Pair state with:

- iconography
- labels
- patterns or texture where appropriate
- explicit values

Accessibility is part of the coordination model, not a decorative afterthought.

---

# 25. Real-World Example — Nairobi Flood Mitigation

Imagine a policymaker opening the dashboard and seeing:

```text
14 active institutions
5 projects delayed
2 critical tasks unassigned
County engineering office overloaded
Investor disbursement on hold
1 high-risk informal settlement without an intervention lead
```

They open the network graph and see:

```text
Ministry of Environment
        │
        ├── County Government
        │
        └── Climate Investor
                │
                └── Contractor

Community groups
└── Weakly connected / low reporting density
```

They open the responsibility matrix and discover:

```text
Drainage maintenance → no accountable owner

Early warning data → produced by researchers,
                     but not operationalized by
                     the county disaster team
```

They open accountability alerts:

```text
Permit approval unresolved for 21 days.

No institution assigned to post-flood waste removal in Ward 7.
```

This is the intended product outcome: **coordination truth becomes visible before execution failure becomes expensive.**

---

# 26. Product Success Criteria

The dashboard should make it possible to answer, quickly and defensibly:

### Ownership

- Who owns this task?
- Is accountability explicit?
- Are there multiple competing owners?

### Coordination

- Which institutions are actively collaborating?
- Where are handoffs failing?
- Which actors are overloaded?

### Execution

- What is on track?
- What is delayed?
- What is blocked?
- Which dependency caused the delay?

### Geography

- Where are interventions concentrated?
- Where are service or coordination gaps?
- Which regions have overlapping actors?

### Escalation

- Which commitments are overdue?
- Which approvals are stalled?
- Which projects have not been updated?

### Foresight

- Which projects are likely to stall?
- What happens if a major actor fails to deliver?
- Which regions become exposed if a funding or implementation partner withdraws?

---

# 27. Final Product Framing

The Institutional Coordination Dashboard is the **operating system for shared responsibility**.

It is not merely about:

- who is present
- what is funded
- what has been promised

It is about:

> **who owns the task**
>
> **where the dependency lives**
>
> **how execution is moving**
>
> **where coordination is failing**
>
> **which blind spots threaten outcomes**

Atlas Sanctum should make invisible institutional entropy visible before it becomes disaster.

---

## Product Tagline

> **Atlas Sanctum — Make responsibility visible. Make coordination measurable. Make action governable.**
