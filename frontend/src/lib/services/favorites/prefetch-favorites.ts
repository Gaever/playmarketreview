import { QUERY_KEY_FAVORITES } from "@/lib/consts";
import getQueryClient from "@/lib/get-query-client";
import { http } from "@/lib/http";
import { getServersideAuth } from "@/lib/services/auth/get-serverside-auth";

export async function prefetchFavorites() {
  const { token } = await getServersideAuth();

  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: [QUERY_KEY_FAVORITES],
    queryFn: async () => (token ? (await http.favorites.getFavorites())?.data : null),
  });
}
