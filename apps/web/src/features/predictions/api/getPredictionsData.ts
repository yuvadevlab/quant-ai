/**
 * @file src/features/predictions/api/getPredictionsData.ts
 * @description Dynamic data provider for the Prediction Lab & Signal Audit Ledger.
 * Fetches real-time multi-asset signals from backend API.
 */

import { queryOptions } from "@tanstack/react-query";
import {
  MarketDataStatus,
  SignalDirection,
  TradeStrategy,
  type Signal as BackendSignal,
} from "@quant-ai/shared-types";
import { apiFetch } from "@/lib/api-fetcher";
import { UiSignalHorizon, UiSignalStatus, type Signal } from "@/components/quantai/data";
import { calculateSignalsTelemetry } from "@/hooks/use-workstation-session";
import { PREDICTIONS_COPY } from "@/lib/ui-copy/predictions.copy";

export interface PredictionsData {
  readonly signals: readonly Signal[];
  readonly researchRuns: readonly ResearchRun[];
  readonly totalGenerated: number;
  readonly activeCount: number;
  readonly targetHitCount: number;
  readonly stopHitCount: number;
  readonly winRate: string;
  readonly winRateBadge: string;
  readonly profitFactor: string;
  readonly riskReward: string;
  readonly avgGainText: string;
  readonly avgLossText: string;
  readonly holdingHint: string;
}

export interface ResearchRun {
  readonly id: string;
  readonly ticker: string;
  readonly serviceMode: string;
  readonly timeHorizon: string;
  readonly result: string;
  readonly dataSource: string | null;
  readonly dataStatus: string;
  readonly observedAt: string | null;
  readonly referencePrice: number | null;
  readonly createdAt: string;
}

export function mapBackendSignalToUi(s: BackendSignal): Signal {
  const current = s.current ?? s.entry;
  const entry = s.entry;
  const pnlPercent = s.pnlPercent ?? Number((((current - entry) / (entry || 1)) * 100).toFixed(2));

  let normalizedStatus: UiSignalStatus = UiSignalStatus.ACTIVE;
  const statusStr = String(s.status).toLowerCase();
  if (statusStr.includes("target")) {
    normalizedStatus = UiSignalStatus.TARGET_HIT;
  } else if (statusStr.includes("stop") || statusStr.includes("invalid")) {
    normalizedStatus = UiSignalStatus.STOP_HIT;
  } else if (statusStr.includes("expire")) {
    normalizedStatus = UiSignalStatus.EXPIRED;
  }

  const horizon =
    s.strategy === TradeStrategy.INTRADAY_SCALP
      ? UiSignalHorizon.SCALP
      : s.strategy === TradeStrategy.OPTIONS_EXPIRY
        ? UiSignalHorizon.OPTIONS
        : s.strategy === TradeStrategy.POSITIONAL_INVESTMENT
          ? UiSignalHorizon.INVESTMENT
          : UiSignalHorizon.SWING;
  const statusLabel =
    s.dataStatus === MarketDataStatus.VERIFIED
      ? PREDICTIONS_COPY.DATA_STATUS.VERIFIED
      : s.dataStatus === MarketDataStatus.PROVIDER_UNVERIFIED
        ? PREDICTIONS_COPY.DATA_STATUS.UNVERIFIED
        : s.dataStatus === MarketDataStatus.MARKET_CLOSED
          ? PREDICTIONS_COPY.DATA_STATUS.MARKET_CLOSED
          : s.dataStatus === MarketDataStatus.STALE
            ? PREDICTIONS_COPY.DATA_STATUS.STALE
            : s.dataStatus === MarketDataStatus.SIMULATED
              ? PREDICTIONS_COPY.DATA_STATUS.SIMULATED
              : PREDICTIONS_COPY.DATA_STATUS.UNAVAILABLE;
  const observedLabel = s.observedAt
    ? new Date(s.observedAt).toLocaleString("en-IN")
    : PREDICTIONS_COPY.DATA_STATUS.OBSERVATION_TIME_UNAVAILABLE;

  return {
    id: s.id,
    symbol: s.ticker,
    companyName: s.name,
    instrument: s.assetClass ? `NSE · ${s.assetClass}` : "NSE · Cash",
    direction: s.direction === SignalDirection.LONG ? "BUY" : "SELL",
    horizon,
    entry: `₹${entry.toLocaleString("en-IN")}`,
    entryPrice: entry,
    currentPrice: current,
    target1: `₹${s.target.toLocaleString("en-IN")}`,
    stop: `₹${s.stopLoss.toLocaleString("en-IN")}`,
    last: `₹${current.toLocaleString("en-IN")}`,
    change: `${pnlPercent >= 0 ? "+" : ""}${pnlPercent}%`,
    mfe: `+${s.maxExcursion}%`,
    mae: `−${s.maxAdverse}%`,
    status: normalizedStatus,
    time: new Date(s.publishedAt).toLocaleString("en-IN"),
    confidence: `${s.confidence}%`,
    riskReward: `1:${s.riskReward}`,
    rationale: s.thesis,
    catalysts: [...s.catalysts],
    ...(s.dataSource === undefined ? {} : { dataSource: s.dataSource }),
    ...(s.dataStatus === undefined ? {} : { dataStatus: s.dataStatus }),
    ...(s.observedAt === undefined ? {} : { observedAt: s.observedAt }),
    ...(s.outcomePrice === undefined ? {} : { outcomePrice: s.outcomePrice }),
    ...(s.outcomeAt === undefined ? {} : { outcomeAt: s.outcomeAt }),
    metricEligible: s.metricEligible === true,
    dataProvenance: `${s.dataSource ?? PREDICTIONS_COPY.DATA_STATUS.UNKNOWN_SOURCE} · ${statusLabel} · ${observedLabel}`,
    trajectoryPoints: s.trajectory?.map((t) => ({
      time: t.time,
      expectedPath: t.expected,
      upperCone: t.upper,
      lowerCone: t.lower,
      ...(t.actual === undefined ? {} : { actualPrice: t.actual }),
    })),
  };
}

/**
 * Fetches prediction ledger dynamically from backend API.
 */
export async function getPredictionsData(): Promise<PredictionsData> {
  const [rawSignals, rawResearchRuns] = await Promise.all([
    apiFetch<BackendSignal[]>("/api/predictions"),
    apiFetch<ResearchRun[]>("/api/predictions/research-runs"),
  ]);
  const signals = rawSignals && rawSignals.length > 0 ? rawSignals.map(mapBackendSignalToUi) : [];
  const researchRuns = rawResearchRuns ?? [];
  const telemetry = calculateSignalsTelemetry(signals);

  return {
    signals,
    researchRuns,
    totalGenerated: telemetry.totalSignals,
    activeCount: telemetry.activeCount,
    targetHitCount: telemetry.targetHitCount,
    stopHitCount: telemetry.stopHitCount,
    winRate: telemetry.winRatePercent,
    winRateBadge: telemetry.winRateBadge,
    profitFactor: telemetry.profitFactor,
    riskReward: telemetry.riskReward,
    avgGainText: telemetry.avgGainText,
    avgLossText: telemetry.avgLossText,
    holdingHint: telemetry.holdingHint,
  };
}

/**
 * Canonical TanStack Query options for prediction ledger queries.
 */
export const predictionsQueryOptions = () =>
  queryOptions({
    queryKey: ["predictions-ledger"],
    queryFn: () => getPredictionsData(),
    staleTime: 1000 * 10,
  });
