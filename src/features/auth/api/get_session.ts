import { api } from "@/shared/api/axios_client";
import { AxiosError } from "axios";
import { Auth } from "../domain/domain";

export async function getSession(): Promise<Auth> {
  try {
    const resp = await api.get<Auth>("/auth/get-session");
    return resp.data;
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
