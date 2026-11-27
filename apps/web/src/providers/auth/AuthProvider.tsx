/**
 * @file apps/web/src/providers/auth/AuthProvider.tsx
 * @description Centralized authentication provider wrapping @yuva-devlab/auth-client.
 */

import React, { useCallback, useMemo, useState } from "react";
import { DevLabAuthProvider } from "@yuva-devlab/auth-client";
import { AuthPrompt, AuthQueryParamKey, StorageKey } from "@quant-ai/shared-types";
import { APP_ID, DEVLAB_PORTAL_API_URL, DEVLAB_PORTAL_WEB_URL } from "../../lib/app-constants";
import { DEVLAB_PORTAL_ROUTES } from "../../lib/portal-routes";
import { isJwtExpired, parseJwtClaims } from "../../lib/jwt";
import { AuthContext, type AuthContextValue, type AuthUser } from "./auth-context";

export interface AuthProviderProps {
  readonly initialToken?: string | null;
  readonly children: React.ReactNode;
}

function readCookieToken(): string | null {
  if (typeof document === "undefined") return null;
  const regex = new RegExp(
    `(?:^|;\\s*)(?:${StorageKey.TOKEN}|${StorageKey.DEVLAB_ACCESS_TOKEN})=([^;]+)`,
  );
  const match = document.cookie.match(regex);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

function resolveInitialToken(initialToken: string | null): string | null {
  if (typeof window === "undefined") return initialToken;

  // 1. Check URL parameters for return SSO tokens from DevLab Portal
  const params = new URLSearchParams(window.location.search);
  const urlToken =
    params.get(AuthQueryParamKey.TOKEN) || params.get(AuthQueryParamKey.ACCESS_TOKEN);

  if (urlToken && !isJwtExpired(urlToken)) {
    localStorage.setItem(StorageKey.TOKEN, urlToken);
    localStorage.setItem(StorageKey.DEVLAB_ACCESS_TOKEN, urlToken);
    document.cookie = `${StorageKey.TOKEN}=${encodeURIComponent(urlToken)}; path=/; max-age=604800; SameSite=Lax`;
    document.cookie = `${StorageKey.DEVLAB_ACCESS_TOKEN}=${encodeURIComponent(urlToken)}; path=/; max-age=604800; SameSite=Lax`;

    params.delete(AuthQueryParamKey.TOKEN);
    params.delete(AuthQueryParamKey.ACCESS_TOKEN);
    const remaining = params.toString();
    const cleanUrl =
      window.location.pathname + (remaining ? `?${remaining}` : "") + window.location.hash;
    window.history.replaceState({}, document.title, cleanUrl);
    return urlToken;
  }

  // 2. Check explicitly provided token
  if (initialToken && !isJwtExpired(initialToken)) {
    localStorage.setItem(StorageKey.TOKEN, initialToken);
    localStorage.setItem(StorageKey.DEVLAB_ACCESS_TOKEN, initialToken);
    return initialToken;
  }

  // 3. Check localStorage
  const stored =
    localStorage.getItem(StorageKey.TOKEN) ||
    localStorage.getItem(StorageKey.DEVLAB_ACCESS_TOKEN) ||
    localStorage.getItem(StorageKey.DEVLAB_AUTH_TOKEN);

  if (stored) {
    if (isJwtExpired(stored)) {
      localStorage.removeItem(StorageKey.TOKEN);
      localStorage.removeItem(StorageKey.DEVLAB_ACCESS_TOKEN);
      localStorage.removeItem(StorageKey.DEVLAB_AUTH_TOKEN);
      localStorage.removeItem(StorageKey.USER);
      return null;
    }
    return stored;
  }

  // 4. Check cookie
  const cookieToken = readCookieToken();
  if (cookieToken && !isJwtExpired(cookieToken)) {
    localStorage.setItem(StorageKey.TOKEN, cookieToken);
    localStorage.setItem(StorageKey.DEVLAB_ACCESS_TOKEN, cookieToken);
    return cookieToken;
  }

  return null;
}

function resolveInitialUser(activeToken: string | null): AuthUser | null {
  if (typeof window === "undefined" || !activeToken || isJwtExpired(activeToken)) {
    return null;
  }

  const storedUser =
    localStorage.getItem(StorageKey.USER) || localStorage.getItem(StorageKey.DEVLAB_AUTH_USER);
  if (storedUser) {
    try {
      return JSON.parse(storedUser) as AuthUser;
    } catch {
      // Fall through to JWT claims
    }
  }

  const claims = parseJwtClaims(activeToken);
  if (claims && typeof claims.email === "string") {
    const email = claims.email;
    const sub = typeof claims.sub === "string" ? claims.sub : "";
    const rawName = typeof claims.name === "string" ? claims.name : undefined;
    const fallbackName = email.split("@")[0] ?? "Trader";
    const authUser: AuthUser = {
      id: sub || (claims as Record<string, string>)["id"] || "",
      email,
      name: rawName ?? fallbackName,
      roles: claims.roles ?? (claims.role ? [claims.role] : []),
    };
    localStorage.setItem(StorageKey.USER, JSON.stringify(authUser));
    return authUser;
  }

  return null;
}

/**
 * QuantAI authentication provider supporting DevLab Portal SSO, token storage, and logout.
 */
export function AuthProvider({ initialToken = null, children }: AuthProviderProps) {
  const [token] = useState<string | null>(() => resolveInitialToken(initialToken));
  const [user] = useState<AuthUser | null>(() => resolveInitialUser(token));

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(StorageKey.TOKEN);
      localStorage.removeItem(StorageKey.USER);
      localStorage.removeItem(StorageKey.DEVLAB_ACCESS_TOKEN);
      localStorage.removeItem(StorageKey.DEVLAB_AUTH_TOKEN);
      localStorage.removeItem(StorageKey.DEVLAB_AUTH_USER);
      localStorage.removeItem(StorageKey.WORKSPACE_ID);
      document.cookie = `${StorageKey.TOKEN}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      document.cookie = `${StorageKey.DEVLAB_ACCESS_TOKEN}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      document.cookie = `${StorageKey.WORKSPACE_ID}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      window.location.href = DEVLAB_PORTAL_ROUTES.LOGIN({
        redirectUrl: window.location.origin,
        prompt: AuthPrompt.LOGIN,
      });
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user && !isJwtExpired(token)),
      logout,
    }),
    [token, user, logout],
  );

  return (
    <DevLabAuthProvider
      appId={APP_ID}
      portalUrl={DEVLAB_PORTAL_WEB_URL}
      gatewayUrl={DEVLAB_PORTAL_API_URL}
    >
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </DevLabAuthProvider>
  );
}
