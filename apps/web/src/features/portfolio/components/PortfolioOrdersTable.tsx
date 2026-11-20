/**
 * @file src/features/portfolio/components/PortfolioOrdersTable.tsx
 * @description Historical completed orders audit log using DevLab UI Table primitives.
 * @author yuva.devlab@gmail.com
 */

import { ShieldCheck } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@quant-ai/ui";
import { OrderSide } from "@/constants/market.constants";
import { PORTFOLIO_COPY } from "@/lib/ui-copy/portfolio.copy";
import type { PortfolioData } from "../api/getPortfolioData";

export interface PortfolioOrdersTableProps {
  readonly executions: PortfolioData["recentExecutions"];
}

export function PortfolioOrdersTable({ executions }: PortfolioOrdersTableProps) {
  const copy = PORTFOLIO_COPY.ORDERS_TABLE;

  return (
    <div className="desk-panel execution-history-panel">
      <div className="panel-heading">
        <div className="panel-title-wrap">
          <ShieldCheck size={18} className="panel-icon" />
          <h2 className="panel-title">{copy.TITLE}</h2>
        </div>
        <span className="panel-status-pill">{copy.PILL}</span>
      </div>

      <div className="table-responsive">
        <Table className="quant-table" aria-label={copy.ARIA_LABEL}>
          <TableHeader>
            <TableRow>
              <TableHead>{copy.COL_ORDER_ID}</TableHead>
              <TableHead>{copy.COL_INSTRUMENT}</TableHead>
              <TableHead>{copy.COL_SIDE}</TableHead>
              <TableHead>{copy.COL_QTY}</TableHead>
              <TableHead>{copy.COL_ENTRY}</TableHead>
              <TableHead>{copy.COL_EXIT}</TableHead>
              <TableHead>{copy.COL_PNL}</TableHead>
              <TableHead>{copy.COL_OUTCOME}</TableHead>
              <TableHead>{copy.COL_TIME}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {executions.map((ord) => {
              const pnlVal = ord.pnl ?? "₹0";
              const pnlStr =
                typeof pnlVal === "number"
                  ? `${pnlVal >= 0 ? "+" : ""}₹${pnlVal.toLocaleString("en-IN")}`
                  : String(pnlVal);
              const isGain = pnlStr.startsWith("+");
              const resultText = ord.result ?? ord.outcome ?? "Executed";
              const isTargetHit = resultText.includes("Hit") && !resultText.includes("Stop");

              return (
                <TableRow key={ord.id}>
                  <TableCell className="mono text-muted">{ord.id}</TableCell>
                  <TableCell>
                    <strong>{ord.symbol}</strong>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`side-badge ${ord.type === OrderSide.BUY ? "badge-buy" : "badge-sell"}`}
                    >
                      {ord.type}
                    </span>
                  </TableCell>
                  <TableCell className="mono">{ord.qty}</TableCell>
                  <TableCell className="mono">{ord.price ?? ord.entryPrice}</TableCell>
                  <TableCell className="mono">{ord.exitPrice}</TableCell>
                  <TableCell>
                    <strong className={`mono ${isGain ? "text-gain" : "text-loss"}`}>
                      {pnlStr}
                    </strong>
                  </TableCell>
                  <TableCell>
                    <span className={`outcome-pill ${isTargetHit ? "pill-target" : "pill-stop"}`}>
                      {resultText}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted">{ord.time ?? ord.timestamp}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
