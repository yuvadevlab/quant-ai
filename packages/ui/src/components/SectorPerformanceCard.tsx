/**
 * @file packages/ui/src/components/SectorPerformanceCard.tsx
 * @description Sector rotation and momentum ranking widget.
 */

import { ArrowDownRight, ArrowUpRight, BarChart3 } from "lucide-react";
import { cn } from "@yuva-devlab/ui";

/**
 * Single sector performance entry.
 */
export interface SectorEntry {
  /** Sector name */
  readonly name: string;
  /** Percentage change */
  readonly change: string;
  /** Whether the change is positive */
  readonly positive: boolean;
}

/**
 * Props for the SectorPerformanceCard component.
 */
export interface SectorPerformanceCardProps {
  /** List of sector performance entries */
  readonly sectors: readonly SectorEntry[];
  /** Status indicator label */
  readonly statusLabel?: string;
  /** Custom CSS classes */
  readonly className?: string;
}

/**
 * Displays sector rotation rankings with visual positive/negative momentum badges.
 *
 * @param props - Sector entries and status label.
 * @returns Rendered JSX SectorPerformanceCard element.
 */
export function SectorPerformanceCard({
  sectors,
  statusLabel = "Live Indices",
  className = "",
}: SectorPerformanceCardProps) {
  return (
    <div className={cn("desk-panel sector-panel", className)}>
      <div className="panel-heading">
        <div className="panel-title-wrap">
          <BarChart3 size={18} className="panel-icon" />
          <h2 className="panel-title">Sector Rotation & Momentum</h2>
        </div>
        <span className="panel-status-pill">{statusLabel}</span>
      </div>

      <div className="sector-grid">
        {sectors.map((sec) => (
          <div className="sector-item" key={sec.name}>
            <span className="sector-name">{sec.name}</span>
            <span className={`sector-pill ${sec.positive ? "pill-gain" : "pill-loss"}`}>
              {sec.positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {sec.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
