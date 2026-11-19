/**
 * @file apps/web/src/components/quantai/predictions.tsx
 * @description Predictions workspace adapter re-exporting from @/features/predictions.
 */

import { PredictionsPage, getPredictionsData, type PredictionsData } from "@/features/predictions";
import { useEffect, useState } from "react";

export function PredictionsWorkspace() {
  const [data, setData] = useState<PredictionsData | null>(null);

  useEffect(() => {
    void getPredictionsData().then(setData);
  }, []);

  if (!data) return null;
  return <PredictionsPage initialData={data} />;
}
