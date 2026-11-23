/**
 * @file apps/api/src/modules/auth/auth.controller.ts
 * @description Authentication endpoints for DevLab Portal SSO handshake and user profile resolution.
 * Local registration/signup is strictly disabled; identity belongs exclusively to DevLab Portal.
 * @author yuva.devlab@gmail.com
 */

import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { DEVLAB_CONFIG } from "@quant-ai/shared-types";
import { JwtAuthGuard } from "./jwt-auth.guard";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current authenticated user profile" })
  public getProfile(@Req() req: { user: unknown }) {
    return req.user;
  }

  @Get("sso-url")
  @ApiOperation({ summary: "Get centralized DevLab Portal SSO login URL" })
  public getSsoUrl() {
    const portalWebUrl =
      process.env["DEVLAB_PORTAL_WEB_URL"] || DEVLAB_CONFIG.DEFAULT_PORTAL_WEB_URL;
    return {
      ssoUrl: `${portalWebUrl}/login?app=${DEVLAB_CONFIG.APP_ID}`,
      portalUrl: portalWebUrl,
      appId: DEVLAB_CONFIG.APP_ID,
    };
  }
}
