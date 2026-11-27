/**
 * @file apps/api/test/auth.test.ts
 * @description Unit tests for DevLab SSO authentication, JIT provisioning, and user endpoints.
 */

import { describe, expect, it, vi } from "vitest";
import { DEVLAB_CONFIG, type JwtTokenPayload } from "@quant-ai/shared-types";
import { AuthController } from "../src/modules/auth/auth.controller";
import { AuthService } from "../src/modules/auth/auth.service";
import { UsersService } from "../src/modules/auth/users.service";
import { JwtStrategy } from "../src/modules/auth/jwt.strategy";
import { ConfigService } from "../src/modules/infrastructure/config.service";
import { DatabaseService } from "../src/modules/infrastructure/database.service";

describe("DevLab Portal SSO & Auth Module", () => {
  it("AuthController returns configured centralized SSO URL", () => {
    const controller = new AuthController();
    const result = controller.getSsoUrl();

    expect(result.ssoUrl).toContain(DEVLAB_CONFIG.DEFAULT_PORTAL_WEB_URL);
    expect(result.ssoUrl).toContain("/login?app=quantai");
    expect(result.portalUrl).toBe(DEVLAB_CONFIG.DEFAULT_PORTAL_WEB_URL);
    expect(result.appId).toBe("quantai");
  });

  it("AuthController returns authenticated profile on /auth/me", () => {
    const controller = new AuthController();
    const mockUser = { id: "user-123", email: "trader@devlab.io", name: "Trader" };
    const response = controller.getProfile({ user: mockUser });

    expect(response).toEqual(mockUser);
  });

  it("JwtStrategy JIT provisions shadow user if account does not exist", async () => {
    const mockUser = {
      id: "sso-uuid-777",
      email: "newtrader@devlab.io",
      name: "New Trader",
      avatarUrl: null,
      preferences: { theme: "quantai-dark", watchlist: ["NIFTY 50"] },
    };

    const mockPrisma = {
      user: {
        findUnique: vi.fn().mockResolvedValue(null),
        create: vi.fn().mockResolvedValue(mockUser),
      },
    };

    const mockConfig = {
      jwtSecret: "test-secret-key-12345",
    } as unknown as ConfigService;

    const mockDatabase = {
      client: mockPrisma,
    } as unknown as DatabaseService;

    const strategy = new JwtStrategy(mockConfig, mockDatabase);
    const payload: JwtTokenPayload = {
      sub: "sso-uuid-777",
      email: "newtrader@devlab.io",
      name: "New Trader",
    };

    const validated = await strategy.validate(payload);
    expect(validated.id).toBe("sso-uuid-777");
    expect(validated.email).toBe("newtrader@devlab.io");
    expect(mockPrisma.user.create).toHaveBeenCalledTimes(1);
  });

  it("UsersService updates user preferences and returns merged settings", async () => {
    const existingUser = {
      preferences: {
        theme: "quantai-dark",
        watchlist: ["NIFTY 50"],
        defaultHorizon: "INTRADAY",
      },
    };

    const updatedUser = {
      id: "sso-uuid-1",
      email: "trader@devlab.io",
      name: "Trader One",
      avatarUrl: null,
      preferences: {
        theme: "quantai-light",
        watchlist: ["BANK NIFTY"],
        defaultHorizon: "SWING",
      },
    };

    const mockPrisma = {
      user: {
        findUnique: vi.fn().mockResolvedValue(existingUser),
        update: vi.fn().mockResolvedValue(updatedUser),
      },
    };

    const mockDatabase = { client: mockPrisma } as unknown as DatabaseService;
    const usersService = new UsersService(mockDatabase);

    const result = await usersService.updatePreferences("sso-uuid-1", {
      theme: "quantai-light",
      watchlist: ["BANK NIFTY"],
      defaultHorizon: "SWING",
    });

    expect(result.preferences).toEqual(updatedUser.preferences);
    expect(mockPrisma.user.update).toHaveBeenCalledTimes(1);
  });
});
