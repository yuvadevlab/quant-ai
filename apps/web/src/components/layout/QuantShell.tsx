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
}

/**
 * QuantAI primary workstation shell.
 * Provides the overarching terminal frame, responsive layout management, and global layout layers.
 */
export function QuantShell({ children }: QuantShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={`quant-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <QuantSidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="quant-main-wrapper">
        <QuantTopbar />
        <MarketTickerStrip />

        <main className="quant-content-body" role="main">
          {children}
          <ComplianceFooter />
        </main>
      </div>
    </div>
  );
}
