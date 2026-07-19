import { createAsyncThunk } from "@reduxjs/toolkit";
import { signIn } from "../../api/sign_in";
import { Auth } from "../../domain/domain";
import { decodeAccessToken } from "../../utils/decode_access_token";

interface SignInParams {
  email: string;
  password: string;
}

export const signInThunk = createAsyncThunk<Auth, SignInParams>(
  "auth/signIn",
  async (payload, { rejectWithValue }) => {
    try {
      const resp = await signIn(payload.email, payload.password);
      if (resp.user.email_verified) {
        resp.session.jwtPayload = decodeAccessToken(resp.session.access_token);
      }
      return resp;
    } catch (err) {
      if (err instanceof Error) {
        if (
          err.message == "Not found" ||
          err.message == "password does not match"
        ) {
          return rejectWithValue({ message: "Invalid credentials" });
        }
        return rejectWithValue({ message: err.message });
      }

      return rejectWithValue({ message: "Unexpected error occurred" });
    }
  },
);
