"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/shared/redux/hooks";

import { getVariationsWithOptionsThunk } from "@/features/catalog/variations/redux/thunks/variations/get_varitions_with_options";
import { CreatePaddlePlanItem, CreatePaddlePlanRequest, UpdatePaddlePlanRequest } from "@/features/catalog/paddle-plans/domain/domain";
import { createPaddlePlanThunk } from "@/features/catalog/paddle-plans/redux/thunks/create";
import { getPaddlePlanThunk } from "@/features/catalog/paddle-plans/redux/thunks/get";
import { updatePaddlePlanThunk } from "@/features/catalog/paddle-plans/redux/thunks/update";


interface SelectedVariation {
  variationId: string;
  optionIds: string[];
}

interface PlanItemForm {
  id?: string;
  key: string;
  varOptionIds: string[];
  features: string[];
  paddlePriceId: string;
}

function getCombinationKey(optionIds: string[]): string {
  if (optionIds.length === 0) {
    return "no-variants";
  }

  return [...optionIds].sort().join("__");
}

function generateCombinations(
  selectedVariations: SelectedVariation[],
): string[][] {
  if (selectedVariations.length === 0) {
    return [[]];
  }

  let combinations: string[][] = [[]];

  for (const variation of selectedVariations) {
    if (variation.optionIds.length === 0) {
      return [];
    }

    combinations = combinations.flatMap((combination) =>
      variation.optionIds.map((optionId) => [...combination, optionId]),
    );
  }

  return combinations;
}

function buildItems(
  selectedVariations: SelectedVariation[],
  currentItems: PlanItemForm[],
  originalItems: PlanItemForm[] = [],
): PlanItemForm[] {
  const combinations = generateCombinations(selectedVariations);

  return combinations.map((optionIds) => {
    const key = getCombinationKey(optionIds);

    const currentItem = currentItems.find((item) => item.key === key) ?? originalItems.find((item) => item.key === key);

    if (currentItem) {
      return {
        ...currentItem,
        varOptionIds: optionIds,
      };
    }

    return {
      key,
      varOptionIds: optionIds,
      features: [""],
      paddlePriceId: "",
    };
  });
}

