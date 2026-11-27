/**
 * @fileoverview Displays persisted analysis attempts alongside the prediction ledger.
 */

import { MarketDataStatus, TradeHorizon, TradeStrategy } from "@quant-ai/shared-types";
import { PREDICTIONS_COPY } from "@/lib/ui-copy/predictions.copy";
import type { ResearchRun } from "../api/getPredictionsData";

interface ResearchRunsPanelProps {
  readonly runs: readonly ResearchRun[];
}

const SERVICE_LABELS: Readonly<Record<string, string>> = {
  [TradeStrategy.INTRADAY_SCALP]: PREDICTIONS_COPY.RESEARCH_RUNS.SCALP,
  [TradeStrategy.SWING]: PREDICTIONS_COPY.RESEARCH_RUNS.SWING,
  [TradeStrategy.OPTIONS_EXPIRY]: PREDICTIONS_COPY.RESEARCH_RUNS.OPTIONS,
  [TradeStrategy.POSITIONAL_INVESTMENT]: PREDICTIONS_COPY.RESEARCH_RUNS.INVESTMENT,
};

const DATA_STATUS_LABELS: Readonly<Record<string, string>> = {
  [MarketDataStatus.VERIFIED]: PREDICTIONS_COPY.DATA_STATUS.VERIFIED,
  [MarketDataStatus.PROVIDER_UNVERIFIED]: PREDICTIONS_COPY.DATA_STATUS.UNVERIFIED,
  [MarketDataStatus.MARKET_CLOSED]: PREDICTIONS_COPY.DATA_STATUS.MARKET_CLOSED,
  [MarketDataStatus.STALE]: PREDICTIONS_COPY.DATA_STATUS.STALE,
  [MarketDataStatus.SIMULATED]: PREDICTIONS_COPY.DATA_STATUS.SIMULATED,
  [MarketDataStatus.UNAVAILABLE]: PREDICTIONS_COPY.DATA_STATUS.UNAVAILABLE,
};

const HORIZON_LABELS: Readonly<Record<string, string>> = {
  [TradeHorizon.M5_SCALP]: PREDICTIONS_COPY.RESEARCH_RUNS.HORIZONS.M5_SCALP,
  [TradeHorizon.M15_SCALP]: PREDICTIONS_COPY.RESEARCH_RUNS.HORIZONS.M15_SCALP,
  [TradeHorizon.INTRADAY]: PREDICTIONS_COPY.RESEARCH_RUNS.HORIZONS.INTRADAY,
  [TradeHorizon.EXPIRY_ZERO_DTE]: PREDICTIONS_COPY.RESEARCH_RUNS.HORIZONS.EXPIRY_ZERO_DTE,
  [TradeHorizon.EXPIRY_WEEKLY]: PREDICTIONS_COPY.RESEARCH_RUNS.HORIZONS.EXPIRY_WEEKLY,
  [TradeHorizon.SWING_DAYS]: PREDICTIONS_COPY.RESEARCH_RUNS.HORIZONS.SWING_DAYS,
  [TradeHorizon.SWING_WEEKS]: PREDICTIONS_COPY.RESEARCH_RUNS.HORIZONS.SWING_WEEKS,
  [TradeHorizon.POSITIONAL_MONTHS]: PREDICTIONS_COPY.RESEARCH_RUNS.HORIZONS.POSITIONAL_MONTHS,
};

/**
 * Lists recent persisted analysis attempts without exposing raw market-data payloads.
 *
 * @param props - Persisted research runs to render.
 * @returns Recent analysis history.
 */
export function ResearchRunsPanel({ runs }: ResearchRunsPanelProps) {
  return (
    <section className="research-runs-panel" aria-labelledby="research-runs-title">
      <header className="research-runs-header">
        <h2 id="research-runs-title">{PREDICTIONS_COPY.RESEARCH_RUNS.TITLE}</h2>
        <p>{PREDICTIONS_COPY.RESEARCH_RUNS.DESCRIPTION}</p>
      </header>
      {runs.length === 0 ? (
        <p className="research-runs-empty">{PREDICTIONS_COPY.RESEARCH_RUNS.EMPTY}</p>
      ) : (
        <ul className="research-runs-list">
          {runs.map((run) => (
            <li className="research-run-item" key={run.id}>
              <div className="research-run-main">
                <strong>{run.ticker}</strong>
                <span>
                  {SERVICE_LABELS[run.serviceMode] ?? PREDICTIONS_COPY.RESEARCH_RUNS.UNKNOWN_MODE}
                </span>
                <span>{HORIZON_LABELS[run.timeHorizon] ?? run.timeHorizon}</span>
                <span>
                  {run.result === "PREDICTION"
                    ? PREDICTIONS_COPY.RESEARCH_RUNS.PREDICTION
                    : PREDICTIONS_COPY.RESEARCH_RUNS.NO_PREDICTION}
                </span>
              </div>
              <div className="research-run-meta">
                <span>{run.dataSource ?? PREDICTIONS_COPY.DATA_STATUS.UNKNOWN_SOURCE}</span>
                <span>
                  {DATA_STATUS_LABELS[run.dataStatus] ?? PREDICTIONS_COPY.DATA_STATUS.UNAVAILABLE}
                </span>
                <time dateTime={run.createdAt}>
                  {new Date(run.createdAt).toLocaleString("en-IN")}
                </time>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
