/**
 * @fileoverview Unit test verifying decoupled Prisma client initialization.
 */

import { describe, it, expect } from "vitest";
import { DefaultConnectionUrl } from "@quant-ai/shared-types";
import { createPrismaClient } from "./client.js";

describe("Prisma Database Client Factory", () => {
  it("initializes a PrismaClient instance with explicit connection string via adapter", () => {
    const client = createPrismaClient(DefaultConnectionUrl.DATABASE);
    expect(client).toBeDefined();
    expect(typeof client.$connect).toBe("function");
    expect(typeof client.$disconnect).toBe("function");
    expect(client.benchmarkIndex).toBeDefined();
    expect(client.prediction).toBeDefined();
    expect(client.agentVerdict).toBeDefined();
    expect(client.trajectoryPoint).toBeDefined();
    expect(client.screenerStock).toBeDefined();
    expect(client.user).toBeDefined();
    expect(client.chatSession).toBeDefined();
    expect(client.chatMessage).toBeDefined();
  });

  it("initializes a PrismaClient instance with accelerateUrl", () => {
    const client = createPrismaClient({
      accelerateUrl: "prisma://accelerate.net/?api_key=mock_key",
    });
    expect(client).toBeDefined();
    expect(typeof client.$connect).toBe("function");
    expect(typeof client.$disconnect).toBe("function");
  });
});
