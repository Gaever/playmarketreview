import { QUERY_KEY_MY_ADS } from "@/lib/consts";
import getQueryClient from "@/lib/get-query-client";
import { http } from "@/lib/http";
import { getServersideAuth } from "../auth/get-serverside-auth";

export async function prefetchMyAds() {
  const { token } = await getServersideAuth();

  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: [QUERY_KEY_MY_ADS],
    queryFn: async () => (token ? (await http.wares.getMyCreatedWares())?.data : null),
  });
}
