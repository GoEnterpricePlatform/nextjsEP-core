// features/catalog/paddle-plans/redux/state.ts

import { PaddlePlan } from "../domain/domain";

export interface PaddlePlanState {
  paddlePlans: PaddlePlan[];
  isLoading: boolean;
  error: Error | null;
}

export const initialState: PaddlePlanState = {
  paddlePlans: [],
  isLoading: false,
  error: null,
};