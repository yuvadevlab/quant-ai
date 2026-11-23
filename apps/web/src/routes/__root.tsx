import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { type ReactNode, useEffect } from "react";
import { Button, Card } from "@quant-ai/ui";
import { StorageKey } from "@quant-ai/shared-types";
import { AuthProvider } from "../providers/auth";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="not-found-container">
      <Card className="not-found-card">
        <div className="not-found-badge">404</div>
        <h1 className="not-found-title">Page not found</h1>
        <p className="not-found-description">
          The requested intelligence desk or analytics route does not exist.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn-primary">
            Return to Overview Desk
          </Link>
        </div>
      </Card>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error("QuantAI application error:", error);
  const router = useRouter();

  return (
    <div className="not-found-container">
      <Card className="not-found-card">
        <div className="error-badge-wrapper">
          <span className="error-badge">SYSTEM ERROR</span>
        </div>
        <h1 className="not-found-title">Failed to render desk</h1>
        <p className="not-found-description">
          An unexpected render cycle exception occurred. You can retry or return to the overview
          desk.
        </p>
        <div className="not-found-actions">
          <Button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-primary"
          >
            Retry Desk
          </Button>
          <Link to="/" className="btn-secondary">
            Go Home
          </Link>
        </div>
      </Card>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "QuantAI — AI Quantitative Market Intelligence & Strategy Workstation" },
      {
        name: "description",
        content:
          "Institutional-grade quantitative intelligence, automated multi-agent signal tracking, and algorithmic trade analytics for Indian financial markets (NSE & BSE).",
      },
      { name: "author", content: "yuva.devlab@gmail.com" },
      { property: "og:title", content: "QuantAI — AI Quantitative Market Intelligence" },
      {
        property: "og:description",
        content: "Institutional-grade quantitative intelligence and multi-agent market analytics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/icon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark" data-brand="quantai" data-theme="quantai-dark">
      <head>
        <HeadContent />
      </head>
      <body className="quant-body" data-brand="quantai">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const activeTheme = localStorage.getItem(StorageKey.THEME) || "quantai-dark";
      document.documentElement.setAttribute("data-theme", activeTheme);
      document.documentElement.setAttribute("data-brand", "quantai");
      document.documentElement.classList.toggle("dark", activeTheme.includes("dark"));
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </QueryClientProvider>
  );
}
