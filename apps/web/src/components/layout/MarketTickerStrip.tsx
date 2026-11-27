/**
 * @fileoverview High-frequency streaming ticker strip for major Indian benchmarks (NSE & BSE).
 * Consumes real-time WebSocket tick events with fallback to static benchmarks.
 */

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { MarketDataStatus } from "@quant-ai/shared-types";
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
    if (
      !live ||
      live.dataStatus === MarketDataStatus.SIMULATED ||
      live.dataStatus === MarketDataStatus.UNAVAILABLE
    ) {
      return tick;
    }

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
      dataStatus: live.dataStatus ?? tick.dataStatus,
      ...(live.observedAt ? { observedAt: live.observedAt } : {}),
    };
  });

  const statusLabels: Readonly<Record<MarketDataStatus, string>> = {
    [MarketDataStatus.VERIFIED]: COMMON_COPY.TICKER_STRIP.VERIFIED,
    [MarketDataStatus.PROVIDER_UNVERIFIED]: COMMON_COPY.TICKER_STRIP.PROVIDER_UNVERIFIED,
    [MarketDataStatus.MARKET_CLOSED]: COMMON_COPY.TICKER_STRIP.MARKET_CLOSED,
    [MarketDataStatus.STALE]: COMMON_COPY.TICKER_STRIP.STALE,
    [MarketDataStatus.SIMULATED]: COMMON_COPY.TICKER_STRIP.SIMULATED,
    [MarketDataStatus.UNAVAILABLE]: COMMON_COPY.TICKER_STRIP.AWAITING_QUOTES,
  };

  return (
    <div className="ticker-strip" aria-label={copy.ARIA_LABEL} role="region">
      <div className={`ticker-badge ${isConnected ? "is-connected" : ""}`}>
        {isConnected ? copy.CONNECTED_BADGE : copy.DESK_BADGE}
      </div>
      <div className="ticker-scroll-content">
        {ticks.map((tick) => {
          const hasMarketPrice = tick.price !== "—";
          const isUp = tick.positive;
          const isNeutral = tick.isVix;
          const changeClass = isNeutral ? "is-neutral" : isUp ? "is-up" : "is-down";
          const sparkClass = isNeutral ? "spark-amber" : isUp ? "spark-green" : "spark-red";

          return (
            <div className="ticker-card" key={tick.name}>
              <span className="tick-name">
                {tick.name}
                <span className="tick-exchange">{tick.exchange}</span>
              </span>
              <span className="tick-price">{tick.price}</span>
              {hasMarketPrice && (
                <span className={`tick-change ${changeClass}`}>
                  {isUp ? (
                    <ArrowUpRight size={12} aria-hidden="true" />
                  ) : (
                    <ArrowDownRight size={12} aria-hidden="true" />
                  )}
                  {tick.change}
                </span>
              )}
              <span className="tick-data-status">{statusLabels[tick.dataStatus]}</span>
              {tick.path && (
                <svg className="tick-spark" viewBox="0 0 60 17" aria-hidden="true">
                  <polyline points={tick.path} className={`spark-line ${sparkClass}`} />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
