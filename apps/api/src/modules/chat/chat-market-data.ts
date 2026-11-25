/**
 * @fileoverview Provider-backed quote resolution for Copilot market analysis.
 */

import { Logger } from "@yuva-devlab/logger";
import {
  isUsableMarketDataStatus,
  LiveMarketFeedService,
  type LiveMarketQuote,
} from "../market/feed";

/**
 * Resolves a quote suitable for current-market Copilot analysis.
 *
 * @param feed - Market feed service.
 * @param symbol - Requested market symbol.
 * @param logger - Chat service logger.
 * @returns A usable provider-backed quote, or undefined when unavailable.
 */
export async function fetchUsableChatQuote(
  feed: LiveMarketFeedService,
  symbol: string,
  logger: Logger,
): Promise<LiveMarketQuote | undefined> {
  try {
    const quote = await feed.getLiveQuote(symbol);
    if (!isUsableMarketDataStatus(quote.dataStatus)) {
      logger.warn(`[handleUserMessage] Skipping ${symbol}: quote status is ${quote.dataStatus}`);
      return undefined;
    }
    return quote;
  } catch (error) {
    logger.debug(`[handleUserMessage] Quote resolve failed for ${symbol}: ${String(error)}`);
    return undefined;
  }
}
