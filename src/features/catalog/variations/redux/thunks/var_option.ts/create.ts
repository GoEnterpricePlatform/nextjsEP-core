import { createAsyncThunk } from "@reduxjs/toolkit";
import { CreateVarOptionRequest } from "../../../api/request";
import { VariationOption } from "../../../domain/domain";
import { createVarOption } from "../../../api/var_option/create_var_option";


interface CreateVarOptionPayload {
  variationId: string;
  data: CreateVarOptionRequest;
}

export const createVarOptionThunk = createAsyncThunk<
  VariationOption,
  CreateVarOptionPayload
>(
  "variations/createVarOption",
  async ({ variationId, data }, { rejectWithValue }) => {
    try {
      return await createVarOption(variationId, data);
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