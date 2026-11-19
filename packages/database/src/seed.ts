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
} from "@quant-ai/contracts";
import { createPrismaClient } from "./client.js";

const DEFAULT_BASE_PRICES: Record<string, number> = {
  "NIFTY 50": 24350.25,
  "NIFTY NEXT 50": 71200.8,
  "NIFTY 100": 25100.4,
  "NIFTY MIDCAP 100": 58450.6,
  "NIFTY SMALLCAP 100": 18920.3,
  "NIFTY 500": 22800.1,
  "NIFTY BANK": 52180.4,
  "NIFTY FINANCIAL SERVICES": 23410.9,
  "NIFTY IT": 41890.3,
  "NIFTY AUTO": 25680.1,
  "NIFTY METAL": 9450.7,
  "NIFTY PHARMA": 22340.5,
  "NIFTY FMCG": 61200.4,
  "NIFTY ENERGY": 39820.6,
  "NIFTY REALTY": 1050.25,
  "INDIA VIX": 13.85,
};

/**
 * Executes database seed transaction.
 */
export async function seedDatabase(
  databaseUrl: string = DefaultConnectionUrl.DATABASE,
): Promise<void> {
  const prisma = createPrismaClient(databaseUrl);

  try {
    for (const [symbol, meta] of Object.entries(MARKET_INDEX_REGISTRY)) {
      const basePrice = DEFAULT_BASE_PRICES[symbol] ?? 10000;
      await prisma.benchmarkIndex.upsert({
        where: { symbol },
        update: {
          currentPrice: basePrice,
          dayHigh: basePrice * 1.01,
          dayLow: basePrice * 0.99,
          percentChange: 0.5,
          change: basePrice * 0.005,
        },
        create: {
          symbol,
          name: meta.displayName,
          category: meta.category,
          exchange: "NSE",
          currentPrice: basePrice,
          change: basePrice * 0.005,
          percentChange: 0.5,
          dayHigh: basePrice * 1.01,
          dayLow: basePrice * 0.99,
          sparkline: [basePrice * 0.99, basePrice * 0.995, basePrice],
        },
      });
    }

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
  } finally {
    await prisma.$disconnect();
  }
}

if (process.argv[1]?.endsWith("seed.js")) {
  void seedDatabase();
}
