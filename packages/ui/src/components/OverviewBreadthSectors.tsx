/**
 * @file packages/ui/src/components/OverviewBreadthSectors.tsx
 * @description 2-column market breadth and sector momentum matrix section.
 * @author yuva.devlab@gmail.com
 */

import type { ReactNode } from "react";
import { BarChart3, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@yuva-devlab/ui";
import { MarketBreadthCard } from "./MarketBreadthCard";
import type { MarketBreadthItem, SectorItem } from "../types";

/**
 * Props for the OverviewBreadthSectors presentation component.
 */
export interface OverviewBreadthSectorsProps {
  /** Market breadth and institutional net flow values */
  readonly breadth: MarketBreadthItem;
  /** Sector momentum rows */
  readonly sectors: readonly SectorItem[];
  /** Optional link slot to navigate to screener */
  readonly screenerLinkSlot?: ReactNode;
  /** Callback when user clicks Screen Sectors */
  readonly onScreenSectors?: () => void;
  /** Panel title */
  readonly title?: string;
  /** Action link text */
  readonly screenSectorsLabel?: string;
}

/**
 * Institutional two-column widget displaying market breadth ratios and sector momentum ranks.
 *
 * @param props - OverviewBreadthSectorsProps containing breadth and sectors data.
 * @returns Rendered JSX OverviewBreadthSectors element.
 */
export function OverviewBreadthSectors({
  breadth,
  sectors,
  screenerLinkSlot,
  onScreenSectors,
  title = "SECTOR MOMENTUM MATRIX",
  screenSectorsLabel = "SCREEN SECTORS",
}: OverviewBreadthSectorsProps) {
  const formattedRatio =
    typeof breadth.advanceRatio === "number" ? `${breadth.advanceRatio}%` : breadth.advanceRatio;

  return (
    <section className="breadth-sector-section">
      <MarketBreadthCard
        advances={breadth.advances}
        declines={breadth.declines}
        advanceRatio={formattedRatio}
        fiiNet={breadth.fiiNet}
        diiNet={breadth.diiNet}
      />

      <Card className="desk-panel sector-panel">
        <CardHeader className="panel-heading">
          <div className="panel-title-wrap">
            <BarChart3 size={18} className="panel-icon" />
            <CardTitle className="panel-title">{title}</CardTitle>
          </div>
          {screenerLinkSlot ?? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onScreenSectors}
              className="panel-link p-0 h-auto"
            >
              {screenSectorsLabel} <ChevronRight size={14} />
            </Button>
          )}
        </CardHeader>

        <CardContent className="sector-list">
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
        </CardContent>
      </Card>
    </section>
  );
}
