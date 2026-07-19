import { createAsyncThunk } from "@reduxjs/toolkit";
import { getSession } from "../../api/get_session";
import { Auth } from "../../domain/domain";
import { decodeAccessToken } from "../../utils/decode_access_token";

export const initializeThunk = createAsyncThunk<Auth, void>(
  "auth/initialize",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await getSession();
      resp.session.jwtPayload = decodeAccessToken(resp.session.access_token);
      return resp;
    } catch {
      return rejectWithValue(null);
    }
  }
);
