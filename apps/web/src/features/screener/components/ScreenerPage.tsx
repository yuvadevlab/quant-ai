/**
 * @file src/features/screener/components/ScreenerPage.tsx
 * @description Master Institutional Screener page wrapper with filtering and sector tabs.
 * Composes workstation shell and pure @quant-ai/ui presentation blocks with filter state.
 * @author yuva.devlab@gmail.com
 */

import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { QuantShell } from "@/components/layout";
import { SectorFilter, ScreenerTab } from "@/constants/market.constants";
import { OiAction } from "@/components/quantai/data";
import { AppRoute } from "@/constants/routes.constants";
import { SCREENER_COPY } from "@/lib/ui-copy/screener.copy";
import { ScreenerHeader, ScreenerToolbar, ScreenerTable } from "@quant-ai/ui";
import type { ScreenerData } from "../api/getScreenerData";

export interface ScreenerPageProps {
  readonly initialData: ScreenerData;
}

export function ScreenerPage({ initialData }: ScreenerPageProps) {
  const [activeTab, setActiveTab] = useState<ScreenerTab>(ScreenerTab.ALL);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>(SectorFilter.ALL);

  const filteredItems = useMemo(() => {
    return initialData.items.filter((item) => {
      const matchesSearch =
        item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = selectedSector === SectorFilter.ALL || item.sector === selectedSector;
      const matchesTab =
        activeTab === ScreenerTab.ALL ||
        (activeTab === ScreenerTab.BREAKOUTS && item.pattern.toLowerCase().includes("breakout")) ||
        (activeTab === ScreenerTab.OPTIONS &&
          (item.oiAction === OiAction.LONG_BUILDUP || item.oiAction === OiAction.SHORT_COVERING)) ||
        (activeTab === ScreenerTab.MOMENTUM && item.rsi > 60);

      return matchesSearch && matchesSector && matchesTab;
    });
  }, [initialData.items, searchQuery, selectedSector, activeTab]);

  return (
    <QuantShell>
      <div className="desk-container">
        <ScreenerHeader
          actionSlot={
            <Link to={AppRoute.CHAT} className="btn-secondary">
              <Sparkles size={16} />
              <span>{SCREENER_COPY.HEADER.ASK_COPILOT}</span>
            </Link>
          }
        />
        <ScreenerToolbar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab as ScreenerTab)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedSector={selectedSector}
          onSelectSector={setSelectedSector}
          sectors={initialData.sectors}
          totalCount={initialData.items.length}
        />
        <ScreenerTable
          items={filteredItems}
          renderAnalyzeLink={(item) => (
            <Link
              to={AppRoute.CHAT}
              className="btn-table-action"
              title={`${SCREENER_COPY.TABLE.ANALYZE_TITLE_PREFIX} ${item.symbol} ${SCREENER_COPY.TABLE.ANALYZE_TITLE_SUFFIX}`}
            >
              <Sparkles size={14} />
              <span>{SCREENER_COPY.TABLE.ANALYZE_ACTION}</span>
            </Link>
          )}
        />
      </div>
    </QuantShell>
  );
}
