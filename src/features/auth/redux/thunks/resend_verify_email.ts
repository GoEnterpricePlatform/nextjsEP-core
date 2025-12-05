import { createAsyncThunk } from "@reduxjs/toolkit";
import { resendVerifyEmail } from "../../api/resend_verify_email";

interface ResendVerifyEmailParams {
  email: string;
}

export const resendVerifyEmailThunk = createAsyncThunk<
  string,
  ResendVerifyEmailParams
>("auth/resendVerifyEmail", async (payload, { rejectWithValue }) => {
  try {
    const resp = await resendVerifyEmail(payload.email);
    return resp;
  } catch (err) {
    if (err instanceof Error) {
      return rejectWithValue({ message: err.message });
    }
    return rejectWithValue({ message: "Unexpected error occurred" });
  }
});
