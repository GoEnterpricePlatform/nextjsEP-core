import { api } from "@/shared/api/axios_client";
import { Auth } from "../domain/domain";
import { AxiosError } from "axios";

export async function verifyEmail(
  otpId: string,
  otpCode: string,
  userId: string
): Promise<Auth> {
  try {
    const resp = await api.post<Auth>(
      "/auth/verify-email",
      {
        otp_id: otpId,
        otp_code: otpCode,
        user_id: userId,
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
