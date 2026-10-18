import { api } from "@/shared/api/axios_client";
import type { PaddleTransaction } from "../domain/domain";
import { throwApiError } from "./error";

export async function createPaddleTransaction(planId: string, itemId: string): Promise<PaddleTransaction> {
  try {
    const response = await api.post<PaddleTransaction>("/paddle/checkout", {
      plan_id: planId,
      item_id: itemId,
    });
    return response.data;
  } catch (error) {
    throwApiError(error);
  }
}

export async function getPaddleTransaction(paddleTransactionId: string): Promise<PaddleTransaction> {
  try {
    const response = await api.get<PaddleTransaction>(
      `/paddle/transactions/${encodeURIComponent(paddleTransactionId)}`,
    );
    return response.data;
  } catch (error) {
    throwApiError(error);
  }
}
