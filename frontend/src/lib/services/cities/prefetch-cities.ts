import { QUERY_KEY_CITIES } from "@/lib/consts";
import { formatGetCities } from "@/lib/formatters/cities";
import getQueryClient from "@/lib/get-query-client";
import { http } from "@/lib/http";

export async function prefetchCities() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEY_CITIES],
    queryFn: async () => formatGetCities(await http.cities.getCities()),
  });
}
