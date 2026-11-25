/**
 * @file apps/api/src/modules/market/feed/live-market-feed.service.ts
 * @description Dynamic multi-asset market data feed service resolving live quotes globally.
 * Implements Singleflight request coalescing, Last Known Good (LKG) caching, and automatic symbol mapping.
 * @author yuva.devlab@gmail.com
 */

import { Injectable, Optional } from "@nestjs/common";
import { Logger } from "@yuva-devlab/logger";
import { CachePrefix, MarketDataStatus } from "@quant-ai/shared-types";
import {
  CurrencyCode,
  ExchangeCode,
  InstrumentTypeCode,
  StochasticPriceSimulator,
} from "@quant-ai/quant-core";
import { RedisService } from "../../infrastructure/redis.service";
import type { LiveMarketQuote } from "./market-feed.types";
import { GLOBAL_FEED_SYMBOL_MAP } from "./market-feed.constants";
import { YahooFinanceHttpClient } from "./yahoo-finance-http.client";
import { GoogleFinanceHttpClient } from "./google-finance-http.client";
import { classifyMarketDataStatus } from "./market-data-status";

@Injectable()
export class LiveMarketFeedService {
  private readonly logger = new Logger(LiveMarketFeedService.name);
  private readonly memoryCache = new Map<string, { quote: LiveMarketQuote; expiresAt: number }>();
  private readonly lastKnownQuotes = new Map<string, LiveMarketQuote>();
  private readonly inFlightRequests = new Map<string, Promise<LiveMarketQuote>>();
  private readonly simulator = new StochasticPriceSimulator();
  private readonly googleHttpClient: GoogleFinanceHttpClient;
  private readonly yahooHttpClient: YahooFinanceHttpClient;

  public constructor(
    @Optional()
    googleOrYahooClient?: GoogleFinanceHttpClient | YahooFinanceHttpClient,
    @Optional()
    yahooOrRedisClient?: YahooFinanceHttpClient | RedisService,
    @Optional() private readonly redisService?: RedisService,
  ) {
    if (googleOrYahooClient instanceof YahooFinanceHttpClient) {
      this.googleHttpClient = new GoogleFinanceHttpClient();
      this.yahooHttpClient = googleOrYahooClient;
      if (yahooOrRedisClient instanceof RedisService) {
        this.redisService = yahooOrRedisClient;
      }
    } else {
      this.googleHttpClient = googleOrYahooClient ?? new GoogleFinanceHttpClient();
      this.yahooHttpClient =
        yahooOrRedisClient instanceof YahooFinanceHttpClient
          ? yahooOrRedisClient
          : new YahooFinanceHttpClient();
    }
    this.seedBaselineQuotes();
  }

