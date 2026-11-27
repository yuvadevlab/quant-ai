/**
 * @file packages/ui/src/components/ai-research-generator.ts
 * @description Compatibility helper for displaying recorded prediction rationale.
 */

import { UI_COPY_CONSTANTS } from "../constants/ui-copy.constants";
import type { TableSignalItem } from "../types";

/**
 * Returns a recorded rationale without synthesizing unsupported research claims.
 */
export function generateDynamicAiResearchRationale(signal: TableSignalItem): string {
  return signal.rationale?.trim() || UI_COPY_CONSTANTS.RECOMMENDATION_CARD.RATIONALE_UNAVAILABLE;
}
