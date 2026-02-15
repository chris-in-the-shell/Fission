# Teleoplex Protocol - Product Plan

Version: 1.0
Owner: Christopher Choi
Document Type: Implementation Product Plan
Status: Draft for Build Execution

## 1. Executive Summary

Teleoplex Protocol is a prediction-market-native governance and execution system that turns beliefs into measurable commitments and routes those commitments into real actions. The protocol implements a closed operational loop:

- Narrative (N): A proposal or thesis is articulated.
- Price (P): Market participants stake capital on outcome-linked contracts.
- Action (A): Pre-defined execution handles trigger based on market signals.
- Outcome (O): Real-world metrics are settled and verified.
- Narrative Update (N): The next cycle starts with updated priors.

The product objective is to make this loop operable, auditable, and safe enough for repeated use by teams, communities, and DAO-like organizations.

## 2. Product Vision and Strategic Thesis

### Vision
Build the default operational interface where organizations use market prices as decision inputs, not just forecasts.

### Strategic Thesis
Prediction markets become governance-grade when they include:

1. Settlable metric discipline.
2. Disputable oracle rails.
3. Execution handles tied to threshold logic.
4. Responsibility ledger for post-hoc accountability.
5. Noise filters and symmetric incentives to sustain signal quality.

### Non-Goals (Phase 1)

- Fully permissionless global retail launch.
- Cross-jurisdiction legal optimization for every country.
- High-leverage derivatives beyond bounded-risk contracts.

## 3. Problem Definition

### Core Problems

1. Decision systems rely on opinion-heavy documents and delayed reporting.
2. Existing prediction markets often stop at "informational" dashboards, without execution integration.
3. Thin liquidity and weak settlement rules can produce noisy, manipulable signals.
4. Teams lack standardized frameworks for converting price differences into policy/product actions.

### Target Outcome
A production platform where market-based signals can safely trigger constrained, pre-approved operational actions.

## 4. Product Scope

### In Scope (v1)

- Binary, scalar, and conditional market templates.
- Rules engine for threshold-based execution policies.
- Oracle module with multi-source settlement and dispute window.
- Reputation and stake requirements for market creators and disputers.
- Admin console, participant trading UI, audit and reporting dashboard.

### Out of Scope (v1)

- Anonymous cash rails built into protocol core.
- Native chain abstraction across many L1/L2s at launch.
- Fully autonomous treasury management beyond capped guardrails.

## 5. User Segments

1. Governance Operators
- DAO councils, protocol foundations, internal strategy teams.
- Need rapid, auditable decision support with execution linkages.

2. Market Makers / Liquidity Providers
- Professional or semi-professional participants.
- Need efficient spread capture with reliable settlement certainty.

3. Domain Forecasters
- Users with specialized information (product, compliance, growth, security).
- Need low-friction market participation with clear payoff semantics.

4. Observers / Auditors
- Community members, risk teams, external reviewers.
- Need transparent logs of proposals, prices, actions, and settlements.

## 6. Product Principles

1. Price is an input to execution, not entertainment.
2. Settlement rules are fixed before market opening.
3. Action triggers are bounded and reversible where possible.
4. Every major state transition is logged and auditable.
5. Noise must be more expensive than signal.
6. Participation is open by default but can be scoped for risk and compliance.

## 7. Functional Architecture

### 7.1 Modules

1. Market Definition Module
- Contract templates: binary, scalar, conditional.
- Parameters: close time, settlement source, dispute period, collateral requirements.

2. Trading Module
- AMM-first with optional order book extension.
- Slippage-aware execution.
- Position risk display and expected value visualization.

3. Liquidity & Incentive Module
- LP rewards with symmetry controls.
- Dynamic incentive boosts for underrepresented sides.
- Concentration risk alarms.

4. Oracle & Settlement Module
- Multi-source data adapters.
- Median/trimmed-mean settlement support.
- Challenge-dispute workflow with bonded collateral.

5. Execution Handle Module
- Price threshold and confidence gating.
- Mapped actions (budget unlock, feature rollout, parameter change request).
- Human-in-the-loop override options for selected action classes.

6. Responsibility Ledger Module
- Immutable event logs for proposal lifecycle.
- Signed execution records.
- Public artifact links (reports, data snapshots, postmortems).

7. Risk & Abuse Prevention Module
- Commit-reveal option for sensitive markets.
- Minimum stake/spam prevention.
- Cooldown windows and anti-cascade safeguards.

8. Admin & Policy Module
- Role-based controls.
- Topic eligibility and market listing policy.
- Emergency pause with transparent reason logging.

### 7.2 Data Model (Core Entities)

