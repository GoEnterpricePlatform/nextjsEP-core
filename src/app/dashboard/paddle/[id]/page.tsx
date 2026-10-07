"use client";

import { useParams } from "next/navigation";
import PaddlePlanForm from "@/features/catalog/paddle-plans/components/PaddlePlanForm";

export default function PaddlePlanEditPage() {
  const { id } = useParams<{ id: string }>();
  return <PaddlePlanForm key={id} editId={id} />;
}
