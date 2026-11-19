/**
 * @file apps/api/test/dynamic-features.test.ts
 * @description Unit tests for Chat Copilot, Paper Portfolio, and On-Demand Deliberation.
 * @author yuva.devlab@gmail.com
 */

import { describe, expect, it } from "vitest";
import { StochasticMarketSimulator, LiveMarketFeedService } from "../src/modules/market/feed";
import { ChatService } from "../src/modules/chat/chat.service";
import { ChatController } from "../src/modules/chat/chat.controller";
import { PortfolioService } from "../src/modules/portfolio/portfolio.service";
import { PortfolioController } from "../src/modules/portfolio/portfolio.controller";
import { DeliberationController } from "../src/modules/quant-analysis/deliberation.controller";
import { MultiAgentDeliberationService } from "../src/modules/quant-analysis/multi-agent-deliberation.service";
import { RealtimeGateway } from "../src/modules/realtime/realtime.gateway";
import { RealtimeService } from "../src/modules/realtime/realtime.service";
import { AiProviderFactory } from "../src/modules/quant-analysis/ai-provider.factory";
import { ConfigService } from "../src/modules/infrastructure/config.service";
import { EventBusService } from "../src/modules/infrastructure/event-bus.service";

describe("Dynamic Workstation Features", () => {
  const simulator = new StochasticMarketSimulator();
  const feed = new LiveMarketFeedService(simulator);
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
      expect(response.reply).toContain("Quantitative consensus");
      expect(response.referencedSymbol).toBe("RELIANCE");
      expect(typeof response.livePrice).toBe("number");
      expect(response.livePrice).toBeGreaterThan(0);
      expect(response.timestamp).toBeDefined();
    });

    it("handles generic market questions gracefully without crashing", async () => {
      const response = await chatController.sendMessage({
        message: "Explain the Kelly Criterion for position sizing in options trading.",
      });

      expect(response).toBeDefined();
      expect(response.reply).toBeDefined();
      expect(response.reply.length).toBeGreaterThan(50);
    });
  });

  describe("Paper Portfolio & Risk Ledger Module", () => {
    const portfolioService = new PortfolioService(feed);
    const portfolioController = new PortfolioController(portfolioService);

    it("returns dynamic paper portfolio summary with active positions", async () => {
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
      await portfolioService.onModuleInit();
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
});
