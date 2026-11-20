/**
 * @file packages/finance-engine/src/calculations/sector.calculation.ts
 * @description Sector momentum strength classification based on benchmark percentage performance.
 * @author yuva.devlab@gmail.com
 */

import { SectorMomentumConfigEnvelope } from "../constants/system-config.constants";

export type MomentumClassification = "Strong" | "Moderate" | "Neutral" | "Weak";

export interface SectorItemInput {
  readonly symbol: string;
  readonly changePercent: number;
}

export interface SectorPerformanceOutput {
  readonly name: string;
  readonly change: string;
  readonly positive: boolean;
  readonly momentum: MomentumClassification;
}

/**
 * Classifies a sectoral benchmark's momentum using configurable thresholds.
 */
export function classifySectorMomentum(
  percentChange: number,
  config: SectorMomentumConfigEnvelope,
): MomentumClassification {
  if (percentChange >= config.strongThreshold) {
    return "Strong";
  }
  if (percentChange >= config.moderateThreshold) {
    return "Moderate";
  }
  if (percentChange <= config.weakThreshold) {
    return "Weak";
  }
  return "Neutral";
}

/**
 * Maps a list of sectoral benchmarks into sector performance cards.
 */
export function calculateSectorPerformanceList(
  sectors: readonly SectorItemInput[],
  config: SectorMomentumConfigEnvelope,
): readonly SectorPerformanceOutput[] {
  return sectors.map((sector) => {
    const momentum = classifySectorMomentum(sector.changePercent, config);
    return {
      name: sector.symbol,
      change: `${sector.changePercent >= 0 ? "+" : ""}${sector.changePercent.toFixed(2)}%`,
      positive: sector.changePercent >= 0,
      momentum,
    };
  });
}
