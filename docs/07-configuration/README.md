# 07 — Central Configuration Control Plane

**Author:** `yuva.devlab@gmail.com`  
**Parent Index:** [docs/INDEX.md](../INDEX.md)

---

## 1. Zero-Deployment Configuration Changes

Business parameters, risk rules, and screener thresholds must be dynamically configurable at runtime without triggering source-code redeployments or container restarts.

### 2. Configuration Domains

| Domain                 | Configurable Parameters                                                                   | Storage / Propagation              |
| ---------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------- |
| **AI Model Providers** | Model names (e.g. Gemini 1.5 Pro, Flash, Claude, Local Ollama), temperature, token limits | Neon Config Table / Redis Cache    |
| **Risk Limits**        | Minimum R:R ratio, maximum risk per prediction, max portfolio leverage                    | In-Memory Engine with DB fallback  |
| **Market Sessions**    | Trading hours, holidays, pre-market settlement intervals                                  | Static Calendar with DB overrides  |
| **Feature Flags**      | Prediction Lab live stream, Options chain view, Copilot deliberation trace                | Environment-isolated boolean flags |
| **Screener Filters**   | Default RSI thresholds, minimum average daily volume, breakout thresholds                 | User preferences / App presets     |

---

## 3. Auditing & Versioning

- Every configuration change is recorded with:
  - Timestamp.
  - Previous value & New value.
  - Author identity.
  - Rollback identifier.
