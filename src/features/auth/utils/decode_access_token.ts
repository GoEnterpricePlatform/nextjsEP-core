import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "../domain/domain";

export function decodeAccessToken(token: string): JwtPayload {
  return jwtDecode<JwtPayload>(token);
}
