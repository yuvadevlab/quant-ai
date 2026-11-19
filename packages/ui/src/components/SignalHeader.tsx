/**
 * @file packages/ui/src/components/SignalHeader.tsx
 * @description Signal header banner with instrument details, direction badges, and status pill.
 */

import type { ReactNode } from "react";
import { cn } from "@yuva-devlab/ui";

/**
 * Props for the SignalHeader component.
 */
export interface SignalHeaderProps {
  /** Optional breadcrumb elements */
  readonly breadcrumb?: ReactNode;
  /** Ticker symbol */
  readonly symbol: string;
  /** Derivative / equity instrument type */
  readonly instrument: string;
  /** Signal trading direction */
  readonly direction: "BUY" | "SELL" | string;
  /** Trading horizon */
  readonly horizon: string;
  /** Company or asset name */
  readonly companyName: string;
  /** Current signal execution status */
  readonly status: string;
  /** Whether signal is actively running */
  readonly isActive?: boolean;
  /** Additional container styling */
  readonly className?: string;
}

/**
 * Institutional signal monitor header banner.
 *
 * @param props - Signal metadata and status state.
 * @returns Rendered JSX SignalHeader element.
 */
export function SignalHeader({
  breadcrumb,
  symbol,
  instrument,
  direction,
  horizon,
  companyName,
  status,
  isActive = false,
  className = "",
}: SignalHeaderProps) {
  const isBuy = direction.toUpperCase() === "BUY";
  const pillClass = isActive
    ? "pill-active"
    : status.toLowerCase().includes("target")
      ? "pill-target"
      : "pill-stop";

  return (
    <div className={cn("desk-header", className)}>
      <div>
        {breadcrumb && <div className="desk-breadcrumb">{breadcrumb}</div>}
        <div className="title-with-badge">
          <h1 className="desk-title">
            {symbol} · <span className="title-instrument">{instrument}</span>
          </h1>
          <span className={cn("direction-badge", isBuy ? "badge-buy" : "badge-sell")}>
            {isBuy ? "BUY · BULLISH" : "SELL · BEARISH"}
          </span>
          <span className="horizon-tag">{horizon} Horizon</span>
        </div>
        <p className="desk-subtitle">
          {companyName} — Automated multi-agent trajectory tracking, cone projections, and real-time
          excursion monitoring.
        </p>
      </div>
      <div className="desk-actions">
        <span className={cn("outcome-pill", pillClass)}>
          {isActive && <span className="pulse-ping" />}
          {status.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
