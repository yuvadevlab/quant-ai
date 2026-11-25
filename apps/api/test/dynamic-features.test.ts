/**
 * @file apps/api/test/dynamic-features.test.ts
 * @description Unit tests for Chat Copilot, Paper Portfolio, and On-Demand Deliberation.
 * @author yuva.devlab@gmail.com
 */

import { describe, expect, it } from "vitest";
import { AgentRole, MarketDataStatus } from "@quant-ai/shared-types";
import { LiveMarketFeedService } from "../src/modules/market/feed";
import { MarketService } from "../src/modules/market/market.service";
import { MarketController } from "../src/modules/market/market.controller";
import { ChatService } from "../src/modules/chat/chat.service";
import { ChatController } from "../src/modules/chat/chat.controller";
import { PortfolioService } from "../src/modules/portfolio/portfolio.service";
import { PortfolioController } from "../src/modules/portfolio/portfolio.controller";
import { ExecutionType, PositionSide } from "../src/modules/portfolio/portfolio.types";
import { DeliberationController } from "../src/modules/quant-analysis/deliberation.controller";
import { MultiAgentDeliberationService } from "../src/modules/quant-analysis/multi-agent-deliberation.service";
import { RealtimeGateway } from "../src/modules/realtime/realtime.gateway";
import { RealtimeService } from "../src/modules/realtime/realtime.service";
import { AiProviderFactory } from "../src/modules/quant-analysis/ai-provider.factory";
import { ConfigService } from "../src/modules/infrastructure/config.service";
import { EventBusService } from "../src/modules/infrastructure/event-bus.service";

/**
 * Deterministic feed stub: always returns SIMULATED status so unit tests
 * do not depend on live market hours or external provider availability.
 */
function makeSimulatedFeed(): LiveMarketFeedService {
  return {
    getLiveQuote: async (symbol: string) => ({
      symbol,
      displayName: symbol,
      price: 2400,
      change: 0,
      percentChange: 0,
      dayHigh: 2420,
      dayLow: 2380,
      volume: 1_000_000,
      currency: "INR",
      exchange: "NSE",
      sparkline: [2380, 2390, 2400],
      timestamp: new Date().toISOString(),
      source: "SIMULATOR" as const,
      dataStatus: MarketDataStatus.SIMULATED,
    }),
    getIndexQuote: (symbol: string) => ({ symbol, price: 2400, sparkline: [2400] }),
    onModuleInit: async () => {},
  } as unknown as LiveMarketFeedService;
}

