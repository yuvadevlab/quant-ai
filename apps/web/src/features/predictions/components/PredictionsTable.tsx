/**
 * @file src/features/predictions/components/PredictionsTable.tsx
 * @description Tabular signal audit ledger showing trade outcomes, excursions, and trajectory inspector links.
 */

import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { UiSignalDirection, UiSignalStatus, type Signal } from "@/components/quantai/data";

export interface PredictionsTableProps {
  readonly signals: readonly Signal[];
}

export function PredictionsTable({ signals }: PredictionsTableProps) {
  return (
    <div className="desk-table-card">
      <div className="table-responsive">
        <table className="quant-table" aria-label="Signal Audit Table">
          <thead>
            <tr>
              <th>SIGNAL & TIMESTAMP</th>
              <th>INSTRUMENT</th>
              <th>STANCE</th>
              <th>ENTRY RANGE</th>
              <th>TARGET LEVELS</th>
              <th>STOP LOSS</th>
              <th>CURRENT LTP</th>
              <th>STATUS</th>
              <th>MFE / MAE</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
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
                <tr key={signal.id}>
                  <td>
                    <div className="symbol-cell">
                      <span className="mono text-muted">{signal.id}</span>
                      <span className="time-sub">{signal.time}</span>
                    </div>
                  </td>
                  <td>
                    <div className="instrument-cell">
                      <span className="symbol-strong">{signal.symbol}</span>
                      <span className="instrument-sub">{signal.instrument}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`direction-badge ${isBuy ? "badge-buy" : "badge-sell"}`}>
                      {signal.direction}
                    </span>
                  </td>
                  <td className="mono">{signal.entry}</td>
                  <td>
                    <div className="targets-cell mono">
                      <span className="text-gain">T1: {signal.target1}</span>
                      <span className="text-muted">T2: {signal.target2}</span>
                    </div>
                  </td>
                  <td className="mono text-loss">{signal.stop}</td>
                  <td className="mono font-semibold">{signal.last}</td>
                  <td>
                    <span className={`outcome-pill ${statusClass}`}>
                      {signal.status === UiSignalStatus.ACTIVE && <span className="pulse-ping" />}
                      {signal.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div className="excursion-cell mono">
                      <span className="text-gain">MFE {signal.mfe}</span>
                      <span className="text-loss">MAE {signal.mae}</span>
                    </div>
                  </td>
                  <td>
                    <Link
                      to="/predictions/$id"
                      params={{ id: signal.id }}
                      className="btn-table-action"
                    >
                      <span>Inspect</span>
                      <ArrowRight size={13} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
