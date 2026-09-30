import { createAsyncThunk } from "@reduxjs/toolkit";

import { Variation } from "../../../domain/domain";
import { createVariation } from "../../../api/variation/create_variation";

export const createVariationThunk = createAsyncThunk<Variation, string>(
  "variations/createVariation",
  async (data, { rejectWithValue }) => {
    try {
      return await createVariation(data);
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue({ message: err.message });
      }

      return rejectWithValue({
        message: "Unexpected error occurred",
      });
    }
  },
);
