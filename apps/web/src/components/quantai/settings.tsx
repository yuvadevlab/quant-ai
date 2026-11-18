/**
 * @file apps/web/src/components/quantai/settings.tsx
 * @description Settings workspace adapter re-exporting from @/features/settings.
 */

import { SettingsPage, getSettingsData, type SettingsData } from "@/features/settings";
import { useEffect, useState } from "react";

export function SettingsWorkspace() {
  const [data, setData] = useState<SettingsData | null>(null);

  useEffect(() => {
    void getSettingsData().then(setData);
  }, []);

  if (!data) return null;
  return <SettingsPage initialData={data} />;
}
