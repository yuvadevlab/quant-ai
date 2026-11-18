import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Layers3,
  Radio,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { signals } from "./data";
import { QuantLayout } from "./layout";

type HoverPoint = { x: number; y: number; time: string; price: string; deviation: string };

const chartSamples = [
  { x: 4.7, y: 74.9, time: "09:48:00", price: "₹2,422.50", deviation: "0.00%" },
  { x: 16.8, y: 68.5, time: "09:55:12", price: "₹2,428.10", deviation: "+0.08%" },
  { x: 29.0, y: 73.2, time: "10:02:24", price: "₹2,424.70", deviation: "−0.05%" },
  { x: 41.1, y: 57.4, time: "10:09:36", price: "₹2,438.20", deviation: "+0.14%" },
  { x: 53.2, y: 46.6, time: "10:15:00", price: "₹2,449.60", deviation: "+0.28%" },
  { x: 65.3, y: 61.3, time: "10:22:48", price: "₹2,435.10", deviation: "−0.03%" },
  { x: 77.4, y: 57.4, time: "10:30:00", price: "₹2,434.60", deviation: "+0.06%" },
];

export function MonitorWorkspace({ signalId }: { signalId: string }) {
  const fallbackSignal = signals[0]!;
  const signal = signals.find((entry) => entry.id === signalId) ?? fallbackSignal;
  const isActive = signal.status === "Active";
  const [chartHover, setChartHover] = useState<HoverPoint | null>(null);
  const [timeframe, setTimeframe] = useState("1m");

  function showPoint(event: React.MouseEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const initialPoint = chartSamples[0]!;
    const nearest = chartSamples.reduce(
      (best, point) => (Math.abs(point.x - x) < Math.abs(best.x - x) ? point : best),
      initialPoint,
    );
    setChartHover({
      x: Math.max(10, Math.min(89, nearest.x)),
      y: (nearest.y / 100) * 76 + 3,
      time: nearest.time,
      price: nearest.price,
      deviation: nearest.deviation,
    });
  }

  return (
    <QuantLayout active="predictions">
      <div className="desk-container">
        {/* Navigation & Header */}
        <div className="desk-header">
          <div>
            <div className="desk-breadcrumb">
              <Link to="/predictions" className="breadcrumb-back-link">
                <ArrowLeft size={14} />
                <span>Prediction Ledger</span>
              </Link>
              <ChevronRight size={14} />
              <span className="current">{signal.id}</span>
            </div>
            <div className="title-with-badge">
              <h1 className="desk-title">
                {signal.symbol} · <span className="title-instrument">{signal.instrument}</span>
              </h1>
              <span
                className={`direction-badge ${signal.direction === "BUY" ? "badge-buy" : "badge-sell"}`}
              >
                {signal.direction === "BUY" ? "BUY · BULLISH" : "SELL · BEARISH"}
              </span>
              <span className="horizon-tag">{signal.horizon} Horizon</span>
            </div>
            <p className="desk-subtitle">
              {signal.companyName} — Automated multi-agent trajectory tracking, cone projections,
              and real-time excursion monitoring.
            </p>
          </div>
          <div className="desk-actions">
            <span
              className={`outcome-pill ${
                isActive
                  ? "pill-active"
                  : signal.status === "Target hit"
                    ? "pill-target"
                    : "pill-stop"
              }`}
            >
              {isActive && <span className="pulse-ping" />}
              {signal.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Quote & Levels Grid */}
        <div className="monitor-kpi-grid">
          <div className="kpi-metric-card">
            <span className="kpi-title">ENTRY ZONE</span>
            <div className="kpi-big-number mono">{signal.entry}</div>
            <div className="kpi-footer text-muted">Filled: {signal.entryPrice}</div>
          </div>

          <div className="kpi-metric-card">
            <span className="kpi-title">CURRENT LTP</span>
            <div className="kpi-big-number mono highlight">{signal.last}</div>
            <div className={`kpi-footer ${signal.direction === "BUY" ? "text-gain" : "text-loss"}`}>
              <ArrowUpRight size={14} />
              <span>{signal.change}</span>
            </div>
          </div>

          <div className="kpi-metric-card">
            <span className="kpi-title">TARGET 1 LEVEL</span>
            <div className="kpi-big-number mono text-gain">{signal.target1}</div>
            <div className="kpi-footer text-gain">+1.34% target upside</div>
          </div>

          <div className="kpi-metric-card">
            <span className="kpi-title">TARGET 2 LEVEL</span>
            <div className="kpi-big-number mono text-gain">{signal.target2}</div>
            <div className="kpi-footer text-muted">+2.38% extended target</div>
          </div>

          <div className="kpi-metric-card">
            <span className="kpi-title">STOP LOSS</span>
            <div className="kpi-big-number mono text-loss">{signal.stop}</div>
            <div className="kpi-footer text-loss">−0.84% max risk</div>
          </div>

          <div className="kpi-metric-card">
            <span className="kpi-title">AGENT CONVICTION</span>
            <div className="kpi-big-number mono text-brand">{signal.confidence}</div>
            <div className="kpi-footer text-muted">Risk/Reward {signal.riskReward}</div>
          </div>
        </div>

        {/* Trajectory Interactive Chart Panel */}
        <section className="desk-panel trajectory-panel">
          <div className="panel-heading">
            <div className="panel-title-wrap">
              <Activity size={18} className="panel-icon" />
              <div>
                <h2 className="panel-title">Real-time Predictive Trajectory Cone</h2>
                <p className="panel-subtext">
                  Actual price path vs. predicted confidence bounds and expected path to Target 1.
                </p>
              </div>
            </div>
            <div className="chart-tools">
              <div className="tab-pill-group">
                {["1m", "5m", "15m"].map((period) => (
                  <button
                    key={period}
                    type="button"
                    className={`tab-pill ${timeframe === period ? "active" : ""}`}
                    onClick={() => setTimeframe(period)}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="chart-legend-row">
            <span className="legend-item">
              <span className="legend-dot dot-actual" /> Actual Price
            </span>
            <span className="legend-item">
              <span className="legend-dot dot-expected" /> Expected Path
            </span>
            <span className="legend-item">
              <span className="legend-box box-cone" /> Predictive Cone
            </span>
            <span className="legend-item">
              <span className="legend-line line-target" /> Target 1 ({signal.target1})
            </span>
            <span className="legend-item">
              <span className="legend-line line-stop" /> Stop Loss ({signal.stop})
            </span>
          </div>

          <div
            className="trajectory-chart-viewport"
            onMouseMove={showPoint}
            onMouseLeave={() => setChartHover(null)}
            role="img"
            aria-label={`Trajectory chart for ${signal.symbol}`}
          >
            <div className="chart-price-axis">
              <span>₹2,480</span>
              <span>₹2,460</span>
              <span>₹2,440</span>
              <span>₹2,420</span>
              <span>₹2,400</span>
            </div>

            <svg
              className="trajectory-svg"
              viewBox="0 0 1000 320"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="cone-gradient" x1="0" x2="1" y1="1" y2="0">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.04" />
                  <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.16" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.08" />
                </linearGradient>
                <filter id="beacon-glow" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Gridlines */}
              {[28, 81, 134, 187, 240, 293].map((y) => (
                <line key={`grid-${y}`} className="chart-gridline" x1="0" y1={y} x2="1000" y2={y} />
              ))}
              {[85, 205, 325, 445, 565, 685, 805, 925].map((x) => (
                <line
                  key={`vgrid-${x}`}
                  className="chart-gridline"
                  x1={x}
                  y1="18"
                  x2={x}
                  y2="294"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Target & Stop Horizontal Lines */}
              <line className="chart-level-target2" x1="3" y1="49" x2="965" y2="49" />
              <line className="chart-level-target1" x1="3" y1="107" x2="965" y2="107" />
              <line className="chart-level-entry" x1="3" y1="183" x2="965" y2="183" />
              <line className="chart-level-stop" x1="3" y1="238" x2="965" y2="238" />

              {/* Projected Cone */}
              <path
                d="M774 153 C829 146 873 130 958 102 L958 179 C886 170 830 162 774 168 Z"
                fill="url(#cone-gradient)"
              />
              <path
                d="M774 158 C842 147 892 127 958 139"
                className="chart-path-expected"
                strokeDasharray="5 5"
              />

              {/* Actual Price Trajectory */}
              <path
                d="M47 219 L168 194 L289 211 L410 168 L531 131 L652 178 L773 160"
                className="chart-path-actual"
              />

              {/* Sample Points */}
              {chartSamples.map((point) => (
                <circle
                  key={point.time}
                  className="chart-point-dot"
                  cx={point.x * 10}
                  cy={(point.y / 100) * 250 + 27}
                  r="4"
                />
              ))}

              {/* Beacon at live price */}
              {isActive && (
                <g className="live-price-beacon" filter="url(#beacon-glow)">
                  <circle className="beacon-halo" cx="773" cy="160" r="14" />
                  <circle className="beacon-core" cx="773" cy="160" r="5" />
                </g>
              )}
            </svg>

            {/* Level Chips */}
            <div className="chart-floating-level level-t2">T2: {signal.target2}</div>
            <div className="chart-floating-level level-t1">T1: {signal.target1}</div>
            <div className="chart-floating-level level-entry">ENTRY: {signal.entryPrice}</div>
            <div className="chart-floating-level level-sl">SL: {signal.stop}</div>

            {/* Hover Tooltip */}
            {chartHover && (
              <div
                className="chart-hover-box"
                style={{
                  left: `${chartHover.x}%`,
                  top: `${Math.min(72, chartHover.y)}%`,
                }}
              >
                <span className="tooltip-time">{chartHover.time} IST</span>
                <strong className="tooltip-price">{chartHover.price}</strong>
                <small className="tooltip-dev">Path Deviation: {chartHover.deviation}</small>
              </div>
            )}
          </div>

          {/* Telemetry Row */}
          <div className="telemetry-bar">
            <div className="telemetry-stat">
              <span className="stat-label">MAX FAVORABLE EXCURSION (MFE)</span>
              <span className="stat-val text-gain">{signal.mfe}</span>
              <span className="stat-sub">Peak ₹2,449.60</span>
            </div>
            <div className="telemetry-stat">
              <span className="stat-label">MAX ADVERSE EXCURSION (MAE)</span>
              <span className="stat-val text-loss">{signal.mae}</span>
              <span className="stat-sub">Trough ₹2,417.10</span>
            </div>
            <div className="telemetry-stat">
              <span className="stat-label">TRAJECTORY ALIGNMENT</span>
              <span className="stat-val text-gain">94.2%</span>
              <span className="stat-sub">Within Upper Cone</span>
            </div>
            <div className="telemetry-stat">
              <span className="stat-label">PROGRESS TO TARGET 1</span>
              <div className="progress-bar-wrap">
                <div className="progress-fill" style={{ width: "68%" }} />
              </div>
              <span className="stat-sub">68% completed</span>
            </div>
          </div>
        </section>

        {/* Multi-Agent Deliberation Panel */}
        <section className="desk-panel deliberation-panel">
          <div className="panel-heading">
            <div className="panel-title-wrap">
              <Bot size={18} className="panel-icon" />
              <div>
                <h2 className="panel-title">Multi-Agent Deliberation Breakdown</h2>
                <p className="panel-subtext">
                  Independent agent consensus. Each specialized model evaluates market dynamics
                  separately.
                </p>
              </div>
            </div>
            <span className="panel-status-pill">4 Specialized Agents</span>
          </div>

          <div className="agents-grid">
            <div className="agent-card">
              <div className="agent-card-header">
                <span className="agent-badge">TECHNICAL ANALYST</span>
                <span className="agent-score text-gain">{signal.agents.technical.score}%</span>
              </div>
              <p className="agent-verdict">{signal.agents.technical.verdict}</p>
            </div>

            <div className="agent-card">
              <div className="agent-card-header">
                <span className="agent-badge">QUANT MOMENTUM</span>
                <span className="agent-score text-gain">{signal.agents.quant.score}%</span>
              </div>
              <p className="agent-verdict">{signal.agents.quant.verdict}</p>
            </div>

            <div className="agent-card">
              <div className="agent-card-header">
                <span className="agent-badge">OPTIONS FLOW</span>
                <span className="agent-score text-gain">{signal.agents.optionsFlow.score}%</span>
              </div>
              <p className="agent-verdict">{signal.agents.optionsFlow.verdict}</p>
            </div>

            <div className="agent-card">
              <div className="agent-card-header">
                <span className="agent-badge">RISK GUARDIAN</span>
                <span className="agent-score text-brand">{signal.agents.riskGuardian.score}%</span>
              </div>
              <p className="agent-verdict">{signal.agents.riskGuardian.verdict}</p>
            </div>
          </div>
        </section>

        {/* Invalidation Rules & Catalysts */}
        <div className="invalidation-card">
          <div className="invalidation-icon-box">
            <AlertTriangle size={20} />
          </div>
          <div className="invalidation-text">
            <h3>Automated Invalidation Rule</h3>
            <p>
              If a 15-minute candle closes below <strong>{signal.stop}</strong> or if Call Open
              Interest surges by &gt; 35% on the immediate strike, the trade hypothesis is
              invalidated immediately.
            </p>
          </div>
          <Link to="/chat" className="btn-secondary">
            <Sparkles size={14} />
            <span>Ask Copilot about {signal.symbol}</span>
          </Link>
        </div>
      </div>
    </QuantLayout>
  );
}
