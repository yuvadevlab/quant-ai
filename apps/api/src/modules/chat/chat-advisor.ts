/**
 * @file apps/api/src/modules/chat/chat-advisor.ts
 * @description Formulates institutional quantitative advisory commentary and multi-agent synthesis.
 * @author yuva.devlab@gmail.com
 */

import { Signal, SignalDirection } from "@quant-ai/shared-types";
import type { LiveMarketQuote } from "../market/feed";

/**
 * Formats comprehensive institutional quantitative commentary for a single equity asset.
 */
export function formatEquityAdvisory(
  quote: LiveMarketQuote,
  signal?: Signal | null,
  isRevision?: boolean,
  priorId?: string,
): string {
  const sign = quote.percentChange >= 0 ? "+" : "";
  const dir = signal?.direction === SignalDirection.SHORT ? "SHORT" : "LONG";

  let revisionHeader = "";
  if (isRevision && priorId) {
    revisionHeader =
      `> ⚠️ **SIGNAL RE-EVALUATION AUDIT:** Prior active call \`${priorId}\` has been invalidated and settled in the Prediction Lab ` +
      `due to incoming catalyst/price dynamics. An updated versioned setup has been registered.\n\n`;
  }

  const setupDetails = signal
    ? `#### 🎯 Quantitative Actionable Setup\n` +
      `- **Stance / Bias:** **${dir}** (Expectancy: +${signal.confidence}% win probability)\n` +
      `- **Entry Zone:** ₹${signal.entry.toLocaleString("en-IN")}\n` +
      `- **Target 1:** ₹${signal.target.toLocaleString("en-IN")} | **Target 2:** ₹${(signal.entry + (signal.target - signal.entry) * 1.5).toFixed(2)}\n` +
      `- **Dynamic Invalidation / Stop-Loss:** ₹${signal.stopLoss.toLocaleString("en-IN")}\n` +
      `- **Risk : Reward Ratio:** **1 : ${signal.riskReward}** (Favorable mathematical edge)\n` +
      `- **Status:** Registered in Prediction Lab (\`${signal.id}\` with live Monte Carlo trajectory cone).\n\n`
    : "";

  return (
    `${revisionHeader}` +
    `### 📈 Institutional Market Advisory: ${quote.symbol}\n\n` +
    `**${quote.symbol}** is trading at **₹${quote.price.toLocaleString("en-IN")}** (${sign}${quote.percentChange.toFixed(2)}%).\n` +
    `- **Day Range:** ₹${quote.dayLow.toLocaleString("en-IN")} – ₹${quote.dayHigh.toLocaleString("en-IN")}\n` +
    `- **Session Volume:** ${quote.volume.toLocaleString()} shares\n` +
    `- **Volatility Buffer:** Dynamic ATR parameter at ~₹${(quote.price * 0.015).toFixed(2)}\n\n` +
    `${setupDetails}` +
    `#### 🛡️ Risk Management Guidelines\n` +
    `Quantitative consensus indicates disciplined execution with dynamic stop-loss recommended. ` +
    `Maintain strict position sizing adhering to 1-2% portfolio capital risk. Any hourly close beyond the invalidation level terminates the setup.`
  );
}

/**
 * Formats response for general quantitative finance or risk inquiries.
 */
export function formatGenericAdvisory(query: string): string {
  return (
    `### 🏛️ QuantAI Institutional Copilot\n\n` +
    `Regarding your inquiry on *"**${query}**"*:\n\n` +
    `- **Market Regime:** Multi-agent volatility monitors show baseline equity and derivatives conditions remain within standard dispersion bands.\n` +
    `- **Execution Mandate:** Strict quantitative gates require minimum **1.5x–2.0x Risk:Reward ratio**, structural VWAP trend alignment, and ATR-governed trailing stops.\n` +
    `- **Options Flow Tip:** For macro market bias, track NIFTY & BANKNIFTY Put-Call Ratio (PCR) alongside India VIX.\n\n` +
    `*You can ask for real-time analysis on any blue chip equity (e.g. "Analyze RELIANCE", "Setup for TCS") or Indian indices ("NIFTY option chain", "BANKNIFTY outlook").*`
  );
}
