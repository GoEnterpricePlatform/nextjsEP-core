import { User } from "@/features/user/domain/domain";

export interface Auth {
  session: Session;
  user: User;
  otp_id: string;
}

export interface Session {
  access_token: string;
  expires_in: number;
  jwtPayload: JwtPayload;
}

// All thunks, such as signIn and verifyEmail, as well as endpoints like refreshToken,
// that return the auth state or session should use decodeAccessToken to extract the user's roles.
export interface JwtPayload {
  user_id: string;
  email: string;
  iss: string;
  sub: string;
  exp: number;
  iat: number;
  role?: string[];
  permissions?: string[];
}
