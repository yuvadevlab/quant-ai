/**
 * @file packages/ui/src/components/OverviewHero.tsx
 * @description Header hero section for the Executive Market Overview Desk.
 * @author yuva.devlab@gmail.com
 */

import type { ReactNode } from "react";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Button } from "@yuva-devlab/ui";

/**
 * Props for the OverviewHero presentation component.
 */
export interface OverviewHeroProps {
  /** Badge text */
  readonly badgeText?: string;
  /** Main hero title */
  readonly title?: string;
  /** Subtitle narrative */
  readonly subtitle?: string;
  /** Callback when user clicks Ask Copilot */
  readonly onAskCopilot?: () => void;
  /** Callback when user clicks View Predictions */
  readonly onViewPredictions?: () => void;
  /** Custom slot for copilot action (e.g. router Link) */
  readonly copilotActionSlot?: ReactNode;
  /** Custom slot for predictions action (e.g. router Link) */
  readonly predictionsActionSlot?: ReactNode;
}

/**
 * Executive hero banner highlighting market intelligence with quick launch triggers.
 *
 * @param props - OverviewHeroProps containing copy and navigation slots.
 * @returns Rendered JSX OverviewHero element.
 */
export function OverviewHero({
  badgeText = "LIVE INTELLIGENCE · NSE & BSE",
  title = "AI-Driven Quantitative Precision for Indian Markets",
  subtitle = "Multi-agent consensus models, real-time cone trajectory tracking, and automated trade generation across equities, indices, and derivatives.",
  onAskCopilot,
  onViewPredictions,
  copilotActionSlot,
  predictionsActionSlot,
}: OverviewHeroProps) {
  return (
    <section className="overview-hero">
      <div className="hero-text-col">
        <span className="hero-badge">
          <Zap size={14} className="hero-zap" />
          <span>{badgeText}</span>
        </span>
        <h1 className="hero-title">{title}</h1>
        <p className="hero-subtitle">{subtitle}</p>
      </div>
      <div className="hero-actions-col">
        {copilotActionSlot ?? (
          <Button type="button" className="btn-hero-copilot" onClick={onAskCopilot}>
            <Sparkles size={16} />
            <span>ASK COPILOT</span>
          </Button>
        )}
        {predictionsActionSlot ?? (
          <Button type="button" className="btn-hero-predictions" onClick={onViewPredictions}>
            <span>VIEW PREDICTIONS</span>
            <ArrowRight size={16} />
          </Button>
        )}
      </div>
    </section>
  );
}
