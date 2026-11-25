/**
 * @fileoverview Persistence helpers for editable market-analysis configuration.
 */

import { Logger } from "@yuva-devlab/logger";
import { DatabaseService } from "../infrastructure/database.service";
import {
  DEFAULT_BREADTH_CONFIG,
  DEFAULT_SECTOR_CONFIG,
  type MarketBreadthConfig,
  type SectorMomentumConfig,
  SystemConfigKey,
} from "./market-config.types";

interface MarketConfigs {
  readonly breadth: MarketBreadthConfig;
  readonly sector: SectorMomentumConfig;
}

/**
 * Empty market-context response used until breadth and flow providers are configured.
 */
export const UNAVAILABLE_MARKET_BREADTH = {
  dataAvailable: false,
  advances: null,
  declines: null,
  unchanged: null,
  advanceRatio: null,
  fiiNet: null,
  diiNet: null,
  regime: "Unavailable",
  regimeType: "Unavailable",
  volatilityEnv: "Market breadth source unavailable",
} as const;

/**
 * Loads market thresholds while retaining safe defaults if configuration reads fail.
 *
 * @param databaseService - Optional database connection.
 * @param logger - Market module logger.
 * @returns Resolved market configuration.
 */
export async function loadMarketConfigs(
  databaseService: DatabaseService | undefined,
  logger: Logger,
): Promise<MarketConfigs> {
  let breadth = DEFAULT_BREADTH_CONFIG;
  let sector = DEFAULT_SECTOR_CONFIG;
  if (!databaseService) return { breadth, sector };

  try {
    const [breadthRecord, sectorRecord] = await Promise.all([
      databaseService.client.systemConfig.findUnique({
        where: { key: SystemConfigKey.MARKET_BREADTH },
      }),
      databaseService.client.systemConfig.findUnique({
        where: { key: SystemConfigKey.SECTOR_MOMENTUM },
      }),
    ]);
    if (breadthRecord?.value && typeof breadthRecord.value === "object") {
      breadth = { ...breadth, ...(breadthRecord.value as object) };
    }
    if (sectorRecord?.value && typeof sectorRecord.value === "object") {
      sector = { ...sector, ...(sectorRecord.value as object) };
    }
  } catch (error) {
    logger.warn(`[loadMarketConfigs] Could not load runtime configuration: ${String(error)}`);
  }

  return { breadth, sector };
}

/**
 * Persists one runtime market configuration record.
 *
 * @param databaseService - Optional database connection.
 * @param key - Canonical configuration key.
 * @param description - Human-readable setting description.
 * @param value - Configuration value to persist.
 */
export async function saveMarketConfig(
  databaseService: DatabaseService | undefined,
  key: SystemConfigKey,
  description: string,
  value: object,
): Promise<void> {
  if (!databaseService) return;
  await databaseService.client.systemConfig.upsert({
    where: { key },
    update: { value },
    create: { key, description, value },
  });
}
