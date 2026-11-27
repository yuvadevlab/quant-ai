# 05 — Data & Database Architecture

**Author:** `yuva.devlab@gmail.com`
**Parent Index:** [docs/INDEX.md](../INDEX.md)

---

## 1. Storage Tiers

| Data Category                    | Target Store                                   | Runtime behavior                                                                                                                                                            |
| -------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Instrument universe              | PostgreSQL                                     | Stores symbols and descriptive metadata used to resolve scan candidates.                                                                                                    |
| Service and market configuration | PostgreSQL `SystemConfig`                      | Stores adjustable configuration values; existing market breadth and sector thresholds use this table. Prediction-specific service controls are not yet exposed in Settings. |
| Research runs                    | PostgreSQL `ResearchRun`                       | Append-only record per scan attempt, including no-result attempts, selected mode/horizon, data status, source, observation time, and a compact evidence snapshot.           |
| Prediction ledger                | PostgreSQL `Prediction`                        | Stores the issued call and its input provenance. Outcome fields are written only after a verified observation settles the call.                                             |
| Live quotes and ticks            | Provider response, process memory, Redis cache | Fetched on demand and cached briefly for serving; the active pipeline does not write tick history or OHLCV bars to PostgreSQL.                                              |

The schema still contains legacy market-price columns and an unused `MarketTick` model. They have no active tick-history writer; removing them requires a separate data-retention decision and migration review. Do not treat those legacy fields as an approved market-data warehouse.

## 2. Core Entities & Schema Boundaries

### 2.1 ResearchRun

- One record represents one analysis request, whether or not a prediction was emitted.
- Stores symbol(s), service mode, horizon, result, source and verification status, observation time, reference price, and a compact JSON evidence snapshot.
- Does not store provider payloads, quote history, or OHLCV candles.
- Research runs are append-only and form the audit history for future outcome analysis.

### 2.2 Prediction

- Stores the issued direction, strategy, asset class, horizon, entry, target, stop, heuristic score, thesis, and the source/status/time of its input quote.
- A prediction is not an execution or a recommendation to place an order.
- `metricEligible` is false by default. Only a terminal outcome observed from data marked `VERIFIED` is eligible for win-rate and profit-factor calculations.
- Provider-unverified, stale, simulated, and unavailable observations cannot settle calls or contribute to performance metrics.
- The recorded outcome price and observation time are retained for auditability; routine market ticks are not persisted.

### 2.3 Provider and capability limits

- The current Yahoo Finance adapter supplies a daily quote and is marked provider-unverified. It does not provide verified options-chain data or the intraday history required for scalp calls.
- Options-chain and scalp services must remain unavailable until suitable provider coverage and contract-specific outcome tracking exist.
- The monitor hides chart history when provider-supplied OHLC data is unavailable rather than fabricating candles or accuracy statistics.

### 2.4 Financial Number Invariant

- Financial prices, P&L amounts, and margins are stored as numeric values. Before relying on these values for risk calculations, use decimal-safe arithmetic or explicitly account for floating-point precision.
