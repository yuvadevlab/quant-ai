/**
 * @file src/hooks/telemetry.util.ts
 * @description Pure mathematical calculation engine for signal hit rates, excursions, and telemetry.
 */

import type { Signal } from "@/components/quantai/data";
import { UiSignalStatus } from "@/components/quantai/data";
import { PREDICTIONS_COPY } from "@/lib/ui-copy/predictions.copy";

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
  const eligible = allSignals.filter(
    (signal) =>
      signal.metricEligible === true &&
      (signal.status === UiSignalStatus.TARGET_HIT || signal.status === UiSignalStatus.STOP_HIT) &&
      typeof signal.outcomePrice === "number" &&
      signal.entryPrice > 0,
  );
  const eligibleWins = eligible.filter((s) => s.status === UiSignalStatus.TARGET_HIT).length;
  const eligibleLosses = eligible.filter((s) => s.status === UiSignalStatus.STOP_HIT).length;
  const eligibleSettled = eligibleWins + eligibleLosses;
  const targetHitCount = eligibleWins;
  const stopHitCount = eligibleLosses;
  const winRateNumber = eligibleSettled > 0 ? (eligibleWins / eligibleSettled) * 100 : 0;

  let grossGainPct = 0;
  let grossLossPct = 0;
  let totalGainPct = 0;
  let gainCount = 0;
  let totalLossPct = 0;
  let lossCount = 0;
  let totalRR = 0;
  let rrCount = 0;

  for (const s of eligible) {
    const pnlPct =
      (((s.outcomePrice ?? s.entryPrice) - s.entryPrice) / s.entryPrice) *
      (s.direction === "BUY" ? 1 : -1) *
      100;
    if (pnlPct > 0) {
      grossGainPct += pnlPct;
      totalGainPct += pnlPct;
      gainCount++;
    } else if (pnlPct < 0) {
      grossLossPct += Math.abs(pnlPct);
      totalLossPct += Math.abs(pnlPct);
      lossCount++;
    }
  }

  for (const s of allSignals) {
    const entry = s.entryPrice || parseFloat(String(s.entry).replace(/[^0-9.-]/g, ""));
    const t1 = parseFloat(String(s.target1).replace(/[^0-9.-]/g, ""));
    const sl = parseFloat(String(s.stop).replace(/[^0-9.-]/g, ""));

    const reward = Math.abs(t1 - entry);
    const risk = Math.max(0.01, Math.abs(entry - sl));
    if (entry > 0 && reward > 0 && risk > 0) {
      totalRR += reward / risk;
      rrCount++;
    }
  }

  const avgGain =
    gainCount > 0
      ? `+${(totalGainPct / gainCount).toFixed(1)}% avg gain`
      : PREDICTIONS_COPY.KPIS.DEFAULT_AVG_GAIN;
  const avgLoss =
    lossCount > 0
      ? `−${(totalLossPct / lossCount).toFixed(1)}% avg loss`
      : PREDICTIONS_COPY.KPIS.DEFAULT_AVG_LOSS;
  const profitFactor =
    grossLossPct > 0
      ? (grossGainPct / grossLossPct).toFixed(2)
      : grossGainPct > 0
        ? "∞"
        : PREDICTIONS_COPY.KPIS.NOT_AVAILABLE;
  const avgRR =
    rrCount > 0 ? `1 : ${(totalRR / rrCount).toFixed(2)}` : PREDICTIONS_COPY.KPIS.NOT_AVAILABLE;
  const winRateBadge = `${eligibleSettled} ${PREDICTIONS_COPY.KPIS.ELIGIBLE_SAMPLE_SUFFIX}`;

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
    winRatePercent:
      eligibleSettled > 0 ? `${winRateNumber.toFixed(1)}%` : PREDICTIONS_COPY.KPIS.NOT_AVAILABLE,
    winRateBadge,
    profitFactor,
    riskReward: avgRR,
    avgGainText: avgGain,
    avgLossText: avgLoss,
    holdingHint,
  };
}
