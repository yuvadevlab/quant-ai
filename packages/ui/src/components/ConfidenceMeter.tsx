/**
 * @file packages/ui/src/components/ConfidenceMeter.tsx
 * @description Quant confidence meter and conviction progress indicator.
 */

import { cn } from "@yuva-devlab/ui";

/**
 * Props for the ConfidenceMeter component.
 */
export interface ConfidenceMeterProps {
  /** Confidence value as a number (0-100) or formatted string (e.g. "84%") */
  readonly value: number | string;
  /** Optional label text displayed alongside the meter */
  readonly label?: string;
  /** Whether to show the numeric percentage text */
  readonly showValue?: boolean;
  /** Custom CSS class names */
  readonly className?: string;
}

/**
 * Visual confidence meter displaying algorithmic model conviction.
 *
 * @param props - Value, label, and presentation options.
 * @returns Rendered JSX ConfidenceMeter element.
 */
export function ConfidenceMeter({
  value,
  label,
  showValue = true,
  className = "",
}: ConfidenceMeterProps) {
  const numericValue = typeof value === "number" ? value : parseFloat(value) || 0;
  const clampedValue = Math.min(100, Math.max(0, numericValue));
  const displayString =
    typeof value === "string" && value.includes("%") ? value : `${clampedValue}%`;

  return (
    <div
      className={cn("confidence-block", className)}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? "Algorithmic Confidence"}
    >
      <div className="conf-bar-track">
        <div className="conf-bar-fill" style={{ width: `${clampedValue}%` }} />
      </div>
      {showValue && <span className="conf-val mono">{displayString}</span>}
    </div>
  );
}
