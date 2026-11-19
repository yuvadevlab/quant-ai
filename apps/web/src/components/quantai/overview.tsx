/**
 * @file apps/web/src/components/quantai/overview.tsx
 * @description Overview desk adapter re-exporting from @/features/overview.
 */

import { OverviewPage, getOverviewData, type OverviewDeskData } from "@/features/overview";
import { useEffect, useState } from "react";

export function OverviewDesk() {
  const [data, setData] = useState<OverviewDeskData | null>(null);

  useEffect(() => {
    void getOverviewData().then(setData);
  }, []);

  if (!data) return null;
  return <OverviewPage initialData={data} />;
}
