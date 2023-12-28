import { QUERY_KEY_WARES } from "@/lib/consts";
import getQueryClient from "@/lib/get-query-client";
import { http } from "@/lib/http";
import { WareFilters } from "@/types";

export async function prefetchWares() {
  const filters: WareFilters = {};
  const search = "";

  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: [QUERY_KEY_WARES, filters, search],
    queryFn: async () => (await http.wares.getWares())?.data,
  });
}
