/**
 * @file src/services/signals.types.ts
 * @description Master data contracts and interfaces for quantitative predictive signals and Monte Carlo trajectories. */

import type { SignalDirection, SignalHorizon, SignalStatus } from "../constants";

/**
 * Monte Carlo trajectory data point for forecast cones.
 */
export interface TrajectoryPoint {
  readonly time: string;
  readonly actualPrice: number;
  readonly expectedPath: number;
  readonly upperCone: number;
  readonly lowerCone: number;
}

/**
 * Individual agent consensus assessment score and verdict.
 */
export interface AgentScore {
  readonly score: number;
  readonly verdict: string;
}

/**
 * Multi-Agent consensus deliberation committee.
 */
export interface MultiAgentConsensus {
  readonly technical: AgentScore;
  readonly quant: AgentScore;
  readonly optionsFlow: AgentScore;
  readonly riskGuardian: AgentScore;
}

/**
 * Quantitative Predictive Signal Record.
 */
export interface PredictiveSignal {
  readonly id: string;
  readonly symbol: string;
  readonly companyName: string;
  readonly instrument: string;
  readonly direction: SignalDirection;
  readonly horizon: SignalHorizon;
  readonly entry: string;
  readonly entryPrice: number;
  readonly target1: string;
  readonly target2: string;
  readonly stop: string;
  readonly last: string;
  readonly change: string;
  readonly mfe: string;
  readonly mae: string;
  readonly status: SignalStatus;
  readonly time: string;
  readonly confidence: string;
  readonly riskReward: string;
  readonly catalysts: readonly string[];
  readonly agents: MultiAgentConsensus;
  readonly trajectoryPoints?: readonly TrajectoryPoint[];
}
