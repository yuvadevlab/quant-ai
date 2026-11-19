/**
 * @fileoverview Type definitions for WebSocket payloads and events.
 * @author yuva.devlab@gmail.com
 */

import type { RealtimeRoom } from "./realtime.enums";
import type { MarketIndex, SignalRegime } from "@quant-ai/contracts";

/**
 * Client channel subscription payload.
 */
export interface ClientSubscriptionPayload {
  readonly room: RealtimeRoom;
  readonly symbol?: string;
}

/**
 * Real-time index tick broadcast payload.
 */
export interface RealtimeTickPayload {
  readonly symbol: MarketIndex | string;
  readonly price: number;
  readonly change: number;
  readonly percentChange: number;
  readonly timestamp: string;
}

/**
 * Real-time regime transition broadcast payload.
 */
export interface RealtimeRegimePayload {
  readonly symbol: MarketIndex | string;
  readonly currentRegime: SignalRegime;
  readonly previousRegime: SignalRegime;
  readonly confidence: number;
  readonly timestamp: string;
}

/**
 * Real-time multi-agent speech/verdict broadcast payload.
 */
export interface RealtimeAgentSpeechPayload {
  readonly predictionId: string;
  readonly agentName: string;
  readonly stance: string;
  readonly reasoning: string;
  readonly confidence: number;
  readonly timestamp: string;
}
