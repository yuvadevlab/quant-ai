/**
 * @file packages/ui/src/components/ScreenerTable.tsx
 * @description Screener results table with RSI meters, EMA status, options OI tags using DevLab UI Table primitives.
 * @author yuva.devlab@gmail.com
 */

import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Sparkles } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Card,
  CardContent,
} from "@yuva-devlab/ui";
import type { ScreenerTableItem } from "../types";

/**
 * Props for the ScreenerTable presentation component.
 */
export interface ScreenerTableProps {
  /** Array of screener rows to render */
  readonly items: readonly ScreenerTableItem[];
  /** Optional custom action link renderer for each row */
  readonly renderAnalyzeLink?: (item: ScreenerTableItem) => ReactNode;
  /** Optional analyze click callback */
  readonly onAnalyze?: (symbol: string) => void;
  /** Action button text label */
  readonly analyzeLabel?: string;
  /** Empty state message */
  readonly emptyMessage?: string;
  /** Table accessible label */
  readonly ariaLabel?: string;
}

/**
 * Institutional quantitative screener table with visual indicator bars and setup badges.
 *
 * @param props - ScreenerTableProps containing items and action handlers.
 * @returns Rendered JSX ScreenerTable element.
 */
export function ScreenerTable({
  items,
  renderAnalyzeLink,
  onAnalyze,
  analyzeLabel = "ANALYZE",
  emptyMessage = "No matching instruments found for the selected criteria.",
  ariaLabel = "Quantitative Screener Results",
}: ScreenerTableProps) {
  return (
    <Card className="desk-table-card">
      <CardContent className="table-responsive p-0">
        <Table className="quant-table" aria-label={ariaLabel}>
          <TableHeader>
            <TableRow>
              <TableHead>SYMBOL / CO.</TableHead>
              <TableHead>SECTOR</TableHead>
              <TableHead>PRICE (LTP)</TableHead>
              <TableHead>PATTERN</TableHead>
              <TableHead>RSI (14)</TableHead>
              <TableHead>20/50 EMA</TableHead>
              <TableHead>OI ACTION</TableHead>
              <TableHead>VOL SURGE</TableHead>
              <TableHead>SETUP CANDIDATE</TableHead>
              <TableHead>ACTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const oiLower = item.oiAction.toLowerCase();
              const isBullishOi = oiLower.includes("long") || oiLower.includes("covering");
              const candLower = item.signalCandidate.toLowerCase();
              const candClass = candLower.includes("buy")
                ? "badge-buy"
                : candLower.includes("sell")
                  ? "badge-sell"
                  : "badge-neutral";

              return (
                <TableRow key={item.symbol}>
                  <TableCell>
                    <div className="symbol-cell">
                      <strong className="symbol-name">{item.symbol}</strong>
                      <span className="company-sub">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="sector-badge">{item.sector}</span>
                  </TableCell>
                  <TableCell>
                    <div className="price-cell">
                      <span className="price-mono">{item.price}</span>
                      <span className={`change-pill ${item.positive ? "pill-gain" : "pill-loss"}`}>
                        {item.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {item.change}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="pattern-tag">{item.pattern}</span>
                  </TableCell>
                  <TableCell>
                    <div className="rsi-cell">
                      <span
                        className={`rsi-val ${item.rsi > 70 ? "rsi-high" : item.rsi < 40 ? "rsi-low" : "rsi-mid"}`}
                      >
                        {item.rsi}
                      </span>
                      <div className="rsi-meter">
                        <div
                          className="rsi-meter-bar"
                          style={{ width: `${Math.min(100, item.rsi)}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="ema-tag">{item.emaStatus}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`oi-tag ${isBullishOi ? "oi-bullish" : "oi-bearish"}`}>
                      {item.oiAction}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`volume-stat ${item.volumeSurge.startsWith("+") ? "text-gain" : "text-loss"}`}
                    >
                      {item.volumeSurge}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`candidate-badge ${candClass}`}>{item.signalCandidate}</span>
                  </TableCell>
                  <TableCell>
                    {renderAnalyzeLink ? (
                      renderAnalyzeLink(item)
                    ) : (
                      <button
                        type="button"
                        onClick={() => onAnalyze?.(item.symbol)}
                        className="btn-table-action"
                        title={`Analyze ${item.symbol} with AI Financial Copilot`}
                      >
                        <Sparkles size={14} />
                        <span>{analyzeLabel}</span>
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
            {items.length === 0 && (
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
