/**
 * @file src/features/screener/api/getScreenerData.ts
 * @description Data provider for the Quantitative Market Screener.
 */

import { queryOptions } from "@tanstack/react-query";
import { screenerItems, type ScreenerItem } from "@/components/quantai/data";

export interface ScreenerData {
  readonly items: readonly ScreenerItem[];
  readonly sectors: readonly string[];
}

/**
 * Fetches quantitative screener records and available sector categories.
 *
 * @returns ScreenerData payload
 */
export async function getScreenerData(): Promise<ScreenerData> {
  const sectors = [
    "ALL",
    "Energy",
    "Banking",
    "PSU Banking",
    "Metals",
    "IT",
    "Auto",
    "Telecom",
    "Infrastructure",
  ];

  return {
    items: screenerItems,
    sectors,
  };
}

/**
 * Canonical TanStack Query options for the quantitative screener.
 */
export const screenerQueryOptions = () =>
  queryOptions({
    queryKey: ["screener-data"],
    queryFn: () => getScreenerData(),
    staleTime: 1000 * 30,
  });
