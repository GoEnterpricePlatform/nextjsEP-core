import { AxiosError } from "axios";
import { Auth } from "../domain/domain";
import { api } from "@/shared/api/axios_client";

export async function signUp(
  email: string,
  password: string,
  confirmPass: string
): Promise<Auth> {

  try {
    const resp = await api.post<Auth>(
      "/auth/sign-up",
      {
        email,
        password,
        confirm_password: confirmPass,
      },
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
