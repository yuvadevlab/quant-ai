/**
 * @file src/features/predictions/components/PredictionsTable.tsx
 * @description Tabular signal audit ledger using DevLab UI Table primitives.
 * @author yuva.devlab@gmail.com
 */

import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@quant-ai/ui";
import { UiSignalDirection, UiSignalStatus, type Signal } from "@/components/quantai/data";
import { PREDICTIONS_COPY } from "@/lib/ui-copy/predictions.copy";

export interface PredictionsTableProps {
  readonly signals: readonly Signal[];
}

export function PredictionsTable({ signals }: PredictionsTableProps) {
  const copy = PREDICTIONS_COPY.TABLE;

  return (
    <div className="desk-table-card">
      <div className="table-responsive">
        <Table className="quant-table" aria-label={copy.ARIA_LABEL}>
          <TableHeader>
            <TableRow>
              <TableHead>{copy.COL_SIGNAL}</TableHead>
              <TableHead>{copy.COL_INSTRUMENT}</TableHead>
              <TableHead>{copy.COL_STANCE}</TableHead>
              <TableHead>{copy.COL_ENTRY}</TableHead>
              <TableHead>{copy.COL_TARGETS}</TableHead>
              <TableHead>{copy.COL_STOP}</TableHead>
              <TableHead>{copy.COL_LTP}</TableHead>
              <TableHead>{copy.COL_STATUS}</TableHead>
              <TableHead>{copy.COL_EXCURSION}</TableHead>
              <TableHead>{copy.COL_ACTION}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {signals.map((signal) => {
              const isBuy = signal.direction === UiSignalDirection.BUY;
              const statusClass =
                signal.status === UiSignalStatus.ACTIVE
                  ? "pill-active"
                  : signal.status === UiSignalStatus.TARGET_HIT
                    ? "pill-target"
                    : signal.status === UiSignalStatus.STOP_HIT
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
                      <span className="text-muted">T2: {signal.target2}</span>
                    </div>
                  </TableCell>
                  <TableCell className="mono text-loss">{signal.stop}</TableCell>
                  <TableCell className="mono font-semibold">{signal.last}</TableCell>
                  <TableCell>
                    <span className={`outcome-pill ${statusClass}`}>
                      {signal.status === UiSignalStatus.ACTIVE && <span className="pulse-ping" />}
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
                    <Link
                      to="/predictions/$id"
                      params={{ id: signal.id }}
                      className="btn-table-action"
                    >
                      <span>{copy.INSPECT_ACTION}</span>
                      <ArrowRight size={13} />
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
