/**
 * @file packages/ui/src/components/OverviewSpotlight.tsx
 * @description Active high-conviction signals spotlight section.
 */

import type { ReactNode } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Card, Button } from "@yuva-devlab/ui";
import type { TableSignalItem } from "../types";

/**
 * Props for the OverviewSpotlight presentation component.
 */
export interface OverviewSpotlightProps {
  /** Array of active featured signals */
  readonly signals: readonly TableSignalItem[];
  /** Optional link slot to view all signals in ledger */
  readonly viewAllLinkSlot?: ReactNode;
  /** Callback when user clicks view all signals */
  readonly onViewAll?: () => void;
  /** Optional custom action link renderer for each signal card */
  readonly renderInspectLink?: (signal: TableSignalItem) => ReactNode;
  /** Optional inspect click callback */
  readonly onInspect?: (signalId: string) => void;
  /** Section label text */
  readonly sectionLabel?: string;
  /** Section title text */
  readonly sectionTitle?: string;
  /** View all link text */
  readonly viewAllLabel?: string;
}

/**
 * High-conviction signal cards spotlight grid with parameter matrices and confidence bars.
 *
 * @param props - OverviewSpotlightProps containing signals and interaction handlers.
 * @returns Rendered JSX OverviewSpotlight element.
 */
export function OverviewSpotlight({
  signals,
  viewAllLinkSlot,
  onViewAll,
  renderInspectLink,
  onInspect,
  sectionLabel = "ACTIVE PREDICTION CALLS",
  sectionTitle = "High-Conviction Algorithmic Setups",
  viewAllLabel = "VIEW ALL 24 SIGNALS IN LEDGER",
}: OverviewSpotlightProps) {
  return (
    <section className="signals-spotlight-section">
      <div className="spotlight-header">
        <div>
          <div className="section-label">{sectionLabel}</div>
          <h2 className="section-title">{sectionTitle}</h2>
        </div>
        {viewAllLinkSlot ?? (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            className="view-all-signals-link p-0 h-auto"
          >
            <span>{viewAllLabel}</span>
            <ChevronRight size={16} />
          </Button>
        )}
      </div>

      <div className="signals-spotlight-grid">
        {signals.map((signal) => {
          const isBuy = signal.direction.toUpperCase() === "BUY";

          return (
            <Card className="signal-spotlight-card" key={signal.id}>
              <div className="card-top-row">
                <div className="signal-identity">
                  <span className="signal-id-tag">{signal.id}</span>
                  <h3 className="signal-symbol">{signal.symbol}</h3>
                  {signal.companyName && (
                    <span className="signal-company">{signal.companyName}</span>
                  )}
                </div>
                <div className="signal-badge-col">
                  <span className={`direction-badge ${isBuy ? "badge-buy" : "badge-sell"}`}>
                    {signal.direction}
                  </span>
                  <span className="horizon-badge">{signal.horizon}</span>
                </div>
              </div>

              <div className="price-matrix-grid">
                <div className="matrix-cell">
                  <span className="cell-label">ENTRY ZONE</span>
                  <span className="cell-val mono">{signal.entry}</span>
                </div>
                <div className="matrix-cell">
                  <span className="cell-label">CURRENT LTP</span>
                  <span className="cell-val mono highlight">{signal.last}</span>
                </div>
                <div className="matrix-cell">
                  <span className="cell-label">TARGET 1</span>
                  <span className="cell-val mono text-gain">{signal.target1}</span>
                </div>
                <div className="matrix-cell">
                  <span className="cell-label">STOP LOSS</span>
                  <span className="cell-val mono text-loss">{signal.stop}</span>
                </div>
              </div>

              {signal.catalysts && signal.catalysts.length > 0 && (
                <div className="catalysts-pills">
                  {signal.catalysts.map((cat) => (
                    <span className="catalyst-pill" key={cat}>
                      {cat}
                    </span>
                  ))}
                </div>
              )}

              <div className="card-footer-row">
                {signal.confidence && (
                  <div className="confidence-block">
                    <span className="conf-label">HEURISTIC SCORE</span>
                    <div className="conf-bar-wrapper">
                      <div className="conf-bar-fill" style={{ width: signal.confidence }} />
                      <span className="conf-val">{signal.confidence}</span>
                    </div>
                  </div>
                )}

                {renderInspectLink ? (
                  renderInspectLink(signal)
                ) : (
                  <Button
                    type="button"
                    onClick={() => onInspect?.(signal.id)}
                    className="btn-inspect-trajectory"
                  >
                    <span>INSPECT TRAJECTORY</span>
                    <ArrowRight size={14} />
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
