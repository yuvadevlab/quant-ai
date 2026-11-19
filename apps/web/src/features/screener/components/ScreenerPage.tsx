/**
 * @file src/features/screener/components/ScreenerPage.tsx
 * @description Master Institutional Screener page wrapper with filtering and sector tabs.
 * @author yuva.devlab@gmail.com
 */

import { useMemo, useState } from "react";
import { QuantShell } from "@/components/layout";
import { SectorFilter, ScreenerTab } from "@/constants/market.constants";
import { OiAction } from "@/components/quantai/data";
import { ScreenerHeader } from "./ScreenerHeader";
import { ScreenerToolbar } from "./ScreenerToolbar";
import { ScreenerTable } from "./ScreenerTable";
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
        <ScreenerHeader />
        <ScreenerToolbar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedSector={selectedSector}
          onSelectSector={setSelectedSector}
          sectors={initialData.sectors}
          totalCount={initialData.items.length}
        />
        <ScreenerTable items={filteredItems} />
      </div>
    </QuantShell>
  );
}
