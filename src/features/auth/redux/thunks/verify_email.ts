import { createAsyncThunk } from "@reduxjs/toolkit";
import { Auth } from "../../domain/domain";
import { verifyEmail } from "../../api/verify_email";
import { decodeAccessToken } from "../../utils/decode_access_token";

interface VerifyEmailParams {
  otpId: string;
  otpCode: string;
  userId: string;
}

export const verifyEmailThunk = createAsyncThunk<Auth, VerifyEmailParams>(
  "auth/verifyEmail",
  async (payload, { rejectWithValue }) => {
    try {
      const resp = await verifyEmail(
        payload.otpId,
        payload.otpCode,
        payload.userId,
      );
      resp.session.jwtPayload = decodeAccessToken(resp.session.access_token);
      return resp;
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue({ message: err.message });
      }
      return rejectWithValue({ message: "Unexpected error occurred" });
    }
  },
);
