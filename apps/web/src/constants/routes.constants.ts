/**
 * @file src/constants/routes.constants.ts
 * @description Centralized application route paths and query parameter keys. */

export { ApiRoute, ApiSegment } from "@quant-ai/shared-types";

/**
 * QuantAI application route endpoints as const literals for TanStack Router compatibility.
 */

export const AppRoute = {
  OVERVIEW: "/",
  PREDICTIONS: "/predictions",
  MONITOR: "/predictions/$id",
  SCREENER: "/screener",
  PORTFOLIO: "/portfolio",
  CHAT: "/chat",
  CHAT_THREAD: "/chat/$id",
  SETTINGS: "/settings",
} as const;

export type AppRouteType = (typeof AppRoute)[keyof typeof AppRoute];

/**
 * Centralized URL Query Parameter Keys.
 */
export enum QueryParamKey {
  HORIZON = "horizon",
  INDEX = "index",
  STATUS = "status",
  DIRECTION = "direction",
  SEARCH = "q",
  VIEW = "view",
}

/**
 * Canonical helper to construct prediction monitor paths.
 *
 * @param predictionId - Unique prediction identifier (e.g., 'PRED-8942')
 * @returns Fully qualified route path
 */
export function getMonitorRoute(predictionId: string): string {
  return `/predictions/${encodeURIComponent(predictionId)}`;
}

/**
 * Canonical helper to construct chat conversation thread paths.
 *
 * @param conversationId - Unique conversation session identifier
 * @returns Fully qualified route path
 */
export function getChatThreadRoute(conversationId: string): string {
  return `/chat/${encodeURIComponent(conversationId)}`;
}
