/**
 * @file apps/api/src/modules/predictions/predictions-hydrator.ts
 * @description Dynamic database-backed opportunity discovery and multi-strategy ledger hydration.
 */

import { Logger } from "@yuva-devlab/logger";
import {
  AssetClass,
  MarketDataStatus,
  Signal,
  SignalDirection,
  SignalRegime,
  SignalStatus,
  TradeHorizon,
  TradeStrategy,
} from "@quant-ai/shared-types";
import {
  calculateReturnPercent,
  calculateRiskRewardRatio,
  calculateUnrealizedPnl,
  TradePositionSide,
} from "@quant-ai/quant-core";
import { DatabaseService } from "../infrastructure/database.service";
import { isUsableMarketDataStatus, LiveMarketFeedService } from "../market/feed";

/**
 * Hydrates multi-strategy predictions dynamically from database records using real-time market prices.
 */
export async function hydratePredictionsFromDatabase(
  databaseService: DatabaseService | undefined,
  liveMarketFeed: LiveMarketFeedService,
  logger: Logger,
): Promise<Map<string, Signal>> {
  const result = new Map<string, Signal>();
  if (!databaseService) {
    return result;
  }

  try {
    const records = await databaseService.client.prediction.findMany({
      include: {
        verdicts: true,
        trajectory: {
          orderBy: { step: "asc" },
        },
      },
    });

    for (const record of records) {
      try {
        const live = await liveMarketFeed.getLiveQuote(record.ticker);
        const current = isUsableMarketDataStatus(live.dataStatus)
          ? live.price
          : record.currentPrice;
        const side =
          record.direction === "SHORT" ? TradePositionSide.SHORT : TradePositionSide.LONG;

        const pnlAbsolute = calculateUnrealizedPnl(record.entry, current, 1, side);
        const pnlPercent = calculateReturnPercent(record.entry, current, side);
        const riskReward = calculateRiskRewardRatio(record.entry, record.target, record.stopLoss);

        result.set(record.id, {
          id: record.id,
          ticker: record.ticker,
          name: record.name,
          strategy: Object.values(TradeStrategy).includes(record.strategy as TradeStrategy)
            ? (record.strategy as TradeStrategy)
            : TradeStrategy.SWING,
          assetClass: Object.values(AssetClass).includes(record.assetClass as AssetClass)
            ? (record.assetClass as AssetClass)
            : AssetClass.EQUITY,
          direction: record.direction === "SHORT" ? SignalDirection.SHORT : SignalDirection.LONG,
          entry: record.entry,
          current,
          target: record.target,
          stopLoss: record.stopLoss,
          horizon: TradeHorizon.SWING_WEEKS,
          confidence: record.confidence,
          status: record.status as SignalStatus,
          regime: record.regime as SignalRegime,
          pnlPercent,
          pnlAbsolute,
          maxExcursion: Math.max(0, pnlPercent),
          maxAdverse: Math.min(0, pnlPercent),
          publishedAt: record.createdAt.toISOString(),
          thesis: record.summary,
          riskReward,
          catalysts: [],
          invalidation: `Close below stop-loss level of ${record.stopLoss} invalidates thesis.`,
          trajectory: record.trajectory.map((t) => ({
            time: `T${t.step}`,
            expected: t.expected,
            actual: current,
            upper: t.upperP95,
            lower: t.lowerP05,
          })),
          agents: record.verdicts.map((v) => ({
            role: v.agentRole as never,
            stance: v.stance as never,
            confidence: v.confidence,
            summary: v.reasoning,
          })),
          dataSource: record.dataSource ?? undefined,
          dataStatus: Object.values(MarketDataStatus).includes(
            record.dataStatus as MarketDataStatus,
          )
            ? (record.dataStatus as MarketDataStatus)
            : MarketDataStatus.UNAVAILABLE,
          observedAt: record.observedAt?.toISOString(),
          outcomePrice: record.outcomePrice ?? undefined,
          outcomeAt: record.outcomeAt?.toISOString(),
          metricEligible: record.metricEligible,
        });
      } catch (err) {
        logger.warn(
          `[hydratePredictionsFromDatabase] Failed fetching live mark for ${record.ticker}: ${String(err)}`,
        );
      }
    }
  } catch (err) {
    logger.warn(
      `[hydratePredictionsFromDatabase] Could not load predictions from database: ${String(err)}`,
    );
  }

  return result;
}
