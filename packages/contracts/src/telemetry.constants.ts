/**
 * @fileoverview Service identity, health probes, and OpenAPI documentation constants.
 * @author yuva.devlab@gmail.com
 */

/**
 * Microservice identities and metadata.
 */
export const ServiceIdentity = {
  API_NAME: "@quant-ai/api",
  WEB_NAME: "@quant-ai/web",
  ENGINE_NAME: "quant-engine",
  TITLE: "QuantAI API",
  DESCRIPTION: "Enterprise Quantitative Market Intelligence Gateway",
  VERSION: "1.0.0",
} as const;

/**
 * Diagnostic health status values.
 */
export enum HealthStatus {
  HEALTHY = "healthy",
  UNHEALTHY = "unhealthy",
  UP = "up",
  DOWN = "down",
}

/**
 * OpenAPI documentation group tags.
 */
export enum SwaggerTag {
  MARKET = "Market",
  PREDICTIONS = "Predictions",
  SCREENER = "Screener",
  HEALTH = "Health",
  QUANT_ANALYSIS = "Quant Analysis",
}

/**
 * Canonical operation summaries for OpenAPI / Swagger.
 */
export const SwaggerSummary = {
  HEALTH_CHECK: "Service readiness probe",
  BENCHMARK_INDICES: "Retrieve real-time Indian benchmark indices with category filtering",
  ACTIVE_PREDICTIONS: "List all active quantitative predictive forecasts",
  PREDICTION_BY_ID: "Retrieve single prediction detail by ID",
  PREDICTION_TRAJECTORY: "Retrieve Monte Carlo probabilistic trajectory cone",
  SCREENER_BREAKOUTS: "Screen for 20-day high breakouts with 2x volume expansion",
  SCREENER_SURGES: "Screen for institutional volume surge anomalies",
} as const;
