import { Injectable } from "@nestjs/common";
import { AgentStance } from "@quant-ai/contracts";
import { ScreenerItem, ScreenerQueryDto } from "./screener.types";

/**
 * Service providing quantitative stock filtering, breakout scans, and volume anomaly detection.
 */
@Injectable()
export class ScreenerService {
  private readonly universe: readonly ScreenerItem[] = [
    {
      symbol: "RELIANCE",
      name: "Reliance Industries Ltd.",
      price: 3042.5,
      changePercent: 1.93,
      volumeRatio: 2.8,
      rsi: 68.4,
      trend: AgentStance.BULLISH,
      breakoutType: "20-Day High Breakout",
      sector: "Energy",
    },
    {
      symbol: "HDFCBANK",
      name: "HDFC Bank Ltd.",
      price: 1748.2,
      changePercent: 0.85,
      volumeRatio: 1.4,
      rsi: 54.2,
      trend: AgentStance.NEUTRAL,
      sector: "Banking",
    },
    {
      symbol: "INFY",
      name: "Infosys Ltd.",
      price: 1892.0,
      changePercent: -1.15,
      volumeRatio: 1.9,
      rsi: 42.1,
      trend: AgentStance.BEARISH,
      sector: "Technology",
    },
    {
      symbol: "TCS",
      name: "Tata Consultancy Services",
      price: 4185.0,
      changePercent: 1.58,
      volumeRatio: 2.1,
      rsi: 61.8,
      trend: AgentStance.BULLISH,
      breakoutType: "Cup & Handle Breakout",
      sector: "Technology",
    },
    {
      symbol: "ICICIBANK",
      name: "ICICI Bank Ltd.",
      price: 1264.3,
      changePercent: 1.12,
      volumeRatio: 1.7,
      rsi: 59.5,
      trend: AgentStance.BULLISH,
      sector: "Banking",
    },
    {
      symbol: "BHARTIARTL",
      name: "Bharti Airtel Ltd.",
      price: 1590.4,
      changePercent: 2.35,
      volumeRatio: 3.1,
      rsi: 72.1,
      trend: AgentStance.BULLISH,
      breakoutType: "52-Week High Breakout",
      sector: "Telecom",
    },
    {
      symbol: "LT",
      name: "Larsen & Toubro Ltd.",
      price: 3680.0,
      changePercent: 0.45,
      volumeRatio: 1.2,
      rsi: 51.3,
      trend: AgentStance.NEUTRAL,
      sector: "Capital Goods",
    },
  ];

  /**
   * Retrieves all instruments in the screener universe.
   *
   * @returns Array of screened financial instruments.
   */
  findAll(): readonly ScreenerItem[] {
    return this.universe;
  }

  /**
   * Filters the instrument universe based on multi-variable quantitative criteria.
   *
   * @param query Filtering thresholds.
   * @returns Array of matching instruments.
   */
  filter(query: ScreenerQueryDto): readonly ScreenerItem[] {
    return this.universe.filter((item) => {
      if (query.minRsi !== undefined && item.rsi < query.minRsi) return false;
      if (query.maxRsi !== undefined && item.rsi > query.maxRsi) return false;
      if (query.minVolumeRatio !== undefined && item.volumeRatio < query.minVolumeRatio) {
        return false;
      }
      if (query.trend && item.trend !== query.trend) return false;
      if (query.sector && item.sector.toLowerCase() !== query.sector.toLowerCase()) {
        return false;
      }
      return true;
    });
  }

  /**
   * Retrieves active technical breakout candidates.
   *
   * @returns Array of instruments experiencing active technical breakouts.
   */
  findBreakouts(): readonly ScreenerItem[] {
    return this.universe.filter((item) => Boolean(item.breakoutType));
  }

  /**
   * Retrieves instruments with volume surge greater than or equal to 2.0x average.
   *
   * @returns Array of high volume surge instruments.
   */
  findVolumeSurges(): readonly ScreenerItem[] {
    return this.universe.filter((item) => item.volumeRatio >= 2.0);
  }
}
