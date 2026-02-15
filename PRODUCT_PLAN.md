# Fission - Product Plan

Version: 1.1  
Owner: Christopher Choi  
Product Organization: Arkenstone Labs (Incubation Stage)  
Repository Stage: Personal pre-organization planning and prototype development

## 1. Executive Summary

Fission is an operations-grade prediction-market and governance-intelligence product designed to make the loop below executable and auditable:

- Narrative (N): a proposal, policy thesis, or execution hypothesis is declared.
- Price (P): market participants submit costed beliefs through positions.
- Action (A): pre-approved execution handles trigger from market conditions.
- Outcome (O): measurable outcomes are settled by dispute-aware oracle rails.
- Narrative Update (N): future proposals start from verified historical priors.

This plan explicitly incorporates capabilities validated during the IterateFast Labs period through the OP governance multi-agent system:
- proposal classification and structured extraction,
- expert multi-agent deliberation,
- statistical feasibility scoring,
- transparent decision logs and performance telemetry.

Fission combines those governance-intelligence strengths with market execution rails so insight is not only analyzed, but acted upon under bounded policy constraints.

## 2. Product Positioning

### Product Thesis

Most governance stacks fail at one of two layers:

1. Analysis-heavy, execution-light systems (reports without action).
2. Execution-heavy, analysis-light systems (automation without deliberation quality).

Fission bridges both by coupling:
- multi-agent decision intelligence (deliberation quality), and
- prediction-market execution rails (timely action and accountability).

### Core Value Proposition

Fission turns governance from text-first coordination into signal-first operations:
- from proposal memo -> to measurable contract,
- from debate heat -> to costed belief,
- from advisory output -> to constrained execution.

## 3. Incubation and Ownership Context

This repository exists as a personal incubation workspace for an Arkenstone Labs product.

Purpose of this phase:
- reduce ambiguity before organization-level execution,
- prototype critical paths and failure modes,
- produce implementation artifacts that can be moved into Arkenstone Labs-controlled repositories.

Exit condition from incubation:
- architecture and risk model approved,
- v1 implementation scope locked,
- migration package ready (specs, backlog, runbooks, acceptance tests).

## 4. Strategic Objectives

1. Build a reliable "Price -> Action" governance interface.
2. Preserve high-quality deliberation through multi-agent intelligence.
3. Maintain settlement integrity through robust oracle/dispute mechanics.
4. Produce full accountability artifacts for every governance cycle.
5. Achieve repeatable signal quality over multiple N->P->A->O->N rounds.

## 5. Legacy Integration: IterateFast OP Framework -> Fission

### 5.1 What Was Proven Previously

From `IterateFast-Labs/OP_multi_agent_framework`, proven patterns include:

1. Proposal ingestion with structured context assembly.
2. Taxonomy-driven proposal classification.
3. Multi-expert turn-based deliberation (finance, technology, governance/compliance).
4. Statistical robustness via repeated scoring (G-Eval style iterations).
5. Traceability through transcript and per-agent metric logging.
6. Prompt/context evolution via update agents.

### 5.2 How It Maps into Fission

- Prior: recommendation-only decision framework.
- Fission: recommendation + market signal + execution trigger framework.

Legacy modules become first-class Fission subsystems:

1. `Proposal Intelligence Engine`
- Input normalization, URL/document ingestion, structured extraction.
- Classifies proposal domain and risk surface.

2. `Deliberation Engine`
- Specialized expert agents generate structured risk/opportunity views.
- Supports iterative challenge-response and confidence tracking.

3. `Statistical Decision Layer`
- Multi-pass scoring and confidence intervals.
- Produces machine-readable governance recommendation objects.

4. `Governance Memory & Trace Layer`
- Decision transcripts, rationale artifacts, and performance metrics.
- Feeds model calibration and post-settlement retrospectives.

5. `Execution Policy Layer` (New in Fission)
- Consumes market state + decision intelligence outputs.
- Applies bounded trigger logic to real operational levers.

## 6. Users and Jobs-to-be-Done

1. Governance Operators
- Need: fast, defensible decisions with clear execution conditions.

2. Forecasters/Traders
- Need: fair contracts, strong settlement rules, and meaningful liquidity.

