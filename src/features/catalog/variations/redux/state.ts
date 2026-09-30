import { Variation } from "../domain/domain";

export interface VariationState {
  variations: Variation[];
  isVariationLoading: boolean;
  isVarOptionLoading: boolean;
  error: Error | null;
}

export const initialState: VariationState = {
  variations: [],
  isVariationLoading: false,
  isVarOptionLoading: false,
  error: null,
};