// features/catalog/paddle-plans/redux/state.ts

import { PaddlePlan, PaddlePlanListItem } from "../domain/domain";

export interface PaddlePlanState {
  paddlePlans: PaddlePlanListItem[];
  count: number;
  pages: number;
  isListing: boolean;
  deletingId: string | null;
  currentPlan: PaddlePlan | null;
  isFetching: boolean;
  isLoading: boolean;
  error: Error | null;
}

export const initialState: PaddlePlanState = {
  paddlePlans: [],
  count: 0,
  pages: 0,
  isListing: false,
  deletingId: null,
  currentPlan: null,
  isFetching: false,
  isLoading: false,
  error: null,
};
