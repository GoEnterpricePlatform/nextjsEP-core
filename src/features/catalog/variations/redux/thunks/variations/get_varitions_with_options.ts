import { createAsyncThunk } from "@reduxjs/toolkit";
import { Variation } from "../../../domain/domain";
import { getVaritionsWithOptions } from "../../../api/variation/get_variations_with_options";

export const getVariationsWithOptionsThunk = createAsyncThunk<
  Variation[],
  void
>("variations/getVariationsWithOptions", async (_, { rejectWithValue }) => {
  try {
    const resp = await getVaritionsWithOptions();
    return resp;
  } catch (err) {
    if (err instanceof Error) {
      return rejectWithValue({ message: err.message });
    }

    return rejectWithValue({
      message: "Unexpected error occurred",
    });
  }
});
