/**
 * @file packages/ui/src/components/PredictionsHeader.tsx
 * @description Header banner and action controls for the Prediction Lab & Signal Audit Ledger.
 * @author yuva.devlab@gmail.com
 */

import type { ReactNode } from "react";
import { ChevronRight, Download } from "lucide-react";
import { Button } from "@yuva-devlab/ui";

/**
 * Props for the PredictionsHeader presentation component.
 */
export interface PredictionsHeaderProps {
  /** Count of active in-flight signals */
  readonly activeCount: number;
  /** Main desk title */
  readonly title?: string;
  /** Subtitle narrative */
  readonly subtitle?: string;
  /** Intelligence section breadcrumb label */
  readonly breadcrumbLabel?: string;
  /** Export audit button label */
  readonly exportLabel?: string;
  /** In-flight tag suffix label */
  readonly inFlightSuffix?: string;
  /** Callback when user clicks export audit */
  readonly onExportAudit?: () => void;
  /** Optional custom action slot overriding default export button */
  readonly actionSlot?: ReactNode;
}

/**
 * Institutional header banner for the Prediction Lab workstation desk.
 *
 * @param props - Header props containing counts and actions.
 * @returns Rendered JSX PredictionsHeader element.
 */
export function PredictionsHeader({
  activeCount,
  title = "PREDICTION LAB & SIGNAL LEDGER",
  subtitle = "Deterministic multi-agent trade recommendations with real-time trajectory cones & full auditability.",
  breadcrumbLabel = "INTELLIGENCE",
  exportLabel = "EXPORT AUDIT",
  inFlightSuffix = "IN-FLIGHT",
  onExportAudit,
  actionSlot,
}: PredictionsHeaderProps) {
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
        <span className="paper-trading-tag">
          <span className="pulse-ping" />
          <span>
            {activeCount} {inFlightSuffix}
          </span>
        </span>
        {actionSlot ?? (
          <Button
            type="button"
            className="btn-secondary"
            onClick={onExportAudit ?? (() => window.print())}
          >
            <Download size={15} />
            <span>{exportLabel}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
