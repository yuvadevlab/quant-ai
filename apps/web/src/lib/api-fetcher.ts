/**
 * @file apps/web/src/lib/api-fetcher.ts
 * @description Standard resilient API fetcher with Vite proxy support and JSON serialization.
 * @author yuva.devlab@gmail.com
 */

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const url = endpoint.startsWith("http")
      ? endpoint
      : endpoint.startsWith("/")
        ? endpoint
        : `/${endpoint}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers ?? {}),
      },
    });

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as T;
  } catch {
    return null;
  }
}
