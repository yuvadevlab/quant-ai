/**
 * @file packages/ui/src/components/ScreenerHeader.tsx
 * @description Header banner for the Quantitative Screener workstation desk.
 * @author yuva.devlab@gmail.com
 */

import type { ReactNode } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@yuva-devlab/ui";

/**
 * Props for the ScreenerHeader presentation component.
 */
export interface ScreenerHeaderProps {
  /** Main desk title */
  readonly title?: string;
  /** Subtitle narrative */
  readonly subtitle?: string;
  /** Market desk breadcrumb label */
  readonly breadcrumbLabel?: string;
  /** Ask copilot button label */
  readonly askCopilotLabel?: string;
  /** Callback when user clicks Ask Copilot */
  readonly onAskCopilot?: () => void;
  /** Optional custom action slot */
  readonly actionSlot?: ReactNode;
}

/**
 * Institutional header banner for the Quantitative Screener desk.
 *
 * @param props - Header props containing titles and action slot.
 * @returns Rendered JSX ScreenerHeader element.
 */
export function ScreenerHeader({
  title = "QUANTITATIVE SCREENER",
  subtitle = "High-velocity momentum scan, multi-factor setups, and options OI buildup radar across NSE 500.",
  breadcrumbLabel = "MARKET DESK",
  askCopilotLabel = "ASK COPILOT",
  onAskCopilot,
  actionSlot,
}: ScreenerHeaderProps) {
  return (
    <div className="desk-header">
      <div>
        <div className="desk-breadcrumb">
          <span>{breadcrumbLabel}</span>
          <ChevronRight size={14} />
          <span className="current">{title.toUpperCase()}</span>
        </div>
        <h1 className="desk-title">{title}</h1>
        <p className="desk-subtitle">{subtitle}</p>
      </div>
      <div className="desk-actions">
        {actionSlot ?? (
          <Button type="button" className="btn-secondary" onClick={onAskCopilot}>
            <Sparkles size={16} />
            <span>{askCopilotLabel}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
