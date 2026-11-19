/**
 * @file src/features/screener/components/ScreenerToolbar.tsx
 * @description Filter tabs, search box, and sector selector for the screener desk.
 * @author yuva.devlab@gmail.com
 */

import { Search } from "lucide-react";
import { SectorFilter, ScreenerTab } from "@/constants/market.constants";

export interface ScreenerToolbarProps {
  readonly activeTab: ScreenerTab;
  readonly onSelectTab: (tab: ScreenerTab) => void;
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
            className={`tab-pill ${activeTab === ScreenerTab.ALL ? "active" : ""}`}
            onClick={() => onSelectTab(ScreenerTab.ALL)}
          >
            All Setups ({totalCount})
          </button>
          <button
            type="button"
            className={`tab-pill ${activeTab === ScreenerTab.BREAKOUTS ? "active" : ""}`}
            onClick={() => onSelectTab(ScreenerTab.BREAKOUTS)}
          >
            Breakouts
          </button>
          <button
            type="button"
            className={`tab-pill ${activeTab === ScreenerTab.OPTIONS ? "active" : ""}`}
            onClick={() => onSelectTab(ScreenerTab.OPTIONS)}
          >
            Options OI Surges
          </button>
          <button
            type="button"
            className={`tab-pill ${activeTab === ScreenerTab.MOMENTUM ? "active" : ""}`}
            onClick={() => onSelectTab(ScreenerTab.MOMENTUM)}
          >
            High Momentum (RSI &gt; 60)
          </button>
        </div>

        <div className="search-wrap">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search symbol, pattern, thesis..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="sector-filter-row">
        <span className="sector-label">SECTOR:</span>
        <div className="sector-pills">
          {sectors.map((sec) => (
            <button
              key={sec}
              type="button"
              className={`sector-pill ${selectedSector === sec ? "active" : ""}`}
              onClick={() => onSelectSector(sec)}
            >
              {sec === SectorFilter.ALL ? "All Sectors" : sec}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
