"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useEffect, useState } from "react";

import { getPaddleCheckout } from "@/features/catalog/paddle-plans/api/checkout";

type PaymentStatus = "loading" | "pending" | "completed" | "canceled" | "past_due" | "error";

function CheckoutStatus() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transaction_id");
  const [status, setStatus] = useState<PaymentStatus>(transactionId ? "loading" : "error");

  useEffect(() => {
    if (!transactionId) return;

    let active = true;
    let attempts = 0;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const checkStatus = async () => {
      try {
        const checkout = await getPaddleCheckout(transactionId);
        if (!active) return;
        if (checkout.status === "completed") {
          setStatus("completed");
          return;
        }
        if (checkout.status === "canceled" || checkout.status === "past_due") {
          setStatus(checkout.status);
          return;
        }
        setStatus("pending");
      } catch {
        if (!active) return;
        setStatus("pending");
      }

      attempts += 1;
      if (active && attempts < 20) {
        timeout = setTimeout(checkStatus, 1500);
      }
    };

    void checkStatus();
    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [transactionId]);

  const content = {
    loading: { title: "Checking your payment", message: "Please wait while we confirm the transaction." },
    pending: { title: "Payment is being confirmed", message: "Paddle is still processing the transaction. You can return to this page later to check its status." },
    completed: { title: "Payment complete", message: "Your payment was confirmed successfully." },
    canceled: { title: "Checkout canceled", message: "No payment was completed. You can return to the plans and try again." },
    past_due: { title: "Payment needs attention", message: "Paddle could not complete this payment. Please try checkout again." },
    error: { title: "Unable to find this checkout", message: "The checkout link is missing a valid transaction ID." },
  }[status];

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-16 text-black">
      <section className="w-full max-w-xl rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-10">
        <p className="text-sm font-medium uppercase tracking-wide text-gray-500">Paddle checkout</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{content.title}</h1>
        <p className="mt-4 text-lg leading-7 text-gray-600">{content.message}</p>
        {transactionId && <p className="mt-6 break-all font-mono text-xs text-gray-400">Transaction: {transactionId}</p>}
        <Link href="/" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-md bg-black px-5 py-3 text-base font-semibold text-white hover:bg-gray-800">
          Back to plans
        </Link>
      </section>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-white px-6 py-16 text-black">
          <p className="text-lg text-gray-600">Loading checkout status…</p>
        </main>
      }
    >
      <CheckoutStatus />
    </Suspense>
  );
}
