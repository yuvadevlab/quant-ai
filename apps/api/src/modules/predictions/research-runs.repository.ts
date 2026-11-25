/**
 * @file apps/api/src/modules/predictions/research-runs.repository.ts
 * @description Persistence helpers and public view for research-run records.
 */

import { ServiceUnavailableException } from "@nestjs/common";
import type { DatabaseService } from "../infrastructure/database.service";
import type { AnalysisFilterOptions } from "./predictions-analyzer";

/**
 * Public research-run fields returned by the prediction history endpoint.
 */
export interface ResearchRunSummary {
  readonly id: string;
  readonly ticker: string;
  readonly serviceMode: string;
  readonly timeHorizon: string;
  readonly result: string;
  readonly dataSource: string | null;
  readonly dataStatus: string;
  readonly observedAt: Date | null;
  readonly referencePrice: number | null;
  readonly createdAt: Date;
}

/**
 * Retrieves the latest research attempts without returning the stored JSON snapshot.
 */
export async function findRecentResearchRuns(
  databaseService?: DatabaseService,
): Promise<readonly ResearchRunSummary[]> {
  if (!databaseService) {
    throw new ServiceUnavailableException("Research history requires database persistence.");
  }

  return databaseService.client.researchRun.findMany({
    select: {
      id: true,
      ticker: true,
      serviceMode: true,
      timeHorizon: true,
      result: true,
      dataSource: true,
      dataStatus: true,
      observedAt: true,
      referencePrice: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

/**
 * Records a scan with no prediction and no available source snapshot.
 */
export async function recordNoPredictionRun(
  databaseService: DatabaseService,
  options?: AnalysisFilterOptions,
): Promise<void> {
  await databaseService.client.researchRun.create({
    data: {
      ticker: options?.symbols?.join(",") || "MARKET_SCAN",
      serviceMode: "SWING",
      timeHorizon: "SWING_WEEKS",
      result: "NO_PREDICTION",
      dataStatus: "UNAVAILABLE",
      snapshot: {
        reason: "The scan returned no prediction; no data snapshot was produced.",
      },
    },
  });
}
