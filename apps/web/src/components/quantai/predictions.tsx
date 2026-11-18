/**
 * @file apps/web/src/components/quantai/predictions.tsx
 * @description Prediction Lab & Signal Audit Ledger workstation desk.
 */

import { MetricCard } from "@quant-ai/ui";
import {
  Activity,
  BarChart3,
  ChevronRight,
  Download,
  Search,
  Target,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { signals } from "./data";
import { QuantLayout } from "./layout";
import { PredictionsTable } from "./predictions-table";
import { LedgerFilterTab } from "../../constants";

/**
 * Audit ledger and prediction laboratory workstation desk.
 *
 * @returns Rendered JSX PredictionsWorkspace element.
 */
export function PredictionsWorkspace() {
  const [activeFilter, setActiveFilter] = useState<LedgerFilterTab>(LedgerFilterTab.ALL);
  const [horizonFilter, setHorizonFilter] = useState("All styles");
  const [search, setSearch] = useState("");

  const filteredSignals = useMemo(() => {
    return signals.filter((signal) => {
      const matchesTab =
        activeFilter === LedgerFilterTab.ALL ||
        (activeFilter === LedgerFilterTab.ACTIVE && signal.status === "Active") ||
        (activeFilter === LedgerFilterTab.TARGET_HIT && signal.status === "Target hit") ||
        (activeFilter === LedgerFilterTab.STOP_HIT && signal.status === "Stop loss hit");

      const matchesHorizon =
        horizonFilter === "All styles" ||
        signal.horizon.toLowerCase() === horizonFilter.toLowerCase();

      const matchesSearch =
        !search.trim() ||
        `${signal.symbol} ${signal.instrument} ${signal.id} ${signal.companyName}`
          .toLowerCase()
          .includes(search.trim().toLowerCase());

      return matchesTab && matchesHorizon && matchesSearch;
    });
  }, [activeFilter, horizonFilter, search]);

  const tabs: { key: LedgerFilterTab; label: string; count: number }[] = [
    { key: LedgerFilterTab.ALL, label: "All calls", count: 142 },
    { key: LedgerFilterTab.ACTIVE, label: "Active", count: 4 },
    { key: LedgerFilterTab.TARGET_HIT, label: "Target hit", count: 106 },
    { key: LedgerFilterTab.STOP_HIT, label: "Stop loss hit", count: 32 },
  ];

  return (
    <QuantLayout active="predictions">
      <div className="desk-container">
        {/* Page Header */}
        <div className="desk-header">
          <div>
            <div className="desk-breadcrumb">
              <span>INTELLIGENCE</span>
              <ChevronRight size={14} />
              <span className="current">PREDICTION LAB & AUDIT LEDGER</span>
            </div>
            <h1 className="desk-title">Prediction Lab & Signal Audit Ledger</h1>
            <p className="desk-subtitle">
              Comprehensive immutable ledger of all automated AI trading recommendations.
              Transparently track signal trajectory, win-rates, target milestones, and maximum
              favorable excursions.
            </p>
          </div>
          <div className="desk-actions">
            <span className="paper-trading-tag">
              <span className="pulse-ping" />
              <span>4 IN-FLIGHT SIGNALS</span>
            </span>
            <button type="button" className="btn-secondary" onClick={() => window.print()}>
              <Download size={15} />
              <span>Export Audit</span>
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <section className="metric-grid" aria-label="Prediction Performance KPIs">
          <MetricCard
            label="TOTAL GENERATED"
            value="142"
            icon={<Activity size={16} />}
            badge="ALL TIME"
            hint={
              <>
                <span className="text-gain">4 active</span>
                <span className="metric-divider">·</span>
                <span>138 settled</span>
              </>
            }
          />

          <MetricCard
            label="CALIBRATED WIN RATE"
            value={<span className="text-gain">78.4%</span>}
            icon={<Target size={16} />}
            badge="+3.2% THIS MONTH"
            badgeClass="badge-green"
            hint={
              <>
                <span className="text-gain">106 targets hit</span>
                <span className="metric-divider">·</span>
                <span className="text-loss">32 stops</span>
              </>
            }
          />

          <MetricCard
            label="PROFIT FACTOR"
            value="2.41"
            icon={<BarChart3 size={16} />}
            badge="RISK ADJUSTED"
            hint={
              <>
                <span className="text-gain">+3.6% avg gain</span>
                <span className="metric-divider">·</span>
                <span className="text-loss">−1.2% avg loss</span>
              </>
            }
          />

          <MetricCard
            label="AVG RISK-REWARD"
            value={<span className="text-gain">1 : 2.65</span>}
            icon={<TrendingUp size={16} />}
            badge="POSITIVE EXPECTANCY"
            badgeClass="badge-green"
            hint={<span>Avg holding: 42m (Intraday) / 4d (Swing)</span>}
          />
        </section>

        {/* Filter Controls Bar */}
        <div className="screener-controls-card">
          <div className="screener-tabs-row">
            <div className="tab-pill-group">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`tab-pill ${activeFilter === tab.key ? "active" : ""}`}
                  onClick={() => setActiveFilter(tab.key)}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            <div className="search-filter-wrapper">
              <div className="search-box">
                <Search size={15} className="search-icon" />
                <input
                  type="text"
                  placeholder="Filter by symbol, instrument, or ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                />
              </div>

              <select
                className="sector-select"
                value={horizonFilter}
                onChange={(e) => setHorizonFilter(e.target.value)}
              >
                <option value="All styles">All Styles</option>
                <option value="Intraday">Intraday</option>
                <option value="Swing">Swing</option>
                <option value="Options">Options</option>
              </select>
            </div>
          </div>
        </div>

        {/* Prediction Table */}
        <PredictionsTable signals={filteredSignals} />
      </div>
    </QuantLayout>
  );
}
