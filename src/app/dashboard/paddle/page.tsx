"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/shared/redux/hooks";
import { listPaddlePlansThunk } from "@/features/catalog/paddle-plans/redux/thunks/list";
import { deletePaddlePlanThunk } from "@/features/catalog/paddle-plans/redux/thunks/delete";

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
}

export default function PaddlePlansPage() {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const { paddlePlans, count, pages, isListing, deletingId, error } =
    useAppSelector((state) => state.paddlePlansReducer);

  useEffect(() => {
    dispatch(listPaddlePlansThunk(page));
  }, [dispatch, page]);

  const handleDelete = async (id: string, name: string) => {
    if (
      !window.confirm(
        `Delete "${name}"? Its linked plan and combinations will also be deleted.`,
      )
    )
      return;
    const visibleCount = paddlePlans.length;
    const result = await dispatch(deletePaddlePlanThunk(id));
    if (!deletePaddlePlanThunk.fulfilled.match(result)) return;
    if (visibleCount === 1 && page > 1) {
      setPage(page - 1);
    } else {
      dispatch(listPaddlePlansThunk(page));
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 text-black">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Paddle plans</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your plans and their Paddle product and price IDs.
          </p>
        </div>
        <Link
          href="/dashboard/paddle/create"
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Create plan
        </Link>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {error.message}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-sm font-semibold">Plans</h2>
          <span className="text-sm text-gray-500">{count} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">
                  Plan
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Paddle product ID
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Items
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Order
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Updated
                </th>
                <th scope="col" className="px-5 py-3 text-right font-medium">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {!isListing &&
                paddlePlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <Link
                        href={`/dashboard/paddle/${plan.id}`}
                        className="font-medium hover:underline"
                      >
                        {plan.name || "Untitled plan"}
                      </Link>
                      {plan.description && (
                        <p className="mt-1 max-w-sm truncate text-xs text-gray-500">
                          {plan.description}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-gray-600">
                      {plan.paddle_product_id}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {plan.items?.length ?? 0}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {plan.order}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {formatDate(plan.updated_at)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/paddle/${plan.id}`}
                          className="inline-block rounded-md border border-gray-300 px-3 py-1.5 font-medium hover:bg-gray-100"
                        >
                          Update
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(plan.id, plan.name)}
                          disabled={!!deletingId || isListing}
                          className="rounded-md border border-red-200 px-3 py-1.5 font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          {deletingId === plan.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {!isListing && !error && paddlePlans.length === 0 && (
          <div className="px-5 py-12 text-center text-sm text-gray-500">
            No Paddle plans yet. Create your first plan to get started.
          </div>
        )}
        {isListing && (
          <div
            role="status"
            className="px-5 py-8 text-center text-sm text-gray-500"
          >
            Loading plans...
          </div>
        )}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-end gap-3 text-sm">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page <= 1 || isListing}
            className="rounded-md border border-gray-300 px-3 py-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {page} of {pages}
          </span>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(pages, current + 1))}
            disabled={page >= pages || isListing}
            className="rounded-md border border-gray-300 px-3 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
