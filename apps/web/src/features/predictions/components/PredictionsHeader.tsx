/**
 * @file src/features/predictions/components/PredictionsHeader.tsx
 * @description Header banner and action controls for the Prediction Lab & Audit Ledger.
 */

import { ChevronRight, Download } from "lucide-react";
import { PREDICTIONS_COPY } from "@/lib/ui-copy/predictions.copy";

export interface PredictionsHeaderProps {
  readonly activeCount: number;
}

export function PredictionsHeader({ activeCount }: PredictionsHeaderProps) {
  return (
    <div className="desk-header">
      <div>
        <div className="desk-breadcrumb">
          <span>INTELLIGENCE</span>
          <ChevronRight size={14} />
          <span className="current">{PREDICTIONS_COPY.HEADER.TITLE.toUpperCase()}</span>
        </div>
        <h1 className="desk-title">{PREDICTIONS_COPY.HEADER.TITLE}</h1>
        <p className="desk-subtitle">{PREDICTIONS_COPY.HEADER.SUBTITLE}</p>
      </div>
      <div className="desk-actions">
        <span className="paper-trading-tag">
          <span className="pulse-ping" />
          <span>{activeCount} IN-FLIGHT SIGNALS</span>
        </span>
        <button type="button" className="btn-secondary" onClick={() => window.print()}>
          <Download size={15} />
          <span>Export Audit</span>
        </button>
      </div>
    </div>
  );
}
