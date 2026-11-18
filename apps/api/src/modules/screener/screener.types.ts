/**
 * Screened financial instrument record.
 */
export interface ScreenerItem {
  readonly symbol: string;
  readonly name: string;
  readonly price: number;
  readonly changePercent: number;
  readonly volumeRatio: number;
  readonly rsi: number;
  readonly trend: "BULLISH" | "BEARISH" | "NEUTRAL";
  readonly breakoutType?: string;
  readonly sector: string;
}

/**
 * Filter criteria for multi-variable quantitative scans.
 */
export interface ScreenerQueryDto {
  readonly minRsi?: number;
  readonly maxRsi?: number;
  readonly minVolumeRatio?: number;
  readonly trend?: "BULLISH" | "BEARISH" | "NEUTRAL";
  readonly sector?: string;
}
