"use client";

import { AdCreated } from "@/components/ad-created/AdCreated";
import Header from "@/components/header/header";
import MutateMyAdForm from "@/components/mutate-my-ad-form/mutate-my-ad-form";
import PickCategory from "@/components/pick-category/PickCategory";
import errorHandler from "@/lib/error-handler";
import { useCategories } from "@/lib/services/categories/use-categories";
import { useCities } from "@/lib/services/cities/use-cities";
import { usePlaces } from "@/lib/services/cities/use-places";
// import { usePlaces } from "@/lib/services/cities/use-places";
import { useMyAd } from "@/lib/services/my-ad/use-my-ad";
import { Category } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ClientContainer() {
  const { onCreateAdFormSubmit, onUpdateAdFormSubmit } = useMyAd();
  const { categoriesQuery } = useCategories();
  const { citiesQuery } = useCities();
  const { placesQuery } = usePlaces();
  const router = useRouter();
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [stage, setStage] = useState<"category" | "form" | "created">("category");
  // const [createdForm, setCreatedForm] = useState<adForm | undefined>();
  const createdForm = onCreateAdFormSubmit.data?.data?.data;

  return (
    <div className="container pt-5 h-100 overflow-scroll">
      {["form", "category"].includes(stage) ? (
        <Header
          title={stage === "form" ? category?.label : "Category"}
          backBehaviour={stage === "category" ? "tree" : undefined}
          onBackClick={
            stage === "form"
              ? () => {
                  setCategory(undefined);
                  setStage("category");
                }
              : undefined
          }
        />
      ) : null}
      {stage === "category" ? (
        <PickCategory
          categories={categoriesQuery.data || []}
          onCategoryPicked={(category) => {
            setCategory(category);
            setStage("form");
          }}
        />
      ) : null}
      {stage === "form" ? (
        <MutateMyAdForm
          onDeleteClick={async () => {}}
          form={undefined}
          AddressPickerProps={{ cities: citiesQuery.data || [], places: placesQuery.data || [] }}
          // AddressPickerProps={{ cities: citiesQuery.data || [], places: [] }}
          onSubmit={async (form) => {
            try {
              await onCreateAdFormSubmit.mutateAsync(
                {
                  ...form,
                  category_ids: [category?.id!],
                },
                {
                  onSuccess: () => {
                    setStage("created");
                  },
                }
              );
            } catch (error) {
              errorHandler(error);
            }
          }}
        />
      ) : null}
      {stage === "created" ? (
        <AdCreated
          onPublishPress={async () => {
            try {
              const { categories, ...form } = createdForm!;
              await onUpdateAdFormSubmit.mutateAsync({ ...form!, status: "on" }!);
              router.replace("/my-ads");
            } catch (error) {
              errorHandler(error);
            }
          }}
          backToListHref="/my-ads"
        />
      ) : null}
    </div>
  );
}
