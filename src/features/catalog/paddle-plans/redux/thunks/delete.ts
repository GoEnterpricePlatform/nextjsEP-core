import { createAsyncThunk } from "@reduxjs/toolkit";
import { deletePaddlePlan } from "../../api/delete";

export const deletePaddlePlanThunk = createAsyncThunk<string, string>("paddlePlans/delete", async (id, { rejectWithValue }) => {
  try {
    await deletePaddlePlan(id);
    return id;
  } catch (err) {
    if (err instanceof Error) {
      return rejectWithValue({ message: err.message });
    }

    return rejectWithValue({ message: "Unexpected error occurred" });
  }
});
