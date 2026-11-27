/**
 * @file apps/api/src/modules/predictions/predictions-lifecycle.ts
 * @description Prediction invalidation lifecycle persistence and notification.
 */

import { Logger } from "@yuva-devlab/logger";
import { Signal, SignalStatus } from "@quant-ai/shared-types";
import { DatabaseService } from "../infrastructure/database.service";
import { RealtimeService } from "../realtime/realtime.service";

/**
 * Marks a signal invalid and persists/emits its lifecycle update.
 */
export async function invalidatePrediction(
  predictions: Map<string, Signal>,
  id: string,
  reason: string | undefined,
  databaseService: DatabaseService | undefined,
  realtimeService: RealtimeService | undefined,
  logger: Logger,
): Promise<boolean> {
  const signal = predictions.get(id);
  if (!signal) return false;

  const updated: Signal = {
    ...signal,
    status: SignalStatus.INVALIDATED,
    thesis: reason ? `${signal.thesis} [Invalidated: ${reason}]` : signal.thesis,
  };
  predictions.set(id, updated);

  if (databaseService) {
    try {
      await databaseService.client.prediction.update({
        where: { id },
        data: { status: SignalStatus.INVALIDATED },
      });
    } catch (error) {
      logger.warn(`[invalidateSignal] DB update failed for ${id}: ${String(error)}`);
    }
  }

  realtimeService?.emitSignalUpdate({
    id,
    ticker: signal.ticker,
    currentPrice: signal.current,
    pnlPercent: signal.pnlPercent ?? 0,
    status: SignalStatus.INVALIDATED,
  });
  logger.info(
    `[invalidateSignal] Marked prediction ${id} as INVALIDATED (${reason ?? "thesis break"})`,
  );
  return true;
}
