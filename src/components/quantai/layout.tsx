/**
 * @file src/components/quantai/layout.tsx
 * @description Workstation layout adapter delegating to modularized QuantShell.
 * @author yuva.devlab@gmail.com
 */

import type { ReactNode } from "react";
import { QuantShell } from "../layout";

export type WorkspaceTab =
  "overview" | "predictions" | "screener" | "portfolio" | "chat" | "settings";

/**
 * Legacy QuantLayout compatibility wrapper delegating to modern QuantShell.
 */
export function QuantLayout({ children }: { active?: WorkspaceTab; children: ReactNode }) {
  return <QuantShell>{children}</QuantShell>;
}
