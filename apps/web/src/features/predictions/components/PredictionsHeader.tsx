/**
 * @file src/features/predictions/components/PredictionsHeader.tsx
 * @description Header banner and action controls for the Prediction Lab & Audit Ledger.
 * @author yuva.devlab@gmail.com
 */

import { ChevronRight, Download } from "lucide-react";
import { Button } from "@quant-ai/ui";
import { PREDICTIONS_COPY } from "@/lib/ui-copy/predictions.copy";

export interface PredictionsHeaderProps {
  readonly activeCount: number;
}

export function PredictionsHeader({ activeCount }: PredictionsHeaderProps) {
  const copy = PREDICTIONS_COPY.HEADER;

  return (
    <div className="desk-header">
      <div>
        <div className="desk-breadcrumb">
          <span>{copy.BREADCRUMB_INTELLIGENCE}</span>
          <ChevronRight size={14} />
          <span className="current">{copy.TITLE.toUpperCase()}</span>
        </div>
        <h1 className="desk-title">{copy.TITLE}</h1>
        <p className="desk-subtitle">{copy.SUBTITLE}</p>
      </div>
      <div className="desk-actions">
        <span className="paper-trading-tag">
          <span className="pulse-ping" />
          <span>
            {activeCount} {copy.IN_FLIGHT_SUFFIX}
          </span>
        </span>
        <Button type="button" className="btn-secondary" onClick={() => window.print()}>
          <Download size={15} />
          <span>{copy.EXPORT_AUDIT}</span>
        </Button>
      </div>
    </div>
  );
}
