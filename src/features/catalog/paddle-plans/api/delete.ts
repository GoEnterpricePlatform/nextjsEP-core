import { api } from "@/shared/api/axios_client";
import { throwApiError } from "./error";

export async function deletePaddlePlan(id: string): Promise<void> {
  try {
    await api.delete(`/paddle/plans/${encodeURIComponent(id)}`);
  } catch (err) {
    throwApiError(err);
  }
}
