/**
 * @file packages/ui/src/components/IndexMetricCard.tsx
 * @description Benchmark market index card displaying real-time price, change pill, and trend sparkline.
 */

import type { ReactNode } from "react";
import { cn } from "@yuva-devlab/ui";
import { Sparkline } from "./Sparkline";

/**
 * Props for the IndexMetricCard component.
 */
export interface IndexMetricCardProps {
  /** Index identifier or symbol (e.g. 'NIFTY 50') */
  readonly name: string;
  /** Primary index price level */
  readonly price: string;
  /** Percentage change text (e.g. '+0.84%') */
  readonly change: string;
  /** Whether the change is positive */
  readonly isPositive?: boolean;
  /** Whether this index represents a volatility measure */
  readonly isNeutral?: boolean;
  /** SVG sparkline points data */
  readonly sparklinePoints: string;
  /** Optional secondary subtitle or exchange tag (e.g. 'NSE India') */
  readonly subtitle?: string;
  /** Optional custom change icon */
  readonly changeIcon?: ReactNode;
  /** Custom CSS class names */
  readonly className?: string;
}

/**
 * Market index benchmark card presenting real-time pricing and micro-trajectory.
 *
 * @param props - Benchmark pricing, change delta, and SVG sparkline points.
 * @returns Rendered JSX IndexMetricCard element.
 */
export function IndexMetricCard({
  name,
  price,
  change,
  isPositive = true,
  isNeutral = false,
  sparklinePoints,
  subtitle,
  changeIcon,
  className = "",
}: IndexMetricCardProps) {
  const pillClass = isNeutral ? "pill-amber" : isPositive ? "pill-green" : "pill-red";

  return (
    <div className={cn("index-card", className)}>
      <div className="index-top">
        <div className="index-name-box">
          <span className="index-name">{name}</span>
          {subtitle && <span className="index-country">{subtitle}</span>}
        </div>
        <span className={cn("index-change-pill", pillClass)}>
          {changeIcon}
          {change}
        </span>
      </div>
      <div className="index-bottom">
        <span className="index-price mono">{price}</span>
        <Sparkline points={sparklinePoints} isPositive={isPositive} isNeutral={isNeutral} />
      </div>
    </div>
  );
}
