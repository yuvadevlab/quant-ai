/**
 * @fileoverview Strongly-typed web workstation environment parsed via @quant-ai/shared-types.
 */

import { parseWebEnv, type WebEnvironment } from "@quant-ai/shared-types";

const WebEnvKey = {
  MODE: "MODE",
  VITE_PORT: "VITE_PORT",
  VITE_API_URL: "VITE_API_URL",
  VITE_WS_URL: "VITE_WS_URL",
} as const;

/**
 * Validated environment settings for the frontend workstation client.
 */
export const WEB_ENV: WebEnvironment = parseWebEnv({
  NODE_ENV: import.meta.env?.[WebEnvKey.MODE],
  PORT: import.meta.env?.[WebEnvKey.VITE_PORT],
  VITE_API_URL: import.meta.env?.[WebEnvKey.VITE_API_URL],
  VITE_WS_URL: import.meta.env?.[WebEnvKey.VITE_WS_URL],
});
