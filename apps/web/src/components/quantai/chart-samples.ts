/**
 * @file apps/web/src/components/quantai/chart-samples.ts
 * @description Benchmark trajectory coordinates for predictive cone visualization.
 */

/**
 * Trajectory coordinate point for chart inspection.
 */
export interface ChartSamplePoint {
  /** X coordinate percentage (0-100) */
  readonly x: number;
  /** Y coordinate percentage (0-100) */
  readonly y: number;
  /** Timestamp string (HH:mm:ss) */
  readonly time: string;
  /** Target price string */
  readonly price: string;
  /** Percentage deviation */
  readonly deviation: string;
}

/**
 * Dynamic trajectory points sampled along the confidence corridor.
 */
export const chartSamples: readonly ChartSamplePoint[] = [];
