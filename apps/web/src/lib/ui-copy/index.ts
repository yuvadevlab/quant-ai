/**
 * @file src/lib/ui-copy/index.ts
 * @description Centralized export catalog for all QuantAI user-facing copy strings.
 * Enforces Yuva DevLab Zero Hardcoded Strings Rule (Matching fin-ai architecture).
 * @author yuva.devlab@gmail.com
 */

import { COMMON_COPY } from "./common.copy";
import { OVERVIEW_COPY } from "./overview.copy";
import { PREDICTIONS_COPY } from "./predictions.copy";
import { MONITOR_COPY } from "./monitor.copy";
import { SCREENER_COPY } from "./screener.copy";
import { PORTFOLIO_COPY } from "./portfolio.copy";
import { CHAT_COPY } from "./chat.copy";
import { SETTINGS_COPY } from "./settings.copy";

export * from "./common.copy";
export * from "./overview.copy";
export * from "./predictions.copy";
export * from "./monitor.copy";
export * from "./screener.copy";
export * from "./portfolio.copy";
export * from "./chat.copy";
export * from "./settings.copy";

/**
 * Universal, type-safe dictionary of user-facing UI text strings,
 * placeholders, accessibility labels, and action copy.
 */
export const UI_COPY = {
  COMMON: COMMON_COPY,
  OVERVIEW: OVERVIEW_COPY,
  PREDICTIONS: PREDICTIONS_COPY,
  MONITOR: MONITOR_COPY,
  SCREENER: SCREENER_COPY,
  PORTFOLIO: PORTFOLIO_COPY,
  CHAT: CHAT_COPY,
  SETTINGS: SETTINGS_COPY,
} as const;

export type UiCopyCatalog = typeof UI_COPY;
