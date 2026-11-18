/**
 * @file apps/web/src/components/quantai/predictions-table.tsx
 * @description Audit ledger table displaying predictions, target levels, excursions, and actions.
 */

import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Signal } from "./data";

/**
 * Props for the PredictionsTable component.
 */
export interface PredictionsTableProps {
  /** Array of filtered signals to display */
  readonly signals: readonly Signal[];
}

/**
 * Renders the tabular signal audit ledger.
 *
 * @param props - Signals data array.
 * @returns Rendered JSX PredictionsTable element.
 */
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
              const isBuy = signal.direction === "BUY";
              const statusClass =
                signal.status === "Active"
                  ? "pill-active"
                  : signal.status === "Target hit"
                    ? "pill-target"
                    : signal.status === "Stop loss hit"
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
                    <div className="symbol-cell">
                      <strong className="symbol-name">{signal.symbol}</strong>
                      <span className="company-sub">{signal.instrument}</span>
                    </div>
                  </td>
                  <td>
                    <div className="stance-cell">
                      <span className={`direction-badge ${isBuy ? "badge-buy" : "badge-sell"}`}>
                        {isBuy ? "BUY · LONG" : "SELL · SHORT"}
                      </span>
                      <span className="horizon-tag">{signal.horizon}</span>
                    </div>
                  </td>
                  <td>
                    <span className="mono">{signal.entry}</span>
                  </td>
                  <td>
                    <div className="target-cell mono">
                      <span className="text-gain">T1 {signal.target1}</span>
                      <span className="text-muted">T2 {signal.target2}</span>
                    </div>
                  </td>
                  <td>
                    <span className="mono text-loss">{signal.stop}</span>
                  </td>
                  <td>
                    <div className="price-cell">
                      <strong className="mono highlight">{signal.last}</strong>
                      <span className={`change-pill ${isBuy ? "pill-gain" : "pill-loss"}`}>
                        {signal.change}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`outcome-pill ${statusClass}`}>
                      {signal.status.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div className="excursion-cell mono">
                      <span className="text-gain">{signal.mfe}</span>
                      <span className="text-loss">{signal.mae}</span>
                    </div>
                  </td>
                  <td>
                    <Link
                      to="/predictions/$id"
                      params={{ id: signal.id }}
                      className="btn-table-action"
                      title={`Inspect trajectory for ${signal.symbol}`}
                    >
                      <span>Inspect</span>
                      <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              );
            })}
            {signals.length === 0 && (
              <tr>
                <td colSpan={10} className="empty-table-cell">
                  No prediction calls match the chosen filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
