/**
 * @file src/features/overview/components/OverviewPage.tsx
 * @description Master Executive Market Desk page wrapper.
 * Composes layout shell, market ticks, breadth matrix, active signal spotlights, and launchpad.
 */

import { QuantShell } from "@/components/layout";
import { OverviewHeader } from "./OverviewHeader";
import { OverviewIndicesGrid } from "./OverviewIndicesGrid";
import { OverviewBreadthSectors } from "./OverviewBreadthSectors";
import { OverviewSpotlight } from "./OverviewSpotlight";
import { WorkstationLaunchpad } from "./OverviewLaunchpad";
import type { OverviewDeskData } from "../api/getOverviewData";

export interface OverviewPageProps {
  readonly initialData: OverviewDeskData;
}

/**
 * Executive market desk page wrapper component.
 *
 * @param props - SSR preloaded overview data
 * @returns Rendered JSX workstation desk
 */
export function OverviewPage({ initialData }: OverviewPageProps) {
  return (
    <QuantShell>
      <div className="overview-container">
        <OverviewHeader />
        <OverviewIndicesGrid ticks={initialData.ticks} />
        <OverviewBreadthSectors breadth={initialData.breadth} sectors={initialData.sectors} />
        <OverviewSpotlight signals={initialData.spotlightSignals} />
        <WorkstationLaunchpad />
      </div>
    </QuantShell>
  );
}
