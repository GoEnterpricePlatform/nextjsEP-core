import { Auth } from "../domain/domain";

export interface AuthState {
  status: AuthStatus;
  auth: Auth | null;
  isLoading: boolean;
  error: Error | null;
}

export type AuthStatus = "uninitialized" | "needsVerification";

export const initialState: AuthState = {
  status: "uninitialized",
  isLoading: false,
  auth: null,
  error: null,
};
