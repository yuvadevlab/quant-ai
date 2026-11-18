/**
 * @file src/features/screener/components/ScreenerTable.tsx
 * @description Screener results table with RSI meters, EMA status, options OI tags, and action buttons.
 */

import { Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, Sparkles } from "lucide-react";
import type { ScreenerItem } from "@/components/quantai/data";
import { AppRoute } from "@/constants/routes.constants";

export interface ScreenerTableProps {
  readonly items: readonly ScreenerItem[];
}

export function ScreenerTable({ items }: ScreenerTableProps) {
  return (
    <div className="desk-table-card">
      <div className="table-responsive">
        <table className="quant-table" aria-label="Screener Results">
          <thead>
            <tr>
              <th>SYMBOL & NAME</th>
              <th>SECTOR</th>
              <th>LTP & CHANGE</th>
              <th>PATTERN DETECTED</th>
              <th>RSI (14)</th>
              <th>EMA STRUCTURE</th>
              <th>OPTIONS OI ACTION</th>
              <th>VOLUME SURGE</th>
              <th>AI CANDIDATE</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.symbol}>
                <td>
                  <div className="symbol-cell">
                    <strong className="symbol-name">{item.symbol}</strong>
                    <span className="company-sub">{item.name}</span>
                  </div>
                </td>
                <td>
                  <span className="sector-badge">{item.sector}</span>
                </td>
                <td>
                  <div className="price-cell">
                    <span className="price-mono">{item.price}</span>
                    <span className={`change-pill ${item.positive ? "pill-gain" : "pill-loss"}`}>
                      {item.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {item.change}
                    </span>
                  </div>
                </td>
                <td>
                  <span className="pattern-tag">{item.pattern}</span>
                </td>
                <td>
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
                </td>
                <td>
                  <span className="ema-tag">{item.emaStatus}</span>
                </td>
                <td>
                  <span
                    className={`oi-tag ${
                      item.oiAction === "Long Buildup" || item.oiAction === "Short Covering"
                        ? "oi-bullish"
                        : "oi-bearish"
                    }`}
                  >
                    {item.oiAction}
                  </span>
                </td>
                <td>
                  <span
                    className={`volume-stat ${item.volumeSurge.startsWith("+") ? "text-gain" : "text-loss"}`}
                  >
                    {item.volumeSurge}
                  </span>
                </td>
                <td>
                  <span
                    className={`candidate-badge ${
                      item.signalCandidate.includes("BUY")
                        ? "badge-buy"
                        : item.signalCandidate === "SELL"
                          ? "badge-sell"
                          : "badge-neutral"
                    }`}
                  >
                    {item.signalCandidate}
                  </span>
                </td>
                <td>
                  <Link
                    to={AppRoute.CHAT}
                    className="btn-table-action"
                    title={`Analyze ${item.symbol} with AI Copilot`}
                  >
                    <Sparkles size={14} />
                    <span>Analyze</span>
                  </Link>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={10} className="empty-table-cell">
                  No screener candidates matched the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
