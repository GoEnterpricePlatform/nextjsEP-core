import { createAsyncThunk } from "@reduxjs/toolkit";
import { listPaddlePlans } from "../../api/list";
import { PaddlePlanPage } from "../../domain/domain";

export const listPaddlePlansThunk = createAsyncThunk<PaddlePlanPage, number>("paddlePlans/list", async (page, { rejectWithValue }) => {
  try {
    return await listPaddlePlans(page);
  } catch (err) {
    if (err instanceof Error) {
      return rejectWithValue({ message: err.message });
    }

    return rejectWithValue({ message: "Unexpected error occurred" });
  }
});
