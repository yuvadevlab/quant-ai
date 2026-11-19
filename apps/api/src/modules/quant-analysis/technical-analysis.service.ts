import { Injectable } from "@nestjs/common";
import {
  calculateAtr,
  calculateBollingerBands,
  calculateEma,
  calculateRsi,
  calculateVwap,
  Candle,
  DEFAULT_ATR_CONFIG,
  DEFAULT_BOLLINGER_CONFIG,
  DEFAULT_EMA_PERIODS,
  DEFAULT_KELTNER_CONFIG,
  DEFAULT_RSI_CONFIG,
  DEFAULT_VWAP_CONFIG,
  detectVolatilitySqueeze,
  SqueezeResult,
} from "@quant-ai/shared-types";

/**
 * Technical snapshot aggregation computed across multiple indicators.
 */
export interface TechnicalMatrix {
  readonly latestClose: number;
  readonly rsi: number;
  readonly atr: number;
  readonly ema9: number;
  readonly ema21: number;
  readonly ema50: number;
  readonly ema200: number;
  readonly bollingerBandwidth: number;
  readonly squeeze: SqueezeResult;
  readonly vwap: number;
}

/**
 * Service calculating deterministic indicator matrices over price candle series.
 */
@Injectable()
export class TechnicalAnalysisService {
  /**
   * Computes an institutional technical matrix for a sequence of OHLCV candles.
   *
   * @param candles Array of historical candles in chronological order.
   * @returns TechnicalMatrix containing current indicator values.
   */
  computeMatrix(candles: readonly Candle[]): TechnicalMatrix {
    if (candles.length === 0) {
      throw new Error("Cannot compute technical matrix on empty candle series");
    }

    const latest = candles[candles.length - 1]!;
    const highs = candles.map((c) => c.high);
    const lows = candles.map((c) => c.low);
    const closes = candles.map((c) => c.close);
    const volumes = candles.map((c) => c.volume);

    const rsiSeries = calculateRsi(closes, DEFAULT_RSI_CONFIG);
    const atrSeries = calculateAtr(highs, lows, closes, DEFAULT_ATR_CONFIG);
    const bbSeries = calculateBollingerBands(closes, DEFAULT_BOLLINGER_CONFIG);
    const squeeze = detectVolatilitySqueeze(
      highs,
      lows,
      closes,
      DEFAULT_BOLLINGER_CONFIG,
      DEFAULT_KELTNER_CONFIG,
    );
    const vwapResult = calculateVwap(highs, lows, closes, volumes, DEFAULT_VWAP_CONFIG);

    const ema9Series = calculateEma(closes, DEFAULT_EMA_PERIODS.FAST);
    const ema21Series = calculateEma(closes, DEFAULT_EMA_PERIODS.MEDIUM);
    const ema50Series = calculateEma(closes, DEFAULT_EMA_PERIODS.SLOW);
    const ema200Series = calculateEma(closes, DEFAULT_EMA_PERIODS.TREND);

    return {
      latestClose: latest.close,
      rsi: rsiSeries[rsiSeries.length - 1] ?? 50,
      atr: atrSeries[atrSeries.length - 1] ?? 0,
      ema9: ema9Series[ema9Series.length - 1] ?? latest.close,
      ema21: ema21Series[ema21Series.length - 1] ?? latest.close,
      ema50: ema50Series[ema50Series.length - 1] ?? latest.close,
      ema200: ema200Series[ema200Series.length - 1] ?? latest.close,
      bollingerBandwidth: bbSeries.bandwidth[bbSeries.bandwidth.length - 1] ?? 0,
      squeeze,
      vwap: vwapResult.vwap[vwapResult.vwap.length - 1] ?? latest.close,
    };
  }
}
