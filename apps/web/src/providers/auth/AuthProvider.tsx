/**
 * @file apps/web/src/providers/auth/AuthProvider.tsx
 * @description Centralized authentication provider wrapping @yuva-devlab/auth-client.
 * @author yuva.devlab@gmail.com
 */

import React, { useCallback, useMemo, useState } from "react";
import { DevLabAuthProvider } from "@yuva-devlab/auth-client";
import { AuthPrompt, StorageKey } from "@quant-ai/shared-types";
import { APP_ID, DEVLAB_PORTAL_API_URL, DEVLAB_PORTAL_WEB_URL } from "../../lib/app-constants";
import { DEVLAB_PORTAL_ROUTES } from "../../lib/portal-routes";
import { AuthContext, type AuthContextValue, type AuthUser } from "./auth-context";

export interface AuthProviderProps {
  readonly initialToken?: string | null;
  readonly children: React.ReactNode;
}

function parseJwtPayload(jwt: string): Record<string, unknown> | null {
  try {
    const parts = jwt.split(".");
    const part = parts[1];
    if (!part || parts.length !== 3) return null;
    return JSON.parse(atob(part));
  } catch {
    return null;
  }
}

function readCookieToken(): string | null {
  if (typeof document === "undefined") return null;
  const regex = new RegExp(
    `(?:^|;\\s*)(?:${StorageKey.TOKEN}|${StorageKey.DEVLAB_ACCESS_TOKEN})=([^;]+)`,
  );
  const match = document.cookie.match(regex);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

/**
 * QuantAI authentication provider supporting DevLab Portal SSO, token storage, and logout.
 */
export function AuthProvider({ initialToken = null, children }: AuthProviderProps) {
  const [token] = useState<string | null>(() => {
    if (initialToken) {
      if (typeof window !== "undefined") {
        localStorage.setItem(StorageKey.TOKEN, initialToken);
        localStorage.setItem(StorageKey.DEVLAB_ACCESS_TOKEN, initialToken);
      }
      return initialToken;
    }
    if (typeof window !== "undefined") {
      const stored =
        localStorage.getItem(StorageKey.TOKEN) ||
        localStorage.getItem(StorageKey.DEVLAB_ACCESS_TOKEN) ||
        localStorage.getItem(StorageKey.DEVLAB_AUTH_TOKEN);
      if (stored) return stored;

      const cookieToken = readCookieToken();
      if (cookieToken) {
        localStorage.setItem(StorageKey.TOKEN, cookieToken);
        localStorage.setItem(StorageKey.DEVLAB_ACCESS_TOKEN, cookieToken);
        return cookieToken;
      }
    }
    return null;
  });

  const [user] = useState<AuthUser | null>(() => {
    if (typeof window !== "undefined") {
      const storedUser =
        localStorage.getItem(StorageKey.USER) || localStorage.getItem(StorageKey.DEVLAB_AUTH_USER);
      if (storedUser) {
        try {
          return JSON.parse(storedUser);
        } catch {
          // Fall through to JWT extraction
        }
      }

      const activeToken =
        initialToken ||
        localStorage.getItem(StorageKey.TOKEN) ||
        localStorage.getItem(StorageKey.DEVLAB_ACCESS_TOKEN) ||
        readCookieToken();

      if (activeToken) {
        const payload = parseJwtPayload(activeToken);
        if (payload && typeof payload["email"] === "string") {
          const email = payload["email"];
          const sub = typeof payload["sub"] === "string" ? payload["sub"] : "";
          const id = typeof payload["id"] === "string" ? payload["id"] : "";
          const rawName = typeof payload["name"] === "string" ? payload["name"] : undefined;
          const fallbackName = email.split("@")[0] ?? "User";
          const authUser: AuthUser = {
            id: sub || id || "",
            email,
            name: rawName ?? fallbackName,
          };
          localStorage.setItem(StorageKey.USER, JSON.stringify(authUser));
          return authUser;
        }
      }
    }
    return null;
  });

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
      isAuthenticated: Boolean(token && user),
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
