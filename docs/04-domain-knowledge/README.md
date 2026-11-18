# 04 — Financial Domain Knowledge & Quantitative Metrics

**Author:** `yuva.devlab@gmail.com`  
**Parent Index:** [docs/INDEX.md](../INDEX.md)

---

## 1. Indian Financial Market Mechanics (NSE / BSE)

### Trading Sessions (IST, UTC+5:30)

- **Pre-Open**: 09:00 - 09:08 (Order collection & price discovery).
- **Regular Market**: 09:15 - 15:30.
- **Post-Market / Closing**: 15:40 - 16:00.

### Major Benchmarks & Derivatives

- **NIFTY 50**: Flagship National Stock Exchange weighted index.
- **BANKNIFTY**: 12 most liquid Indian banking stocks. Highest retail options trading volume.
- **Weekly & Monthly Expiries**:
  - Index and stock options expire on contract-specific Thursdays or designated settlement cycles.
  - Tracking options requires monitoring the **premium price of the exact derivative contract**, not simply the spot index level.

---

## 2. Quantitative Prediction Metrics

### Maximum Favorable Excursion (MFE)

- The maximum unrealized profit reached by the asset during the trade life cycle before exit or expiration.
- Formula:
  $$\text{MFE}_{\text{Long}} = \max(P_t - P_{\text{entry}}) \quad \forall t \in [t_{\text{entry}}, t_{\text{exit}}]$$

### Maximum Adverse Excursion (MAE)

- The maximum unrealized loss (drawdown) experienced during the trade life cycle.
- Formula:
  $$\text{MAE}_{\text{Long}} = \max(P_{\text{entry}} - P_t) \quad \forall t \in [t_{\text{entry}}, t_{\text{exit}}]$$

### Confidence Calibration & Brier Score

- Measures the accuracy of probabilistic predictions:
  $$\text{BS} = \frac{1}{N} \sum_{t=1}^N (f_t - o_t)^2$$
  where $f_t$ is forecasted probability and $o_t \in \{0, 1\}$ is actual outcome.
- A well-calibrated AI model yields a Brier score approaching 0.
