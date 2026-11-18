/**
 * @file src/components/ui/MetricCard.tsx
 * @description Standardized institutional quantitative KPI card container.
 * @author yuva.devlab@gmail.com
 */

import type { ReactNode } from "react";

/**
 * Props for the MetricCard component.
 */
export interface MetricCardProps {
  /** KPI title or metric identifier */
  readonly label: string;
  /** Primary metric value display */
  readonly value: ReactNode;
  /** Optional visual icon displayed in the top bar */
  readonly icon?: ReactNode;
  /** Optional upper badge (e.g. 'ALL TIME', '+3.2% THIS MONTH') */
  readonly badge?: ReactNode;
  /** Badge color styling class (e.g. 'badge-green') */
  readonly badgeClass?: string;
  /** Subtitle or contextual breakdown hint text */
  readonly hint?: ReactNode;
  /** Custom CSS class names */
  readonly className?: string;
}

/**
 * Institutional metric container providing clean financial KPI presentation.
 */
export function MetricCard({
  label,
  value,
  icon,
  badge,
  badgeClass = "",
  hint,
  className = "",
}: MetricCardProps) {
  return (
    <div className={`metric-card ${className}`}>
      <div className="metric-top">
        <div className="metric-top-left">
          {icon && (
            <span className="metric-icon" aria-hidden="true">
              {icon}
            </span>
          )}
          <span className="metric-label">{label}</span>
        </div>
        {badge && <span className={`metric-badge ${badgeClass}`}>{badge}</span>}
      </div>

      <div className="metric-value mono">{value}</div>

      {hint && <div className="metric-hint">{hint}</div>}
    </div>
  );
}
