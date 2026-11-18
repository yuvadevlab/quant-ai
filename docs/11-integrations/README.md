# 11 — Market Data Providers & Broker Integrations

**Author:** `yuva.devlab@gmail.com`  
**Parent Index:** [docs/INDEX.md](../INDEX.md)

---

## 1. Indian Market Data Hierarchy

To balance zero-cost development with real-market accuracy, data ingestion is structured in tiers:

| Tier                                 | Provider                                                | Cost            | Use Case                                                       |
| ------------------------------------ | ------------------------------------------------------- | --------------- | -------------------------------------------------------------- |
| **Tier 1 (Dev & Testing)**           | In-Memory Mock Feed & Recorded Tick Sets                | $0              | Unit tests, UI layout verification, offline development        |
| **Tier 2 (EOD & Fundamentals)**      | Yahoo Finance (`yfinance`) / Public BSE Announcements   | $0              | Historical daily candles, fundamental ratios, PE/PB            |
| **Tier 3 (Paper Trading Real-Time)** | Broker WebSocket Feeds (Upstox / Dhan / Zerodha)        | ~$0 - ₹2,000/mo | Live 1-second ticks for subscribed symbols during market hours |
| **Tier 4 (Institutional Licensed)**  | Authorized NSE Data Vendors (TruData, Global DataFeeds) | Paid            | Tick-by-tick order book depth (L2/L3)                          |

---

## 2. Broker Execution Adapter Roadmap (Phase 3+)

- **Zerodha Kite Connect**: Standard Node.js SDK for positions and orders.
- **Upstox API v2**: Modern REST & WebSocket endpoints with protobuf compression.
- **DhanHQ API**: Low-latency options-focused trading APIs.
- **Angel One SmartAPI**: High-rate-limit historical candles and live streaming.
