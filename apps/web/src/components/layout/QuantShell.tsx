/**
 * @file src/components/layout/QuantShell.tsx
 * @description Master workstation canvas layout composing sidebar, topbar, live ticker, content, and compliance footer. */

import { useState, type ReactNode } from "react";
import { ComplianceFooter } from "./ComplianceFooter";
import { MarketTickerStrip } from "./MarketTickerStrip";
import { QuantSidebar } from "./QuantSidebar";
import { QuantTopbar } from "./QuantTopbar";

/**
 * Props for the master workstation shell.
 */
export interface QuantShellProps {
  /** Page content to render inside the main workstation canvas */
  readonly children: ReactNode;
  /** Lock outer shell to 100dvh so inner scroll containers own scrolling */
  readonly fillViewport?: boolean;
}

/**
 * QuantAI primary workstation shell.
 * Provides the overarching terminal frame, responsive layout management, and global layout layers.
 */
export function QuantShell({ children, fillViewport = false }: QuantShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div
      className={`quant-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""} ${fillViewport ? "quant-shell--fill-viewport" : ""}`}
    >
      <QuantSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="quant-main-wrapper">
        <QuantTopbar />
        <MarketTickerStrip />

        <main
          className={`quant-content-body ${fillViewport ? "quant-content-body--fill-viewport" : ""}`}
          role="main"
        >
          {children}
          {!fillViewport && <ComplianceFooter />}
        </main>
      </div>
    </div>
  );
}
