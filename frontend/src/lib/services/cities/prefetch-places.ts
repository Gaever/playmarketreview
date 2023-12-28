import { QUERY_KEY_PLACES } from "@/lib/consts";
import { formatGetPlaces } from "@/lib/formatters/places";
import getQueryClient from "@/lib/get-query-client";
import { http } from "@/lib/http";

export async function prefetchPlaces() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: [QUERY_KEY_PLACES],
    queryFn: async () => formatGetPlaces(await http.places.getPlaces()),
  });
}
