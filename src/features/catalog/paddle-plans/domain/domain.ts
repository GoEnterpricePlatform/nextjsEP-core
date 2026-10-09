// features/catalog/paddle-plans/domain/domain.ts

export interface PaddlePlan {
  id: string;
  plan_id: string;
  name: string;
  description: string | null;
  paddle_product_id: string;
  order: number;
  paddle_product?: PaddleProduct;
  items: PaddlePlanItem[];
  variations?: { name: string; values: string[] }[] | null;
  img_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaddlePlanItem {
  id: string;
  plan_item_id: string;
  features: string[];
  var_option_ids: string[];
  paddle_price_id: string;
  paddle_price?: PaddlePrice;
  img_url?: string | null;
  status?: string;
  options?: { name: string; var_opt_name: string; var_opt_value: string }[];
  created_at: string;
  updated_at: string;
}

export interface PaddleProduct {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  status: string;
}

export interface PaddlePrice {
  id: string;
  name: string | null;
  description: string;
  amount: string;
  currency_code: string;
  billing_cycle: { interval: string; frequency: number } | null;
  status: string;
}

export interface PaddleCheckout {
  transaction_id: string;
  plan_id: string;
  plan_item_id: string;
  paddle_price_id: string;
  status: string;
  subscription_id?: string;
  updated_at: string;
}

export interface CreatePaddlePlanRequest {
  name: string;
  description: string | null;
  paddle_product_id: string;
  order: number;
  items: CreatePaddlePlanItem[];
}

export interface CreatePaddlePlanItem {
  features: string[];
  var_option_ids: string[];
  paddle_price_id: string;
}

export interface PaddlePlanListItem extends Omit<PaddlePlan, "created_at" | "updated_at"> {
  id: string;
  plan_id: string;
  name: string;
  description: string | null;
  paddle_product_id: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface PaddlePlanPage {
  count: number;
  pages: number;
  plans: PaddlePlanListItem[];
}

export interface UpdatePaddlePlanRequest extends CreatePaddlePlanRequest {
  items: UpdatePaddlePlanItem[];
}

export interface UpdatePaddlePlanItem extends CreatePaddlePlanItem {
  id?: string;
}
