/**
 * @file src/features/overview/components/OverviewSpotlight.tsx
 * @description Active high-conviction signals spotlight section.
 * @author yuva.devlab@gmail.com
 */

import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { Signal } from "@/components/quantai/data";
import { UiSignalDirection } from "@/components/quantai/data";
import { AppRoute } from "@/constants/routes.constants";
import { OVERVIEW_COPY } from "@/lib/ui-copy/overview.copy";

export interface OverviewSpotlightProps {
  readonly signals: readonly Signal[];
}

export function OverviewSpotlight({ signals }: OverviewSpotlightProps) {
  const copy = OVERVIEW_COPY.SPOTLIGHT;

  return (
    <section className="signals-spotlight-section">
      <div className="spotlight-header">
        <div>
          <div className="section-label">{copy.SECTION_LABEL}</div>
          <h2 className="section-title">{copy.TITLE}</h2>
        </div>
        <Link to={AppRoute.PREDICTIONS} className="view-all-signals-link">
          <span>{copy.VIEW_ALL_LEDGER}</span>
          <ChevronRight size={16} />
        </Link>
      </div>

      <div className="signals-spotlight-grid">
        {signals.map((signal) => (
          <div className="signal-spotlight-card" key={signal.id}>
            <div className="card-top-row">
              <div className="signal-identity">
                <span className="signal-id-tag">{signal.id}</span>
                <h3 className="signal-symbol">{signal.symbol}</h3>
                <span className="signal-company">{signal.companyName}</span>
              </div>
              <div className="signal-badge-col">
                <span
                  className={`direction-badge ${signal.direction === UiSignalDirection.BUY ? "badge-buy" : "badge-sell"}`}
                >
                  {signal.direction}
                </span>
                <span className="horizon-badge">{signal.horizon}</span>
              </div>
            </div>

            <div className="price-matrix-grid">
              <div className="matrix-cell">
                <span className="cell-label">{copy.ENTRY_ZONE}</span>
                <span className="cell-val mono">{signal.entry}</span>
              </div>
              <div className="matrix-cell">
                <span className="cell-label">{copy.CURRENT_LTP}</span>
                <span className="cell-val mono highlight">{signal.last}</span>
              </div>
              <div className="matrix-cell">
                <span className="cell-label">{copy.TARGET_1}</span>
                <span className="cell-val mono text-gain">{signal.target1}</span>
              </div>
              <div className="matrix-cell">
                <span className="cell-label">{copy.STOP_LOSS}</span>
                <span className="cell-val mono text-loss">{signal.stop}</span>
              </div>
            </div>

            <div className="catalysts-pills">
              {signal.catalysts.map((cat) => (
                <span className="catalyst-pill" key={cat}>
                  {cat}
                </span>
              ))}
            </div>

            <div className="card-footer-row">
              <div className="confidence-block">
                <span className="conf-label">{copy.AGENT_CONVICTION}</span>
                <div className="conf-bar-wrapper">
                  <div className="conf-bar-fill" style={{ width: signal.confidence }} />
                  <span className="conf-val">{signal.confidence}</span>
                </div>
              </div>

              <Link
                to="/predictions/$id"
                params={{ id: signal.id }}
                className="btn-inspect-trajectory"
              >
                <span>{copy.INSPECT_TRAJECTORY}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
