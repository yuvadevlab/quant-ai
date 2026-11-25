/**
 * @file packages/ui/src/components/PredictionAccuracyRibbon.tsx
 * @description Institutional model verification and prediction accuracy ribbon.
 * @author yuva.devlab@gmail.com
 */

import { CheckCircle2, ShieldCheck, Target, TrendingUp, Cpu } from "lucide-react";
import { cn } from "@yuva-devlab/ui";

export interface PredictionAccuracyRibbonProps {
  /** Overall model win rate / accuracy (e.g. '74.5%') */
  readonly winRate?: string;
  /** Realized cone containment / adherence (e.g. '92.4%') */
  readonly coneAdherence?: string;
  /** Directional forecast accuracy (e.g. '83.1%') */
  readonly directionalAccuracy?: string;
  /** Profit factor ratio (e.g. '2.84x') */
  readonly profitFactor?: string;
  /** Brier score / calibration metric (e.g. '0.11') */
  readonly brierScore?: string;
  /** Number of targets hit */
  readonly targetsHit?: number;
  /** Number of stops hit */
  readonly stopsHit?: number;
  readonly className?: string;
}

/**
 * Institutional model accuracy ribbon displaying verification KPIs and hit rates.
 */
export function PredictionAccuracyRibbon({
  winRate = "74.5%",
  coneAdherence = "92.4%",
  directionalAccuracy = "83.1%",
  profitFactor = "2.84x",
  brierScore = "0.11",
  targetsHit = 35,
  stopsHit = 12,
  className = "",
}: PredictionAccuracyRibbonProps) {
  return (
    <div
      className={cn("prediction-accuracy-ribbon", className)}
      role="region"
      aria-label="Model Prediction Accuracy Metrics"
    >
      <div className="accuracy-card">
        <div className="accuracy-card-header">
          <Target size={14} className="accuracy-icon text-cyan" />
          <span className="accuracy-card-label">MODEL WIN RATE</span>
        </div>
        <div className="accuracy-card-body">
          <span className="accuracy-val text-gain">{winRate}</span>
          <span className="accuracy-hint">
            {targetsHit} Targets Hit · {stopsHit} Stops
          </span>
        </div>
      </div>

      <div className="accuracy-card">
        <div className="accuracy-card-header">
          <ShieldCheck size={14} className="accuracy-icon text-indigo" />
          <span className="accuracy-card-label">2σ CONE ADHERENCE</span>
        </div>
        <div className="accuracy-card-body">
          <span className="accuracy-val text-cyan">{coneAdherence}</span>
          <span className="accuracy-hint">Price inside 95.4% bounds</span>
        </div>
      </div>

      <div className="accuracy-card">
        <div className="accuracy-card-header">
          <TrendingUp size={14} className="accuracy-icon text-emerald" />
          <span className="accuracy-card-label">DIRECTIONAL ACCURACY</span>
        </div>
        <div className="accuracy-card-body">
          <span className="accuracy-val text-gain">{directionalAccuracy}</span>
          <span className="accuracy-hint">Bullish & Bearish calls</span>
        </div>
      </div>

      <div className="accuracy-card">
        <div className="accuracy-card-header">
          <CheckCircle2 size={14} className="accuracy-icon text-amber" />
          <span className="accuracy-card-label">PROFIT FACTOR</span>
        </div>
        <div className="accuracy-card-body">
          <span className="accuracy-val text-amber">{profitFactor}</span>
          <span className="accuracy-hint">Avg Win +3.6% / Loss -1.2%</span>
        </div>
      </div>

      <div className="accuracy-card">
        <div className="accuracy-card-header">
          <Cpu size={14} className="accuracy-icon text-cyan" />
          <span className="accuracy-card-label">CALIBRATION SCORE</span>
        </div>
        <div className="accuracy-card-body">
          <span className="accuracy-val text-cyan">Brier {brierScore}</span>
          <span className="accuracy-hint">High confidence calibration</span>
        </div>
      </div>
    </div>
  );
}
