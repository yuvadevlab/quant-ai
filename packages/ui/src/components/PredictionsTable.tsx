/**
 * @file packages/ui/src/components/PredictionsTable.tsx
 * @description Tabular signal audit ledger using DevLab UI Table primitives.
 * @author yuva.devlab@gmail.com
 */

import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import {
  Button,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Card,
  CardContent,
} from "@yuva-devlab/ui";
import type { TableSignalItem } from "../types";

/**
 * Props for the PredictionsTable presentation component.
 */
export interface PredictionsTableProps {
  /** Array of trading signal items to render */
  readonly signals: readonly TableSignalItem[];
  /** Optional custom action link renderer for each row */
  readonly renderInspectLink?: (signal: TableSignalItem) => ReactNode;
  /** Optional inspect click callback */
  readonly onInspect?: (signalId: string) => void;
  /** Inspect action button label */
  readonly inspectLabel?: string;
  /** Table accessible label */
  readonly ariaLabel?: string;
  /** Empty state heading */
  readonly emptyTitle?: string;
  /** Empty state message description */
  readonly emptyDescription?: string;
}

/**
 * Institutional signal audit ledger table.
 *
 * @param props - Signals array and inspection action callbacks.
 * @returns Rendered JSX PredictionsTable element.
 */
export function PredictionsTable({
  signals,
  renderInspectLink,
  onInspect,
  inspectLabel = "INSPECT",
  ariaLabel = "Prediction Signals Audit Ledger",
  emptyTitle = "No Active Predictions",
  emptyDescription = "No signals match the selected filter criteria. Run a market scan to analyze new opportunities.",
}: PredictionsTableProps) {
  return (
    <Card className="desk-table-card">
      <CardContent className="table-responsive p-0">
        <Table className="quant-table" aria-label={ariaLabel}>
          <TableHeader>
            <TableRow>
              <TableHead>SIGNAL ID</TableHead>
              <TableHead>INSTRUMENT</TableHead>
              <TableHead>STANCE</TableHead>
              <TableHead>ENTRY ZONE</TableHead>
              <TableHead>TARGETS (T1 / T2)</TableHead>
              <TableHead>STOP LOSS</TableHead>
              <TableHead>LTP</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>EXCURSION (MFE / MAE)</TableHead>
              <TableHead>ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {signals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="table-empty-cell">
                  <div className="table-empty-state">
                    <p className="table-empty-title">{emptyTitle}</p>
                    <p className="table-empty-desc">{emptyDescription}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              signals.map((signal) => {
                const isBuy = signal.direction.toUpperCase() === "BUY";
                const statusLower = signal.status.toLowerCase();
                const statusClass = statusLower.includes("active")
                  ? "pill-active"
                  : statusLower.includes("target")
                    ? "pill-target"
                    : statusLower.includes("stop")
                      ? "pill-stop"
                      : "pill-expired";

                return (
                  <TableRow key={signal.id}>
                    <TableCell>
                      <div className="symbol-cell">
                        <span className="mono text-muted">{signal.id}</span>
                        <span className="time-sub">{signal.time}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="instrument-cell">
                        <span className="symbol-strong">{signal.symbol}</span>
                        <span className="instrument-sub">{signal.instrument}</span>
                        {signal.dataProvenance && (
                          <span className="instrument-sub">{signal.dataProvenance}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`direction-badge ${isBuy ? "badge-buy" : "badge-sell"}`}>
                        {signal.direction}
                      </span>
                    </TableCell>
                    <TableCell className="mono">{signal.entry}</TableCell>
                    <TableCell>
                      <div className="targets-cell mono">
                        <span className="text-gain">T1: {signal.target1}</span>
                        {signal.target2 && <span className="text-muted">T2: {signal.target2}</span>}
                      </div>
                    </TableCell>
                    <TableCell className="mono text-loss">{signal.stop}</TableCell>
                    <TableCell className="mono font-semibold">{signal.last}</TableCell>
                    <TableCell>
                      <span className={`outcome-pill ${statusClass}`}>
                        {statusLower.includes("active") && <span className="pulse-ping" />}
                        {signal.status.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="excursion-cell mono">
                        <span className="text-gain">MFE {signal.mfe}</span>
                        <span className="text-loss">MAE {signal.mae}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {renderInspectLink ? (
                        renderInspectLink(signal)
                      ) : (
                        <Button
                          type="button"
                          onClick={() => onInspect?.(signal.id)}
                          className="btn-table-action"
                        >
                          <span>{inspectLabel}</span>
                          <ArrowRight size={13} />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
