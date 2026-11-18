/**
 * @file apps/web/src/components/quantai/overview.tsx
 * @description Executive market desk featuring live benchmarks, breadth, sector rotation, and signal spotlights.
 */

import { Link } from "@tanstack/react-router";
import { IndexMetricCard, MarketBreadthCard } from "@quant-ai/ui";
import { ArrowRight, BarChart3, ChevronRight, Sparkles, Zap } from "lucide-react";
import { marketTicks, marketBreadth, sectorPerformance, signals } from "./data";
import { QuantLayout } from "./layout";
import { WorkstationLaunchpad } from "./overview-launchpad";

/**
 * Executive market overview desk.
 *
 * @returns Rendered JSX OverviewDesk element.
 */
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
              <IndexMetricCard
                key={index.name}
                name={index.name}
                subtitle={index.exchange}
                price={index.price}
                change={index.change}
                isPositive={index.positive}
                sparklinePoints={index.path}
              />
            ))}
        </section>

        {/* 2-Column Market Breadth & Sector Matrix */}
        <section className="breadth-sector-section">
          {/* Market Breadth & Flow */}
          <MarketBreadthCard
            advances={marketBreadth.advances}
            declines={marketBreadth.declines}
            advanceRatio={marketBreadth.advanceRatio}
            fiiNet={marketBreadth.fiiNet}
            diiNet={marketBreadth.diiNet}
          />

          {/* Sector Momentum Matrix */}
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
        <WorkstationLaunchpad />
      </div>
    </QuantLayout>
  );
}
