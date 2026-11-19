/**
 * @fileoverview Default configurations for multi-agent deliberation and risk gating.
 */

import { RiskGateConfig } from "./deliberation.types";

/**
 * Standard institutional thresholds required for a predictive signal to be approved.
 */
export const DEFAULT_RISK_GATE_CONFIG: Readonly<RiskGateConfig> = {
  minimumConfidence: 75,
  minimumRiskReward: 2.0,
  maxAdverseTolerance: 1.5,
} as const;

/**
 * Default friction allowance in percentage points (brokerage + exchange tax + slippage).
 */
export const DEFAULT_FRICTION_PERCENT = 0.05;
