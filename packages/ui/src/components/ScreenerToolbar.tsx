/**
 * @file packages/ui/src/components/ScreenerToolbar.tsx
 * @description Filter tabs, search box, and sector selector for the screener desk.
 * @author yuva.devlab@gmail.com
 */

import { Search } from "lucide-react";
import { Button } from "@yuva-devlab/ui";
import { Input } from "@yuva-devlab/ui";
import { Card, CardContent } from "@yuva-devlab/ui";

/**
 * Props for the ScreenerToolbar presentation component.
 */
export interface ScreenerToolbarProps {
  /** Active screener tab key */
  readonly activeTab: string;
  /** Callback when user selects a tab */
  readonly onSelectTab: (tab: string) => void;
  /** Current search query string */
  readonly searchQuery: string;
  /** Callback when search query changes */
  readonly onSearchChange: (query: string) => void;
  /** Currently selected sector filter */
  readonly selectedSector: string;
  /** Callback when sector filter changes */
  readonly onSelectSector: (sector: string) => void;
  /** List of available sectors */
  readonly sectors: readonly string[];
  /** Total matching universe stock count */
  readonly totalCount: number;
  /** Search placeholder text */
  readonly searchPlaceholder?: string;
  /** Sector row label */
  readonly sectorLabel?: string;
}

/**
 * Filter toolbar with tabs, search, and sector chips for quantitative stock scans.
 *
 * @param props - ScreenerToolbarProps containing states and callback handlers.
 * @returns Rendered JSX ScreenerToolbar element.
 */
export function ScreenerToolbar({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  selectedSector,
  onSelectSector,
  sectors,
  totalCount,
  searchPlaceholder = "Search symbol, sector, pattern (e.g. HDFC, IT, Volume Breakout)...",
  sectorLabel = "SECTOR FILTER:",
}: ScreenerToolbarProps) {
  return (
    <Card className="screener-controls-card">
      <CardContent className="p-0">
        <div className="screener-tabs-row">
          <div className="tab-pill-group">
            <Button
              type="button"
              className={`tab-pill ${activeTab === "all" ? "active" : ""}`}
              onClick={() => onSelectTab("all")}
            >
              All Matches ({totalCount})
            </Button>
            <Button
              type="button"
              className={`tab-pill ${activeTab === "breakouts" ? "active" : ""}`}
              onClick={() => onSelectTab("breakouts")}
            >
              High Volume Breakouts
            </Button>
            <Button
              type="button"
              className={`tab-pill ${activeTab === "options" ? "active" : ""}`}
              onClick={() => onSelectTab("options")}
            >
              Options Heavy OI
            </Button>
            <Button
              type="button"
              className={`tab-pill ${activeTab === "momentum" ? "active" : ""}`}
              onClick={() => onSelectTab("momentum")}
            >
              RSI Momentum &gt; 60
            </Button>
          </div>

          <div className="search-wrap">
            <Search size={14} className="search-icon" />
            <Input
              type="text"
              className="search-input"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="sector-filter-row">
          <span className="sector-label">{sectorLabel}</span>
          <div className="sector-pills">
            {sectors.map((sec) => (
              <Button
                key={sec}
                type="button"
                className={`sector-pill ${selectedSector === sec ? "active" : ""}`}
                onClick={() => onSelectSector(sec)}
              >
                {sec === "ALL" ? "All Sectors" : sec}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
