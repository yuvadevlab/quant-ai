/**
 * @file packages/finance-engine/src/constants/system-config.constants.ts
 * @description Centralized keys and default envelopes for runtime system configurations.
 */

/**
 * System configuration registry keys stored in Prisma SystemConfig.
 */
export enum SystemConfigKey {
  MARKET_BREADTH = "market.breadth_config",
  SECTOR_MOMENTUM = "market.sector_config",
  RISK_LIMITS = "risk.limits_config",
  FEED_GATEWAY = "market.feed_gateway",
}

/**
 * Default market breadth configuration envelope.
 */
export interface MarketBreadthConfigEnvelope {
  readonly totalUniverseCount: number;
  readonly fiiNetCr: number;
  readonly diiNetCr: number;
  readonly fiiCurrencyPrefix: string;
  readonly fiiUnitSuffix: string;
  readonly vixLowThreshold: number;
  readonly vixHighThreshold: number;
  readonly bullishRegime: string;
  readonly cautiousRegime: string;
  readonly neutralRegime: string;
  readonly lowVolText: string;
  readonly elevatedVolText: string;
  readonly highVolText: string;
}

/**
 * Default sector momentum configuration envelope.
 */
export interface SectorMomentumConfigEnvelope {
  readonly strongThreshold: number;
  readonly moderateThreshold: number;
  readonly weakThreshold: number;
}
