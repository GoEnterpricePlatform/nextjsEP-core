// features/catalog/paddle-plans/api/api.ts

import { api } from "@/shared/api/axios_client";
import { throwApiError } from "./error";

import {
  CreatePaddlePlanRequest,
  PaddlePlan,
} from "../domain/domain";

export async function createPaddlePlan(
  data: CreatePaddlePlanRequest,
): Promise<PaddlePlan> {
  try {
    const response = await api.post<PaddlePlan>(
      "/paddle/plans",
      data,
    );

    return response.data;
  } catch (err) {
    throwApiError(err);
  }
}
