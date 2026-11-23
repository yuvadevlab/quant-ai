/**
 * @file apps/api/src/modules/chat/chat-prediction-bridge.ts
 * @description Bridges AI Copilot chat inquiries with real-time Prediction Lab registrations and revisions.
 * @author yuva.devlab@gmail.com
 */

import { Logger } from "@yuva-devlab/logger";
import { Signal, SignalStatus } from "@quant-ai/shared-types";
import type { PredictionsService } from "../predictions/predictions.service";
import type { EmbeddedSignalSetup } from "./chat.types";

/**
 * Maps an internal Signal domain entity into a UI-ready EmbeddedSignalSetup presentation item.
 */
export function mapSignalToEmbeddedSetup(signal: Signal): EmbeddedSignalSetup {
  const dirLabel = signal.direction === "SHORT" ? "SELL" : "BUY";
  const statusLabel =
    signal.status === SignalStatus.ACTIVE
      ? "Active"
      : signal.status === SignalStatus.TARGET_HIT
        ? "Target hit"
        : signal.status === SignalStatus.INVALIDATED
          ? "Stop loss hit"
          : "Expired";

  const target2 = Number((signal.entry + (signal.target - signal.entry) * 1.5).toFixed(2));

  return {
    id: signal.id,
    symbol: signal.ticker,
    instrument: `${signal.ticker} · NSE Equity`,
    companyName: signal.name,
    direction: dirLabel,
    horizon: typeof signal.horizon === "string" ? signal.horizon : "Swing · 1-2W",
    entry: `₹${signal.entry.toLocaleString("en-IN")}`,
    target1: `₹${signal.target.toLocaleString("en-IN")}`,
    target2: `₹${target2.toLocaleString("en-IN")}`,
    stop: `₹${signal.stopLoss.toLocaleString("en-IN")}`,
    last: `₹${signal.current.toLocaleString("en-IN")}`,
    status: statusLabel,
    mfe: `+${(signal.maxExcursion ?? 0).toFixed(1)}%`,
    mae: `-${Math.abs(signal.maxAdverse ?? 0).toFixed(1)}%`,
    time: "Just now",
    confidence: `${signal.confidence}%`,
    catalysts: signal.catalysts,
  };
}

/**
 * Handles on-demand prediction generation or revision from chat prompts.
 */
export async function resolvePredictionForChat(
  predictionsService: PredictionsService | undefined,
  symbol: string,
  userPrompt: string,
  logger: Logger,
): Promise<{ signal: Signal | null; isRevision: boolean; priorId?: string }> {
  if (!predictionsService) {
    return { signal: null, isRevision: false };
  }

  const promptLower = userPrompt.toLowerCase();
  const isNewsOrReversal =
    promptLower.includes("news") ||
    promptLower.includes("reversal") ||
    promptLower.includes("invalid") ||
    promptLower.includes("break") ||
    promptLower.includes("cut");

  const existingActive = predictionsService.findActiveBySymbol(symbol);
  let priorId: string | undefined;

  if (existingActive) {
    if (isNewsOrReversal) {
      priorId = existingActive.id;
      logger.info(
        `[resolvePredictionForChat] Re-evaluating prior active signal ${priorId} for ${symbol} due to updated news/catalyst prompt`,
      );
      await predictionsService.invalidateSignal(
        priorId,
        `Unexpected catalyst/news revision requested in Copilot dialogue: "${userPrompt.slice(0, 40)}"`,
      );
    } else {
      // Prior prediction is still valid and active; return existing setup with current price mark
      return { signal: existingActive, isRevision: false };
    }
  }

  try {
    const newSignal = await predictionsService.registerOrUpdateSignalForSymbol(
      symbol,
      isNewsOrReversal ? `Superceded by Copilot re-evaluation` : undefined,
    );
    return { signal: newSignal, isRevision: !!priorId, priorId };
  } catch (err) {
    logger.warn(
      `[resolvePredictionForChat] Failed generating prediction for ${symbol}: ${String(err)}`,
    );
    return { signal: null, isRevision: false };
  }
}
