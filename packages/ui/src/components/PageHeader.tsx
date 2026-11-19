/**
 * @file packages/ui/src/components/PageHeader.tsx
 * @description Standardized desk header with breadcrumbs, title, subtitle, and action slots.
 */

import type { ReactNode } from "react";
import { cn } from "@yuva-devlab/ui";

/**
 * Props for the PageHeader component.
 */
export interface PageHeaderProps {
  /** Page or desk title */
  readonly title: ReactNode;
  /** Explanatory subtitle or desk description */
  readonly subtitle?: ReactNode;
  /** Optional breadcrumb trail */
  readonly breadcrumb?: ReactNode;
  /** Optional right-aligned actions (buttons, tags, filters) */
  readonly actions?: ReactNode;
  /** Custom CSS class names */
  readonly className?: string;
}

/**
 * Standardized workstation desk header component.
 *
 * @param props - Header titles, breadcrumbs, and action elements.
 * @returns Rendered JSX PageHeader element.
 */
export function PageHeader({
  title,
  subtitle,
  breadcrumb,
  actions,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={cn("desk-header", className)}>
      <div className="desk-header-content">
        {breadcrumb && <div className="desk-breadcrumb">{breadcrumb}</div>}
        <h1 className="desk-title">{title}</h1>
        {subtitle && <p className="desk-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="desk-actions">{actions}</div>}
    </div>
  );
}
