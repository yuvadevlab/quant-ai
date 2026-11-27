# QuantAI Quantitative Compute Engine

**Author:** `yuva.devlab@gmail.com`  
**Runtime:** Python 3.12 + FastAPI + NumPy + SciPy

---

## 1. Overview

The `quant-engine` service provides high-performance vectorized mathematical algorithms for QuantAI:

- **Monte Carlo Simulations**: Vectorized Geometric Brownian Motion price trajectory projections.
- **Options Greeks**: Black-Scholes analytical pricing, implied volatility solvers (Newton-Raphson).
- **Statistical Regime Analysis**: GARCH volatility clustering and cointegration testing.

---

## 2. Local Setup with `uv`

```bash
cd services/quant-engine

# Create virtual environment and install dependencies
uv sync

# Run the FastAPI development server (port resolved from workspace .env)
uv run python -m src.main
```

Verify health:

```bash
curl http://localhost:8005/health
```
