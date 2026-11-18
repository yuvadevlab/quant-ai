# 00 — Overview: Product Vision & Regulatory Boundaries

**Author:** `yuva.devlab@gmail.com`  
**Parent Index:** [docs/INDEX.md](../INDEX.md)

---

## 1. Product Vision

QuantAI is an institutional-grade financial market intelligence, predictive analytics, and quantitative trading workstation. It acts as an autonomous operating system for traders, quants, and active market participants.

### Core Value Propositions

1. **Unbiased Predictive Tracking**: Evaluates every AI-generated trade hypothesis independently through the **Prediction Lab**, measuring directional accuracy, Maximum Favorable Excursion (MFE), and probability calibration (Brier score).
2. **Transparent Multi-Agent Deliberation**: Exposes the distinct perspectives of specialized agents (Technical, Quant, News, and Risk) rather than forcing synthetic consensus.
3. **Deterministic Grounding**: LLMs analyze market context and reason about hypotheses, but all indicators, price feeds, calculations, and risk metrics are computed by deterministic software.

---

## 2. Regulatory Boundaries & Compliance (SEBI / Indian Context)

- **Research Analyst & Investment Advisory Guardrails**:
  - QuantAI is an analytical workstation and self-directed simulation platform.
  - All recommendations, confidence scores, and signals are simulation hypotheses and mathematical model outputs. They do NOT constitute guaranteed SEBI-registered investment advice.
- **Air-Gapped Order Placement**:
  - No language model has autonomous or unmoderated access to live broker execution APIs.
  - Execution requires strict pre-trade risk engine validation and explicit user sign-off.
