/**
 * @file src/features/screener/components/ScreenerToolbar.tsx
 * @description Filter tabs, search box, and sector selector for the screener desk.
 */

import { Search } from "lucide-react";

export interface ScreenerToolbarProps {
  readonly activeTab: "all" | "breakouts" | "options" | "momentum";
  readonly onSelectTab: (tab: "all" | "breakouts" | "options" | "momentum") => void;
  readonly searchQuery: string;
  readonly onSearchChange: (query: string) => void;
  readonly selectedSector: string;
  readonly onSelectSector: (sector: string) => void;
  readonly sectors: readonly string[];
  readonly totalCount: number;
}

export function ScreenerToolbar({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  selectedSector,
  onSelectSector,
  sectors,
  totalCount,
}: ScreenerToolbarProps) {
  return (
    <div className="screener-controls-card">
      <div className="screener-tabs-row">
        <div className="tab-pill-group">
          <button
            type="button"
            className={`tab-pill ${activeTab === "all" ? "active" : ""}`}
            onClick={() => onSelectTab("all")}
          >
            All Setups ({totalCount})
          </button>
          <button
            type="button"
            className={`tab-pill ${activeTab === "breakouts" ? "active" : ""}`}
            onClick={() => onSelectTab("breakouts")}
          >
            Breakouts
          </button>
          <button
            type="button"
            className={`tab-pill ${activeTab === "options" ? "active" : ""}`}
            onClick={() => onSelectTab("options")}
          >
            Options OI Surges
          </button>
          <button
            type="button"
            className={`tab-pill ${activeTab === "momentum" ? "active" : ""}`}
            onClick={() => onSelectTab("momentum")}
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
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
          </div>

          <select
            className="sector-select"
            value={selectedSector}
            onChange={(e) => onSelectSector(e.target.value)}
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
  );
}
