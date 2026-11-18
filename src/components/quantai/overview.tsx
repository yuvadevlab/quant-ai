import { Link } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Flame,
  Layers,
  LineChart,
  ScanLine,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { QuantLayout } from "./layout";
import { marketTicks, marketBreadth, sectorPerformance, signals } from "./data";

export function OverviewDesk() {
  const activeSignals = signals.filter((s) => s.status === "Active").slice(0, 3);

  return (
    <QuantLayout active="overview">
      <div className="overview-container">
        {/* Desk Header Banner */}
        <section className="overview-hero">
          <div className="hero-text-col">
            <div className="hero-badge">
              <Zap size={14} className="hero-zap" />
              <span>QUANTITATIVE MARKET INTELLIGENCE</span>
            </div>
            <h1 className="hero-title">Executive Market Desk</h1>
            <p className="hero-subtitle">
              Automated multi-agent market regime detection, high-conviction predictive signals, and
              real-time liquidity analytics for NSE and BSE.
            </p>
          </div>
          <div className="hero-actions-col">
            <Link to="/chat" className="btn-hero-copilot">
              <Sparkles size={16} />
              <span>Ask AI Copilot</span>
            </Link>
            <Link to="/predictions" className="btn-hero-predictions">
              <span>View All 142 Predictions</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>

        {/* Major Benchmark Indices Cards */}
        <section className="indices-grid" aria-label="Major Indian Indices">
          {marketTicks
            .filter((t) => !t.isVix)
            .map((index) => (
              <div className="index-card" key={index.name}>
                <div className="index-card-header">
                  <div>
                    <span className="index-exchange">{index.exchange}</span>
                    <h3 className="index-name">{index.name}</h3>
                  </div>
                  <span className={`index-change-badge ${index.positive ? "is-gain" : "is-loss"}`}>
                    {index.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {index.change}
                  </span>
                </div>

                <div className="index-price-row">
                  <div className="index-current-price">{index.price}</div>
                  <svg className="index-sparkline" viewBox="0 0 60 17" aria-hidden="true">
                    <polyline
                      points={index.path}
                      className={index.positive ? "spark-green" : "spark-red"}
                    />
                  </svg>
                </div>

                <div className="index-range-bar">
                  <div className="range-labels">
                    <span>L: {index.dayLow}</span>
                    <span>H: {index.dayHigh}</span>
                  </div>
                  <div className="range-track">
                    <div
                      className="range-progress"
                      style={{ width: index.positive ? "74%" : "42%" }}
                    />
                  </div>
                </div>
              </div>
            ))}
        </section>

        {/* 2-Column Market Breadth & Sector Matrix */}
        <section className="breadth-sector-section">
          {/* Market Breadth & Flow */}
          <div className="desk-panel breadth-panel">
            <div className="panel-heading">
              <div className="panel-title-wrap">
                <Layers size={18} className="panel-icon" />
                <h2 className="panel-title">Market Breadth & Institutional Flows</h2>
              </div>
              <span className="panel-status-pill">NSE 2,214 Stocks</span>
            </div>

            <div className="breadth-metric-row">
              <div className="breadth-stat">
                <span className="stat-label">ADVANCES</span>
                <span className="stat-val text-gain">{marketBreadth.advances}</span>
                <span className="stat-sub">{marketBreadth.advanceRatio} of market</span>
              </div>
              <div className="breadth-stat">
                <span className="stat-label">DECLINES</span>
                <span className="stat-val text-loss">{marketBreadth.declines}</span>
                <span className="stat-sub">30.5% of market</span>
              </div>
              <div className="breadth-stat">
                <span className="stat-label">FII NET FLOW</span>
                <span className="stat-val text-gain">{marketBreadth.fiiNet}</span>
                <span className="stat-sub">Strong Foreign Inflow</span>
              </div>
              <div className="breadth-stat">
                <span className="stat-label">DII NET FLOW</span>
                <span className="stat-val text-gain">{marketBreadth.diiNet}</span>
                <span className="stat-sub">Domestic Support</span>
              </div>
            </div>

            <div className="breadth-progress-wrapper">
              <div className="breadth-bar-container">
                <div
                  className="breadth-bar-advance"
                  style={{ width: marketBreadth.advanceRatio }}
                  title={`Advances: ${marketBreadth.advances}`}
                />
                <div
                  className="breadth-bar-decline"
                  style={{ width: "30.5%" }}
                  title={`Declines: ${marketBreadth.declines}`}
                />
              </div>
              <div className="breadth-bar-labels">
                <span className="text-gain">● 1,482 Advances (69.5%)</span>
                <span className="text-loss">● 648 Declines (30.5%)</span>
              </div>
            </div>
          </div>

          {/* Sector Rotation Heatmap */}
          <div className="desk-panel sector-panel">
            <div className="panel-heading">
              <div className="panel-title-wrap">
                <BarChart3 size={18} className="panel-icon" />
                <h2 className="panel-title">Sector Momentum Matrix</h2>
              </div>
              <Link to="/screener" className="panel-link">
                Screen Sectors <ChevronRight size={14} />
              </Link>
            </div>

            <div className="sector-list">
              {sectorPerformance.map((sec) => (
                <div className="sector-row" key={sec.name}>
                  <div className="sector-info">
                    <span className="sector-name">{sec.name}</span>
                    <span className={`sector-tag tag-${sec.momentum.toLowerCase()}`}>
                      {sec.momentum}
                    </span>
                  </div>
                  <div className="sector-values">
                    <div
                      className={`sector-bar ${sec.positive ? "bar-gain" : "bar-loss"}`}
                      style={{
                        width: `${Math.min(100, Math.abs(parseFloat(sec.change)) * 35)}%`,
                      }}
                    />
                    <span className={`sector-percent ${sec.positive ? "text-gain" : "text-loss"}`}>
                      {sec.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Active High-Conviction Signals Spotlight */}
        <section className="signals-spotlight-section">
          <div className="spotlight-header">
            <div>
              <div className="section-label">AUTOMATED MULTI-AGENT INFERENCE</div>
              <h2 className="section-title">Active High-Conviction Signals</h2>
            </div>
            <Link to="/predictions" className="view-all-signals-link">
              <span>View Full Prediction Ledger</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="signals-spotlight-grid">
            {activeSignals.map((signal) => (
              <div className="signal-spotlight-card" key={signal.id}>
                <div className="card-top-row">
                  <div className="signal-identity">
                    <span className="signal-id-tag">{signal.id}</span>
                    <h3 className="signal-symbol">{signal.symbol}</h3>
                    <span className="signal-company">{signal.companyName}</span>
                  </div>
                  <div className="signal-badge-col">
                    <span
                      className={`direction-badge ${signal.direction === "BUY" ? "badge-buy" : "badge-sell"}`}
                    >
                      {signal.direction}
                    </span>
                    <span className="horizon-badge">{signal.horizon}</span>
                  </div>
                </div>

                <div className="price-matrix-grid">
                  <div className="matrix-cell">
                    <span className="cell-label">ENTRY ZONE</span>
                    <span className="cell-val mono">{signal.entry}</span>
                  </div>
                  <div className="matrix-cell">
                    <span className="cell-label">CURRENT LTP</span>
                    <span className="cell-val mono highlight">{signal.last}</span>
                  </div>
                  <div className="matrix-cell">
                    <span className="cell-label">TARGET 1</span>
                    <span className="cell-val mono text-gain">{signal.target1}</span>
                  </div>
                  <div className="matrix-cell">
                    <span className="cell-label">STOP LOSS</span>
                    <span className="cell-val mono text-loss">{signal.stop}</span>
                  </div>
                </div>

                <div className="catalysts-pills">
                  {signal.catalysts.map((cat) => (
                    <span className="catalyst-pill" key={cat}>
                      {cat}
                    </span>
                  ))}
                </div>

                <div className="card-footer-row">
                  <div className="confidence-block">
                    <span className="conf-label">AGENT CONVICTION</span>
                    <div className="conf-bar-wrapper">
                      <div className="conf-bar-fill" style={{ width: signal.confidence }} />
                      <span className="conf-val">{signal.confidence}</span>
                    </div>
                  </div>

                  <Link
                    to="/predictions/$id"
                    params={{ id: signal.id }}
                    className="btn-inspect-trajectory"
                  >
                    <span>Inspect Trajectory</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Launchpad & Workstation Hub */}
        <section className="launchpad-section">
          <h2 className="launchpad-title">Workstation Modules</h2>
          <div className="launchpad-grid">
            <Link to="/predictions" className="launchpad-card">
              <div className="launchpad-icon-box box-predictions">
                <TrendingUp size={22} />
              </div>
              <div className="launchpad-info">
                <h3>Prediction Lab & Audit Ledger</h3>
                <p>
                  Comprehensive log of all automated AI trading recommendations, win-rate tracking,
                  and MFE/MAE excursion measurements.
                </p>
              </div>
              <span className="launchpad-link-action">
                Open Ledger <ArrowRight size={14} />
              </span>
            </Link>

            <Link to="/screener" className="launchpad-card">
              <div className="launchpad-icon-box box-screener">
                <ScanLine size={22} />
              </div>
              <div className="launchpad-info">
                <h3>Quantitative Market Screener</h3>
                <p>
                  Scan 2,000+ Indian equities and F&O contracts for technical breakouts, 20/50 EMA
                  crosses, and aggressive options OI build-up.
                </p>
              </div>
              <span className="launchpad-link-action">
                Run Screener <ArrowRight size={14} />
              </span>
            </Link>

            <Link to="/portfolio" className="launchpad-card">
              <div className="launchpad-icon-box box-portfolio">
                <ShieldCheck size={22} />
              </div>
              <div className="launchpad-info">
                <h3>Paper Trading & Risk Management</h3>
                <p>
                  Simulate algorithmic execution with virtual ₹10,00,000 capital, automated trailing
                  stops, and portfolio drawdown protection.
                </p>
              </div>
              <span className="launchpad-link-action">
                View Portfolio <ArrowRight size={14} />
              </span>
            </Link>

            <Link to="/chat" className="launchpad-card">
              <div className="launchpad-icon-box box-copilot">
                <Sparkles size={22} />
              </div>
              <div className="launchpad-info">
                <h3>AI Financial Copilot</h3>
                <p>
                  Interactive multi-agent financial dialogue. Query technical setups, options chain
                  structures, and market regime hypotheses.
                </p>
              </div>
              <span className="launchpad-link-action">
                Start Chat <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        </section>
      </div>
    </QuantLayout>
  );
}
