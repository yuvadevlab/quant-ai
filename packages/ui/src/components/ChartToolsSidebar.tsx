/**
 * @file packages/ui/src/components/ChartToolsSidebar.tsx
 * @description TradingView-style left drawing and analysis tool strip for canvas interaction.
 */

import { useState } from "react";
import {
  Crosshair,
  TrendingUp,
  Minus,
  Percent,
  Type,
  Ruler,
  ZoomIn,
  ZoomOut,
  Trash2,
} from "lucide-react";
import { Button } from "@yuva-devlab/ui";

export type DrawingTool =
  "crosshair" | "trendline" | "horizontal" | "fibonacci" | "text" | "measure";

export interface ChartToolsSidebarProps {
  readonly onZoomIn: () => void;
  readonly onZoomOut: () => void;
  readonly onClearDrawings: () => void;
}

export function ChartToolsSidebar({
  onZoomIn,
  onZoomOut,
  onClearDrawings,
}: ChartToolsSidebarProps) {
  const [activeTool, setActiveTool] = useState<DrawingTool>("crosshair");

  return (
    <aside className="tv-tools-sidebar" aria-label="Chart drawing tools">
      <div className="tv-tools-group">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`tv-tool-btn ${activeTool === "crosshair" ? "active" : ""}`}
          title="Crosshair Pointer"
          onClick={() => setActiveTool("crosshair")}
        >
          <Crosshair size={15} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`tv-tool-btn ${activeTool === "trendline" ? "active" : ""}`}
          title="Trendline Tool"
          onClick={() => setActiveTool("trendline")}
        >
          <TrendingUp size={15} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`tv-tool-btn ${activeTool === "horizontal" ? "active" : ""}`}
          title="Horizontal Ray / Support-Resistance"
          onClick={() => setActiveTool("horizontal")}
        >
          <Minus size={15} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`tv-tool-btn ${activeTool === "fibonacci" ? "active" : ""}`}
          title="Fibonacci Retracement"
          onClick={() => setActiveTool("fibonacci")}
        >
          <Percent size={14} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`tv-tool-btn ${activeTool === "text" ? "active" : ""}`}
          title="Text Annotation"
          onClick={() => setActiveTool("text")}
        >
          <Type size={15} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`tv-tool-btn ${activeTool === "measure" ? "active" : ""}`}
          title="Measure / Price Range"
          onClick={() => setActiveTool("measure")}
        >
          <Ruler size={15} />
        </Button>
      </div>

      <div className="tv-tools-divider" />

      <div className="tv-tools-group tv-tools-bottom">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="tv-tool-btn"
          title="Zoom In Time Scale"
          onClick={onZoomIn}
        >
          <ZoomIn size={15} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="tv-tool-btn"
          title="Zoom Out Time Scale"
          onClick={onZoomOut}
        >
          <ZoomOut size={15} />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="tv-tool-btn tv-tool-clear"
          title="Clear Annotations"
          onClick={onClearDrawings}
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </aside>
  );
}
