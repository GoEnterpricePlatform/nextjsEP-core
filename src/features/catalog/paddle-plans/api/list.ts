import { api } from "@/shared/api/axios_client";
import { PaddlePlanPage } from "../domain/domain";
import { throwApiError } from "./error";

export async function listPaddlePlans(page: number, limit = 10): Promise<PaddlePlanPage> {
  try {
    const response = await api.get<PaddlePlanPage>("/paddle/plans", { params: { page, limit } });
    return response.data;
  } catch (err) {
    throwApiError(err);
  }
}
