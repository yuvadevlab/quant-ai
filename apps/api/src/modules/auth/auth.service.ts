/**
 * @file apps/api/src/modules/auth/auth.service.ts
 * @description Authentication and user resolution service.
 * Identity lifecycle and credentials are delegated exclusively to DevLab Portal SSO.
 */

import { Injectable, NotFoundException } from "@nestjs/common";
import { Logger } from "@yuva-devlab/logger";
import { DatabaseService } from "../infrastructure/database.service";
import type { AuthenticatedUser } from "./jwt.strategy";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  public constructor(private readonly databaseService: DatabaseService) {}

  /**
   * Validates and returns full user entity for a given primary key.
   */
  public async validateUserById(userId: string): Promise<AuthenticatedUser> {
    this.logger.info(`[validateUserById] Resolving user ${userId.slice(0, 8)}`);
    const user = await this.databaseService.client.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, avatarUrl: true, preferences: true },
    });

    if (!user) {
      this.logger.warn(`[validateUserById] User not found for ID: ${userId.slice(0, 8)}`);
      throw new NotFoundException("User not found");
    }

    return user;
  }
}
