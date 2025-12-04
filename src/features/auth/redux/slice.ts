import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "./state";
import { signUpThunk } from "./thunks/sign_up";

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
      });
  },
});
export const {} = authSlice.actions;
export default authSlice.reducer;
