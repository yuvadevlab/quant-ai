/**
 * @file apps/api/src/modules/auth/jwt-auth.guard.ts
 * @description NestJS Passport JWT authentication guard.
 */

import { Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Logger } from "@yuva-devlab/logger";
import { invalidateJwksCache } from "./jwks.util";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  private readonly logger = new Logger(JwtAuthGuard.name);

  public override handleRequest<TUser = unknown>(
    err: unknown,
    user: unknown,
    info: unknown,
    context: ExecutionContext,
  ): TUser {
    if (err || !user) {
      const req = context.switchToHttp().getRequest<{ method?: string; url?: string }>();
      const detail =
        info instanceof Error
          ? info.message
          : typeof info === "string"
            ? info
            : "missing/invalid token";

      this.logger.warn(
        `[JwtAuthGuard] Unauthorized ${req?.method ?? "?"} ${req?.url ?? "?"}: ${detail}`,
      );

      if (detail === "invalid signature") {
        invalidateJwksCache();
      }

      throw err instanceof Error ? err : new UnauthorizedException(detail);
    }

    return user as TUser;
  }
}
