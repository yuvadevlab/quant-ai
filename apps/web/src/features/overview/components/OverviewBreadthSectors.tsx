/**
 * @file src/features/overview/components/OverviewBreadthSectors.tsx
 * @description 2-column market breadth and sector momentum matrix section.
 */

import { Link } from "@tanstack/react-router";
import { MarketBreadthCard } from "@quant-ai/ui";
import { BarChart3, ChevronRight } from "lucide-react";
import { AppRoute } from "@/constants/routes.constants";
import type { MarketBreadth, SectorPerformance } from "@/services/market-feed.service";

export interface OverviewBreadthSectorsProps {
  readonly breadth: MarketBreadth;
  readonly sectors: readonly SectorPerformance[];
}

export function OverviewBreadthSectors({ breadth, sectors }: OverviewBreadthSectorsProps) {
  return (
    <section className="breadth-sector-section">
      <MarketBreadthCard
        advances={breadth.advances}
        declines={breadth.declines}
        advanceRatio={breadth.advanceRatio}
        fiiNet={breadth.fiiNet}
        diiNet={breadth.diiNet}
      />

      <div className="desk-panel sector-panel">
        <div className="panel-heading">
          <div className="panel-title-wrap">
            <BarChart3 size={18} className="panel-icon" />
            <h2 className="panel-title">Sector Momentum Matrix</h2>
          </div>
          <Link to={AppRoute.SCREENER} className="panel-link">
            Screen Sectors <ChevronRight size={14} />
          </Link>
        </div>

        <div className="sector-list">
          {sectors.map((sec) => (
            <div className="sector-row" key={sec.name}>
              <div className="sector-info">
                <span className="sector-name">{sec.name}</span>
                <span className={`sector-tag tag-${sec.momentum.toLowerCase()}`}>
                  {sec.momentum}
                </span>
              </div>
              <div className="sector-values">
                <div
                  className={`sector-bar ${sec.positive ? "bar-gain" : "bar-loss"}`}
                  style={{
                    width: `${Math.min(100, Math.abs(parseFloat(sec.change)) * 35)}%`,
                  }}
                />
                <span className={`sector-percent ${sec.positive ? "text-gain" : "text-loss"}`}>
                  {sec.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
