/**
 * @file apps/web/src/routes/login.tsx
 * @description Dedicated SSO handoff route delegating authentication exclusively to DevLab Portal.
 * Local registration/signup is disabled; access is gated to onboarded DevLab ecosystem users.
 */

import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { AuthPrompt, StorageKey } from "@quant-ai/shared-types";
import { DEVLAB_PORTAL_ROUTES } from "../lib/portal-routes";

export const Route = createFileRoute("/login")({
  component: LoginComponent,
});

function LoginComponent() {
  useEffect(() => {
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

      const portalUrl = DEVLAB_PORTAL_ROUTES.LOGIN({
        redirectUrl: window.location.origin,
        prompt: AuthPrompt.LOGIN,
      });

      window.location.href = portalUrl;
    }
  }, []);

  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <span className="not-found-badge">DEVLAB SSO</span>
        <h1 className="not-found-title">Redirecting to Central Portal</h1>
        <p className="not-found-description">
          Authenticating with DevLab ecosystem identity gateway. Please wait...
        </p>
      </div>
    </div>
  );
}
