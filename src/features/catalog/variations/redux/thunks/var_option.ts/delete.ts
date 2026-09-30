import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteVarOption } from "../../../api/var_option/delete_var_option";


interface DeleteVarOptionPayload {
  variationId: string;
  id: string;
}

export const deleteVarOptionThunk = createAsyncThunk<
  DeleteVarOptionPayload,
  DeleteVarOptionPayload
>(
  "variations/deleteVarOption",
  async ({ variationId, id }, { rejectWithValue }) => {
    try {
      await deleteVarOption(variationId, id);

      return { variationId, id };
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