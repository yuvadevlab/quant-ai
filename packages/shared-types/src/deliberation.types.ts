/**
 * @fileoverview Type contracts for adversarial multi-agent deliberation and risk gating.
 */

/**
 * Standardized stances for agent deliberation.
 */
export enum AgentStance {
  BULLISH = "BULLISH",
  BEARISH = "BEARISH",
  NEUTRAL = "NEUTRAL",
}

/**
 * Canonical institutional agent persona roles.
 */
export enum AgentRole {
  MOMENTUM_ANALYST = "Momentum Analyst",
  RED_TEAM_SKEPTIC = "Red-Team Skeptic",
  QUANT_RISK_OFFICER = "Quant Risk Officer",
  MACRO_ANALYST = "Macro & Flow Analyst",
}

/**
 * Structured deliberation output from a single agent.
 */
export interface AgentDeliberationItem {
  readonly role: AgentRole;
  readonly stance: AgentStance;
  readonly confidence: number;
  readonly summary: string;
  readonly keyCatalyst?: string;
  readonly keyRisk?: string;
}

/**
 * Configurable agent ensemble weighting and risk thresholds.
 */
export interface RiskGateConfig {
  readonly minimumConfidence: number;
  readonly minimumRiskReward: number;
  readonly maxAdverseTolerance: number;
}

/**
 * Trade expectancy input metrics.
 */
export interface TradeExpectancyInput {
  readonly winProbability: number;
  readonly targetGain: number;
  readonly stopLossLoss: number;
  readonly estimatedFriction?: number;
}

/**
 * Output of mathematical trade expectancy evaluation.
 */
export interface TradeExpectancyResult {
  readonly mathematicalExpectancy: number;
  readonly riskRewardRatio: number;
  readonly isApproved: boolean;
  readonly vetoReason?: string;
}
