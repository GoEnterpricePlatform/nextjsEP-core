import { createAsyncThunk } from "@reduxjs/toolkit";

import { UpdateVariationRequest } from "../../../api/request";
import { Variation } from "../../../domain/domain";
import { updateVariation } from "../../../api/variation/update_variation";

interface UpdateVariationPayload {
  id: string;
  data: UpdateVariationRequest;
}

export const updateVariationThunk = createAsyncThunk<
  Variation,
  UpdateVariationPayload
>(
  "variations/updateVariation",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateVariation(id, data);
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