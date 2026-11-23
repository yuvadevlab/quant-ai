/**
 * @file packages/ui/src/components/SignalCard.tsx
 * @description High-conviction algorithmic trading signal spotlight card.
 */

import { SignalDirection } from "@quant-ai/shared-types";
import type { ReactNode } from "react";
import { cn } from "@yuva-devlab/ui";
import { UI_COPY_CONSTANTS } from "../constants/ui-copy.constants";
import { ConfidenceMeter } from "./ConfidenceMeter";
import { StatusBadge } from "./StatusBadge";

/**
 * Metric pair definition for signal cards.
 */
export interface SignalMetricItem {
  /** Metric label (e.g. 'ENTRY', 'TARGET 1', 'STOP LOSS') */
  readonly label: string;
  /** Value string or node */
  readonly value: ReactNode;
  /** Optional custom class for value text (e.g. 'text-gain', 'text-loss') */
  readonly valueClass?: string;
}

/**
 * Props for the SignalCard component.
 */
export interface SignalCardProps {
  /** Ticker symbol */
  readonly symbol: string;
  /** Full corporate name */
  readonly companyName?: string;
  /** Signal directional bias */
  readonly direction: SignalDirection;
  /** Investment horizon (e.g. 'Swing', 'Intraday') */
  readonly horizon?: string;
  /** Algorithmic conviction score (0-100) */
  readonly convictionScore?: number;
  /** Confidence percentage string or number */
  readonly confidence?: string | number;
  /** Key financial metrics list */
  readonly metrics?: SignalMetricItem[];
  /** Algorithmic rationale or thesis statement */
  readonly rationale?: ReactNode;
  /** Action slot (e.g. 'Open Trajectory Monitor' button or Link) */
  readonly action?: ReactNode;
  /** Custom CSS class names */
  readonly className?: string;
}

/**
 * Institutional signal card displaying entry parameters, risk metrics, and conviction.
 *
 * @param props - Signal parameters, direction, and metrics.
 * @returns Rendered JSX SignalCard element.
 */
export function SignalCard({
  symbol,
  companyName,
  direction,
  horizon,
  convictionScore,
  confidence,
  metrics,
  rationale,
  action,
  className = "",
}: SignalCardProps) {
  return (
    <div className={cn("spotlight-card", className)}>
      <div className="spotlight-card-top">
        <div>
          <div className="spotlight-sym-row">
            <span className="spotlight-sym">{symbol}</span>
            {companyName && <span className="spotlight-company">{companyName}</span>}
          </div>
          <div className="spotlight-tags">
            <StatusBadge direction={direction} />
            {horizon && <span className="tag-horizon">{horizon}</span>}
          </div>
        </div>

        {convictionScore !== undefined && (
          <div className="spotlight-conviction-badge">
            <span className="conviction-label">{UI_COPY_CONSTANTS.SIGNAL_CARD.CONVICTION}</span>
            <span className="conviction-score mono">{convictionScore}/100</span>
          </div>
        )}
      </div>

      {confidence !== undefined && (
        <div className="spotlight-confidence-row">
          <ConfidenceMeter value={confidence} />
        </div>
      )}

      {metrics && metrics.length > 0 && (
        <div className="spotlight-metrics-grid">
          {metrics.map((m) => (
            <div key={m.label} className="spotlight-metric-item">
              <span className="spotlight-metric-lbl">{m.label}</span>
              <span className={cn("spotlight-metric-val mono", m.valueClass)}>{m.value}</span>
            </div>
          ))}
        </div>
      )}

      {rationale && <div className="spotlight-rationale">{rationale}</div>}

      {action && <div className="spotlight-card-footer">{action}</div>}
    </div>
  );
}
