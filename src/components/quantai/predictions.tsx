import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Download,
  Filter,
  Radio,
  Search,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { signals, type SignalHorizon, type SignalStatus } from "./data";
import { QuantLayout } from "./layout";
import { LedgerFilterTab } from "../../constants";
import { PREDICTIONS_COPY, COMMON_COPY } from "../../lib/ui-copy";

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
          <div className="metric-card">
            <div className="metric-top">
              <div className="metric-top-left">
                <span className="metric-icon">
                  <Activity size={16} />
                </span>
                <span className="metric-label">TOTAL GENERATED</span>
              </div>
              <span className="metric-badge">ALL TIME</span>
            </div>
            <div className="metric-value mono">142</div>
            <div className="metric-hint">
              <span className="text-gain">4 active</span>
              <span className="metric-divider">·</span>
              <span>138 settled</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-top">
              <div className="metric-top-left">
                <span className="metric-icon">
                  <Target size={16} />
                </span>
                <span className="metric-label">CALIBRATED WIN RATE</span>
              </div>
              <span className="metric-badge badge-green">+3.2% THIS MONTH</span>
            </div>
            <div className="metric-value mono text-gain">78.4%</div>
            <div className="metric-hint">
              <span className="text-gain">106 targets hit</span>
              <span className="metric-divider">·</span>
              <span className="text-loss">32 stops</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-top">
              <div className="metric-top-left">
                <span className="metric-icon">
                  <BarChart3 size={16} />
                </span>
                <span className="metric-label">PROFIT FACTOR</span>
              </div>
              <span className="metric-badge">RISK ADJUSTED</span>
            </div>
            <div className="metric-value mono">2.41</div>
            <div className="metric-hint">
              <span className="text-gain">+3.6% avg gain</span>
              <span className="metric-divider">·</span>
              <span className="text-loss">−1.2% avg loss</span>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-top">
              <div className="metric-top-left">
                <span className="metric-icon">
                  <TrendingUp size={16} />
                </span>
                <span className="metric-label">AVG RISK-REWARD</span>
              </div>
              <span className="metric-badge badge-green">POSITIVE EXPECTANCY</span>
            </div>
            <div className="metric-value mono text-gain">1 : 2.65</div>
            <div className="metric-hint">
              <span>Avg holding: 42m (Intraday) / 4d (Swing)</span>
            </div>
          </div>
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
        <div className="desk-table-card">
          <div className="table-responsive">
            <table className="quant-table" aria-label="Signal Audit Table">
              <thead>
                <tr>
                  <th>SIGNAL & TIMESTAMP</th>
                  <th>INSTRUMENT</th>
                  <th>STANCE</th>
                  <th>ENTRY RANGE</th>
                  <th>TARGET LEVELS</th>
                  <th>STOP LOSS</th>
                  <th>CURRENT LTP</th>
                  <th>STATUS</th>
                  <th>MFE / MAE</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredSignals.map((signal) => {
                  const isBuy = signal.direction === "BUY";
                  const statusClass =
                    signal.status === "Active"
                      ? "pill-active"
                      : signal.status === "Target hit"
                        ? "pill-target"
                        : signal.status === "Stop loss hit"
                          ? "pill-stop"
                          : "pill-expired";

                  return (
                    <tr key={signal.id}>
                      <td>
                        <div className="symbol-cell">
                          <span className="mono text-muted">{signal.id}</span>
                          <span className="time-sub">{signal.time}</span>
                        </div>
                      </td>
                      <td>
                        <div className="symbol-cell">
                          <strong className="symbol-name">{signal.symbol}</strong>
                          <span className="company-sub">{signal.instrument}</span>
                        </div>
                      </td>
                      <td>
                        <div className="stance-cell">
                          <span className={`direction-badge ${isBuy ? "badge-buy" : "badge-sell"}`}>
                            {isBuy ? "BUY · LONG" : "SELL · SHORT"}
                          </span>
                          <span className="horizon-tag">{signal.horizon}</span>
                        </div>
                      </td>
                      <td>
                        <span className="mono">{signal.entry}</span>
                      </td>
                      <td>
                        <div className="target-cell mono">
                          <span className="text-gain">T1 {signal.target1}</span>
                          <span className="text-muted">T2 {signal.target2}</span>
                        </div>
                      </td>
                      <td>
                        <span className="mono text-loss">{signal.stop}</span>
                      </td>
                      <td>
                        <div className="price-cell">
                          <strong className="mono highlight">{signal.last}</strong>
                          <span className={`change-pill ${isBuy ? "pill-gain" : "pill-loss"}`}>
                            {signal.change}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`outcome-pill ${statusClass}`}>
                          {signal.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div className="excursion-cell mono">
                          <span className="text-gain">{signal.mfe}</span>
                          <span className="text-loss">{signal.mae}</span>
                        </div>
                      </td>
                      <td>
                        <Link
                          to="/predictions/$id"
                          params={{ id: signal.id }}
                          className="btn-table-action"
                          title={`Inspect trajectory for ${signal.symbol}`}
                        >
                          <span>Inspect</span>
                          <ArrowRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
                {filteredSignals.length === 0 && (
                  <tr>
                    <td colSpan={10} className="empty-table-cell">
                      No prediction calls match the chosen filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </QuantLayout>
  );
}
