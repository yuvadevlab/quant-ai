# 01 — Functional & Non-Functional Requirements

**Author:** `yuva.devlab@gmail.com`  
**Parent Index:** [docs/INDEX.md](../INDEX.md)

---

## 1. Functional Requirements

### 1.1 Market Intelligence & Overview Desk

- Live ticker strip displaying key benchmark indices (`NIFTY 50`, `BANKNIFTY`, `FINNIFTY`, `SENSEX`, `BRENT CRUDE`, `INDIA VIX`).
- Real-time SVG sparkline visualizations showing price trajectories and intraday changes.
- Market breadth indicators (Advance/Decline ratio, New Highs/Lows, Sector Heatmaps).

### 1.2 Prediction Lab & Trajectory Monitor

- Immutable prediction records with unique IDs (e.g. `PRED-8942`).
- Precise evaluation of equity cash, futures, and specific options contracts (e.g. `BANKNIFTY 50000 CE` premium tracking).
- Quantitative metrics:
  - **MFE (Maximum Favorable Excursion)**: Highest profit potential during the trade horizon.
  - **MAE (Maximum Adverse Excursion)**: Deepest drawdown experienced before resolution.
  - **Fill Rate**: Percentage of predictions where limit price was achieved.
  - **Brier Score / Confidence Calibration**: Verifying if an 80% confidence prediction actually succeeds 80% of the time.

### 1.3 Quant Screener

- Multi-dimensional filtering across momentum, volatility regime, volume surge, and RSI.
- Rapid switching between equities, futures, and index options.

### 1.4 AI Copilot & Multi-Agent Deliberation

- Specialized personas: Technical Analyst, Quant Analyst, Risk Validator.
- Transparent step-by-step reasoning and explicit invalidation criteria.

---

## 2. Non-Functional Requirements

- **Financial Decimal Precision**: Fixed-point representations (2 to 4 decimal places) for prices and currencies; zero floating-point accumulation errors.
- **Latency**: Sub-100ms render updates on WebSocket market feed events.
- **Modularity**: Strict 250-line maximum per source file in `src/`.
- **Zero-Budget First**: Deployable on free-tier infrastructure (Cloud Run, Neon, Cloudflare R2/Pages).
