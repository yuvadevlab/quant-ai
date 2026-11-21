/**
 * @file packages/finance-engine/src/constants/technical.constants.ts
 * @description Named mathematical constants for technical indicator algorithms.
 * @author yuva.devlab@gmail.com
 */

/** Standard Wilder smoothing period for Relative Strength Index (RSI). */
export const RSI_DEFAULT_PERIOD = 14;

/** Neutral midpoint level separating bullish and bearish momentum regimes. */
export const RSI_NEUTRAL_MIDPOINT = 50.0;

/** Overbought threshold indicating extended upside momentum and exhaustion risk. */
export const RSI_OVERBOUGHT_THRESHOLD = 70.0;

/** Oversold threshold indicating extended downside velocity and bounce potential. */
export const RSI_OVERSOLD_THRESHOLD = 30.0;

/** Maximum numerical ceiling scale for bounded oscillator normalization. */
export const RSI_MAX_SCALE = 100.0;

/** Minimum required historical candle points to compute meaningful momentum. */
export const RSI_MIN_SERIES_POINTS = 2;

/** Fallback RSI value returned when zero downward movements occur in series. */
export const RSI_ZERO_LOSS_CEILING = 100.0;

/** Default neutral RSI value emitted when historical series is insufficient. */
export const RSI_DEFAULT_NEUTRAL = 50.0;

/** Standard multiplier converting decimals to percentage representation. */
export const PERCENTAGE_MULTIPLIER = 100.0;

/** Decimal precision for rounded financial percentage display. */
export const DEFAULT_PERCENT_DECIMAL_PLACES = 2;

/** Decimal precision for standard currency pricing display. */
export const DEFAULT_CURRENCY_DECIMAL_PLACES = 2;
