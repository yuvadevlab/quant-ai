/**
 * @file packages/ui/src/components/WorkstationLaunchpad.tsx
 * @description Quick action workstation launchpad cards.
 */

import type { ReactNode } from "react";
import { ArrowRight, Bot, Filter, LineChart } from "lucide-react";

/**
 * Props for the WorkstationLaunchpad presentation component.
 */
export interface WorkstationLaunchpadProps {
  /** Optional custom slot for Screener card (e.g. router Link) */
  readonly screenerSlot?: ReactNode;
  /** Optional custom slot for Predictions card (e.g. router Link) */
  readonly predictionsSlot?: ReactNode;
  /** Optional custom slot for Copilot card (e.g. router Link) */
  readonly copilotSlot?: ReactNode;
  /** Callback when user clicks Screener card */
  readonly onLaunchScreener?: () => void;
  /** Callback when user clicks Predictions card */
  readonly onLaunchPredictions?: () => void;
  /** Callback when user clicks Copilot card */
  readonly onLaunchCopilot?: () => void;
  /** Section label text */
  readonly sectionLabel?: string;
  /** Section title text */
  readonly sectionTitle?: string;
}

/**
 * Institutional quick navigation launchpad for Screener, Prediction Lab, and AI Copilot.
 *
 * @param props - WorkstationLaunchpadProps containing navigation slots and handlers.
 * @returns Rendered JSX WorkstationLaunchpad element.
 */
export function WorkstationLaunchpad({
  screenerSlot,
  predictionsSlot,
  copilotSlot,
  onLaunchScreener,
  onLaunchPredictions,
  onLaunchCopilot,
  sectionLabel = "WORKSTATION NAVIGATION",
  sectionTitle = "Institutional Analytics Suites",
}: WorkstationLaunchpadProps) {
  return (
    <section className="launchpad-section" aria-label="Workstation Quick Launchpad">
      <div className="section-label">{sectionLabel}</div>
      <h2 className="section-title">{sectionTitle}</h2>

      <div className="launchpad-grid">
        {screenerSlot ?? (
          <div
            role="button"
            tabIndex={0}
            className="launchpad-card cursor-pointer"
            onClick={onLaunchScreener}
            onKeyDown={(e) => e.key === "Enter" && onLaunchScreener?.()}
          >
            <div className="launchpad-icon-wrap icon-cyan">
              <Filter size={20} />
            </div>
            <div className="launchpad-content">
              <h3 className="launchpad-title">Quantitative Screener</h3>
              <p className="launchpad-desc">
                Filter 500+ NSE equities across technical breakouts, RSI momentum, and options
                buildup.
              </p>
            </div>
            <span className="launchpad-action">
              Open Screener <ArrowRight size={14} />
            </span>
          </div>
        )}

        {predictionsSlot ?? (
          <div
            role="button"
            tabIndex={0}
            className="launchpad-card cursor-pointer"
            onClick={onLaunchPredictions}
            onKeyDown={(e) => e.key === "Enter" && onLaunchPredictions?.()}
          >
            <div className="launchpad-icon-wrap icon-emerald">
              <LineChart size={20} />
            </div>
            <div className="launchpad-content">
              <h3 className="launchpad-title">Prediction Lab & Ledger</h3>
              <p className="launchpad-desc">
                Audit live trading signals, inspect multi-agent cones, and review historical hit
                rates.
              </p>
            </div>
            <span className="launchpad-action">
              Audit Signals <ArrowRight size={14} />
            </span>
          </div>
        )}

        {copilotSlot ?? (
          <div
            role="button"
            tabIndex={0}
            className="launchpad-card cursor-pointer"
            onClick={onLaunchCopilot}
            onKeyDown={(e) => e.key === "Enter" && onLaunchCopilot?.()}
          >
            <div className="launchpad-icon-wrap icon-blue">
              <Bot size={20} />
            </div>
            <div className="launchpad-content">
              <h3 className="launchpad-title">AI Financial Copilot</h3>
              <p className="launchpad-desc">
                Consult multi-agent consensus models for thesis stress-testing and risk assessments.
              </p>
            </div>
            <span className="launchpad-action">
              Consult Copilot <ArrowRight size={14} />
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
