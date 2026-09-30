export interface CreateVariationRequest {
  name: string;
}

export interface UpdateVariationRequest {
  name: string;
}

export interface CreateVarOptionRequest {
  label: string;
  value: string | null;
}

export interface UpdateVarOptionRequest {
  label: string;
  value: string | null;
}