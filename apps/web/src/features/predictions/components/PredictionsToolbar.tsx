/**
 * @file src/features/predictions/components/PredictionsToolbar.tsx
 * @description Filter tabs, search box, and style dropdown toolbar.
 * @author yuva.devlab@gmail.com
 */

import { Search } from "lucide-react";
import { Button, Input } from "@quant-ai/ui";
import { LedgerFilterTab } from "@/constants";
import { PREDICTIONS_COPY } from "@/lib/ui-copy/predictions.copy";

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
  const copy = PREDICTIONS_COPY.TOOLBAR;

  const tabs = [
    { key: LedgerFilterTab.ALL, label: copy.TAB_ALL, count: counts.all },
    { key: LedgerFilterTab.ACTIVE, label: copy.TAB_ACTIVE, count: counts.active },
    { key: LedgerFilterTab.TARGET_HIT, label: copy.TAB_TARGET_HIT, count: counts.targetHit },
    { key: LedgerFilterTab.STOP_HIT, label: copy.TAB_STOP_HIT, count: counts.stopHit },
  ];

  return (
    <div className="screener-controls-card">
      <div className="screener-tabs-row">
        <div className="tab-pill-group">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              type="button"
              className={`tab-pill ${activeFilter === tab.key ? "active" : ""}`}
              onClick={() => onSelectFilter(tab.key)}
            >
              {tab.label} ({tab.count})
            </Button>
          ))}
        </div>

        <div className="search-filter-wrapper">
          <div className="search-box">
            <Search size={15} className="search-icon" />
            <Input
              type="text"
              placeholder={copy.SEARCH_PLACEHOLDER}
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
            <option value="All styles">{copy.STYLE_ALL}</option>
            <option value="Intraday">{copy.STYLE_INTRADAY}</option>
            <option value="Swing">{copy.STYLE_SWING}</option>
            <option value="Options">{copy.STYLE_OPTIONS}</option>
          </select>
        </div>
      </div>
    </div>
  );
}