  private seedBaselineQuotes(): void {
    for (const symbol of Object.keys(GLOBAL_FEED_SYMBOL_MAP)) {
      const sim = this.simulator.generateNextTick(symbol);
      this.lastKnownQuotes.set(symbol, {
        symbol,
        displayName: symbol,
        price: sim.price,
        change: sim.change,
        percentChange: sim.percentChange,
        dayHigh: sim.dayHigh,
        dayLow: sim.dayLow,
        volume: sim.volume,
        currency: sim.currency,
        exchange: sim.exchange,
        instrumentType: sim.instrumentType,
        sparkline: sim.sparkline,
        source: "Synthetic simulator",
        dataStatus: MarketDataStatus.SIMULATED,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Resolves and fetches live quote for any symbol with request coalescing and fallback.
   *
   * @param symbol Ticker or instrument identifier.
   * @returns LiveMarketQuote record.
   */
  public async getLiveQuote(symbol: string): Promise<LiveMarketQuote> {
    const cached = this.getCachedQuote(symbol);
    if (cached) {
      return cached;
    }

    const inFlight = this.inFlightRequests.get(symbol);
    if (inFlight) {
      return inFlight;
    }

    const requestPromise = this.fetchFromExchangeOrFallback(symbol);
    this.inFlightRequests.set(symbol, requestPromise);

    try {
      return await requestPromise;
    } finally {
      this.inFlightRequests.delete(symbol);
    }
  }

  /**
   * Resolves raw symbol to external exchange feed ticker.
   * Maps NSE indices to ^CNX/^NSE tickers and adds .NS suffix for Indian equities.
   */
  public resolveFeedTicker(symbol: string): string {
    const trimmed = symbol.trim().toUpperCase();
    const mapped = GLOBAL_FEED_SYMBOL_MAP[trimmed];
    if (mapped) return mapped;
    return /[\^.=-]/.test(trimmed) ? trimmed : `${trimmed}.NS`;
  }

  private async fetchFromExchangeOrFallback(symbol: string): Promise<LiveMarketQuote> {
    try {
      const googleQuote = await this.googleHttpClient.fetchQuote(symbol);
      if (googleQuote) {
        this.lastKnownQuotes.set(symbol, googleQuote);
        this.cacheQuote(symbol, googleQuote, 15000);
        return googleQuote;
      }
    } catch (gErr) {
      this.logger.debug(`[getLiveQuote] Google Finance failed for ${symbol}: ${String(gErr)}`);
    }

    try {
      const feedTicker = this.resolveFeedTicker(symbol);
      const result = await this.yahooHttpClient.fetchChart(feedTicker);
      const meta = result.meta;

      if (!meta || typeof meta.regularMarketPrice !== "number") {
        throw new Error(`Market price missing in exchange payload for ${symbol}`);
      }

      const price = meta.regularMarketPrice;
      const prevClose = meta.chartPreviousClose ?? price;
      const change = Number((price - prevClose).toFixed(2));
      const percentChange = Number(((change / prevClose) * 100).toFixed(2));

      const rawCloses = result.indicators?.quote?.[0]?.close ?? [];
      const sparkline = rawCloses
        .filter((c): c is number => typeof c === "number" && !isNaN(c))
        .slice(-20);
      const observedAt =
        typeof meta.regularMarketTime === "number"
          ? new Date(meta.regularMarketTime * 1000).toISOString()
          : undefined;
      const dataStatus = observedAt
        ? classifyMarketDataStatus(new Date(observedAt))
        : MarketDataStatus.UNAVAILABLE;

      const quote: LiveMarketQuote = {
        symbol,
        displayName: symbol,
        price,
        change,
        percentChange,
        dayHigh: meta.regularMarketDayHigh ?? price * 1.01,
        dayLow: meta.regularMarketDayLow ?? price * 0.99,
        volume: meta.regularMarketVolume ?? 100000,
        currency: meta.currency ?? CurrencyCode.INR,
        exchange: meta.fullExchangeName ?? ExchangeCode.NSE,
        instrumentType: meta.instrumentType ?? InstrumentTypeCode.EQUITY,
        sparkline: sparkline.length >= 2 ? sparkline : [prevClose, price],
        source: "Yahoo Finance",
        dataStatus,
        ...(observedAt ? { observedAt } : {}),
        timestamp: observedAt ?? new Date().toISOString(),
      };

      this.lastKnownQuotes.set(symbol, quote);
      this.cacheQuote(symbol, quote);
      return quote;
    } catch (err) {
      this.logger.debug(`[getLiveQuote] Exchange feed query failed for ${symbol}: ${String(err)}`);

      // 1. Return Last Known Good quote if available
      const lastKnown = this.lastKnownQuotes.get(symbol);
      if (lastKnown) {
        const isExpired =
          !lastKnown.observedAt ||
          Date.now() - new Date(lastKnown.observedAt).getTime() > 15 * 60 * 1000;
        return {
          ...lastKnown,
          dataStatus:
            lastKnown.dataStatus === MarketDataStatus.SIMULATED
              ? MarketDataStatus.SIMULATED
              : isExpired
                ? MarketDataStatus.STALE
                : lastKnown.dataStatus,
        };
      }

      // 2. Calibrated stochastic fallback ensures zero stream interruption
      const sim = this.simulator.generateNextTick(symbol);
      const fallbackQuote: LiveMarketQuote = {
        symbol,
        displayName: symbol,
        price: sim.price,
        change: sim.change,
        percentChange: sim.percentChange,
        dayHigh: sim.dayHigh,
        dayLow: sim.dayLow,
        volume: sim.volume,
        currency: sim.currency,
        exchange: sim.exchange,
        instrumentType: sim.instrumentType,
        sparkline: sim.sparkline,
        source: "Synthetic simulator",
        dataStatus: MarketDataStatus.SIMULATED,
        timestamp: sim.timestamp,
      };
      this.lastKnownQuotes.set(symbol, fallbackQuote);
      this.cacheQuote(symbol, fallbackQuote, 5000);
      return fallbackQuote;
    }
  }

  private getCachedQuote(symbol: string): LiveMarketQuote | undefined {
    const entry = this.memoryCache.get(symbol);
    return entry && entry.expiresAt > Date.now() ? entry.quote : undefined;
  }

  private cacheQuote(symbol: string, quote: LiveMarketQuote, ttlMs = 10000): void {
    this.memoryCache.set(symbol, { quote, expiresAt: Date.now() + ttlMs });
    void this.redisService?.set(`${CachePrefix.TICKER}${symbol}`, quote, Math.ceil(ttlMs / 1000));
  }
}
