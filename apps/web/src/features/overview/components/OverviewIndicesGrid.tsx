/**
 * @file src/features/overview/components/OverviewIndicesGrid.tsx
 * @description Benchmark indices metric cards grid for Indian markets.
 */

import { IndexMetricCard } from "@quant-ai/ui";
import type { MarketTick } from "@/services/market-feed.service";

export interface OverviewIndicesGridProps {
  readonly ticks: readonly MarketTick[];
}

export function OverviewIndicesGrid({ ticks }: OverviewIndicesGridProps) {
  return (
    <section className="indices-grid" aria-label="Major Indian Indices">
      {ticks.map((index) => (
        <IndexMetricCard
          key={index.name}
          name={index.name}
          subtitle={index.exchange}
          price={index.price}
          change={index.change}
          isPositive={index.positive}
          sparklinePoints={index.path}
        />
      ))}
    </section>
  );
}
