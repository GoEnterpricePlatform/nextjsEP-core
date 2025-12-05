import { api } from "@/shared/api/axios_client";
import { AxiosError } from "axios";

export async function resendVerifyEmail(email: string): Promise<string> {
  try {
    const resp = await api.post(
      "/auth/resend-verify-email",
      {
        email,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return resp.data.otp_id;
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