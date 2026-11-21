/**
 * @file packages/ui/src/components/OverviewIndicesGrid.tsx
 * @description Benchmark indices metric cards grid with category filtering.
 * @author yuva.devlab@gmail.com
 */

import { Button } from "@yuva-devlab/ui";
import { IndexMetricCard } from "./IndexMetricCard";
import type { IndexTickItem } from "../types";

/**
 * Filter option contract for index category tabs.
 */
export interface IndexCategoryOption {
  readonly key: string;
  readonly label: string;
}

/**
 * Props for the OverviewIndicesGrid presentation component.
 */
export interface OverviewIndicesGridProps {
  /** Array of benchmark index tick objects */
  readonly ticks: readonly IndexTickItem[];
  /** Currently active category filter */
  readonly activeCategory: string;
  /** Callback when user changes category filter */
  readonly onSelectCategory: (category: string) => void;
  /** Custom category options */
  readonly filterOptions?: readonly IndexCategoryOption[];
  /** Section aria label */
  readonly ariaLabel?: string;
}

const DEFAULT_FILTER_OPTIONS: readonly IndexCategoryOption[] = [
  { key: "ALL", label: "All Benchmarks" },
  { key: "BROAD_MARKET", label: "Broad Market" },
  { key: "FINANCIALS", label: "Financials" },
  { key: "SECTORAL", label: "Sectoral" },
  { key: "VOLATILITY", label: "Volatility" },
];

/**
 * Benchmark indices grid displaying cards with sparklines and instant category filters.
 *
 * @param props - OverviewIndicesGridProps containing ticks and category filter state.
 * @returns Rendered JSX OverviewIndicesGrid element.
 */
export function OverviewIndicesGrid({
  ticks,
  activeCategory,
  onSelectCategory,
  filterOptions = DEFAULT_FILTER_OPTIONS,
  ariaLabel = "Market benchmark index metrics",
}: OverviewIndicesGridProps) {
  const filteredTicks =
    activeCategory === "ALL" ? ticks : ticks.filter((tick) => tick.category === activeCategory);

  return (
    <div className="indices-section">
      <nav className="indices-filter-bar" aria-label="Index Category Filters">
        {filterOptions.map((opt) => (
          <Button
            key={opt.key}
            type="button"
            className={`indices-filter-btn ${activeCategory === opt.key ? "is-active" : ""}`}
            onClick={() => onSelectCategory(opt.key)}
          >
            {opt.label}
          </Button>
        ))}
      </nav>

      <section className="indices-grid" aria-label={ariaLabel}>
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
