/**
 * @file packages/ui/src/components/TrajectoryConeChart.tsx
 * @description Interactive visual trajectory cone chart with price path and beacon.
 */

import { cn } from "@yuva-devlab/ui";
import { useState, type MouseEvent } from "react";

/**
 * Historical or simulated point along the trajectory path.
 */
export interface TrajectoryPoint {
  readonly x: number;
  readonly y: number;
  readonly time: string;
  readonly price: string;
  readonly deviation: string;
}

/**
 * Props for the TrajectoryConeChart component.
 */
export interface TrajectoryConeChartProps {
  /** Ticker symbol */
  readonly symbol: string;
  /** Executed entry price level */
  readonly entryPrice: number | string;
  /** Primary target level */
  readonly target1: string;
  /** Extended target level */
  readonly target2: string;
  /** Stop loss price boundary */
  readonly stop: string;
  /** Points along the actual trajectory curve */
  readonly samples: readonly TrajectoryPoint[];
  /** Whether the trade is currently in an active in-flight state */
  readonly isActive?: boolean;
  /** Custom container class names */
  readonly className?: string;
}

/**
 * Interactive price path canvas visualizing probabilistic cone projections.
 *
 * @param props - Levels, points, symbol, and active telemetry flags.
 * @returns Rendered JSX TrajectoryConeChart element.
 */
export function TrajectoryConeChart({
  symbol,
  entryPrice,
  target1,
  target2,
  stop,
  samples,
  isActive = true,
  className = "",
}: TrajectoryConeChartProps) {
  const [chartHover, setChartHover] = useState<{
    x: number;
    y: number;
    time: string;
    price: string;
    deviation: string;
  } | null>(null);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (samples.length === 0) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const initialPoint = samples[0]!;
    const nearest = samples.reduce(
      (best, point) => (Math.abs(point.x - x) < Math.abs(best.x - x) ? point : best),
      initialPoint,
    );
    setChartHover({
      x: Math.max(10, Math.min(89, nearest.x)),
      y: (nearest.y / 100) * 76 + 3,
      time: nearest.time,
      price: nearest.price,
      deviation: nearest.deviation,
    });
  }

  return (
    <div
      className={cn("trajectory-chart-viewport", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setChartHover(null)}
      role="img"
      aria-label={`Trajectory chart for ${symbol}`}
    >
      <div className="chart-price-axis">
        <span>₹2,480</span>
        <span>₹2,460</span>
        <span>₹2,440</span>
        <span>₹2,420</span>
        <span>₹2,400</span>
      </div>

      <svg
        className="trajectory-svg"
        viewBox="0 0 1000 320"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="cone-gradient" x1="0" x2="1" y1="1" y2="0">
            <stop offset="0%" stopColor="var(--success)" stopOpacity="0.04" />
            <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--success)" stopOpacity="0.08" />
          </linearGradient>
          <filter id="beacon-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Gridlines */}
        {[28, 81, 134, 187, 240, 293].map((y) => (
          <line key={`grid-${y}`} className="chart-gridline" x1="0" y1={y} x2="1000" y2={y} />
        ))}
        {[85, 205, 325, 445, 565, 685, 805, 925].map((x) => (
          <line
            key={`vgrid-${x}`}
            className="chart-gridline"
            x1={x}
            y1="18"
            x2={x}
            y2="294"
            strokeDasharray="4 4"
          />
        ))}

        {/* Target & Stop Horizontal Lines */}
        <line className="chart-level-target2" x1="3" y1="49" x2="965" y2="49" />
        <line className="chart-level-target1" x1="3" y1="107" x2="965" y2="107" />
        <line className="chart-level-entry" x1="3" y1="183" x2="965" y2="183" />
        <line className="chart-level-stop" x1="3" y1="238" x2="965" y2="238" />

        {/* Projected Cone */}
        <path
          d="M774 153 C829 146 873 130 958 102 L958 179 C886 170 830 162 774 168 Z"
          fill="url(#cone-gradient)"
        />
        <path
          d="M774 158 C842 147 892 127 958 139"
          className="chart-path-expected"
          strokeDasharray="5 5"
        />

        {/* Actual Price Trajectory */}
        <path
          d="M47 219 L168 194 L289 211 L410 168 L531 131 L652 178 L773 160"
          className="chart-path-actual"
        />

        {/* Sample Points */}
        {samples.map((point) => (
          <circle
            key={point.time}
            className="chart-point-dot"
            cx={point.x * 10}
            cy={(point.y / 100) * 250 + 27}
            r="4"
          />
        ))}

        {/* Beacon at live price */}
        {isActive && (
          <g className="live-price-beacon" filter="url(#beacon-glow)">
            <circle className="beacon-halo" cx="773" cy="160" r="14" />
            <circle className="beacon-core" cx="773" cy="160" r="5" />
          </g>
        )}
      </svg>

      {/* Floating Level Chips */}
      <div className="chart-floating-level level-t2">T2: {target2}</div>
      <div className="chart-floating-level level-t1">T1: {target1}</div>
      <div className="chart-floating-level level-entry">ENTRY: {entryPrice}</div>
      <div className="chart-floating-level level-sl">SL: {stop}</div>

      {/* Hover Tooltip */}
      {chartHover && (
        <div
          className="chart-hover-box"
          style={{
            left: `${chartHover.x}%`,
            top: `${Math.min(72, chartHover.y)}%`,
          }}
        >
          <span className="tooltip-time">{chartHover.time} IST</span>
          <strong className="tooltip-price">{chartHover.price}</strong>
          <small className="tooltip-dev">Path Deviation: {chartHover.deviation}</small>
        </div>
      )}
    </div>
  );
}
