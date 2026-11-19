/**
 * @file src/components/layout/MarketTickerStrip.tsx
 * @description High-frequency streaming ticker strip for major Indian benchmarks (NSE & BSE). */

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { getBenchmarkTicks } from "../../services/market-feed.service";

/**
 * Real-time Indian Benchmark Ticker Strip component.
 * Displays live index ticks with SVG sparkline trajectories and session clock.
 */
export function MarketTickerStrip() {
  const ticks = getBenchmarkTicks();

  return (
    <div className="ticker-strip" aria-label="Real-time Indian Benchmark Ticker" role="region">
      <div className="ticker-badge">LIVE DESK</div>
      <div className="ticker-scroll-content">
        {ticks.map((tick) => {
          const isUp = tick.positive;
          const isNeutral = tick.isVix;
          const changeClass = isUp ? "is-up" : isNeutral ? "is-neutral" : "is-down";
          const sparkClass = isUp ? "spark-green" : isNeutral ? "spark-amber" : "spark-red";

          return (
            <div className="ticker-card" key={tick.name}>
              <span className="tick-name">{tick.name}</span>
              <span className="tick-price">{tick.price}</span>
              <span className={`tick-change ${changeClass}`}>
                {isUp ? (
                  <ArrowUpRight size={12} aria-hidden="true" />
                ) : (
                  <ArrowDownRight size={12} aria-hidden="true" />
                )}
                {tick.change}
              </span>
              <svg className="tick-spark" viewBox="0 0 60 17" aria-hidden="true">
                <polyline points={tick.path} className={`spark-line ${sparkClass}`} />
              </svg>
            </div>
          );
        })}
      </div>
      <div className="ticker-time-badge" aria-label="Session time">
        <span className="pulse-ping" aria-hidden="true" />
        10:48 IST
      </div>
    </div>
  );
}
