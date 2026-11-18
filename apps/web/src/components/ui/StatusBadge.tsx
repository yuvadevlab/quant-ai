/**
 * @file src/components/ui/StatusBadge.tsx
 * @description Standardized financial signal direction and lifecycle status badge. */

import { SignalDirection, SignalStatus } from "../../constants";

/**
 * Props for the StatusBadge component.
 */
export interface StatusBadgeProps {
  /** Signal execution state or direction */
  readonly status?: SignalStatus;
  /** Direction bias (LONG/BUY, SHORT/SELL) */
  readonly direction?: SignalDirection;
  /** Optional custom display text override */
  readonly label?: string;
  /** Custom CSS class names */
  readonly className?: string;
}

/**
 * Renders high-contrast semantic badges for trading positions and algorithmic statuses.
 */
export function StatusBadge({ status, direction, label, className = "" }: StatusBadgeProps) {
  if (direction) {
    const isLong = direction === SignalDirection.LONG;
    const dirClass = isLong ? "badge-buy" : "badge-sell";
    const dirText = label ?? (isLong ? "BUY" : "SELL");

    return <span className={`direction-badge ${dirClass} ${className}`}>{dirText}</span>;
  }

  if (status) {
    let statusClass = "status-tag-active";
    let statusText = "Active Target";

    switch (status) {
      case SignalStatus.TARGET_HIT:
        statusClass = "status-tag-target";
        statusText = "Target 1 Hit";
        break;
      case SignalStatus.STOP_HIT:
        statusClass = "status-tag-stop";
        statusText = "Stop Loss Hit";
        break;
      case SignalStatus.INVALIDATED:
      case SignalStatus.EXPIRED:
        statusClass = "status-tag-expired";
        statusText = "Time Expired";
        break;
      default:
        statusClass = "status-tag-active";
        statusText = "In-Flight";
        break;
    }

    return <span className={`status-tag ${statusClass} ${className}`}>{label ?? statusText}</span>;
  }

  return null;
}
