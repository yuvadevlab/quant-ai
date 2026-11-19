/**
 * @fileoverview Benchmark indices metric cards grid with category filtering and real-time tick streaming.
 * @author yuva.devlab@gmail.com
 */

import { useState } from "react";
import { IndexCategory } from "@quant-ai/shared-types";
import { IndexCategoryFilter } from "@/constants/market.constants";
import { IndexMetricCard } from "@quant-ai/ui";
import { OVERVIEW_COPY } from "@/lib/ui-copy";
import type { MarketTick } from "@/services/market-feed.service";
import { useRealtimeTicks } from "@/hooks/use-realtime-ticks";

export interface OverviewIndicesGridProps {
  readonly ticks: readonly MarketTick[];
}

type FilterCategory = IndexCategory | IndexCategoryFilter.ALL;

interface FilterOption {
  readonly key: FilterCategory;
  readonly label: string;
}

const FILTER_OPTIONS: readonly FilterOption[] = [
  { key: IndexCategoryFilter.ALL, label: OVERVIEW_COPY.INDEX_FILTERS.ALL },
  {
    key: IndexCategory.BROAD_MARKET,
    label: OVERVIEW_COPY.INDEX_FILTERS.BROAD_MARKET,
  },
  {
    key: IndexCategory.FINANCIALS,
    label: OVERVIEW_COPY.INDEX_FILTERS.FINANCIALS,
  },
  {
    key: IndexCategory.SECTORAL,
    label: OVERVIEW_COPY.INDEX_FILTERS.SECTORAL,
  },
  {
    key: IndexCategory.VOLATILITY,
    label: OVERVIEW_COPY.INDEX_FILTERS.VOLATILITY,
  },
];

/**
 * Interactive benchmark indices grid with instant category filtering and live WebSocket price updates.
 */
export function OverviewIndicesGrid({ ticks }: OverviewIndicesGridProps) {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>(IndexCategoryFilter.ALL);
  const { ticks: liveTicks } = useRealtimeTicks();

  const hydratedTicks = ticks.map((tick) => {
    const live = liveTicks[tick.name];
    if (!live) return tick;

    const formattedPrice = live.price.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const sign = live.change >= 0 ? "+" : "";
    const pctSign = live.percentChange >= 0 ? "+" : "";
    const formattedChange = `${sign}${live.change.toFixed(2)} (${pctSign}${live.percentChange.toFixed(2)}%)`;

    return {
      ...tick,
      price: formattedPrice,
      change: formattedChange,
      positive: live.change >= 0,
    };
  });

  const filteredTicks =
    activeCategory === IndexCategoryFilter.ALL
      ? hydratedTicks
      : hydratedTicks.filter((tick) => tick.category === activeCategory);

  return (
    <div className="indices-section">
      <nav className="indices-filter-bar" aria-label="Index Category Filters">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            className={`indices-filter-btn ${activeCategory === opt.key ? "is-active" : ""}`}
            onClick={() => setActiveCategory(opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </nav>

      <section className="indices-grid" aria-label="Indian Market Benchmark Indices">
        {filteredTicks.map((index) => (
          <IndexMetricCard
            key={index.name}
            name={index.name}
            subtitle={index.exchange}
            price={index.price}
            change={index.change}
            isPositive={index.positive}
            sparklinePoints={index.path}
            isNeutral={Boolean(index.isVix)}
          />
        ))}
      </section>
    </div>
  );
}
