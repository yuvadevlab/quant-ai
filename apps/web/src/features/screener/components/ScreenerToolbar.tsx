/**
 * @file src/features/screener/components/ScreenerToolbar.tsx
 * @description Filter tabs, search box, and sector selector for the screener desk.
 * @author yuva.devlab@gmail.com
 */

import { Search } from "lucide-react";
import { Button, Input } from "@quant-ai/ui";
import { SectorFilter, ScreenerTab } from "@/constants/market.constants";
import { SCREENER_COPY } from "@/lib/ui-copy/screener.copy";

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
  const copy = SCREENER_COPY.TOOLBAR;

  return (
    <div className="screener-controls-card">
      <div className="screener-tabs-row">
        <div className="tab-pill-group">
          <Button
            type="button"
            className={`tab-pill ${activeTab === ScreenerTab.ALL ? "active" : ""}`}
            onClick={() => onSelectTab(ScreenerTab.ALL)}
          >
            {copy.TAB_ALL} ({totalCount})
          </Button>
          <Button
            type="button"
            className={`tab-pill ${activeTab === ScreenerTab.BREAKOUTS ? "active" : ""}`}
            onClick={() => onSelectTab(ScreenerTab.BREAKOUTS)}
          >
            {copy.TAB_BREAKOUTS}
          </Button>
          <Button
            type="button"
            className={`tab-pill ${activeTab === ScreenerTab.OPTIONS ? "active" : ""}`}
            onClick={() => onSelectTab(ScreenerTab.OPTIONS)}
          >
            {copy.TAB_OPTIONS}
          </Button>
          <Button
            type="button"
            className={`tab-pill ${activeTab === ScreenerTab.MOMENTUM ? "active" : ""}`}
            onClick={() => onSelectTab(ScreenerTab.MOMENTUM)}
          >
            {copy.TAB_MOMENTUM}
          </Button>
        </div>

        <div className="search-wrap">
          <Search size={14} className="search-icon" />
          <Input
            type="text"
            className="search-input"
            placeholder={copy.SEARCH_PLACEHOLDER}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="sector-filter-row">
        <span className="sector-label">{copy.SECTOR_LABEL}</span>
        <div className="sector-pills">
          {sectors.map((sec) => (
            <Button
              key={sec}
              type="button"
              className={`sector-pill ${selectedSector === sec ? "active" : ""}`}
              onClick={() => onSelectSector(sec)}
            >
              {sec === SectorFilter.ALL ? copy.ALL_SECTORS : sec}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
