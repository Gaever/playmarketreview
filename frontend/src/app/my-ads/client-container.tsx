"use client";

import { useMyAds } from "@/lib/services/my-ads/use-my-ads";
import MyAds from "./my-ads";

export interface ClientContainerProps {}

function ClientContainer(_props: ClientContainerProps) {
  const { myAds } = useMyAds();

  return (
    <MyAds
      MyAdListProps={{
        composeHref: (item) => `/my-ads/${item.id}`,
        items: myAds,
      }}
      createAdHref="/my-ads/create"
    />
  );
}

export default ClientContainer;
