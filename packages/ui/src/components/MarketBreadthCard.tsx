/**
 * @file packages/ui/src/components/MarketBreadthCard.tsx
 * @description Market breadth and institutional net liquidity flow widget.
 */

import { Layers } from "lucide-react";
import { cn } from "@yuva-devlab/ui";
import { UI_COPY_CONSTANTS } from "../constants/ui-copy.constants";

/**
 * Props for the MarketBreadthCard component.
 */
export interface MarketBreadthCardProps {
  /** Whether verified constituent breadth and investor-flow data is available */
  readonly dataAvailable?: boolean;
  /** Total advancing instruments count */
  readonly advances: number | string | null;
  /** Total declining instruments count */
  readonly declines: number | string | null;
  /** Advance ratio percentage string (e.g. "69.5%") */
  readonly advanceRatio: string | null;
  /** Decline ratio percentage string (e.g. "30.5%") */
  readonly declineRatio?: string;
  /** Foreign Institutional Investors net turnover */
  readonly fiiNet: string | null;
  /** Domestic Institutional Investors net turnover */
  readonly diiNet: string | null;
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
  dataAvailable = true,
  advances,
  declines,
  advanceRatio,
  declineRatio = "30.5%",
  fiiNet,
  diiNet,
  universeLabel,
  className = "",
}: MarketBreadthCardProps) {
  const copy = UI_COPY_CONSTANTS.MARKET_BREADTH;

  return (
    <div className={cn("desk-panel breadth-panel", className)}>
      <div className="panel-heading">
        <div className="panel-title-wrap">
          <Layers size={18} className="panel-icon" />
          <h2 className="panel-title">{copy.TITLE}</h2>
        </div>
        <span className="panel-status-pill">
          {dataAvailable ? (universeLabel ?? copy.DEFAULT_UNIVERSE) : copy.UNIVERSE_UNAVAILABLE}
        </span>
      </div>

      {dataAvailable ? (
        <>
          <div className="breadth-metric-row">
            <div className="breadth-stat">
              <span className="stat-label">{copy.ADVANCES}</span>
              <span className="stat-val text-gain">{advances}</span>
              <span className="stat-sub">
                {advanceRatio} {copy.OF_MARKET}
              </span>
            </div>
            <div className="breadth-stat">
              <span className="stat-label">{copy.DECLINES}</span>
              <span className="stat-val text-loss">{declines}</span>
              <span className="stat-sub">
                {declineRatio} {copy.OF_MARKET}
              </span>
            </div>
            <div className="breadth-stat">
              <span className="stat-label">{copy.FII_NET_FLOW}</span>
              <span className="stat-val text-gain">{fiiNet}</span>
              <span className="stat-sub">{copy.FII_SUB}</span>
            </div>
            <div className="breadth-stat">
              <span className="stat-label">{copy.DII_NET_FLOW}</span>
              <span className="stat-val text-gain">{diiNet}</span>
              <span className="stat-sub">{copy.DII_SUB}</span>
            </div>
          </div>
          <div className="breadth-progress-wrapper">
            <div className="breadth-bar-container">
              <div
                className="breadth-bar-advance"
                style={{ width: advanceRatio ?? "0%" }}
                title={`Advances: ${advances}`}
              />
              <div className="breadth-bar-decline" style={{ width: declineRatio }} />
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
        </>
      ) : (
        <p className="market-data-unavailable">{copy.DATA_UNAVAILABLE}</p>
      )}
    </div>
  );
}
