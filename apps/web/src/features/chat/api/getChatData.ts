/**
 * @file src/features/chat/api/getChatData.ts
 * @description Data provider for the AI Financial Copilot desk.
 */

import type { Signal as BackendSignal } from "@quant-ai/shared-types";
import { apiFetch } from "@/lib/api-fetcher";
import { mapBackendSignalToUi } from "@/features/predictions/api/getPredictionsData";
import type { Signal } from "@/components/quantai/data";

export interface ChatInitialData {
  readonly featuredSignal?: Signal | undefined;
  readonly suggestions: readonly string[];
}

/**
 * Fetches initial session context and prompt recommendations for AI Copilot.
 *
 * @returns ChatInitialData payload
 */
export async function getChatData(): Promise<ChatInitialData> {
  const rawSignals = await apiFetch<BackendSignal[]>("/api/predictions");
  const featuredSignal =
    rawSignals && rawSignals.length > 0 ? mapBackendSignalToUi(rawSignals[0]!) : undefined;

  return {
    featuredSignal,
    suggestions: [
      "Scan benchmark expiry momentum and gamma levels",
      "Explain multi-agent risk guardian consensus",
      "Audit active prediction conviction ratings",
      "Analyze automated invalidation and trailing stop triggers",
    ],
  };
}
