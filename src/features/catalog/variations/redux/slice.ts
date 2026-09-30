import { createSlice } from "@reduxjs/toolkit";

import { initialState } from "./state";
import { getVariationsWithOptionsThunk } from "./thunks/variations/get_varitions_with_options";
import { createVariationThunk } from "./thunks/variations/create";
import { updateVariationThunk } from "./thunks/variations/update";
import { deleteVariationThunk } from "./thunks/variations/delete";
import { createVarOptionThunk } from "./thunks/var_option.ts/create";
import { updateVarOptionThunk } from "./thunks/var_option.ts/update";
import { deleteVarOptionThunk } from "./thunks/var_option.ts/delete";

const variationsSlice = createSlice({
  name: "variations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get variations
      .addCase(getVariationsWithOptionsThunk.pending, (state) => {
        state.isVariationLoading = true;
        state.error = null;
      })
      .addCase(getVariationsWithOptionsThunk.fulfilled, (state, action) => {
        state.isVariationLoading = false;
        state.variations = action.payload;
      })
      .addCase(getVariationsWithOptionsThunk.rejected, (state, action) => {
        state.isVariationLoading = false;
        state.error = action.payload as Error;
      })
      // Create variation
      .addCase(createVariationThunk.pending, (state) => {
        state.isVariationLoading = true;
        state.error = null;
      })

      .addCase(createVariationThunk.fulfilled, (state, action) => {
        state.isVariationLoading = false;

        state.variations.push({
          ...action.payload,
          options: action.payload.options ?? [],
        });
      })

      .addCase(createVariationThunk.rejected, (state, action) => {
        state.isVariationLoading = false;
        state.error = action.payload as Error;
      })
      // Update variation
      .addCase(updateVariationThunk.pending, (state) => {
        state.isVariationLoading = true;
        state.error = null;
      })

      .addCase(updateVariationThunk.fulfilled, (state, action) => {
        state.isVariationLoading = false;

        const index = state.variations.findIndex(
          (variation) => variation.id === action.payload.id,
        );

        if (index !== -1) {
          state.variations[index] = {
            ...action.payload,
            options:
              action.payload.options ?? state.variations[index].options ?? [],
          };
        }
      })

      .addCase(updateVariationThunk.rejected, (state, action) => {
        state.isVariationLoading = false;
        state.error = action.payload as Error;
      })

      // Delete variation
      .addCase(deleteVariationThunk.pending, (state) => {
        state.isVariationLoading = true;
        state.error = null;
      })

      .addCase(deleteVariationThunk.fulfilled, (state, action) => {
        state.isVariationLoading = false;

        state.variations = state.variations.filter(
          (variation) => variation.id !== action.payload,
        );
      })

      .addCase(deleteVariationThunk.rejected, (state, action) => {
        state.isVariationLoading = false;
        state.error = action.payload as Error;
      })

      // Create option
      .addCase(createVarOptionThunk.pending, (state) => {
        state.isVarOptionLoading = true;
        state.error = null;
      })

      .addCase(createVarOptionThunk.fulfilled, (state, action) => {
        state.isVarOptionLoading = false;

        const variation = state.variations.find(
          (variation) => variation.id === action.payload.variation_id,
        );

        if (variation) {
          variation.options ??= [];
          variation.options.push(action.payload);
        }
      })

      .addCase(createVarOptionThunk.rejected, (state, action) => {
        state.isVarOptionLoading = false;
        state.error = action.payload as Error;
      })

      // Update option
      .addCase(updateVarOptionThunk.pending, (state) => {
        state.isVarOptionLoading = true;
        state.error = null;
      })

      .addCase(updateVarOptionThunk.fulfilled, (state, action) => {
        state.isVarOptionLoading = false;

        const variation = state.variations.find(
          (variation) => variation.id === action.payload.variation_id,
        );

        if (!variation?.options) {
          return;
        }

        const index = variation.options.findIndex(
          (option) => option.id === action.payload.id,
        );

        if (index !== -1) {
          variation.options[index] = action.payload;
        }
      })
      .addCase(updateVarOptionThunk.rejected, (state, action) => {
        state.isVarOptionLoading = false;
        state.error = action.payload as Error;
      })

      // Delete option
      .addCase(deleteVarOptionThunk.pending, (state) => {
        state.isVarOptionLoading = true;
        state.error = null;
      })

      .addCase(deleteVarOptionThunk.fulfilled, (state, action) => {
        state.isVarOptionLoading = false;

        const variation = state.variations.find(
          (variation) => variation.id === action.payload.variationId,
        );

        if (!variation?.options) {
          return;
        }

        variation.options = variation.options.filter(
          (option) => option.id !== action.payload.id,
        );
      })

      .addCase(deleteVarOptionThunk.rejected, (state, action) => {
        state.isVarOptionLoading = false;
        state.error = action.payload as Error;
      });
  },
});

export default variationsSlice.reducer;
