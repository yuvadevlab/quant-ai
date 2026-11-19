/**
 * @fileoverview Strongly-typed web workstation environment parsed via @quant-ai/contracts.
 * @author yuva.devlab@gmail.com
 */

import { parseWebEnv, type WebEnvironment } from "@quant-ai/contracts";

/**
 * Validated environment settings for the frontend workstation client.
 */
export const WEB_ENV: WebEnvironment = parseWebEnv({
  NODE_ENV: import.meta.env ? import.meta.env["MODE"] : undefined,
  PORT: import.meta.env ? import.meta.env["VITE_PORT"] : undefined,
  VITE_API_URL: import.meta.env ? import.meta.env["VITE_API_URL"] : undefined,
  VITE_WS_URL: import.meta.env ? import.meta.env["VITE_WS_URL"] : undefined,
});
