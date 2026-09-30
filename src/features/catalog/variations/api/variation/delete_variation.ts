import { api } from "@/shared/api/axios_client";
import { AxiosError } from "axios";

export async function deleteVariation(id: string): Promise<void> {
  try {
    await api.delete(`/variations/${id}`);
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
