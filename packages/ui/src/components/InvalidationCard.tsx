/**
 * @file packages/ui/src/components/InvalidationCard.tsx
 * @description Invalidation warning card displaying automated risk rules and action slot.
 */

import { cn } from "@yuva-devlab/ui";
import { AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Props for the InvalidationCard component.
 */
export interface InvalidationCardProps {
  /** Rule heading title */
  readonly title?: string;
  /** Detailed hypothesis invalidation conditions */
  readonly description: ReactNode;
  /** Action slot (e.g. link or button to copilot) */
  readonly action?: ReactNode;
  /** Optional icon override */
  readonly icon?: ReactNode;
  /** Custom container class names */
  readonly className?: string;
}

/**
 * High-visibility warning banner communicating strict quantitative invalidation boundaries.
 *
 * @param props - Rule description and action trigger.
 * @returns Rendered JSX InvalidationCard element.
 */
export function InvalidationCard({
  title = "Automated Invalidation Rule",
  description,
  action,
  icon,
  className = "",
}: InvalidationCardProps) {
  return (
    <div className={cn("invalidation-card", className)}>
      <div className="invalidation-icon-box" aria-hidden="true">
        {icon ?? <AlertTriangle size={20} />}
      </div>
      <div className="invalidation-text">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {action && <div className="invalidation-action-wrapper">{action}</div>}
    </div>
  );
}
