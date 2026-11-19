# 10 — API Contracts & WebSocket Protocols

**Author:** `yuva.devlab@gmail.com`  
**Parent Index:** [docs/INDEX.md](../INDEX.md)

---

## 1. REST Endpoints (Internal Fullstack Gateway)

### 1.1 Market Feed

- `GET /api/market/indices` — Returns real-time quotes, intraday deltas, and sparkline points for benchmarks.
- `GET /api/market/ticker` — Returns the continuous scrolling ticker payload.

### 1.2 Predictions & Signals

- `GET /api/predictions` — Returns active, resolved, and historical predictions with filter parameters.
- `GET /api/predictions/:id` — Returns comprehensive details for a specific prediction (trajectory cone, agent reasoning breakdown, MFE/MAE stats).

### 1.3 Quant Screener

- `POST /api/screener/query` — Executes multi-variable screener filter over the universe.

---

## 2. WebSocket Protocol (Real-Time Stream)

### Client Connection:

`ws://localhost:3005/ws/market`

### Event Types:

- `TICK_UPDATE`: Emits high-frequency price changes for watched instruments.
- `SIGNAL_CREATED`: Emits newly published AI prediction hypotheses.
- `PREDICTION_STATUS_CHANGE`: Emits state transitions (`TARGET_HIT`, `STOP_HIT`, `INVALIDATED`).
