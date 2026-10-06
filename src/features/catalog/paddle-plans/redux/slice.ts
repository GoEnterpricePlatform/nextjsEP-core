// features/catalog/paddle-plans/redux/slice.ts

import { createSlice } from "@reduxjs/toolkit";

import { initialState } from "./state";
import { createPaddlePlanThunk } from "./thunks/create";


const paddlePlansSlice = createSlice({
  name: "paddlePlans",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPaddlePlanThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPaddlePlanThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paddlePlans.push(action.payload);
      })
      .addCase(createPaddlePlanThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as Error;
      });
  },
});

export default paddlePlansSlice.reducer;
