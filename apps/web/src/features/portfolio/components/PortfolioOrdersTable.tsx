/**
 * @file src/features/portfolio/components/PortfolioOrdersTable.tsx
 * @description Historical completed orders audit log.
 */

import { ShieldCheck } from "lucide-react";
import type { PortfolioData } from "../api/getPortfolioData";

export interface PortfolioOrdersTableProps {
  readonly executions: PortfolioData["recentExecutions"];
}

export function PortfolioOrdersTable({ executions }: PortfolioOrdersTableProps) {
  return (
    <div className="desk-panel execution-history-panel">
      <div className="panel-heading">
        <div className="panel-title-wrap">
          <ShieldCheck size={18} className="panel-icon" />
          <h2 className="panel-title">Completed Orders Audit Log</h2>
        </div>
        <span className="panel-status-pill">Historical Executions</span>
      </div>

      <div className="table-responsive">
        <table className="quant-table" aria-label="Order Audit Log">
          <thead>
            <tr>
              <th>ORDER ID</th>
              <th>INSTRUMENT</th>
              <th>SIDE</th>
              <th>QTY</th>
              <th>ENTRY PRICE</th>
              <th>EXIT PRICE</th>
              <th>REALIZED P&L</th>
              <th>OUTCOME</th>
              <th>EXECUTION TIME</th>
            </tr>
          </thead>
          <tbody>
            {executions.map((ord) => (
              <tr key={ord.id}>
                <td className="mono text-muted">{ord.id}</td>
                <td>
                  <strong>{ord.symbol}</strong>
                </td>
                <td>
                  <span className={`side-badge ${ord.type === "BUY" ? "badge-buy" : "badge-sell"}`}>
                    {ord.type}
                  </span>
                </td>
                <td className="mono">{ord.qty}</td>
                <td className="mono">{ord.price}</td>
                <td className="mono">{ord.exitPrice}</td>
                <td>
                  <strong className={`mono ${ord.pnl.startsWith("+") ? "text-gain" : "text-loss"}`}>
                    {ord.pnl}
                  </strong>
                </td>
                <td>
                  <span
                    className={`outcome-pill ${
                      ord.result.includes("Hit") && !ord.result.includes("Stop")
                        ? "pill-target"
                        : "pill-stop"
                    }`}
                  >
                    {ord.result}
                  </span>
                </td>
                <td className="text-muted">{ord.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
