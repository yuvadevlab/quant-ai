/**
 * @file src/features/portfolio/components/PortfolioPositionsTable.tsx
 * @description Active simulated positions table with real-time P&L using DevLab UI Table primitives.
 * @author yuva.devlab@gmail.com
 */

import { ArrowDownRight, ArrowUpRight, Briefcase } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Button,
} from "@quant-ai/ui";
import { PositionSide } from "@/constants/market.constants";
import { PORTFOLIO_COPY } from "@/lib/ui-copy/portfolio.copy";
import type { PortfolioData } from "../api/getPortfolioData";

export interface PortfolioPositionsTableProps {
  readonly positions: PortfolioData["positions"];
}

export function PortfolioPositionsTable({ positions }: PortfolioPositionsTableProps) {
  const copy = PORTFOLIO_COPY.POSITIONS_TABLE;

  return (
    <div className="desk-panel open-positions-panel">
      <div className="panel-heading">
        <div className="panel-title-wrap">
          <Briefcase size={18} className="panel-icon" />
          <h2 className="panel-title">{copy.TITLE}</h2>
        </div>
        <span className="panel-status-pill">
          {positions.length} {copy.PILL_SUFFIX}
        </span>
      </div>

      <div className="table-responsive">
        <Table className="quant-table" aria-label={copy.ARIA_LABEL}>
          <TableHeader>
            <TableRow>
              <TableHead>{copy.COL_INSTRUMENT}</TableHead>
              <TableHead>{copy.COL_SIDE}</TableHead>
              <TableHead>{copy.COL_QTY}</TableHead>
              <TableHead>{copy.COL_AVG_ENTRY}</TableHead>
              <TableHead>{copy.COL_LTP}</TableHead>
              <TableHead>{copy.COL_PNL}</TableHead>
              <TableHead>{copy.COL_RETURN}</TableHead>
              <TableHead>{copy.COL_STOP}</TableHead>
              <TableHead>{copy.COL_TARGET}</TableHead>
              <TableHead>{copy.COL_ACTION}</TableHead>
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

              return (
                <TableRow key={pos.symbol}>
                  <TableCell>
                    <div className="symbol-cell">
                      <strong className="symbol-name">{pos.symbol}</strong>
                      <span className="company-sub">{pos.instrument}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`side-badge ${pos.side === PositionSide.LONG ? "badge-buy" : "badge-sell"}`}
                    >
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
                    <Button type="button" className="btn-table-action btn-close-pos">
                      {copy.SIMULATE_EXIT_BTN}
                    </Button>
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
