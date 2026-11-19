import { Injectable, NotFoundException } from "@nestjs/common";
import {
  AgentRole,
  AgentStance,
  Signal,
  SignalDirection,
  SignalRegime,
  SignalStatus,
  TrajectoryPoint,
} from "@quant-ai/shared-types";

/**
 * Service managing immutable prediction ledgers and outcome tracking.
 */
@Injectable()
export class PredictionsService {
  private readonly predictions: readonly Signal[] = [
    {
      id: "PRED-8942",
      ticker: "RELIANCE",
      name: "Reliance Industries Ltd.",
      direction: SignalDirection.LONG,
      entry: 2985.0,
      current: 3042.5,
      target: 3120.0,
      stopLoss: 2940.0,
      horizon: "2-3 Weeks",
      confidence: 88,
      status: SignalStatus.ACTIVE,
      regime: SignalRegime.BULLISH_EXPANSION,
      pnlPercent: 1.93,
      pnlAbsolute: 57.5,
      maxExcursion: 2.15,
      maxAdverse: 0.35,
      publishedAt: "2026-11-14T09:30:00Z",
      thesis:
        "High-volume breakout above 2,980 consolidation band supported by institutional delivery accumulation.",
      riskReward: 3.0,
      catalysts: ["Upstream refining margin expansion", "Retail segment quarterly EBITDA surge"],
      invalidation: "Daily close below 2,935 invalidates structural momentum.",
      trajectory: [
        { time: "Day 1", expected: 2985, actual: 2985, upper: 3010, lower: 2960 },
        { time: "Day 3", expected: 3020, actual: 3015, upper: 3050, lower: 2980 },
        { time: "Day 5", expected: 3050, actual: 3042, upper: 3090, lower: 3000 },
        { time: "Day 10", expected: 3120, upper: 3160, lower: 3060 },
      ],
      agents: [
        {
          role: AgentRole.MOMENTUM_ANALYST,
          stance: AgentStance.BULLISH,
          confidence: 89,
          summary: "Z-score of 2.1 relative to 20-day standard deviation bands.",
        },
        {
          role: AgentRole.RED_TEAM_SKEPTIC,
          stance: AgentStance.BULLISH,
          confidence: 86,
          summary: "Bullish cup & handle pattern confirmed with MACD divergence.",
        },
        {
          role: AgentRole.QUANT_RISK_OFFICER,
          stance: AgentStance.NEUTRAL,
          confidence: 90,
          summary: "Reward to risk of 3.0 exceeds 2.0 institutional threshold.",
        },
      ],
    },
    {
      id: "PRED-8943",
      ticker: "TCS",
      name: "Tata Consultancy Services",
      direction: SignalDirection.LONG,
      entry: 4120.0,
      current: 4185.0,
      target: 4280.0,
      stopLoss: 4060.0,
      horizon: "1-2 Weeks",
      confidence: 82,
      status: SignalStatus.ACTIVE,
      regime: SignalRegime.BULLISH_EXPANSION,
      pnlPercent: 1.58,
      pnlAbsolute: 65.0,
      maxExcursion: 1.82,
      maxAdverse: 0.22,
      publishedAt: "2026-11-15T10:15:00Z",
      thesis: "IT index mean-reversion following oversold daily RSI levels.",
      riskReward: 2.67,
      catalysts: ["Large enterprise BFSI deal wins"],
      invalidation: "Breakdown below 4,050 support.",
      trajectory: [],
      agents: [],
    },
  ];

  /**
   * Retrieves all predictions.
   *
   * @returns Array of active and historical predictions.
   */
  findAll(): readonly Signal[] {
    return this.predictions;
  }

  /**
   * Retrieves a single prediction by ID.
   *
   * @param id The prediction unique identifier (e.g. PRED-8942).
   * @returns The Signal object if found.
   */
  findById(id: string): Signal {
    const signal = this.predictions.find((p) => p.id === id);
    if (!signal) {
      throw new NotFoundException(`Prediction with ID ${id} not found`);
    }
    return signal;
  }

  /**
   * Retrieves or computes trajectory cone points for a prediction.
   *
   * @param id The prediction unique identifier.
   * @returns Array of trajectory points with expected, upper, and lower quantile bounds.
   */
  getTrajectory(id: string): readonly TrajectoryPoint[] {
    const signal = this.findById(id);
    if (signal.trajectory.length > 0) {
      return signal.trajectory;
    }

    // Dynamic projection when explicit historical points are not precomputed
    const steps = 10;
    const priceDelta = (signal.target - signal.entry) / steps;
    const bandSpread = Math.abs(signal.entry - signal.stopLoss) * 0.5;

    return Array.from({ length: steps + 1 }, (_, index) => ({
      time: `Day ${index}`,
      expected: Math.round(signal.entry + priceDelta * index),
      upper: Math.round(signal.entry + priceDelta * index + bandSpread * (1 + index * 0.1)),
      lower: Math.round(signal.entry + priceDelta * index - bandSpread * (1 + index * 0.1)),
    }));
  }
}
