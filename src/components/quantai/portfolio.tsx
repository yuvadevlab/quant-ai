import { Link } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowUpRight,
  Briefcase,
  ChevronRight,
  DollarSign,
  Lock,
  PieChart,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import { QuantLayout } from "./layout";
import { paperPortfolio } from "./data";

export function PortfolioDesk() {
  const {
    totalEquity,
    initialCapital,
    realizedPnl,
    unrealizedPnl,
    availableMargin,
    marginUsed,
    winRate,
    positions,
    recentExecutions,
  } = paperPortfolio;

  const totalGain = realizedPnl + unrealizedPnl;
  const totalReturnPercent = ((totalGain / initialCapital) * 100).toFixed(2);

  return (
    <QuantLayout active="portfolio">
      <div className="desk-container">
        {/* Header */}
        <div className="desk-header">
          <div>
            <div className="desk-breadcrumb">
              <span>TRADING DESK</span>
              <ChevronRight size={14} />
              <span className="current">PAPER PORTFOLIO & RISK</span>
            </div>
            <h1 className="desk-title">Paper Portfolio & Execution Desk</h1>
            <p className="desk-subtitle">
              Simulated algorithmic execution, virtual capital performance tracking, and automated
              risk safeguards. Test strategies with zero financial liability.
            </p>
          </div>
          <div className="desk-actions">
            <span className="paper-trading-tag">
              <ShieldCheck size={16} />
              <span>SIMULATION ACTIVE · ₹10L CAPITAL</span>
            </span>
          </div>
        </div>

        {/* Portfolio KPI Summary Grid */}
        <div className="portfolio-kpi-grid">
          <div className="kpi-metric-card">
            <div className="kpi-icon-row">
              <Wallet size={18} className="kpi-icon icon-blue" />
              <span className="kpi-title">TOTAL EQUITY</span>
            </div>
            <div className="kpi-big-number">₹{totalEquity.toLocaleString("en-IN")}</div>
            <div className="kpi-footer text-gain">
              <ArrowUpRight size={14} />
              <span>+{totalReturnPercent}% total return</span>
            </div>
          </div>

          <div className="kpi-metric-card">
            <div className="kpi-icon-row">
              <TrendingUp size={18} className="kpi-icon icon-green" />
              <span className="kpi-title">UNREALIZED P&L</span>
            </div>
            <div className="kpi-big-number text-gain">
              +₹{unrealizedPnl.toLocaleString("en-IN")}
            </div>
            <div className="kpi-footer text-muted">Across 3 open positions</div>
          </div>

          <div className="kpi-metric-card">
            <div className="kpi-icon-row">
              <ShieldCheck size={18} className="kpi-icon icon-emerald" />
              <span className="kpi-title">REALIZED P&L</span>
            </div>
            <div className="kpi-big-number text-gain">+₹{realizedPnl.toLocaleString("en-IN")}</div>
            <div className="kpi-footer text-gain">Win Rate {winRate}</div>
          </div>

          <div className="kpi-metric-card">
            <div className="kpi-icon-row">
              <PieChart size={18} className="kpi-icon icon-amber" />
              <span className="kpi-title">AVAILABLE MARGIN</span>
            </div>
            <div className="kpi-big-number">₹{availableMargin.toLocaleString("en-IN")}</div>
            <div className="kpi-footer text-muted">
              Margin Used: ₹{marginUsed.toLocaleString("en-IN")} (34.7%)
            </div>
          </div>
        </div>

        {/* Open Positions Table */}
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

        {/* Execution Audit Log */}
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
                {recentExecutions.map((ord) => (
                  <tr key={ord.id}>
                    <td className="mono text-muted">{ord.id}</td>
                    <td>
                      <strong>{ord.symbol}</strong>
                    </td>
                    <td>
                      <span
                        className={`side-badge ${ord.type === "BUY" ? "badge-buy" : "badge-sell"}`}
                      >
                        {ord.type}
                      </span>
                    </td>
                    <td className="mono">{ord.qty}</td>
                    <td className="mono">{ord.price}</td>
                    <td className="mono">{ord.exitPrice}</td>
                    <td>
                      <strong
                        className={`mono ${ord.pnl.startsWith("+") ? "text-gain" : "text-loss"}`}
                      >
                        {ord.pnl}
                      </strong>
                    </td>
                    <td>
                      <span
                        className={`outcome-pill ${ord.result.includes("Hit") && !ord.result.includes("Stop") ? "pill-target" : "pill-stop"}`}
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
      </div>
    </QuantLayout>
  );
}
