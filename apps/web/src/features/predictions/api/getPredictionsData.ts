/**
 * @file src/features/predictions/api/getPredictionsData.ts
 * @description Data provider for the Prediction Lab & Signal Audit Ledger.
 */

import { signals, type Signal } from "@/components/quantai/data";

export interface PredictionsData {
  readonly signals: readonly Signal[];
  readonly totalGenerated: number;
  readonly activeCount: number;
  readonly winRate: string;
  readonly profitFactor: string;
  readonly riskReward: string;
}

/**
 * Fetches prediction ledger data for server-side rendering and client usage.
 *
 * @returns PredictionsData payload
 */
export async function getPredictionsData(): Promise<PredictionsData> {
  const activeCount = signals.filter((s) => s.status === "Active").length;

  return {
    signals,
    totalGenerated: signals.length,
    activeCount,
    winRate: "78.4%",
    profitFactor: "2.41",
    riskReward: "1 : 2.65",
  };
}