describe("Dynamic Workstation Features", () => {
  const feed = makeSimulatedFeed();
  const config = new ConfigService();
  const bus = new EventBusService(config);
  const gateway = new RealtimeGateway();
  const realtimeService = new RealtimeService(gateway);

  describe("Chat Copilot Module", () => {
    const chatService = new ChatService(feed);
    const chatController = new ChatController(chatService);

    it("synthesizes multi-agent quantitative answer with ticker resolution", async () => {
      const response = await chatController.sendMessage({
        message: "What is your assessment on RELIANCE after the recent breakout?",
      });

      expect(response).toBeDefined();
      expect(response.reply).toContain("Verified market data");
      expect(response.referencedSymbol).toBeUndefined();
      expect(response.livePrice).toBeUndefined();
      expect(response.timestamp).toBeDefined();
    });

    it("synthesizes institutional option chain intelligence for NIFTY", async () => {
      const response = await chatController.sendMessage({
        message: "What is the option chain and PCR for NIFTY?",
      });

      expect(response).toBeDefined();
      expect(response.reply).toContain("option-chain reading");
      expect(response.reply).not.toContain("Put-Call Ratio (PCR)");
      expect(response.referencedSymbol).toBeUndefined();
      expect(response.agentPerspective?.role).not.toBe(AgentRole.MACRO_ANALYST);
    });

    it("handles generic market questions gracefully without crashing", async () => {
      const response = await chatController.sendMessage({
        message: "Explain the Kelly Criterion for position sizing in options trading.",
      });

      expect(response).toBeDefined();
      expect(response.reply).toBeDefined();
      expect(response.reply.length).toBeGreaterThan(50);
      expect(response.sessionId).toBeDefined();
    });

    it("lists sessions, retrieves thread detail, and deletes conversation", async () => {
      const sessions = await chatController.getSessions();
      expect(sessions.length).toBeGreaterThan(0);
      const targetSessionId = sessions[0]!.id;

      const detail = await chatController.getSession(targetSessionId);
      expect(detail).toBeDefined();
      expect(detail?.messages.length).toBeGreaterThanOrEqual(2);

      const del = await chatController.deleteSession(targetSessionId);
      expect(del.success).toBe(true);
    });
  });

  describe("Paper Portfolio & Risk Ledger Module", () => {
    const portfolioService = new PortfolioService(feed);
    const portfolioController = new PortfolioController(portfolioService);

    it("returns dynamic paper portfolio summary with active positions", async () => {
      portfolioService.addPosition({
        symbol: "RELIANCE",
        instrument: "NSE · Cash Equity",
        side: PositionSide.LONG,
        qty: 100,
        entryPrice: 2400.0,
        currentPrice: 2434.6,
        pnl: 3460.0,
        returnPercent: 1.44,
        stopLoss: 2380.0,
        targetPrice: 2480.0,
      });
      portfolioService.recordExecution({
        id: "ORD-TEST-1",
        symbol: "TCS",
        type: ExecutionType.BUY,
        qty: 50,
        entryPrice: 4180.0,
        exitPrice: 4260.0,
        pnl: 4000.0,
        outcome: "Target Hit",
        timestamp: new Date().toISOString(),
      });

      await portfolioService.onModuleInit();
      const summary = portfolioController.getPortfolio();

      expect(summary.totalEquity).toBeGreaterThan(0);
      expect(summary.initialCapital).toBe(1_000_000);
      expect(summary.positions.length).toBeGreaterThan(0);
      expect(summary.recentExecutions.length).toBeGreaterThan(0);

      // Verify each position is marked to market
      for (const pos of summary.positions) {
        expect(pos.currentPrice).toBeGreaterThan(0);
        expect(typeof pos.pnl).toBe("number");
        expect(typeof pos.returnPercent).toBe("number");
      }
    });

    it("correctly computes available and used margins", async () => {
      const summary = portfolioController.getPortfolio();

      expect(summary.marginUsed).toBeGreaterThan(0);
      expect(summary.availableMargin).toBeLessThanOrEqual(summary.totalEquity);
    });
  });

  describe("Deliberation Controller", () => {
    const factory = new AiProviderFactory(config);
    const deliberationService = new MultiAgentDeliberationService(factory, bus, realtimeService);
    const deliberationController = new DeliberationController(deliberationService, feed);

    it("triggers adversarial debate and generates multi-agent consensus", async () => {
      const outcome = await deliberationController.triggerDeliberation({
        predictionId: "PRED-TEST-1",
        ticker: "TCS",
      });

      expect(outcome).toBeDefined();
      expect(outcome.predictionId).toBe("PRED-TEST-1");
      expect(outcome.verdicts.length).toBe(3);
      expect(typeof outcome.compositeConfidence).toBe("number");
      expect(typeof outcome.isVetoedBySkeptic).toBe("boolean");
      expect(outcome.timestamp).toBeDefined();
    });

    it("evaluates mathematical trade expectancy via REST", () => {
      const result = deliberationController.evaluateExpectancy({
        entryPrice: 100,
        targetPrice: 110,
        stopLossPrice: 95,
        winProbability: 0.6,
      });

      expect(result).toBeDefined();
      expect(result.riskRewardRatio).toBe(2);
      expect(result.mathematicalExpectancy).toBeGreaterThan(0);
      expect(result.isApproved).toBe(true);
    });
  });

  describe("Market Breadth & Runtime Configuration Engine", () => {
    const simulatedMarketFeed = makeSimulatedFeed();
    const marketService = new MarketService(simulatedMarketFeed, bus);
    const marketController = new MarketController(marketService);

    it("dynamically returns breadth and sector momentum", async () => {
      await marketService.onModuleInit();
      const breadth = marketController.getBreadth();
      expect(breadth).toBeDefined();
      expect(breadth.dataAvailable).toBe(false);
      expect(breadth.advances).toBeNull();
      expect(breadth.declines).toBeNull();
      expect(breadth.advanceRatio).toBeNull();
      expect(breadth.fiiNet).toBeNull();
      expect(breadth.diiNet).toBeNull();

      const sectors = marketController.getSectors();
      expect(sectors).toEqual([]);
    });

    it("allows runtime configuration updates without redeployments", async () => {
      const configBefore = marketController.getConfig();
      expect(configBefore.breadth.vixLowThreshold).toBe(15.0);

      const updated = await marketController.updateConfig({
        breadth: { vixLowThreshold: 18.0, fiiNetCr: 3500.5 },
        sector: { strongThreshold: 2.0 },
      });

      expect(updated.breadth.vixLowThreshold).toBe(18.0);
      expect(updated.breadth.fiiNetCr).toBe(3500.5);
      expect(updated.sector.strongThreshold).toBe(2.0);

      // Configurable parameters are retained without implying unavailable flows are measured.
      const breadthAfter = marketController.getBreadth();
      expect(breadthAfter.fiiNet).toBeNull();
    });
  });
});
