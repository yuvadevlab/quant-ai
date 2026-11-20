/**
 * @file packages/shared-types/src/auth.types.ts
 * @description Authentication, user preferences, and shadow account contracts.
 * @author yuva.devlab@gmail.com
 */

export interface UserPreferences {
  theme?: string;
  watchlist?: string[];
  defaultHorizon?: string;
  notifications?: {
    marketAlerts?: boolean;
    breakoutSurges?: boolean;
    agentDeliberations?: boolean;
  };
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
  roles?: string[];
  preferences?: UserPreferences;
}

export interface JwtTokenPayload {
  sub: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  role?: string;
  roles?: string[];
  [key: string]: unknown;
}
