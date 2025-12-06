import { createAsyncThunk } from "@reduxjs/toolkit";
import { getSession } from "../../api/get_session";
import { Auth } from "../../domain/domain";

export const initializeThunk = createAsyncThunk<Auth, void>(
  "auth/initialize",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await getSession();
      return resp;
    } catch {
      return rejectWithValue(null);
    }
  }
);
