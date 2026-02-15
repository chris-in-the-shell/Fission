# Fission

Fission is a product initiative by **Arkenstone Labs**.

This repository is maintained under a personal account as a pre-organization incubation workspace to:
- design the product architecture,
- validate key assumptions,
- and prototype selected features before full organizational execution.

The intent is to transfer and scale this work into formal Arkenstone Labs workflows after initial validation.

## Current Scope

- Detailed product planning (`PRODUCT_PLAN.md`)
- Core implementation for proposal ingestion, deliberation orchestration, market listing validation, oracle aggregation, and trigger policy DSL
- Integration blueprint for prior governance tooling patterns
- dApp scaffold with contracts and web client (`contracts`, `apps/web`)

## Workspace Layout

- `src`: Core TypeScript modules and validators
- `tests`: Core module test suite (Vitest)
- `contracts`: Hardhat workspace for on-chain market contracts
- `apps/web`: Web dApp scaffold (Vite + React + wagmi)

## Development Quickstart

```bash
npm install
npm test
npm run build:core
npm run build:contracts
npm run build:web
```

```bash
# Run web client
npm run dev:web
```

## Origin Context

Part of the planning references lessons from prior governance tooling developed during the IterateFast Labs era, especially:
- <https://github.com/IterateFast-Labs/OP_multi_agent_framework>

Those patterns are being adapted into Fission as decision-intelligence and governance automation components.
