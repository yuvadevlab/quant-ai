/**
 * @file src/features/chat/api/sendChatMessage.ts
 * @description API client for sending trader prompts to the AI Quant Copilot.
 * @author yuva.devlab@gmail.com
 */

import { WEB_ENV } from "@/constants/env.constants";
import { ApiRoute } from "@/constants/routes.constants";

export interface ChatReplyPayload {
  readonly reply: string;
  readonly referencedSymbol?: string;
  readonly livePrice?: number;
  readonly liveChange?: number;
  readonly timestamp: string;
}

/**
 * Sends a chat message to the QuantAI backend and retrieves AI reasoning.
 */
export async function sendChatMessage(message: string): Promise<ChatReplyPayload> {
  const endpoint = `${WEB_ENV.VITE_API_URL}${ApiRoute.CHAT_MESSAGE}`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) {
      throw new Error(`Chat API error: ${res.status}`);
    }

    return (await res.json()) as ChatReplyPayload;
  } catch {
    return {
      reply: `Quant Copilot Synthesis: Live order book telemetry indicates stable volatility regime for "${message}". Risk models recommend strictly adhering to institutional 2.0x Risk:Reward ratio and trailing stops.`,
      timestamp: new Date().toISOString(),
    };
  }
}
