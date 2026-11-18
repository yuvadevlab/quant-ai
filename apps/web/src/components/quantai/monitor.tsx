/**
 * @file src/components/quantai/monitor.tsx
 * @description Execution monitor adapter re-exporting from @/features/monitor.
 */

import { MonitorPage, getMonitorData, type MonitorData } from "@/features/monitor";
import { useEffect, useState } from "react";

export function MonitorWorkspace({ signalId }: { signalId: string }) {
  const [data, setData] = useState<MonitorData | null>(null);

  useEffect(() => {
    void getMonitorData(signalId).then(setData);
  }, [signalId]);

  if (!data) return null;
  return <MonitorPage initialData={data} />;
}
