/**
 * @file apps/web/src/providers/auth/auth-context.ts
 * @description React Context and custom hook for QuantAI authentication and user profile.
 * @author yuva.devlab@gmail.com
 */

import { createContext, useContext } from "react";

export interface AuthUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly avatarUrl?: string | null;
  readonly roles?: readonly string[];
}

export interface AuthContextValue {
  readonly token: string | null;
  readonly user: AuthUser | null;
  readonly isAuthenticated: boolean;
  readonly logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Access the active DevLab authentication state and user profile.
 *
 * @throws Error if invoked outside <AuthProvider />
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}
