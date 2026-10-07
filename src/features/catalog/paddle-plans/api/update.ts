import { api } from "@/shared/api/axios_client";
import { PaddlePlan, UpdatePaddlePlanRequest } from "../domain/domain";
import { throwApiError } from "./error";

export async function updatePaddlePlan(id: string, data: UpdatePaddlePlanRequest): Promise<PaddlePlan> {
  try {
    const response = await api.put<PaddlePlan>(`/paddle/plans/${encodeURIComponent(id)}`, data);
    return response.data;
  } catch (err) {
    throwApiError(err);
  }
}
