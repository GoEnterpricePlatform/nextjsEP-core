import { Auth } from "../domain/domain";

// "isAuthenticated" allows you to protect routes
export interface AuthState {
  status: AuthStatus;
  auth: Auth | null;
  isLoading: boolean;
  isInitializing: boolean;
  error: Error | null;
  isResending: boolean;
}

export type AuthStatus =
  | "uninitialized"
  | "needsVerification"
  | "signIn"
  | "signOut";

export const initialState: AuthState = {
  status: "uninitialized",
  isLoading: false,
  auth: null,
  error: null,
  isResending: false,
  isInitializing: true,
};
