/**
 * @file apps/api/src/modules/auth/users.controller.ts
 * @description User profile and preference endpoints.
 * @author yuva.devlab@gmail.com
 */

import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { CurrentUser } from "./current-user.decorator";
import { UsersService, type UpdatePreferencesInput } from "./users.service";
import type { AuthenticatedUser } from "./jwt.strategy";

@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  @Get("profile")
  @ApiOperation({ summary: "Get current user profile and preferences" })
  public async getProfile(@CurrentUser("id") userId: string): Promise<AuthenticatedUser | null> {
    return this.usersService.getProfile(userId);
  }

  @Patch("preferences")
  @ApiOperation({ summary: "Update current user preferences" })
  public async updatePreferences(
    @CurrentUser("id") userId: string,
    @Body() body: UpdatePreferencesInput,
  ): Promise<AuthenticatedUser> {
    return this.usersService.updatePreferences(userId, body);
  }
}
