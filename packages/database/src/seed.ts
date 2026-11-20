/**
 * @fileoverview Database seeding script populating initial Indian benchmark indices and predictions.
 * @author yuva.devlab@gmail.com
 */

import {
  DefaultConnectionUrl,
  MARKET_INDEX_REGISTRY,
  SignalDirection,
  SignalRegime,
  SignalStatus,
} from "@quant-ai/shared-types";
import { createPrismaClient } from "./client.js";
import { seedLlmProvidersAndModels } from "./seed-llm.js";

/**
 * Executes database seed transaction.
 */
export async function seedDatabase(
  databaseUrl: string = DefaultConnectionUrl.DATABASE,
): Promise<void> {
  const prisma = createPrismaClient(databaseUrl);

  try {
    for (const [symbol, meta] of Object.entries(MARKET_INDEX_REGISTRY)) {
      await prisma.benchmarkIndex.upsert({
        where: { symbol },
        update: {
          name: meta.displayName,
          category: meta.category,
          exchange: "NSE",
        },
        create: {
          symbol,
          name: meta.displayName,
          category: meta.category,
          exchange: "NSE",
          currentPrice: 0,
          change: 0,
          percentChange: 0,
          dayHigh: 0,
          dayLow: 0,
          sparkline: [],
        },
      });
    }

    await prisma.systemConfig.upsert({
      where: { key: "market.breadth_config" },
      update: {},
      create: {
        key: "market.breadth_config",
        description:
          "Configurable market breadth ratios, institutional flows, and regime thresholds",
        value: {
          totalUniverseCount: 2214,
          fiiNetCr: 2145.0,
          diiNetCr: 1280.0,
          fiiCurrencyPrefix: "₹",
          fiiUnitSuffix: "Cr",
          vixLowThreshold: 15.0,
          vixHighThreshold: 22.0,
          bullishRegime: "Institutional Accumulation",
          cautiousRegime: "Distribution & Profit Taking",
          neutralRegime: "Consolidation & Rangebound",
          lowVolText: "Low Volatility",
          elevatedVolText: "Elevated Volatility",
          highVolText: "Extreme Volatility",
        },
      },
    });

    await prisma.systemConfig.upsert({
      where: { key: "market.sector_config" },
      update: {},
      create: {
        key: "market.sector_config",
        description: "Configurable sector momentum classification percentage thresholds",
        value: {
          strongThreshold: 1.5,
          moderateThreshold: 0.5,
          weakThreshold: -1.0,
        },
      },
    });

    const predictionId = "PRED-8942";
    await prisma.prediction.upsert({
      where: { id: predictionId },
      update: {},
      create: {
        id: predictionId,
        ticker: "RELIANCE",
        name: "Reliance Industries Ltd",
        direction: SignalDirection.LONG,
        status: SignalStatus.ACTIVE,
        entry: 2985,
        target: 3120,
        stopLoss: 2920,
        currentPrice: 2992.5,
        confidence: 84.5,
        riskReward: 2.08,
        timeHorizon: "1W",
        regime: SignalRegime.BULLISH_EXPANSION,
        summary: "High conviction breakout above 20-day resistance on 2.4x institutional volume.",
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        verdicts: {
          create: [
            {
              agentRole: "Momentum Hunter",
              stance: "Bullish",
              confidence: 91,
              reasoning: "Consolidation breakout on heavy volume with rising RSI.",
            },
            {
              agentRole: "Risk Skeptic",
              stance: "Neutral",
              confidence: 68,
              reasoning: "Tight stop loss required due to approaching weekly supply band.",
            },
          ],
        },
        trajectory: {
          create: [
            {
              step: 0,
              expected: 2985,
              upperP95: 2985,
              upperP75: 2985,
              lowerP25: 2985,
              lowerP05: 2985,
            },
            {
              step: 5,
              expected: 3045,
              upperP95: 3110,
              upperP75: 3080,
              lowerP25: 3010,
              lowerP05: 2960,
            },
          ],
        },
      },
    });

    await seedLlmProvidersAndModels(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

if (process.argv[1]?.endsWith("seed.js")) {
  void seedDatabase();
}
