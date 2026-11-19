/**
 * @file src/features/predictions/components/PredictionsToolbar.tsx
 * @description Filter tabs, search box, and style dropdown toolbar.
 */

import { Search } from "lucide-react";
import { LedgerFilterTab } from "@/constants";

export interface PredictionsToolbarProps {
  readonly activeFilter: LedgerFilterTab;
  readonly onSelectFilter: (tab: LedgerFilterTab) => void;
  readonly horizonFilter: string;
  readonly onSelectHorizon: (horizon: string) => void;
  readonly search: string;
  readonly onSearchChange: (query: string) => void;
  readonly counts: {
    readonly all: number;
    readonly active: number;
    readonly targetHit: number;
    readonly stopHit: number;
  };
}

export function PredictionsToolbar({
  activeFilter,
  onSelectFilter,
  horizonFilter,
  onSelectHorizon,
  search,
  onSearchChange,
  counts,
}: PredictionsToolbarProps) {
  const tabs = [
    { key: LedgerFilterTab.ALL, label: "All calls", count: counts.all },
    { key: LedgerFilterTab.ACTIVE, label: "Active", count: counts.active },
    { key: LedgerFilterTab.TARGET_HIT, label: "Target hit", count: counts.targetHit },
    { key: LedgerFilterTab.STOP_HIT, label: "Stop loss hit", count: counts.stopHit },
  ];

  return (
    <div className="screener-controls-card">
      <div className="screener-tabs-row">
        <div className="tab-pill-group">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`tab-pill ${activeFilter === tab.key ? "active" : ""}`}
              onClick={() => onSelectFilter(tab.key)}
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
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
          </div>

          <select
            className="sector-select"
            value={horizonFilter}
            onChange={(e) => onSelectHorizon(e.target.value)}
          >
            <option value="All styles">All Styles</option>
            <option value="Intraday">Intraday</option>
            <option value="Swing">Swing</option>
            <option value="Options">Options</option>
          </select>
        </div>
      </div>
    </div>
  );
}
