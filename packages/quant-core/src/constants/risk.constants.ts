/**
 * @file packages/finance-engine/src/constants/risk.constants.ts
 * @description Institutional trade risk, Kelly Criterion, and expectancy boundary constants.
 */

/** Minimum institutional Risk-to-Reward ratio required for trade execution approval. */
export const INSTITUTIONAL_MIN_RISK_REWARD_RATIO = 2.0;

/** Standard number of trading days in an annualized institutional trading year. */
export const ANNUALIZED_TRADING_DAYS = 252;

/** Annualization scaling factor for standard daily volatility calculations (sqrt(252)). */
export const ANNUALIZED_VOLATILITY_FACTOR = Math.sqrt(ANNUALIZED_TRADING_DAYS);

/** Default estimated broker slippage and exchange friction percentage (0.05%). */
export const DEFAULT_ESTIMATED_FRICTION_PERCENT = 0.05;

/** Intraday target profit expectation factor relative to current base price (3.0% gain). */
export const INTRADAY_DEFAULT_TARGET_GAIN_FACTOR = 1.03;

/** Intraday protective stop loss factor relative to current base price (1.5% risk). */
export const INTRADAY_DEFAULT_STOP_LOSS_FACTOR = 0.985;

/** Positional target profit expectation factor (8.0% gain). */
export const POSITIONAL_DEFAULT_TARGET_GAIN_FACTOR = 1.08;

/** Positional protective stop loss factor (4.0% risk). */
export const POSITIONAL_DEFAULT_STOP_LOSS_FACTOR = 0.96;

/** Threshold for high volume surge anomaly detection (2.0x 20-day average volume). */
export const VOLUME_SURGE_THRESHOLD_RATIO = 2.0;

/** Percentage move triggering technical momentum breakout status (1.5% gain). */
export const MOMENTUM_BREAKOUT_PERCENT_THRESHOLD = 1.5;
