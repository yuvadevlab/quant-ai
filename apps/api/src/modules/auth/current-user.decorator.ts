/**
 * @file apps/api/src/modules/auth/current-user.decorator.ts
 * @description Parameter decorator to extract the authenticated user from the HTTP request context.
 */

import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<{ user?: Record<string, unknown> }>();
    const user = request.user;
    return data && user ? user[data] : user;
  },
);
