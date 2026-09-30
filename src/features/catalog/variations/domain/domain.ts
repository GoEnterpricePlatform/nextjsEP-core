export interface Variation {
  id: string;
  name: string;
  options?: VariationOption[];
  created_at: string;
  updated_at: string;
}

export interface VariationOption {
  id: string;
  variation_id: string;
  label: string;
  value: string | null;
  created_at: string;
  updated_at: string;
}