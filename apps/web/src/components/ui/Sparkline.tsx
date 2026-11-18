/**
 * @file src/components/ui/Sparkline.tsx
 * @description Lightweight, high-contrast SVG sparkline component for price trajectory trends. */

/**
 * Props for the Sparkline component.
 */
export interface SparklineProps {
  /** SVG polyline points string (e.g. "0,14 12,11 24,13 36,5 48,9 60,2") */
  readonly points: string;
  /** Whether the price trajectory trend is positive */
  readonly isPositive?: boolean;
  /** Whether the trajectory represents a volatility measure (e.g. VIX) */
  readonly isNeutral?: boolean;
  /** Custom CSS class name */
  readonly className?: string;
  /** Viewbox dimensions (defaults to "0 0 60 17") */
  readonly viewBox?: string;
}

/**
 * High-performance SVG sparkline for displaying micro-trends in indices, tickers, and signals.
 */
export function Sparkline({
  points,
  isPositive = true,
  isNeutral = false,
  className = "",
  viewBox = "0 0 60 17",
}: SparklineProps) {
  const colorClass = isNeutral ? "spark-amber" : isPositive ? "spark-green" : "spark-red";

  return (
    <svg className={`index-sparkline ${className}`} viewBox={viewBox} aria-hidden="true">
      <polyline points={points} className={colorClass} />
    </svg>
  );
}
