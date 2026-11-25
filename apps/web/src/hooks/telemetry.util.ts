/**
 * @file src/hooks/telemetry.util.ts
 * @description Pure mathematical calculation engine for signal hit rates, excursions, and telemetry.
 * @author yuva.devlab@gmail.com
 */

import type { Signal } from "@/components/quantai/data";
import { UiSignalStatus } from "@/components/quantai/data";

export interface WorkstationTelemetry {
  readonly totalSignals: number;
  readonly activeCount: number;
  readonly targetHitCount: number;
  readonly stopHitCount: number;
  readonly winRatePercent: string;
  readonly winRateBadge: string;
  readonly profitFactor: string;
  readonly riskReward: string;
  readonly avgGainText: string;
  readonly avgLossText: string;
  readonly holdingHint: string;
}

/**
 * Computes live mathematical hit-rate, excursions, risk-reward, and outcome telemetry from verified signal ledger.
 */
export function calculateSignalsTelemetry(
  allSignals: readonly Signal[] = [],
): WorkstationTelemetry {
  const activeCount = allSignals.filter((s) => s.status === UiSignalStatus.ACTIVE).length;
  const targetHitCount = allSignals.filter((s) => s.status === UiSignalStatus.TARGET_HIT).length;
  const stopHitCount = allSignals.filter((s) => s.status === UiSignalStatus.STOP_HIT).length;
  const settled = targetHitCount + stopHitCount;
  const winRateNumber = settled > 0 ? (targetHitCount / settled) * 100 : 0;

  let totalGainPct = 0;
  let gainCount = 0;
  let totalLossPct = 0;
  let lossCount = 0;
  let totalRR = 0;
  let rrCount = 0;

  for (const s of allSignals) {
    const entry = s.entryPrice || parseFloat(String(s.entry).replace(/[^0-9.-]/g, ""));
    const t1 = parseFloat(String(s.target1).replace(/[^0-9.-]/g, ""));
    const sl = parseFloat(String(s.stop).replace(/[^0-9.-]/g, ""));

    if (entry > 0 && t1 > 0) {
      totalGainPct += ((t1 - entry) / entry) * 100;
      gainCount++;
    }
    if (entry > 0 && sl > 0) {
      totalLossPct += Math.abs((entry - sl) / entry) * 100;
      lossCount++;
    }

    const reward = Math.abs(t1 - entry);
    const risk = Math.max(0.01, Math.abs(entry - sl));
    if (entry > 0 && reward > 0 && risk > 0) {
      totalRR += reward / risk;
      rrCount++;
    }
  }

  const avgGain = gainCount > 0 ? (totalGainPct / gainCount).toFixed(1) : "0.0";
  const avgLoss = lossCount > 0 ? (totalLossPct / lossCount).toFixed(1) : "0.0";

  // Dynamic profit factor calculation: Gross Profits / Gross Losses
  let profitFactor = "0.00";
  if (lossCount === 0 && gainCount > 0) {
    profitFactor = (totalGainPct / gainCount).toFixed(2);
  } else if (totalLossPct > 0) {
    profitFactor = (totalGainPct / totalLossPct).toFixed(2);
  }

  // Dynamic Risk-Reward ratio
  const avgRR = rrCount > 0 ? (totalRR / rrCount).toFixed(2) : "2.50";

  // Dynamic Win Rate Badge (alpha or momentum relative to 50% baseline)
  let winRateBadge = "+0.0% THIS MONTH";
  if (settled > 0) {
    const delta = winRateNumber - 50;
    winRateBadge = `${delta >= 0 ? "+" : "−"}${Math.abs(delta).toFixed(1)}% THIS MONTH`;
  }

  // Dynamic holding / horizon hint derived from actual signal distribution
  const intradayCount = allSignals.filter((s) => s.horizon === "Intraday").length;
  const swingCount = allSignals.filter((s) => s.horizon === "Swing").length;
  const optionsCount = allSignals.filter((s) => s.horizon === "Options").length;
  const horizonParts: string[] = [];
  if (intradayCount > 0) horizonParts.push(`${intradayCount} Intraday`);
  if (swingCount > 0) horizonParts.push(`${swingCount} Swing`);
  if (optionsCount > 0) horizonParts.push(`${optionsCount} Options`);
  const holdingHint =
    horizonParts.length > 0 ? `Active: ${horizonParts.join(" · ")}` : "Horizon: Intraday · Swing";

  return {
    totalSignals: allSignals.length,
    activeCount,
    targetHitCount,
    stopHitCount,
    winRatePercent: `${winRateNumber.toFixed(1)}%`,
    winRateBadge,
    profitFactor,
    riskReward: `1 : ${avgRR}`,
    avgGainText: `+${avgGain}% avg gain`,
    avgLossText: `−${avgLoss}% avg loss`,
    holdingHint,
  };
}
