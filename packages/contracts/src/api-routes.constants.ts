/**
 * @fileoverview Single Source of Truth for API route segments, full paths, and WebSocket namespaces.
 * @author yuva.devlab@gmail.com
 */

/**
 * Atomic route segments for controllers and route builders.
 */
export enum ApiSegment {
  API = "api",
  DOCS = "docs",
  HEALTH = "health",
  MARKET = "market",
  INDICES = "indices",
  PREDICTIONS = "predictions",
  TRAJECTORY = "trajectory",
  SCREENER = "screener",
  BREAKOUTS = "breakouts",
  SURGES = "surges",
  REALTIME = "realtime",
  ROOT = "",
}

/**
 * Standard HTTP methods.
 */
export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

/**
 * WebSocket gateway namespaces.
 */
export enum WsNamespace {
  REALTIME = "/realtime",
}

/**
 * Canonical full API route builders and paths for clients and tests.
 */
export const ApiRoute = {
  HEALTH: `/${ApiSegment.API}/${ApiSegment.HEALTH}`,
  MARKET_INDICES: `/${ApiSegment.API}/${ApiSegment.MARKET}/${ApiSegment.INDICES}`,
  PREDICTIONS_LIST: `/${ApiSegment.API}/${ApiSegment.PREDICTIONS}`,
  PREDICTION_DETAIL: (id: string): string => `/${ApiSegment.API}/${ApiSegment.PREDICTIONS}/${id}`,
  PREDICTION_TRAJECTORY: (id: string): string =>
    `/${ApiSegment.API}/${ApiSegment.PREDICTIONS}/${id}/${ApiSegment.TRAJECTORY}`,
  SCREENER_BREAKOUTS: `/${ApiSegment.API}/${ApiSegment.SCREENER}/${ApiSegment.BREAKOUTS}`,
  SCREENER_SURGES: `/${ApiSegment.API}/${ApiSegment.SCREENER}/${ApiSegment.SURGES}`,
  SWAGGER_DOCS: `/${ApiSegment.DOCS}`,
} as const;
