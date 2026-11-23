/**
 * @file packages/ui/src/components/TrajectoryConeChart.tsx
 * @description Dynamic institutional trajectory cone chart with mathematically aligned curved paths and native SVG level chips.
 * @author yuva.devlab@gmail.com
 */

import { useState, type MouseEvent } from "react";
import { cn } from "@yuva-devlab/ui";
import {
  type TrajectoryPoint,
  parseNum,
  buildScaledPoints,
  buildSmoothSplinePath,
} from "./trajectory-math";

export type { TrajectoryPoint };

export interface TrajectoryConeChartProps {
  readonly symbol: string;
  readonly entryPrice: number | string;
  readonly target1: string;
  readonly target2: string;
  readonly stop: string;
  readonly samples?: readonly TrajectoryPoint[];
  readonly trajectory?: readonly TrajectoryPoint[];
  readonly isActive?: boolean;
  readonly className?: string;
}

export function TrajectoryConeChart({
  symbol,
  entryPrice,
  target1,
  target2,
  stop,
  samples = [],
  trajectory,
  isActive = true,
  className = "",
}: TrajectoryConeChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const entryNum = parseNum(entryPrice, 100);
  const t1Num = parseNum(target1, entryNum * 1.03);
  const t2Num = parseNum(target2, entryNum * 1.05);
  const stopNum = parseNum(stop, entryNum * 0.98);

  const raw = trajectory && trajectory.length > 0 ? trajectory : samples;
  const points = buildScaledPoints(raw, entryNum, t1Num, t2Num);

  const realized = points.filter((p) => p.actual !== null && p.actual !== undefined);
  const latestRealized = realized[realized.length - 1] ?? points[0];

  const allPrices = [
    entryNum,
    t1Num,
    t2Num,
    stopNum,
    ...points.flatMap((p) => [p.expected, p.upper, p.lower]),
    ...realized.map((p) => p.actual!),
  ];
  const minPrice = Math.min(...allPrices) * 0.994;
  const maxPrice = Math.max(...allPrices) * 1.006;
  const priceRange = Math.max(1, maxPrice - minPrice);

  const svgW = 920;
  const svgH = 300;
  const padTop = 30;
  const padBottom = 30;
  const plotH = svgH - padTop - padBottom;
  const padLeft = 80;
  const chipWidth = 114;
  const chipMargin = 12;
  const plotW = svgW - padLeft - chipWidth - chipMargin * 2;

  const getY = (price: number) => padTop + (1 - (price - minPrice) / priceRange) * plotH;
  const getX = (idx: number) => padLeft + (idx / Math.max(1, points.length - 1)) * plotW;

  const yT2 = getY(t2Num);
  const yT1 = getY(t1Num);
  const yEntry = getY(entryNum);
  const yStop = getY(stopNum);

  const upperPts = points.map((p) => ({ x: getX(p.index), y: getY(p.upper) }));
  const lowerPtsRev = [...points].reverse().map((p) => ({ x: getX(p.index), y: getY(p.lower) }));
  const upperSpline = buildSmoothSplinePath(upperPts);
  const lowerSpline = buildSmoothSplinePath(lowerPtsRev);
  const conePath = `${upperSpline} L ${lowerPtsRev[0].x} ${lowerPtsRev[0].y} ${lowerSpline.replace(/^M\s*[\d.-]+\s*[\d.-]+/, "")} Z`;

  const expectedPts = points.map((p) => ({ x: getX(p.index), y: getY(p.expected) }));
  const expectedLine = buildSmoothSplinePath(expectedPts);

  const realizedPts = realized.map((p) => ({ x: getX(p.index), y: getY(p.actual!) }));
  const actualLine = buildSmoothSplinePath(realizedPts);

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((pct) => minPrice + (maxPrice - minPrice) * pct);
  const chipX = svgW - chipWidth - chipMargin;

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (points.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX =
      (e.clientX - rect.left - (padLeft / svgW) * rect.width) / ((plotW / svgW) * rect.width);
    const closestIdx = Math.round(relX * (points.length - 1));
    setHoverIndex(Math.max(0, Math.min(points.length - 1, closestIdx)));
  }

  const activePoint = hoverIndex !== null ? points[hoverIndex] : null;
  const beaconX = getX(latestRealized.index);
  const beaconY = getY(latestRealized.actual ?? latestRealized.expected);

  return (
    <div
      className={cn("trajectory-chart-viewport", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverIndex(null)}
      role="img"
      aria-label={`Trajectory chart for ${symbol}`}
    >
      <svg className="trajectory-svg" viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="cone-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.06" />
            <stop offset="50%" stopColor="var(--brand-cyan)" stopOpacity="0.14" />
            <stop offset="100%" stopColor="var(--success)" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* Dynamic Y-Axis Price Ticks & Gridlines */}
        {yTicks.map((p) => {
          const y = getY(p);
          return (
            <g key={p}>
              <line className="chart-gridline" x1={padLeft} y1={y} x2={chipX - 8} y2={y} />
              <text
                x={padLeft - 10}
                y={y + 4}
                textAnchor="end"
                fill="var(--text-dim)"
                fontSize="11"
                fontFamily="var(--font-mono)"
              >
                ₹{p.toLocaleString("en-IN", { maximumFractionDigits: 1 })}
              </text>
            </g>
          );
        })}

        {/* Level Reference Lines */}
        <line
          className="chart-level-target2"
          x1={padLeft}
          y1={yT2}
          x2={chipX}
          y2={yT2}
          strokeDasharray="4 4"
        />
        <line
          className="chart-level-target1"
          x1={padLeft}
          y1={yT1}
          x2={chipX}
          y2={yT1}
          strokeDasharray="4 4"
        />
        <line
          className="chart-level-entry"
          x1={padLeft}
          y1={yEntry}
          x2={chipX}
          y2={yEntry}
          strokeDasharray="3 3"
        />
        <line
          className="chart-level-stop"
          x1={padLeft}
          y1={yStop}
          x2={chipX}
          y2={yStop}
          strokeDasharray="4 4"
        />

        {/* Native SVG Level Chips pinned directly to reference line coordinates */}
        <g transform={`translate(${chipX}, ${yT2 - 11})`}>
          <rect
            width={chipWidth}
            height="22"
            rx="4"
            fill="var(--color-gain-bg)"
            stroke="var(--color-gain)"
            strokeWidth="1"
          />
          <text
            x={chipWidth / 2}
            y="15"
            textAnchor="middle"
            fill="var(--color-gain)"
            fontSize="10.5"
            fontWeight="700"
            fontFamily="var(--font-mono)"
          >
            T2: {target2}
          </text>
        </g>
        <g transform={`translate(${chipX}, ${yT1 - 11})`}>
          <rect
            width={chipWidth}
            height="22"
            rx="4"
            fill="var(--color-gain-bg)"
            stroke="var(--color-gain)"
            strokeWidth="1"
          />
          <text
            x={chipWidth / 2}
            y="15"
            textAnchor="middle"
            fill="var(--color-gain)"
            fontSize="10.5"
            fontWeight="700"
            fontFamily="var(--font-mono)"
          >
            T1: {target1}
          </text>
        </g>
        <g transform={`translate(${chipX}, ${yEntry - 11})`}>
          <rect
            width={chipWidth}
            height="22"
            rx="4"
            fill="color-mix(in srgb, var(--brand-cyan) 18%, transparent)"
            stroke="var(--brand-cyan)"
            strokeWidth="1"
          />
          <text
            x={chipWidth / 2}
            y="15"
            textAnchor="middle"
            fill="var(--brand-cyan)"
            fontSize="10.5"
            fontWeight="700"
            fontFamily="var(--font-mono)"
          >
            ENTRY: ₹{entryNum.toLocaleString("en-IN")}
          </text>
        </g>
        <g transform={`translate(${chipX}, ${yStop - 11})`}>
          <rect
            width={chipWidth}
            height="22"
            rx="4"
            fill="var(--color-loss-bg)"
            stroke="var(--color-loss)"
            strokeWidth="1"
          />
          <text
            x={chipWidth / 2}
            y="15"
            textAnchor="middle"
            fill="var(--color-loss)"
            fontSize="10.5"
            fontWeight="700"
            fontFamily="var(--font-mono)"
          >
            SL: {stop}
          </text>
        </g>

        {/* Smooth Curved 2-Sigma Confidence Corridor & Curved Paths */}
        <path d={conePath} fill="url(#cone-grad)" />
        <path d={expectedLine} className="chart-path-expected" strokeDasharray="5 5" fill="none" />
        {actualLine && <path d={actualLine} className="chart-path-actual" fill="none" />}

        {/* Projected Nodes */}
        {points.map((p) => (
          <circle
            key={p.time}
            cx={getX(p.index)}
            cy={getY(p.expected)}
            r="3"
            fill="var(--text-dim)"
            opacity="0.6"
          />
        ))}

        {/* Realized Path Dots */}
        {realized.map((p) => (
          <circle
            key={`act-${p.time}`}
            cx={getX(p.index)}
            cy={getY(p.actual!)}
            r={p.index === hoverIndex ? "6" : "4.5"}
            className="chart-point-dot"
          />
        ))}

        {/* Pulsing Live Beacon on Current Realized Price */}
        {isActive && latestRealized && (
          <g className="live-price-beacon">
            <circle cx={beaconX} cy={beaconY} r="14" className="beacon-halo" />
            <circle cx={beaconX} cy={beaconY} r="5" className="beacon-core" />
          </g>
        )}
      </svg>

      {/* Hover Inspection Box */}
      {activePoint && hoverIndex !== null && (
        <div
          className="chart-hover-box"
          style={{
            left: `${(getX(hoverIndex) / svgW) * 100}%`,
            top: `${Math.min(75, Math.max(10, (getY(activePoint.actual ?? activePoint.expected) / svgH) * 100 - 15))}%`,
          }}
        >
          <span className="tooltip-time">{activePoint.time}</span>
          <strong className="tooltip-price">
            ₹
            {(activePoint.actual ?? activePoint.expected).toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            })}
          </strong>
          <small className="tooltip-dev">Expected: ₹{activePoint.expected.toFixed(2)}</small>
        </div>
      )}
    </div>
  );
}
