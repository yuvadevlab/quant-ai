/**
 * @file packages/ui/src/components/SectionHeader.tsx
 * @description Standardized section header with title, subtitle, and action link.
 */

import type { ReactNode } from "react";
import { cn } from "@yuva-devlab/ui";

/**
 * Props for the SectionHeader component.
 */
export interface SectionHeaderProps {
  /** Section title */
  readonly title: ReactNode;
  /** Optional secondary subtitle */
  readonly subtitle?: ReactNode;
  /** Optional right-aligned action (link, button, filter) */
  readonly action?: ReactNode;
  /** Custom CSS class names */
  readonly className?: string;
}

/**
 * Standardized section header dividing dashboard desks.
 *
 * @param props - Section title, subtitle, and action link.
 * @returns Rendered JSX SectionHeader element.
 */
export function SectionHeader({ title, subtitle, action, className = "" }: SectionHeaderProps) {
  return (
    <div className={cn("section-header-row", className)}>
      <div className="section-header-titles">
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {action && <div className="section-header-action">{action}</div>}
    </div>
  );
}
