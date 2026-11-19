/**
 * @file packages/prompts/src/test/prompts.test.ts
 * @description Unit tests validating prompt compilation, persona injection, and variable interpolation.
 * @author yuva.devlab@gmail.com
 */

import { describe, expect, it } from "vitest";
import { AgentRole, SignalRegime } from "@quant-ai/shared-types";
import {
  buildDeliberationSystemPrompt,
  buildDeliberationUserPrompt,
  resolveAgentPersona,
  QUANTAI_CONSTITUTION,
  BULL_RESEARCHER_PERSONA,
  BEAR_SKEPTIC_PERSONA,
  RISK_OFFICER_PERSONA,
} from "../index";

describe("@quant-ai/prompts", () => {
  it("resolves specific agent personas correctly", () => {
    expect(resolveAgentPersona(AgentRole.MOMENTUM_ANALYST)).toBe(BULL_RESEARCHER_PERSONA);
    expect(resolveAgentPersona(AgentRole.RED_TEAM_SKEPTIC)).toBe(BEAR_SKEPTIC_PERSONA);
    expect(resolveAgentPersona(AgentRole.QUANT_RISK_OFFICER)).toBe(RISK_OFFICER_PERSONA);
  });

  it("compiles deliberation system prompt with constitution and persona", () => {
    const compiled = buildDeliberationSystemPrompt(AgentRole.RED_TEAM_SKEPTIC);

    expect(compiled).toContain(QUANTAI_CONSTITUTION);
    expect(compiled).toContain("ADVERSARIAL RISK SKEPTIC");
    expect(compiled).toContain("JSON SCHEMA");
    expect(compiled).not.toContain("{{constitution}}");
    expect(compiled).not.toContain("{{persona}}");
  });

  it("compiles deliberation user prompt with dynamic variables interpolated", () => {
    const compiled = buildDeliberationUserPrompt({
      ticker: "NIFTY 50",
      currentPrice: 24350,
      targetPrice: 24580,
      stopLossPrice: 24210,
      rsi: 62.4,
      atr: 110.5,
      regime: SignalRegime.BULLISH_EXPANSION,
      context: "Opening 15m breakout auction",
    });

    expect(compiled).toContain("NIFTY 50");
    expect(compiled).toContain("24350");
    expect(compiled).toContain("24580");
    expect(compiled).toContain("24210");
    expect(compiled).toContain("62.40");
    expect(compiled).toContain("110.50");
    expect(compiled).toContain(SignalRegime.BULLISH_EXPANSION);
    expect(compiled).toContain("Opening 15m breakout auction");
    expect(compiled).not.toContain("{{ticker}}");
  });
});
