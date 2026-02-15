# Fission v1 Execution Backlog

This backlog translates `PRODUCT_PLAN.md` into executable work packages.

## Milestones

1. M0 - Spec and Migration Prep (Weeks 1-3)
2. M1 - Intelligence Core Port (Weeks 4-8)
3. M2 - Market and Settlement Core (Weeks 9-14)
4. M3 - Trigger Engine and Action Connectors (Weeks 15-20)
5. M4 - Pilot and Hardening (Weeks 21-26)

## Epics

### EPIC-001 Proposal Intelligence Engine

- Goal: Ingest and normalize governance proposals into structured objects.
- Milestone: M1
- Success Metric: >=95% field completeness in parser test corpus.

Tasks:
1. TASK-001 Define `Proposal`/`ProposalDigest` JSON schemas.
2. TASK-002 Build adapters for forum URL, markdown, and JSON payload.
3. TASK-003 Implement quantitative field extractor (budget/timeline/KPI/dependencies).
4. TASK-004 Build unresolved-question detector.
5. TASK-005 Add ingestion QA fixture set.

### EPIC-002 Multi-Agent Deliberation Runtime

- Goal: Port and harden multi-agent governance deliberation.
- Milestone: M1
- Success Metric: Deterministic replay and transcript integrity for all test runs.

Tasks:
1. TASK-006 Implement orchestration service for Finance/Tech/Gov experts.
2. TASK-007 Add context memory and turn-state manager.
3. TASK-008 Enforce explicit confidence tags per claim.
4. TASK-009 Build transcript signer and hash verification.
5. TASK-010 Add failure handling for agent timeout/retry paths.

### EPIC-003 Statistical Feasibility Scoring

- Goal: Produce robust feasibility outputs with confidence metadata.
- Milestone: M1
- Success Metric: Stable median/variance outputs across replay runs.

Tasks:
1. TASK-011 Implement repeated scoring runner (min 7, target 10).
2. TASK-012 Add criterion-level scoring pipeline.
3. TASK-013 Compute median, variance, confidence labels.
4. TASK-014 Add calibration report output format.
5. TASK-015 Add synthetic proposal benchmark suite.

### EPIC-004 Market Core (Binary/Scalar/Conditional)

- Goal: Implement contract lifecycle for core market types.
- Milestone: M2
- Success Metric: End-to-end create->trade->close->settle pipeline tests pass.

Tasks:
1. TASK-016 Implement binary contract template.
2. TASK-017 Implement scalar payout normalization template.
3. TASK-018 Implement conditional comparative market template.
4. TASK-019 Add listing validator with required settlement schema checks.
5. TASK-020 Add market lifecycle integration tests.

### EPIC-005 Oracle and Dispute Core

- Goal: Ensure settlement integrity with dispute-safe rails.
- Milestone: M2
- Success Metric: >99.5% successful settlement finalization in pilot.

Tasks:
1. TASK-021 Build oracle adapter interface (3+ primary sources).
2. TASK-022 Implement candidate settlement publication flow.
3. TASK-023 Implement bonded challenge/dispute workflow.
4. TASK-024 Implement slashing/reward resolution.
5. TASK-025 Add dispute SLA and evidence logging service.

### EPIC-006 Trigger Policy Engine

- Goal: Combine market signal and intelligence outputs into bounded execution.
- Milestone: M3
- Success Metric: <2% critical trigger misfire rate in bounded action classes.

Tasks:
1. TASK-026 Design trigger policy DSL (`price + depth + volatility + confidence`).
2. TASK-027 Build trigger evaluator runtime.
3. TASK-028 Add integrity gates (no critical dispute, source quorum).
4. TASK-029 Implement action classes (advisory, queued, bounded-auto).
5. TASK-030 Add simulation harness for trigger precision/recall.

### EPIC-007 Action Connectors and Safeguards

- Goal: Connect trigger outputs to real operational levers safely.
- Milestone: M3
- Success Metric: Full rollback coverage for all bounded actions.

Tasks:
1. TASK-031 Build treasury action connector.
2. TASK-032 Build release rollout action connector.
3. TASK-033 Build parameter update action connector.
4. TASK-034 Implement cancellation/review windows.
5. TASK-035 Implement rollback and emergency stop paths.

### EPIC-008 Accountability and Analytics

- Goal: Provide complete, exportable governance cycle artifacts.
- Milestone: M4
- Success Metric: 100% sampled cycles replayable from artifact set.

Tasks:
1. TASK-036 Build artifact pipeline (digest/transcript/scoring/settlement/action).
2. TASK-037 Build audit explorer API.
3. TASK-038 Add export formats for governance review.
4. TASK-039 Implement KPI dashboards (calibration, dispute latency, reversal rate).
5. TASK-040 Add post-settlement retrospective template generation.

### EPIC-009 Pilot Operations and Transfer

- Goal: Run real pilot and transfer to Arkenstone Labs organization workflow.
- Milestone: M4
- Success Metric: >=30% decision latency reduction vs baseline.

Tasks:
1. TASK-041 Select 2-3 low-externality pilot domains.
2. TASK-042 Define participant policy and topic whitelist.
3. TASK-043 Run pilot cycles and collect operator trust scores.
4. TASK-044 Produce pilot report with go/no-go recommendation.
5. TASK-045 Deliver migration handoff package for org-level repository operations.

## Priority Queue (First 10)

1. TASK-001
2. TASK-006
3. TASK-011
4. TASK-016
5. TASK-021
6. TASK-026
7. TASK-036
8. TASK-002
9. TASK-019
10. TASK-030

## Issue Labels (Recommended)

- `epic`
- `task`
- `feature`
- `governance-intelligence`
- `market-core`
- `oracle-dispute`
- `trigger-engine`
- `pilot`
- `security`
- `documentation`

## Definition of Done (Global)

A backlog item is done only when:
1. Acceptance criteria are met.
2. Tests and replay checks pass.
3. Security/risk considerations are documented.
4. Relevant artifacts are linked in the issue.
5. Operational rollback implications are stated.
