import { api } from "@/shared/api/axios_client";
import type { PaddleCheckout } from "../domain/domain";
import { throwApiError } from "./error";

export async function createPaddleCheckout(planId: string, itemId: string): Promise<PaddleCheckout> {
  try {
    const response = await api.post<PaddleCheckout>("/paddle/checkout", {
      plan_id: planId,
      item_id: itemId,
    });
    return response.data;
  } catch (error) {
    throwApiError(error);
  }
}

export async function getPaddleCheckout(transactionId: string): Promise<PaddleCheckout> {
  try {
    const response = await api.get<PaddleCheckout>(
      `/paddle/checkout/${encodeURIComponent(transactionId)}`,
    );
    return response.data;
  } catch (error) {
    throwApiError(error);
  }
}
