/**
 * @file packages/ui/src/components/ComplianceFooter.tsx
 * @description Persistent regulatory & educational research notice banner.
 */

import { ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@yuva-devlab/ui";

/**
 * Props for the ComplianceFooter component.
 */
export interface ComplianceFooterProps {
  /** Optional heading override */
  readonly heading?: string;
  /** Optional disclaimer content override */
  readonly content?: ReactNode;
  /** Optional copyright note */
  readonly copyright?: string;
  /** Custom CSS class names */
  readonly className?: string;
}

const DEFAULT_HEADING = "REGULATORY NOTICE & EDUCATIONAL RESEARCH DISCLAIMER";
const DEFAULT_CONTENT =
  "QuantAI is strictly a financial engineering testbed and quantitative research platform. All signals, probabilistic price cones, forecasts, and AI deliberations generated within this workstation are for educational and academic market structure research only. QuantAI is NOT a SEBI-registered Research Analyst or Investment Adviser. No content herein constitutes financial, investment, or trading advice.";
const DEFAULT_COPYRIGHT = "© 2026 Yuva DevLab · QuantAI Workstation · All rights reserved.";

/**
 * Universal compliance footer ensuring complete regulatory clarity across all workstation desks.
 *
 * @param props - Custom disclaimer text overrides.
 * @returns Rendered JSX ComplianceFooter element.
 */
export function ComplianceFooter({
  heading = DEFAULT_HEADING,
  content = DEFAULT_CONTENT,
  copyright = DEFAULT_COPYRIGHT,
  className = "",
}: ComplianceFooterProps) {
  return (
    <footer className={cn("global-compliance-footer", className)} role="contentinfo">
      <div className="compliance-icon-wrap" aria-hidden="true">
        <ShieldAlert size={18} />
      </div>
      <div className="compliance-text-content">
        <strong>{heading}:</strong>
        <p>{content}</p>
        <span className="compliance-copyright">{copyright}</span>
      </div>
    </footer>
  );
}
