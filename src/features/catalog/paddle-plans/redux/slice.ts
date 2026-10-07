// features/catalog/paddle-plans/redux/slice.ts

import { createSlice } from "@reduxjs/toolkit";

import { initialState } from "./state";
import { createPaddlePlanThunk } from "./thunks/create";
import { getPaddlePlanThunk } from "./thunks/get";
import { updatePaddlePlanThunk } from "./thunks/update";
import { listPaddlePlansThunk } from "./thunks/list";
import { deletePaddlePlanThunk } from "./thunks/delete";


const paddlePlansSlice = createSlice({
  name: "paddlePlans",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(listPaddlePlansThunk.pending, (state) => {
        state.isListing = true;
        state.error = null;
      })
      .addCase(listPaddlePlansThunk.fulfilled, (state, action) => {
        state.isListing = false;
        state.paddlePlans = action.payload.plans;
        state.count = action.payload.count;
        state.pages = action.payload.pages;
      })
      .addCase(listPaddlePlansThunk.rejected, (state, action) => {
        state.isListing = false;
        state.error = action.payload as Error;
      })
      .addCase(deletePaddlePlanThunk.pending, (state, action) => {
        state.deletingId = action.meta.arg;
        state.error = null;
      })
      .addCase(deletePaddlePlanThunk.fulfilled, (state, action) => {
        state.deletingId = null;
        state.paddlePlans = state.paddlePlans.filter((plan) => plan.id !== action.payload);
        state.count = Math.max(0, state.count - 1);
        if (state.currentPlan?.id === action.payload) state.currentPlan = null;
      })
      .addCase(deletePaddlePlanThunk.rejected, (state, action) => {
        state.deletingId = null;
        state.error = action.payload as Error;
      })
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
      })
      .addCase(getPaddlePlanThunk.pending, (state) => {
        state.isFetching = true;
        state.currentPlan = null;
        state.error = null;
      })
      .addCase(getPaddlePlanThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        state.currentPlan = action.payload;
      })
      .addCase(getPaddlePlanThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as Error;
      })
      .addCase(updatePaddlePlanThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePaddlePlanThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPlan = action.payload;
        const index = state.paddlePlans.findIndex((plan) => plan.id === action.payload.id);
        if (index !== -1) state.paddlePlans[index] = action.payload;
      })
      .addCase(updatePaddlePlanThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as Error;
      });
  },
});

export default paddlePlansSlice.reducer;
