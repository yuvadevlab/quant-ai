/**
 * @file apps/api/src/modules/auth/auth.module.ts
 * @description NestJS Authentication module configuring Passport, JWT verification, and user management.
 */

import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { InfrastructureModule } from "../infrastructure/infrastructure.module";
import { ConfigService } from "../infrastructure/config.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [
    InfrastructureModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [InfrastructureModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.jwtSecret,
        signOptions: { expiresIn: "7d" },
      }),
    }),
  ],
  controllers: [AuthController, UsersController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, UsersService],
  exports: [JwtModule, AuthService, JwtAuthGuard, UsersService],
})
export class AuthModule {}
