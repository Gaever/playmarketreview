import { QUERY_KEY_MY_ADS } from "@/lib/consts";
import { formatGetWare } from "@/lib/formatters/wares";
import getQueryClient from "@/lib/get-query-client";
import { http } from "@/lib/http";
import { getServersideAuth } from "@/lib/services/auth/get-serverside-auth";

export async function prefetchMyAd(props: { adId: string }) {
  const { token } = await getServersideAuth();

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEY_MY_ADS, props.adId],
    queryFn: async () =>
      token && props.adId ? formatGetWare((await http.wares.getMyWare({ wareId: props.adId }))?.data) : null,
  });
}
