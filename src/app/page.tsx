"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";

import { createPaddleCheckout } from "@/features/catalog/paddle-plans/api/checkout";
import { listPaddlePlansThunk } from "@/features/catalog/paddle-plans/redux/thunks/list";
import type {
  PaddlePlanItem,
  PaddlePlanListItem,
} from "@/features/catalog/paddle-plans/domain/domain";
import CustomButton from "@/shared/components/CustomButton";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { useAppDispatch, useAppSelector } from "@/shared/redux/hooks";

interface PaddleCheckoutEvent {
  name: string;
  data?: { transaction_id?: string };
}

declare global {
  interface Window {
    Paddle?: {
      Environment: { set: (environment: "sandbox") => void };
      Initialize: (options: {
        token: string;
        eventCallback: (event: PaddleCheckoutEvent) => void;
      }) => void;
      Checkout: {
        open: (options: {
          transactionId: string;
          customer?: { email: string };
          settings: { successUrl: string; displayMode: "overlay"; theme: "light" };
        }) => void;
      };
    };
    __paddleInitialized?: boolean;
  }
}

function formatPrice(amount: string, currency: string) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return null;

  try {
    const formatter = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    });
    const fractionDigits = formatter.resolvedOptions().maximumFractionDigits ?? 2;
    return formatter.format(value / 10 ** fractionDigits);
  } catch {
    return `${currency} ${value / 100}`;
  }
}

function cycleLabel(cycle: { interval: string; frequency: number } | null) {
  if (!cycle) return "One-time payment";
  const interval = cycle.interval.toLowerCase();
  return cycle.frequency === 1
    ? `per ${interval}`
    : `every ${cycle.frequency} ${interval}s`;
}

