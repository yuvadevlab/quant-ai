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
 * Mock trajectory points sampled along the confidence corridor.
 */
export const chartSamples: readonly ChartSamplePoint[] = [
  { x: 4.7, y: 74.9, time: "09:48:00", price: "₹2,422.50", deviation: "0.00%" },
  { x: 16.8, y: 68.5, time: "09:55:12", price: "₹2,428.10", deviation: "+0.08%" },
  { x: 29.0, y: 73.2, time: "10:02:24", price: "₹2,424.70", deviation: "−0.05%" },
  { x: 41.1, y: 57.4, time: "10:09:36", price: "₹2,438.20", deviation: "+0.14%" },
  { x: 53.2, y: 46.6, time: "10:15:00", price: "₹2,449.60", deviation: "+0.28%" },
  { x: 65.3, y: 61.3, time: "10:22:48", price: "₹2,435.10", deviation: "−0.03%" },
  { x: 77.4, y: 57.4, time: "10:30:00", price: "₹2,434.60", deviation: "+0.06%" },
];
