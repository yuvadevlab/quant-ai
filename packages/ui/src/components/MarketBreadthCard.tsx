/**
 * @file packages/ui/src/components/MarketBreadthCard.tsx
 * @description Market breadth and institutional net liquidity flow widget.
 */

import { Layers } from "lucide-react";
import { cn } from "@yuva-devlab/ui";

/**
 * Props for the MarketBreadthCard component.
 */
export interface MarketBreadthCardProps {
  /** Total advancing instruments count */
  readonly advances: number | string;
  /** Total declining instruments count */
  readonly declines: number | string;
  /** Advance ratio percentage string (e.g. "69.5%") */
  readonly advanceRatio: string;
  /** Decline ratio percentage string (e.g. "30.5%") */
  readonly declineRatio?: string;
  /** Foreign Institutional Investors net turnover */
  readonly fiiNet: string;
  /** Domestic Institutional Investors net turnover */
  readonly diiNet: string;
  /** Monitored stock universe count label */
  readonly universeLabel?: string;
  /** Custom CSS classes */
  readonly className?: string;
}

/**
 * Displays market breadth advance/decline distribution and institutional liquidity flows.
 *
 * @param props - Advances, declines, and institutional flow metrics.
 * @returns Rendered JSX MarketBreadthCard element.
 */
export function MarketBreadthCard({
  advances,
  declines,
  advanceRatio,
  declineRatio = "30.5%",
  fiiNet,
  diiNet,
  universeLabel = "NSE 2,214 Stocks",
  className = "",
}: MarketBreadthCardProps) {
  return (
    <div className={cn("desk-panel breadth-panel", className)}>
      <div className="panel-heading">
        <div className="panel-title-wrap">
          <Layers size={18} className="panel-icon" />
          <h2 className="panel-title">Market Breadth & Institutional Flows</h2>
        </div>
        <span className="panel-status-pill">{universeLabel}</span>
      </div>

      <div className="breadth-metric-row">
        <div className="breadth-stat">
          <span className="stat-label">ADVANCES</span>
          <span className="stat-val text-gain">{advances}</span>
          <span className="stat-sub">{advanceRatio} of market</span>
        </div>
        <div className="breadth-stat">
          <span className="stat-label">DECLINES</span>
          <span className="stat-val text-loss">{declines}</span>
          <span className="stat-sub">{declineRatio} of market</span>
        </div>
        <div className="breadth-stat">
          <span className="stat-label">FII NET FLOW</span>
          <span className="stat-val text-gain">{fiiNet}</span>
          <span className="stat-sub">Strong Foreign Inflow</span>
        </div>
        <div className="breadth-stat">
          <span className="stat-label">DII NET FLOW</span>
          <span className="stat-val text-gain">{diiNet}</span>
          <span className="stat-sub">Domestic Support</span>
        </div>
      </div>

      <div className="breadth-progress-wrapper">
        <div className="breadth-bar-container">
          <div
            className="breadth-bar-advance"
            style={{ width: advanceRatio }}
            title={`Advances: ${advances}`}
          />
          <div
            className="breadth-bar-decline"
            style={{ width: declineRatio }}
            title={`Declines: ${declines}`}
          />
        </div>
        <div className="breadth-bar-labels">
          <span className="text-gain">
            ● {advances} Advances ({advanceRatio})
          </span>
          <span className="text-loss">
            ● {declines} Declines ({declineRatio})
          </span>
        </div>
      </div>
    </div>
  );
}
