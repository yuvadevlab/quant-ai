/**
 * @file apps/web/src/lib/app-constants.ts
 * @description Centralized client application constants, SSO endpoints, and platform identifiers.
 */

import { DEVLAB_CONFIG } from "@quant-ai/shared-types";

/**
 * Platform application identifier registered in DevLab Central Portal.
 */
export const APP_ID: string =
  (typeof import.meta !== "undefined" && import.meta.env?.["VITE_APP_ID"]) || DEVLAB_CONFIG.APP_ID;

/**
 * DevLab Central Portal Web URL for SSO authentication flows.
 */
export const DEVLAB_PORTAL_WEB_URL: string =
  (typeof import.meta !== "undefined" && import.meta.env?.["VITE_DEVLAB_PORTAL_WEB_URL"]) ||
  DEVLAB_CONFIG.DEFAULT_PORTAL_WEB_URL;

/**
 * DevLab Central Portal API URL for token verification.
 */
export const DEVLAB_PORTAL_API_URL: string =
  (typeof import.meta !== "undefined" && import.meta.env?.["VITE_DEVLAB_PORTAL_API_URL"]) ||
  DEVLAB_CONFIG.DEFAULT_PORTAL_API_URL;