- Proposal
- Market
- Outcome Metric
- Oracle Source
- Settlement Report
- Dispute Case
- Position
- Liquidity Pool
- Execution Policy
- Trigger Event
- Action Record
- Audit Artifact

## 8. Market Design

### 8.1 Contract Types

1. Binary Contract
- Payout: 1 or 0 at settlement.
- Use case: deadline met / not met, adoption approved / not approved.

2. Scalar Contract
- Payout based on normalized metric range.
- Use case: growth rate, latency, uptime, incident frequency.

3. Conditional Contract (Futarchy-style)
- Parallel markets for policy A and policy B.
- Decision input: expected metric delta between conditions.

### 8.2 Listing Standards

A market can be listed only if:

1. Metric is externally observable or reproducibly computable.
2. Data source set is disclosed at open.
3. Settlement and dispute rules are pre-published.
4. Manipulation surface has explicit mitigations.
5. Action mapping is declared (informational vs triggerable).

## 9. Execution Framework (Price -> Action)

### 9.1 Trigger Policy Specification

Every triggerable market defines:

- Threshold: e.g., P(policy A improves KPI) >= 0.68 for 72h.
- Liquidity floor: minimum depth requirement.
- Volatility cap: trigger blocked if variance too high.
- Source confidence: oracle source quorum score.
- Action class: recommendation, queued execution, or immediate bounded execution.

### 9.2 Action Classes

1. Advisory
- Produces recommendation and rationale package.

2. Queued Execution
- Schedules action with delay and cancellation window.

3. Immediate Bounded Execution
- Applies pre-capped parameter changes automatically.

### 9.3 Example Trigger

- Condition: Conditional market price gap for policy A vs policy B >= 12 points for 5 consecutive days.
- Constraints: LP depth above threshold; no unresolved oracle dispute.
- Action: Release 20% milestone budget to team A and start 2-week monitored rollout.

## 10. Oracle and Settlement Design

### 10.1 Oracle Strategy

- Primary source set (3+ independent providers).
- Fallback source hierarchy.
- Timestamp and integrity proofs.

### 10.2 Settlement Lifecycle

1. Market closes.
2. Oracle reports candidate settlement value.
3. Dispute window opens.
4. Challenges require collateral bond.
5. Final settlement posted with source bundle.
6. Bond slashing/reward based on dispute outcome.

### 10.3 Dispute Governance

- Standard dispute SLA.
- Escalation panel (predefined signer set).
- Full public rationale and evidence archive.

## 11. Signal Quality and Noise Control

### Guardrails

1. Commit-reveal for pre-settlement order privacy.
2. Anti-whale concentration alerts and adaptive fees.
3. Time-window hardening (unpredictable snapshot bands).
4. Minimum economic stake for high-impact markets.
5. Cooldown and market circuit breakers in extreme volatility.

### Signal Health Metrics

- Spread stability.
- Depth by side.
- Price impact per unit notional.
- Information-to-volatility ratio.
- Post-settlement calibration accuracy.

## 12. Incentive Design

### Participant Incentives

- Traders: alpha from better information.
- LPs: fee revenue and rebalancing rewards.
- Oracles: service rewards plus reputation score.
- Disputers: successful challenge rewards.

### Symmetric Incentive Controls

- Dynamic rewards for underrepresented side liquidity.
- Maximum dominance caps for subsidized rewards.
- Time-decayed reward multipliers to prevent subsidy farming.

## 13. Security and Abuse Resistance

### Technical Security

1. Contract-level formal verification for core payout logic.
2. Independent audits before mainnet launch.
3. Runtime monitoring for anomalous order flow.
4. Key management via multisig and hardware-backed signers.

### Governance Security

1. Role separation for listing, settlement, and treasury actions.
2. Emergency halt with automatic public disclosure.
3. Post-incident review requirements with remediation deadlines.

## 14. Compliance and Legal Readiness

### Approach

- Deploy in stages with policy-scoped market domains.
- Restrict prohibited categories by jurisdictional policy engine.
- Maintain clear disclosures on market purpose, risk, and limitations.

### Operational Controls

- Terms of use and market eligibility rules.
- Regional participation controls where required.
- Record retention for governance and dispute events.

## 15. User Experience Plan

### Participant UX

- Fast market discovery by domain and actionability.
- Transparent contract specs and settlement sources.
- Position simulator with scenario outcomes.
- Clear fee/slippage estimates before execution.

### Governance UX

- Proposal-to-market wizard.
- Trigger policy builder with simulation mode.
- Action history timeline and exception reports.

### Audit UX

- Read-only explorer for proposal lifecycle.
- Source-linked settlement records.
- Exportable accountability reports.

## 16. Technical Stack (Recommended)

### On-Chain / Execution

