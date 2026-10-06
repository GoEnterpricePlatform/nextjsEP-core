// features/catalog/paddle-plans/api/api.ts

import { AxiosError } from "axios";

import { api } from "@/shared/api/axios_client";

import {
  CreatePaddlePlanRequest,
  PaddlePlan,
} from "../domain/domain";

export async function createPaddlePlan(
  data: CreatePaddlePlanRequest,
): Promise<PaddlePlan> {
  try {
    const response = await api.post<PaddlePlan>(
      "/paddle/plans",
      data,
    );

    return response.data;
  } catch (err) {
    throwApiError(err);
  }
}

function throwApiError(err: unknown): never {
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