/**
 * @file src/components/layout/ComplianceFooter.tsx
 * @description Persistent regulatory & educational research notice banner.
 * @author yuva.devlab@gmail.com
 */

import { ShieldAlert } from "lucide-react";
import { COMMON_COPY } from "../../lib/ui-copy";

/**
 * Universal compliance footer ensuring complete regulatory clarity across all workstation desks.
 */
export function ComplianceFooter() {
  return (
    <footer className="global-compliance-footer" role="contentinfo">
      <div className="compliance-icon-wrap" aria-hidden="true">
        <ShieldAlert size={18} />
      </div>
      <div className="compliance-text-content">
        <strong>{COMMON_COPY.REGULATORY_DISCLAIMER.HEADING}:</strong>
        <p>{COMMON_COPY.REGULATORY_DISCLAIMER.CONTENT}</p>
        <span className="compliance-copyright">{COMMON_COPY.REGULATORY_DISCLAIMER.COPYRIGHT}</span>
      </div>
    </footer>
  );
}
