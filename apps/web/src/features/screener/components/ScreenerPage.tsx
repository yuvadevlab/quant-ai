/**
 * @file src/features/screener/components/ScreenerPage.tsx
 * @description Master Quantitative Screener page wrapper.
 * Composes workstation shell, header banner, filter/search toolbar, and results table.
 */

import { useMemo, useState } from "react";
import { QuantShell } from "@/components/layout";
import { ScreenerHeader } from "./ScreenerHeader";
import { ScreenerToolbar } from "./ScreenerToolbar";
import { ScreenerTable } from "./ScreenerTable";
import type { ScreenerData } from "../api/getScreenerData";

export interface ScreenerPageProps {
  readonly initialData: ScreenerData;
}

export function ScreenerPage({ initialData }: ScreenerPageProps) {
  const [activeTab, setActiveTab] = useState<"all" | "breakouts" | "options" | "momentum">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("ALL");

  const filteredItems = useMemo(() => {
    return initialData.items.filter((item) => {
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
