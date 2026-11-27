/**
 * @file packages/shared-types/src/query-keys.ts
 * @description Canonical TanStack Query cache keys for QuantAI.
 * Eliminates raw string query key arrays across frontend views.
 */

/**
 * Single source of truth for query caching keys in TanStack Query.
 */
export enum QueryKey {
  HEALTH = "health",
  BENCHMARKS = "benchmarks",
  BENCHMARK_DETAIL = "benchmark_detail",
  PREDICTIONS = "predictions",
  PREDICTION_DETAIL = "prediction_detail",
  SCREENER = "screener",
  REGIME = "regime",
  DELIBERATION = "deliberation",
  PORTFOLIO = "portfolio",
  CHAT_SESSION = "chat_session",
}