function ItemCard({
  plan,
  item,
  isStartingCheckout,
  onCheckout,
}: {
  plan: PaddlePlanListItem;
  item: PaddlePlanItem;
  isStartingCheckout: boolean;
  onCheckout: () => void;
}) {
  const product = plan.paddle_product;
  const price = item.paddle_price;
  const itemOptions = item.options?.map((option) => option.var_opt_name).filter(Boolean);
  const itemName = itemOptions?.length ? itemOptions.join(" · ") : null;
  const formattedPrice = price && formatPrice(price.amount, price.currency_code);

  return (
    <article className="flex w-full max-w-sm flex-col rounded-lg border border-gray-200 bg-white p-7 shadow-sm">
      {product?.image_url && (
        // Paddle product images may be hosted outside this application.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.image_url}
          alt=""
          className="mb-5 h-14 w-14 rounded-md object-cover"
        />
      )}
      <p className="text-sm font-medium text-gray-500">{plan.name}</p>
      <h2 className="mt-2 text-2xl font-semibold text-gray-950">
        {product?.name || plan.name}
      </h2>
      {itemName && <p className="mt-2 text-lg text-gray-700">{itemName}</p>}
      {(plan.description || product?.description) && (
        <p className="mt-4 text-base leading-7 text-gray-600">
          {plan.description || product?.description}
        </p>
      )}

      <div className="mt-6 border-t border-gray-200 pt-5">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-4xl font-semibold tracking-tight text-gray-950">
            {formattedPrice ?? "Price unavailable"}
          </span>
          {price && <span className="text-base text-gray-500">{cycleLabel(price.billing_cycle)}</span>}
        </div>
      </div>

      {!!item.features?.length && (
        <ul className="mt-6 flex-1 space-y-3 text-base leading-6 text-gray-700">
          {item.features.map((feature, index) => (
            <li key={`${item.id}-${index}`} className="flex gap-3">
              <span aria-hidden="true" className="font-semibold text-gray-900">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={onCheckout}
        disabled={isStartingCheckout}
        className="mt-8 inline-flex min-h-12 items-center justify-center rounded-md bg-black px-5 py-3 text-base font-semibold text-white transition hover:bg-gray-800 disabled:cursor-wait disabled:opacity-60"
      >
        {isStartingCheckout ? "Opening checkout…" : "Get started"}
      </button>
    </article>
  );
}

function LandingPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { auth } = useAppSelector((state) => state.authReducer);
  const { paddlePlans, isListing, error: plansError } = useAppSelector(
    (state) => state.paddlePlansReducer,
  );
  const [paddleReady, setPaddleReady] = useState(false);
  const [startingItemId, setStartingItemId] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const paddleToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

  const initializePaddle = () => {
    if (!paddleToken || !window.Paddle) return;
    if (window.__paddleInitialized) {
      setPaddleReady(true);
      return;
    }
    if (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT !== "production") {
      window.Paddle.Environment.set("sandbox");
    }
    window.Paddle.Initialize({
      token: paddleToken,
      eventCallback: (event) => {
        if (event.name === "checkout.completed" && event.data?.transaction_id) {
          setStartingItemId(null);
          router.push(`/checkout/success?transaction_id=${encodeURIComponent(event.data.transaction_id)}`);
        } else if (event.name === "checkout.closed") {
          setStartingItemId(null);
        }
      },
    });
    window.__paddleInitialized = true;
    setPaddleReady(true);
  };

  const startCheckout = async (plan: PaddlePlanListItem, item: PaddlePlanItem) => {
    if (!paddleReady || !window.Paddle) {
      setCheckoutError("Checkout is not ready yet. Please try again in a moment.");
      return;
    }
    setCheckoutError(null);
    setStartingItemId(item.id);
    try {
      const checkout = await createPaddleCheckout(plan.id, item.id);
      const successUrl = `${window.location.origin}/checkout/success?transaction_id=${encodeURIComponent(checkout.transaction_id)}`;
      window.Paddle.Checkout.open({
        transactionId: checkout.transaction_id,
        ...(auth?.user?.email ? { customer: { email: auth.user.email } } : {}),
        settings: { successUrl, displayMode: "overlay", theme: "light" },
      });
    } catch (error) {
      setStartingItemId(null);
      setCheckoutError(error instanceof Error ? error.message : "Unable to start checkout.");
    }
  };

  useEffect(() => {
    dispatch(listPaddlePlansThunk(1));
  }, [dispatch]);

  const items = paddlePlans.flatMap((plan) =>
    plan.items.map((item) => ({ plan, item })),
  );

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        strategy="afterInteractive"
        onReady={initializePaddle}
      />
      <nav className="flex w-full items-center justify-between bg-black px-6 py-3 text-white shadow-md">
        <Link href="/" className="text-lg font-semibold">
          MyApp
        </Link>

        {auth?.user ? (
          <div className="flex items-center gap-3">
            <UserAvatar email={auth.user.email} imgUrl={auth.user.img_url} />
            <span className="hidden text-sm opacity-90 sm:inline">{auth.user.email}</span>
            <CustomButton onClick={() => router.push("/home")} text="Go to Home" />
          </div>
        ) : (
          <Link
            href="/auth/sign-in"
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-100"
          >
            Sign in
          </Link>
        )}
      </nav>

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-14 sm:py-20">
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Plans
          </h1>
          <p className="mt-4 text-lg leading-7 text-gray-600">
            Compare available options and choose what works for you.
          </p>
        </header>

        {plansError && (
          <p role="alert" className="mx-auto mt-10 max-w-2xl rounded-md border border-red-200 bg-red-50 p-4 text-base text-red-700">
            Unable to load plans right now.
          </p>
        )}
        {checkoutError && (
          <p role="alert" className="mx-auto mt-6 max-w-2xl rounded-md border border-red-200 bg-red-50 p-4 text-base text-red-700">
            {checkoutError}
          </p>
        )}
        {!paddleToken && (
          <p role="status" className="mx-auto mt-6 max-w-2xl text-center text-sm text-gray-500">
            Checkout needs a Paddle client-side token configured for this frontend.
          </p>
        )}
        {isListing ? (
          <p role="status" className="mt-14 text-center text-base text-gray-500">
            Loading plans…
          </p>
        ) : items.length ? (
          <section
            aria-label="Available plan items"
            className="mx-auto mt-12 flex max-w-7xl flex-wrap justify-center gap-6"
          >
            {items.map(({ plan, item }) => (
              <ItemCard
                key={item.id}
                plan={plan}
                item={item}
                isStartingCheckout={startingItemId === item.id}
                onCheckout={() => startCheckout(plan, item)}
              />
            ))}
          </section>
        ) : !plansError ? (
          <p className="mt-14 text-center text-base text-gray-500">
            Plans will be available soon.
          </p>
        ) : null}
      </main>
    </div>
  );
}

export default LandingPage;
