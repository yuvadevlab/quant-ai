/**
 * @file packages/ui/src/components/PortfolioPositionsTable.tsx
 * @description Active simulated positions table with real-time P&L using DevLab UI Table primitives.
 * @author yuva.devlab@gmail.com
 */

import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Briefcase } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@yuva-devlab/ui";
import type { PositionItem } from "../types";

/**
 * Props for the PortfolioPositionsTable presentation component.
 */
export interface PortfolioPositionsTableProps {
  /** Array of active open position items */
  readonly positions: readonly PositionItem[];
  /** Callback when user simulates closing a position */
  readonly onSimulateExit?: (symbol: string) => void;
  /** Optional custom action renderer */
  readonly renderExitAction?: (pos: PositionItem) => ReactNode;
  /** Title of the panel */
  readonly title?: string;
  /** Empty state message */
  readonly emptyMessage?: string;
}

/**
 * Institutional open positions table displaying instrument, quantity, prices, and live P&L.
 *
 * @param props - PortfolioPositionsTableProps containing positions array and handlers.
 * @returns Rendered JSX PortfolioPositionsTable element.
 */
export function PortfolioPositionsTable({
  positions,
  onSimulateExit,
  renderExitAction,
  title = "ACTIVE POSITIONS",
  emptyMessage = "No active positions currently open in paper ledger.",
}: PortfolioPositionsTableProps) {
  return (
    <Card className="desk-panel open-positions-panel">
      <CardHeader className="panel-heading">
        <div className="panel-title-wrap">
          <Briefcase size={18} className="panel-icon" />
          <CardTitle className="panel-title">{title}</CardTitle>
        </div>
        <span className="panel-status-pill">{positions.length} OPEN</span>
      </CardHeader>

      <CardContent className="table-responsive p-0">
        <Table className="quant-table" aria-label="Active Simulated Positions Table">
          <TableHeader>
            <TableRow>
              <TableHead>INSTRUMENT</TableHead>
              <TableHead>SIDE</TableHead>
              <TableHead>QTY</TableHead>
              <TableHead>AVG ENTRY</TableHead>
              <TableHead>LTP</TableHead>
              <TableHead>P&L (₹)</TableHead>
              <TableHead>RETURN (%)</TableHead>
              <TableHead>STOP LOSS</TableHead>
              <TableHead>TARGET</TableHead>
              <TableHead>ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.map((pos) => {
              const pnlPct =
                pos.pnlPercent ??
                (pos.entryPrice
                  ? Number(
                      (((pos.currentPrice - pos.entryPrice) / pos.entryPrice) * 100).toFixed(2),
                    )
                  : 0);
              const targetVal = pos.target ?? pos.targetPrice ?? pos.entryPrice * 1.02;
              const isLong = pos.side.toUpperCase() === "LONG";

              return (
                <TableRow key={pos.symbol}>
                  <TableCell>
                    <div className="symbol-cell">
                      <strong className="symbol-name">{pos.symbol}</strong>
                      <span className="company-sub">{pos.instrument}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`side-badge ${isLong ? "badge-buy" : "badge-sell"}`}>
                      {pos.side}
                    </span>
                  </TableCell>
                  <TableCell className="mono">{pos.qty}</TableCell>
                  <TableCell className="mono">₹{pos.entryPrice.toLocaleString("en-IN")}</TableCell>
                  <TableCell className="mono highlight">
                    ₹{pos.currentPrice.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <span className={`pnl-val mono ${pos.pnl >= 0 ? "text-gain" : "text-loss"}`}>
                      {pos.pnl >= 0
                        ? `+₹${pos.pnl.toLocaleString("en-IN")}`
                        : `−₹${Math.abs(pos.pnl).toLocaleString("en-IN")}`}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`change-pill ${pnlPct >= 0 ? "pill-gain" : "pill-loss"}`}>
                      {pnlPct >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {pnlPct >= 0 ? `+${pnlPct}%` : `${pnlPct}%`}
                    </span>
                  </TableCell>
                  <TableCell className="mono text-loss">
                    ₹{pos.stopLoss.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="mono text-gain">
                    ₹{targetVal.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    {renderExitAction ? (
                      renderExitAction(pos)
                    ) : (
                      <Button
                        type="button"
                        onClick={() => onSimulateExit?.(pos.symbol)}
                        className="btn-table-action btn-close-pos"
                      >
                        SIMULATE EXIT
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {positions.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="empty-table-cell">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
