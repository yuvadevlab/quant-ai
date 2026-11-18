import { Link } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronRight,
  Filter,
  Flame,
  Layers,
  ScanLine,
  Search,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { QuantLayout } from "./layout";
import { screenerItems, type ScreenerItem } from "./data";

export function ScreenerDesk() {
  const [activeTab, setActiveTab] = useState<"all" | "breakouts" | "options" | "momentum">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("ALL");

  const sectors = [
    "ALL",
    "Energy",
    "Banking",
    "PSU Banking",
    "Metals",
    "IT",
    "Auto",
    "Telecom",
    "Infrastructure",
  ];

  const filteredItems = screenerItems.filter((item) => {
    const matchesSearch =
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = selectedSector === "ALL" || item.sector === selectedSector;
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "breakouts" && item.pattern.toLowerCase().includes("breakout")) ||
      (activeTab === "options" &&
        (item.oiAction === "Long Buildup" || item.oiAction === "Short Covering")) ||
      (activeTab === "momentum" && item.rsi > 60);

    return matchesSearch && matchesSector && matchesTab;
  });

  return (
    <QuantLayout active="screener">
      <div className="desk-container">
        {/* Screener Header */}
        <div className="desk-header">
          <div>
            <div className="desk-breadcrumb">
              <span>MARKET DESK</span>
              <ChevronRight size={14} />
              <span className="current">QUANTITATIVE SCREENER</span>
            </div>
            <h1 className="desk-title">Quantitative Market Screener</h1>
            <p className="desk-subtitle">
              Scan 2,000+ Indian equities and F&O derivatives for technical breakouts, volatility
              contractions, and institutional options accumulation.
            </p>
          </div>
          <div className="desk-actions">
            <Link to="/chat" className="btn-secondary">
              <Sparkles size={16} />
              <span>Ask Copilot to Screen</span>
            </Link>
          </div>
        </div>

        {/* Screener Tabs & Filters Bar */}
        <div className="screener-controls-card">
          <div className="screener-tabs-row">
            <div className="tab-pill-group">
              <button
                type="button"
                className={`tab-pill ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                All Setups ({screenerItems.length})
              </button>
              <button
                type="button"
                className={`tab-pill ${activeTab === "breakouts" ? "active" : ""}`}
                onClick={() => setActiveTab("breakouts")}
              >
                Breakouts
              </button>
              <button
                type="button"
                className={`tab-pill ${activeTab === "options" ? "active" : ""}`}
                onClick={() => setActiveTab("options")}
              >
                Options OI Surges
              </button>
              <button
                type="button"
                className={`tab-pill ${activeTab === "momentum" ? "active" : ""}`}
                onClick={() => setActiveTab("momentum")}
              >
                High Momentum (RSI &gt; 60)
              </button>
            </div>

            <div className="search-filter-wrapper">
              <div className="search-box">
                <Search size={15} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search symbol or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <select
                className="sector-select"
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
              >
                {sectors.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec === "ALL" ? "All Sectors" : sec}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Screener Results Table */}
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
                {filteredItems.map((item) => (
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
                        <span
                          className={`change-pill ${item.positive ? "pill-gain" : "pill-loss"}`}
                        >
                          {item.positive ? (
                            <ArrowUpRight size={12} />
                          ) : (
                            <ArrowDownRight size={12} />
                          )}
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
                        to="/chat"
                        className="btn-table-action"
                        title={`Analyze ${item.symbol} with AI Copilot`}
                      >
                        <Sparkles size={14} />
                        <span>Analyze</span>
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
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
      </div>
    </QuantLayout>
  );
}
