import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./state";
import { signUpThunk } from "./thunks/sign_up";
import { verifyEmailThunk } from "./thunks/verify_email";
import { resendVerifyEmailThunk } from "./thunks/resend_verify_email";

const authSlice = createSlice({
  name: "auth",
  reducers: {},
  initialState,
  extraReducers: (builder) => {
    builder // Sign up
      .addCase(signUpThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.auth = action.payload;

        if (!state.auth!.user.email_verified) {
          state.status = "needsVerification";
        }
      })
      .addCase(signUpThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as Error;
      })
      
      // Verify Email
      .addCase(verifyEmailThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmailThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.auth = action.payload;
        state.status = "signIn";
      })
      .addCase(verifyEmailThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as Error;
      })

      // Resend Verify Email
      .addCase(resendVerifyEmailThunk.pending, (state) => {
        state.isResending = true;
      })
      .addCase(resendVerifyEmailThunk.fulfilled, (state, action) => {
        state.isResending = false;
        state.auth!.otp_id = action.payload;
      })
      .addCase(resendVerifyEmailThunk.rejected, (state) => {
        state.isResending = false;
      });
      ;
  },
});
export const {} = authSlice.actions;
export default authSlice.reducer;
