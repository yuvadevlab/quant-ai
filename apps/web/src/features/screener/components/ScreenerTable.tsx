/**
 * @file src/features/screener/components/ScreenerTable.tsx
 * @description Screener results table with RSI meters, EMA status, options OI tags using DevLab UI Table primitives.
 * @author yuva.devlab@gmail.com
 */

import { Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, Sparkles } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@quant-ai/ui";
import { OiAction, SignalCandidate, type ScreenerItem } from "@/components/quantai/data";
import { AppRoute } from "@/constants/routes.constants";
import { SCREENER_COPY } from "@/lib/ui-copy/screener.copy";

export interface ScreenerTableProps {
  readonly items: readonly ScreenerItem[];
}

export function ScreenerTable({ items }: ScreenerTableProps) {
  const copy = SCREENER_COPY.TABLE;

  return (
    <div className="desk-table-card">
      <div className="table-responsive">
        <Table className="quant-table" aria-label={copy.ARIA_LABEL}>
          <TableHeader>
            <TableRow>
              <TableHead>{copy.COL_SYMBOL}</TableHead>
              <TableHead>{copy.COL_SECTOR}</TableHead>
              <TableHead>{copy.COL_PRICE}</TableHead>
              <TableHead>{copy.COL_PATTERN}</TableHead>
              <TableHead>{copy.COL_RSI}</TableHead>
              <TableHead>{copy.COL_EMA}</TableHead>
              <TableHead>{copy.COL_OI}</TableHead>
              <TableHead>{copy.COL_VOLUME}</TableHead>
              <TableHead>{copy.COL_CANDIDATE}</TableHead>
              <TableHead>{copy.COL_ACTION}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
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
                  <span
                    className={`oi-tag ${
                      item.oiAction === OiAction.LONG_BUILDUP ||
                      item.oiAction === OiAction.SHORT_COVERING
                        ? "oi-bullish"
                        : "oi-bearish"
                    }`}
                  >
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
                  <span
                    className={`candidate-badge ${
                      item.signalCandidate.includes("BUY")
                        ? "badge-buy"
                        : item.signalCandidate === SignalCandidate.SELL
                          ? "badge-sell"
                          : "badge-neutral"
                    }`}
                  >
                    {item.signalCandidate}
                  </span>
                </TableCell>
                <TableCell>
                  <Link
                    to={AppRoute.CHAT}
                    className="btn-table-action"
                    title={`${copy.ANALYZE_TITLE_PREFIX} ${item.symbol} ${copy.ANALYZE_TITLE_SUFFIX}`}
                  >
                    <Sparkles size={14} />
                    <span>{copy.ANALYZE_ACTION}</span>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="empty-table-cell">
                  {copy.EMPTY_STATE}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