export default function PaddlePlanForm({ editId }: { editId?: string }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  /*
   * Las variations NO pertenecen a este módulo.
   *
   * Vienen del variationsReducer, donde ya tenemos:
   * - GET variations
   * - CREATE variation
   * - UPDATE variation
   * - DELETE variation
   * - CREATE option
   * - UPDATE option
   * - DELETE option
   */
  const { variations, isVariationLoading } = useAppSelector(
    (state) => state.variationsReducer,
  );

  const { isLoading, isFetching, error } = useAppSelector(
    (state) => state.paddlePlansReducer,
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [paddleProductId, setPaddleProductId] = useState("");
  const [order, setOrder] = useState(0);
  const [saved, setSaved] = useState(false);
  const [isInitializing, setIsInitializing] = useState(!!editId);
  const originalItems = useRef<PlanItemForm[]>([]);

  const [productWithVariants, setProductWithVariants] = useState(false);

  /*
   * Esto NO duplica las variations.
   *
   * Solo guardamos qué variations/options eligió
   * el usuario para construir ESTE plan.
   */
  const [selectedVariations, setSelectedVariations] = useState<
    SelectedVariation[]
  >([]);

  /*
   * Los items son derivados de las combinaciones.
   *
   * No existe "Add item".
   */
  const [items, setItems] = useState<PlanItemForm[]>([
    {
      key: "no-variants",
      varOptionIds: [],
      features: [""],
      paddlePriceId: "",
    },
  ]);

  /*
   * Cargamos las variations existentes solamente si
   * todavía no están disponibles en Redux.
   */
  useEffect(() => {
    if (!editId && variations.length === 0) {
      dispatch(getVariationsWithOptionsThunk());
    }
  }, [dispatch, editId, variations.length]);

  useEffect(() => {
    if (!editId) return;
    let active = true;
    Promise.all([dispatch(getPaddlePlanThunk(editId)), dispatch(getVariationsWithOptionsThunk())]).then(([result, variationResult]) => {
      if (!active) return;
      setIsInitializing(false);
      if (!getPaddlePlanThunk.fulfilled.match(result)) return;
      const plan = result.payload;
      const availableVariations = getVariationsWithOptionsThunk.fulfilled.match(variationResult) ? variationResult.payload : [];
      setSelectedVariations(availableVariations.map((variation) => ({
        variationId: variation.id,
        optionIds: (variation.options ?? [])
          .filter((option) => plan.items.some((item) => (item.var_option_ids ?? []).includes(option.id)))
          .map((option) => option.id),
      })).filter((variation) => variation.optionIds.length > 0));
      setName(plan.name);
      setDescription(plan.description ?? "");
      setPaddleProductId(plan.paddle_product_id);
      setOrder(plan.order ?? 0);
      setProductWithVariants(plan.items.some((item) => (item.var_option_ids?.length ?? 0) > 0));
      const loadedItems = plan.items.map((item) => ({
        id: item.id,
        key: getCombinationKey(item.var_option_ids ?? []),
        varOptionIds: item.var_option_ids ?? [],
        features: item.features?.length ? item.features : [""],
        paddlePriceId: item.paddle_price_id,
      }));
      originalItems.current = loadedItems;
      setItems(loadedItems);
    });
    return () => { active = false; };
  }, [dispatch, editId]);

  /*
   * Variations que todavía no fueron agregadas
   * al formulario.
   */
  const availableVariations = useMemo(() => {
    return variations.filter(
      (variation) =>
        !selectedVariations.some(
          (selectedVariation) => selectedVariation.variationId === variation.id,
        ),
    );
  }, [variations, selectedVariations]);

  /*
   * Las combinaciones actuales.
   */
  const combinations = useMemo(() => {
    return generateCombinations(selectedVariations);
  }, [selectedVariations]);

  const rebuildItems = (nextSelectedVariations: SelectedVariation[]) => {
    setSaved(false);
    setItems((currentItems) => {
      const drafts = new Map(originalItems.current.map((item) => [item.key, item]));
      currentItems.forEach((item) => drafts.set(item.key, item));
      originalItems.current = [...drafts.values()];
      return nextSelectedVariations.length
        ? buildItems(nextSelectedVariations, currentItems, originalItems.current)
        : [];
    });
  };

  /*
   * Cambiar entre:
   *
   * Product without variants
   * Product with variants
   */
  const handleProductTypeChange = (withVariants: boolean) => {
    if (isLoading || editId) {
      return;
    }

    setSaved(false);

    setProductWithVariants(withVariants);

    const drafts = new Map(originalItems.current.map((item) => [item.key, item]));
    items.forEach((item) => drafts.set(item.key, item));
    originalItems.current = [...drafts.values()];

    if (!withVariants) {
      /*
       * Conservamos el item sin variantes.
       */
      const defaultItem = items.find((item) => item.key === "no-variants") ?? originalItems.current.find((item) => item.key === "no-variants");

      setSelectedVariations([]);

      setItems([
        defaultItem ?? {
          key: "no-variants",
          varOptionIds: [],
          features: [""],
          paddlePriceId: "",
        },
      ]);

      return;
    }

    /*
     * Al entrar a variants comenzamos sin
     * ninguna variation seleccionada.
     */
    setSelectedVariations([]);

    setItems([]);
  };

  /*
   * Agregar una variation al formulario.
   */
  const addVariation = () => {
    const variation = availableVariations[0];

    if (!variation) {
      return;
    }

    const nextSelectedVariations = [
      ...selectedVariations,
      {
        variationId: variation.id,
        optionIds: [],
      },
    ];

    setSelectedVariations(nextSelectedVariations);

    rebuildItems(nextSelectedVariations);
  };

  /*
   * Eliminar una variation del formulario.
   *
   * Los items se vuelven a generar automáticamente.
   */
  const removeVariation = (variationId: string) => {
    if (editId && selectedVariations.length <= 1) return;
    const nextSelectedVariations = selectedVariations.filter(
      (variation) => variation.variationId !== variationId,
    );

    setSelectedVariations(nextSelectedVariations);

    rebuildItems(nextSelectedVariations);
  };

  /*
   * Cambiar la variation de una tarjeta.
   */
  const changeVariation = (variationIndex: number, variationId: string) => {
    const alreadySelected = selectedVariations.some(
      (selectedVariation, index) =>
        index !== variationIndex &&
        selectedVariation.variationId === variationId,
    );

    if (alreadySelected) {
      return;
    }

    const nextSelectedVariations = selectedVariations.map(
      (selectedVariation, index) => {
        if (index !== variationIndex) {
          return selectedVariation;
        }

        return {
          variationId,
          optionIds: [],
        };
      },
    );

    setSelectedVariations(nextSelectedVariations);

    rebuildItems(nextSelectedVariations);
  };

  /*
   * Seleccionar/deseleccionar una option.
   *
   * Ejemplo:
   *
   * Plan:
   *   Basic ✓
   *   Pro ✓
   *
   * Billing Cycle:
   *   Monthly ✓
   *   Yearly ✓
   *
   * genera automáticamente 4 items.
   */
  const toggleOption = (variationIndex: number, optionId: string) => {
    const nextSelectedVariations = selectedVariations.map(
      (selectedVariation, index) => {
        if (index !== variationIndex) {
          return selectedVariation;
        }

        const exists = selectedVariation.optionIds.includes(optionId);

        return {
          ...selectedVariation,
          optionIds: exists
            ? selectedVariation.optionIds.filter((id) => id !== optionId)
            : [...selectedVariation.optionIds, optionId],
        };
      },
    );

    setSelectedVariations(nextSelectedVariations);

    rebuildItems(nextSelectedVariations);
  };

  /*
   * Feature de un item.
   */
  const updateFeature = (
    itemKey: string,
    featureIndex: number,
    value: string,
  ) => {
    setSaved(false);
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.key !== itemKey) {
          return item;
        }

        const features = [...item.features];

        features[featureIndex] = value;

        return {
          ...item,
          features,
        };
      }),
    );
  };

  const addFeature = (itemKey: string) => {
    setSaved(false);
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.key !== itemKey) {
          return item;
        }

        return {
          ...item,
          features: [...item.features, ""],
        };
      }),
    );
  };

  const removeFeature = (itemKey: string, featureIndex: number) => {
    setSaved(false);
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.key !== itemKey) {
          return item;
        }

        const features = item.features.filter(
          (_, index) => index !== featureIndex,
        );

        return {
          ...item,
          features: features.length > 0 ? features : [""],
        };
      }),
    );
  };

  /*
   * Paddle Price ID del item.
   */
  const updatePaddlePriceId = (itemKey: string, value: string) => {
    setSaved(false);
    setItems((currentItems) =>
      currentItems.map((item) => {
        if (item.key !== itemKey) {
          return item;
        }

        return {
          ...item,
          paddlePriceId: value,
        };
      }),
    );
  };

  /*
   * Obtener el nombre de una option desde
   * el variationsReducer.
   */
  const getOptionLabel = (optionId: string): string => {
    for (const variation of variations) {
      const option = variation.options?.find((item) => item.id === optionId);

      if (option) {
        return option.label;
      }
    }

    return optionId;
  };

  /*
   * Ejemplo:
   *
   * ["basicId", "monthlyId"]
   *
   * =>
   *
   * "Basic / Monthly"
   */
  const getCombinationLabel = (optionIds: string[]): string => {
    if (optionIds.length === 0) {
      return "Default";
    }

    return optionIds.map((optionId) => getOptionLabel(optionId)).join(" / ");
  };

  /*
   * Crear Paddle Plan.
   */
  const handleCreate = async () => {
    const payload: CreatePaddlePlanRequest = {
      name: name.trim(),

      description: description.trim() || null,

      paddle_product_id: paddleProductId.trim(),
      order,

      items: items.map(
        (item): CreatePaddlePlanItem => ({
          features: item.features
            .map((feature) => feature.trim())
            .filter(Boolean),

          var_option_ids: item.varOptionIds,

          paddle_price_id: item.paddlePriceId.trim(),
        }),
      ),
    };

    const result = await dispatch(createPaddlePlanThunk(payload));

    if (createPaddlePlanThunk.fulfilled.match(result)) {
      router.push("/dashboard/paddle");
    }
  };

  const handleUpdate = async () => {
    if (!editId) return;
    setSaved(false);
    const data: UpdatePaddlePlanRequest = {
      name: name.trim(),
      description: description.trim() || null,
      paddle_product_id: paddleProductId.trim(),
      order,
      items: items.map((item) => ({
        ...(item.id ? { id: item.id } : {}),
        features: item.features.map((feature) => feature.trim()).filter(Boolean),
        var_option_ids: item.varOptionIds,
        paddle_price_id: item.paddlePriceId.trim(),
      })),
    };
    const result = await dispatch(updatePaddlePlanThunk({ id: editId, data }));
    if (updatePaddlePlanThunk.fulfilled.match(result)) {
      const updatedItems = result.payload.items.map((item) => ({
        id: item.id,
        key: getCombinationKey(item.var_option_ids ?? []),
        varOptionIds: item.var_option_ids ?? [],
        features: item.features?.length ? item.features : [""],
        paddlePriceId: item.paddle_price_id,
      }));
      originalItems.current = updatedItems;
      setItems(updatedItems);
      setSaved(true);
    }
  };

  const hasInvalidVariations =
    productWithVariants &&
    (selectedVariations.length === 0 ||
      selectedVariations.some((variation) => variation.optionIds.length === 0) ||
      combinations.length < 2);

  const hasUnknownOptions = !!editId && items.some((item) => item.varOptionIds.some((id) =>
    !variations.some((variation) => variation.options?.some((option) => option.id === id))));

  const hasEmptyPrice = items.some((item) => item.paddlePriceId.trim() === "");

  const canCreate =
    !isLoading &&
    !isFetching &&
    !isInitializing &&
    !isVariationLoading &&
    name.trim() !== "" &&
    paddleProductId.trim() !== "" &&
    order >= 0 &&
    items.length > 0 &&
    !hasInvalidVariations &&
    !hasUnknownOptions &&
    !hasEmptyPrice &&
    items.every((item) => item.features.some((feature) => feature.trim() !== ""));

  if (isInitializing) {
    return <div role="status" className="mx-auto max-w-6xl p-6 text-sm text-gray-500">Loading plan...</div>;
  }

  return (
    <div className="min-h-screen bg-white p-6 text-black">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}

        <div className="mb-6">
          <Link href="/dashboard/paddle" className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black"><span className="text-lg">‹</span> Paddle plans</Link>

          <h1 className="text-2xl font-semibold">{editId ? "Update plan" : "Create plan"}</h1>

          <p className="mt-1 text-sm text-gray-500">
            {editId ? "Edit the plan and its Paddle IDs." : "Create a new application plan."}
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error.message}
          </div>
        )}

        {saved && <div role="status" className="mb-5 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">Plan updated successfully.</div>}
        {isFetching && <p className="mb-5 text-sm text-gray-500">Loading plan...</p>}
        {hasUnknownOptions && !isVariationLoading && <p className="mb-5 text-sm text-red-600">Some saved variation options could not be loaded from the catalog. Restore them before updating this plan.</p>}
        {editId && !isFetching && !items.some((item) => item.id) && <p className="mb-5 text-sm text-red-600">The plan could not be loaded.</p>}

        <div className="space-y-5">
          {/* GENERAL INFORMATION */}

          <section className="rounded-lg border border-gray-200">
            <div className="border-b border-gray-200 px-5 py-4">
              <h2 className="text-base font-semibold">General information</h2>

              <p className="mt-1 text-sm text-gray-500">
                Basic information about the plan.
              </p>
            </div>

            <div className="grid gap-5 p-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Name
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(event) => { setName(event.target.value); setSaved(false); }}
                  placeholder="Plan name"
                  disabled={isLoading}
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Paddle Product ID
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={paddleProductId}
                  onChange={(event) => { setPaddleProductId(event.target.value); setSaved(false); }}
                  placeholder="pro_..."
                  disabled={isLoading}
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black disabled:bg-gray-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) => { setDescription(event.target.value); setSaved(false); }}
                  placeholder="Plan description"
                  rows={3}
                  disabled={isLoading}
                  className="w-full resize-none rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="plan-order" className="mb-2 block text-sm font-medium">
                  Display order
                </label>
                <input
                  id="plan-order"
                  type="number"
                  min={0}
                  step={1}
                  value={order}
                  onChange={(event) => { setOrder(Number(event.target.value)); setSaved(false); }}
                  disabled={isLoading}
                  className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black disabled:bg-gray-100"
                />
                <p className="mt-1 text-xs text-gray-500">Lower numbers appear first.</p>
              </div>
            </div>
          </section>

          {/* Keep the product type fixed during updates; changing it would replace every combination. */}
          {!editId && <section className="rounded-lg border border-gray-200">
            <div className="border-b border-gray-200 px-5 py-4">
              <h2 className="text-base font-semibold">Product type</h2>

              <p className="mt-1 text-sm text-gray-500">
                Choose how you want to configure your plan.
              </p>
            </div>

            <div className="space-y-4 p-5">
              {/* WITHOUT VARIANTS */}

              <button
                type="button"
                onClick={() => handleProductTypeChange(false)}
                disabled={isLoading}
                className="flex w-full items-start gap-3 text-left"
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    !productWithVariants ? "border-black" : "border-gray-300"
                  }`}
                >
                  {!productWithVariants && (
                    <span className="h-2.5 w-2.5 rounded-full bg-black" />
                  )}
                </span>

                <span>
                  <span className="block text-sm font-medium">
                    Product without variants
                  </span>

                  <span className="mt-1 block text-xs text-gray-500">
                    A single plan with its own features.
                  </span>
                </span>
              </button>

              {/* WITH VARIANTS */}

              <button
                type="button"
                onClick={() => handleProductTypeChange(true)}
                disabled={isLoading}
                className="flex w-full items-start gap-3 text-left"
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                    productWithVariants ? "border-black" : "border-gray-300"
                  }`}
                >
                  {productWithVariants && (
                    <span className="h-2.5 w-2.5 rounded-full bg-black" />
                  )}
                </span>

                <span>
                  <span className="block text-sm font-medium">
                    Product with variants
                  </span>

                  <span className="mt-1 block text-xs text-gray-500">
                    Create multiple plan items based on selected variations.
                  </span>
                </span>
              </button>
            </div>
          </section>}

          {/* VARIATIONS */}

          {productWithVariants && (
            <section className="rounded-lg border border-gray-200">
              <div className="border-b border-gray-200 px-5 py-4">
                <h2 className="text-base font-semibold">Variations</h2>

                <p className="mt-1 text-sm text-gray-500">
                  Select the variations and options for this plan.
                </p>
              </div>

              <div className="p-5">
                {selectedVariations.length === 0 ? (
                  <div className="rounded-md border border-dashed border-gray-300 px-5 py-8 text-center text-sm text-gray-500">
                    Add a variation to generate plan items.
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {selectedVariations.map(
                      (selectedVariation, variationIndex) => {
                        const variation = variations.find(
                          (item) => item.id === selectedVariation.variationId,
                        );

                        if (!variation) {
                          return null;
                        }

                        return (
                          <div
                            key={selectedVariation.variationId}
                            className="rounded-md border border-gray-200 p-4"
                          >
                            <div className="mb-3 flex items-center justify-between">
                              <label className="text-sm font-medium">
                                Variation
                              </label>

                              {(!editId || selectedVariations.length > 1) && (
                                <button
                                  type="button"
                                  onClick={() => removeVariation(selectedVariation.variationId)}
                                  disabled={isLoading}
                                  className="text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
                                >
                                  Remove
                                </button>
                              )}
                            </div>

                            <select
                              value={selectedVariation.variationId}
                              onChange={(event) =>
                                changeVariation(
                                  variationIndex,
                                  event.target.value,
                                )
                              }
                              disabled={isLoading}
                              className="mb-4 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-black disabled:bg-gray-100"
                            >
                              {variations.map((optionVariation) => {
                                const alreadyUsed = selectedVariations.some(
                                  (item, index) =>
                                    index !== variationIndex &&
                                    item.variationId === optionVariation.id,
                                );

                                return (
                                  <option
                                    key={optionVariation.id}
                                    value={optionVariation.id}
                                    disabled={alreadyUsed}
                                  >
                                    {optionVariation.name}
                                  </option>
                                );
                              })}
                            </select>

                            <div className="flex flex-wrap gap-2">
                              {(variation.options ?? []).map((option) => {
                                /*
                                 * IMPORTANTE:
                                 *
                                 * No usamos "selected" aquí
                                 * porque selectedVariation ya
                                 * existe en el scope exterior.
                                 */
                                const isOptionSelected =
                                  selectedVariation.optionIds.includes(
                                    option.id,
                                  );

                                return (
                                  <button
                                    key={option.id}
                                    type="button"
                                    onClick={() =>
                                      toggleOption(variationIndex, option.id)
                                    }
                                    aria-pressed={isOptionSelected}
                                    disabled={isLoading}
                                    className={`rounded-md border px-3 py-1.5 text-xs font-medium transition ${
                                      isOptionSelected
                                        ? "border-black bg-black text-white"
                                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-500"
                                    }`}
                                  >
                                    {option.label}
                                  </button>
                                );
                              })}
                            </div>

                            {selectedVariation.optionIds.length === 0 && (
                              <p className="mt-3 text-xs text-gray-500">
                                Select at least one option.
                              </p>
                            )}
                          </div>
                        );
                      },
                    )}
                  </div>
                )}

                {availableVariations.length > 0 && (
                  <button
                    type="button"
                    onClick={addVariation}
                    disabled={isLoading}
                    className="mt-4 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                  >
                    + Add variation
                  </button>
                )}
              </div>
            </section>
          )}

          {/* ITEMS */}

          <section className="rounded-lg border border-gray-200">
            <div className="border-b border-gray-200 px-5 py-4">
              <h2 className="text-base font-semibold">Items</h2>

              <p className="mt-1 text-sm text-gray-500">
                {productWithVariants
                  ? "Items are automatically generated from the selected variations."
                  : "Configure the item for this plan."}
              </p>
            </div>

            {productWithVariants && selectedVariations.length === 0 && (
              <div className="p-5">
                <div className="rounded-md border border-dashed border-gray-300 px-5 py-8 text-center text-sm text-gray-500">
                  Select a variation to generate items.
                </div>
              </div>
            )}

            {productWithVariants &&
              selectedVariations.length > 0 &&
              combinations.length === 0 && (
                <div className="p-5">
                  <div className="rounded-md border border-dashed border-gray-300 px-5 py-8 text-center text-sm text-gray-500">
                    Select at least one option from every variation.
                  </div>
                </div>
              )}

            {productWithVariants && combinations.length === 1 && (
              <div className="px-5 py-3 text-sm text-amber-700">Select at least two combinations, or choose a plan without variants.</div>
            )}

            {items.length > 0 &&
              (!productWithVariants || combinations.length > 0) && (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] text-left text-sm">
                    <thead className="border-b border-gray-200 bg-gray-50">
                      <tr>
                        <th className="px-5 py-3 font-medium text-gray-700">
                          Combination
                        </th>

                        <th className="px-5 py-3 font-medium text-gray-700">
                          Features
                        </th>

                        <th className="px-5 py-3 font-medium text-gray-700">
                          Paddle Price ID
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                      {items.map((item) => (
                        <tr key={item.key}>
                          {/* COMBINATION */}

                          <td className="w-52 px-5 py-4 align-top">
                            <div className="font-medium text-gray-800">
                              {getCombinationLabel(item.varOptionIds)}
                            </div>
                          </td>

                          {/* FEATURES */}

                          <td className="px-5 py-4 align-top">
                            <div className="min-w-[320px] space-y-2">
                              {item.features.map((feature, featureIndex) => (
                                <div key={featureIndex} className="flex gap-2">
                                  <input
                                    type="text"
                                    value={feature}
                                    onChange={(event) =>
                                      updateFeature(
                                        item.key,
                                        featureIndex,
                                        event.target.value,
                                      )
                                    }
                                    placeholder="e.g. Unlimited projects"
                                    disabled={isLoading}
                                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black disabled:bg-gray-100"
                                  />

                                  {item.features.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeFeature(item.key, featureIndex)
                                      }
                                      disabled={isLoading}
                                      className="rounded-md border border-gray-300 px-2 text-gray-500 hover:border-red-300 hover:text-red-600"
                                    >
                                      ×
                                    </button>
                                  )}
                                </div>
                              ))}

                              <button
                                type="button"
                                onClick={() => addFeature(item.key)}
                                disabled={isLoading}
                                className="text-xs font-medium text-gray-500 hover:text-black"
                              >
                                + Add feature
                              </button>
                            </div>
                          </td>

                          {/* PADDLE PRICE */}

                          <td className="w-80 px-5 py-4 align-top">
                            <input
                              type="text"
                              value={item.paddlePriceId}
                              onChange={(event) =>
                                updatePaddlePriceId(
                                  item.key,
                                  event.target.value,
                                )
                              }
                              placeholder="pri_..."
                              disabled={isLoading}
                              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black disabled:bg-gray-100"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </section>

          {/* ACTIONS */}

          <div className="flex justify-end gap-3 pb-6">
            <Link href="/dashboard/paddle" className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">Cancel</Link>

            <button
              type="button"
              onClick={editId ? handleUpdate : handleCreate}
              disabled={!canCreate}
              className="rounded-md bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (editId ? "Updating..." : "Creating...") : (editId ? "Update plan" : "Create plan")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
