import { api } from "@/shared/api/axios_client";
import { PaddlePlan } from "../domain/domain";
import { throwApiError } from "./error";

export async function getPaddlePlan(id: string): Promise<PaddlePlan> {
  try {
    const response = await api.get<PaddlePlan>(`/paddle/plans/${encodeURIComponent(id)}`);
    return response.data;
  } catch (err) {
    throwApiError(err);
  }
}
