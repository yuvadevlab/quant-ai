/**
 * @file packages/ui/src/components/SignalHeader.tsx
 * @description Signal header banner with instrument details, direction badges, and status pill.
 */

import type { ReactNode } from "react";
import { cn } from "@yuva-devlab/ui";
import { UI_COPY_CONSTANTS } from "../constants/ui-copy.constants";

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

  const copy = UI_COPY_CONSTANTS.SIGNAL_HEADER;

  return (
    <div className={cn("desk-header", className)}>
      <div>
        {breadcrumb && <div className="desk-breadcrumb">{breadcrumb}</div>}
        <div className="title-with-badge">
          <h1 className="desk-title">
            {symbol} · <span className="title-instrument">{instrument}</span>
          </h1>
          <span className={cn("direction-badge", isBuy ? "badge-buy" : "badge-sell")}>
            {isBuy ? copy.BUY_LABEL : copy.SELL_LABEL}
          </span>
          <span className="horizon-tag">
            {horizon} {copy.HORIZON_SUFFIX}
          </span>
        </div>
        <p className="desk-subtitle">
          {companyName} {copy.SUBTITLE_SUFFIX}
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
