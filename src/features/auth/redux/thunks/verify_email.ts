import { createAsyncThunk } from "@reduxjs/toolkit";
import { Auth } from "../../domain/domain";
import { verifyEmail } from "../../api/verify_email";

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
        payload.userId
      );

      return resp;
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue({ message: err.message });
      }
      return rejectWithValue({ message: "Unexpected error occurred" });
    }
  }
);
