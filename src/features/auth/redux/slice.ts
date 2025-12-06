import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./state";
import { signUpThunk } from "./thunks/sign_up";
import { verifyEmailThunk } from "./thunks/verify_email";
import { resendVerifyEmailThunk } from "./thunks/resend_verify_email";
import { signInThunk } from "./thunks/sign_in";
import { signOutThunk } from "./thunks/sign_out";
import { initializeThunk } from "./thunks/initialize";

const authSlice = createSlice({
  name: "auth",
  reducers: {},
  initialState,
  extraReducers: (builder) => {
    builder

      // Initialize
      .addCase(initializeThunk.fulfilled, (state, action) => {
        // If the response is empty, do not update auth
        if (!action.payload || Object.keys(action.payload).length === 0) {
          state.isInitializing = false;
          return; // nothing to update
        }

        // If there is data (session + user)
        state.auth = action.payload;
        state.isInitializing = false;
      })
      .addCase(initializeThunk.rejected, (state) => {
        state.auth = null;
        state.isInitializing = false;
      })

      // Sign up
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
      })

      // Sign in
      .addCase(signInThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.auth = action.payload;

        if (!state.auth!.user.email_verified) {
          state.status = "needsVerification";
        } else {
          state.status = "signIn";
        }
      })
      .addCase(signInThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as Error;
      })

      // Sign out
      .addCase(signOutThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signOutThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.status = "signOut";
        state.auth = null;
      })
      .addCase(signOutThunk.rejected, (state) => {
        state.isLoading = false;
        state.status = "signOut";
        state.auth = null;
        state.error = null;
      });
  },
});
export const {} = authSlice.actions;
export default authSlice.reducer;
