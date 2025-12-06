import { createAsyncThunk } from "@reduxjs/toolkit";
import { signOut } from "../../api/sign_out";

export const signOutThunk = createAsyncThunk<void, void>(
  "auth/signOut",
  async (_, { rejectWithValue }) => {
    try {
      await signOut();
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue({ message: err.message });
      }

      return rejectWithValue({ message: "Unexpected error occurred" });
    }
  }
);
