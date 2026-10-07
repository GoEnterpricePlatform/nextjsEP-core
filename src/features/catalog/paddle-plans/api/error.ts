import { AxiosError } from "axios";

export function throwApiError(err: unknown): never {
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
