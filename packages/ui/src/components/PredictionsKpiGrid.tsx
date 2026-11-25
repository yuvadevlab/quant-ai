/**
 * @file packages/ui/src/components/PredictionsKpiGrid.tsx
 * @description Performance KPIs grid for prediction ledger.
 * @author yuva.devlab@gmail.com
 */

import { Activity, BarChart3, Target, TrendingUp } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { UI_COPY_CONSTANTS } from "../constants/ui-copy.constants";

/**
 * Props for the PredictionsKpiGrid presentation component.
 */
export interface PredictionsKpiGridProps {
  /** Total signals generated all-time */
  readonly totalGenerated: number;
  /** Currently active signals in-flight */
  readonly activeCount: number;
  /** Win rate percentage string (e.g. '71.4%') */
  readonly winRate: string;
  /** Profit factor ratio string (e.g. '2.84') */
  readonly profitFactor: string;
  /** Average risk-to-reward ratio string (e.g. '1:2.4') */
  readonly riskReward: string;
  /** Count of signals that hit target */
  readonly targetHitCount: number;
  /** Count of signals that hit stop loss */
  readonly stopHitCount: number;
  /** Average gain metric text */
  readonly avgGainText: string;
  /** Average loss metric text */
  readonly avgLossText: string;
  /** Win rate card badge text */
  readonly winRateBadge: string;
  /** Holding period hint */
  readonly holdingHint: string;
}

/**
 * Institutional 4-card metric grid summarizing prediction ledger performance.
 *
 * @param props - Performance metrics, win rates, and counts.
 * @returns Rendered JSX PredictionsKpiGrid element.
 */
export function PredictionsKpiGrid({
  totalGenerated,
  activeCount,
  winRate,
  profitFactor,
  riskReward,
  targetHitCount,
  stopHitCount,
  avgGainText,
  avgLossText,
  winRateBadge,
  holdingHint,
}: PredictionsKpiGridProps) {
  const copy = UI_COPY_CONSTANTS.PREDICTIONS_KPI_GRID;

  return (
    <section className="metric-grid" aria-label={copy.ARIA_LABEL}>
      <MetricCard
        label={copy.TOTAL_GENERATED}
        value={String(totalGenerated)}
        icon={<Activity size={16} />}
        badge={copy.ALL_TIME}
        hint={
          <>
            <span className="text-gain">
              {activeCount} {copy.ACTIVE_SUFFIX}
            </span>
            <span className="metric-divider">·</span>
            <span>
              {totalGenerated - activeCount} {copy.SETTLED_SUFFIX}
            </span>
          </>
        }
      />

      <MetricCard
        label={copy.WIN_RATE}
        value={winRate}
        icon={<Target size={16} />}
        badge={winRateBadge}
        hint={
          <>
            <span className="text-gain">
              {targetHitCount} {copy.TARGETS_HIT_SUFFIX}
            </span>
            <span className="metric-divider">·</span>
            <span className="text-loss">
              {stopHitCount} {copy.STOPS_SUFFIX}
            </span>
          </>
        }
      />

      <MetricCard
        label={copy.PROFIT_FACTOR}
        value={profitFactor}
        icon={<BarChart3 size={16} />}
        hint={
          <>
            <span className="text-gain">{avgGainText}</span>
            <span className="metric-divider">·</span>
            <span className="text-loss">{avgLossText}</span>
          </>
        }
      />

      <MetricCard
        label={copy.AVG_RISK_REWARD}
        value={riskReward}
        icon={<TrendingUp size={16} />}
        hint={<span>{holdingHint}</span>}
      />
    </section>
  );
}
