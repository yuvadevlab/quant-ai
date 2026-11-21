/**
 * @file packages/ui/src/components/PredictionsKpiGrid.tsx
 * @description Performance KPIs grid for prediction ledger.
 * @author yuva.devlab@gmail.com
 */

import { Activity, BarChart3, Target, TrendingUp } from "lucide-react";
import { MetricCard } from "./MetricCard";

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
  readonly targetHitCount?: number;
  /** Count of signals that hit stop loss */
  readonly stopHitCount?: number;
  /** Average gain metric text */
  readonly avgGainText?: string;
  /** Average loss metric text */
  readonly avgLossText?: string;
  /** Win rate card badge text */
  readonly winRateBadge?: string;
  /** Holding period hint */
  readonly holdingHint?: string;
  /** Profit factor badge text */
  readonly profitFactorBadge?: string;
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
  targetHitCount = 0,
  stopHitCount = 0,
  avgGainText = "+3.6% avg gain",
  avgLossText = "−1.2% avg loss",
  winRateBadge = "+3.2% THIS MONTH",
  holdingHint = "Avg holding: 42m (Intraday) / 4d (Swing)",
  profitFactorBadge = "EXCELLENT",
}: PredictionsKpiGridProps) {
  return (
    <section className="metric-grid" aria-label="TOTAL GENERATED">
      <MetricCard
        label="TOTAL GENERATED"
        value={String(totalGenerated)}
        icon={<Activity size={16} />}
        badge="ALL-TIME"
        hint={
          <>
            <span className="text-gain">{activeCount} active</span>
            <span className="metric-divider">·</span>
            <span>{totalGenerated - activeCount} settled</span>
          </>
        }
      />

      <MetricCard
        label="WIN RATE"
        value={<span className="text-gain">{winRate}</span>}
        icon={<Target size={16} />}
        badge={winRateBadge}
        badgeClass="badge-green"
        hint={
          <>
            <span className="text-gain">{targetHitCount} targets hit</span>
            <span className="metric-divider">·</span>
            <span className="text-loss">{stopHitCount} stops</span>
          </>
        }
      />

      <MetricCard
        label="PROFIT FACTOR"
        value={profitFactor}
        icon={<BarChart3 size={16} />}
        badge={profitFactorBadge}
        hint={
          <>
            <span className="text-gain">{avgGainText}</span>
            <span className="metric-divider">·</span>
            <span className="text-loss">{avgLossText}</span>
          </>
        }
      />

      <MetricCard
        label="AVG RISK / REWARD"
        value={<span className="text-gain">{riskReward}</span>}
        icon={<TrendingUp size={16} />}
        badge="POSITIVE EXPECTANCY"
        badgeClass="badge-green"
        hint={<span>{holdingHint}</span>}
      />
    </section>
  );
}
