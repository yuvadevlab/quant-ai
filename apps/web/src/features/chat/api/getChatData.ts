/**
 * @file src/features/chat/api/getChatData.ts
 * @description Data provider for the AI Financial Copilot desk.
 */

import { signals, type Signal } from "@/components/quantai/data";

export interface ChatInitialData {
  readonly featuredSignal: Signal;
  readonly suggestions: readonly string[];
}

/**
 * Fetches initial session context and prompt recommendations for AI Copilot.
 *
 * @returns ChatInitialData payload
 */
export async function getChatData(): Promise<ChatInitialData> {
  return {
    featuredSignal: signals[0]!,
    suggestions: [
      "Scan Nifty 50 expiry momentum",
      "BankNifty 51,200 CE options structure",
      "Analyze Reliance 15m breakout",
      "Explain automated invalidation rules",
    ],
  };
}
