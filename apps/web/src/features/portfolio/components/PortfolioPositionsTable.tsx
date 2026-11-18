/**
 * @file src/features/portfolio/components/PortfolioPositionsTable.tsx
 * @description Active simulated positions table with real-time P&L and risk controls.
 */

import { ArrowDownRight, ArrowUpRight, Briefcase } from "lucide-react";
import type { PortfolioData } from "../api/getPortfolioData";

export interface PortfolioPositionsTableProps {
  readonly positions: PortfolioData["positions"];
}

export function PortfolioPositionsTable({ positions }: PortfolioPositionsTableProps) {
  return (
    <div className="desk-panel open-positions-panel">
      <div className="panel-heading">
        <div className="panel-title-wrap">
          <Briefcase size={18} className="panel-icon" />
          <h2 className="panel-title">Active Simulated Positions</h2>
        </div>
        <span className="panel-status-pill">{positions.length} Open Positions</span>
      </div>

      <div className="table-responsive">
        <table className="quant-table" aria-label="Open Positions">
          <thead>
            <tr>
              <th>INSTRUMENT</th>
              <th>SIDE</th>
              <th>QTY</th>
              <th>AVG ENTRY</th>
              <th>CURRENT LTP</th>
              <th>P&L (₹)</th>
              <th>RETURN (%)</th>
              <th>STOP LOSS</th>
              <th>TARGET</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((pos) => (
              <tr key={pos.symbol}>
                <td>
                  <div className="symbol-cell">
                    <strong className="symbol-name">{pos.symbol}</strong>
                    <span className="company-sub">{pos.instrument}</span>
                  </div>
                </td>
                <td>
                  <span
                    className={`side-badge ${pos.side === "LONG" ? "badge-buy" : "badge-sell"}`}
                  >
                    {pos.side}
                  </span>
                </td>
                <td className="mono">{pos.qty}</td>
                <td className="mono">₹{pos.entryPrice.toLocaleString("en-IN")}</td>
                <td className="mono highlight">₹{pos.currentPrice.toLocaleString("en-IN")}</td>
                <td>
                  <span className={`pnl-val mono ${pos.pnl >= 0 ? "text-gain" : "text-loss"}`}>
                    {pos.pnl >= 0
                      ? `+₹${pos.pnl.toLocaleString("en-IN")}`
                      : `−₹${Math.abs(pos.pnl).toLocaleString("en-IN")}`}
                  </span>
                </td>
                <td>
                  <span
                    className={`change-pill ${pos.pnlPercent >= 0 ? "pill-gain" : "pill-loss"}`}
                  >
                    {pos.pnlPercent >= 0 ? (
                      <ArrowUpRight size={12} />
                    ) : (
                      <ArrowDownRight size={12} />
                    )}
                    {pos.pnlPercent >= 0 ? `+${pos.pnlPercent}%` : `${pos.pnlPercent}%`}
                  </span>
                </td>
                <td className="mono text-loss">₹{pos.stopLoss.toLocaleString("en-IN")}</td>
                <td className="mono text-gain">₹{pos.target.toLocaleString("en-IN")}</td>
                <td>
                  <button type="button" className="btn-table-action btn-close-pos">
                    Simulate Exit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
