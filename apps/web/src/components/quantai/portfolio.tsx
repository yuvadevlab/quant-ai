/**
 * @file apps/web/src/components/quantai/portfolio.tsx
 * @description Portfolio desk adapter re-exporting from @/features/portfolio.
 */

import { PortfolioPage, getPortfolioData, type PortfolioData } from "@/features/portfolio";
import { useEffect, useState } from "react";

export function PortfolioDesk() {
  const [data, setData] = useState<PortfolioData | null>(null);

  useEffect(() => {
    void getPortfolioData().then(setData);
  }, []);

  if (!data) return null;
  return <PortfolioPage initialData={data} />;
}
