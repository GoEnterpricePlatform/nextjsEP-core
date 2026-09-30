import { api } from "@/shared/api/axios_client";
import { Variation } from "../../domain/domain";
import { UpdateVariationRequest } from "../request";
import { AxiosError } from "axios";

export async function updateVariation(
  id: string,
  data: UpdateVariationRequest,
): Promise<Variation> {
  try {
    const response = await api.put<Variation>(`/variations/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (err) {
    const axiosError = err as AxiosError;

    if (axiosError.response?.data) {
      const backendError = axiosError.response.data as {
        code: string;
        msg: string;
      };
      throw new Error(backendError.msg);
    }
    throw err;
  }
}
