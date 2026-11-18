/**
 * @fileoverview Signal and prediction data transfer contracts. */

import { z } from "zod";
import { SignalDirection, SignalRegime, SignalStatus } from "./enums";

/**
 * Trajectory point representing price over time.
 */
export interface TrajectoryPoint {
  readonly time: string;
  readonly expected: number;
  readonly actual?: number;
  readonly upper: number;
  readonly lower: number;
}

/**
 * Specialized agent deliberation breakdown.
 */
export interface AgentDeliberation {
  readonly role: string;
  readonly stance: "BULLISH" | "BEARISH" | "NEUTRAL";
  readonly confidence: number;
  readonly summary: string;
}

/**
 * First-class market prediction record.
 */
export interface Signal {
  readonly id: string;
  readonly ticker: string;
  readonly name: string;
  readonly direction: SignalDirection;
  readonly entry: number;
  readonly current: number;
  readonly target: number;
  readonly stopLoss: number;
  readonly horizon: string;
  readonly confidence: number;
  readonly status: SignalStatus;
  readonly regime: SignalRegime;
  readonly pnlPercent: number;
  readonly pnlAbsolute: number;
  readonly maxExcursion: number;
  readonly maxAdverse: number;
  readonly publishedAt: string;
  readonly thesis: string;
  readonly riskReward: number;
  readonly catalysts: readonly string[];
  readonly invalidation: string;
  readonly trajectory: readonly TrajectoryPoint[];
  readonly agents: readonly AgentDeliberation[];
}

/**
 * Zod schema for runtime validation of incoming prediction payloads.
 */
export const SignalSchema = z.object({
  id: z.string(),
  ticker: z.string(),
  name: z.string(),
  direction: z.nativeEnum(SignalDirection),
  entry: z.number().positive(),
  current: z.number().positive(),
  target: z.number().positive(),
  stopLoss: z.number().positive(),
  horizon: z.string(),
  confidence: z.number().min(0).max(100),
  status: z.nativeEnum(SignalStatus),
  regime: z.nativeEnum(SignalRegime),
  pnlPercent: z.number(),
  pnlAbsolute: z.number(),
  maxExcursion: z.number(),
  maxAdverse: z.number(),
  publishedAt: z.string(),
  thesis: z.string(),
  riskReward: z.number().positive(),
  catalysts: z.array(z.string()),
  invalidation: z.string(),
});
