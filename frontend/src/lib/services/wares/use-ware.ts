"use client";

import { QUERY_KEY_WARE } from "@/lib/consts";
import { formatGetWare } from "@/lib/formatters/wares";
import { http } from "@/lib/http";
import { useMutation, useQuery } from "@tanstack/react-query";
import NProgress from "nprogress";

export function useWare(props: { wareId: string | undefined }) {
  const wareQuery = useQuery({
    queryKey: [QUERY_KEY_WARE, props.wareId],
    enabled: !!props.wareId,
    queryFn: async () => formatGetWare((await http.wares.getWare({ wareId: props.wareId! })).data),
  });

  const claimWareMutation = useMutation(
    async (args: Parameters<typeof http.wares.postWareClaim>[0]) => {
      NProgress.start();
      return http.wares.postWareClaim(args);
    },
    {
      onSettled: () => {
        NProgress.done();
      },
    }
  );

  return {
    wareQuery,
    claimWareMutation,
  };
}
