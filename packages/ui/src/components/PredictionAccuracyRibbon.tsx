/**
 * @file packages/ui/src/components/PredictionAccuracyRibbon.tsx
 * @description Displays performance metrics supplied by the eligible-outcome ledger.
 */

import { CheckCircle2, Target } from "lucide-react";
import { cn } from "@yuva-devlab/ui";
import { UI_COPY_CONSTANTS } from "../constants/ui-copy.constants";

/**
 * Props for eligible-outcome performance metrics.
 */
export interface PredictionAccuracyRibbonProps {
  readonly winRate: string;
  readonly profitFactor: string;
  readonly targetsHit: number;
  readonly stopsHit: number;
  readonly className?: string;
}

/**
 * Renders only win-rate and profit-factor data provided by the verified outcome ledger.
 */
export function PredictionAccuracyRibbon({
  winRate,
  profitFactor,
  targetsHit,
  stopsHit,
  className = "",
}: PredictionAccuracyRibbonProps) {
  const copy = UI_COPY_CONSTANTS.PREDICTION_ACCURACY_RIBBON;

  return (
    <div
      className={cn("prediction-accuracy-ribbon", className)}
      role="region"
      aria-label={copy.ARIA_LABEL}
    >
      <div className="accuracy-card">
        <div className="accuracy-card-header">
          <Target size={14} className="accuracy-icon text-cyan" />
          <span className="accuracy-card-label">{copy.WIN_RATE}</span>
        </div>
        <div className="accuracy-card-body">
          <span className="accuracy-val text-gain">{winRate}</span>
          <span className="accuracy-hint">
            {targetsHit} {copy.TARGETS_HIT} · {stopsHit} {copy.STOPS}
          </span>
        </div>
      </div>

      <div className="accuracy-card">
        <div className="accuracy-card-header">
          <CheckCircle2 size={14} className="accuracy-icon text-amber" />
          <span className="accuracy-card-label">{copy.PROFIT_FACTOR}</span>
        </div>
        <div className="accuracy-card-body">
          <span className="accuracy-val text-amber">{profitFactor}</span>
          <span className="accuracy-hint">{copy.ELIGIBLE_OUTCOMES_ONLY}</span>
        </div>
      </div>
    </div>
  );
}
