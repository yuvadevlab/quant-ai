/**
 * @file apps/api/src/modules/auth/jwt.strategy.ts
 * @description NestJS Passport JWT authentication strategy supporting dual verification:
 * 1. RS256 SSO tokens issued by DevLab Gateway with JWKS verification.
 * 2. HS256 tokens issued locally with symmetric secret verification.
 * Performs Just-In-Time (JIT) shadow provisioning for DevLab Portal SSO users.
 * @author yuva.devlab@gmail.com
 */

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Logger } from "@yuva-devlab/logger";
import { DEVLAB_CONFIG, type JwtTokenPayload } from "@quant-ai/shared-types";
import { ConfigService } from "../infrastructure/config.service";
import { DatabaseService } from "../infrastructure/database.service";
import { getDevLabPublicKey } from "./jwks.util";

/**
 * Validated authentication user attached to HTTP request context.
 */
export interface AuthenticatedUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly avatarUrl?: string | null;
  readonly preferences?: unknown;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  public constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ["HS256", "RS256"],
      secretOrKeyProvider: (
        _req: unknown,
        rawJwtToken: string,
        done: (err: unknown, secretOrKey?: string | Buffer) => void,
      ) => {
        try {
          if (!rawJwtToken || typeof rawJwtToken !== "string") {
            return done(new UnauthorizedException("Token missing or invalid"));
          }

          const parts = rawJwtToken.split(".");
          if (parts.length < 2 || !parts[0]) {
            return done(new UnauthorizedException("Malformed JWT structure"));
          }

          const header = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf-8")) as {
            alg?: string;
            kid?: string;
          };

          if (header.alg === "RS256") {
            const portalApiUrl =
              process.env["DEVLAB_PORTAL_API_URL"] || DEVLAB_CONFIG.DEFAULT_PORTAL_API_URL;
            getDevLabPublicKey(portalApiUrl, header.kid)
              .then((pem) => done(null, pem))
              .catch((err) => {
                this.logger.error("[secretOrKeyProvider] JWKS resolution failed", err);
                done(err);
              });
            return;
          }

          return done(null, this.configService.jwtSecret);
        } catch (parseError) {
          this.logger.error("[secretOrKeyProvider] Error parsing token header", parseError);
          return done(parseError);
        }
      },
    });
  }

  /**
   * Validates the decoded JWT payload.
   * If the user does not exist locally (first-time login from DevLab Portal),
   * provisions the shadow user account Just-In-Time (JIT) using the portal's sub.
   */
  public async validate(payload: JwtTokenPayload): Promise<AuthenticatedUser> {
    const sub = payload.sub || (payload as Record<string, string>)["id"];
    const email = payload.email ? payload.email.toLowerCase().trim() : "";

    if (!sub || !email) {
      this.logger.warn(`[validate] Rejected token — missing sub or email claims`);
      throw new UnauthorizedException("Invalid token claims");
    }

    this.logger.info(`[validate] Validating JWT for sub=${sub.slice(0, 8)} email=${email}`);

    // 1. Look up user by primary key (id = portal sub)
    let user = await this.databaseService.client.user.findUnique({
      where: { id: sub },
      select: { id: true, email: true, name: true, avatarUrl: true, preferences: true },
    });

    // 2. Fallback: look up by normalized email if sub differs
    if (!user) {
      user = await this.databaseService.client.user.findUnique({
        where: { email },
        select: { id: true, email: true, name: true, avatarUrl: true, preferences: true },
      });
    }

    // 3. Just-In-Time (JIT) provisioning for new DevLab Portal users
    if (!user) {
      const userName = payload.name?.trim() || email.split("@")[0] || "Trader";
      this.logger.info(`[validate] JIT provisioning new SSO user: ${email} (id: ${sub})`);

      user = await this.databaseService.client.user.create({
        data: {
          id: sub,
          email,
          name: userName,
          passwordHash: null,
          avatarUrl: payload.avatarUrl,
          preferences: {
            theme: "quantai-dark",
            watchlist: ["NIFTY 50", "BANK NIFTY", "RELIANCE", "TCS", "HDFCBANK"],
            defaultHorizon: "SWING",
          },
        },
        select: { id: true, email: true, name: true, avatarUrl: true, preferences: true },
      });
    }

    if (!user) {
      this.logger.warn(`[validate] Rejected token — account creation failed for sub=${sub}`);
      throw new UnauthorizedException("User account could not be provisioned");
    }

    return user;
  }
}
