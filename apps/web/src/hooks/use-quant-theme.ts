/**
 * @file src/hooks/use-quant-theme.ts
 * @description Shared hook for toggling and persisting the QuantAI light/dark workstation theme.
 */

import { useState, useCallback } from "react";
import { StorageKey } from "@quant-ai/shared-types";
import { apiFetch } from "@/lib/api-fetcher";

const LIGHT_THEME = "quantai-light";
const DARK_THEME = "quantai-dark";

/**
 * Manages the active QuantAI color theme with localStorage and optional user-preference sync.
 */
export function useQuantTheme(isAuthenticated = false) {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return (
        document.documentElement.getAttribute("data-theme") ||
        localStorage.getItem(StorageKey.THEME) ||
        LIGHT_THEME
      );
    }
    return LIGHT_THEME;
  });

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const nextTheme = prev === DARK_THEME ? LIGHT_THEME : DARK_THEME;
      if (typeof window !== "undefined") {
        localStorage.setItem(StorageKey.THEME, nextTheme);
        document.documentElement.setAttribute("data-theme", nextTheme);
        document.documentElement.classList.toggle("dark", nextTheme.includes("dark"));

        if (isAuthenticated) {
          void apiFetch("/api/users/preferences", {
            method: "PATCH",
            body: JSON.stringify({ theme: nextTheme }),
          });
        }
      }
      return nextTheme;
    });
  }, [isAuthenticated]);

  return {
    theme,
    isDark: theme === DARK_THEME,
    toggleTheme,
  };
}
