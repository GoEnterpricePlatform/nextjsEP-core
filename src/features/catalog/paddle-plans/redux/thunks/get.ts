import { createAsyncThunk } from "@reduxjs/toolkit";
import { getPaddlePlan } from "../../api/get";
import { PaddlePlan } from "../../domain/domain";

export const getPaddlePlanThunk = createAsyncThunk<PaddlePlan, string>("paddlePlans/get", async (id, { rejectWithValue }) => {
  try {
    return await getPaddlePlan(id);
  } catch (err) {
    if (err instanceof Error) {
      return rejectWithValue({ message: err.message });
    }

    return rejectWithValue({ message: "Unexpected error occurred" });
  }
});
