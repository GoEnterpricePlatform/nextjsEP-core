"use client";

import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/shared/redux/hooks";

import {
  Variation,
  VariationOption,
} from "@/features/catalog/variations/domain/domain";

import { getVariationsWithOptionsThunk } from "@/features/catalog/variations/redux/thunks/variations/get_varitions_with_options";
import { CreateVariationRequest, CreateVarOptionRequest, UpdateVariationRequest, UpdateVarOptionRequest } from "@/features/catalog/variations/api/request";
import { updateVariationThunk } from "@/features/catalog/variations/redux/thunks/variations/update";
import { createVariationThunk } from "@/features/catalog/variations/redux/thunks/variations/create";
import { deleteVariationThunk } from "@/features/catalog/variations/redux/thunks/variations/delete";
import { updateVarOptionThunk } from "@/features/catalog/variations/redux/thunks/var_option.ts/update";
import { createVarOptionThunk } from "@/features/catalog/variations/redux/thunks/var_option.ts/create";
import { deleteVarOptionThunk } from "@/features/catalog/variations/redux/thunks/var_option.ts/delete";

function CatalogPage() {
  const dispatch = useAppDispatch();

  const {
    variations,
    isVariationLoading,
    isVarOptionLoading,
    error,
  } = useAppSelector((state) => state.variationsReducer);

  const [variationModal, setVariationModal] = useState(false);
  const [optionModal, setOptionModal] = useState(false);

  const [selectedVariation, setSelectedVariation] =
    useState<Variation | null>(null);

  const [selectedOption, setSelectedOption] =
    useState<VariationOption | null>(null);

  const [variationName, setVariationName] = useState("");
  const [optionLabel, setOptionLabel] = useState("");
  const [optionValue, setOptionValue] = useState("");

  useEffect(() => {
    dispatch(getVariationsWithOptionsThunk());
  }, [dispatch]);

  // ============================================================
  // Variation
  // ============================================================

  const openCreateVariation = () => {
    setSelectedVariation(null);
    setVariationName("");
    setVariationModal(true);
  };

  const openEditVariation = (variation: Variation) => {
    setSelectedVariation(variation);
    setVariationName(variation.name);
    setVariationModal(true);
  };

  const closeVariationModal = () => {
    if (isVariationLoading) return;

    setVariationModal(false);
    setSelectedVariation(null);
    setVariationName("");
  };

  const handleSaveVariation = async () => {
    const name = variationName.trim();

    if (!name) return;

    if (selectedVariation) {
      const data: UpdateVariationRequest = {
        name,
      };

      await dispatch(
        updateVariationThunk({
          id: selectedVariation.id,
          data,
        }),
      );

      closeVariationModal();
      return;
    }

    const data: CreateVariationRequest = {
      name,
    };

    await dispatch(createVariationThunk(data.name));

    closeVariationModal();
  };

  const handleDeleteVariation = async (variation: Variation) => {
    const confirmed = window.confirm(
      `Delete variation "${variation.name}"?`,
    );

    if (!confirmed) return;

    await dispatch(deleteVariationThunk(variation.id));
  };

  // ============================================================
  // Options
  // ============================================================

  const openCreateOption = (variation: Variation) => {
    setSelectedVariation(variation);
    setSelectedOption(null);

    setOptionLabel("");
    setOptionValue("");

    setOptionModal(true);
  };

  const openEditOption = (
    variation: Variation,
    option: VariationOption,
  ) => {
    setSelectedVariation(variation);
    setSelectedOption(option);

    setOptionLabel(option.label);
    setOptionValue(option.value ?? "");

    setOptionModal(true);
  };

  const closeOptionModal = () => {
    if (isVarOptionLoading) return;

    setOptionModal(false);
    setSelectedVariation(null);
    setSelectedOption(null);

    setOptionLabel("");
    setOptionValue("");
  };

  const handleSaveOption = async () => {
    if (!selectedVariation) return;

    const label = optionLabel.trim();

    if (!label) return;

    const value = optionValue.trim() || null;

    if (selectedOption) {
      const data: UpdateVarOptionRequest = {
        label,
        value,
      };

      await dispatch(
        updateVarOptionThunk({
          variationId: selectedVariation.id,
          id: selectedOption.id,
          data,
        }),
      );

      closeOptionModal();
      return;
    }

    const data: CreateVarOptionRequest = {
      label,
      value,
    };

    await dispatch(
      createVarOptionThunk({
        variationId: selectedVariation.id,
        data,
      }),
    );

    closeOptionModal();
  };

  const handleDeleteOption = async (
    variation: Variation,
    option: VariationOption,
  ) => {
    const confirmed = window.confirm(
      `Delete option "${option.label}"?`,
    );

    if (!confirmed) return;

    await dispatch(
      deleteVarOptionThunk({
        variationId: variation.id,
        id: option.id,
      }),
    );
  };

  return (
    <div className="min-h-screen bg-white p-6 text-black">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Catalog</h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your product variations and options.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateVariation}
            disabled={isVariationLoading}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add variation
          </button>
        </div>

        {/* Global error */}
        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error.message}
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-5 py-3 font-medium text-gray-700">
                  Variation
                </th>

                <th className="px-5 py-3 font-medium text-gray-700">
                  Options
                </th>

                <th className="px-5 py-3 font-medium text-gray-700">
                  Created
                </th>

                <th className="px-5 py-3 font-medium text-gray-700">
                  Updated
                </th>

                <th className="px-5 py-3 text-right font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {isVariationLoading && variations.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    Loading variations...
                  </td>
                </tr>
              ) : variations.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-gray-500"
                  >
                    No variations found.
                  </td>
                </tr>
              ) : (
                variations.map((variation) => (
                  <tr
                    key={variation.id}
                    className="transition hover:bg-gray-50"
                  >
                    {/* Variation */}
                    <td className="px-5 py-4 align-top">
                      <div className="font-medium">
                        {variation.name}
                      </div>
                    </td>

                    {/* Options */}
                    <td className="px-5 py-4 align-top">
                      <div className="flex flex-wrap items-center gap-2">
                        {variation.options?.map((option) => (
                          <div
                            key={option.id}
                            className="group flex items-center gap-1 rounded-md border border-gray-300 bg-white"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                openEditOption(
                                  variation,
                                  option,
                                )
                              }
                              className="px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:text-black"
                            >
                              {option.label}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteOption(
                                  variation,
                                  option,
                                )
                              }
                              disabled={isVarOptionLoading}
                              className="border-l border-gray-200 px-2 py-1.5 text-xs text-gray-400 hover:text-red-600 disabled:opacity-50"
                              title="Delete option"
                            >
                              ×
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() =>
                            openCreateOption(variation)
                          }
                          disabled={isVarOptionLoading}
                          className="rounded-md border border-dashed border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:border-gray-500 hover:text-black disabled:opacity-50"
                        >
                          + Add option
                        </button>
                      </div>
                    </td>

                    {/* Created */}
                    <td className="px-5 py-4 align-top text-gray-500">
                      {new Date(
                        variation.created_at,
                      ).toLocaleDateString()}
                    </td>

                    {/* Updated */}
                    <td className="px-5 py-4 align-top text-gray-500">
                      {new Date(
                        variation.updated_at,
                      ).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 align-top">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            openEditVariation(variation)
                          }
                          disabled={isVariationLoading}
                          className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-100 disabled:opacity-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteVariation(variation)
                          }
                          disabled={isVariationLoading}
                          className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================
          Variation Modal
          ======================================================== */}

      {variationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="border-b border-gray-200 px-5 py-4">
              <h2 className="text-lg font-semibold">
                {selectedVariation
                  ? "Edit variation"
                  : "Create variation"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {selectedVariation
                  ? "Update the variation name."
                  : "Create a new product variation."}
              </p>
            </div>

            <div className="px-5 py-5">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Name
              </label>

              <input
                type="text"
                value={variationName}
                onChange={(event) =>
                  setVariationName(event.target.value)
                }
                placeholder="e.g. Billing Cycle"
                disabled={isVariationLoading}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-black disabled:bg-gray-100"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
              <button
                type="button"
                onClick={closeVariationModal}
                disabled={isVariationLoading}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveVariation}
                disabled={
                  isVariationLoading ||
                  !variationName.trim()
                }
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isVariationLoading
                  ? "Saving..."
                  : selectedVariation
                    ? "Save changes"
                    : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          Option Modal
          ======================================================== */}

      {optionModal && selectedVariation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="border-b border-gray-200 px-5 py-4">
              <h2 className="text-lg font-semibold">
                {selectedOption
                  ? "Edit option"
                  : "Create option"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Variation: {selectedVariation.name}
              </p>
            </div>

            <div className="space-y-4 px-5 py-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Label
                </label>

                <input
                  type="text"
                  value={optionLabel}
                  onChange={(event) =>
                    setOptionLabel(event.target.value)
                  }
                  placeholder="e.g. Monthly"
                  disabled={isVarOptionLoading}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-black disabled:bg-gray-100"
                  autoFocus
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Value
                </label>

                <input
                  type="text"
                  value={optionValue}
                  onChange={(event) =>
                    setOptionValue(event.target.value)
                  }
                  placeholder="Optional"
                  disabled={isVarOptionLoading}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-black disabled:bg-gray-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
              <button
                type="button"
                onClick={closeOptionModal}
                disabled={isVarOptionLoading}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveOption}
                disabled={
                  isVarOptionLoading ||
                  !optionLabel.trim()
                }
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isVarOptionLoading
                  ? "Saving..."
                  : selectedOption
                    ? "Save changes"
                    : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CatalogPage;