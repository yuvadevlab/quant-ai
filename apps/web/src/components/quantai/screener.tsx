/**
 * @file apps/web/src/components/quantai/screener.tsx
 * @description Screener desk adapter re-exporting from @/features/screener.
 */

import { ScreenerPage, getScreenerData, type ScreenerData } from "@/features/screener";
import { useEffect, useState } from "react";

export function ScreenerDesk() {
  const [data, setData] = useState<ScreenerData | null>(null);

  useEffect(() => {
    void getScreenerData().then(setData);
  }, []);

  if (!data) return null;
  return <ScreenerPage initialData={data} />;
}
