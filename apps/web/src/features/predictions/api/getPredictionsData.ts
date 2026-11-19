/**
 * @file src/features/predictions/api/getPredictionsData.ts
 * @description Data provider for the Prediction Lab & Signal Audit Ledger.
 */

import { queryOptions } from "@tanstack/react-query";
import { signals, UiSignalStatus, type Signal } from "@/components/quantai/data";

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
  const activeCount = signals.filter((s) => s.status === UiSignalStatus.ACTIVE).length;

  return {
    signals,
    totalGenerated: signals.length,
    activeCount,
    winRate: "78.4%",
    profitFactor: "2.41",
    riskReward: "1 : 2.65",
  };
}

/**
 * Canonical TanStack Query options for prediction ledger queries.
 */
export const predictionsQueryOptions = () =>
  queryOptions({
    queryKey: ["predictions-ledger"],
    queryFn: () => getPredictionsData(),
    staleTime: 1000 * 30,
  });
