/**
 * @file apps/api/src/modules/auth/users.service.ts
 * @description User preferences and profile management service.
 */

import { Injectable } from "@nestjs/common";
import { Logger } from "@yuva-devlab/logger";
import { DatabaseService } from "../infrastructure/database.service";
import type { UserPreferences } from "@quant-ai/shared-types";
import type { AuthenticatedUser } from "./jwt.strategy";

export interface UpdatePreferencesInput {
  readonly theme?: string;
  readonly watchlist?: readonly string[];
  readonly defaultHorizon?: string;
  readonly notifications?: {
    readonly marketAlerts?: boolean;
    readonly breakoutSurges?: boolean;
    readonly agentDeliberations?: boolean;
  };
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  public constructor(private readonly databaseService: DatabaseService) {}

  public async getProfile(userId: string): Promise<AuthenticatedUser | null> {
    this.logger.info(`[getProfile] Fetching profile for user ${userId.slice(0, 8)}`);
    return this.databaseService.client.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        preferences: true,
      },
    });
  }

  public async updatePreferences(
    userId: string,
    input: UpdatePreferencesInput,
  ): Promise<AuthenticatedUser> {
    this.logger.info(`[updatePreferences] Updating preferences for user ${userId.slice(0, 8)}`);
    const user = await this.databaseService.client.user.findUnique({
      where: { id: userId },
      select: { preferences: true },
    });

    const currentPrefs = ((user?.preferences as Record<string, unknown>) || {}) as UserPreferences;
    const mergedPrefs: UserPreferences = {
      ...currentPrefs,
      ...(input.theme !== undefined ? { theme: input.theme } : {}),
      ...(input.watchlist !== undefined ? { watchlist: [...input.watchlist] } : {}),
      ...(input.defaultHorizon !== undefined ? { defaultHorizon: input.defaultHorizon } : {}),
      ...(input.notifications !== undefined
        ? {
            notifications: {
              ...(currentPrefs.notifications || {}),
              ...input.notifications,
            },
          }
        : {}),
    };

    return this.databaseService.client.user.update({
      where: { id: userId },
      data: { preferences: mergedPrefs as object },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        preferences: true,
      },
    });
  }
}
