// features/catalog/paddle-plans/domain/domain.ts

export interface PaddlePlan {
  id: string;
  plan_id: string;
  name: string;
  description: string | null;
  paddle_product_id: string;
  items: PaddlePlanItem[];
  created_at: string;
  updated_at: string;
}

export interface PaddlePlanItem {
  id: string;
  plan_item_id: string;
  features: string[];
  var_option_ids: string[];
  paddle_price_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePaddlePlanRequest {
  name: string;
  description: string | null;
  paddle_product_id: string;
  items: CreatePaddlePlanItem[];
}

export interface CreatePaddlePlanItem {
  features: string[];
  var_option_ids: string[];
  paddle_price_id: string;
}

export interface PaddlePlanListItem {
  id: string;
  plan_id: string;
  name: string;
  description: string | null;
  paddle_product_id: string;
  items: { id: string }[];
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
