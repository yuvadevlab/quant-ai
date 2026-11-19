# 12 — Architectural Decision Records (ADRs)

**Author:** `yuva.devlab@gmail.com`  
**Parent Index:** [docs/INDEX.md](../../INDEX.md)

---

## 1. ADR Index

- [ADR-001: TanStack Start Fullstack Workstation Architecture](#adr-001-tanstack-start-fullstack-workstation-architecture)
- [ADR-002: Pure Platform CSS & Design Tokens over Utility CSS Frameworks](#adr-002-pure-platform-css--design-tokens-over-utility-css-frameworks)
- [ADR-003: Prediction Lab Isolation from Live Broker Execution](#adr-003-prediction-lab-isolation-from-live-broker-execution)

---

## ADR-001: TanStack Start Fullstack Workstation Architecture

- **Status**: Accepted
- **Context**: Needed an ultra-fast, type-safe fullstack React 19 environment with high-performance SSR and streaming data support.
- **Decision**: Adopt TanStack Start with Vite and Nitro runtime.
- **Consequences**: Type-safe routing across all pages, sub-second HMR, and unified backend route handlers without needing separate frontend and backend deployments for the workstation.

---

## ADR-002: Pure Platform CSS & Design Tokens over Utility CSS Frameworks

- **Status**: Accepted
- **Context**: Third-party utility CSS frameworks bloat JSX markup with repetitive class chains, compromise institutional density, and violate Yuva DevLab ecosystem invariants.
- **Decision**: Standardize on W3C Cascade Layers (`@layer dl-tokens`, `@layer dl-components`, `@layer dl-utilities`) powered by `@yuva-devlab/tokens` brand theme.
- **Consequences**: Clean JSX markup, purpose-revealing semantic CSS classes, and seamless multi-theme switching.

---

## ADR-003: Prediction Lab Isolation from Live Broker Execution

- **Status**: Accepted
- **Context**: Direct broker execution introduces severe regulatory (SEBI), capital, and operational liabilities prematurely.
- **Decision**: Architect the **Prediction Lab** as an independent evaluation engine that logs, tracks, and scores predictions on simulated paper data first.
- **Consequences**: Proves AI model expectancy, MFE/MAE, and Brier calibration before any real capital is exposed.
