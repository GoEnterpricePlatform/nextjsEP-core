import { createAsyncThunk } from "@reduxjs/toolkit";
import { UpdateVarOptionRequest } from "../../../api/request";
import { VariationOption } from "../../../domain/domain";
import { updateVarOption } from "../../../api/var_option/update_var_option";


interface UpdateVarOptionPayload {
  variationId: string;
  id: string;
  data: UpdateVarOptionRequest;
}

export const updateVarOptionThunk = createAsyncThunk<
  VariationOption,
  UpdateVarOptionPayload
>(
  "variations/updateVarOption",
  async ({ variationId, id, data }, { rejectWithValue }) => {
    try {
      return await updateVarOption(variationId, id, data);
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