/**
 * @file packages/ui/src/components/TelemetryBar.tsx
 * @description Quant execution telemetry bar displaying MFE, MAE, alignment, and progress.
 */

import { cn } from "@yuva-devlab/ui";
import type { ReactNode } from "react";

/**
 * Single telemetry metric item.
 */
export interface TelemetryStatItem {
  /** Metric label (e.g. 'MAX FAVORABLE EXCURSION (MFE)') */
  readonly label: string;
  /** Primary metric value */
  readonly value?: ReactNode;
  /** Subtitle note or excursion peak */
  readonly subtext?: ReactNode;
  /** Custom CSS class for the value text (e.g. 'text-gain', 'text-loss') */
  readonly valueClass?: string;
  /** Percentage fill for progress bar mode */
  readonly progressBarPercent?: number;
}

/**
 * Props for the TelemetryBar component.
 */
export interface TelemetryBarProps {
  /** Array of telemetry metric items */
  readonly stats: readonly TelemetryStatItem[];
  /** Custom container class names */
  readonly className?: string;
}

/**
 * Displays real-time risk, excursion, and trajectory alignment metrics in a unified bar.
 *
 * @param props - Telemetry items and container styling.
 * @returns Rendered JSX TelemetryBar element.
 */
export function TelemetryBar({ stats, className = "" }: TelemetryBarProps) {
  return (
    <div className={cn("telemetry-bar", className)}>
      {stats.map((stat, idx) => (
        <div key={idx} className="telemetry-stat">
          <span className="stat-label">{stat.label}</span>
          {stat.progressBarPercent !== undefined ? (
            <div className="progress-bar-wrap">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(100, Math.max(0, stat.progressBarPercent))}%` }}
              />
            </div>
          ) : (
            <span className={cn("stat-val", stat.valueClass)}>{stat.value}</span>
          )}
          {stat.subtext && <span className="stat-sub">{stat.subtext}</span>}
        </div>
      ))}
    </div>
  );
}
