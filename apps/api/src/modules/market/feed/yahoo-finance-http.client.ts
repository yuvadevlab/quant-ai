/**
 * @file apps/api/src/modules/market/feed/yahoo-finance-http.client.ts
 * @description Dedicated HTTP client service for querying real-time market data from Yahoo Finance API.
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

/**
 * Dedicated HTTP client encapsulating external market feed requests.
 */
@Injectable()
export class YahooFinanceHttpClient {
  private readonly logger = new Logger(YahooFinanceHttpClient.name);
  private readonly baseUrl = "https://query2.finance.yahoo.com/v8/finance/chart";
  private readonly userAgent = "QuantAI-Workstation/2.0";
  private readonly defaultTimeoutMs = 3500;

  /**
   * Fetches real-time price and 1-day candle data for a given feed ticker.
   *
   * @param feedTicker - Normalized market symbol (e.g. "^NSEI", "RELIANCE.NS", "BTC-USD").
   * @param timeoutMs - Optional request timeout override.
   * @returns YahooChartResult record.
   */
  public async fetchChart(
    feedTicker: string,
    timeoutMs = this.defaultTimeoutMs,
  ): Promise<YahooChartResult> {
    const encodedTicker = encodeURIComponent(feedTicker);
    const targetUrl = `${this.baseUrl}/${encodedTicker}?interval=1d&range=1d`;

    this.logger.debug(`[fetchChart] Requesting real-time quote for: ${feedTicker}`);

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": this.userAgent,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(timeoutMs),
    });

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
      this.logger.warn(`[fetchChart] Incomplete market payload for ${feedTicker}: ${errorDetail}`);
      throw new Error(errorDetail);
    }

    return result;
  }
}
