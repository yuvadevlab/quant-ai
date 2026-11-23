/**
 * @fileoverview High-frequency streaming ticker strip for major Indian benchmarks (NSE & BSE).
 * Consumes real-time WebSocket tick events with fallback to static benchmarks.
 * @author yuva.devlab@gmail.com
 */

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { COMMON_COPY } from "../../lib/ui-copy";
import { useBenchmarkTicks } from "../../services/market-feed.service";
import { useRealtimeTicks } from "../../hooks/use-realtime-ticks";

/**
 * Real-time Indian Benchmark Ticker Strip component.
 * Displays live index ticks with SVG sparkline trajectories and WebSocket stream state.
 */
export function MarketTickerStrip() {
  const { data: dbTicks } = useBenchmarkTicks();
  const staticTicks = dbTicks ?? [];
  const { ticks: liveTicks, isConnected } = useRealtimeTicks();
  const copy = COMMON_COPY.TICKER_STRIP;

  const ticks = staticTicks.map((tick) => {
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

  return (
    <div className="ticker-strip" aria-label={copy.ARIA_LABEL} role="region">
      <div className={`ticker-badge ${isConnected ? "is-connected" : ""}`}>
        {isConnected ? copy.CONNECTED_BADGE : copy.DESK_BADGE}
      </div>
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
        {isConnected ? "WS STREAM" : "POLL 1s"}
      </div>
    </div>
  );
}
