# 05 — Data & Database Architecture

**Author:** `yuva.devlab@gmail.com`  
**Parent Index:** [docs/INDEX.md](../INDEX.md)

---

## 1. Storage Tiers

| Data Category              | Target Store      | Retention Policy      | Schema / Access Pattern                           |
| -------------------------- | ----------------- | --------------------- | ------------------------------------------------- |
| **Instrument Master**      | PostgreSQL (Neon) | Permanent             | Keyed by ISIN / Exchange Token / Trading Symbol   |
| **Prediction Ledger**      | PostgreSQL (Neon) | Permanent (Immutable) | Append-only rows with state revision pointers     |
| **Live Tick Cache**        | Upstash Redis     | Ephemeral (TTL 24h)   | In-memory sorted sets / hashes                    |
| **OHLCV Candles**          | PostgreSQL (Neon) | Partitioned by Month  | High-speed range queries for charts & backtesting |
| **Audit & Reasoning Logs** | PostgreSQL (Neon) | 1 Year                | Structured JSONB event logs                       |

---

## 2. Core Entities & Schema Boundaries

### 2.1 Prediction Entity

- `prediction_id`: Unique string identifier (`PRED-XXXX`).
- `instrument_token`: Symbol or derivative token.
- `direction`: `LONG` | `SHORT`.
- `entry_target_min` / `entry_target_max`: Numerical range for limit fill.
- `target_price`: Profit taking level.
- `stop_loss`: Invalidation price.
- `horizon_minutes`: Time to live.
- `confidence_score`: Float between 0.00 and 1.00.
- `calibrated_probability`: Post-hoc model calibration score.
- `mfe_points`: Observed maximum favorable excursion.
- `mae_points`: Observed maximum adverse excursion.
- `status`: `ACTIVE` | `TARGET_HIT` | `STOP_HIT` | `EXPIRED` | `INVALIDATED`.

### 2.2 Financial Number Invariant

- Financial prices, P&L amounts, and margins are stored as **fixed-point decimals** (e.g. `DECIMAL(12, 4)`) or integer cents/paise to eliminate precision loss.
