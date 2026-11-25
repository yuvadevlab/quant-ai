/**
 * @file apps/api/src/modules/predictions/predictions-analyzer.ts
 * @description Real-time quantitative opportunity scanner generating genuine predictions from live market data.
 * Zero hardcoded tickers: dynamically pulls tradable universe from PostgreSQL screener_stocks SSOT.
 * @author yuva.devlab@gmail.com
 */

import { Logger } from "@yuva-devlab/logger";
import { AssetClass, Signal, SignalDirection } from "@quant-ai/shared-types";
import {
  calculateRiskRewardRatio,
  calculateRsiFromSparkline,
  TradePositionSide,
} from "@quant-ai/quant-core";
import { DatabaseService } from "../infrastructure/database.service";
import { LiveMarketFeedService } from "../market/feed";
import { buildSignal, persistPredictionToDb } from "./predictions-factory";

export interface AnalysisFilterOptions {
  readonly sector?: string;
  readonly symbols?: readonly string[];
  readonly limit?: number;
}

interface TargetInstrument {
  readonly symbol: string;
  readonly name: string;
  readonly sector?: string;
  readonly assetClass: AssetClass;
}

/**
 * Resolves the dynamic stock universe from request parameters or PostgreSQL SSOT.
 * Zero hardcoded equities — purely on-demand and database-driven.
 */
async function resolveDynamicUniverse(
  databaseService: DatabaseService | undefined,
  options?: AnalysisFilterOptions,
  logger?: Logger,
): Promise<readonly TargetInstrument[]> {
  if (options?.symbols && options.symbols.length > 0) {
    return options.symbols.map((s) => ({
      symbol: s.toUpperCase().trim(),
      name: s.toUpperCase().trim(),
      sector: "Equity",
      assetClass: AssetClass.EQUITY,
    }));
  }

  if (databaseService) {
    try {
      const dbStocks = await databaseService.client.screenerStock.findMany({
        where: {
          ...(options?.sector ? { sector: { equals: options.sector, mode: "insensitive" } } : {}),
        },
        take: options?.limit ?? 25,
      });

      if (dbStocks.length > 0) {
        return dbStocks.map((s) => ({
          symbol: s.symbol,
          name: s.company,
          sector: s.sector,
          assetClass: AssetClass.EQUITY,
        }));
      }
    } catch (err) {
      logger?.warn(`[resolveDynamicUniverse] Database query error: ${String(err)}`);
    }
  }

  return [];
}

/**
 * Scans active market universe, executes technical & risk modeling, and records real predictions.
 */
export async function executeRealMarketAnalysis(
  databaseService: DatabaseService | undefined,
  liveMarketFeed: LiveMarketFeedService,
  logger: Logger,
  options?: AnalysisFilterOptions,
): Promise<readonly Signal[]> {
  const generatedSignals: Signal[] = [];
  const universe = await resolveDynamicUniverse(databaseService, options, logger);

  logger.info(
    `[executeRealMarketAnalysis] Scanning ${universe.length} dynamic instruments from database SSOT...`,
  );

  for (const item of universe) {
    try {
      const quote = await liveMarketFeed.getLiveQuote(item.symbol);
      const current = quote.price;
      const rsi = calculateRsiFromSparkline(quote.sparkline);
      const dayRange = Math.abs(quote.dayHigh - quote.dayLow);
      const atr = Math.max(dayRange, Number((current * 0.015).toFixed(2)));

      const isBullish = quote.percentChange >= 0;
      const direction = isBullish ? SignalDirection.LONG : SignalDirection.SHORT;
      const side = isBullish ? TradePositionSide.LONG : TradePositionSide.SHORT;

      const isExplicitTarget = Boolean(options?.symbols && options.symbols.length > 0);
      const hasQuantEdge =
        isExplicitTarget ||
        (isBullish && rsi >= 50 && quote.percentChange > 0.02) ||
        (!isBullish && rsi <= 50 && quote.percentChange < -0.02) ||
        Math.abs(quote.percentChange) >= 0.4;

      if (!hasQuantEdge) continue;

      const targetMultiplier = 1.8;
      const stopMultiplier = 1.0;
      const target = isBullish
        ? Number((current + atr * targetMultiplier).toFixed(2))
        : Number((current - atr * targetMultiplier).toFixed(2));
      const stopLoss = isBullish
        ? Number((current - atr * stopMultiplier).toFixed(2))
        : Number((current + atr * stopMultiplier).toFixed(2));

      const riskReward = calculateRiskRewardRatio(current, target, stopLoss);
      if (riskReward < 1.5) continue;

      const confidence = isBullish
        ? Math.min(
            94,
            Math.max(68, Math.round(55 + (rsi - 50) * 0.6 + Math.abs(quote.percentChange) * 4)),
          )
        : Math.min(
            94,
            Math.max(68, Math.round(55 + (50 - rsi) * 0.6 + Math.abs(quote.percentChange) * 4)),
          );

      const signal = buildSignal({
        symbol: item.symbol,
        name: item.name,
        assetClass: item.assetClass,
        current,
        target,
        stopLoss,
        riskReward,
        atr,
        rsi,
        percentChange: quote.percentChange,
        isBullish,
        direction,
        side,
        confidence,
      });

      await persistPredictionToDb(databaseService, signal, logger);
      generatedSignals.push(signal);
    } catch (err) {
      logger.warn(`[executeRealMarketAnalysis] Skipped ${item.symbol} analysis: ${String(err)}`);
    }
  }

  logger.info(
    `[executeRealMarketAnalysis] Completed live scan: Generated ${generatedSignals.length} genuine predictions.`,
  );
  return generatedSignals;
}
