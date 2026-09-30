import { api } from "@/shared/api/axios_client";
import { UpdateVarOptionRequest } from "../request";
import { VariationOption } from "../../domain/domain";
import { AxiosError } from "axios";

export async function updateVarOption(
  variationId: string,
  id: string,
  data: UpdateVarOptionRequest,
): Promise<VariationOption> {
  try {
    const response = await api.put<VariationOption>(
      `/variations/${variationId}/options/${id}`,
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