3. Risk/Compliance Teams
- Need: full auditability, dispute process clarity, and abuse controls.

4. Product/Protocol Leads
- Need: decision intelligence connected to budget, roadmap, and rollout actions.

## 7. Product Principles

1. No triggerable market without explicit settlement schema.
2. No automation path without bounded action caps.
3. No recommendation without confidence and uncertainty metadata.
4. No governance cycle without immutable logs.
5. Noise must be economically expensive; useful signal must stay cheap.

## 8. System Architecture

### 8.1 High-Level Components

1. Proposal Intelligence Service (legacy-derived)
2. Multi-Agent Deliberation Service (legacy-derived)
3. Feasibility and Confidence Scoring Service (legacy-derived, extended)
4. Market Core (new)
5. Oracle and Dispute Core (new)
6. Trigger Policy Engine (new)
7. Responsibility Ledger and Analytics (new + legacy telemetry patterns)
8. Governance Console and Participant UI (new)

### 8.2 Core Data Entities

- Proposal
- ProposalClassification
- ProposalDigest
- AgentTranscript
- FeasibilityAssessment
- MarketDefinition
- Position
- LiquidityState
- SettlementRecord
- DisputeCase
- TriggerPolicy
- ActionExecutionRecord
- PostmortemArtifact

## 9. Governance Intelligence Layer (Detailed)

### 9.1 Proposal Ingestion and Structuring

Inputs:
- forum URL, RFC markdown, governance document, JSON payload.

Outputs:
- normalized proposal object,
- key quantitative data,
- stakeholder sentiment digest,
- unresolved-question list.

Acceptance criteria:
- parser extracts timeline, budget, KPI, and dependencies with >=95% field completeness on test corpus.

### 9.2 Multi-Agent Deliberation

Default expert set:
- Finance expert,
- Technical expert,
- Governance/compliance expert,
- optional Security and Ecosystem experts for specific domains.

Behavior:
- turn-based deliberation with shared context memory,
- explicit disagreement surfaces,
- confidence markers on each claim.

### 9.3 Statistical Scoring

- Run repeated evaluations for robustness (minimum 7, target 10).
- Produce median feasibility, variance, and confidence label.
- Track criterion-level scores:
  - evidence quality,
  - risk coverage,
  - implementation realism,
  - stakeholder impact,
  - governance-fit quality.

### 9.4 Adaptive Prompting / Perspective Updates

Legacy prompt-update behavior is retained but constrained:
- updates allowed only with explicit evidence of perspective shift,
- all prompt deltas logged and replayable,
- guardrails prevent ungrounded drift.

## 10. Market Layer (Detailed)

### 10.1 Contract Types

1. Binary (event yes/no)
2. Scalar (normalized metric payout)
3. Conditional comparative (policy A vs policy B outcome deltas)

### 10.2 Listing Criteria

A market is listable only when:
- settlement metric is externally auditable,
- data sources are published,
- dispute channel and collateral rules are pre-committed,
- action mapping class is declared (`informational`, `advisory-triggered`, `bounded-auto`).

### 10.3 Liquidity Design

- AMM baseline with optional order-book integration.
- dynamic incentive balancing for skewed sides.
- spread/depth monitors with subsidy adjustments.

## 11. Trigger Policy Engine (Price + Intelligence)

Fission trigger decisions combine:

1. Market Conditions
- price threshold,
- persistence window,
- minimum depth,
- volatility bound.

2. Intelligence Conditions
- feasibility median floor,
- confidence minimum,
- unresolved critical-risk count below threshold.

3. Integrity Conditions
- no active critical dispute,
- oracle source quorum satisfied.

### Trigger Output Classes

1. Advisory Output
- human governance action package with rationale.

2. Queued Action
- scheduled action with cancellation and review window.

3. Immediate Bounded Action
- capped parameter change with automatic post-check.

## 12. Oracle and Settlement

### 12.1 Source Model

- 3+ independent primary sources,
- fallback hierarchy,
- signed data snapshots.

### 12.2 Settlement Pipeline

1. close market,
2. publish candidate settlement,
3. open dispute window,
4. process bonded challenges,
5. finalize settlement,
6. execute slashing/reward outcomes.

### 12.3 Dispute Policy

