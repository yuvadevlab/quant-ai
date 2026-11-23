/**
 * @file packages/ui/src/components/PredictionsToolbar.tsx
 * @description Filter tabs, search box, and trading horizon style dropdown toolbar.
 * @author yuva.devlab@gmail.com
 */

import {
  Button,
  Card,
  CardContent,
  SearchInput,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@yuva-devlab/ui";

/**
 * Filter tab definition for prediction ledger.
 */
export interface PredictionFilterTabOption {
  readonly key: string;
  readonly label: string;
  readonly count: number;
}

/**
 * Props for the PredictionsToolbar presentation component.
 */
export interface PredictionsToolbarProps {
  /** Active filter tab key */
  readonly activeFilter: string;
  /** Callback on filter tab selection */
  readonly onSelectFilter: (tabKey: string) => void;
  /** Active trading horizon filter */
  readonly horizonFilter: string;
  /** Callback on horizon selection */
  readonly onSelectHorizon: (horizon: string) => void;
  /** Current search input query */
  readonly search: string;
  /** Callback on search input change */
  readonly onSearchChange: (query: string) => void;
  /** Tab counts */
  readonly counts: {
    readonly all: number;
    readonly active: number;
    readonly targetHit: number;
    readonly stopHit: number;
  };
  /** Placeholder text for search input */
  readonly searchPlaceholder?: string;
  /** Custom tab options overriding defaults */
  readonly customTabs?: readonly PredictionFilterTabOption[];
}

/**
 * Helper to normalize tab keys for resilient comparison.
 *
 * @param key - Raw tab key string.
 * @returns Standardized uppercase normalized key.
 */
function normalizeKey(key: string): string {
  return key.trim().toUpperCase().replace("-", "_");
}

/**
 * Tabular controls toolbar for filtering predictions by status, horizon, and ticker query.
 *
 * @param props - Filter states, tab counts, and change handlers.
 * @returns Rendered JSX PredictionsToolbar element.
 */
export function PredictionsToolbar({
  activeFilter,
  onSelectFilter,
  horizonFilter,
  onSelectHorizon,
  search,
  onSearchChange,
  counts,
  searchPlaceholder = "Filter by symbol (e.g. RELIANCE, NIFTY), ID, or thesis...",
  customTabs,
}: PredictionsToolbarProps) {
  const tabs = customTabs ?? [
    { key: "ALL", label: "All Calls", count: counts.all },
    { key: "ACTIVE", label: "Active", count: counts.active },
    { key: "TARGET_HIT", label: "Target Hit", count: counts.targetHit },
    { key: "STOP_HIT", label: "Stop Hit", count: counts.stopHit },
  ];

  const isTabActive = (tabKey: string) => normalizeKey(tabKey) === normalizeKey(activeFilter);

  return (
    <Card className="screener-controls-card">
      <CardContent className="p-0">
        <div className="screener-tabs-row">
          <div className="tab-pill-group">
            {tabs.map((tab) => (
              <Button
                key={tab.key}
                type="button"
                variant="ghost"
                size="sm"
                className={`tab-pill ${isTabActive(tab.key) ? "active" : ""}`}
                onClick={() => onSelectFilter(tab.key)}
              >
                {tab.label} ({tab.count})
              </Button>
            ))}
          </div>

          <div className="search-filter-wrapper">
            <SearchInput
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              onClear={() => onSearchChange("")}
              placeholder={searchPlaceholder}
              className="toolbar-search-input"
            />

            <Select value={horizonFilter} onValueChange={onSelectHorizon}>
              <SelectTrigger className="toolbar-select-trigger">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All styles">All Styles</SelectItem>
                <SelectItem value="Intraday">Intraday</SelectItem>
                <SelectItem value="Swing">Swing</SelectItem>
                <SelectItem value="Options">Options</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
