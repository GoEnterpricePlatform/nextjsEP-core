// features/catalog/paddle-plans/redux/thunks/create_paddle_plan.ts

import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  CreatePaddlePlanRequest,
  PaddlePlan,
} from "../../domain/domain";
import { createPaddlePlan } from "../../api/create";


export const createPaddlePlanThunk = createAsyncThunk<
  PaddlePlan,
  CreatePaddlePlanRequest
>(
  "paddlePlans/create",
  async (data, { rejectWithValue }) => {
    try {
      return await createPaddlePlan(data);
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue({
          message: err.message,
        });
      }

      return rejectWithValue({
        message: "Unexpected error occurred",
      });
    }
  },
);