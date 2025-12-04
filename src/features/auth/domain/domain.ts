import { User } from "@/features/user/domain/domain";

export interface Auth {
  session: Session;
  user: User;
  otp_id: string;
}

export interface Session {
  access_token: string;
  expires_in: number;
}
