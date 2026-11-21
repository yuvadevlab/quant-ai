/**
 * @fileoverview Database seeding script populating initial Indian benchmark indices and configurations.
 * @author yuva.devlab@gmail.com
 */

import { DefaultConnectionUrl, MARKET_INDEX_REGISTRY } from "@quant-ai/shared-types";
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

    await seedLlmProvidersAndModels(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

if (process.argv[1]?.endsWith("seed.js")) {
  void seedDatabase();
}
