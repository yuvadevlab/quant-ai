# 08 — Quality Engineering & Security Safeguards

**Author:** `yuva.devlab@gmail.com`  
**Parent Index:** [docs/INDEX.md](../INDEX.md)

---

## 1. Automated Testing Pyramid

1. **Unit Tests (Vitest)**:
   - High test coverage on pure calculation functions (MFE/MAE, P&L, confidence intervals, sparkline path generation).
   - Fast, in-memory execution (< 1 second total runtime).
2. **Integration Tests (Vitest & React Testing Library)**:
   - Route resolution, data store subscriptions, and UI copy catalog mappings.
3. **End-to-End & Visual Regression (Browser Subagent / Playwright)**:
   - Visual verification of workstation shell across full desktop (1920x1080) and responsive breakpoints.
   - Collapse/expand state preservation.

---

## 2. Security Safeguards

- **No Exposed Secrets**: Zero hardcoded API keys, JWT secrets, or connection strings in code or documentation. All secrets read from environment variables at runtime.
- **Dependency Auditing**: Automated Dependabot and pnpm supply chain verification.
- **Air-Gapped Capital**: Autonomous execution against live broker order endpoints is strictly blocked.
