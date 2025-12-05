import { createAsyncThunk } from "@reduxjs/toolkit";
import { signIn } from "../../api/sign_in";
import { Auth } from "../../domain/domain";

interface SignInParams {
  email: string;
  password: string;
}

export const signInThunk = createAsyncThunk<Auth, SignInParams>(
  "auth/signIn",
  async (payload, { rejectWithValue }) => {
    try {
      const resp = await signIn(payload.email, payload.password);
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
  }
);