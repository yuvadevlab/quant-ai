/**
 * @file packages/ui/src/components/KpiMetricCard.tsx
 * @description Compact quantitative quote level and KPI metric card.
 */

import { cn } from "@yuva-devlab/ui";
import type { ReactNode } from "react";

/**
 * Props for the KpiMetricCard component.
 */
export interface KpiMetricCardProps {
  /** KPI or quote level title (e.g. 'ENTRY ZONE', 'CURRENT LTP') */
  readonly title: string;
  /** Primary metric value display */
  readonly value: ReactNode;
  /** Optional contextual footer note */
  readonly footer?: ReactNode;
  /** Optional custom CSS class for the value text (e.g. 'text-gain', 'text-loss', 'highlight') */
  readonly valueClass?: string;
  /** Optional custom CSS class for the footer */
  readonly footerClass?: string;
  /** Custom container class names */
  readonly className?: string;
}

/**
 * Compact metric card used in real-time execution monitors and quote strips.
 *
 * @param props - Metric titles, values, footers, and styling classes.
 * @returns Rendered JSX KpiMetricCard element.
 */
export function KpiMetricCard({
  title,
  value,
  footer,
  valueClass = "",
  footerClass = "",
  className = "",
}: KpiMetricCardProps) {
  return (
    <div className={cn("kpi-metric-card", className)}>
      <span className="kpi-title">{title}</span>
      <div className={cn("kpi-big-number mono", valueClass)}>{value}</div>
      {footer && <div className={cn("kpi-footer", footerClass)}>{footer}</div>}
    </div>
  );
}
