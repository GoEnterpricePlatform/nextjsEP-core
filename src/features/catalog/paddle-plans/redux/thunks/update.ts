import { createAsyncThunk } from "@reduxjs/toolkit";
import { updatePaddlePlan } from "../../api/update";
import { PaddlePlan, UpdatePaddlePlanRequest } from "../../domain/domain";

export const updatePaddlePlanThunk = createAsyncThunk<PaddlePlan, { id: string; data: UpdatePaddlePlanRequest }>("paddlePlans/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    return await updatePaddlePlan(id, data);
  } catch (err) {
    if (err instanceof Error) {
      return rejectWithValue({ message: err.message });
    }

    return rejectWithValue({ message: "Unexpected error occurred" });
  }
});
