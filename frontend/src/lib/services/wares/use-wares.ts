"use client";

import { QUERY_KEY_WARES } from "@/lib/consts";
import { formatGetWares } from "@/lib/formatters/wares";
import { http } from "@/lib/http";
import { WareFilters } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import NProgress from "nprogress";

export function useWares(props: { filters: WareFilters; searchStr: string; favoriteIds: Record<string, string> }) {
  const waresInfiniteQuery = useInfiniteQuery({
    keepPreviousData: true,
    queryKey: [QUERY_KEY_WARES, props.filters, props.searchStr],
    queryFn: async ({ pageParam: nextLink }) => {
      NProgress.start();
      try {
        const coords = props.filters?.coordinates
          ? {
              lat: Number(props.filters?.coordinates?.lat).toFixed(7),
              log: Number(props.filters?.coordinates?.lon).toFixed(7),
              accuracy: 0.01,
            }
          : null;
        const data = (
          await http.wares.getWares({
            ...(nextLink
              ? { nextPageUrl: nextLink }
              : {
                  ...(props.filters.categoryIds ? { category_ids: props.filters.categoryIds } : null),
                  ...(props.searchStr ? { name: props.searchStr } : null),
                  // ...(props.filters?.cityId !== undefined ? { city_id: props.filters?.cityId } : null),
                  // ...(props.filters?.placeId !== undefined ? { place_id: props.filters?.placeId } : null),
                  // ...(props.filters?.coordinates && !props.filters.cityId && !props.filters.placeId
                  //   ? { lat: props.filters?.coordinates?.lat, log: props.filters?.coordinates?.lon }
                  //   : null),
                  ...coords,
                  ...(props.filters.priceFrom ? { price_from: props.filters.priceFrom } : null),
                  ...(props.filters.priceTo ? { price_to: props.filters.priceTo } : null),
                }),
          })
        )?.data;
        return data;
      } finally {
        NProgress.done();
      }
    },
    getNextPageParam: (lastPage) => lastPage?.links?.next || undefined,
  });

  const waresList = (waresInfiniteQuery.data?.pages || [])
    .map((item) => formatGetWares(item, { favoriteIds: props.favoriteIds }))
    .flat();

  return {
    waresInfiniteQuery,
    waresList,
  };
}