- EVM-compatible chain (initially one environment).
- Smart contracts in Solidity.
- Foundry for testing and deployment scripts.

### Off-Chain Services

- TypeScript services for oracle adapters and policy engine.
- PostgreSQL for analytics and reporting cache.
- Event indexer for protocol logs.

### Frontend

- React + Next.js.
- Wallet integration with role-aware workflows.
- Visualization layer for market and trigger analytics.

### DevOps

- CI pipelines for test, lint, audit checks.
- Staging/mainnet release gates.
- Observability stack (metrics, logs, alerts).

## 17. Delivery Roadmap

### Phase 0: Foundation (Weeks 1-4)

- Finalize market specification schema.
- Define oracle source policy and dispute SLA.
- Build product requirement baseline and acceptance tests.

### Phase 1: Core Market MVP (Weeks 5-10)

- Implement binary and scalar market contracts.
- Build basic AMM trading flow and LP positions.
- Launch alpha admin console and participant UI.

### Phase 2: Conditional Markets + Execution Hooks (Weeks 11-16)

- Implement parallel conditional market templates.
- Build trigger policy engine and advisory actions.
- Add accountability ledger and export reports.

### Phase 3: Settlement Hardening (Weeks 17-22)

- Add multi-source oracle aggregation.
- Implement dispute bonds and challenge workflow.
- Add circuit breakers and concentration alerts.

### Phase 4: Governance Pilot (Weeks 23-28)

- Run pilot with 2-3 real decision domains.
- Measure calibration, action latency, and policy outcomes.
- Publish pilot report and v2 adjustments.

## 18. KPI Framework

### Product KPIs

- Number of active markets per month.
- Share of markets linked to execution handles.
- Median time from proposal to settled outcome.
- User retention among informed forecasters.

### Signal KPIs

- Brier score / calibration quality.
- Settlement dispute rate.
- Manipulation incident frequency.
- Informational efficiency (spread-depth quality index).

### Governance KPIs

- Decision turnaround time reduction.
- Post-decision reversal rate.
- Outcome improvement vs baseline process.

## 19. Testing and Validation Plan

### Pre-Launch

1. Unit and integration tests for all payout paths.
2. Adversarial simulation for manipulation and oracle failures.
3. Economic stress tests for liquidity shocks.
4. End-to-end trigger-action sandbox testing.

### Pilot Validation

1. Compare market signals vs expert baselines.
2. Analyze trigger precision and false positives.
3. Review all disputes and policy exceptions.
4. Evaluate participant incentives for gaming behavior.

## 20. Risks and Mitigations

1. Illiquidity Risk
- Mitigation: seeded LP programs and dynamic incentive symmetry.

2. Oracle Failure Risk
- Mitigation: multi-source median settlement and bonded disputes.

3. Narrative Cascade Risk (signal-noise collapse)
- Mitigation: commit-reveal, circuit breakers, variance gates.

4. Regulatory Risk
- Mitigation: domain restrictions, staged rollout, legal review checkpoints.

5. Governance Capture Risk
- Mitigation: role separation, transparent logs, public postmortems.

## 21. Operating Model

### Team Structure

- Product Lead (strategy and roadmap)
- Protocol Engineer(s)
- Backend/Oracle Engineer(s)
- Frontend Engineer(s)
- Quant/Risk Analyst
- Governance Operations Manager
- Security Lead

### Decision Cadence

- Weekly product/risk review.
- Bi-weekly market health review.
- Monthly governance transparency report.

## 22. Launch Strategy

### Pilot First

- Start with low-externality domains: release planning, reliability metrics, resource allocation priorities.
- Avoid politically sensitive categories in initial public communication.

### Expansion Criteria

- Stable calibration quality across 3+ cycles.
- Dispute system functioning within SLA.
- No unresolved critical severity incidents.

## 23. Documentation Deliverables

1. Protocol Spec
2. Market Listing Policy
3. Settlement & Dispute Manual
4. Trigger Policy Guide
5. Security Runbook
6. Governance Transparency Template

## 24. 90-Day Action Checklist

1. Lock v1 scope and architecture.
2. Stand up contract repo and test harness.
3. Implement binary/scalar contracts.
4. Build oracle adapter MVP.
5. Ship trading UI alpha.
6. Release trigger simulation dashboard.
7. Run closed pilot market set.
8. Publish first accountability report.
9. Incorporate findings into v1.1 plan.

## 25. Final Statement

Teleoplex Protocol should be built as an operations-grade market system where capital-weighted beliefs become accountable execution signals. The implementation priority is not speculation volume but decision quality under clear settlement rails. If the platform enforces metric discipline, oracle integrity, bounded automation, and transparent responsibility logs, the N->P->A->O->N loop can move from theory into repeatable organizational practice.