- strict SLA targets,
- evidence requirements,
- transparent rulings with rationale archive.

## 13. Risk, Abuse, and Noise Controls

1. Commit-reveal mode for sensitive markets.
2. Stake minimums for high-impact actions.
3. Concentration and manipulation anomaly detection.
4. Circuit breakers for abnormal volatility spikes.
5. Anti-spam economic fees and cooldown windows.
6. Unpredictable snapshot bands where applicable.

## 14. Observability and Accountability

Artifacts produced every cycle:
- proposal digest,
- agent transcript,
- scoring distribution,
- market state history,
- settlement packet,
- trigger decision rationale,
- action execution record,
- post-settlement retrospective.

Key platform metrics:
- calibration (Brier, reliability curves),
- trigger precision/recall,
- dispute frequency and resolution latency,
- execution reversal rate,
- decision turnaround vs baseline process.

## 15. Compliance and Deployment Strategy

### Stage 1: Restricted Pilot

- low-externality governance domains only,
- controlled participant set,
- strict topic whitelist.

### Stage 2: Expanded Governance Domains

- broader policy/product decisions,
- stronger automation within bounded risk classes.

### Stage 3: Externalized Interface

- API integration for external governance systems,
- standardized audit export and compliance controls.

## 16. Implementation Plan

### Phase 0 (Weeks 1-3): Spec and Migration Prep

- finalize target architecture,
- define migration map from OP framework components,
- lock schemas for Proposal/Assessment/Trigger objects.

Deliverables:
- architecture decision record (ADR set),
- migration backlog,
- acceptance test inventory.

### Phase 1 (Weeks 4-8): Intelligence Core Port

- port proposal ingestion + classification flow,
- port multi-agent deliberation orchestrator,
- implement repeated scoring and confidence outputs.

Deliverables:
- running intelligence service,
- deterministic replay tests,
- baseline governance report API.

### Phase 2 (Weeks 9-14): Market and Settlement Core

- implement binary/scalar markets,
- integrate oracle adapters,
- implement dispute workflow.

Deliverables:
- end-to-end market lifecycle,
- settlement integrity tests,
- dispute simulation results.

### Phase 3 (Weeks 15-20): Trigger Engine + Action Connectors

- implement combined market+intelligence trigger evaluation,
- connect bounded actions (budget, rollout flags, parameter updates),
- enforce cancellation/review windows.

Deliverables:
- trigger policy compiler,
- action execution logs,
- rollback and safeguard tests.

### Phase 4 (Weeks 21-26): Pilot and Hardening

- run 2-3 governance domains,
- measure calibration and action quality,
- finalize transfer package for Arkenstone Labs org operations.

Deliverables:
- pilot report,
- v1.0 go/no-go decision,
- organization migration handoff docs.

## 17. Backlog Priorities (Top)

1. Proposal schema + ingestion adapters.
2. Agent orchestration runtime with transcript integrity.
3. Feasibility scoring service with confidence model.
4. Conditional market contract template.
5. Oracle adapter framework and dispute manager.
6. Trigger policy DSL and validator.
7. Action connector for treasury and release pipeline integration.
8. Audit explorer and export API.

## 18. Success Criteria

### Technical

- >99.5% successful settlement finalization in pilot.
- <2% critical trigger misfire rate in bounded action class.
- full replayability of decision artifacts for sampled cycles.

### Product

- >=30% reduction in governance decision latency vs baseline.
- measurable improvement in post-decision outcome quality.
- positive operator trust score for clarity and accountability.

### Organizational

- clean transfer from personal incubation to Arkenstone Labs org workflow.
- complete documentation for security, risk, and governance operations.

## 19. Open Questions

1. Which action classes are allowed for first public pilot?
2. What minimum confidence threshold is acceptable for queued execution?
3. Which governance domains should remain advisory-only regardless of score?
4. How should expert agent weighting differ by proposal category?

## 20. Final Statement

Fission is designed as a convergence layer between governance intelligence and execution-grade market signals. The product direction explicitly carries forward validated capabilities from the IterateFast Labs OP governance multi-agent work, while extending them into a full teleoplexy-style operational loop where decision quality, settlement integrity, and accountable execution are treated as one system.
