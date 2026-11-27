/**
 * @file apps/web/src/lib/portal-routes.ts
 * @description DevLab Central Portal SSO route builders and canonical destinations.
 */

import { AuthPrompt, AuthQueryParamKey, DEVLAB_CONFIG } from "@quant-ai/shared-types";
import { APP_ID, DEVLAB_PORTAL_WEB_URL } from "./app-constants";

export interface DevLabPortalLoginOptions {
  readonly redirectUrl?: string;
  readonly error?: string;
  readonly prompt?: AuthPrompt;
}

/**
 * DevLab Central Portal SSO URL builders for login, registration, and password recovery.
 */
export const DEVLAB_PORTAL_ROUTES = {
  LOGIN: (redirectUrlOrOptions?: string | DevLabPortalLoginOptions): string => {
    let redirectUrl: string | undefined;
    let error: string | undefined;
    let prompt: AuthPrompt | undefined;

    if (typeof redirectUrlOrOptions === "object" && redirectUrlOrOptions !== null) {
      redirectUrl = redirectUrlOrOptions.redirectUrl;
      error = redirectUrlOrOptions.error;
      prompt = redirectUrlOrOptions.prompt;
    } else {
      redirectUrl = redirectUrlOrOptions;
    }

    const url = new URL(`${DEVLAB_PORTAL_WEB_URL}${DEVLAB_CONFIG.PATHS.LOGIN}`);
    url.searchParams.set(AuthQueryParamKey.APP, APP_ID);

    if (redirectUrl) {
      url.searchParams.set(AuthQueryParamKey.REDIRECT, redirectUrl);
    }
    if (error) {
      url.searchParams.set(AuthQueryParamKey.ERROR, error);
    }
    if (prompt) {
      url.searchParams.set(AuthQueryParamKey.PROMPT, prompt);
    }

    return url.toString();
  },

  REGISTER: (): string => {
    const url = new URL(`${DEVLAB_PORTAL_WEB_URL}${DEVLAB_CONFIG.PATHS.REGISTER}`);
    url.searchParams.set(AuthQueryParamKey.APP, APP_ID);
    return url.toString();
  },

  FORGOT_PASSWORD: (): string => {
    const url = new URL(`${DEVLAB_PORTAL_WEB_URL}${DEVLAB_CONFIG.PATHS.FORGOT_PASSWORD}`);
    url.searchParams.set(AuthQueryParamKey.APP, APP_ID);
    return url.toString();
  },

  RESET_PASSWORD: (): string => {
    const url = new URL(`${DEVLAB_PORTAL_WEB_URL}${DEVLAB_CONFIG.PATHS.RESET_PASSWORD}`);
    url.searchParams.set(AuthQueryParamKey.APP, APP_ID);
    return url.toString();
  },
} as const;
