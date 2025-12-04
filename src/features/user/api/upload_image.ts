import { api } from "@/shared/api/axios_client";
import { AxiosError } from "axios";

export async function uploadImage(userId: string, file: File) {
  try {
    const formData = new FormData();
    formData.append("image", file);

    await api.post(`/users/${userId}/avatar`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
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
