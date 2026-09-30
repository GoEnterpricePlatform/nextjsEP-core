import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteVariation } from "../../../api/variation/delete_variation";


export const deleteVariationThunk = createAsyncThunk<
  string,
  string
>(
  "variations/deleteVariation",
  async (id, { rejectWithValue }) => {
    try {
      await deleteVariation(id);

      return id;
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