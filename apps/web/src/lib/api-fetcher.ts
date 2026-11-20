/**
 * @file apps/web/src/lib/api-fetcher.ts
 * @description Standard resilient API fetcher with automatic JWT authorization header injection.
 * @author yuva.devlab@gmail.com
 */

import { StorageKey } from "@quant-ai/shared-types";
import { isJwtExpired } from "./jwt";

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const url = endpoint.startsWith("http")
      ? endpoint
      : endpoint.startsWith("/")
        ? endpoint
        : `/${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options?.headers as Record<string, string>) ?? {}),
    };

    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem(StorageKey.TOKEN) ||
        localStorage.getItem(StorageKey.DEVLAB_ACCESS_TOKEN);

      if (token && !isJwtExpired(token)) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem(StorageKey.TOKEN);
      localStorage.removeItem(StorageKey.DEVLAB_ACCESS_TOKEN);
      localStorage.removeItem(StorageKey.USER);
    }

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as T;
  } catch {
    return null;
  }
}
