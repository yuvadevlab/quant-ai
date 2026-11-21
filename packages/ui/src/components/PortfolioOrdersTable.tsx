/**
 * @file packages/ui/src/components/PortfolioOrdersTable.tsx
 * @description Historical completed orders audit log using DevLab UI Table primitives.
 * @author yuva.devlab@gmail.com
 */

import { ShieldCheck } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
} from "@yuva-devlab/ui";
import type { ExecutionItem } from "../types";

/**
 * Props for the PortfolioOrdersTable presentation component.
 */
export interface PortfolioOrdersTableProps {
  /** Array of completed order execution audit records */
  readonly executions: readonly ExecutionItem[];
  /** Table panel title */
  readonly title?: string;
  /** Status pill text */
  readonly statusPill?: string;
  /** Empty state message */
  readonly emptyMessage?: string;
}

/**
 * Institutional historical completed orders audit log table.
 *
 * @param props - PortfolioOrdersTableProps containing executions array.
 * @returns Rendered JSX PortfolioOrdersTable element.
 */
export function PortfolioOrdersTable({
  executions,
  title = "EXECUTION & FILL AUDIT LOG",
  statusPill = "SIMULATED FILLS",
  emptyMessage = "No executions recorded yet.",
}: PortfolioOrdersTableProps) {
  return (
    <Card className="desk-panel execution-history-panel">
      <CardHeader className="panel-heading">
        <div className="panel-title-wrap">
          <ShieldCheck size={18} className="panel-icon" />
          <CardTitle className="panel-title">{title}</CardTitle>
        </div>
        <Badge className="panel-status-pill">{statusPill}</Badge>
      </CardHeader>

      <CardContent className="table-responsive p-0">
        <Table className="quant-table" aria-label="Completed Orders Audit Log">
          <TableHeader>
            <TableRow>
              <TableHead>ORDER ID</TableHead>
              <TableHead>INSTRUMENT</TableHead>
              <TableHead>TYPE</TableHead>
              <TableHead>QTY</TableHead>
              <TableHead>ENTRY PRICE</TableHead>
              <TableHead>EXIT PRICE</TableHead>
              <TableHead>NET P&L</TableHead>
              <TableHead>OUTCOME</TableHead>
              <TableHead>FILL TIME</TableHead>
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
              const isBuy = ord.type.toUpperCase() === "BUY";

              return (
                <TableRow key={ord.id}>
                  <TableCell className="mono text-muted">{ord.id}</TableCell>
                  <TableCell>
                    <strong>{ord.symbol}</strong>
                  </TableCell>
                  <TableCell>
                    <Badge className={`side-badge ${isBuy ? "badge-buy" : "badge-sell"}`}>
                      {ord.type}
                    </Badge>
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
                    <Badge className={`outcome-pill ${isTargetHit ? "pill-target" : "pill-stop"}`}>
                      {resultText}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted">{ord.time ?? ord.timestamp}</TableCell>
                </TableRow>
              );
            })}
            {executions.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="empty-table-cell">
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
