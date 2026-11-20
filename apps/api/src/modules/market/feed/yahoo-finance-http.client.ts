/**
 * @file apps/api/src/modules/market/feed/yahoo-finance-http.client.ts
 * @description Dedicated HTTP client service for querying real-time market data from Yahoo Finance API.
 * Implements intelligent request throttling, 429 exponential backoff, and modern browser headers.
 * @author yuva.devlab@gmail.com
 */

import { Injectable } from "@nestjs/common";
import { Logger } from "@yuva-devlab/logger";

export interface YahooChartMeta {
  readonly regularMarketPrice?: number;
  readonly chartPreviousClose?: number;
  readonly regularMarketDayHigh?: number;
  readonly regularMarketDayLow?: number;
  readonly regularMarketVolume?: number;
  readonly currency?: string;
  readonly fullExchangeName?: string;
  readonly instrumentType?: string;
  readonly shortName?: string;
  readonly symbol?: string;
}

export interface YahooChartResult {
  readonly meta?: YahooChartMeta;
  readonly indicators?: {
    readonly quote?: readonly [
      {
        readonly close?: readonly (number | null)[];
      },
    ];
  };
}

export interface YahooChartResponse {
  readonly chart?: {
    readonly result?: readonly YahooChartResult[];
    readonly error?: {
      readonly code: string;
      readonly description: string;
    };
  };
}

@Injectable()
export class YahooFinanceHttpClient {
  private readonly logger = new Logger(YahooFinanceHttpClient.name);
  private readonly baseUrl = "https://query2.finance.yahoo.com/v8/finance/chart";
  private readonly userAgent =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
  private readonly defaultTimeoutMs = 4500;
  private readonly minIntervalMs = 150;
  private lastRequestTime = 0;
  private rateLimitedUntil = 0;

  /**
   * Fetches real-time price and 1-day candle data for a given feed ticker.
   * Throttles requests to avoid upstream HTTP 429 rate limits.
   *
   * @param feedTicker - Normalized market symbol (e.g. "^NSEI", "RELIANCE.NS", "BTC-USD").
   * @param timeoutMs - Optional request timeout override.
   * @returns YahooChartResult record.
   */
  public async fetchChart(
    feedTicker: string,
    timeoutMs = this.defaultTimeoutMs,
  ): Promise<YahooChartResult> {
    const now = Date.now();
    if (now < this.rateLimitedUntil) {
      const waitRemainingSec = Math.ceil((this.rateLimitedUntil - now) / 1000);
      throw new Error(`Upstream feed rate-limited (cooling down for ${waitRemainingSec}s)`);
    }

    // Rate-limiting delay to prevent burst concurrency
    const waitMs = Math.max(0, this.lastRequestTime + this.minIntervalMs - now);
    if (waitMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
    this.lastRequestTime = Date.now();

    const encodedTicker = encodeURIComponent(feedTicker);
    const targetUrl = `${this.baseUrl}/${encodedTicker}?interval=1d&range=1d`;

    this.logger.debug(`[fetchChart] Requesting real-time quote for: ${feedTicker}`);

    try {
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent": this.userAgent,
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.9",
        },
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (response.status === 429) {
        this.rateLimitedUntil = Date.now() + 30_000;
        this.logger.warn(`[fetchChart] Upstream 429 Rate Limit hit. Backing off for 30 seconds.`);
        throw new Error("Market feed HTTP 429: Rate Limit Exceeded");
      }

      if (!response.ok) {
        this.logger.warn(
          `[fetchChart] Feed HTTP ${response.status} returned for ticker ${feedTicker}`,
        );
        throw new Error(`Market feed HTTP ${response.status}: ${response.statusText}`);
      }

      const payload = (await response.json()) as YahooChartResponse;
      const result = payload.chart?.result?.[0];

      if (!result || !result.meta || typeof result.meta.regularMarketPrice !== "number") {
        const errorDetail = payload.chart?.error?.description ?? "Missing price in feed response";
        this.logger.warn(
          `[fetchChart] Incomplete market payload for ${feedTicker}: ${errorDetail}`,
        );
        throw new Error(errorDetail);
      }

      return result;
    } catch (err) {
      if ((err as Error)?.name === "TimeoutError") {
        this.logger.warn(`[fetchChart] Request timed out for ticker ${feedTicker}`);
      }
      throw err;
    }
  }
}
