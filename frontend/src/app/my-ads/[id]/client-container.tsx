"use client";

import Header from "@/components/header/header";
import MutateMyAdForm from "@/components/mutate-my-ad-form/mutate-my-ad-form";
import errorHandler from "@/lib/error-handler";
import { useCities } from "@/lib/services/cities/use-cities";
import { usePlaces } from "@/lib/services/cities/use-places";
// import { usePlaces } from "@/lib/services/cities/use-places";
import { useMyAd } from "@/lib/services/my-ad/use-my-ad";

export interface ClientContainerProps {}

function ClientContainer(_props: ClientContainerProps) {
  const { myAdQuery, deleteWareMutation, onUpdateAdFormSubmit } = useMyAd();
  const { citiesQuery } = useCities();
  const { placesQuery } = usePlaces();

  return (
    <div className="container pt-5 h-100 overflow-scroll">
      <Header />

      <MutateMyAdForm
        form={{
          category_ids: myAdQuery.data?.categories?.map((item) => item.id) || [],
          description: myAdQuery.data?.description || "",
          name: myAdQuery.data?.title || "",
          price: myAdQuery.data?.price || 0,
          address: myAdQuery.data?.address,
          lat: myAdQuery.data?.lat,
          lon: myAdQuery.data?.lon,
          city_id: myAdQuery.data?.city_id,
          place_id: myAdQuery.data?.place_id,
          status: myAdQuery.data?.status,
          photos: myAdQuery.data?.photos?.map((item) => item.image),
          titlePhotoIndex: myAdQuery?.data?.titleImageIndex,
        }}
        categories={myAdQuery.data?.categories}
        onSubmit={async (form, doNotRedirect) => {
          try {
            await onUpdateAdFormSubmit.mutateAsync({ ...form, doNotRedirect });
          } catch (error) {
            errorHandler(error);
          }
        }}
        onDeleteClick={async () => {
          try {
            await deleteWareMutation.mutateAsync();
          } catch (error) {
            errorHandler(error);
          }
        }}
        AddressPickerProps={{
          cities: citiesQuery.data || [],
          places: placesQuery.data || [],
        }}
      />
    </div>
  );
}

export default ClientContainer;
