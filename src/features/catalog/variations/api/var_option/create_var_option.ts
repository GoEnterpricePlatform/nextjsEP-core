import { api } from "@/shared/api/axios_client";
import { CreateVarOptionRequest } from "../request";
import { VariationOption } from "../../domain/domain";
import { AxiosError } from "axios";

export async function createVarOption(
  variationId: string,
  data: CreateVarOptionRequest,
): Promise<VariationOption> {
  try {
    const response = await api.post<VariationOption>(
      `/variations/${variationId}/options`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

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
