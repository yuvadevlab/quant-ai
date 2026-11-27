/**
 * @file apps/web/src/lib/api-fetcher.ts
 * @description Standard resilient API fetcher with automatic JWT authorization header injection.
 */

import { StorageKey } from "@quant-ai/shared-types";
import { isJwtExpired } from "./jwt";

/**
 * Resolves full qualified URL for both Node.js (SSR) and Browser (Client).
 */
function resolveUrl(endpoint: string): string {
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  if (typeof window === "undefined") {
    // In SSR (Node.js), relative URLs throw "Failed to parse URL". Resolve against backend host.
    const host =
      (typeof process !== "undefined" && process.env?.["VITE_API_URL"]) || "http://localhost:4005";
    const serverHost = host.replace(/\/api\/?$/, "");
    return `${serverHost}${cleanEndpoint}`;
  }

  return cleanEndpoint;
}

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const url = resolveUrl(endpoint);

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
