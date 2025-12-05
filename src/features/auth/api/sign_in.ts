import { api } from "@/shared/api/axios_client";
import { AxiosError } from "axios";
import { Auth } from "../domain/domain";

export async function signIn(email: string, password: string): Promise<Auth> {
  try {
    const resp = await api.post<Auth>(
      "/auth/sign-in",
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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
