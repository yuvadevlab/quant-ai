/**
 * @file packages/shared-types/src/auth.constants.ts
 * @description Centralized DevLab Portal SSO configuration, storage keys, and authentication parameters.
 * @author yuva.devlab@gmail.com
 */

/**
 * DevLab Central Portal SSO route paths, operational defaults, and application identifiers.
 */
export const DEVLAB_CONFIG = {
  APP_ID: "quantai",
  DEFAULT_WEB_PORT: 3005,
  DEFAULT_API_PORT: 4005,
  DEFAULT_PORTAL_WEB_PORT: 3000,
  DEFAULT_PORTAL_API_PORT: 4000,
  DEFAULT_WEB_URL: "http://localhost:3005",
  DEFAULT_API_URL: "http://localhost:4005",
  DEFAULT_API_BASE_URL: "http://localhost:4005/api",
  DEFAULT_PORTAL_WEB_URL: "http://localhost:3000",
  DEFAULT_PORTAL_API_URL: "http://localhost:4000",
  PATHS: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
  },
} as const;

export type DevLabConfigCatalog = typeof DEVLAB_CONFIG;

/**
 * Browser local and session storage keys used across client applications.
 */
export const StorageKey = {
  TOKEN: "quantai_token",
  USER: "quantai_user",
  WORKSPACE_ID: "quantai_workspace_id",
  THEME: "quantai_theme",
  APPEARANCE: "quantai_appearance",
  SIDEBAR: "quantai_sidebar_collapsed",
  DEVLAB_ACCESS_TOKEN: "devlab_access_token",
  DEVLAB_AUTH_TOKEN: "devlab_auth_token",
  DEVLAB_AUTH_USER: "devlab_auth_user",
} as const;
export type StorageKey = (typeof StorageKey)[keyof typeof StorageKey];

/**
 * Standard URL query parameter keys for authentication and SSO handoffs.
 */
export const AuthQueryParamKey = {
  REDIRECT: "redirect",
  APP: "app",
  TOKEN: "token",
  ACCESS_TOKEN: "access_token",
  PROMPT: "prompt",
  ERROR: "error",
  AUTH_ERROR: "auth_error",
  SESSION_EXPIRED: "session_expired",
} as const;
export type AuthQueryParamKey = (typeof AuthQueryParamKey)[keyof typeof AuthQueryParamKey];

/**
 * Canonical authentication prompt directives.
 */
export const AuthPrompt = {
  LOGIN: "login",
  SELECT_ACCOUNT: "select_account",
  CONSENT: "consent",
} as const;
export type AuthPrompt = (typeof AuthPrompt)[keyof typeof AuthPrompt];
