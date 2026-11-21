/**
 * @file src/features/monitor/api/triggerDeliberation.ts
 * @description API client for triggering on-demand institutional multi-agent adversarial deliberation.
 * @author yuva.devlab@gmail.com
 */

import { WEB_ENV } from "@/constants/env.constants";
import { ApiRoute } from "@/constants/routes.constants";

/**
 * Parameters for triggering an on-demand deliberation session.
 */
export interface TriggerDeliberationParams {
  readonly predictionId: string;
  readonly ticker: string;
  readonly currentPrice?: number;
  readonly targetPrice?: number;
  readonly stopLossPrice?: number;
}

/**
 * Dispatches an on-demand deliberation request to the QuantAI backend engine.
 * The backend computes agent stances and streams real-time speech tokens via WebSocket.
 *
 * @param params Setup parameters for the prediction debate
 * @returns True if successfully dispatched, false otherwise
 */
export async function triggerDeliberation(params: TriggerDeliberationParams): Promise<boolean> {
  const endpoint = `${WEB_ENV.VITE_API_URL}${ApiRoute.DELIBERATION_TRIGGER}`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      signal: AbortSignal.timeout(10000),
    });

    return res.ok;
  } catch {
    return false;
  }
}
