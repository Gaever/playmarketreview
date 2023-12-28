"use client";

import { QUERY_KEY_MY_ADS } from "@/lib/consts";
import { formatGetMyWares } from "@/lib/formatters/wares";
import { http } from "@/lib/http";
import { useInfiniteQuery } from "@tanstack/react-query";
import NProgress from "nprogress";

export function useMyAds() {
  const myAdsQuery = useInfiniteQuery({
    keepPreviousData: true,
    queryKey: [QUERY_KEY_MY_ADS],
    queryFn: async ({ pageParam: nextLink }) => {
      NProgress.start();
      try {
        return (await http.wares.getMyCreatedWares({ ...(nextLink ? { nextPageUrl: nextLink } : {}) }))?.data;
      } finally {
        NProgress.done();
      }
    },
  });

  const myAds = (myAdsQuery.data?.pages || [])
    .map(formatGetMyWares)
    .flat()
    ?.filter((item) => item.status && ["draft", "on", "off", "sold"].includes(item.status));

  return {
    myAds,
    myAdsQuery,
  };
}
