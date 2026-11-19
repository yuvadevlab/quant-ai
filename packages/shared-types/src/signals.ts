/**
 * @fileoverview Signal and prediction data transfer contracts.
 * @author yuva.devlab@gmail.com
 */

import { z } from "zod";
import { AgentRole, AgentStance } from "./deliberation.types";
import {
  AssetClass,
  OptionType,
  SignalDirection,
  SignalRegime,
  SignalStatus,
  TradeHorizon,
  TradeStrategy,
} from "./enums";
import type { OptionContractDetails } from "./instruments.types";

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
  readonly role: AgentRole | string;
  readonly stance: AgentStance;
  readonly confidence: number;
  readonly summary: string;
}

/**
 * First-class market prediction record supporting multi-asset and multi-strategy setups.
 */
export interface Signal {
  readonly id: string;
  readonly ticker: string;
  readonly name: string;
  readonly direction: SignalDirection;
  readonly strategy?: TradeStrategy;
  readonly assetClass?: AssetClass;
  readonly entry: number;
  readonly current: number;
  readonly target: number;
  readonly stopLoss: number;
  readonly horizon: TradeHorizon | string;
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
  readonly optionDetails?: OptionContractDetails;
}

/**
 * Zod schema for runtime validation of incoming prediction payloads.
 */
export const SignalSchema = z.object({
  id: z.string(),
  ticker: z.string(),
  name: z.string(),
  direction: z.nativeEnum(SignalDirection),
  strategy: z.nativeEnum(TradeStrategy).optional(),
  assetClass: z.nativeEnum(AssetClass).optional(),
  entry: z.number().positive(),
  current: z.number().positive(),
  target: z.number().positive(),
  stopLoss: z.number().positive(),
  horizon: z.union([z.nativeEnum(TradeHorizon), z.string()]),
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
  optionDetails: z
    .object({
      underlyingSymbol: z.string(),
      strikePrice: z.number().positive(),
      optionType: z.nativeEnum(OptionType),
      expiryDate: z.string(),
      lotSize: z.number().positive().optional(),
    })
    .optional(),
});
